using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Security_Roles : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? Id_Role { get; set; }
       public string? Descripcion { get; set; }
       public string? Estado { get; set; }
       [OneToMany(TableName = "Security_Permissions_Roles", KeyColumn = "Id_Role", ForeignKeyColumn = "Id_Role")]
       public List<Security_Permissions_Roles>? Security_Permissions_Roles { get; set; }
       [OneToMany(TableName = "Security_Users_Roles", KeyColumn = "Id_Role", ForeignKeyColumn = "Id_Role")]
       public List<Security_Users_Roles>? Security_Users_Roles { get; set; }
   }
}
