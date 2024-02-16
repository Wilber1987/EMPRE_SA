using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Tbl_Cuotas : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? id_cuota { get; set; }
       public int? numero_contrato { get; set; }
       public DateTime? fecha { get; set; }
       public Double? total { get; set; }
       public Double? interes { get; set; }
       public Double? abono_capital { get; set; }
       public Double? capital_restante { get; set; }
       public DateTime? fecha_pago { get; set; }
       public Double? pago_contado { get; set; }
       public Double? descuento { get; set; }
       public Double? tasa_cambio { get; set; }
       public Double? mora { get; set; }
       [ManyToOne(TableName = "Transaction_Contratos", KeyColumn = "numero_contrato", ForeignKeyColumn = "numero_contrato")]
       public Transaction_Contratos? Transaction_Contratos { get; set; }
       [OneToMany(TableName = "Detalle_Factura_Recibo", KeyColumn = "id_cuota", ForeignKeyColumn = "id_cuota")]
       public List<Detalle_Factura_Recibo>? Detalle_Factura_Recibo { get; set; }
   }
}
