using API.Controllers;
using APPCORE;
using BusinessLogic.Facturacion.Mapping;
using Business;
using ClientDataBaseModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel
{
	public class Catalogo_Estados_Articulos : EntityClass
	{
		[PrimaryKey(Identity = true)]
		public int? id_estado_articulo { get; set; }
		public string? nombre { get; set; }
		public string? descripcion { get; set; }
		public decimal? porcentaje_compra { get; set; }
		public decimal? porcentaje_empeno { get; set; }
		public int? id_categoria { get; set; }
		public decimal? Porcentaje_venta_compra { get; set; }
		public decimal? Porcentaje_venta_empeno { get; set; }


		[ManyToOne(TableName = "Catalogo_Categoria", KeyColumn = "id_categoria", ForeignKeyColumn = "id_categoria")]
		public Catalogo_Categoria? Catalogo_Categoria { get; set; }
	}


	//TODO ELIMINAR A POSTERIOR LO DE LOS AGENTES
	public class Catalogo_Agentes : EntityClass
	{
		[PrimaryKey(Identity = true)]
		public int? id_agente { get; set; }
		public string? identificacion { get; set; }
		public string? nombre { get; set; }
		public string? telefono { get; set; }
		public string? direccion { get; set; }
		public DateTime? fecha { get; set; }
		public int? Id_Tipo_Agente { get; set; }
		public string? Estado { get; set; }
		[ManyToOne(TableName = "Catalogo_Tipo_Agente", KeyColumn = "Id_Tipo_Agente", ForeignKeyColumn = "Id_Tipo_Agente")]
		public Catalogo_Tipo_Agente? Catalogo_Tipo_Agente { get; set; }
		//[OneToMany(TableName = "Transaction_Contratos", KeyColumn = "id_agente", ForeignKeyColumn = "id_agente")]
		public List<Transaction_Contratos>? Transaction_Contratos { get; set; }
	}
	public class Catalogo_Clasificacion_Cliente : EntityClass
	{
		[PrimaryKey(Identity = true)]
		public int? id_clasificacion { get; set; }
		public string? Descripcion { get; set; }
		public string? Estado { get; set; }
		public decimal? porcentaje { get; set; }

		//[OneToMany(TableName = "Catalogo_Clientes", KeyColumn = "id_clasificacion", ForeignKeyColumn = "id_clasificacion")]
		public List<Catalogo_Clientes>? Catalogo_Clientes { get; set; }
	}

	public class Catalogo_Clasificacion_Interes : EntityClass
	{
		[PrimaryKey(Identity = true)]
		public int? id_clasificacion_interes { get; set; }
		public string? Descripcion { get; set; }
		public string? Estado { get; set; }
		public Double? porcentaje { get; set; }

		//[OneToMany(TableName = "Catalogo_Clientes", KeyColumn = "id_clasificacion", ForeignKeyColumn = "id_clasificacion")]
		public List<Catalogo_Clientes>? Catalogo_Clientes { get; set; }
	}
	public class Catalogo_Tipo_Agente : EntityClass
	{
		[PrimaryKey(Identity = true)]
		public int? Id_Tipo_Agente { get; set; }
		public string? Descripcion { get; set; }
		public string? Estado { get; set; }
	}
	public class Catalogo_Tipo_Identificacion : EntityClass
	{
		[PrimaryKey(Identity = true)]
		public int? id_tipo_identificacion { get; set; }
		public string? Descripcion { get; set; }
		public string? Estado { get; set; }
	}

	
	public class Catalogo_Categoria : EntityClass
	{
		[PrimaryKey(Identity = true)]
		public int? id_categoria { get; set; }
		public string? tipo { get; set; }
		public string? descripcion { get; set; }
		public int? plazo_limite { get; set; }
		public int? prioridad { get; set; }
		public bool? isEditable { get; set; }
		public bool? IsForVehiculo { get; set; }


		[OneToMany(TableName = "Catalogo_Estados_Articulos", KeyColumn = "id_categoria", ForeignKeyColumn = "id_categoria")]
		public List<Catalogo_Estados_Articulos>? Catalogo_Estados_Articulos { get; set; }
	}


	public class Catalogo_Inversores : EntityClass
	{
		[PrimaryKey(Identity = true)]
		public int? id_inversor { get; set; }
		public string? nombre { get; set; }
		public string? direccion { get; set; }
		public int? id_municipio { get; set; }
		public string? estado_civil { get; set; }
		public string? identificacion { get; set; }
		public string? telefono { get; set; }
		public int? id_nacionalidad { get; set; }
		[ManyToOne(TableName = "Catalogo_Municipio", KeyColumn = "id_municipio", ForeignKeyColumn = "id_municipio")]
		public Catalogo_Municipio? Catalogo_Municipio { get; set; }
		[ManyToOne(TableName = "Catalogo_Nacionalidad", KeyColumn = "id_nacionalidad", ForeignKeyColumn = "id_nacionalidad")]
		public Catalogo_Nacionalidad? Catalogo_Nacionalidad { get; set; }
		// [OneToMany(TableName = "Transaction_Contratos_Inversionistas", KeyColumn = "id_inversor", ForeignKeyColumn = "id_inversor")]
		// public List<Transaction_Contratos_Inversionistas>? Transaction_Contratos_Inversionistas { get; set; }
	}

	public class Catalogo_Profesiones : EntityClass
	{
		[PrimaryKey(Identity = true)]
		public int? id_profesion { get; set; }
		public string? nombre { get; set; }
		//[OneToMany(TableName = "Catalogo_Clientes", KeyColumn = "id_profesion", ForeignKeyColumn = "id_profesion")]
		//public List<Catalogo_Clientes>? Catalogo_Clientes { get; set; }
	}

}
