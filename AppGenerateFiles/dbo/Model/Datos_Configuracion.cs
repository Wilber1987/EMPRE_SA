using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Datos_Configuracion : EntityClass {
       [PrimaryKey(Identity = false)]
       public int? Id_Sucursal { get; set; }
       public string? Encabezado { get; set; }
       public bool? AutoDebito { get; set; }
       [OneToOne(TableName = "Catalogo_Sucursales", KeyColumn = "Id_Sucursal", ForeignKeyColumn = "Id_Sucursal")]
       public Catalogo_Sucursales? Catalogo_Sucursales { get; set; }
   }
}
