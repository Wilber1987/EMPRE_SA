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

                var contrato = new Transaction_Contratos()
                {
                    numero_contrato = this.numero_contrato
                }.Find<Transaction_Contratos>();

                if (contrato == null)
                {
                    return new ResponseService()
                    {
                        status = 400,
                        message = "Nº contrato no encontrado"
                    };
                }

                if (this.cancelar.HasValue && this.cancelar.Value && this.paga_cordobas < 0)
                {
                    return new ResponseService()
                    {
                        status = 400,
                        message = "Para cancelar es necesario un monto de " + 4548
                    };
                }
                double monto = (double)this.paga_dolares;

                BeginGlobalTransaction();

                var cuotas = contrato.Tbl_Cuotas.OrderBy(c => c.id_cuota).Where(c => c.pago_contado != c.total).ToList(); ;

                foreach (var item in cuotas)
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

                    item.Update();
                }

                int ultimoConsecutivo = new Recibos().Get<Recibos>().Max(r => (int?)r.consecutivo) ?? 0;


                //guardado de recibo
                var recibo = new Recibos()
                {
                    consecutivo = this.temporal == true ? 0 : ultimoConsecutivo + 1,
                    temporal = this.temporal ?? false,
                    numero_contrato = this.numero_contrato,
                    monto = this.monto,
                    saldo_actual_cordobas = this.saldo_actual_cordobas,
                    saldo_actual_dolares = this.saldo_actual_dolares,
                    plazo = this.plazo,
                    interes_cargos = this.interes_cargos,
                    tasa_cambio = this.tasa_cambio,
                    tasa_cambio_compra = this.tasa_cambio_compra,
                    interes_demas_cargos_pagar_cordobas = this.interes_demas_cargos_pagar_cordobas,
                    interes_demas_cargos_pagar_dolares = this.interes_demas_cargos_pagar_dolares,
                    abono_capital_cordobas = this.abono_capital_cordobas,
                    abono_capital_dolares = this.abono_capital_dolares,
                    cuota_pagar_cordobas = this.cuota_pagar_cordobas,
                    cuota_pagar_dolares = this.cuota_pagar_dolares,
                    mora_cordobas = this.mora_cordobas,
                    mora_dolares = this.mora_dolares,
                    mora_interes_cordobas = this.mora_interes_cordobas,
                    mora_interes_dolares = this.mora_interes_dolares,
                    total_cordobas = this.total_cordobas,
                    total_dolares = this.total_dolares,
                    total_parciales = this.total_parciales,
                    fecha_roc = this.fecha_roc,
                    paga_cordobas = this.paga_cordobas,
                    paga_dolares = this.paga_dolares,
                    solo_abono = this.solo_abono,
                    cancelar = this.cancelar
                };
                recibo.Save();


                /****guardado de movimiento contable*****/
                var cuentaDestino = new Catalogo_Cuentas()
                {
                    id_cuentas = 10 //todo por el momento es na caja quemada
                }.Find<Catalogo_Cuentas>();

                var cuentaOrigen = new Catalogo_Cuentas()
                {
                    id_cuentas = 16
                }.Find<Catalogo_Cuentas>();

                var encabezado = new Transaction_Movimiento()
                {
                    descripcion = "Pago de contrato #" + this.numero_contrato.ToString(),
                    concepto = "Pago de contrato #" + this.numero_contrato.ToString(),
                    id_usuario_crea = user.UserId,
                    tipo = "pendiente",
                    moneda = cuentaDestino?.permite_cordobas == true ? "C$" : "$",
                    tasa_cambio = this.tasa_cambio,
                    tasa_cambio_compra = this.tasa_cambio_compra,
                    correo_enviado = false,
                    Detail_Movimiento = new List<Detail_Movimiento>(){
                            new Detail_Movimiento(){
                                id_cuenta = cuentaOrigen?.id_cuentas,
                                debito = this.monto,
                                debito_dolares = this.monto / this.tasa_cambio,
                                credito = 0,
                                credito_dolares = 0,
                                monto_inicial = cuentaOrigen?.saldo,
                                monto_inicial_dolares = cuentaOrigen?.saldo_dolares,
                                monto_final = cuentaOrigen?.saldo - this.monto,
                                monto_final_dolares = cuentaOrigen?.saldo_dolares - (this.monto / this.tasa_cambio),
                                tasa_cambio = this.tasa_cambio,
                                tasa_cambio_compra = this.tasa_cambio_compra,
                                moneda = cuentaDestino?.permite_cordobas == true ? "C$" : "$"
                            },new Detail_Movimiento(){
                                id_cuenta = cuentaDestino?.id_cuentas,
                                debito = 0,
                                debito_dolares = 0,
                                credito = this.monto,
                                credito_dolares = this.monto / tasa_cambio,
                                monto_inicial = cuentaDestino?.saldo,
                                monto_inicial_dolares = cuentaDestino?.saldo_dolares,
                                monto_final = cuentaDestino?.saldo + this.monto,
                                monto_final_dolares = cuentaDestino?.saldo_dolares + (this.monto / this.tasa_cambio),
                                tasa_cambio = this.tasa_cambio,
                                tasa_cambio_compra = this.tasa_cambio_compra,
                                moneda = cuentaDestino?.permite_cordobas == true ? "C$" : "$"
                            }
                        }
                };

                cuentaOrigen.saldo = cuentaOrigen.saldo - this.paga_cordobas;
                cuentaOrigen.saldo_dolares = cuentaOrigen.saldo_dolares - (this.paga_cordobas / this.tasa_cambio);
                cuentaDestino.saldo = cuentaDestino.saldo + this.paga_cordobas;
                cuentaDestino.saldo_dolares = cuentaDestino.saldo_dolares + (this.paga_cordobas / this.tasa_cambio);
                cuentaDestino.Update();
                cuentaOrigen.Update();

                var resultMovimiento = encabezado.Save();

                CommitGlobalTransaction();


                return new ResponseService()
                {
                    status = 200,
                    message = "Recibo registrado correctamente"
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