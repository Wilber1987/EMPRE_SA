using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Cat_Proveedor : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? Id_Proveedor { get; set; }
       public string? Nombre { get; set; }
       public string? Estado { get; set; }
       public string? Datos_Proveedor { get; set; }
       [OneToMany(TableName = "Tbl_Compra", KeyColumn = "Id_Proveedor", ForeignKeyColumn = "Id_Proveedor")]
       public List<Tbl_Compra>? Tbl_Compra { get; set; }
   }
}
