using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Controllers;
using APPCORE;
using BusinessLogic.Empresa.Contratos;
using CAPA_NEGOCIO.Util;
using Business;
using Transactions;

namespace DataBaseModel
{
	public class Transaction_Contratos : EntityClass
	{
		[PrimaryKey(Identity = true)]
		public int? numero_contrato { get; set; }
		public DateTime? fecha_contrato { get; set; }
		public DateTime? fecha_cancelar { get; set; }
		public decimal? monto { get; set; }
		public decimal? interes { get; set; }
		public decimal? mora { get; set; }
		public Contratos_State? estado { get; set; }
		public DateTime? fecha_vencimiento { get; set; }
		public int? codigo_cliente { get; set; }
		public decimal? saldo { get; set; }
		public decimal? abonos { get; set; }
		public Contratos_Type? tipo { get; set; }
		public string? entregado { get; set; }
		public decimal? interes_actual { get; set; }
		public string? observaciones { get; set; }
		public decimal? iva { get; set; }
		public decimal? descuento { get; set; }
		public decimal? taza_cambio { get; set; }
		public decimal? taza_cambio_compra { get; set; }
		public int? id_agente { get; set; }
		public int? plazo { get; set; }
		public decimal? cuotafija { get; set; }
		public decimal? tasa_hoy { get; set; }
		public string? motivo_anulacion { get; set; }
		public decimal? Valoracion_compra_dolares { get; set; }
		public decimal? Valoracion_compra_cordobas { get; set; }
		public decimal? Valoracion_empeño_cordobas { get; set; }
		public decimal? Valoracion_empeño_dolares { get; set; }
		public decimal? tasas_interes { get; set; }
		public decimal? gestion_crediticia { get; set; }
		public decimal? cuotafija_dolares { get; set; }
		public DateTime? fecha { get; set; }
		public decimal? total_pagar_cordobas { get; set; }
		public decimal? total_pagar_dolares { get; set; }
		public decimal? interes_dolares { get; set; }
		public int? Id_User { get; set; }
		public bool IsAnulable
		{
			get
			{
				return estado != Contratos_State.ANULADO && estado != Contratos_State.CANCELADO
				&& DateUtil.IsBefore(fecha, 24)
				&& tipo != Contratos_Type.APARTADO_QUINCENAL
				&& tipo != Contratos_Type.APARTADO_MENSUAL;
			}
		}

		public int? reestructurado { get; set; }
		[JsonProp]
		public DesgloseIntereses? DesgloseIntereses { get; set; }
		[JsonProp]
		public List<Notas_de_contrato>? Notas { get; set; }

		[ManyToOne(TableName = "Catalogo_Clientes", KeyColumn = "codigo_cliente", ForeignKeyColumn = "codigo_cliente")]
		public Catalogo_Clientes? Catalogo_Clientes { get; set; }
		[ManyToOne(TableName = "Security_Users", KeyColumn = "Id_User", ForeignKeyColumn = "Id_User")]
		public Security_Users? Security_Users { get; set; }
		[OneToMany(TableName = "Detail_Prendas", KeyColumn = "numero_contrato", ForeignKeyColumn = "numero_contrato")]
		public List<Detail_Prendas>? Detail_Prendas { get; set; }
		[OneToMany(TableName = "Tbl_Cuotas", KeyColumn = "numero_contrato", ForeignKeyColumn = "numero_contrato")]
		public List<Tbl_Cuotas>? Tbl_Cuotas { get; set; }

		//[OneToMany(TableName = "Transaccion_Factura", KeyColumn = "numero_contrato", ForeignKeyColumn = "numero_contrato")]
		public List<Transaccion_Recibos>? Recibos { get; set; }
		public ResponseService Anular(string Identify, bool anularIgnoreTransactions = false, bool anularFullCost = false)
		{
			try
			{
				//BeginGlobalTransaction();
				var (User, dbUser) = Business.Security_Users.GetUserData(Identify);
				Transaction_Contratos? Transaction_Contratos = new Transaction_Contratos
				{
					numero_contrato = this.numero_contrato
				}.Find<Transaction_Contratos>();
				if (Transaction_Contratos == null)
				{
					return new ResponseService { status = 403, message = "Contrato no existe" };
				}
				var cuotasPagadas = Transaction_Contratos.Tbl_Cuotas.Where(c => c.Estado?.ToUpper() == "CANCELADO").ToList();
				if (cuotasPagadas.Count > 0 && !anularIgnoreTransactions)
				{
					return new ResponseService { status = 403, message = "Contrato no puede ser anulado debido a que ya se realizaron transacciones en el (pago de cuotas)" };
				}
				if (IsAnulable && !anularIgnoreTransactions)
				{
					return new ResponseService { status = 403, message = "Fecha límite para anulación a caducado" };
				}
				Transaction_Contratos.motivo_anulacion = this.motivo_anulacion;
				Transaction_Contratos.estado = Contratos_State.ANULADO;
				Transaction_Contratos.Update();
				//ANULAR
				var cuentaOrigen = Catalogo_Cuentas.GetCuentaRegistoContratos(dbUser);
				var cuentaDestino = Catalogo_Cuentas.GetCuentaEgresoContratos(dbUser);
				Transaction_Movimiento? movimientosAnterior = new Transaction_Movimiento().Find<Transaction_Movimiento>(
					FilterData.Equal("concepto", "Desembolso de monto para, contrato No: " + Transaction_Contratos.numero_contrato)
				);
				ResponseService response = new Movimientos_Cuentas
				{
					Catalogo_Cuentas_Destino = cuentaDestino,
					Catalogo_Cuentas_Origen = cuentaOrigen,
					concepto = "Reembolso de monto para anulación de contrato No: " + Transaction_Contratos.numero_contrato,
					descripcion = motivo_anulacion,
					moneda = movimientosAnterior?.moneda,
					monto = movimientosAnterior?.moneda == "CORDOBAS" ? Transaction_Contratos.Valoracion_empeño_cordobas : Transaction_Contratos.monto,
					tasa_cambio = Transaction_Contratos.taza_cambio,
					tasa_cambio_compra = Transaction_Contratos.taza_cambio_compra,
					is_transaction = true,
					Tipo_Movimiento = TipoMovimiento.REEMBOLSO_POR_CONTRATO_ANULADO
				}.SaveMovimiento(dbUser);
				return new ResponseService { status = 200, message = "Contrato anulado correctamente" };
			}
			catch (Exception ex)
			{
				//RollBackGlobalTransaction();
				return new ResponseService { status = 500, message = ex.Message };
			}
		}

		// ✅ CORREGIDO: Parámetros ahora son decimal?
		public List<Tbl_Cuotas> Reestructurar(decimal? reestructuracion_value)
		{
			if (this.reestructurado == null)
			{
				this.reestructurado = 0;
			}
			this.plazo += Convert.ToInt32(reestructuracion_value);
			this.reestructurado += 1;

			// ✅ CORREGIDO: Pasar parámetros como decimal
			var cuotas = CrearCuotas(this.saldo, (decimal?)this.plazo);
			this.Tbl_Cuotas?.AddRange(cuotas);
			this.Update();
			return cuotas;
		}

		public List<Tbl_Cuotas> CrearCuotas(decimal? monto,
									decimal? plazo,
									bool autoSave = true,
									bool quincenal = false)
		{
			var tasasCambio = new Catalogo_Cambio_Divisa()
				.Get<Catalogo_Cambio_Divisa>()[0]
				.Valor_de_venta;

			this.cuotafija_dolares = GetPago(monto, plazo);
			this.cuotafija = this.cuotafija_dolares * this.taza_cambio;

			decimal capital = monto ?? 0m;
			decimal cuotaFija = this.cuotafija_dolares ?? 0m;
			decimal tasa = this.tasas_interes ?? 0m;

			List<Tbl_Cuotas> cuotas = new();
			DateTime fechaC = fecha.GetValueOrDefault();
			int totalCuotas = Convert.ToInt32(plazo ?? 0);

			for (int index = 0; index < totalCuotas; index++)
			{
				fechaC = quincenal
					? fechaC.AddDays(15)
					: fechaC.AddMonths(1);

				decimal interesPeriodo;
				decimal abonoCapital;
				decimal cuotaTotal = cuotaFija;

				if (index == totalCuotas - 1)
				{
					// ✅ ÚLTIMA CUOTA: AJUSTE FINAL
					abonoCapital = capital;
					// mantener cuota fija:
					// cuota = interes + capital
					interesPeriodo = cuotaFija - abonoCapital;
				}
				else
				{
					interesPeriodo = Math.Round(
						capital * tasa,
						2,
						MidpointRounding.AwayFromZero
					);

					abonoCapital = cuotaFija - interesPeriodo;
				}
				decimal capitalRestante = capital - abonoCapital;

				// Evitar negativos por residuos
				if (capitalRestante < 0)
					capitalRestante = 0m;

				var cuota = new Tbl_Cuotas
				{
					Estado = EstadoEnum.PENDIENTE.ToString(),
					fecha = fechaC,
					// ✅ SIEMPRE fija
					total = cuotaTotal,
					interes = Math.Round(
						interesPeriodo,
						2,
						MidpointRounding.AwayFromZero
					),
					abono_capital = Math.Round(
						abonoCapital,
						2,
						MidpointRounding.AwayFromZero
					),
					capital_restante = Math.Round(
						capitalRestante,
						2,
						MidpointRounding.AwayFromZero
					),
					tasa_cambio = tasasCambio,
					numero_contrato = this.numero_contrato
				};
				capital = capitalRestante;
				if (autoSave) cuota.Save();

				cuotas.Add(cuota);
			}

			return cuotas;
		}

		private decimal? GetPago(decimal? monto, decimal? cuotas)
		{
			if (monto == null || cuotas == null || cuotas == 0)
				return null;

			var tasa = this.tasas_interes ?? 0m;

			if (tasa == 0)
			{
				return Math.Round(
					monto.Value / cuotas.Value,
					2,
					MidpointRounding.AwayFromZero
				);
			}

			double tasaDouble = Convert.ToDouble(tasa);
			double cuotasDouble = Convert.ToDouble(cuotas);
			double montoDouble = Convert.ToDouble(monto);

			double factor = Math.Pow(1 + tasaDouble, cuotasDouble);

			double payment =
				(tasaDouble * factor * montoDouble) /
				(factor - 1);

			// ✅ cuota monetaria = 2 decimales
			return Math.Round(
				(decimal)payment,
				2,
				MidpointRounding.AwayFromZero
			);
		}

		// ✅ CORREGIDO: Cálculo de mora con literales decimal
		public Transaction_Contratos? FindAndUpdateContract()
		{
			Transaction_Contratos? contrato = Find<Transaction_Contratos>();
			if (contrato == null) return null;

			var cuotas = new Tbl_Cuotas()
			{
				numero_contrato = contrato?.numero_contrato
			}.Where<Tbl_Cuotas>(
				FilterData.Equal("Estado", EstadoEnum.PENDIENTE),
				FilterData.Less("fecha", DateTime.Now)
			);

			foreach (var cuota in cuotas)
			{
				if (tipo == Contratos_Type.APARTADO_QUINCENAL && (cuota.mora ?? 0) != 0)
				{
					cuota.mora = 0;
					cuota.Update();
				}
				else
				{
					var fechaPago = cuota.fecha.GetValueOrDefault().Date;
					var ahora = DateTime.Now.Date.AddHours(23).AddMinutes(59);
					TimeSpan diferencia = ahora - fechaPago;
					int diasEnMora = Math.Max((int)Math.Floor(diferencia.TotalDays), 0);

					// ✅ CORREGIDO: 100m y 0.005m para mantener tipo decimal
					var tasaMora = (cuota.Transaction_Contratos?.mora ?? 0.5m) / 100m;
					var montoMora = (cuota.total ?? 0m) * tasaMora * diasEnMora;

					if (montoMora > 0)
					{
						cuota.mora = Math.Round(montoMora, 4);
						cuota.Update();
					}
				}
			}

			var contratoActualizado = Find<Transaction_Contratos>();
			contratoActualizado?.GetRecibos();
			return contratoActualizado;
		}


		public void EstablecerComoVencido()
		{
			try
			{
				var VencimientoConfig = new Transactional_Configuraciones().GetConfig(ConfiguracionesVencimientos.VENCIMIENTO_CONTRATO.ToString());
				var cuotasPendientes = new Tbl_Cuotas { numero_contrato = numero_contrato, Estado = EstadoEnum.PENDIENTE.ToString() }.Get<Tbl_Cuotas>();
				if (cuotasPendientes.Count == 0)
				{
					return;//todo ver el retorno
				}
				Tbl_Cuotas CuotaActual = cuotasPendientes.Last();
				DateTime fechaOriginal = CuotaActual.fecha.GetValueOrDefault();
				TimeSpan diferencia = DateTime.Now - fechaOriginal;
				int diasDeDiferencia = diferencia.Days;
				if (diasDeDiferencia > Convert.ToInt32(VencimientoConfig.Valor))
				{
					estado = Contratos_State.VENCIDO;
					Update();
					Transactional_Configuraciones beneficioVentaE = new Transactional_Configuraciones()
						   .GetConfig(ConfiguracionesBeneficiosEnum.BENEFICIO_VENTA_ARTICULO_EMPENO.ToString());
					var dbUser = new Security_Users { Id_User = Id_User }.Find<Security_Users>();
					Detail_Prendas?.ForEach(prenda =>
					{
						if (prenda.en_manos_de == EnManosDe.ACREEDOR)
						{
							Tbl_Lotes.GenerarLoteAPartirDePrenda(prenda, beneficioVentaE, dbUser, this);
						}
					});
					Tbl_Cuotas?.ForEach(Cuota =>
					{
						Cuota.Estado = EstadoEnum.VENCIDO.ToString();
						Cuota.Update();
					});
				}
			}
			catch (System.Exception Exception)
			{
				LoggerServices.AddMessageError("error al vencer contrato", Exception);
			}
		}



		public List<Transaction_Contratos> GetContratos()
		{
			var contratos = Where<Transaction_Contratos>(FilterData.Limit(30));
			foreach (var contrato in contratos)
			{
				contrato.GetRecibos();
			}
			return contratos;
		}

		private void GetRecibos()
		{
			Recibos = new Transaccion_Recibos
			{
				filterData = [new FilterData
				{
					PropName = "Factura_contrato",
					JsonPropName = "numero_contrato",
					FilterType = "JSONPROP_EQUAL",
					PropSQLType = "int",
					Values = new List<string?> { numero_contrato.GetValueOrDefault().ToString() }
				}]
			}.SimpleGet<Transaccion_Recibos>();
		}

		internal void Cancelar(Security_Users? dbUser)
		{
			if (estado != Contratos_State.CANCELADO)
			{
				estado = Contratos_State.CANCELADO;
				Tbl_Acta_Entrega.ActasDePrendasPorCancelacionContrato(dbUser, this);
			}
		}
	}

	public class Notas_de_contrato
	{
		public DateTime Fecha { get; set; }
		public string? Descripcion { get; set; }
	}

	public class Tbl_Cuotas : EntityClass
	{
		[PrimaryKey(Identity = true)]
		public int? id_cuota { get; set; }
		/**@type {Date} */
		public DateTime? fecha { get; set; }
		/**@type {Number} Tbl_cuotas del abono*/
		public decimal? total { get; set; }
		/**@type {Number} valor del interes del capital*/
		public decimal? interes { get; set; }
		/**@type {Number} */
		public decimal? abono_capital { get; set; }
		/**@type {Number} capital restante*/
		public decimal? capital_restante { get; set; }
		/**@type {Number} capital mora*/
		public decimal? mora { get; set; }
		/**DATOS DE LA FATURA */
		/**@type {Date} */
		public DateTime? fecha_pago { get; set; }
		/**@type {Number} Tbl_cuotas del abono*/
		public decimal? pago_contado { get; set; }
		/**@type {Number} Tbl_cuotas del abono*/
		public decimal? descuento { get; set; }
		/**@type {Number} Tbl_cuotas del abono*/
		public decimal? tasa_cambio { get; set; }
		public int? numero_contrato { get; set; }
		public string? Estado { get; set; }

		[ManyToOne(TableName = "Transaction_Contratos", KeyColumn = "numero_contrato", ForeignKeyColumn = "numero_contrato")]
		public Transaction_Contratos? Transaction_Contratos { get; set; }

		public decimal CalcularInteresDiario()
		{
			// Ejemplo: si necesitas cálculo con días
			if (this.total == null || this.tasa_cambio == null) return 0m;
			return Math.Round((this.total.Value * 0.0005m), 4); // 0.05% diario ejemplo
		}
	}

}