using API.Controllers;
using CAPA_DATOS;
using DataBaseModel;
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

                /*var contrato = new Transaction_Contratos()
                {
                    numero_contrato = this.numero_contrato
                }.Get<Transaction_Contratos>().Where<x -> x.numero_contrato == this.numero_contrato>;*/

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

                /*var cuotas = new Tbl_Cuotas()
                {
                    numero_contrato = this.numero_contrato
                }.Get<Tbl_Cuotas>().OrderBy(c => c.id_cuota).ToList();*/



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

                int ultimoConsecutivo = new Recibos().Get<Recibos>().Max(r => (int?)r.consecutivo) ?? 0;

                var cuotasPendiente = Get<Tbl_Cuotas>()
                .Where(x => x.total > x.abono_capital).ToList();

                //guardado de factura
                var factura = new Transaccion_Factura()
                {
                    tipo = "RECIBO", //TODO ENUM
                    concepto = "Pago de cuota contrato No: " + this.numero_contrato,
                    tasa_cambio = this.tasa_cambio,
                    total = this.paga_dolares,
                    id_cliente = contrato.codigo_cliente,
                    id_sucursal = null,
                    fecha = DateTime.Now,
                    id_usuario = 1,//todo
                    Factura_contrato = new Factura_contrato()
                    {
                        numero_contrato = this.numero_contrato,
                        cuotas_pactadas = contrato.Tbl_Cuotas.Count(),
                        cuotas_pendientes = cuotasPendiente.Count(),
                        saldo_anterior = null,
                        saldo_actual = null,
                        mora = this.mora_dolares,
                        interes_demas_cargos_pagar = this.interes_demas_cargos_pagar_dolares,
                        proximo_pago_pactado = null,
                        total_parciales = this.total_parciales,//todo preguntar a wilber
                        tipo = null,
                        tipo_cuenta = null,
                        total = this.total_dolares,
                        tasa_cambio = this.tasa_cambio,
                        id_cliente = contrato.codigo_cliente,
                        id_sucursal = null,//todo
                    },
                    Detalle_Factura_Recibo = cuotasPagadas
                };


                factura.Save();


                /****guardado de movimiento 
                var cuentaDestino = new Catalogo_Cuentas()
                {
                    id_cuentas = 10 //todo por el momento es na caja quemada
                }.Find<Catalogo_Cuentas>();

                var cuentaOrigen = new Catalogo_Cuentas()
                {
                    id_cuentas = 16
                }.Find<Catalogo_Cuentas>();
               
                    
                };contable*****/
              
                // var encabezado = new Transaction_Movimiento()
                // {
                //     descripcion = "Pago de contrato #" + this.numero_contrato.ToString(),
                //     concepto = "Pago de contrato #" + this.numero_contrato.ToString(),
                //     id_usuario_crea = user.UserId,
                //     tipo = "pendiente",
                //     moneda = cuentaDestino?.permite_cordobas == true ? "C$" : "$",
                //     tasa_cambio = this.tasa_cambio,
                //     tasa_cambio_compra = this.tasa_cambio_compra,
                //     correo_enviado = false,
                //     Detail_Movimiento = new List<Detail_Movimiento>(){
                //             new Detail_Movimiento(){
                //                 id_cuenta = cuentaOrigen?.id_cuentas,
                //                 debito = this.monto,
                //                 debito_dolares = this.monto / this.tasa_cambio,
                //                 credito = 0,
                //                 credito_dolares = 0,
                //                 monto_inicial = cuentaOrigen?.saldo,
                //                 monto_inicial_dolares = cuentaOrigen?.saldo_dolares,
                //                 monto_final = cuentaOrigen?.saldo - this.monto,
                //                 monto_final_dolares = cuentaOrigen?.saldo_dolares - (this.monto / this.tasa_cambio),
                //                 tasa_cambio = this.tasa_cambio,
                //                 tasa_cambio_compra = this.tasa_cambio_compra,
                //                 moneda = cuentaDestino?.permite_cordobas == true ? "C$" : "$"
                //             },new Detail_Movimiento(){
                //                 id_cuenta = cuentaDestino?.id_cuentas,
                //                 debito = 0,
                //                 debito_dolares = 0,
                //                 credito = this.monto,
                //                 credito_dolares = this.monto / tasa_cambio,
                //                 monto_inicial = cuentaDestino?.saldo,
                //                 monto_inicial_dolares = cuentaDestino?.saldo_dolares,
                //                 monto_final = cuentaDestino?.saldo + this.monto,
                //                 monto_final_dolares = cuentaDestino?.saldo_dolares + (this.monto / this.tasa_cambio),
                //                 tasa_cambio = this.tasa_cambio,
                //                 tasa_cambio_compra = this.tasa_cambio_compra,
                //                 moneda = cuentaDestino?.permite_cordobas == true ? "C$" : "$"
                //             }
                //         }
                // };

                // cuentaOrigen.saldo = cuentaOrigen.saldo - this.paga_cordobas;
                // cuentaOrigen.saldo_dolares = cuentaOrigen.saldo_dolares - (this.paga_cordobas / this.tasa_cambio);
                // cuentaDestino.saldo = cuentaDestino.saldo + this.paga_cordobas;
                // cuentaDestino.saldo_dolares = cuentaDestino.saldo_dolares + (this.paga_cordobas / this.tasa_cambio);
                //cuentaDestino.Update();
                //cuentaOrigen.Update();

                //var resultMovimiento = encabezado.Save();

                new Movimientos_Cuentas
                {
                    Catalogo_Cuentas_Destino = null,
                    Catalogo_Cuentas_Origen = null,
                    concepto = "TEST",
                    descripcion = "TEST",
                    moneda = "CORDOBAS",
                    monto = 7000,
                    tasa_cambio = 35.95,
                    tasa_cambio_compra = 36.85
                }.Save(token);

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

        public List<Recibos> Get()
        {
            return null;
            //return new Recibos_Transaction().Get().ToList();
        }

    }


}