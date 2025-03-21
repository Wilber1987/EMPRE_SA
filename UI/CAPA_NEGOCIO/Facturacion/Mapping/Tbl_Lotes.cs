using API.Controllers;
using CAPA_DATOS;
using Financial;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using System.Transactions;
namespace DataBaseModel
{
	public class Tbl_Lotes : EntityClass
	{
		[PrimaryKey(Identity = true)]
		public int? Id_Lote { get; set; }
		public int? Id_Producto { get; set; }
		public Double? Precio_Venta { get; set; }
		public Double? Precio_Compra { get; set; }
		public Double? Cantidad_Inicial { get; set; }
		public Double? Cantidad_Existente { get; set; }
		public int? Id_Sucursal { get; set; }
		public int? Id_User { get; set; }
		public DateTime? Fecha_Ingreso { get; set; }
		public int? Id_Almacen { get; set; }
		public string? Lote { get; set; }
		public int? Id_Detalle_Compra { get; set; }
		public string? Name { get { return Datos_Producto?.Descripcion ?? "-"; } }
		public string? Detalles { get; set; }
		
		[JsonProp]
		public Transactional_Valoracion? Datos_Producto { get; set; }
		[JsonProp]
		public EtiquetaLote? EtiquetaLote { get; set; }

		[ManyToOne(TableName = "Cat_Almacenes", KeyColumn = "Id_Almacen", ForeignKeyColumn = "Id_Almacen")]
		public Cat_Almacenes? Cat_Almacenes { get; set; }
		[ManyToOne(TableName = "Detalle_Compra", KeyColumn = "Id_Detalle_Compra", ForeignKeyColumn = "Id_Detalle_Compra")]
		public Detalle_Compra? Detalle_Compra { get; set; }
		//[ManyToOne(TableName = "Cat_Producto", KeyColumn = "Id_Producto", ForeignKeyColumn = "Id_Producto")]
		//public Cat_Producto? Cat_Producto { get; set; }

		//[OneToMany(TableName = "Tbl_Transaccion", KeyColumn = "Id_Lote", ForeignKeyColumn = "Id_Lote")]
		public List<Tbl_Transaccion>? lotes { get; set; }

		public static string GenerarLote()
		{
			string fechaLote = DateTime.Now.ToString("yyyyMMddHHmmss");
			string caracteresPermitidos = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
			Random random = new Random();
			string parteAleatoria = new string(Enumerable.Repeat(caracteresPermitidos, 3)
											.Select(s => s[random.Next(s.Length)]).ToArray());
			string codigoLote = fechaLote + parteAleatoria;
			return codigoLote;
		}

		internal object? DarDeBaja(string identify, Tbl_Transaccion transaccion)
		{
			try
			{
				if (transaccion.Id_Lote == null || transaccion.Cantidad == null || transaccion.Descripcion == null)
				{
					return new ResponseService()
					{
						status = 403,
						message = "Lote, Canitidad y Descripcion son requeridos"
					};
				}
				Tbl_Lotes? loteOriginal = new Tbl_Lotes { Id_Lote = transaccion.Id_Lote }.Find<Tbl_Lotes>();
				var User = AuthNetCore.User(identify);
				var dbUser = new Security_Users { Id_User = User.UserId }.Find<Security_Users>();
				if (loteOriginal == null || loteOriginal.Cantidad_Existente > transaccion.Cantidad)
				{
					return new ResponseService()
					{
						status = 403,
						message = "Existencia no existe"
					};
				}
				loteOriginal.Cantidad_Existente -= transaccion.Cantidad;
				transaccion.Id_User = User.UserId;
				transaccion.Tipo = TransactionsType.BAJA_DE_EXISTENCIA.ToString();

				BeginGlobalTransaction();
				loteOriginal.Update();
				transaccion.Save();
				CommitGlobalTransaction();
				return new ResponseService()
				{
					status = 200,
					message = "Baja exitosa"
				};
			}
			catch (System.Exception ex)
			{
				RollBackGlobalTransaction();
				LoggerServices.AddMessageError("Error en dar de baja", ex);
				return new ResponseService()
				{
					status = 500,
					message = "Error en dar de baja",
					body = ex
				};
			}

		}

		internal List<Tbl_Lotes>? GetLotes(string? Identify)
		{
			var User = AuthNetCore.User(Identify);
			var dbUser = new Security_Users { Id_User = User.UserId }.Find<Security_Users>();
			if (User.isAdmin)
			{
				return Where<Tbl_Lotes>(
					FilterData.Greater("Cantidad_Existente", 0)
				);
			}
			else if (AuthNetCore.HavePermission(Identify, CAPA_DATOS.Security.Permissions.GESTION_LOTES))
			{
				Id_Sucursal = dbUser?.Id_Sucursal;
				return Where<Tbl_Lotes>(
					FilterData.Greater("Cantidad_Existente", 0)
				);
			}
			else
			{
				return Where<Tbl_Lotes>(
					FilterData.Equal("Id_Sucursal", dbUser?.Id_Sucursal),
					FilterData.Greater("Cantidad_Existente", 0)
				);
			}
		}
	}

	public class EtiquetaLote
	{
		public EtiquetaLote()
		{
			this.TasaCambio = new Catalogo_Cambio_Divisa().Get<Catalogo_Cambio_Divisa>().First();
			this.Intereses = new Transactional_Configuraciones().GetIntereses();
		}
		
		public string? Articulo { get; set; }
		public string? Tipo { get; set; }
		public double? Precio_compra_dolares { get; set; }
		public int? N_Cuotas { get; set; }
		public string? Codigo { get; set; }
		public DateTime? Enviado_Liquidacion { get; set; }
		public double PorcentajesUtilidad { get; set; }
		public double PorcentajesApartado { get; set; }
		public double PorcentajeAdicional { get; set; }
		public Catalogo_Cambio_Divisa TasaCambio { get; }
		public List<Transactional_Configuraciones> Intereses { get; }

		//public double? Precio_venta_Contado_cordobas { }
		public double? Precio_venta_Contado_dolares
		{
			get
			{
				return Precio_compra_dolares + (Precio_compra_dolares * ((PorcentajesUtilidad + PorcentajeAdicional) / 100));
			}
		}
		//public double? Precio_venta_Apartado_cordobas { get;  set; }
		public double? Precio_venta_Apartado_dolares
		{
			get
			{
				return Precio_compra_dolares + (Precio_compra_dolares * ((PorcentajesApartado + PorcentajeAdicional) / 100));
			}
		}
		//public double? Apartado_quincenal_cordobas { get; set; }
		public double? Cuota_apartado_quincenal_dolares { get { return Precio_venta_Apartado_dolares / N_Cuotas; } }
		//public double? Apartado_mensual_cordobas { get; set; }
		public double? Cuota_apartado_mensual_dolares
		{
			get
			{
				return CuotasModule.GetPago(Precio_venta_Apartado_dolares,
					N_Cuotas,
					Intereses.Sum(i => Convert.ToDouble(i.Valor)));
			}
		}
		/*[OnDeserialized]
		internal void OnDeserializedMethod(StreamingContext context)
		{
			// Recalcula las propiedades calculadas
			var _0 = Precio_venta_Contado_dolares;
			var _1 = Precio_venta_Apartado_dolares;
			var _2 = Cuota_apartado_quincenal_dolares;
			var _3 = Cuota_apartado_mensual_dolares;
		}*/
		
	}

	public enum TransactionsType
	{
		BAJA_DE_EXISTENCIA
	}
}
