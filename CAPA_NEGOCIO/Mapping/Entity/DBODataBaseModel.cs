using CAPA_DATOS;
using CAPA_NEGOCIO.Security;
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
       [OneToOne(TableName = "Datos_Configuracion", KeyColumn = "Id_Sucursal", ForeignKeyColumn = "Id_Sucursal")]
       public Datos_Configuracion? Datos_Configuracion { get; set; }    
   }
   public class Datos_Configuracion : EntityClass {
       [PrimaryKey(Identity = false)]
       public int? Id_Sucursal { get; set; }
       public string? Encabezado { get; set; }
       public bool? AutoDebito { get; set; }
       [OneToOne(TableName = "Catalogo_Sucursales", KeyColumn = "Id_Sucursal", ForeignKeyColumn = "Id_Sucursal")]
       public Catalogo_Sucursales? Catalogo_Sucursales { get; set; }
   }
}
