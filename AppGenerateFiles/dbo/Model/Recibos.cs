using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Recibos : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? id_recibo { get; set; }
       public int? consecutivo { get; set; }
       public bool? temporal { get; set; }
       public int? numero_contrato { get; set; }
       public Double? monto { get; set; }
       public Double? saldo_actual_cordobas { get; set; }
       public Double? saldo_actual_dolares { get; set; }
       public Double? plazo { get; set; }
       public Double? interes_cargos { get; set; }
       public Double? tasa_cambio { get; set; }
       public Double? tasa_cambio_compra { get; set; }
       public Double? interes_demas_cargos_pagar_cordobas { get; set; }
       public Double? interes_demas_cargos_pagar_dolares { get; set; }
       public Double? abono_capital_cordobas { get; set; }
       public Double? abono_capital_dolares { get; set; }
       public Double? cuota_pagar_cordobas { get; set; }
       public Double? cuota_pagar_dolares { get; set; }
       public Double? mora_cordobas { get; set; }
       public Double? mora_dolares { get; set; }
       public Double? mora_interes_cordobas { get; set; }
       public Double? mora_interes_dolares { get; set; }
       public Double? total_cordobas { get; set; }
       public Double? total_dolares { get; set; }
       public Double? total_parciales { get; set; }
       public DateTime? fecha_roc { get; set; }
       public Double? paga_cordobas { get; set; }
       public Double? paga_dolares { get; set; }
       public bool? solo_abono { get; set; }
       public bool? cancelar { get; set; }
       public  string moneda { get; set; }
   }
}
