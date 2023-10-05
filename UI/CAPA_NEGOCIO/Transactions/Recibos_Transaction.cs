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
                }.Find<Transaction_Contratos>;

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
                double monto = (double)this.paga_cordobas;

                BeginGlobalTransaction();

                var cuotas = new Tbl_Cuotas()
                {
                    numero_contrato = this.numero_contrato
                }.Get<Tbl_Cuotas>().OrderBy(c => c.id_cuota).ToList();;

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
                        monto = 0; // Para asegurarte de que no haya más iteraciones después del else
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
                    consecutivo = (bool)this.temporal ? 0 : ultimoConsecutivo + 1,
                    temporal = this.temporal,
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