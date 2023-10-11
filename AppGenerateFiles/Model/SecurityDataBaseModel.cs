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
   public class Security_Users : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? Id_User { get; set; }
       public string? Nombres { get; set; }
       public string? Estado { get; set; }
       public string? Descripcion { get; set; }
       public string? Password { get; set; }
       public string? Mail { get; set; }
       public string? Token { get; set; }
       public DateTime? Token_Date { get; set; }
       public DateTime? Token_Expiration_Date { get; set; }
       public int? Id_Sucursal { get; set; }
       public int? id_agente { get; set; }
       [ManyToOne(TableName = "Catalogo_Agentes", KeyColumn = "id_agente", ForeignKeyColumn = "id_agente")]
       public Catalogo_Agentes? Catalogo_Agentes { get; set; }
       [ManyToOne(TableName = "Catalogo_Sucursales", KeyColumn = "Id_Sucursal", ForeignKeyColumn = "Id_Sucursal")]
       public Catalogo_Sucursales? Catalogo_Sucursales { get; set; }
       [OneToMany(TableName = "Transaction_Contratos_Inversionistas", KeyColumn = "Id_User", ForeignKeyColumn = "Id_User")]
       public List<Transaction_Contratos_Inversionistas>? Transaction_Contratos_Inversionistas { get; set; }
       [OneToMany(TableName = "Transaction_Contratos_old", KeyColumn = "Id_User", ForeignKeyColumn = "Id_User")]
       public List<Transaction_Contratos_old>? Transaction_Contratos_old { get; set; }
       [OneToMany(TableName = "Transaction_Facturas_old", KeyColumn = "Id_User", ForeignKeyColumn = "Id_User")]
       public List<Transaction_Facturas_old>? Transaction_Facturas_old { get; set; }
       [OneToMany(TableName = "Security_Users_Roles", KeyColumn = "Id_User", ForeignKeyColumn = "Id_User")]
       public List<Security_Users_Roles>? Security_Users_Roles { get; set; }
   }
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
