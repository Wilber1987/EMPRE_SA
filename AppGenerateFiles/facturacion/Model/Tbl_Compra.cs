using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Tbl_Compra : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? Id_Compra { get; set; }
       public string? DatosCompra { get; set; }
       public int? Id_Proveedor { get; set; }
       public DateTime? Fecha { get; set; }
       public Double? Tasa_Cambio { get; set; }
       public string? Moneda { get; set; }
       public Double? Sub_Total { get; set; }
       public Double? Iva { get; set; }
       public Double? Total { get; set; }
       public string? Estado { get; set; }
       [ManyToOne(TableName = "Cat_Proveedor", KeyColumn = "Id_Proveedor", ForeignKeyColumn = "Id_Proveedor")]
       public Cat_Proveedor? Cat_Proveedor { get; set; }
       [OneToMany(TableName = "Detalle_Compra", KeyColumn = "Id_Compra", ForeignKeyColumn = "Id_Compra")]
       public List<Detalle_Compra>? Detalle_Compra { get; set; }
   }
}
