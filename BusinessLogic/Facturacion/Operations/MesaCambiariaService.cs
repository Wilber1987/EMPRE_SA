using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using APPCORE;
using APPCORE.Security;
using APPCORE.Services;
using Business;
using DataBaseModel;
using Transactions;

namespace BusinessLogic.Facturacion.Operations
{
    public class MesaCambiariaService
    {
        public static ResponseService GenerarMovimientosCambiariosFacturacion(Business.Security_Users dbUser, Tbl_Factura? factura)
        {
            try
            {
                // ✅ Solo para: factura en USD y cambio entregado en C$
                if (factura?.Moneda != MonedaEnum.CORDOBAS
                && factura?.Is_cambio_cordobas == true)
                {
                    // 👇 Opción simple y segura (usa fecha + milisegundos + ID factura)
                    string secuencia = "FACT-" + factura.Id_Factura.GetValueOrDefault().ToString("D9"); // o usa un contador global
                    MonedaEnum? moneda = factura?.Moneda;
                    // 2. Determinar cuánto USD se "compra" al cliente (excedente pagado)
                    // Suponemos que el cliente pagó en USD un monto mayor al valor de la factura
                    decimal montoFacturaUSD = factura?.Total ?? 0;
                    decimal montoPagadoUSD = factura?.Monto_dolares ?? 0;
                    (bool flowControl, ResponseService value) = GenerarMovimientosCambiarios(
                        dbUser,
                        secuencia,
                        moneda.GetValueOrDefault(),
                        montoFacturaUSD,
                        montoPagadoUSD,
                        factura?.Is_withMesaCambiaria
                    );
                    if (!flowControl)
                    {
                        return value;
                    }
                }
                return new ResponseService(200, "Mesa Creada con exito");
            }
            catch (System.Exception ex)
            {

                return new ResponseService(500, "Error, creando mesa Mesa", ex);
            }

        }

        public static ResponseService GenerarMovimientosCambiariosrecibos(Business.Security_Users dbUser, RecibosServices? recibo)
        {
            try
            {
                // ✅ Solo para: factura en USD y cambio entregado en C$
                if (recibo?.moneda != MonedaEnum.CORDOBAS && recibo?.Is_cambio_cordobas == true)
                {
                    // 👇 Opción simple y segura (usa fecha + milisegundos + ID factura)
                    string secuencia = "FACT-" + recibo.id_recibo.GetValueOrDefault().ToString("D9"); // o usa un contador global
                    MonedaEnum? moneda = recibo?.moneda;
                    // 2. Determinar cuánto USD se "compra" al cliente (excedente pagado)
                    // Suponemos que el cliente pagó en USD un monto mayor al valor de la factura
                    decimal montoFacturaUSD = recibo?.total_apagar_dolares ?? 0;
                    decimal montoPagadoUSD = recibo?.monto_dolares ?? 0;
                    (bool flowControl, ResponseService value) = GenerarMovimientosCambiarios(
                        dbUser,
                        secuencia,
                        moneda.GetValueOrDefault(),
                        montoFacturaUSD,
                        montoPagadoUSD,
                        recibo?.Is_withMesaCambiaria
                    );
                    if (!flowControl)
                    {
                        return value;
                    }
                }
                return new ResponseService(200, "Mesa Creada con exito");
            }
            catch (System.Exception ex)
            {

                return new ResponseService(500, "Error, creando mesa Mesa", ex);
            }

        }



        private static (bool flowControl, ResponseService value) GenerarMovimientosCambiarios(Business.Security_Users dbUser,
            string secuencia,
            MonedaEnum? moneda,
            decimal montoFacturaUSD,
            decimal montoPagadoUSD,
            bool? is_withMesaCambiaria)
        {
            // 1. Obtener tasas vigentes (usa la fecha de la factura o NOW)
            var divisa = new Catalogo_Cambio_Divisa().GetDivisa(MonedaEnum.DOLARES);
            if (divisa == null || divisa.Valor_de_compra <= 0)
                return (flowControl: false, value: new ResponseService { status = 400, message = "Tasa de compra no disponible" });
            decimal tasaCompra = divisa.Valor_de_compra!.Value;
            decimal tasaVenta = divisa.Valor_de_compra!.Value;

            // Mejor aún: combinar con ticks o random corto
            string fechaStr = DateTime.Now.ToString("yyyyMMdd");
            string randomPart = (DateTime.Now.Ticks % 1000).ToString("000");
            string referenciaCambiaria = $"CAMB-{fechaStr}-({secuencia})-{randomPart}";

            if (montoPagadoUSD < montoFacturaUSD)
                return (flowControl: false, value: new ResponseService { status = 400, message = "Monto pagado insuficiente para dar cambio" });

            decimal excedenteUSD = montoPagadoUSD - montoFacturaUSD;

            // Si no hay excedente, no hay operación cambiaria
            if (excedenteUSD <= 0.001m) // tolerancia para redondeo
                return (flowControl: false, value: new ResponseService { status = 200, message = "No hay operación cambiaria" });

            // 3. Calcular monto en C$ entregado como cambio
            decimal cambioEnCordobas = excedenteUSD * (is_withMesaCambiaria.GetValueOrDefault() ? tasaCompra : tasaVenta);
            decimal valorRealDolares = excedenteUSD * tasaVenta;

            decimal beneficio = valorRealDolares - cambioEnCordobas;

            // 4. Definir cuentas para operaciones cambiarias (⚠️ clave: cuentas específicas)
            //     Puedes parametrizar o reutilizar, pero idealmente tener:
            //     - Cuenta "Caja USD"   → donde ingresan los USD comprados
            //     - Cuenta "Caja C$"    → de donde salen los C$ entregados
            //     Si no existen, puedes usar las mismas cuentas actuales, pero con distinto concepto.

            var cuentaCajaUSD = Catalogo_Cuentas.GetCuentaCajaDolares(dbUser);   // ← DEBES IMPLEMENTAR
            var cuentaCajaCordobas = Catalogo_Cuentas.GetCuentaCajaCordobas(dbUser); // ← DEBES IMPLEMENTAR

            var cuentaIngresoCompraUSD = Catalogo_Cuentas.GetCuentaIngresoCompraDolares(dbUser);   // ← DEBES IMPLEMENTAR

            if (cuentaCajaUSD == null || cuentaCajaCordobas == null)
                return (flowControl: false, value: new ResponseService { status = 400, message = "Cuentas de caja cambiaria no configuradas" });

            string conceptoBase = $"Mesa cambiaria - {referenciaCambiaria}";

            // ✅ Movimiento A: COMPRA de USD → ingresan USD a caja USD
            var responseCompra = new Movimientos_Cuentas
            {
                Catalogo_Cuentas_Origen = cuentaIngresoCompraUSD, // (opcional: puede ser una cuenta "neutra", o caja C$ ya que se entrega C$)
                Catalogo_Cuentas_Destino = cuentaCajaUSD,
                concepto = "Compra de USD (cambio)", // tipo de operación cambiaria
                descripcion = $"{conceptoBase} - Compra de {excedenteUSD:F2} USD a tasa de cambio C$ {tasaCompra:F2}",
                moneda = moneda ?? MonedaEnum.DOLARES,
                monto = excedenteUSD,
                tasa_cambio = tasaCompra,
                is_transaction = true,
                Tipo_Movimiento = TipoMovimiento.COMPRA_DE_MONEDA
            }.SaveMovimiento(dbUser); // ignorar error? o acumular
            if (responseCompra.status != 200)
            {
                return (false, responseCompra);
            }

            // ✅ Movimiento B: VENTA de C$ → salen C$ de caja C$
            var responseVenta = new Movimientos_Cuentas
            {
                Catalogo_Cuentas_Origen = cuentaCajaCordobas,
                Catalogo_Cuentas_Destino = cuentaIngresoCompraUSD, // o cuenta "cliente virtual", pero mejor usar cuentas reales
                concepto = "Venta de C$ (cambio)",
                descripcion = $"{conceptoBase} - Entrega de cambio: {cambioEnCordobas:F2} C$ por {excedenteUSD:F2} USD",
                moneda = MonedaEnum.CORDOBAS,
                monto = cambioEnCordobas,
                tasa_cambio = tasaCompra,
                is_transaction = true,
                Tipo_Movimiento = TipoMovimiento.VENTA_DE_MONEDA
            }.SaveMovimiento(dbUser);
            if (responseVenta.status != 200)
            {
                return (false, responseVenta);
            }

            if (beneficio > 0)
            {
                var cuentaIngresoBeneficios = Catalogo_Cuentas.GetCuentaIngresoBeneficios(dbUser);   // ← DEBES IMPLEMENTAR
                // ✅ Movimiento B: VENTA de C$ → salen C$ de caja C$
                var responseBeneficioVenta = new Movimientos_Cuentas
                {
                    Catalogo_Cuentas_Origen = cuentaCajaCordobas,
                    Catalogo_Cuentas_Destino = cuentaIngresoBeneficios, // o cuenta "cliente virtual", pero mejor usar cuentas reales
                    concepto = "Venta de C$ (cambio)",
                    descripcion = $"{conceptoBase} - Entrega de cambio: {cambioEnCordobas:F2} C$ por {excedenteUSD:F2} USD",
                    moneda = MonedaEnum.CORDOBAS,
                    monto = cambioEnCordobas,
                    tasa_cambio = tasaCompra,
                    is_transaction = true,
                    Tipo_Movimiento = TipoMovimiento.BENEFICIO_VENTA_DE_MONEDA
                }.SaveMovimiento(dbUser);
            }
            return (flowControl: true, value: new ResponseService(200, "movimientos cambiarios ejecutados"));
        }


        public static ResponseService ProcesarCambioEnOrden(
            Business.Security_Users dbUser,
            Orden_Movimiento order)
        {
            try
            {
                var divisa = new Catalogo_Cambio_Divisa()
                    .GetDivisa(MonedaEnum.DOLARES);


                // ============================================================
                // 1. VALIDAR SI LA ORDEN REQUIERE OPERACIÓN CAMBIARIA
                // ============================================================

                if (order.tipo_operacion_cambio == null ||
                    order.tipo_operacion_cambio == TipoOperacionEnum.NONE)
                {
                    return new ResponseService(
                        400,
                        "No requiere operación de cambio");
                }
                // ============================================================
                // 2. OBTENER TASAS VIGENTES DEL SISTEMA
                // ============================================================

                if (divisa == null ||
                    divisa.Valor_de_compra <= 0)
                {
                    return new ResponseService(
                        400,
                        "Tasa de cambio no disponible");
                }

                decimal tasaCompraSistema = divisa.Valor_de_compra!.Value;

                decimal tasaVentaSistema = divisa.Valor_de_venta > 0
                        ? divisa.Valor_de_venta.Value
                        : tasaCompraSistema;

                decimal tasaReferencia = tasaVentaSistema;

                // ============================================================
                // 3. DETERMINAR DIRECCIÓN
                //
                // INGRESO:
                //      Cliente necesita USD
                //      Agencia VENDE USD
                //
                // EGRESO:
                //      Agencia necesita USD
                //      Agencia COMPRA USD
                // ============================================================

                bool isIngreso = order.direccion == DirectionEnum.INGRESO;

                bool isCompra = order.direccion == DirectionEnum.MIXED && order.moneda == MonedaEnum.DOLARES;

                // ============================================================
                // 4. TASA APLICADA
                //
                // La tasa enviada por el front tiene prioridad porque
                // representa la tasa realmente pactada con el cliente.
                //
                // Si no viene:
                //      INGRESO -> tasa de venta
                //      EGRESO  -> tasa de compra
                // ============================================================

                decimal tasaAplicada = isIngreso
                            ? tasaVentaSistema : tasaCompraSistema;
                if (tasaAplicada <= 0)
                {
                    return new ResponseService(
                        400,
                        "La tasa de cambio aplicada debe ser mayor que cero");
                }

                // ============================================================
                // 5. OBTENER MONTOS DE LA MESA
                // ============================================================

                decimal montoUsdCambiado = order.monto_cambio_usd ?? 0m;

                decimal montoNioCambiado = order.monto_cambio_nio ?? 0m;

                // Una operación cambiaria necesita ambos valores.
                if (montoUsdCambiado <= 0 ||
                    montoNioCambiado <= 0)
                {
                    return new ResponseService(
                        400,
                        "Los montos USD y C$ deben ser mayores que cero");
                }

                // ============================================================
                // 6. VALIDAR EQUIVALENCIA DE LA OPERACIÓN
                //
                // Ejemplo:
                //
                // USD 50 × 37.00 = C$1,850
                //
                // Se permite una pequeña diferencia por redondeo.
                // ============================================================

                decimal montoNioEsperado = Math.Round(
                        montoUsdCambiado * tasaAplicada,
                        2,
                        MidpointRounding.AwayFromZero);

                decimal diferenciaTasa = Math.Abs(
                        montoNioCambiado - montoNioEsperado);

                const decimal toleranciaCambio = 0.01m;

                if (diferenciaTasa > toleranciaCambio)
                {
                    return new ResponseService(
                        400,
                        $"Los montos de cambio no corresponden a la tasa aplicada. " +
                        $"USD: {montoUsdCambiado:F2}, " +
                        $"C$: {montoNioCambiado:F2}, " +
                        $"Tasa: {tasaAplicada:F4}, " +
                        $"C$ esperado: {montoNioEsperado:F2}");
                }


                // ============================================================
                // 7. OBTENER CUENTAS
                // ============================================================

                string referencia = $"CAMB-ORD-{order.id_orden}-{DateTime.Now:yyyyMMddHHmmssfff}";

                string conceptoBase = $"Mesa cambiaria - Orden #{order.id_orden} - {referencia}";


                var cuentaCajaUSD = Catalogo_Cuentas.GetCuentaCajaDolares(dbUser);

                var cuentaCajaCordobas = Catalogo_Cuentas.GetCuentaCajaCordobas(dbUser);

                var cuentaPuenteCambiario = Catalogo_Cuentas.GetCuentaIngresoCompraDolares(dbUser);


                if (cuentaCajaUSD == null ||
                    cuentaCajaCordobas == null ||
                    cuentaPuenteCambiario == null)
                {
                    return new ResponseService(
                        400,
                        "Cuentas de caja cambiaria no configuradas");
                }


                // ============================================================
                // 8. CALCULAR RESULTADO CAMBIARIO
                //
                // IMPORTANTE:
                //
                // Este resultado representa el margen de la operación
                // contra la tasa de referencia definida por el sistema.
                //
                // INGRESO / VENTA:
                //
                //      C$ recibido
                //      -
                //      valor USD a referencia
                //
                // EGRESO / COMPRA:
                //
                //      valor USD a referencia
                //      -
                //      C$ entregado
                //
                // ============================================================

                decimal valorReferenciaUSD = Math.Round(
                        montoUsdCambiado * tasaReferencia,
                        2,
                        MidpointRounding.AwayFromZero);

                decimal resultadoCambio = isIngreso
                        ? montoNioCambiado - valorReferenciaUSD
                        : valorReferenciaUSD - montoNioCambiado;


                resultadoCambio = Math.Round(
                        resultadoCambio,
                        2,
                        MidpointRounding.AwayFromZero);


                // ============================================================
                // 9. INGRESO
                //
                // La agencia VENDE USD.
                //
                // Cliente:
                //      entrega C$
                //      recibe USD
                //
                // Agencia:
                //      C$ entra
                //      USD sale
                // ============================================================

                if (isIngreso || !isCompra)
                {
                    // --------------------------------------------------------
                    // Movimiento de CÓRDOBAS
                    //
                    // Caja C$ recibe el dinero del cliente.
                    // --------------------------------------------------------

                    var movEntradaNIO = new Movimientos_Cuentas
                    {
                        descripcion = $"{conceptoBase} - " + $"Entrada de {montoNioCambiado:F2} C$",
                        concepto = "VENTA_MONEDA_CAMBIO",
                        monto = montoNioCambiado,
                        moneda = MonedaEnum.CORDOBAS,
                        tasa_cambio = tasaAplicada,
                        Catalogo_Cuentas_Origen = cuentaPuenteCambiario,
                        Catalogo_Cuentas_Destino = cuentaCajaCordobas,
                        Tipo_Movimiento = TipoMovimiento.VENTA_DE_MONEDA,
                        is_transaction = true
                    };

                    // Denominaciones C$ que ingresan físicamente
                    foreach (var denom in order.DenominationsCambioNIO ?? [])
                    {
                        denom.tipo_operacion = DirectionEnum.INGRESO;

                        movEntradaNIO.Denominaciones.Add(denom);
                    }
                    var responseEntradaNIO = movEntradaNIO.SaveMovimiento(dbUser);

                    if (responseEntradaNIO.status != 200)
                        return responseEntradaNIO;


                    // --------------------------------------------------------
                    // Movimiento de DÓLARES
                    //
                    // Caja USD entrega los dólares al cliente.
                    // --------------------------------------------------------

                    var movSalidaUSD = new Movimientos_Cuentas
                    {
                        descripcion = $"{conceptoBase} - " + $"Salida de {montoUsdCambiado:F2} USD",
                        concepto = "VENTA_MONEDA_CAMBIO",
                        monto = montoUsdCambiado,
                        moneda = MonedaEnum.DOLARES,
                        tasa_cambio = tasaAplicada,
                        Catalogo_Cuentas_Origen = cuentaCajaUSD,
                        Catalogo_Cuentas_Destino = cuentaPuenteCambiario,
                        Tipo_Movimiento = TipoMovimiento.VENTA_DE_MONEDA,
                        is_transaction = true
                    };


                    // Denominaciones USD que salen físicamente
                    foreach (var denom in order.DenominationsCambioUSD ?? [])
                    {
                        denom.tipo_operacion = DirectionEnum.EGRESO;

                        movSalidaUSD.Denominaciones.Add(denom);
                    }


                    var responseSalidaUSD = movSalidaUSD.SaveMovimiento(dbUser);

                    if (responseSalidaUSD.status != 200)
                        return responseSalidaUSD;
                }

                // ============================================================
                // 10. EGRESO
                //
                // La agencia COMPRA USD.
                //
                // Cliente:
                //      entrega USD
                //      recibe C$
                //
                // Agencia:
                //      USD entra
                //      C$ sale
                // ============================================================

                else
                {
                    // --------------------------------------------------------
                    // Movimiento de DÓLARES
                    //
                    // USD entra a caja.
                    // --------------------------------------------------------

                    var movEntradaUSD = new Movimientos_Cuentas
                    {
                        descripcion = $"{conceptoBase} - " + $"Entrada de {montoUsdCambiado:F2} USD",
                        concepto = "COMPRA_MONEDA_CAMBIO",
                        monto = montoUsdCambiado,
                        moneda = MonedaEnum.DOLARES,
                        tasa_cambio = tasaAplicada,
                        Catalogo_Cuentas_Origen = cuentaPuenteCambiario,
                        Catalogo_Cuentas_Destino = cuentaCajaUSD,
                        Tipo_Movimiento = TipoMovimiento.COMPRA_DE_MONEDA,
                        is_transaction = true
                    };


                    // Denominaciones USD que entran físicamente                    
                    foreach (var denom in order.DenominationsCambioUSD ?? [])
                    {
                        denom.tipo_operacion = DirectionEnum.INGRESO;

                        movEntradaUSD.Denominaciones.Add(denom);
                    }


                    var responseEntradaUSD = movEntradaUSD.SaveMovimiento(dbUser);

                    if (responseEntradaUSD.status != 200)
                        return responseEntradaUSD;


                    // --------------------------------------------------------
                    // Movimiento de CÓRDOBAS
                    //
                    // Caja C$ entrega el dinero al cliente.
                    // --------------------------------------------------------

                    var movSalidaNIO = new Movimientos_Cuentas
                    {
                        descripcion = $"{conceptoBase} - " + $"Salida de {montoNioCambiado:F2} C$",
                        concepto = "COMPRA_MONEDA_CAMBIO",
                        monto = montoNioCambiado,
                        moneda = MonedaEnum.CORDOBAS,
                        tasa_cambio = tasaAplicada,
                        Catalogo_Cuentas_Origen = cuentaCajaCordobas,
                        Catalogo_Cuentas_Destino = cuentaPuenteCambiario,
                        Tipo_Movimiento = TipoMovimiento.COMPRA_DE_MONEDA,
                        is_transaction = true
                    };


                    // Denominaciones C$ que salen físicamente
                    foreach (var denom in order.DenominationsCambioNIO ?? [])
                    {
                        denom.tipo_operacion = DirectionEnum.EGRESO;
                        movSalidaNIO.Denominaciones.Add(denom);
                    }
                    var responseSalidaNIO = movSalidaNIO.SaveMovimiento(dbUser);

                    if (responseSalidaNIO.status != 200)
                        return responseSalidaNIO;
                }


                // ============================================================
                // 11. REGISTRAR RESULTADO CAMBIARIO
                //
                // El resultado se mantiene separado de la operación
                // principal y se registra como ingreso/pérdida cambiaria.
                // ============================================================
                if (Math.Abs(resultadoCambio) > 0.01m)
                {
                    var cuentaIngresoBeneficios = Catalogo_Cuentas.GetCuentaIngresoBeneficios(dbUser);

                    if (cuentaIngresoBeneficios == null)
                    {
                        return new ResponseService(
                            400,
                            "La cuenta de ingresos por beneficio cambiario " +
                            "no está configurada");
                    }

                    bool esBeneficio = resultadoCambio > 0;
                    var movResultadoCambio = new Movimientos_Cuentas
                    {
                        descripcion = $"{conceptoBase} - " + $"{GetDescripcionBeneficio(resultadoCambio, isIngreso, tasaReferencia, tasaAplicada)}",
                        concepto = esBeneficio ? "BENEFICIO_CAMBIO" : "PERDIDA_CAMBIO",
                        monto = Math.Abs(resultadoCambio),
                        moneda = MonedaEnum.CORDOBAS,
                        Catalogo_Cuentas_Origen = esBeneficio ? cuentaPuenteCambiario : cuentaIngresoBeneficios,
                        Catalogo_Cuentas_Destino = esBeneficio ? cuentaIngresoBeneficios : cuentaPuenteCambiario,
                        Tipo_Movimiento = esBeneficio ? TipoMovimiento.BENEFICIO_VENTA_DE_MONEDA : TipoMovimiento.PERDIDA_COMPRA_DE_MONEDA,
                        is_transaction = false
                    };
                    var responseResultado = movResultadoCambio.SaveMovimiento(dbUser);

                    if (responseResultado.status != 200)
                        return responseResultado;
                }
                // ============================================================
                // 12. FINALIZAR
                // ============================================================

                return new ResponseService(
                    200,
                    "Operación cambiaria ejecutada con éxito");
            }
            catch (Exception ex)
            {
                return new ResponseService(
                    500,
                    "Error procesando cambio: " + ex.Message);
            }
        }

        private static string GetDescripcionBeneficio(decimal beneficio, bool isIngreso, decimal tasaReferencia, decimal tasaAplicada)
        {
            string tipo = beneficio > 0 ? "Beneficio" : "Pérdida";
            string operacion = isIngreso ? "venta" : "compra";
            return $"{tipo} por diferencial cambiario en {operacion}: tasa referencia {tasaReferencia} vs aplicada {tasaAplicada}";
        }

        public static ResponseService ProcesarVueltoEnOrden(
    Business.Security_Users dbUser,
    Orden_Movimiento order)
        {
            try
            {
                // Solo procesar si hay vuelto
                if (string.IsNullOrEmpty(order.tipo_vuelto) || order.tipo_vuelto == "NONE")
                {
                    return new ResponseService(200, "No hay vuelto que procesar");
                }

                var divisa = new Catalogo_Cambio_Divisa().GetDivisa(MonedaEnum.DOLARES);
                if (divisa == null || divisa.Valor_de_compra <= 0)
                {
                    return new ResponseService(400, "Tasa de cambio no disponible");
                }

                decimal tasaCompraSistema = divisa.Valor_de_compra!.Value;
                decimal tasaVentaSistema = divisa.Valor_de_venta > 0
                        ? divisa.Valor_de_venta.Value
                        : tasaCompraSistema;

                string referencia = $"VUELTO-ORD-{order.id_orden}-{DateTime.Now:yyyyMMddHHmmssfff}";
                string conceptoBase = $"Vuelto de orden #{order.id_orden} - {referencia}";

                var cuentaCajaUSD = Catalogo_Cuentas.GetCuentaCajaDolares(dbUser);
                var cuentaCajaCordobas = Catalogo_Cuentas.GetCuentaCajaCordobas(dbUser);
                var cuentaPuenteCambiario = Catalogo_Cuentas.GetCuentaIngresoCompraDolares(dbUser);

                if (cuentaCajaUSD == null || cuentaCajaCordobas == null)
                {
                    return new ResponseService(400, "Cuentas de caja no configuradas");
                }

                decimal montoVueltoUSD = order.monto_vuelto_usd ?? 0;
                decimal montoVueltoNIO = order.monto_vuelto_nio ?? 0;

                // CASO 1: Orden USD + Vuelto NIO (la caja COMPRA USD y VENDE NIO)
                if (order.moneda == MonedaEnum.DOLARES && order.tipo_vuelto == "NIO")
                {
                    // Movimiento de USD: entran a caja (la caja "compra" el exceso)
                    var movEntradaUSD = new Movimientos_Cuentas
                    {
                        descripcion = $"{conceptoBase} - Entrada de exceso ${montoVueltoUSD:F2} USD",
                        concepto = "COMPRA_MONEDA_VUELTO",
                        monto = montoVueltoUSD,
                        moneda = MonedaEnum.DOLARES,
                        tasa_cambio = tasaCompraSistema,
                        Catalogo_Cuentas_Origen = cuentaPuenteCambiario,
                        Catalogo_Cuentas_Destino = cuentaCajaUSD,
                        Tipo_Movimiento = TipoMovimiento.COMPRA_DE_MONEDA,
                        is_transaction = true
                    };

                    foreach (var denom in order.DenominationsVueltoUSD ?? new List<Denominacion_Movimiento>())
                    {
                        denom.tipo_operacion = DirectionEnum.INGRESO;
                        movEntradaUSD.Denominaciones.Add(denom);
                    }

                    var responseEntradaUSD = movEntradaUSD.SaveMovimiento(dbUser);
                    if (responseEntradaUSD.status != 200)
                        return responseEntradaUSD;

                    // Movimiento de NIO: salen de caja (la caja "vende" el vuelto)
                    var movSalidaNIO = new Movimientos_Cuentas
                    {
                        descripcion = $"{conceptoBase} - Vuelto entregado C${montoVueltoNIO:F2}",
                        concepto = "VENTA_MONEDA_VUELTO",
                        monto = montoVueltoNIO,
                        moneda = MonedaEnum.CORDOBAS,
                        tasa_cambio = tasaCompraSistema,
                        Catalogo_Cuentas_Origen = cuentaCajaCordobas,
                        Catalogo_Cuentas_Destino = cuentaPuenteCambiario,
                        Tipo_Movimiento = TipoMovimiento.VENTA_DE_MONEDA,
                        is_transaction = true
                    };

                    foreach (var denom in order.DenominationsVueltoNIO ?? new List<Denominacion_Movimiento>())
                    {
                        denom.tipo_operacion = DirectionEnum.EGRESO;
                        movSalidaNIO.Denominaciones.Add(denom);
                    }

                    var responseSalidaNIO = movSalidaNIO.SaveMovimiento(dbUser);
                    if (responseSalidaNIO.status != 200)
                        return responseSalidaNIO;

                    // Registrar beneficio/pérdida cambiaria
                    decimal valorReferenciaUSD = montoVueltoUSD * tasaVentaSistema;
                    decimal resultadoCambio = montoVueltoNIO - valorReferenciaUSD;

                    if (Math.Abs(resultadoCambio) > 0.01m)
                    {
                        var cuentaIngresoBeneficios = Catalogo_Cuentas.GetCuentaIngresoBeneficios(dbUser);
                        if (cuentaIngresoBeneficios != null)
                        {
                            bool esBeneficio = resultadoCambio > 0;
                            var movResultado = new Movimientos_Cuentas
                            {
                                descripcion = $"{conceptoBase} - {(esBeneficio ? "Beneficio" : "Pérdida")} por vuelto cambiario",
                                concepto = esBeneficio ? "BENEFICIO_VUELTO" : "PERDIDA_VUELTO",
                                monto = Math.Abs(resultadoCambio),
                                moneda = MonedaEnum.CORDOBAS,
                                Catalogo_Cuentas_Origen = esBeneficio ? cuentaPuenteCambiario : cuentaIngresoBeneficios,
                                Catalogo_Cuentas_Destino = esBeneficio ? cuentaIngresoBeneficios : cuentaPuenteCambiario,
                                Tipo_Movimiento = esBeneficio ? TipoMovimiento.BENEFICIO_VENTA_DE_MONEDA : TipoMovimiento.PERDIDA_COMPRA_DE_MONEDA,
                                is_transaction = false
                            };
                            var responseResultado = movResultado.SaveMovimiento(dbUser);
                            if (responseResultado.status != 200)
                                return responseResultado;
                        }
                    }
                }
                // CASO 2: Orden NIO + Vuelto USD (la caja VENDE USD y COMPRA NIO)
                else if (order.moneda == MonedaEnum.CORDOBAS && order.tipo_vuelto == "USD")
                {
                    // Movimiento de NIO: entran a caja (la caja "compra" el exceso)
                    var movEntradaNIO = new Movimientos_Cuentas
                    {
                        descripcion = $"{conceptoBase} - Entrada de exceso C${montoVueltoNIO:F2}",
                        concepto = "COMPRA_MONEDA_VUELTO",
                        monto = montoVueltoNIO,
                        moneda = MonedaEnum.CORDOBAS,
                        tasa_cambio = tasaVentaSistema,
                        Catalogo_Cuentas_Origen = cuentaPuenteCambiario,
                        Catalogo_Cuentas_Destino = cuentaCajaCordobas,
                        Tipo_Movimiento = TipoMovimiento.COMPRA_DE_MONEDA,
                        is_transaction = true
                    };

                    foreach (var denom in order.DenominationsVueltoNIO ?? new List<Denominacion_Movimiento>())
                    {
                        denom.tipo_operacion = DirectionEnum.INGRESO;
                        movEntradaNIO.Denominaciones.Add(denom);
                    }

                    var responseEntradaNIO = movEntradaNIO.SaveMovimiento(dbUser);
                    if (responseEntradaNIO.status != 200)
                        return responseEntradaNIO;

                    // Movimiento de USD: salen de caja (la caja "vende" el vuelto)
                    var movSalidaUSD = new Movimientos_Cuentas
                    {
                        descripcion = $"{conceptoBase} - Vuelto entregado ${montoVueltoUSD:F2}",
                        concepto = "VENTA_MONEDA_VUELTO",
                        monto = montoVueltoUSD,
                        moneda = MonedaEnum.DOLARES,
                        tasa_cambio = tasaVentaSistema,
                        Catalogo_Cuentas_Origen = cuentaCajaUSD,
                        Catalogo_Cuentas_Destino = cuentaPuenteCambiario,
                        Tipo_Movimiento = TipoMovimiento.VENTA_DE_MONEDA,
                        is_transaction = true
                    };

                    foreach (var denom in order.DenominationsVueltoUSD ?? new List<Denominacion_Movimiento>())
                    {
                        denom.tipo_operacion = DirectionEnum.EGRESO;
                        movSalidaUSD.Denominaciones.Add(denom);
                    }

                    var responseSalidaUSD = movSalidaUSD.SaveMovimiento(dbUser);
                    if (responseSalidaUSD.status != 200)
                        return responseSalidaUSD;

                    // Registrar beneficio/pérdida cambiaria
                    decimal valorReferenciaUSD = montoVueltoUSD * tasaVentaSistema;
                    decimal resultadoCambio = valorReferenciaUSD - montoVueltoNIO;

                    if (Math.Abs(resultadoCambio) > 0.01m)
                    {
                        var cuentaIngresoBeneficios = Catalogo_Cuentas.GetCuentaIngresoBeneficios(dbUser);
                        if (cuentaIngresoBeneficios != null)
                        {
                            bool esBeneficio = resultadoCambio > 0;
                            var movResultado = new Movimientos_Cuentas
                            {
                                descripcion = $"{conceptoBase} - {(esBeneficio ? "Beneficio" : "Pérdida")} por vuelto cambiario",
                                concepto = esBeneficio ? "BENEFICIO_VUELTO" : "PERDIDA_VUELTO",
                                monto = Math.Abs(resultadoCambio),
                                moneda = MonedaEnum.CORDOBAS,
                                Catalogo_Cuentas_Origen = esBeneficio ? cuentaPuenteCambiario : cuentaIngresoBeneficios,
                                Catalogo_Cuentas_Destino = esBeneficio ? cuentaIngresoBeneficios : cuentaPuenteCambiario,
                                Tipo_Movimiento = esBeneficio ? TipoMovimiento.BENEFICIO_VENTA_DE_MONEDA : TipoMovimiento.PERDIDA_COMPRA_DE_MONEDA,
                                is_transaction = false
                            };
                            var responseResultado = movResultado.SaveMovimiento(dbUser);
                            if (responseResultado.status != 200)
                                return responseResultado;
                        }
                    }
                }
                // CASO 3: Vuelto en la misma moneda (solo egreso de caja)
                else
                {
                    var monedaVuelto = order.moneda;
                    var montoVuelto = monedaVuelto == MonedaEnum.DOLARES ? montoVueltoUSD : montoVueltoNIO;
                    var cuentaCaja = monedaVuelto == MonedaEnum.DOLARES ? cuentaCajaUSD : cuentaCajaCordobas;
                    var denominaciones = monedaVuelto == MonedaEnum.DOLARES
                        ? order.DenominationsVueltoUSD
                        : order.DenominationsVueltoNIO;

                    /**
                    se generan dos movimientos uno de entrada y uno de salida para mantener la equivalencia,
                    aca lo importante es el de salida dado que hay que actualizar las denominaciones, su valor 
                    equivalente de denominaciones de entrada se registran en la transaccion anterior, por lo que 
                    el movimiento de entra en este caso no lleva denominaciones, solo el valor de actualizacion
                    del monto de la cuenta. AMBOS SE OCULTAN PARA QUE NO APARZCAN EN LOS RESUMENES DE TRANSACCIONES
                    */
                    if (montoVuelto > 0)
                    {
                        var movSalida = new Movimientos_Cuentas
                        {
                            descripcion = $"{conceptoBase} - Vuelto entregado {monedaVuelto}",
                            concepto = "VUELTO_SIMPLE_EQUIVALENCIA_SALIDA",
                            monto = montoVuelto,
                            moneda = monedaVuelto,
                            Catalogo_Cuentas_Origen = cuentaCaja,
                            Catalogo_Cuentas_Destino = cuentaPuenteCambiario,
                            Tipo_Movimiento = TipoMovimiento.EGRESO,
                            is_transaction = true,
                            is_hidden = true
                        };

                        var movIngreso = new Movimientos_Cuentas
                        {
                            descripcion = $"{conceptoBase} - Vuelto entregado {monedaVuelto}",
                            concepto = "VUELTO_SIMPLE_EQUIVALENCIA_INGRESO",
                            monto = montoVuelto,
                            moneda = monedaVuelto,
                            Catalogo_Cuentas_Origen = cuentaCaja,
                            Catalogo_Cuentas_Destino = cuentaPuenteCambiario,
                            Tipo_Movimiento = TipoMovimiento.INGRESO,
                            is_transaction = true,
                            is_hidden = true
                        };

                        foreach (var denom in denominaciones ?? new List<Denominacion_Movimiento>())
                        {
                            denom.tipo_operacion = DirectionEnum.EGRESO;
                            movSalida.Denominaciones.Add(denom);
                        }

                        var responseSalida = movSalida.SaveMovimiento(dbUser);
                        var responseEntrada = movIngreso.SaveMovimiento(dbUser);
                        if (responseSalida.status != 200)
                            return responseSalida;
                    }


                }

                return new ResponseService(200, "Vuelto procesado correctamente");
            }
            catch (Exception ex)
            {
                return new ResponseService(500, "Error procesando vuelto: " + ex.Message);
            }
        }
    }

}