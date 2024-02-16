using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
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
       [OneToMany(TableName = "Transaction_Facturas", KeyColumn = "Id_User", ForeignKeyColumn = "Id_User")]
       public List<Transaction_Facturas>? Transaction_Facturas { get; set; }
       [OneToMany(TableName = "Security_Users_Roles", KeyColumn = "Id_User", ForeignKeyColumn = "Id_User")]
       public List<Security_Users_Roles>? Security_Users_Roles { get; set; }
   }
}
