using API.Controllers;
using CAPA_DATOS;
using CAPA_DATOS.BDCore;
using CAPA_NEGOCIO.Services;
using DataBaseModel;
using iText.Kernel.Pdf.Annot.DA;
using Model;

namespace Transactions
{
	public class Recibos : EntityClass
	{
		[PrimaryKey(Identity = true)]
		public int? id_recibo { get; set; }
		public int? consecutivo { get; set; }
		public bool? temporal { get; set; }
		public int? numero_contrato { get; set; }
		public double? monto { get; set; }
		public double? saldo_actual_cordobas { get; set; }
		public double? saldo_actual_dolares { get; set; }
		public double? plazo { get; set; }
		public double? interes_cargos { get; set; }
		public double? tasa_cambio { get; set; }
		public double? tasa_cambio_compra { get; set; }
		public double? interes_demas_cargos_pagar_cordobas { get; set; }
		public double? interes_demas_cargos_pagar_dolares { get; set; }
		public double? abono_capital_cordobas { get; set; }
		public double? abono_capital_dolares { get; set; }
		public double? cuota_pagar_cordobas { get; set; }
		public double? cuota_pagar_dolares { get; set; }
		public double? mora_cordobas { get; set; }
		public double? mora_dolares { get; set; }
		public double? mora_interes_cordobas { get; set; }
		public double? mora_interes_dolares { get; set; }
		public double? total_cordobas { get; set; }
		public double? total_dolares { get; set; }
		public double? total_parciales { get; set; }
		public DateTime? fecha_roc { get; set; }
		public double? paga_cordobas { get; set; }
		public double? paga_dolares { get; set; }
		public bool? solo_abono { get; set; }
		public bool? cancelar { get; set; }
		public bool? reestructurar { get; set; }
		public double? reestructurar_value { get; set; }
		public double? total_apagar_dolares { get; set; }
		public string? moneda { get; set; }
		public bool? perdida_de_documento { get; set; }


		public object? SaveRecibos(string token)
		{
			try
			{
				var user = AuthNetCore.User(token);
				var dbUser = new Security_Users { Id_User = user.UserId }.Find<Security_Users>();
				var contrato = new Transaction_Contratos() { numero_contrato = this.numero_contrato }.Find<Transaction_Contratos>();
				if (contrato == null)
				{
					return new ResponseService()
					{
						status = 400,
						message = "Nº contrato no encontrado"
					};
				}
				if (this.cancelar.HasValue && this.cancelar.Value && this.paga_dolares < contrato.saldo)
				{
					return new ResponseService()
					{
						status = 400,
						message = "Para cancelar es necesario un monto de " + contrato.saldo
					};
				}
				double monto = (double)this.paga_dolares;
				BeginGlobalTransaction();

				var DetallesFacturaRecibos = new List<Detalle_Factura_Recibo>();
				//SE VALIDA SI AL MONTO SE LE VA A DEBITAR LA REESTRUCTURACION Y LA PERDIDA DE DOCUMENTOS                
				monto = CalcularGastosAdicionales(contrato, monto, DetallesFacturaRecibos);

				var cuotasPendientes = contrato.Tbl_Cuotas.Where(c => c.Estado?.ToUpper() == "PENDIENTE").ToList();
				Tbl_Cuotas CuotaActual = cuotasPendientes.Last();
				double? mora = cuotasPendientes?.Select(c => c.mora).ToList().Sum();
				double? saldo_pendiente = contrato.saldo;
				double? interesCorriente = CuotaActual?.interes;
				double? perdida_de_documento_monto = this.perdida_de_documento == true ? 1 : 0;
				double? reestructuracion_monto = reestructurar_value ?? 0;
				double? total_capital_restante = mora
					+ saldo_pendiente
					+ interesCorriente
					+ perdida_de_documento_monto
					+ reestructuracion_monto;
				double? abonoCapital = monto - interesCorriente;
				double? saldoRespaldo = contrato.saldo;
				contrato.saldo = contrato.saldo - abonoCapital;
				if (contrato.saldo <= 0)
				{
					contrato.saldo = 0;
					contrato.estado = Contratos_State.CANCELADO.ToString();
				}

				if (this.cancelar == true && monto == total_capital_restante)
				{
					monto = CancelarCuotaActual(monto, CuotaActual, DetallesFacturaRecibos);
					contrato.saldo = 0;
					contrato.estado = Contratos_State.CANCELADO.ToString();
					cuotasPendientes?.ForEach(cuota =>
					{
						if (cuota.id_cuota == CuotaActual.id_cuota) return;
						TblCuotas estadoAnterior = CloneCuota(cuota);
						cuota.pago_contado = cuota.abono_capital;
						AgregarCuotaDetalle(cuota, DetallesFacturaRecibos, estadoAnterior,
						"Pago de completo de cuota, en la cancelación de contrato No: " + this.numero_contrato);
						cuota.Estado = Contratos_State.CANCELADO.ToString();
					});
				}
				else
				{
					monto = CancelarCuotaActual(monto, CuotaActual, DetallesFacturaRecibos);
					if (monto > 0)
					{
						//UpdateCuotas(contrato);
						cuotasPendientes?.ForEach(cuota =>
						{
							if (cuota.id_cuota == CuotaActual.id_cuota) return;
							if (monto <= 0) return;
							TblCuotas estadoAnterior = CloneCuota(cuota);
							cuota.fecha_pago = DateTime.Now;
							if (monto >= cuota.abono_capital && monto > 0)
							{
								cuota.pago_contado = cuota.abono_capital;
								cuota.abono_capital = 0;
								cuota.total = 0;
								monto -= cuota.abono_capital.GetValueOrDefault();
								cuota.Estado = Contratos_State.CANCELADO.ToString();
								cuota.interes = 0;
							}
							else
							{
								cuota.pago_contado = monto;
								cuota.abono_capital += -monto;
								monto = 0;
								cuota.interes = cuota.abono_capital * contrato.tasas_interes;
								cuota.total = cuota.interes + cuota.abono_capital;
							}
							AgregarCuotaDetalle(cuota, DetallesFacturaRecibos, estadoAnterior,
								"Abono al capital del contrato No: " + this.numero_contrato);
							cuota.Update();
						});
					}
				}
				contrato.Update();
				//fecha de proximo pago
				var cuotasPendiente = new Tbl_Cuotas
				{
					numero_contrato = contrato.numero_contrato,
					Estado = "PENDIENTE"
				}.Get<Tbl_Cuotas>();

				//guardado de factura
				var factura = new Transaccion_Factura()
				{
					tipo = "RECIBO", //TODO ENUM
					estado = EstadoEnum.ACTIVO.ToString(),
					concepto = "Pago de cuota contrato No: " + this.numero_contrato,
					tasa_cambio = this.tasa_cambio,
					total = this.paga_dolares,
					id_cliente = contrato.codigo_cliente,
					id_sucursal = dbUser.Id_Sucursal,
					fecha = DateTime.Now,
					Moneda = moneda,
					total_cordobas = paga_cordobas,
					id_usuario = user.UserId,
					Factura_contrato = new Factura_contrato()
					{
						numero_contrato = this.numero_contrato,
						cuotas_pactadas = contrato.Tbl_Cuotas.Count(),
						cuotas_pendientes = cuotasPendiente.Count(),
						saldo_anterior = saldoRespaldo,
						saldo_actual = contrato.saldo,
						mora = this.mora_dolares,
						interes_demas_cargos_pagar = this.interes_demas_cargos_pagar_dolares,
						proximo_pago_pactado = cuotasPendiente.Count > 0 ? cuotasPendiente[0].fecha : null,
						total_parciales = this.total_parciales,//todo preguntar a EMPRESA 
						tipo = null,
						tipo_cuenta = null,
						total = this.total_dolares,
						tasa_cambio = this.tasa_cambio,
						id_cliente = contrato.codigo_cliente,
						id_sucursal = dbUser.Id_Sucursal,
						reestructuracion = this.reestructurar == true ? 1 : 0,
						total_pagado = this.total_apagar_dolares
					},
					Detalle_Factura_Recibo = DetallesFacturaRecibos
				};
				factura.Save();
				var cuentaDestino = new Catalogo_Cuentas()
				{
					id_categoria = 1,
					id_sucursal = dbUser.Id_Sucursal
				}.Find<Catalogo_Cuentas>();

				var cuentaOrigen = new Catalogo_Cuentas()
				{
					id_sucursal = dbUser.Id_Sucursal,
					id_categoria = 6
				}.Find<Catalogo_Cuentas>();

				if (cuentaDestino == null || cuentaOrigen == null)
				{
					RollBackGlobalTransaction();
					return new ResponseService()
					{
						status = 400,
						message = "Cuentas no configuradas correctamente"
					};
				}
				ResponseService response = new Movimientos_Cuentas
				{
					Catalogo_Cuentas_Destino = cuentaDestino,
					Catalogo_Cuentas_Origen = cuentaOrigen,
					concepto = "Pago de cuota, contrato No: " + this.numero_contrato,
					descripcion = "Pago de cuota, contrato No: " + this.numero_contrato,
					moneda = this.moneda,
					monto = this.moneda?.ToUpper() == "DOLARES" ? this.paga_dolares : this.paga_cordobas,
					tasa_cambio = this.tasa_cambio,
					tasa_cambio_compra = this.tasa_cambio_compra,
					is_transaction = true
				}.SaveMovimiento(token);

				if (response.status == 400)
				{
					RollBackGlobalTransaction();
					return response;
				}
				CommitGlobalTransaction();
				return new ResponseService()
				{
					status = 200,
					message = "Factura registrada correctamente",
					body = factura
				};

			}
			catch (System.Exception ex)
			{
				RollBackGlobalTransaction();
				return new ResponseService()
				{
					message = "Error:" + ex.ToString(),
					status = 400
				};
			}

		}

		private void AgregarCuotaDetalle(Tbl_Cuotas cuota,
		List<Detalle_Factura_Recibo> DetallesFacturaRecibos,
		TblCuotas estadoAnterior,
		string mensaje)
		{
			DetallesFacturaRecibos.Add(new Detalle_Factura_Recibo()
			{
				id_cuota = cuota.id_cuota,
				total_cuota = cuota.pago_contado,
				monto_pagado = cuota.pago_contado,
				capital_restante = cuota.capital_restante,
				concepto = mensaje,
				tasa_cambio = this.tasa_cambio,
				EstadoAnterior = estadoAnterior
			});
		}

		private double CancelarCuotaActual(double monto, Tbl_Cuotas CuotaActual, List<Detalle_Factura_Recibo> detallesFacturaRecibos)
		{
			TblCuotas estadoAnterior = CloneCuota(CuotaActual);
			CuotaActual.fecha_pago = DateTime.Now;
			if (monto >= CuotaActual.total && monto > 0)
			{
				CuotaActual.pago_contado = CuotaActual.total;
				monto -= (double)CuotaActual.total;
				CuotaActual.Estado = Contratos_State.CANCELADO.ToString();
			}
			else
			{
				CuotaActual.pago_contado = monto;
				monto = 0;
			}

			AgregarCuotaDetalle(CuotaActual, detallesFacturaRecibos, estadoAnterior,
			"Pago de cuota del contrato No: " + this.numero_contrato);
			CuotaActual.Update();
			return monto;
		}

		private TblCuotas CloneCuota(Tbl_Cuotas CuotaActual)
		{
			return new TblCuotas()
			{
				fecha_pago = CuotaActual.fecha_pago,
				pago_contado = CuotaActual.pago_contado,
				Estado = CuotaActual.Estado,
				total = CuotaActual.total,
				interes = CuotaActual.interes,
				abono_capital = CuotaActual.abono_capital
			};
		}

		private double CalcularGastosAdicionales(Transaction_Contratos? contrato, double monto, List<Detalle_Factura_Recibo>? DetallesFacturaRecibos)
		{
			if (this.reestructurar == true)
			{
				monto = monto - 1;
				contrato.Reestructurar(this.reestructurar_value);
				DetallesFacturaRecibos?.Add(
					new Detalle_Factura_Recibo()
					{
						total_cuota = 1,
						monto_pagado = 1,
						capital_restante = 0,
						concepto = "Pago por tramite de reestructuración de cuota",
						tasa_cambio = this.tasa_cambio
					}
				);
			}
			if (this.perdida_de_documento == true)
			{
				monto = monto - 1;
				DetallesFacturaRecibos?.Add(
					new Detalle_Factura_Recibo()
					{
						total_cuota = 1,
						monto_pagado = 1,
						capital_restante = 0,
						concepto = "Pago por tramite de perdida de documentos",
						tasa_cambio = this.tasa_cambio
					}
				);
			}
			return monto;
		}

		public object? AnularFactura(string token)
		{
			try
			{
				var user = AuthNetCore.User(token);
				var dbUser = new Security_Users { Id_User = user.UserId }.Find<Security_Users>();
				var factura = new Transaccion_Factura() { id_factura = this.id_recibo }.Find<Transaccion_Factura>();

				if (factura == null)
				{
					return new ResponseService()
					{
						status = 400,
						message = "Recibo no encontrado"
					};
				}
				if (factura.estado != EstadoEnum.ACTIVO.ToString())
				{
					return new ResponseService()
					{
						status = 400,
						message = "Recibo no se encuentra activo"
					};
				}
				factura.estado = EstadoEnum.ANULADO.ToString();
				BeginGlobalTransaction();
				factura.Update();
				var contrato = new Transaction_Contratos() { numero_contrato = factura.Factura_contrato.numero_contrato }.Find<Transaction_Contratos>();

				//si existe contrato se debe anular el recibo y regresarse el saldo
				double monto = factura.total.GetValueOrDefault();
				monto = CalcularGastosAdicionales(contrato, monto, null);

				if (contrato != null)
				{
					var saldo = contrato.saldo;
					contrato.saldo += monto;
					contrato.estado = Contratos_State.ACTIVO.ToString();
					contrato.Update();
				}
				foreach (var detalle in factura.Detalle_Factura_Recibo.OrderBy(c => c.id_cuota).ToList())
				{
					Tbl_Cuotas cuota = detalle?.Tbl_Cuotas;
					if (cuota != null)
					{
						cuota.fecha_pago = detalle?.EstadoAnterior?.fecha_pago;
						cuota.pago_contado = detalle?.EstadoAnterior?.pago_contado;
						cuota.Estado = detalle?.EstadoAnterior?.Estado;
						cuota.total = detalle?.EstadoAnterior?.total;
						cuota.interes = detalle?.EstadoAnterior?.interes;
						cuota.abono_capital = detalle?.EstadoAnterior?.abono_capital;
						cuota.Update();
					}
				}
				var cuentaDestino = new Catalogo_Cuentas()
				{
					id_categoria = 6,
					id_sucursal = dbUser.Id_Sucursal
				}.Find<Catalogo_Cuentas>();

				var cuentaOrigen = new Catalogo_Cuentas()
				{
					id_sucursal = dbUser.Id_Sucursal,
					id_categoria = 1
				}.Find<Catalogo_Cuentas>();

				if (cuentaDestino == null || cuentaOrigen == null)
				{
					RollBackGlobalTransaction();
					return new ResponseService()
					{
						status = 400,
						message = "Cuentas para anulación de factura no configuradas correctamente"
					};
				}
				ResponseService response = new Movimientos_Cuentas
				{
					Catalogo_Cuentas_Destino = cuentaDestino,
					Catalogo_Cuentas_Origen = cuentaOrigen,
					concepto = contrato != null ? $"Anulación de cuota No: {factura.no_factura} del contrato No: " + factura.Factura_contrato.numero_contrato : "Anulación de recibo: " + factura.no_factura,
					descripcion = contrato != null ? $"Anulación de cuota No: {factura.no_factura} del contrato No: " + factura.Factura_contrato.numero_contrato : "Anulación de recibo: " + factura.no_factura,
					moneda = "DOLARES",
					monto = this.paga_dolares,
					tasa_cambio = this.tasa_cambio,
					tasa_cambio_compra = this.tasa_cambio_compra,
					//is_anulacion = true,
					is_transaction = true
				}.SaveMovimiento(token);

				if (response.status == 400)
				{
					RollBackGlobalTransaction();
					return response;
				}
				CommitGlobalTransaction();

				return new ResponseService()
				{
					status = 200,
					message = "Recibo anulado correctamente",
					body = factura
				};

			}
			catch (System.Exception ex)
			{
				RollBackGlobalTransaction();
				return new ResponseService()
				{
					message = "Error:" + ex.ToString(),
					status = 400
				};
			}
		}

		public void CrearCuotas(Transaction_Contratos contrato)
		{
			contrato.cuotafija_dolares = GetPago(contrato);
			contrato.cuotafija = contrato.cuotafija_dolares * contrato.taza_cambio;
			double? capital = contrato.Valoracion_empeño_dolares;
			for (int index = 0; index < contrato.plazo; index++)
			{
				double? abono_capital = contrato.cuotafija_dolares
					- (capital * contrato.tasas_interes);
				Tbl_Cuotas cuota = new Tbl_Cuotas
				{
					fecha = contrato.fecha.GetValueOrDefault().AddMonths(index + 1),
					total = contrato.cuotafija_dolares,
					interes = capital * contrato.tasas_interes,
					abono_capital = abono_capital,
					capital_restante = index == contrato.plazo - 1 ? 0 : (capital - abono_capital),
					tasa_cambio = contrato.taza_cambio
				};
				capital = capital - abono_capital;
				contrato.Tbl_Cuotas.Add(cuota);
			}
		}
		public void UpdateCuotas(Transaction_Contratos contrato)//TODO NETODO DE REESTRUCTURACION DE CUOTAS
		{
			var cuotasPendientes = contrato.Tbl_Cuotas.Where(c => c.Estado?.ToUpper() == "PENDIENTE").ToList();
			contrato.cuotafija_dolares = UpdatePago(contrato, cuotasPendientes.Count, this.tasa_cambio);
			contrato.cuotafija = contrato.cuotafija_dolares * contrato.taza_cambio;
			double? capital = contrato.Valoracion_empeño_dolares;

			int index = 0;
			cuotasPendientes.OrderBy(c => c.id_cuota).ToList().ForEach(cuota =>
			{
				double? abono_capital = contrato.cuotafija_dolares
					- (capital * contrato.tasas_interes);
				cuota.fecha = contrato.fecha.GetValueOrDefault().AddMonths(index + 1);
				cuota.total = contrato.cuotafija_dolares;
				cuota.interes = capital * contrato.tasas_interes;
				cuota.abono_capital = abono_capital;
				cuota.capital_restante = index == contrato.plazo - 1 ? 0 : (capital - abono_capital);
				cuota.tasa_cambio = contrato.taza_cambio;
				capital = capital - abono_capital;
				cuota.Update();
				index++;
			});
		}
		public double? GetPago(Transaction_Contratos contrato)
		{
			double? monto = contrato.Valoracion_empeño_dolares;
			int? cuotas = contrato.plazo;
			double? tasa = contrato.tasas_interes;
			double? payment = tasa * Math.Pow((double)(1 + tasa), (double)cuotas) * monto
			/ (Math.Pow((double)(1 + tasa), (double)cuotas) - 1);
			return payment;
		}
		public double? UpdatePago(Transaction_Contratos contrato, int plazo, double? tasaActual)
		{
			double? monto = contrato.saldo;
			int? cuotas = plazo;
			double? tasa = contrato.tasas_interes;
			double? payment = tasa * Math.Pow((double)(1 + tasa), (double)cuotas) * monto
			/ (Math.Pow((double)(1 + tasa), (double)cuotas) - 1);
			return payment;
		}
		public object? PrintRecibo(string token)
		{
			try
			{
				string templateContent = RecibosTemplates.recibo;

				//var recibota = new Recibos() { id_recibo = this.id_recibo }.Find<Recibos>();
				var factura = new Transaccion_Factura() { id_factura = this.id_recibo }.Find<Transaccion_Factura>();
				var contrato = new Transaction_Contratos() { numero_contrato = factura.Factura_contrato.numero_contrato }.Find<Transaction_Contratos>();

				var cliente = contrato?.Catalogo_Clientes?.Find<Catalogo_Clientes>();
				var ultimoDetalle = factura?.Detalle_Factura_Recibo?.OrderByDescending(d => d.id).FirstOrDefault();
				var detalleIds = factura?.Detalle_Factura_Recibo?.Select(d => d.id_cuota.ToString()).ToArray();

				List<Tbl_Cuotas?>? cuotas = factura?.Detalle_Factura_Recibo?.Select(r => r.Tbl_Cuotas).ToList();

				var dbUser = new Security_Users { Id_User = factura.id_usuario }.Find<Security_Users>();

				var sucursal = new Catalogo_Sucursales() { Id_Sucursal = dbUser.Id_Sucursal }.Find<Catalogo_Sucursales>();

				decimal sumaInteres = (decimal)cuotas.Where(c => c.interes.HasValue).Sum(c => c.interes.Value);

				decimal sumaMora = (decimal)cuotas.Where(c => c.mora.HasValue).Sum(c => c.mora.Value);

				var cuotasPendiente = new Tbl_Cuotas { numero_contrato = factura.Factura_contrato.numero_contrato }
					.Where<Tbl_Cuotas>(FilterData.NotIn("id_cuota", detalleIds));
				//new Tbl_Cuotas{}.Get<Tbl_Cuotas>().Count(c => c.id_cuota.HasValue && c.capital_restante > 0);

				double abonoCapitalTotal = factura.Detalle_Factura_Recibo?.Where(d => d.Tbl_Cuotas?.pago_contado == d.Tbl_Cuotas?.total)
					.ToList().Sum(d => d.Tbl_Cuotas?.abono_capital) ?? 0;

				var abonoAlCapitalParcialList = factura.Detalle_Factura_Recibo?
					.Where(d => d.Tbl_Cuotas?.pago_contado != d.Tbl_Cuotas?.total)
					.ToList();
				double abonoAlCapitalParcial = (abonoAlCapitalParcialList?.Sum(d => d.Tbl_Cuotas?.pago_contado)
					- abonoAlCapitalParcialList?.Sum(d => d.Tbl_Cuotas?.interes)) ?? 0;
				double abono_capital = abonoCapitalTotal + abonoAlCapitalParcial;
				var configuraciones_theme = new Transactional_Configuraciones().GetTheme();

				templateContent = templateContent.Replace("{{recibo_num}}", factura.id_factura.ToString())
				.Replace("{{logo}}", "data:image/png;base64," + configuraciones_theme.Find(c => c.Nombre.Equals(ConfiguracionesThemeEnum.LOGO.ToString()))?.Valor)
				.Replace("{{cambio}}", Math.Round((decimal)factura.tasa_cambio, 2).ToString())
				.Replace("{{fecha}}", factura.fecha?.ToString("dd/MM/yyyy"))
				.Replace("{{sucursal}}", sucursal.Nombre)
				.Replace("{{cajero}}", dbUser.Nombres)
				.Replace("{{cliente}}", contrato?.Catalogo_Clientes?.primer_nombre + " " + contrato.Catalogo_Clientes.primer_apellido + " " + contrato.Catalogo_Clientes.segundo_apellidio)
				.Replace("{{clasificacion}}", cliente?.Catalogo_Clasificacion_Interes?.porcentaje.ToString() ?? "")
				.Replace("{{categoria}}", GetTipoArticulo(contrato.Detail_Prendas))
				.Replace("{{cuotas}}", contrato.plazo.ToString())
				.Replace("{{cuotas_pendientes}}", cuotasPendiente.Count.ToString())
				.Replace("{{saldo_anterior}}", Math.Round((decimal)factura.Factura_contrato?.saldo_anterior, 2).ToString())
				.Replace("{{saldo_actual}}", Math.Round((decimal)factura.Factura_contrato.saldo_actual, 2).ToString())
				.Replace("{{total_pagado}}", Math.Round((decimal)factura?.total * (decimal)factura?.tasa_cambio, 2).ToString())
				.Replace("{{total_pagado_dolares}}", Math.Round((decimal)factura.total, 2).ToString())
				.Replace("{{reestructuracion}}", Math.Round((decimal)(factura.Factura_contrato.reestructuracion ?? 0) * (decimal)factura.tasa_cambio, 2).ToString())
				.Replace("{{reestructuracion_dolares}}", Math.Round((decimal)(factura.Factura_contrato.reestructuracion ?? 0), 2).ToString())
				.Replace("{{perdida_doc}}", Math.Round((decimal)(factura.Factura_contrato.perdida_de_documento ?? 0) * (decimal)factura.tasa_cambio, 2).ToString())
				.Replace("{{perdida_doc_dolares}}", Math.Round((decimal)(factura.Factura_contrato.perdida_de_documento ?? 0), 2).ToString())
				.Replace("{{mora}}", Math.Round((decimal)sumaMora * (decimal)factura?.tasa_cambio, 2).ToString())
				.Replace("{{mora_dolares}}", Math.Round((decimal)sumaMora, 2).ToString())
				.Replace("{{idcp}}", Math.Round((decimal)sumaInteres * (decimal)factura?.tasa_cambio, 2).ToString())
				.Replace("{{idcp_dolares}}", Math.Round((decimal)sumaInteres, 2).ToString())
				.Replace("{{abono_capital}}", Math.Round((decimal)abono_capital * (decimal)factura?.tasa_cambio, 2).ToString())
				.Replace("{{abono_capital_dolares}}", Math.Round((decimal)abono_capital, 2).ToString())
				.Replace("{{saldo_actual_cordobas}}", Math.Round((decimal)factura.Factura_contrato.saldo_actual * (decimal)factura?.tasa_cambio, 2).ToString())
				.Replace("{{saldo_actual_dolares}}", Math.Round((decimal)factura.Factura_contrato.saldo_actual, 2).ToString())
				.Replace("{{proximo_pago}}", "");

				return new ResponseService()
				{
					status = 200,
					message = templateContent
				};


			}
			catch (System.Exception ex)
			{
				return new ResponseService()
				{
					status = 500,
					message = "Error, intentelo nuevamente " + ex.Message
				};
			}
		}
		public string? GetTipoArticulo(List<Detail_Prendas> Detail_Prendas)
		{
			var isVehiculo = Detail_Prendas.Find(p => p.Catalogo_Categoria?.descripcion == "vehiculos");
			if (isVehiculo != null) return isVehiculo?.Catalogo_Categoria?.descripcion;

			var isElectronico = Detail_Prendas.Find(p => p.Catalogo_Categoria?.descripcion == "electronico");
			if (isElectronico != null) return isElectronico?.Catalogo_Categoria?.descripcion;

			return Detail_Prendas[0].Catalogo_Categoria?.descripcion;
		}

	}
}