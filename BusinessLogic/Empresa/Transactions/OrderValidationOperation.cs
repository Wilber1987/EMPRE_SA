using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using APPCORE;
using Business;
using Transactions;

namespace BusinessLogic.Empresa.Transactions
{
    public class OrderValidationOperation
    {
        /// <summary>
        /// Valida que las denominaciones enviadas por el frontend cubran los montos de la orden
        /// según el tipo de operación (pago simple, mixto, cambio de moneda).
        /// Esta validación es agnóstica a la capa de contabilidad.
        /// </summary>
        public static ResponseService ValidarDenominacionesDeOrden(Orden_Movimiento order)
        {
            // ============================================================
            // OBTENER TASAS VIGENTES DEL SISTEMA
            // ============================================================
            bool isIngreso = order.direccion == DirectionEnum.INGRESO;

            var divisa = new Catalogo_Cambio_Divisa().GetDivisa(MonedaEnum.DOLARES);
            if (divisa == null || divisa.Valor_de_compra <= 0)
            {
                return new ResponseService(400, "Tasa de cambio no disponible");
            }

            decimal tasaCompraSistema = divisa.Valor_de_compra!.Value;
            decimal tasaVentaSistema = divisa.Valor_de_venta > 0
                    ? divisa.Valor_de_venta.Value
                    : tasaCompraSistema;

            decimal tasaAplicada = isIngreso ? tasaVentaSistema : tasaCompraSistema;
            if (tasaAplicada <= 0)
            {
                return new ResponseService(400, "La tasa de cambio aplicada debe ser mayor que cero");
            }

            // 1. Calcular totales de las denominaciones enviadas por el cajero
            decimal totalPagoUSD = CalcularTotalDenominaciones(order.DenominationsUSD);
            decimal totalPagoNIO = CalcularTotalDenominaciones(order.DenominationsNIO);
            decimal totalCambioUSD = CalcularTotalDenominaciones(order.DenominationsCambioUSD);
            decimal totalCambioNIO = CalcularTotalDenominaciones(order.DenominationsCambioNIO);

            // NUEVO: Calcular totales de vuelto
            decimal totalVueltoUSD = CalcularTotalDenominaciones(order.DenominationsVueltoUSD);
            decimal totalVueltoNIO = CalcularTotalDenominaciones(order.DenominationsVueltoNIO);

            // ============================================================
            // VALIDAR VUELTO CUANDO HAY EXCESO DE PAGO
            // ============================================================

            decimal monto = order.monto.GetValueOrDefault();
            if (order.Orden_Related != null)
            {
                var direccionO = order.direccion;
                var directionRelated = order.Orden_Related.direccion;
                if (direccionO.Equals(DirectionEnum.INGRESO) && directionRelated.Equals(DirectionEnum.EGRESO))
                {
                    monto -= order.Orden_Related.monto.GetValueOrDefault();
                } else if (direccionO.Equals(DirectionEnum.EGRESO) && directionRelated.Equals(DirectionEnum.INGRESO))
                {//TODO REVISAR DESPUES ESTA LOGICA
                    monto -= order.Orden_Related.monto.GetValueOrDefault();
                } else if (direccionO.Equals(directionRelated))
                {
                    monto += order.Orden_Related.monto.GetValueOrDefault();
                }
               
            }

            if (isIngreso)
            {
                // Calcular total pagado en la moneda de la orden
                decimal totalPagadoEnMonedaOrden;
                if (order.moneda == MonedaEnum.DOLARES)
                {
                    totalPagadoEnMonedaOrden = totalPagoUSD + (totalPagoNIO / tasaVentaSistema);
                }
                else
                {
                    totalPagadoEnMonedaOrden = totalPagoNIO + (totalPagoUSD * tasaCompraSistema);
                }

                decimal montoOrden = monto;
                decimal exceso = totalPagadoEnMonedaOrden - montoOrden;

                // Si hay exceso, validar vuelto
                if (exceso > 0.01m)
                {
                    if (order.tipo_vuelto == "USD")
                    {
                        // Vuelto en USD
                        if (order.moneda == MonedaEnum.DOLARES)
                        {
                            // Orden USD + vuelto USD: exceso directo
                            decimal vueltoEsperado = exceso;
                            if (Math.Abs(totalVueltoUSD - vueltoEsperado) > 0.01m)
                            {
                                return new ResponseService(400,
                                    $"Vuelto en USD incorrecto. Esperado: ${vueltoEsperado:F2}, Contado: ${totalVueltoUSD:F2}");
                            }
                            order.monto_vuelto_usd = vueltoEsperado;
                            order.monto_vuelto_nio = 0;
                        }
                        else
                        {
                            // Orden NIO + vuelto USD: exceso / tasa_venta
                            decimal vueltoEsperado = exceso / tasaVentaSistema;
                            if (Math.Abs(totalVueltoUSD - vueltoEsperado) > 0.01m)
                            {
                                return new ResponseService(400,
                                    $"Vuelto en USD incorrecto. Esperado: ${vueltoEsperado:F2}, Contado: ${totalVueltoUSD:F2}");
                            }
                            order.monto_vuelto_usd = vueltoEsperado;
                            order.monto_vuelto_nio = exceso;
                        }
                    }
                    else if (order.tipo_vuelto == "NIO")
                    {
                        // Vuelto en NIO
                        if (order.moneda == MonedaEnum.DOLARES)
                        {
                            // Orden USD + vuelto NIO: exceso * tasa_compra
                            decimal vueltoEsperado = exceso * tasaCompraSistema;
                            if (Math.Abs(totalVueltoNIO - vueltoEsperado) > 0.01m)
                            {
                                return new ResponseService(400,
                                    $"Vuelto en NIO incorrecto. Esperado: C${vueltoEsperado:F2}, Contado: C${totalVueltoNIO:F2}");
                            }
                            order.monto_vuelto_nio = vueltoEsperado;
                            order.monto_vuelto_usd = exceso;
                        }
                        else
                        {
                            // Orden NIO + vuelto NIO: exceso directo
                            decimal vueltoEsperado = exceso;
                            if (Math.Abs(totalVueltoNIO - vueltoEsperado) > 0.01m)
                            {
                                return new ResponseService(400,
                                    $"Vuelto en NIO incorrecto. Esperado: C${vueltoEsperado:F2}, Contado: C${totalVueltoNIO:F2}");
                            }
                            order.monto_vuelto_nio = vueltoEsperado;
                            order.monto_vuelto_usd = 0;
                        }
                    }
                    else
                    {
                        return new ResponseService(400,
                            "Hay exceso de pago pero no se especificó el tipo de vuelto (USD o NIO)");
                    }
                }
            }
            
            // 2. Validar según el tipo de operación (código existente)
            if (order.tipo_operacion_cambio == TipoOperacionEnum.NONE ||
                order.tipo_operacion_cambio == null)
            {
                // PAGO SIMPLE: las denominaciones deben cubrir al menos el monto de la orden
                if (order.moneda == MonedaEnum.DOLARES)
                {
                    if (totalPagoUSD < monto - 0.01m)
                        return new ResponseService(400,
                            $"Las denominaciones en USD (${totalPagoUSD:F2}) no cubren el monto de la orden (${order.monto:F2})");
                }
                else
                {
                    if (totalPagoNIO < monto - 0.01m)
                        return new ResponseService(400,
                            $"Las denominaciones en NIO (C${totalPagoNIO:F2}) no cubren el monto de la orden (C${order.monto:F2})");
                }
            }
            else if (order.tipo_operacion_cambio == TipoOperacionEnum.MIXED_PAYMENT)
            {
                decimal montoEnOrdenUSD = order.moneda == MonedaEnum.DOLARES
                    ? monto
                    : monto / tasaVentaSistema;

                decimal pagoDirecto = order.moneda == MonedaEnum.DOLARES ? totalPagoUSD : totalPagoNIO;
                decimal montoCambioEquivalente = order.moneda == MonedaEnum.DOLARES
                    ? totalPagoNIO / tasaAplicada
                    : totalPagoUSD * tasaAplicada;

                if (order.moneda == MonedaEnum.DOLARES)
                {
                    order.monto_cambio_usd = monto - pagoDirecto;
                    order.monto_cambio_nio = totalPagoNIO;
                }
                else
                {
                    order.monto_cambio_nio = monto - pagoDirecto;
                    order.monto_cambio_usd = totalPagoUSD;
                }

                if (Math.Abs(pagoDirecto + montoCambioEquivalente - montoEnOrdenUSD) > 0.01m)
                    return new ResponseService(400,
                        "La combinación de pago directo y cambio no cubre el monto de la orden");
            }
            else if (order.tipo_operacion_cambio == TipoOperacionEnum.VENTA_MONEDA)
            {
                decimal montoCambioEsperado = totalCambioUSD * tasaVentaSistema;
                order.monto_cambio_nio = montoCambioEsperado;
                order.monto_cambio_usd = totalCambioUSD;

                if (Math.Abs(totalCambioNIO - order.monto_cambio_nio.GetValueOrDefault()) > 0.01m)
                    return new ResponseService(400,
                        $"Las denominaciones pagadas en NIO (C${totalCambioNIO:F2}) no coinciden con el monto de venta (C${order.monto_cambio_nio:F2})");

                if (Math.Abs(totalCambioUSD - order.monto_cambio_usd.GetValueOrDefault()) > 0.01m)
                    return new ResponseService(400,
                        $"Las denominaciones de venta en USD (${totalCambioUSD:F2}) no coinciden con el monto vendido (${order.monto_cambio_usd:F2})");
            }
            else if (order.tipo_operacion_cambio == TipoOperacionEnum.COMPRA_MONEDA)
            {
                decimal montoCambioEsperado = totalCambioUSD * tasaCompraSistema;
                order.monto_cambio_nio = montoCambioEsperado;
                order.monto_cambio_usd = totalCambioUSD;

                if (Math.Abs(totalCambioUSD - order.monto_cambio_usd.GetValueOrDefault()) > 0.01m)
                    return new ResponseService(400,
                        $"Las denominaciones pagadas en USD (${totalPagoUSD:F2}) no coinciden con el monto de compra (${order.monto_cambio_usd:F2})");

                if (Math.Abs(totalCambioNIO - order.monto_cambio_nio.GetValueOrDefault()) > 0.01m)
                    return new ResponseService(400,
                        $"Las denominaciones de compra en NIO (C${totalCambioNIO:F2}) no coinciden con el monto comprado (C${order.monto_cambio_nio:F2})");
            }

            return new ResponseService(200, "Denominaciones validadas correctamente");
        }
        public static decimal CalcularTotalDenominaciones(List<Denominacion_Movimiento>? denoms)
        {
            if (denoms == null) return 0;
            decimal total = 0;
            foreach (var d in denoms.Where(x => x.cantidad > 0))
            {
                var catalogo = new Denominacion_Catalogo() { id_denominacion = d.id_denominacion }.Find<Denominacion_Catalogo>();
                if (catalogo != null)
                    total += (catalogo.valor ?? 0) * (d.cantidad ?? 0);
            }
            return total;
        }
    }
}