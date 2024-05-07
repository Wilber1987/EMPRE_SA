using API.Controllers;
using CAPA_DATOS;
using CAPA_DATOS.BDCore;
using CAPA_DATOS.Services;
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
		public bool? solo_interes_mora { get; set; }
		public bool? cancelar { get; set; }
		public bool? reestructurar { get; set; }
		public double? reestructurar_value { get; set; }
		public double? total_apagar_dolares { get; set; }
		public string? moneda { get; set; }
		public bool? perdida_de_documento { get; set; }


		public object SaveRecibos(string token)
		{
			try
			{
				var user = AuthNetCore.User(token);
				var dbUser = new Security_Users { Id_User = user.UserId }.Find<Security_Users>();
				var contrato = new Transaction_Contratos() { numero_contrato = this.numero_contrato }.Find<Transaction_Contratos>();
				var sucursal = new Catalogo_Sucursales() { Id_Sucursal = dbUser?.Id_Sucursal }.Find<Catalogo_Sucursales>();
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
				double? abonoCapital = monto - mora - interesCorriente;
				double? saldoRespaldo = contrato.saldo;
				contrato.saldo -= abonoCapital;
				if (contrato.saldo <= 0.5)
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
						EstadoAnteriorCuota estadoAnterior = CloneCuota(cuota);
						cuota.pago_contado = cuota.abono_capital;
						AgregarCuotaDetalle(cuota, DetallesFacturaRecibos, estadoAnterior,
						"Pago de completo de cuota, en la cancelación de contrato No: " + this.numero_contrato);
						cuota.Estado = Contratos_State.CANCELADO.ToString();
					});
				}
				else if (solo_interes_mora == true)//PAGA SOLO INTERES + MORA
				{
					monto = SoloInteresMora(contrato, monto, DetallesFacturaRecibos, cuotasPendientes, CuotaActual);
				}
				else if (solo_abono == true) //PAGA ABONO AL CAPITAL
				{
					monto = AbonoCapital(contrato, monto, DetallesFacturaRecibos, cuotasPendientes, null);
				}
				else //PAGA MAS DE LO NORMAL (CUOTA CON INTERESES + MORA) + ABONO AL CAPITAL
				{
					monto = CancelarCuotaActual(monto, CuotaActual, DetallesFacturaRecibos);
					monto = AbonoCapital(contrato, monto, DetallesFacturaRecibos, cuotasPendientes, CuotaActual);
				}

				//fecha de proximo pago
				var cuotasPendiente = new Tbl_Cuotas
				{
					numero_contrato = contrato.numero_contrato,
					Estado = "PENDIENTE"
				}.Get<Tbl_Cuotas>()?.OrderBy(C => C.id_cuota).ToList();

				//guardado de factura
				var factura = new Transaccion_Factura()
				{
					tipo = "RECIBO", //TODO ENUM
					estado = EstadoEnum.ACTIVO.ToString(),
					concepto = GetConcepto(),
					tasa_cambio = this.tasa_cambio,
					total = this.paga_dolares,
					id_cliente = contrato.codigo_cliente,
					id_sucursal = sucursal?.Id_Sucursal,
					fecha = DateTime.Now,
					Moneda = moneda,
					Consecutivo = temporal != true ? getConsecutivo(dbUser) : null,
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
						id_sucursal = dbUser?.Id_Sucursal,
						reestructuracion = this.reestructurar == true ? 1 : 0,
						total_pagado = this.total_apagar_dolares
					},
					Detalle_Factura_Recibo = DetallesFacturaRecibos
				};
				if (temporal != true)
				{
					contrato.Update();
					factura.Save();
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
					ResponseService response = new Movimientos_Cuentas
					{
						Catalogo_Cuentas_Destino = cuentaDestino,
						Catalogo_Cuentas_Origen = cuentaOrigen,
						concepto = "Pago de cuota, contrato No: " + this.numero_contrato,
						descripcion = "Pago de cuota, contrato No: " + this.numero_contrato,
						moneda = this.moneda?.ToUpper(),
						monto = this.moneda?.ToUpper() == "DOLARES" ? this.paga_dolares : this.paga_cordobas,
						tasa_cambio = this.tasa_cambio,
						//tasa_cambio_compra = this.tasa_cambio_compra,
						is_transaction = true
					}.SaveMovimiento(token); if (response.status == 400)
					{
						RollBackGlobalTransaction();
						return response;
					}
					CommitGlobalTransaction();
				}
				else
				{
					RollBackGlobalTransaction();
				}
				return new ResponseService()
				{
					status = 200,
					message = temporal == true ? "Factura temporal" : "Factura registrada correctamente",
					body = temporal == true ? GenerateReciboHtmlTemplate(factura) : factura
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

		private string? getConsecutivo(Security_Users? dbUser)
		{
			var config = new Datos_Configuracion { Id_Sucursal = dbUser?.Id_Sucursal }.FindConfig();
			config.Consecutivo++;
			config.Update();
			return config.Consecutivo?.ToString("D9");
		}

		private string GetConcepto()
		{
			if (solo_interes_mora == true)
			{
				return "Pago de interés + mora de contrato No: " + this.numero_contrato?.ToString("D9");
			}
			if (solo_abono == true)
			{
				return "Pago de abono al capital de contrato No: " + this.numero_contrato?.ToString("D9");
			}
			if (reestructurar == true)
			{
				return "Pago de interés + mora + reestructuración de contrato No: " + this.numero_contrato?.ToString("D9");
			}
			if (cancelar == true)
			{
				return "Pago de Cancelación de contrato No: " + this.numero_contrato?.ToString("D9");
			}
			return "Pago de cuota contrato No: " + this.numero_contrato?.ToString("D9");
		}

		private double SoloInteresMora(Transaction_Contratos contrato, double monto,
		List<Detalle_Factura_Recibo> DetallesFacturaRecibos,
		List<Tbl_Cuotas>? cuotasPendientes,
		Tbl_Cuotas? CuotaActual)
		{
			EstadoAnteriorCuota estadoAnteriorCuotaActual = CloneCuota(CuotaActual);
			CuotaActual.fecha_pago = DateTime.Now;
			CuotaActual.pago_contado = monto;
			monto = 0;
			CuotaActual.Estado = Contratos_State.CANCELADO.ToString();

			AgregarCuotaDetalle(CuotaActual, DetallesFacturaRecibos, estadoAnteriorCuotaActual,
			$"Pago de interes + mora de cuota correspondiente a la cuota {CuotaActual?.fecha?.ToString("dd-MM-yyyy")} del contrato No: " + this.numero_contrato);
			CuotaActual?.Update();

			Tbl_Cuotas? CuotaFinal = cuotasPendientes.First();//DADO QUE LAS CUOTAS VIENEN EN ORDEN DESC SE TOMA LA PRIMERA
			EstadoAnteriorCuota estadoAnteriorCuotaFinal = CloneCuota(CuotaActual);
			CuotaFinal.abono_capital += CuotaActual?.abono_capital;
			CuotaFinal.interes = CuotaFinal.abono_capital * contrato.tasas_interes;
			CuotaFinal.total = CuotaFinal.interes + CuotaFinal.abono_capital;

			Tbl_Cuotas? CuotaAnterior = CuotaActual;
			cuotasPendientes?.OrderBy(c => c.id_cuota).ToList()?.ForEach(cuota =>
			{
				if (cuota.id_cuota == CuotaActual?.id_cuota) return;
				if (cuota.id_cuota == CuotaFinal?.id_cuota) return;
				EstadoAnteriorCuota estadoAnterior = CloneCuota(cuota);
				cuota.abono_capital = CuotaAnterior?.abono_capital;
				cuota.interes = CuotaAnterior?.interes;
				cuota.pago_contado = 0;
				AgregarCuotaDetalle(cuota, DetallesFacturaRecibos, estadoAnterior,
					$"Actualización de datos de pago de la cuota {CuotaActual?.fecha?.ToString("dd-MM-yyyy")} del contrato No: "
					+ this.numero_contrato);
				cuota.Update();
			});
			//AGREGO EL DETALLE DE LA MODIFICACION
			AgregarCuotaDetalle(CuotaFinal, DetallesFacturaRecibos, estadoAnteriorCuotaFinal,
					$"Actualización de datos de pago de la cuota {CuotaFinal?.fecha?.ToString("dd-MM-yyyy")} del contrato No: "
					+ this.numero_contrato);

			CuotaFinal?.Update();
			return monto;
		}

		private double AbonoCapital(Transaction_Contratos? contrato,
		double monto,
		List<Detalle_Factura_Recibo> DetallesFacturaRecibos,
		List<Tbl_Cuotas>? cuotasPendientes,
		Tbl_Cuotas? CuotaActual)
		{
			if (monto > 0)
			{
				//UpdateCuotas(contrato);
				cuotasPendientes?.ForEach(cuota =>
				{
					if (cuota.id_cuota == CuotaActual?.id_cuota) return;
					if (monto <= 0) return;
					EstadoAnteriorCuota estadoAnterior = CloneCuota(cuota);
					cuota.fecha_pago = DateTime.Now;
					if (monto >= cuota.abono_capital && monto > 0)
					{
						cuota.pago_contado = cuota.abono_capital;
						cuota.abono_capital = 0;
						cuota.total = 0;
						monto -= cuota.pago_contado.GetValueOrDefault();
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

			return monto;
		}

		private void AgregarCuotaDetalle(Tbl_Cuotas cuota,
		List<Detalle_Factura_Recibo> DetallesFacturaRecibos,
		EstadoAnteriorCuota estadoAnterior,
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
				EstadoAnterior = estadoAnterior,
				Tbl_Cuotas = cuota
			});
		}

		private double CancelarCuotaActual(double monto, Tbl_Cuotas CuotaActual, List<Detalle_Factura_Recibo> detallesFacturaRecibos)
		{
			EstadoAnteriorCuota estadoAnterior = CloneCuota(CuotaActual);
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

		private EstadoAnteriorCuota CloneCuota(Tbl_Cuotas CuotaActual)
		{
			return new EstadoAnteriorCuota()
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

				var cuentaOrigen = Catalogo_Cuentas.GetCuentaEgresoRecibos(dbUser);
				var cuentaDestino = Catalogo_Cuentas.GetCuentaIngresoRecibos(dbUser);

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
					moneda = factura.Moneda?.ToUpper(),
					monto = factura.Moneda?.ToUpper() == "DOLARES" ? factura.total : factura.total_cordobas,
					tasa_cambio = factura.tasa_cambio,
					//tasa_cambio_compra = this.tasa_cambio_compra,
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


				//var recibota = new Recibos() { id_recibo = this.id_recibo }.Find<Recibos>();
				Transaccion_Factura? factura = new Transaccion_Factura() { id_factura = this.id_recibo }.Find<Transaccion_Factura>();

				string templateContent = GenerateReciboHtmlTemplate(factura);

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

		private string GenerateReciboHtmlTemplate(Transaccion_Factura? factura)
		{
			var contrato = new Transaction_Contratos() { numero_contrato = factura?.Factura_contrato?.numero_contrato }.Find<Transaction_Contratos>();

			var dbUser = new Security_Users { Id_User = factura?.id_usuario }.Find<Security_Users>();

			var sucursal = new Catalogo_Sucursales() { Id_Sucursal = dbUser?.Id_Sucursal }.Find<Catalogo_Sucursales>();

			var cliente = contrato?.Catalogo_Clientes?.Find<Catalogo_Clientes>();

			string templateContent = RecibosTemplates.recibo;

			var ultimoDetalle = factura?.Detalle_Factura_Recibo?.OrderByDescending(d => d.id).FirstOrDefault();
			var detalleIds = factura?.Detalle_Factura_Recibo?.Select(d => d.id_cuota.ToString()).ToArray();

			List<Tbl_Cuotas?>? cuotas = factura?.Detalle_Factura_Recibo?.Select(r => r.Tbl_Cuotas).ToList();



			double sumaInteres = cuotas.Where(c => c.interes.HasValue).Sum(c => c.interes.Value);

			double sumaMora = cuotas.Where(c => c.mora.HasValue).Sum(c => c.mora.Value);

			var cuotasPendiente = new Tbl_Cuotas { numero_contrato = factura?.Factura_contrato?.numero_contrato }
				.Where<Tbl_Cuotas>(FilterData.NotIn("id_cuota", detalleIds)).OrderBy(c => c.id_cuota).ToList();
			//new Tbl_Cuotas{}.Get<Tbl_Cuotas>().Count(c => c.id_cuota.HasValue && c.capital_restante > 0);

			double abonoCapitalTotal = factura?.Detalle_Factura_Recibo?.Where(d => d.Tbl_Cuotas?.pago_contado == d.Tbl_Cuotas?.total)
				.ToList().Sum(d => d.Tbl_Cuotas?.abono_capital) ?? 0;

			var abonoAlCapitalParcialList = factura?.Detalle_Factura_Recibo?
				.Where(d => d.Tbl_Cuotas?.pago_contado != d.Tbl_Cuotas?.total)
				.ToList();
			double abonoAlCapitalParcial = (abonoAlCapitalParcialList?.Sum(d => d.Tbl_Cuotas?.pago_contado)
				- abonoAlCapitalParcialList?.Sum(d => d.Tbl_Cuotas?.interes)) ?? 0;
			double abono_capital = abonoCapitalTotal + abonoAlCapitalParcial;
			var configuraciones_theme = new Transactional_Configuraciones().GetTheme();

			templateContent = templateContent.Replace("{{recibo_num}}", factura?.Consecutivo)
			.Replace("{{logo}}", "data:image/png;base64," + configuraciones_theme.Find(c => c.Nombre.Equals(ConfiguracionesThemeEnum.LOGO.ToString()))?.Valor)
			.Replace("{{cambio}}", NumberUtility.ConvertToMoneyString(factura?.tasa_cambio))
			.Replace("{{fecha}}", factura?.fecha?.ToString("dd/MM/yyyy"))
			.Replace("{{sucursal}}", sucursal.Nombre)
			.Replace("{{cajero}}", dbUser.Nombres)
			.Replace("{{cliente}}", contrato?.Catalogo_Clientes?.primer_nombre + " " + contrato.Catalogo_Clientes.primer_apellido + " " + contrato.Catalogo_Clientes.segundo_apellidio)
			.Replace("{{clasificacion}}", cliente?.Catalogo_Clasificacion_Interes?.porcentaje.ToString() ?? "")
			.Replace("{{categoria}}", GetTipoArticulo(contrato.Detail_Prendas))
			.Replace("{{cuotas}}", contrato.plazo.ToString())
			.Replace("{{cuotas_pendientes}}", cuotasPendiente.Count.ToString())
			.Replace("{{saldo_anterior}}", NumberUtility.ConvertToMoneyString(factura?.Factura_contrato?.saldo_anterior))
			.Replace("{{saldo_actual}}", NumberUtility.ConvertToMoneyString(factura?.Factura_contrato.saldo_actual))
			.Replace("{{total_pagado}}", NumberUtility.ConvertToMoneyString(factura?.total * factura?.tasa_cambio))
			.Replace("{{total_pagado_dolares}}", NumberUtility.ConvertToMoneyString(factura?.total))
			.Replace("{{reestructuracion}}", NumberUtility.ConvertToMoneyString((factura?.Factura_contrato?.reestructuracion ?? 0) * factura?.tasa_cambio))
			.Replace("{{reestructuracion_dolares}}", NumberUtility.ConvertToMoneyString(factura?.Factura_contrato?.reestructuracion ?? 0))
			.Replace("{{perdida_doc}}", NumberUtility.ConvertToMoneyString((factura?.Factura_contrato?.perdida_de_documento ?? 0) * factura?.tasa_cambio))
			.Replace("{{perdida_doc_dolares}}", NumberUtility.ConvertToMoneyString(factura?.Factura_contrato?.perdida_de_documento ?? 0))
			.Replace("{{mora}}", NumberUtility.ConvertToMoneyString(sumaMora * factura?.tasa_cambio))
			.Replace("{{mora_dolares}}", NumberUtility.ConvertToMoneyString(sumaMora))
			.Replace("{{idcp}}", NumberUtility.ConvertToMoneyString(sumaInteres * factura?.tasa_cambio))
			.Replace("{{idcp_dolares}}", NumberUtility.ConvertToMoneyString(sumaInteres))
			.Replace("{{abono_capital}}", NumberUtility.ConvertToMoneyString(abono_capital * factura?.tasa_cambio))
			.Replace("{{abono_capital_dolares}}", NumberUtility.ConvertToMoneyString(abono_capital))
			.Replace("{{saldo_actual_cordobas}}", NumberUtility.ConvertToMoneyString(factura?.Factura_contrato?.saldo_actual * factura?.tasa_cambio))
			.Replace("{{saldo_actual_dolares}}", NumberUtility.ConvertToMoneyString(factura?.Factura_contrato?.saldo_actual))
			.Replace("{{proximo_pago}}", cuotasPendiente.Count != 0 ? cuotasPendiente.First()?.fecha?.ToString("dd/MM/yyyy") : "-");
			return templateContent;
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