using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace CatalogDataBaseModel {
   public class Catalogo_Sucursales : EntityClass
	{
		[PrimaryKey(Identity = true)]
		public int? Id_Sucursal { get; set; }
		public int? id_municipio { get; set; }
		public string? Nombre { get; set; }
		public string? Descripcion { get; set; }
		public string? Direccion { get; set; }
		[OneToOne(TableName = "Datos_Configuracion", KeyColumn = "Id_Sucursal", ForeignKeyColumn = "Id_Sucursal")]
		public Datos_Configuracion? Datos_Configuracion { get; set; }
		[ManyToOne(TableName = "Catalogo_Municipio", KeyColumn = "id_municipio", ForeignKeyColumn = "id_municipio")]
		public Catalogo_Municipio? Catalogo_Municipio { get; set; }
	}
	public class Datos_Configuracion : EntityClass
	{
		[PrimaryKey(Identity = false)]
		public int? Id_Sucursal { get; set; }
		public string? Encabezado { get; set; }
		public bool? AutoDebito { get; set; }
		public int? Consecutivo { get; set; }
	}
}
