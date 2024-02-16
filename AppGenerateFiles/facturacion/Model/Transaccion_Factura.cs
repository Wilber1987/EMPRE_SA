using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Transaccion_Factura : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? id_factura { get; set; }
       public string? tipo { get; set; }
       public string? concepto { get; set; }
       public Double? tasa_cambio { get; set; }
       public Double? total { get; set; }
       public int? id_cliente { get; set; }
       public int? id_sucursal { get; set; }
       public DateTime? fecha { get; set; }
       public int? id_usuario { get; set; }
       public string? Factura_contrato { get; set; }
       public string? estado { get; set; }
       public string? no_factura { get; set; }
       public Double? subtotal { get; set; }
       public Double? iva { get; set; }
       [OneToMany(TableName = "Detalle_Factura_Recibo", KeyColumn = "id_factura", ForeignKeyColumn = "id_factura")]
       public List<Detalle_Factura_Recibo>? Detalle_Factura_Recibo { get; set; }
   }
}
