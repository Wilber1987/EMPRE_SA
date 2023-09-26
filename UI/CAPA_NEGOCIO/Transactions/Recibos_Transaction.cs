using API.Controllers;
using CAPA_DATOS;
using DataBaseModel;

namespace Transactions
{
    public class Recibos_Transaction : TransactionalClass
    {
        [PrimaryKey(Identity = true)]
        public int id_recibo { get; set; }
        public int? consecutivo { get; set; }
        public bool? temporal { get; set; }
        public int? numero_contrato { get; set; }
        public string? monto { get; set; }
        public string? saldo_actual_cordobas { get; set; }
        public string? saldo_actual_dolares { get; set; }
        public string? plazo { get; set; }
        public string? interes_cargos { get; set; }
        public string? tasa_cambio { get; set; }
        public string? tasa_cambio_compra { get; set; }
        public string? interes_demas_cargos_pagar_cordobas { get; set; }
        public string? interes_demas_cargos_pagar_dolares { get; set; }
        public string? abono_capital_cordobas { get; set; }
        public string? abono_capital_dolares { get; set; }
        public string? cuota_pagar_cordobas { get; set; }
        public string? cuota_pagar_dolares { get; set; }
        public string? mora_cordobas { get; set; }
        public string? mora_dolares { get; set; }
        public string? mora_interes_cordobas { get; set; }
        public string? mora_interes_dolares { get; set; }
        public string? total_cordobas { get; set; }
        public string? total_dolares { get; set; }
        public string? total_parciales { get; set; }
        public DateTime? fecha_roc { get; set; }
        public string? paga_cordobas { get; set; }
        public string? paga_dolares { get; set; }
        public bool? solo_abono { get; set; }
        public bool? cancelar { get; set; }


        public object? Save(string token)
        {
            try
            {

                var user = AuthNetCore.User(token);
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