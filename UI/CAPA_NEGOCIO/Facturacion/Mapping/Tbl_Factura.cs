using API.Controllers;
using CAPA_DATOS;
using ClientDataBaseModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Transactions;
namespace DataBaseModel
{
	public class Tbl_Factura : EntityClass
	{
		[PrimaryKey(Identity = true)]
		public int? Id_Factura { get; set; }
		public string? Tipo { get; set; }
		public string? Codigo_venta { get; set; }
		public string? Concepto { get; set; }
		public string? Serie { get; set; }
		public string? Forma_Pago { get; set; }
		public string? Direccion_Envio { get; set; }
		public int? Id_Cliente { get; set; }
		public int? Id_Sucursal { get; set; }
		public int? Id_User { get; set; }
		public DateTime? Fecha { get; set; }
		public DateTime? Fecha_Vencimiento { get; set; }
		public string? Observaciones { get; set; }
		public int? Id_Usuario { get; set; }
		public string? Estado { get; set; }
		public string? Moneda { get; set; }
		public Double? Sub_Total { get; set; }
		public double? TotalDescuento { get; set; }
		public Double? Iva { get; set; }
		public Double? Tasa_Cambio { get; set; }
		public Double? Tasa_Cambio_Venta { get; set; }
		public Double? Total { get; set; }
		public Double? Total_Pagado { get; set; }
		public Double? Total_Financiado { get; set; }
		public Double? Monto_cordobas { get; set; }
		public Double? Monto_dolares { get; set; }

		[JsonProp]
		public DatosFactura? Datos { get; set; }
		[JsonProp]
		public Datos_Financiamiento? Datos_Financiamiento { get; set; }

		//[ManyToOne(TableName = "Catalogo_Clientes", KeyColumn = "codigo_cliente", ForeignKeyColumn = "Id_Cliente")]
		public ClientDataBaseModel.Catalogo_Clientes? Cliente { get; set; }

		[OneToMany(TableName = "Detalle_Factura", KeyColumn = "Id_Factura", ForeignKeyColumn = "Id_Factura")]
		public List<Detalle_Factura>? Detalle_Factura { get; set; }


	}

	public class Datos_Financiamiento
	{
		public int? Numero_Contrato { get; set; }
		public double? Total_Financiado { get; set; }
		public int? Plazo { get; set; }
		public double? Interes { get; set; }
		public double? Total_Financiado_Cordobas { get; set; }
		public double? Cuota_Fija_Dolares { get; set; }
		public double? Cuota_Fija_Cordobas { get; set; }
	}

	public class DatosFactura
	{
		public string? Nombre_Vendedor { get; set; }
		public string? Nombre_Cliente { get; set; }
		public string? Direccion_Cliente { get; set; }
		public string? Telefono_Cliente { get; set; }
	}
}
