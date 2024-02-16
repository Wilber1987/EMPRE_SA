using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Catalogo_Sucursales : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? Id_Sucursal { get; set; }
       public string? Nombre { get; set; }
       public string? Descripcion { get; set; }
       public string? Direccion { get; set; }
       public int? id_municipio { get; set; }
       [OneToMany(TableName = "Catalogo_Cuentas", KeyColumn = "Id_Sucursal", ForeignKeyColumn = "id_sucursal")]
       public List<Catalogo_Cuentas>? Catalogo_Cuentas_id_sucursal { get; set; }
       [OneToMany(TableName = "Catalogo_Cuentas", KeyColumn = "Id_Sucursal", ForeignKeyColumn = "id_sucursal")]
       public List<Catalogo_Cuentas>? Catalogo_Cuentas_id_sucursal { get; set; }
       [OneToOne(TableName = "Datos_Configuracion", KeyColumn = "Id_Sucursal", ForeignKeyColumn = "Id_Sucursal")]
       public Datos_Configuracion? Datos_Configuracion { get; set; }
       [OneToMany(TableName = "Security_Users", KeyColumn = "Id_Sucursal", ForeignKeyColumn = "Id_Sucursal")]
       public List<Security_Users>? Security_Users { get; set; }
   }
}
