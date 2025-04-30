using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Controllers;
using CAPA_DATOS;
using CAPA_NEGOCIO.Util;
using Transactions;

namespace DataBaseModel
{
	public class Transaction_Contratos : EntityClass
	{
		[PrimaryKey(Identity = true)]
		public int? numero_contrato { get; set; }
		public DateTime? fecha_contrato { get; set; }
		public DateTime? fecha_cancelar { get; set; }
		public Double? monto { get; set; }
		public Double? interes { get; set; }
		public Double? mora { get; set; }
		public string? estado { get; set; }
		public DateTime? fecha_vencimiento { get; set; }
		public int? codigo_cliente { get; set; }
		public Double? saldo { get; set; }
		public Double? abonos { get; set; }
		public string? tipo { get; set; }
		public string? entregado { get; set; }
		public Double? interes_actual { get; set; }
		public string? observaciones { get; set; }
		public Double? iva { get; set; }
		public Double? descuento { get; set; }
		public Double? taza_cambio { get; set; }
		public Double? taza_cambio_compra { get; set; }
		public int? id_agente { get; set; }
		public int? plazo { get; set; }
		public Double? cuotafija { get; set; }
		public Double? tasa_hoy { get; set; }
		public string? motivo_anulacion { get; set; }
		public Double? Valoracion_compra_dolares { get; set; }
		public Double? Valoracion_compra_cordobas { get; set; }
		public Double? Valoracion_empeño_cordobas { get; set; }
		public Double? Valoracion_empeño_dolares { get; set; }
		public Double? tasas_interes { get; set; }
		public Double? gestion_crediticia { get; set; }
		public Double? cuotafija_dolares { get; set; }
		public DateTime? fecha { get; set; }
		public Double? total_pagar_cordobas { get; set; }
		public Double? total_pagar_dolares { get; set; }
		public Double? interes_dolares { get; set; }
		public int? Id_User { get; set; }
		public bool IsAnulable
		{
			get
			{
				return estado != "ANULADO" && estado != "CANCELADO"
				&& DateUtil.IsBefore(fecha, 24)
				&& tipo != Contratos_Type.APARTADO_QUINCENAL.ToString() 
				&& tipo != Contratos_Type.APARTADO_MENSUAL.ToString();
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
		public List<Transaccion_Factura>? Recibos { get; set; }
		public ResponseService Anular(string seasonKey)
		{
			try
			{
				//BeginGlobalTransaction();
				var User = AuthNetCore.User(seasonKey);
				var dbUser = new Security_Users { Id_User = User.UserId }.Find<Security_Users>();
				Transaction_Contratos? Transaction_Contratos = new Transaction_Contratos
				{
					numero_contrato = this.numero_contrato
				}.Find<Transaction_Contratos>();
				if (Transaction_Contratos == null)
				{
					return new ResponseService { status = 403, message = "Contrato no existe" };
				}
				var cuotasPagadas = Transaction_Contratos.Tbl_Cuotas.Where(c => c.Estado?.ToUpper() == "CANCELADO").ToList();
				if (cuotasPagadas.Count > 0)
				{
					return new ResponseService { status = 403, message = "Contrato no puede ser anulado debido a que ya se realizaron transacciones en el (pago de cuotas)" };
				}
				DateTime fechaGuardada = Transaction_Contratos.fecha_contrato.GetValueOrDefault(); // Tu fecha guardada
				DateTime fechaActual = DateTime.Now;

				TimeSpan diferencia = fechaActual - fechaGuardada;
				if (diferencia.TotalDays > 1)
				{
					return new ResponseService { status = 403, message = "Fecha límite para canulación a caducado" };
				}
				Transaction_Contratos.motivo_anulacion = this.motivo_anulacion;
				Transaction_Contratos.estado = Contratos_State.ANULADO.ToString();
				Transaction_Contratos.Update();
				//CommitGlobalTransaction();
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
					is_transaction = true
				}.SaveMovimiento(seasonKey);
				return new ResponseService { status = 200, message = "Contrato anulado correctamente" };
			}
			catch (Exception ex)
			{
				//RollBackGlobalTransaction();
				return new ResponseService { status = 500, message = ex.Message };
			}
		}

		public List<Tbl_Cuotas> Reestructurar(double? reestructuracion_value)
		{
			if (this.reestructurado == null)
			{
				this.reestructurado = 0;
			}
			this.plazo += Convert.ToInt32(reestructuracion_value);
			this.reestructurado += 1;
			this.Update();
			return CrearCuotas(this.saldo, reestructuracion_value);
		}
		public List<Tbl_Cuotas> CrearCuotas(double? monto,
								 double? plazo,
								 bool autoSave = true,
								 bool quincenal = false)
		{
			var tasasCambio = new Catalogo_Cambio_Divisa().Get<Catalogo_Cambio_Divisa>()[0].Valor_de_venta;
			this.cuotafija_dolares = this.GetPago(monto, plazo);
			this.cuotafija = this.cuotafija_dolares * this.taza_cambio;
			var capital = monto;
			List<Tbl_Cuotas> cuotas = new List<Tbl_Cuotas>();
			DateTime fechaC = fecha.GetValueOrDefault();

			int totalCuotas =  Convert.ToInt32(plazo);

			for (var index = 0; index < totalCuotas; index++)
			{
				if (quincenal)
				{
					// Si es la primera cuota del mes, se asigna al día 15, si no, al día 30
					//fechaC = new DateTime(fechaC.Year, fechaC.Month, (index % 2 == 0) ? 15 : 30);
					//if (index % 2 != 0) fechaC = fechaC.AddMonths(1); // Avanza al siguiente mes después del día 30
					fechaC = fechaC.AddDays(15);
				}
				else
				{
					fechaC = fechaC.AddMonths(1);
				}

				var abono_capital = this.cuotafija_dolares - (capital * this.tasas_interes);
				var cuota = new Tbl_Cuotas
				{
					Estado = EstadoEnum.PENDIENTE.ToString(),
					fecha = fechaC,
					total = this.cuotafija_dolares,
					interes = capital * this.tasas_interes,
					abono_capital = abono_capital,
					capital_restante = (capital - abono_capital) < 0 ? 0 : (capital - abono_capital),
					tasa_cambio = tasasCambio,
					numero_contrato = this.numero_contrato
				};
				capital -= abono_capital;

				if (autoSave)
				{
					cuota.Save();
				}

				cuotas.Add(cuota);
			}
			return cuotas;
		}

		private double? GetPago(double? monto, double? cuotas)
		{

			var tasa = this.tasas_interes;
			if (tasa == 0)
			{
				return monto / cuotas;
			}
			var payment = tasa * Math.Pow(Convert.ToDouble(1 + tasa), Convert.ToDouble(cuotas)) * monto
				/ (Math.Pow(Convert.ToDouble(1 + tasa), Convert.ToDouble(cuotas)) - 1);
			return payment;
		}

		internal void EstablecerComoVencido()
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
					estado = EstadoEnum.VENCIDO.ToString();
					Update();
					Transactional_Configuraciones beneficioVentaE = new Transactional_Configuraciones()
						   .GetConfig(ConfiguracionesBeneficiosEnum.BENEFICIO_VENTA_ARTICULO_EMPENO.ToString());
					var dbUser = new Security_Users { Id_User = Id_User }.Find<Security_Users>();
					Detail_Prendas?.ForEach(prenda =>
					{
						if (prenda.en_manos_de == EnManosDe.ACREEDOR.ToString())
						{
							GenerarLoteAPartirDePrenda(prenda, beneficioVentaE, dbUser);
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

		private void GenerarLoteAPartirDePrenda(Detail_Prendas prenda, Transactional_Configuraciones beneficioVentaE, Security_Users? dbUser)
		{
			double? mora = prenda.Transactional_Valoracion?.Tasa_interes * 2 / 100;
			double? precio_venta_empeño = (prenda.Transactional_Valoracion?.Valoracion_empeño_dolares)
				* (mora + 1)
				* (Convert.ToDouble(beneficioVentaE.Valor) / 100 + 1);
			Cat_Producto producto = new Cat_Producto
			{
				Descripcion = prenda.Descripcion,
				Cat_Marca = new Cat_Marca
				{
					Nombre = prenda.marca,
					Descripcion = prenda.marca,
					Estado = EstadoEnum.ACTIVO.ToString()
				},
				Cat_Categorias = new Cat_Categorias
				{
					Descripcion = prenda.Catalogo_Categoria?.descripcion,
					Estado = EstadoEnum.ACTIVO.ToString()
				}
			};
			Cat_Producto.SetProductData(producto);
			SaveLote(prenda, dbUser, precio_venta_empeño, producto);
		}

		private void SaveLote(Detail_Prendas prenda, Security_Users? dbUser, double? precio_venta_empeño, Cat_Producto producto)
		{
			string codigo = Tbl_Lotes.GenerarLote();
			int porcentajesUtilidad = Transactional_Configuraciones.GetBeneficioVentaArticulo();
			int porcentajesApartado = Transactional_Configuraciones.GetPorcentajesApartado();
			int Ncuotas = Transactional_Configuraciones.GetNumeroCuotasQuincenales(precio_venta_empeño.GetValueOrDefault());

			new Tbl_Lotes()
			{
				//Cat_Producto = producto,
				Precio_Venta = precio_venta_empeño,
				Precio_Compra = prenda.Transactional_Valoracion?.Valoracion_empeño_dolares,
				Cantidad_Inicial = 1,
				Cantidad_Existente = 1,
				Id_Sucursal = dbUser?.Id_Sucursal,
				Id_User = dbUser?.Id_User,
				Fecha_Ingreso = DateTime.Now,
				Datos_Producto = prenda.Transactional_Valoracion,
				Detalles = $"{prenda.Transactional_Valoracion?.Descripcion}, Marca: {prenda.Transactional_Valoracion?.Marca}, Modelo: {prenda.Transactional_Valoracion?.Modelo}, Existencia perteneciente a vencimineto de contrato No. {numero_contrato.GetValueOrDefault():D9}",
				Id_Almacen = new Cat_Almacenes().GetAlmacen(dbUser?.Id_Sucursal ?? 0),
				Lote = codigo,
				EtiquetaLote = new EtiquetaLote
				{
					Tipo = "CV",
					Articulo = $"{prenda.Transactional_Valoracion?.Descripcion}, Marca: {prenda.Transactional_Valoracion?.Marca}, Modelo: {prenda.Transactional_Valoracion?.Modelo}",
					Codigo = codigo,
					PorcentajesUtilidad = porcentajesUtilidad,
					PorcentajesApartado = porcentajesApartado,
					PorcentajeAdicional = 0,
					N_Cuotas = Ncuotas,
					Precio_compra_dolares = prenda.Transactional_Valoracion?.Valoracion_empeño_dolares,
				}
			}.Save();
		}

		internal Transaction_Contratos? FindAndUpdateContract()
		{
			Transaction_Contratos? contrato = Find<Transaction_Contratos>();
			var cuotas = new Tbl_Cuotas()
			{
				numero_contrato = contrato?.numero_contrato
			}.Where<Tbl_Cuotas>(
				FilterData.Equal("Estado", EstadoEnum.PENDIENTE),
				FilterData.Less("fecha", DateTime.Now)
			);
			foreach (var cuota in cuotas)
			{
				TimeSpan diferencia = DateTime.Now.Subtract(cuota.fecha.GetValueOrDefault());
				int diasEnMora = (int)Math.Floor(diferencia.TotalDays);
				// Si 'diasEnMora' es negativo, significa que la fecha de pago aún no ha llegado, entonces ajustamos a cero
				diasEnMora = Math.Max(diasEnMora, 0);
				var montoMora = cuota.total * ((cuota.Transaction_Contratos?.mora / 100) ?? 0.005) * diasEnMora;
				if (montoMora > 0)
				{
					cuota.mora = montoMora;
					cuota.Update();
				}
			}
			var contratoActualizado = Find<Transaction_Contratos>();
			contratoActualizado?.GetRecibos();
			return contratoActualizado;
		}

		internal List<Transaction_Contratos> GetContratos()
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
			Recibos = new Transaccion_Factura
			{
				filterData = [new FilterData
				{
					ObjectName = "Factura_contrato",
					PropName = "numero_contrato",
					FilterType = "JSONPROP_EQUAL",
					PropSQLType = "int",
					Values = new List<string?> { numero_contrato.GetValueOrDefault().ToString() }
				}]
			}.SimpleGet<Transaccion_Factura>();
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
		public double? total { get; set; }
		/**@type {Number} valor del interes del capital*/
		public double? interes { get; set; }
		/**@type {Number} */
		public double? abono_capital { get; set; }
		/**@type {Number} capital restante*/
		public double? capital_restante { get; set; }
		/**@type {Number} capital mora*/
		public double? mora { get; set; }
		/**DATOS DE LA FATURA */
		/**@type {Date} */
		public DateTime? fecha_pago { get; set; }
		/**@type {Number} Tbl_cuotas del abono*/
		public double? pago_contado { get; set; }
		/**@type {Number} Tbl_cuotas del abono*/
		public double? descuento { get; set; }
		/**@type {Number} Tbl_cuotas del abono*/
		public double? tasa_cambio { get; set; }
		public int? numero_contrato { get; set; }
		public string? Estado { get; set; }

		[ManyToOne(TableName = "Transaction_Contratos", KeyColumn = "numero_contrato", ForeignKeyColumn = "numero_contrato")]
		public Transaction_Contratos? Transaction_Contratos { get; set; }
	}

}