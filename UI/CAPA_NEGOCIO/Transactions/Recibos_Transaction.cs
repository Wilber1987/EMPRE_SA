using API.Controllers;
using CAPA_DATOS;
using DataBaseModel;
using Model;

namespace Transactions
{
    public class Recibos_Transaction : TransactionalClass
    {
        [PrimaryKey(Identity = true)]
        public int id_recibo { get; set; }
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


        public object? Save(string token)
        {
            try
            {
                var user = AuthNetCore.User(token);

                var contrato = new Transaction_Contratos(){
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

                var cuotas = new Tbl_Cuotas(){
                    numero_contrato = this.numero_contrato
                }.Get<Tbl_Cuotas>();

                double monto = (double)this.monto;

                foreach (var item in cuotas)
                {
                    /*if (monto >= item.pago_contado)
                    {
                        item.pago_contado = item.monto_cuota;
                        monto -= item.monto_cuota;
                    }
                    else
                    {
                        item.pago_contado = monto;
                        break;
                    }*/
                }

                BeginGlobalTransaction();
                //cuotas.Update();
                CommitGlobalTransaction();


                return new ResponseService()
                    {
                        status = 200,
                        message = "Movimiento registrado correctamente"
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

        public List<Recibos_Transaction> Get()
        {
            return null;
            //return new Recibos_Transaction().Get().ToList();
        }
        
    }


}