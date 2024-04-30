using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CAPA_DATOS;

namespace DataBaseModel
{
	public class Catalogo_Clientes : ClientDataBaseModel.Catalogo_Clientes
	{
	   
		public string? hora { get; set; }  
		public string? Descripcion { get {
			return $"{primer_nombre} {segundo_nombre} {primer_apellido} {segundo_apellidio}";
		}}      
		public int? tipoc { get; set; }      
		public string? valor_cliente { get; set; }     
		public string? solo_acreedor { get; set; }
		public Double? promedio { get; set; }
		public int? id_clasificacion { get; set; }
		public int? id_clasificacion_interes { get; set; }
		[ManyToOne(TableName = "Catalogo_Clasificacion_Cliente", KeyColumn = "id_clasificacion", ForeignKeyColumn = "id_clasificacion")]
		public Catalogo_Clasificacion_Cliente? Catalogo_Clasificacion_Cliente { get; set; }
		[ManyToOne(TableName = "Catalogo_Clasificacion_Interes", KeyColumn = "id_clasificacion_interes", ForeignKeyColumn = "id_clasificacion_interes")]
		public Catalogo_Clasificacion_Interes? Catalogo_Clasificacion_Interes { get; set; }
		/*[OneToMany(TableName = "Transaction_Contratos", KeyColumn = "codigo_cliente", ForeignKeyColumn = "codigo_cliente")]*/
		public List<Transaction_Contratos>? Transaction_Contratos { get; set; }

		internal object? SaveClient()
		{
			if (new Catalogo_Clientes{identificacion = this.identificacion}.Find<Catalogo_Clientes>() != null)
			{
				return new ResponseService
				{
					status = 403,
					message = "Identificación en uso"
				};
			}
			return Save();
		}
	}
	public class Condicion_Laboral_Cliente : ClientDataBaseModel.Condicion_Laboral_Cliente
	{
	}
}