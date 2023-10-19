using API.Controllers;
using CAPA_DATOS;
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
                            concepto = this.numero_contrato + item.abono_capital < item.total ? "Pago parcial de cuota" : "Pago de completo de cuota, contrato No: " + this.numero_contrato,
                            tasa_cambio = this.tasa_cambio
                        }
                    );                    
                    item.Update();
                    
                }
                var saldoRespaldo = contrato.saldo;

                contrato.saldo = contrato.saldo - this.paga_dolares;
                contrato.Update();

                //fecha de proximo pago
                var fechaProximoPago = contrato.Tbl_Cuotas.Find(x => x.total< x.pago_contado || x.pago_contado == null);

                int ultimoConsecutivo = new Recibos().Get<Recibos>().Max(r => (int?)r.consecutivo) ?? 0;

                var cuotasPendiente = Get<Tbl_Cuotas>()
                .Where(x => x.total > x.abono_capital).ToList();

                //guardado de factura
                var factura = new Transaccion_Factura()
                {
                    tipo = "RECIBO", //TODO ENUM
                    estado = "ACTIVO",//TODO ENUM
                    concepto = "Pago de cuota contrato No: " + this.numero_contrato,
                    tasa_cambio = this.tasa_cambio,
                    total = this.paga_dolares,
                    id_cliente = contrato.codigo_cliente,
                    id_sucursal = dbUser.Id_Sucursal,
                    fecha = DateTime.Now,
                    id_usuario = 1,//todo
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
                        id_sucursal = dbUser.Id_Sucursal
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
                    tasa_cambio_compra = this.tasa_cambio_compra
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
                    message = "Recibo registrado correctamente",
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
                        message = "Factura no encontrada"
                    };
                }

                if (factura.estado != "ACTIVA")//todo enum
                {
                    return new ResponseService()
                    {
                        status = 400,
                        message = "La factura no se encuentra activa"
                    };
                }

                factura.estado = "ANULADO";
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
                    tasa_cambio_compra = this.tasa_cambio_compra
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
    }
}