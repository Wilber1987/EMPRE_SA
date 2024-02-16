using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Security_Permissions : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? Id_Permission { get; set; }
       public string? Descripcion { get; set; }
       public string? Estado { get; set; }
       [OneToMany(TableName = "Security_Permissions_Roles", KeyColumn = "Id_Permission", ForeignKeyColumn = "Id_Permission")]
       public List<Security_Permissions_Roles>? Security_Permissions_Roles { get; set; }
   }
}
