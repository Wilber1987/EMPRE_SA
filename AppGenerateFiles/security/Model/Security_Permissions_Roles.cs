using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Security_Permissions_Roles : EntityClass {
       [PrimaryKey(Identity = false)]
       public int? Id_Role { get; set; }
       [PrimaryKey(Identity = false)]
       public int? Id_Permission { get; set; }
       public string? Estado { get; set; }
       [ManyToOne(TableName = "Security_Permissions", KeyColumn = "Id_Permission", ForeignKeyColumn = "Id_Permission")]
       public Security_Permissions? Security_Permissions { get; set; }
       [ManyToOne(TableName = "Security_Roles", KeyColumn = "Id_Role", ForeignKeyColumn = "Id_Role")]
       public Security_Roles? Security_Roles { get; set; }
   }
}
