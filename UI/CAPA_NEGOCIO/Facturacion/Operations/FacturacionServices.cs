using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Controllers;
using CAPA_DATOS;
using CAPA_NEGOCIO.Services;
using DataBaseModel;
using Financial;
using Model;
using Transactions;
using UI.CAPA_NEGOCIO.Empresa.Services.Recibos;

namespace UI.CAPA_NEGOCIO.Facturacion.Operations
{
	public class FacturacionServices : TransactionalClass
	{
		internal ResponseService? SaveFactura(string? Identity, Tbl_Factura? factura)
		{
			try
			{
				BeginGlobalTransaction();
				var response = DoSaveFactura(Identity, factura);
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
					body = factura
				};
			}

		}

		private ResponseService DoSaveFactura(string? Identity, Tbl_Factura? factura)
		{
			var User = AuthNetCore.User(Identity);
			var dbUser = new Security_Users { Id_User = User.UserId }.Find<Security_Users>();
			if (factura?.Detalle_Factura == null || !factura.Detalle_Factura.Any())
			{
				return new ResponseService
				{
					status = 400,
					message = "La factura debe tener al menos un detalle",
					body = factura
				};
			}
			if (factura.Cliente == null)
			{
				return new ResponseService
				{
					status = 400,
					message = "El cliente es requerido",
					body = factura
				};
			}
			else if (new Catalogo_Clientes { codigo_cliente = factura.Cliente.codigo_cliente ?? -1 }.Find<Catalogo_Clientes>() == null)
			{
				factura.Cliente.Save();
			}
			factura.Id_User = User.UserId;
			factura.Id_Sucursal = dbUser?.Id_Sucursal;
			factura.Id_Cliente = factura.Cliente.codigo_cliente;
			factura.Estado = EstadoEnum.ACTIVO.ToString();
			double totalSubTotal = 0;
			double totalIva = 0;
			double totalFactura = 0;
			double totalDescuento = 0;
			factura.Codigo_venta = GenerateCode();

			foreach (var detalle in factura.Detalle_Factura)
			{
				switch (factura.Tipo)
				{
					case "VENTA":
						detalle.Precio_Venta = detalle.Lote?.EtiquetaLote?.Precio_venta_Contado_dolares;
						break;
					case "APARTADO_MENSUAL":
					case "APARTADO_QUINCENAL":
						detalle.Precio_Venta = detalle.Lote?.EtiquetaLote?.Precio_venta_Apartado_dolares;
						break;
					default:
						break;
				}
				var subtotal = detalle.Cantidad * detalle.Precio_Venta;
				var montoDescuento = subtotal * ((detalle.Descuento ?? 0) / 100);
				var subTotalCalculado = subtotal - montoDescuento;
				var ivaCalculado = subTotalCalculado * 0;
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
						body = factura
					};
				}
				loteOriginal.Cantidad_Existente -= detalle.Cantidad;
				loteOriginal.Update();
			}

			factura.Iva = totalIva;
			factura.Sub_Total = factura.Tipo == "VENTA" ? totalSubTotal : totalSubTotal - factura.Datos_Financiamiento?.Total_Financiado ?? 0;
			factura.TotalDescuento = totalDescuento;
			factura.Total = factura.Sub_Total + factura.Iva;

			factura.Fecha = DateTime.Now;
			factura.Datos = new DatosFactura
			{
				Nombre_Cliente = factura.Cliente?.Nombre_Completo,
				Nombre_Vendedor = dbUser?.Nombres,
				Direccion_Cliente = factura.Cliente?.direccion,
				Telefono_Cliente = factura.Cliente?.telefono

			};
			Transaction_Contratos? contract = null;
			switch (factura.Tipo)
			{
				case "VENTA":
					if (factura.Monto_dolares < factura.Total)
					{
						return new ResponseService()
						{
							status = 400,
							message = "El monto debe ser equivalente al total"
						};
					}
					factura.Total_Pagado = factura.Total;
					break;
				case "APARTADO_MENSUAL":
				case "APARTADO_QUINCENAL":
					bool isQuincenal = factura.Tipo == "APARTADO_QUINCENAL";
					if (!isQuincenal && factura.Monto_dolares < Math.Round(factura.Total.GetValueOrDefault() * 0.35, 2))
					{
						return new ResponseService()
						{
							status = 400,
							message = "El monto debe ser equivalente como minimo al 35% del total"
						};
					}
					else if (isQuincenal && factura.Monto_dolares < Math.Round(factura.Total.GetValueOrDefault() * 0.25, 2))
					{
						return new ResponseService()
						{
							status = 400,
							message = "El monto debe ser equivalente como minimo al 25% del total"
						};
					}
					factura.Total_Pagado = factura.Monto_dolares;
					factura.Total_Financiado = factura.Datos_Financiamiento?.Total_Financiado;
					var (contractResponse, contrato) = GenerarContratoFinanciamiento(Identity, factura, isQuincenal);


					if (contractResponse.status != 200)
					{
						return contractResponse;
					}
					else
					{
						factura.Datos_Financiamiento!.Numero_Contrato
							= contrato.Transaction_Contratos?.numero_contrato;
						contract = contrato.Transaction_Contratos;
						Tbl_Cuotas? cuota = new Tbl_Cuotas().Find<Tbl_Cuotas>(
							FilterData.Equal("numero_contrato", contrato?.Transaction_Contratos?.numero_contrato),
							FilterData.Equal("estado", Contratos_State.CAPITAL_CANCELADO.ToString())
						);
						var cuotasPendientes = contrato?.Transaction_Contratos?.Tbl_Cuotas.Where(c => c.Estado?.ToUpper() == EstadoEnum.PENDIENTE.ToString()).ToList();


						Transaccion_Factura transaccion_Factura = new Transaccion_Factura
						{
							fecha = DateTime.Now,
							numero_contrato = contract?.numero_contrato,
							Moneda = factura.Moneda,
							total = factura.Monto_dolares,
							total_cordobas = factura.Monto_cordobas,
							id_usuario = User.UserId,
							tasa_cambio = factura.Tasa_Cambio_Venta,
							Factura_contrato = new Factura_contrato()
							{
								numero_contrato = contrato?.Transaction_Contratos?.numero_contrato,
								cuotas_pactadas = contrato?.Transaction_Contratos?.Tbl_Cuotas.Count(),
								cuotas_pendientes = cuotasPendientes.Count(),
								saldo_anterior = contrato?.Transaction_Contratos?.saldo,
								saldo_actual = contrato?.Transaction_Contratos?.saldo,
								abono_capital = factura.Monto_dolares,
								interes_pagado = 0,
								mora_pagado = 0,
								//id_clasificacion_interes_anterior = id_clasificacion_interes_anterior,
								reestructurado_anterior = 0,
								//mora = this.mora_dolares,
								interes_demas_cargos_pagar = 0,
								proximo_pago_pactado = cuotasPendientes.Count > 0 ? cuotasPendientes[0].fecha : null,
								//total_parciales = this.total_parciales,//todo preguntar a EMPRESA 
								tipo = null,
								tipo_cuenta = null,
								total = factura.Monto_dolares,
								tasa_cambio = factura.Tasa_Cambio_Venta,
								id_cliente = contrato?.Transaction_Contratos?.codigo_cliente,
								id_sucursal = dbUser?.Id_Sucursal,
								reestructuracion = 0,
								perdida_de_documento = 0,
								total_pagado = factura.Monto_dolares,
								cancel_with_perdida = false,
								Solo_Interes_Mora = false
							},
							concepto = $"pago de apartado en contrato No. {contract?.numero_contrato}",
							Detalle_Factura_Recibo = [new Detalle_Factura_Recibo
							{
								total_cuota = cuota?.total,
								monto_pagado = cuota?.total,
								capital_restante = cuota?.capital_restante,
								id_cuota = cuota?.id_cuota,
								concepto = $"{cuota?.id_cuota?.ToString("D9")}",
								tasa_cambio = factura?.Tasa_Cambio,
							}]
						};
						transaccion_Factura.id_factura = ((Transaccion_Factura?)transaccion_Factura.Save())?.id_factura;
						factura.Datos_Financiamiento!.Id_recibo = transaccion_Factura.id_factura;

						contrato!.Transaction_Contratos!.Recibos = [transaccion_Factura];
					}
					break;
				default:
					break;
			}

			factura?.Save();
			var cuentaDestino = Catalogo_Cuentas.GetCuentaIngresoRecibos(dbUser);
			var cuentaOrigen = Catalogo_Cuentas.GetCuentaEgresoRecibos(dbUser);
			if (cuentaDestino == null || cuentaOrigen == null)
			{
				return new ResponseService()
				{
					status = 400,
					message = "Cuentas no configuradas correctamente"
				};
			}
			string detalleT = $"Venta de producto, factura: {factura?.Id_Factura} al cliente {factura.Cliente?.Nombre_Completo}";
			ResponseService response = new Movimientos_Cuentas
			{
				Catalogo_Cuentas_Destino = cuentaDestino,
				Catalogo_Cuentas_Origen = cuentaOrigen,
				concepto = detalleT,
				descripcion = detalleT,
				moneda = factura.Moneda?.ToUpper(),
				monto = factura.Total,
				tasa_cambio = factura.Tasa_Cambio,
				//tasa_cambio_compra = factura.Tasa_Cambio_Venta,
				is_transaction = true,

			}.SaveMovimiento(Identity);
			if (response.status == 400) return response;
			return new ResponseService
			{
				status = 200,
				message = "Factura guardada con éxito",
				body = new
				{
					factura,
					Contract = ContractTemplateService.GetContractContent(contract),
					Transaction_Contratos = contract,
					Recibo = new RecibosTemplateServices().GenerateReciboHtmlTemplate(contract?.Recibos?[0])
				}
			};
		}



		private (ResponseService, ContractServices) GenerarContratoFinanciamiento(string? Identity, Tbl_Factura factura, bool isQuincenal = false)
		{
			var contrato = new ContractServices();
			// @ts-ignore
			contrato.valoraciones = factura.Detalle_Factura?.Select(detalle => detalle.Lote?.Datos_Producto
				?? new Transactional_Valoracion()).ToList();

			contrato.Transaction_Contratos = new Transaction_Contratos
			{
				tasas_interes = isQuincenal ? 0 : GetTasaInteresContratoMensual(),
				fecha = DateTime.Now,
				plazo = factura.Datos_Financiamiento?.Plazo ?? 1,
				taza_cambio = factura.Tasa_Cambio_Venta,
				taza_cambio_compra = factura.Tasa_Cambio_Venta,
				Catalogo_Clientes = GetCliente(factura.Id_Cliente),
				tipo = isQuincenal ? Contratos_Type.APARTADO_QUINCENAL.ToString() : Contratos_Type.APARTADO_MENSUAL.ToString(),
				gestion_crediticia = 0,
				monto = factura.Datos_Financiamiento?.Total_Financiado,
				saldo = factura.Datos_Financiamiento?.Total_Financiado,
				Valoracion_empeño_dolares = factura.Datos_Financiamiento?.Total_Financiado,
				Valoracion_empeño_cordobas = factura.Datos_Financiamiento?.Total_Financiado_Cordobas,
				cuotafija = factura.Datos_Financiamiento?.Cuota_Fija_Cordobas,
				cuotafija_dolares = factura.Datos_Financiamiento?.Cuota_Fija_Dolares,
				Detail_Prendas = factura.Detalle_Factura?.Select(detalle =>
				{
					var valoracion = detalle.Lote?.Datos_Producto;
					return new Detail_Prendas
					{
						Descripcion = valoracion?.Descripcion,
						modelo = valoracion?.Modelo,
						marca = valoracion?.Marca,
						serie = valoracion?.Serie,
						monto_aprobado_cordobas = valoracion?.Valoracion_empeño_cordobas,
						monto_aprobado_dolares = valoracion?.Valoracion_empeño_dolares,
						color = "-",
						en_manos_de = "ACREEDOR",
						precio_venta = valoracion?.Precio_venta_empeño_dolares,
						Catalogo_Categoria = valoracion?.Catalogo_Categoria,
						Transactional_Valoracion = valoracion
					};
				}).ToList()
			};
			contrato.Transaction_Contratos.Tbl_Cuotas = contrato.Transaction_Contratos.CrearCuotas(factura.Total_Financiado ?? 0, factura.Datos_Financiamiento?.Plazo ?? 1, false, false);
			contrato.Transaction_Contratos.Tbl_Cuotas.Insert(0, new Tbl_Cuotas
			{
				Estado = Contratos_State.CAPITAL_CANCELADO.ToString(),
				fecha = DateTime.Now,
				total = factura.Total,
				interes = 0,
				abono_capital = factura.Total,
				capital_restante = factura.Datos_Financiamiento?.Total_Financiado,
				tasa_cambio = factura.Tasa_Cambio_Venta,
				numero_contrato = contrato.Transaction_Contratos.numero_contrato
			});
			return (contrato.DoSaveContract(Identity), contrato);
		}

		private double? GetTasaInteresContratoMensual()
		{
			var Intereses = new Transactional_Configuraciones().GetIntereses();
			return Intereses
					.Where(x => !x.Nombre!.Equals(InteresesPrestamosEnum.GASTOS_ADMINISTRATIVOS.ToString()))?
					.Select(I => Convert.ToDouble(I.Valor)).Sum() / 100;
		}

		private static Catalogo_Clientes? GetCliente(int? id_Cliente)
		{
			return new Catalogo_Clientes { codigo_cliente = id_Cliente ?? -1 }.Find<Catalogo_Clientes>();
		}

		private string? GenerateCode()
		{
			return "";
		}

		public static ResponseService? FindFacturaContrato(Tbl_Factura factura)
		{
			Transaction_Contratos? contract = new Transaction_Contratos { numero_contrato = factura?.Datos_Financiamiento?.Numero_Contrato }.Find<Transaction_Contratos>();
			string contractData = contract != null ? ContractTemplateService.GetContractContent(contract) : "";
			Transaccion_Factura? transaccion_Factura = new Transaccion_Factura { id_factura = factura?.Datos_Financiamiento?.Id_recibo }.Find<Transaccion_Factura>();

			return new ResponseService
			{
				status = 200,
				message = "Factura guardada con éxito",
				body = new
				{
					factura,
					Contract = contractData,
					Contrato = contract,
					Recibo = new RecibosTemplateServices().GenerateReciboHtmlTemplate(transaccion_Factura)

				}
			};
		}

	}
}