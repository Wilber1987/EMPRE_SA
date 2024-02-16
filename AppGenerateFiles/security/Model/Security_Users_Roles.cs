using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Security_Users_Roles : EntityClass {
       [PrimaryKey(Identity = false)]
       public int? Id_Role { get; set; }
       [PrimaryKey(Identity = false)]
       public int? Id_User { get; set; }
       public string? Estado { get; set; }
       [ManyToOne(TableName = "Security_Roles", KeyColumn = "Id_Role", ForeignKeyColumn = "Id_Role")]
       public Security_Roles? Security_Roles { get; set; }
       [ManyToOne(TableName = "Security_Users", KeyColumn = "Id_User", ForeignKeyColumn = "Id_User")]
       public Security_Users? Security_Users { get; set; }
   }
}
