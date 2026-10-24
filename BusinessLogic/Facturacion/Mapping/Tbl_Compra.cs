using APPCORE;
using Business;
using CAPA_NEGOCIO.Util;
using System;
using System.Collections.Generic;

namespace DataBaseModel
{
	public class Tbl_Compra : EntityClass
	{
		[PrimaryKey(Identity = true)]
		public int? Id_Compra { get; set; }
		public string? Codigo_compra { get; set; }
		public int? Id_User { get; set; }
		public int? Id_Sucursal { get; set; }
		[JsonProp]
		public Datos_Compra? Datos_Compra { get; set; }
		public int? Id_Proveedor { get; set; }
		public DateTime? Fecha { get; set; }
		public decimal? Tasa_Cambio { get; set; }
		public MonedaEnum? Moneda { get; set; }
		public decimal? Sub_Total { get; set; }
		public decimal? Iva { get; set; }
		public decimal? Total { get; set; }
		public EstadoEnum? Estado { get; set; }
		public string? Observaciones { get; set; }

		public bool IsAnulable
		{
			get
			{
				return Estado != EstadoEnum.ANULADO && Estado != EstadoEnum.CANCELADO  && !DateUtil.IsAffterNDays(Fecha, 1);
			}
		}

		[ManyToOne(TableName = "Cat_Proveedor", KeyColumn = "Id_Proveedor", ForeignKeyColumn = "Id_Proveedor")]
		public Cat_Proveedor? Cat_Proveedor { get; set; }

		[OneToMany(TableName = "Detalle_Compra", KeyColumn = "Id_Compra", ForeignKeyColumn = "Id_Compra")]
		public List<Detalle_Compra>? Detalle_Compra { get; set; }
	}

	public class Datos_Compra
	{
		public string? RUC { get; set; }
		public string? Nombre_Comprador { get; set; }
	}
}