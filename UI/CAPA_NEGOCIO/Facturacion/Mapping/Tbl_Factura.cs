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

		[JsonProp]
		public DatosFactura? Datos { get; set; }

		//[ManyToOne(TableName = "Catalogo_Clientes", KeyColumn = "codigo_cliente", ForeignKeyColumn = "Id_Cliente")]
		public ClientDataBaseModel.Catalogo_Clientes? Cliente { get; set; }

		[OneToMany(TableName = "Detalle_Factura", KeyColumn = "Id_Factura", ForeignKeyColumn = "Id_Factura")]
		public List<Detalle_Factura>? Detalle_Factura { get; set; }

		internal ResponseService? SaveFactura(string? Identity)
		{
			try
			{
				BeginGlobalTransaction();
				var response = DoSaveFactura(Identity);
				if (response.status != 200)
				{
					RollBackGlobalTransaction();
				}
				else
				{
					CommitGlobalTransaction();
				}
				return response;
			}
			catch (System.Exception ex)
			{
				RollBackGlobalTransaction();
				LoggerServices.AddMessageError($"Error al guardar la factura: {ex.Message}", ex);
				return new ResponseService
				{
					status = 500,
					message = ex.Message,
					body = this
				};
			}

		}

		private ResponseService DoSaveFactura(string? Identity)
		{
			var User = AuthNetCore.User(Identity);
			var dbUser = new Security_Users { Id_User = User.UserId }.Find<Security_Users>();
			if (Detalle_Factura == null || !Detalle_Factura.Any())
			{
				return new ResponseService
				{
					status = 400,
					message = "La factura debe tener al menos un detalle",
					body = this
				};
			}
			if (Cliente == null)
			{
				return new ResponseService
				{
					status = 400,
					message = "El cliente es requerido",
					body = this
				};
			}
			else if (new Catalogo_Clientes { codigo_cliente = Cliente.codigo_cliente ?? -1 }.Find<Catalogo_Clientes>() == null)
			{
				Cliente.Save();
			}
			this.Id_User = User.UserId;
			this.Id_Sucursal = dbUser?.Id_Sucursal;
			this.Id_Cliente = Cliente.codigo_cliente;
			double totalSubTotal = 0;
			double totalIva = 0;
			double totalFactura = 0;
			double totalDescuento = 0;
			Codigo_venta = GenerateCode();

			foreach (var detalle in Detalle_Factura)
			{
				var subtotal = detalle.Cantidad * detalle.Lote?.Precio_Venta;
				var montoDescuento = subtotal * ((detalle.Descuento ?? 0) / 100);
				var subTotalCalculado = subtotal - montoDescuento;
				var ivaCalculado = subTotalCalculado * 0.15;
				var totalCalculado = subTotalCalculado + ivaCalculado;

				detalle.Sub_Total = subTotalCalculado;
				detalle.Iva = ivaCalculado;
				detalle.Total = totalCalculado;
				detalle.Monto_Descuento = montoDescuento;

				totalSubTotal += subTotalCalculado ?? 0;
				totalIva += ivaCalculado ?? 0;
				totalFactura += totalCalculado ?? 0;
				totalDescuento += montoDescuento ?? 0;
				var loteOriginal = detalle.Lote?.Find<Tbl_Lotes>();
				if (loteOriginal == null || loteOriginal.Cantidad_Existente < detalle.Cantidad)
				{
					return new ResponseService
					{
						status = 400,
						message = $"No hay suficiente cantidad en el lote {detalle.Lote?.Id_Lote}",
						body = this
					};
				}
				loteOriginal.Cantidad_Existente -= detalle.Cantidad;
				loteOriginal.Update();
			}

			this.Total = totalFactura;
			this.Iva = totalIva;
			this.Sub_Total = totalSubTotal;
			this.TotalDescuento = totalDescuento;
			Fecha = DateTime.Now;
			this.Datos = new DatosFactura
			{
				Nombre_Cliente = Cliente?.Nombre_Completo,
				Nombre_Vendedor = dbUser?.Nombres,
				Direccion_Cliente = Cliente?.direccion,
				Telefono_Cliente = Cliente?.telefono

			};
			Save();
			var cuentaDestino = Catalogo_Cuentas.GetCuentaIngresoRecibos(dbUser);
			var cuentaOrigen = Catalogo_Cuentas.GetCuentaEgresoRecibos(dbUser);
			if (cuentaDestino == null || cuentaOrigen == null)
			{
				RollBackGlobalTransaction();
				return new ResponseService()
				{
					status = 400,
					message = "Cuentas no configuradas correctamente"
				};
			}
			string detalleT = $"Venta de producto, factura: {Id_Factura} al cliente {Cliente?.Nombre_Completo}";
			ResponseService response = new Movimientos_Cuentas
			{
				Catalogo_Cuentas_Destino = cuentaDestino,
				Catalogo_Cuentas_Origen = cuentaOrigen,
				concepto = detalleT,
				descripcion = detalleT,
				moneda = this.Moneda?.ToUpper(),
				monto = this.Total,
				tasa_cambio = this.Tasa_Cambio,
				//tasa_cambio_compra = this.Tasa_Cambio_Venta,
				is_transaction = true,

			}.SaveMovimiento(Identity);
			if (response.status == 400) return response;
			return new ResponseService
			{
				status = 200,
				message = "Factura guardada con éxito",
				body = this
			};
		}

        private string? GenerateCode()
        {
            return "";
        }
    }

	public class DatosFactura
	{
		public string? Nombre_Vendedor { get; set; }
		public string? Nombre_Cliente { get; set; }
		public string? Direccion_Cliente { get; set; }
		public string? Telefono_Cliente { get; set; }
	}
}
