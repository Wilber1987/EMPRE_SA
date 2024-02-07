using API.Controllers;
using CAPA_DATOS;
using CAPA_DATOS.BDCore;
using CAPA_NEGOCIO.Services;
using DataBaseModel;
using iText.Kernel.Pdf.Annot.DA;
using Model;

namespace Transactions
{
    public class Recibos : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? id_recibo { get; set; }
        public int? consecutivo { get; set; }
        public bool? temporal { get; set; }
        public int? numero_contrato { get; set; }
        public double? monto { get; set; }
        public double? saldo_actual_cordobas { get; set; }
        public double? saldo_actual_dolares { get; set; }
        public double? plazo { get; set; }
        public double? interes_cargos { get; set; }
        public double? tasa_cambio { get; set; }
        public double? tasa_cambio_compra { get; set; }
        public double? interes_demas_cargos_pagar_cordobas { get; set; }
        public double? interes_demas_cargos_pagar_dolares { get; set; }
        public double? abono_capital_cordobas { get; set; }
        public double? abono_capital_dolares { get; set; }
        public double? cuota_pagar_cordobas { get; set; }
        public double? cuota_pagar_dolares { get; set; }
        public double? mora_cordobas { get; set; }
        public double? mora_dolares { get; set; }
        public double? mora_interes_cordobas { get; set; }
        public double? mora_interes_dolares { get; set; }
        public double? total_cordobas { get; set; }
        public double? total_dolares { get; set; }
        public double? total_parciales { get; set; }
        public DateTime? fecha_roc { get; set; }
        public double? paga_cordobas { get; set; }
        public double? paga_dolares { get; set; }
        public bool? solo_abono { get; set; }
        public bool? cancelar { get; set; }
        public bool? reestructurar { get; set; }
        public double? reestructurar_value { get; set; }
        public double? total_apagar_dolares { get; set; }


        public object? SaveRecibos(string token)
        {
            try
            {
                var user = AuthNetCore.User(token);
                var dbUser = new API.Extended.Security_Users { Id_User = user.UserId }.Find<API.Extended.Security_Users>();
                var contrato = new Transaction_Contratos() { numero_contrato = this.numero_contrato }.Find<Transaction_Contratos>();
                if (contrato == null)
                {
                    return new ResponseService()
                    {
                        status = 400,
                        message = "Nº contrato no encontrado"
                    };
                }
                if (this.cancelar.HasValue && this.cancelar.Value && this.paga_dolares < contrato.saldo)
                {
                    return new ResponseService()
                    {
                        status = 400,
                        message = "Para cancelar es necesario un monto de " + contrato.saldo
                    };
                }
                double monto = (double)this.paga_dolares;
                BeginGlobalTransaction();

                var cuotasPagadas = new List<Detalle_Factura_Recibo>();
                foreach (var item in contrato.Tbl_Cuotas.OrderBy(c => c.id_cuota).ToList())
                {
                    if (monto >= item.total && monto > 0)
                    {
                        item.pago_contado = item.total;
                        monto -= (double)item.total;
                    }
                    else
                    {
                        item.pago_contado = monto;
                        monto = 0;
                        if (monto == 0)
                        {
                            break;
                        }
                    }
                    cuotasPagadas.Add(
                        new Detalle_Factura_Recibo()
                        {
                            id_cuota = item.id_cuota,
                            total_cuota = item.total,
                            monto_pagado = item.abono_capital,
                            capital_restante = item.capital_restante,
                            concepto = this.numero_contrato + item.abono_capital < item.total
                            ? "Pago parcial de cuota" : "Pago de completo de cuota, contrato No: " + this.numero_contrato,
                            tasa_cambio = this.tasa_cambio
                        }
                    );
                    item.Update();

                }
                var saldoRespaldo = contrato.saldo;

                contrato.saldo = contrato.saldo - this.paga_dolares;
                contrato.Update();
                if (this.reestructurar == true)
                {
                    contrato.Reestructurar(this.reestructurar_value);
                    cuotasPagadas.Add(
                        new Detalle_Factura_Recibo()
                        {
                            total_cuota = 1,
                            monto_pagado = 1,
                            capital_restante = 0,
                            concepto = "Pago por tramite bde reestructuración de cuota",
                            tasa_cambio = this.tasa_cambio
                        }
                    );
                }

                //fecha de proximo pago
                var fechaProximoPago = contrato.Tbl_Cuotas.Find(x => x.total < x.pago_contado || x.pago_contado == null);

                int ultimoConsecutivo = new Recibos().Get<Recibos>().Max(r => (int?)r.consecutivo) ?? 0;

                var cuotasPendiente = Get<Tbl_Cuotas>().Where(x => x.total > x.abono_capital).ToList();

                //guardado de factura
                var factura = new Transaccion_Factura()
                {
                    tipo = "RECIBO", //TODO ENUM
                    estado = EstadoEnum.ACTIVO.ToString(),
                    concepto = "Pago de cuota contrato No: " + this.numero_contrato,
                    tasa_cambio = this.tasa_cambio,
                    total = this.paga_dolares + (this.reestructurar == true ? 1 : 0),
                    id_cliente = contrato.codigo_cliente,
                    id_sucursal = dbUser.Id_Sucursal,
                    fecha = DateTime.Now,
                    id_usuario = user.UserId,
                    Factura_contrato = new Factura_contrato()
                    {
                        numero_contrato = this.numero_contrato,
                        cuotas_pactadas = contrato.Tbl_Cuotas.Count(),
                        cuotas_pendientes = cuotasPendiente.Count(),
                        saldo_anterior = saldoRespaldo,
                        saldo_actual = contrato.saldo,
                        mora = this.mora_dolares,
                        interes_demas_cargos_pagar = this.interes_demas_cargos_pagar_dolares,
                        proximo_pago_pactado = fechaProximoPago != null ? fechaProximoPago.fecha : null,
                        total_parciales = this.total_parciales,//todo preguntar a EMPRESA 
                        tipo = null,
                        tipo_cuenta = null,
                        total = this.total_dolares,
                        tasa_cambio = this.tasa_cambio,
                        id_cliente = contrato.codigo_cliente,
                        id_sucursal = dbUser.Id_Sucursal,
                        reestructuracion = this.reestructurar == true ? 1 : 0,
                        total_pagado = this.total_apagar_dolares
                    },
                    Detalle_Factura_Recibo = cuotasPagadas
                };
                factura.Save();
                var cuentaDestino = new Catalogo_Cuentas()
                {
                    id_categoria = 1,
                    id_sucursal = dbUser.Id_Sucursal
                }.Find<Catalogo_Cuentas>();

                var cuentaOrigen = new Catalogo_Cuentas()
                {
                    id_sucursal = dbUser.Id_Sucursal,
                    id_categoria = 6
                }.Find<Catalogo_Cuentas>();

                if (cuentaDestino == null || cuentaOrigen == null)
                {
                    RollBackGlobalTransaction();
                    return new ResponseService()
                    {
                        status = 400,
                        message = "Cuentas no configuradas correctamente"
                    };
                }

                ResponseService response = new Movimientos_Cuentas
                {
                    Catalogo_Cuentas_Destino = cuentaDestino,
                    Catalogo_Cuentas_Origen = cuentaOrigen,
                    concepto = "Pago de cuota, contrato No: " + this.numero_contrato,
                    descripcion = "Pago de cuota, contrato No: " + this.numero_contrato,
                    moneda = "DOLARES",
                    monto = this.paga_dolares,
                    tasa_cambio = this.tasa_cambio,
                    tasa_cambio_compra = this.tasa_cambio_compra,
                    is_transaction = true
                }.SaveMovimiento(token);

                if (response.status == 400)
                {
                    RollBackGlobalTransaction();
                    return response;
                }
                CommitGlobalTransaction();
                return new ResponseService()
                {
                    status = 200,
                    message = "Factura registrada correctamente",
                    body = factura
                };

            }
            catch (System.Exception ex)
            {
                RollBackGlobalTransaction();
                return new ResponseService()
                {
                    message = "Error:" + ex.ToString(),
                    status = 400
                };
            }

        }

        public object? AnularFactura(string token)
        {
            try
            {

                var user = AuthNetCore.User(token);
                var dbUser = new API.Extended.Security_Users { Id_User = user.UserId }.Find<API.Extended.Security_Users>();
                var factura = new Transaccion_Factura() { id_factura = this.id_recibo }.Find<Transaccion_Factura>();

                if (factura == null)
                {
                    return new ResponseService()
                    {
                        status = 400,
                        message = "Recibo no encontrado"
                    };
                }

                if (factura.estado != EstadoEnum.ACTIVO.ToString())//todo enum
                {
                    return new ResponseService()
                    {
                        status = 400,
                        message = "Recibo no se encuentra activo"
                    };
                }

                factura.estado = EstadoEnum.ANULADO.ToString();
                factura.Update();


                BeginGlobalTransaction();
                var contrato = new Transaction_Contratos() { numero_contrato = factura.Factura_contrato.numero_contrato }.Find<Transaction_Contratos>();

                //si existe contrato se debe anular el recibo y regresarse el saldo
                if (contrato != null)
                {
                    var saldo = contrato.saldo;
                    var totalfactura = factura.total;
                    contrato.saldo = contrato.saldo + factura.total;
                    contrato.Update();
                }



                var cuentaDestino = new Catalogo_Cuentas()
                {
                    id_categoria = 6,
                    id_sucursal = dbUser.Id_Sucursal
                }.Find<Catalogo_Cuentas>();

                var cuentaOrigen = new Catalogo_Cuentas()
                {
                    id_sucursal = dbUser.Id_Sucursal,
                    id_categoria = 1
                }.Find<Catalogo_Cuentas>();

                if (cuentaDestino == null || cuentaOrigen == null)
                {
                    RollBackGlobalTransaction();
                    return new ResponseService()
                    {
                        status = 400,
                        message = "Cuentas para anulación de factura no configuradas correctamente"
                    };
                }


                ResponseService response = new Movimientos_Cuentas
                {
                    Catalogo_Cuentas_Destino = cuentaDestino,
                    Catalogo_Cuentas_Origen = cuentaOrigen,
                    concepto = contrato != null ? "Anulación de cuota, contrato No: " + factura.Factura_contrato.numero_contrato : "Anulación de factura",
                    descripcion = contrato != null ? "Anulación de cuota, contrato No: " + factura.Factura_contrato.numero_contrato : "Anulación de factura",
                    moneda = "DOLARES",
                    monto = this.paga_dolares,
                    tasa_cambio = this.tasa_cambio,
                    tasa_cambio_compra = this.tasa_cambio_compra,
                    //is_anulacion = true,
                    is_transaction = true
                }.SaveMovimiento(token);

                if (response.status == 400)
                {
                    RollBackGlobalTransaction();
                    return response;
                }
                CommitGlobalTransaction();

                return new ResponseService()
                {
                    status = 200,
                    message = "Factura anulada correctamente",
                    body = factura
                };

            }
            catch (System.Exception ex)
            {
                RollBackGlobalTransaction();
                return new ResponseService()
                {
                    message = "Error:" + ex.ToString(),
                    status = 400
                };
            }
        }

        public object? PrintRecibo(string token)
        {
            try
            {
                string templateContent = DocumentsTemplates.recibo;

                var contrato = new Transaction_Contratos() { numero_contrato = this.numero_contrato }.Find<Transaction_Contratos>();
                //var reciboData = new Recibos() { id_recibo = this.id_recibo }.Find<Recibos>();
                var factura = new Transaccion_Factura() { numero_contrato = this.numero_contrato }.Find<Transaccion_Factura>();
                var cliente = contrato.Catalogo_Clientes.Find<Catalogo_Clientes>();
                var ultimoDetalle = factura.Detalle_Factura_Recibo.OrderByDescending(d => d.id).FirstOrDefault();
                var detalleIds = factura.Detalle_Factura_Recibo.Select(d => d.id_cuota).ToList();
                var cuotas = Get<Tbl_Cuotas>().Where(c => detalleIds.Contains(c.id_cuota)).ToList();

                var dbUser = new API.Extended.Security_Users { Id_User = factura.id_usuario }.Find<API.Extended.Security_Users>();

                var sucursal = new Catalogo_Sucursales() { Id_Sucursal = dbUser.Id_Sucursal }.Find<Catalogo_Sucursales>();

                decimal sumaInteres = (decimal)cuotas.Where(c => c.interes.HasValue).Sum(c => c.mora.Value);

                decimal sumaMora = (decimal)cuotas.Where(c => c.mora.HasValue).Sum(c => c.mora.Value);

                var cuotasPendiente = Get<Tbl_Cuotas>().Count(c => c.id_cuota.HasValue && c.capital_restante > 0);

                var mela = factura.Factura_contrato.numero_contrato;

                templateContent = templateContent.Replace("{{recibo_num}}", factura.id_factura.ToString())
                .Replace("{{cambio}}", Math.Round((decimal)factura.tasa_cambio, 2).ToString())
                .Replace("{{fecha}}", factura.fecha.ToString())
                .Replace("{{sucursal}}", sucursal.Nombre)
                .Replace("{{cajero}}", dbUser.Nombres)
                .Replace("{{cliente}}", contrato.Catalogo_Clientes.primer_nombre + " " + contrato.Catalogo_Clientes.primer_apellido + " " + contrato.Catalogo_Clientes.segundo_apellidio)
                .Replace("{{clasificacion}}", cliente.Catalogo_Clasificacion_Interes.porcentaje.ToString())
                .Replace("{{categoria}}", cliente.Catalogo_Clasificacion_Cliente.Descripcion)
                .Replace("{{cuotas}}", contrato.plazo.ToString())
                .Replace("{{cuotas_pendientes}}", cuotasPendiente.ToString())
                .Replace("{{saldo_anterior}}", "")
                .Replace("{{saldo_actual}}", Math.Round((decimal)factura.total, 2).ToString())
                .Replace("{{total_pagado}}", Math.Round((decimal)factura.total / (decimal)factura.tasa_cambio, 2).ToString())
                .Replace("{{total_pagado_dolares}}", Math.Round((decimal)factura.total, 2).ToString())
                .Replace("{{reestructuracion}}", Math.Round((decimal)factura.tasa_cambio, 2).ToString())
                .Replace("{{reestructuracion_dolares}}", 1.ToString())
                .Replace("{{perdida_doc}}", Math.Round((decimal)factura.tasa_cambio, 2).ToString())
                .Replace("{{perdida_doc_dolares}}", 1.ToString())
                .Replace("{{mora}}", Math.Round((decimal)sumaMora, 2).ToString())
                .Replace("{{mora_dolares}}", Math.Round((decimal)sumaMora / (decimal)factura.tasa_cambio, 2).ToString())
                .Replace("{{idcp}}", Math.Round((decimal)sumaInteres, 2).ToString())
                .Replace("{{idcp_dolares}}", Math.Round((decimal)sumaInteres, 2).ToString())
                .Replace("{{abono_capital}}", Math.Round((decimal)ultimoDetalle.capital_restante, 2).ToString())
                .Replace("{{abono_capital_dolares}}", Math.Round((decimal)ultimoDetalle.capital_restante, 2).ToString())
                .Replace("{{saldo_actual}}", Math.Round((decimal)ultimoDetalle.capital_restante, 2).ToString())
                .Replace("{{saldo_actual_dolares}}", Math.Round((decimal)ultimoDetalle.capital_restante / (decimal)factura.tasa_cambio, 2).ToString())
                .Replace("{{proximo_pago}}", "");

                return new ResponseService()
                {
                    status = 200,
                    message = templateContent
                };


            }
            catch (System.Exception ex)
            {
                return new ResponseService()
                {
                    status = 500,
                    message = "Error, intentelo nuevamente" + ex.Message
                };
            }
        }

    }
}