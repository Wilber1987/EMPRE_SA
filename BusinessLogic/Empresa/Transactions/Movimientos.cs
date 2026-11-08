using API.Controllers;
using APPCORE;
using APPCORE.Security;
using APPCORE.Services;
using Business;
using BusinessLogic.Empresa.Transactions;
using BusinessLogic.Empresa.Transactions.Model;
using CAPA_NEGOCIO.Services;
using DataBaseModel;
using DocumentFormat.OpenXml.Bibliography;
using Microsoft.Diagnostics.Tracing.Parsers.MicrosoftWindowsWPF;

namespace Transactions
{
	public class Movimientos_Cuentas : TransactionalClass
	{
		[PrimaryKey(Identity = true)]
		public int? id_movimiento { get; set; }
		public string? descripcion { get; set; }
		public string? concepto { get; set; }
		public decimal? monto { get; set; }
		public decimal? tasa_cambio { get; set; }
		public decimal? tasa_cambio_compra { get; set; }
		public MonedaEnum? moneda { get; set; }
		public int? id_usuario_crea { get; set; }
		public DateTime? fecha { get; set; }
		public bool? is_transaction { get; set; }
		public int? Id_cuenta_origen { get; set; }
		public Catalogo_Cuentas? Catalogo_Cuentas_Origen { get; set; }
		public int? Id_cuenta_destino { get; set; }
		public Catalogo_Cuentas? Catalogo_Cuentas_Destino { get; set; }
		public TipoMovimiento? Tipo_Movimiento { get; set; }
		public List<Denominacion_Movimiento> Denominaciones { get; set; } = [];
		public List<FilterData> filterData { get; set; } = [];
        public bool is_hidden { get; internal set; }

        public object? Save(string token)
		{
			try
			{
				BeginGlobalTransaction();
				if (this.is_transaction == true)
				{
					return new ResponseService()
					{
						status = 400,
						message = "No se permite anular un movimiento asociado a una transacción"
					};
				}
				var (user, dbUser) = Business.Security_Users.GetUserData(token);
				ResponseService response = SaveMovimiento(dbUser);
				if (response.status == 200)
				{
					CommitGlobalTransaction();
					if (is_transaction != true)
					{
						SendNotification((Transaction_Movimiento)response.body);
					}
				}
				else
				{
					RollBackGlobalTransaction();
				}

				return response;
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

		public List<Movimientos_Cuentas> Get(string token)
		{

			if (!AuthNetCore.HavePermission(Permissions.ADMIN_ACCESS.ToString(), token))
			{
				var user = AuthNetCore.User(token);
				var dbUser = new Business.Security_Users { Id_User = user.UserId }.Find<Business.Security_Users>();
				this.filterData.Add(FilterData.Equal("id_sucursal", dbUser.Id_Sucursal));
			}
			return new Transaction_Movimiento()
			{
				filterData = this.filterData
			}.Get<Transaction_Movimiento>().Select(z =>
			{
				var constOrigen = z.moneda == MonedaEnum.DOLARES ?
					z.Detail_Movimiento?.Find(x => x.credito_dolares == 0) :
					z.Detail_Movimiento?.Find(x => x.credito == 0);
				var constDestino = z.moneda == MonedaEnum.DOLARES ?
				 	z.Detail_Movimiento?.Find(x => x.debito_dolares == 0) :
				 	z.Detail_Movimiento?.Find(x => x.debito == 0);

				return new Movimientos_Cuentas()
				{
					id_movimiento = z.id_movimiento,
					descripcion = z.descripcion,
					concepto = z.concepto,
					monto = constDestino.moneda?.Equals(MonedaEnum.DOLARES) == true ? constDestino?.credito_dolares : constDestino?.credito,
					tasa_cambio = constDestino?.tasa_cambio,
					tasa_cambio_compra = constDestino?.tasa_cambio_compra,
					moneda = constDestino.moneda,
					id_usuario_crea = z.id_usuario_crea,
					fecha = z.fecha,
					Catalogo_Cuentas_Origen = constOrigen?.catalogo_Cuentas,
					Catalogo_Cuentas_Destino = constDestino?.catalogo_Cuentas,
					Id_cuenta_origen = constOrigen?.id_cuenta,
					Id_cuenta_destino = constDestino?.id_cuenta,
					is_transaction = z.is_transaction
				};
			}
			).ToList();
		}

		public ResponseService SaveMovimiento(Business.Security_Users dbUser)
		{
			var cuentaDestino = new Catalogo_Cuentas()
			{
				id_cuentas = this.Catalogo_Cuentas_Destino?.id_cuentas
			}.Find<Catalogo_Cuentas>();

			var cuentaOrigen = new Catalogo_Cuentas()
			{
				id_cuentas = this.Catalogo_Cuentas_Origen?.id_cuentas
			}.Find<Catalogo_Cuentas>();

			// ============================================
			// 1. VALIDACIONES DE PERMISOS
			// ============================================
			var permiso_cuenta_origen = new Permisos_Cuentas()
			{
				id_categoria_cuenta_destino = cuentaOrigen.Categoria_Cuentas.id_categoria
			}.Find<Permisos_Cuentas>();

			var permiso_cuenta_destino = new Permisos_Cuentas()
			{
				id_categoria_cuenta_destino = cuentaDestino.Categoria_Cuentas.id_categoria
			}.Find<Permisos_Cuentas>();

			if (permiso_cuenta_origen != null && (bool)!permiso_cuenta_origen.permite_debito)
			{
				return new ResponseService()
				{
					status = 400,
					message = cuentaOrigen.nombre + " no permite débitos hacia la cuenta: " + cuentaDestino.nombre
				};
			}

			if (permiso_cuenta_destino != null && (bool)!permiso_cuenta_destino.permite_credito)
			{
				return new ResponseService()
				{
					status = 400,
					message = cuentaDestino.nombre + " no permite créditos desde la cuenta: " + cuentaOrigen.nombre
				};
			}

			// ============================================
			// 2. VALIDACIONES DE CUENTAS
			// ============================================
			if (cuentaOrigen != null && cuentaDestino != null)
			{
				cuentaOrigen.UpdateAt = DateTime.Now;
				cuentaOrigen.saldo = cuentaOrigen?.saldo ?? 0;
				cuentaOrigen.saldo_dolares = cuentaOrigen?.saldo_dolares ?? 0;
				cuentaDestino.UpdateAt = DateTime.Now;
				cuentaDestino.saldo = cuentaDestino?.saldo ?? 0;
				cuentaDestino.saldo_dolares = cuentaDestino?.saldo_dolares ?? 0;

				// Validar saldo suficiente
				if (cuentaOrigen?.tipo_cuenta == Tipo_CuentaEnum.PROPIA)
				{
					var response = new ResponseService()
					{
						status = 403,
						message = $"{this.Catalogo_Cuentas_Origen?.nombre} no cuenta con saldo suficiente"
					};
					if (moneda == MonedaEnum.DOLARES && cuentaOrigen.saldo_dolares < monto)
					{
						return response;
					}
					else if (moneda == MonedaEnum.CORDOBAS && cuentaOrigen.saldo < monto)
					{
						return response;
					}
				}

				// Validar cuentas diferentes
				if (this.Catalogo_Cuentas_Origen?.id_cuentas == this.Catalogo_Cuentas_Destino?.id_cuentas
					&& this.Tipo_Movimiento != TipoMovimiento.COMPRA_DE_MONEDA
					&& this.Tipo_Movimiento != TipoMovimiento.VENTA_DE_MONEDA)
				{
					return new ResponseService()
					{
						status = 403,
						message = "La cuenta de origen debe ser distinta a la cuenta de destino"
					};
				}

				// Validar monedas permitidas
				if (this.Catalogo_Cuentas_Destino?.permite_dolares == false && this.moneda == MonedaEnum.DOLARES)
				{
					return new ResponseService()
					{
						status = 403,
						message = "La cuenta de destino no permite dolares"
					};
				}
				if (this.Catalogo_Cuentas_Destino?.permite_cordobas == false && this.moneda == MonedaEnum.CORDOBAS)
				{
					return new ResponseService()
					{
						status = 403,
						message = "La cuenta de destino no permite cordobas"
					};
				}

				// ============================================
				// 3. VALIDACIONES DE CAJA (ANTES DE GUARDAR)
				// ============================================
				if (EsCuentaCaja(cuentaOrigen) || EsCuentaCaja(cuentaDestino))
				{
					bool requiereCajaAbierta =  Tipo_Movimiento != TipoMovimiento.MOVIMIENTO_CUENTA;
					bool requiereValidacionDeEgrosoDeCajaDeDestino =  cuentaOrigen.tipo_cuenta == Tipo_CuentaEnum.PROPIA;
					// Validar que la caja esté abierta
					if (EsCuentaCaja(cuentaOrigen) && requiereCajaAbierta)
					{
						var corteAbierto = CajasOperation.GetCorteAbierto(cuentaOrigen?.id_cuentas, dbUser);
						if (corteAbierto == null)
						{
							return new ResponseService()
							{
								status = 400,
								message = $"La caja {cuentaOrigen?.nombre} no está abierta. No se puede realizar el movimiento."
							};
						}
					}

					if (EsCuentaCaja(cuentaDestino) && requiereCajaAbierta)
					{
						var corteAbierto = CajasOperation.GetCorteAbierto(cuentaDestino?.id_cuentas, dbUser);
						if (corteAbierto == null)
						{
							return new ResponseService()
							{
								status = 400,
								message = $"La caja {cuentaDestino?.nombre} no está abierta. No se puede realizar el movimiento."
							};
						}
					}

					// Validar denominaciones si se proporcionaron
					if (this.Denominaciones != null && this.Denominaciones.Count > 0)
					{
						/*var validacion = ValidarDenominaciones(this.monto ?? 0, this.moneda, this.Denominaciones);
						if (validacion.status != 200)
						{
							return validacion;
						}*/

						// Validar que la caja origen tenga suficientes billetes
						if (EsCuentaCaja(cuentaOrigen))
						{
							foreach (var denom in this.Denominaciones.Where(d => d.cantidad > 0 && requiereValidacionDeEgrosoDeCajaDeDestino))
							{
								if (!TieneSuficientesBilletes(cuentaOrigen.id_cuentas.Value, denom.id_denominacion.GetValueOrDefault(), denom.cantidad.GetValueOrDefault()))
								{
									var catalogo = new Denominacion_Catalogo() { id_denominacion = denom.id_denominacion }.Find<Denominacion_Catalogo>();
									return new ResponseService()
									{
										status = 400,
										message = $"La caja {cuentaOrigen.nombre} no tiene suficientes billetes de {catalogo?.valor} {catalogo?.moneda}"
									};
								}
							}
						}
					}
				}

				// ============================================
				// 4. CREAR Y GUARDAR EL MOVIMIENTO
				// ============================================
				var encabezado = new Transaction_Movimiento()
				{
					descripcion = this.descripcion,
					concepto = this.concepto,
					id_usuario_crea = dbUser.Id_User,
					tipo = "pendiente",
					moneda = this.moneda,
					tasa_cambio = this.tasa_cambio,
					correo_enviado = false,
					is_transaction = this.is_transaction,
					Id_cuenta_origen = this.Catalogo_Cuentas_Origen?.id_cuentas,
					Id_cuenta_destino = this.Catalogo_Cuentas_Destino?.id_cuentas,
					id_sucursal = dbUser?.Id_Sucursal,
					Tipo_Movimiento = this.Tipo_Movimiento,
					Denominaciones = [.. Denominaciones.Where(d => d.cantidad > 0 )],
					Detail_Movimiento = new List<Detail_Movimiento>(){
						new Detail_Movimiento(){
							catalogo_Cuentas = this.Catalogo_Cuentas_Origen,
							debito = this.moneda == MonedaEnum.CORDOBAS ? this.monto : 0,
							debito_dolares = this.moneda == MonedaEnum.DOLARES ? this.monto : 0,
							credito = 0,
							credito_dolares = 0,
							monto_inicial = cuentaOrigen?.saldo,
							monto_inicial_dolares = cuentaOrigen?.saldo_dolares,
							monto_final = cuentaOrigen?.saldo - (this.moneda == MonedaEnum.CORDOBAS ? this.monto : 0),
							monto_final_dolares = cuentaOrigen?.saldo_dolares - (this.moneda == MonedaEnum.DOLARES ? this.monto : 0),
							tasa_cambio = this.tasa_cambio,
							tasa_cambio_compra = this.tasa_cambio_compra,
							moneda = this.moneda
						},
						new Detail_Movimiento(){
							catalogo_Cuentas = this.Catalogo_Cuentas_Destino,
							debito = 0,
							debito_dolares = 0,
							credito = this.moneda == MonedaEnum.CORDOBAS ? this.monto : 0,
							credito_dolares = this.moneda == MonedaEnum.DOLARES ? this.monto : 0,
							monto_inicial = cuentaDestino?.saldo,
							monto_inicial_dolares = cuentaDestino?.saldo_dolares,
							monto_final = cuentaDestino?.saldo + (this.moneda == MonedaEnum.CORDOBAS ? this.monto : 0),
							monto_final_dolares = cuentaDestino?.saldo_dolares + (this.moneda == MonedaEnum.DOLARES ? this.monto : 0),
							tasa_cambio = this.tasa_cambio,
							tasa_cambio_compra = this.tasa_cambio_compra,
							moneda = this.moneda
						}
					}
				};

				// Actualizar saldos
				cuentaOrigen.saldo = cuentaOrigen.saldo - (this.moneda == MonedaEnum.CORDOBAS ? this.monto : 0);
				cuentaOrigen.saldo_dolares = cuentaOrigen.saldo_dolares - (this.moneda == MonedaEnum.DOLARES ? this.monto : 0);
				cuentaDestino.saldo = cuentaDestino.saldo + (this.moneda == MonedaEnum.CORDOBAS ? this.monto : 0);
				cuentaDestino.saldo_dolares = cuentaDestino.saldo_dolares + (this.moneda == MonedaEnum.DOLARES ? this.monto : 0);

				cuentaDestino.Update();
				cuentaOrigen.Update();
				ActualizarDenominacionesMovimiento(this.Denominaciones);
				object? result = encabezado.Save();
				if (is_hidden)
				{
					encabezado.Delete();
					encabezado.Detail_Movimiento.ForEach(detalle =>
					{
						detalle.Delete();
					});
				}

				// ============================================
				// 5. ACTUALIZAR INVENTARIO DE DENOMINACIONES
				// ============================================
				if (this.Denominaciones != null && this.Denominaciones.Count > 0)
				{
					var movimientoGuardado = result as Transaction_Movimiento;
					if (movimientoGuardado?.id_movimiento != null)
					{
						// Guardar denominaciones del movimiento
						
						// Actualizar inventario de la caja destino (INGRESO)
						if (EsCuentaCaja(cuentaDestino))
						{
							ActualizarInventarioDenominaciones(
								cuentaDestino.id_cuentas.Value,
								this.Denominaciones, DirectionEnum.INGRESO
							);
						}

						// Actualizar inventario de la caja origen (EGRESO)
						if (EsCuentaCaja(cuentaOrigen))
						{
							ActualizarInventarioDenominaciones(
								cuentaOrigen.id_cuentas.Value,
								this.Denominaciones, DirectionEnum.EGRESO
							);
						}
					}
				}

				return new ResponseService()
				{
					status = 200,
					message = "Movimiento registrado correctamente",
					body = result
				};
			}

			return new ResponseService()
			{
				status = 400,
				message = "Cuentas invalidas"
			};
		}

		private bool EsCuentaCaja(Catalogo_Cuentas cuenta)
		{
			if (cuenta == null) return false;

			// Verificar si la cuenta es de tipo caja
			var categoriasCaja = new[] {
				Categoria_CuentasEnum.CAJA_1.ToString(),
				Categoria_CuentasEnum.CAJA_2.ToString(),
				Categoria_CuentasEnum.CAJA_CHICA.ToString(),
				Categoria_CuentasEnum.CAJA_GENERAL.ToString()
			};

			return cuenta.tipo_cuenta == Tipo_CuentaEnum.PROPIA
				&& categoriasCaja.Contains(cuenta.Categoria_Cuentas?.descripcion);
		}

		/// <summary>
		/// Guarda las denominaciones específicas que el cajero indicó en el movimiento
		/// </summary>
		private void ActualizarDenominacionesMovimiento(List<Denominacion_Movimiento> denominaciones)
		{
			if (denominaciones == null || denominaciones.Count == 0)
				return;

			foreach (var denom in denominaciones)
			{
				// Obtener información de la denominación
				var catalogo = new Denominacion_Catalogo()
				{
					id_denominacion = denom.id_denominacion
				}.Find<Denominacion_Catalogo>();

				if (catalogo == null) continue;

				// Calcular subtotal
				var subtotal = (catalogo.valor ?? 0) * denom.cantidad;
				denom.subtotal = subtotal;			
			}
		}

		/// <summary>
		/// Valida que las denominaciones coincidan con el monto del movimiento
		/// </summary>
		private ResponseService ValidarDenominaciones(decimal montoMovimiento,
													 MonedaEnum? monedaMovimiento,
													 List<Denominacion_Movimiento> denominaciones)
		{
			if (denominaciones == null || denominaciones.Count == 0)
			{
				return new ResponseService()
				{
					status = 400,
					message = "Debe especificar las denominaciones del movimiento"
				};
			}

			decimal totalDenominaciones = 0;

			foreach (var denom in denominaciones.Where(m => m.cantidad > 0).ToList() )
			{
				var catalogo = new Denominacion_Catalogo()
				{
					id_denominacion = denom.id_denominacion
				}.Find<Denominacion_Catalogo>();

				if (catalogo == null)
				{
					return new ResponseService()
					{
						status = 400,
						message = $"Denominación con ID {denom.id_denominacion} no encontrada"
					};
				}

				// Validar que la moneda de la denominación coincida con la del movimiento
				if (catalogo.moneda != monedaMovimiento)
				{
					return new ResponseService()
					{
						status = 400,
						message = $"La denominación {catalogo.valor} {catalogo.moneda} no corresponde a la moneda del movimiento ({monedaMovimiento})"
					};
				}

				// Validar que la cantidad sea positiva
				if (denom.cantidad <= 0)
				{
					return new ResponseService()
					{
						status = 400,
						message = $"La cantidad de billetes de {catalogo.valor} {catalogo.moneda} debe ser mayor a 0"
					};
				}

				totalDenominaciones += (catalogo.valor ?? 0) * (denom.cantidad ?? 0);
			}

			// Validar que el total de denominaciones coincida con el monto del movimiento
			if (totalDenominaciones != montoMovimiento)
			{
				return new ResponseService()
				{
					status = 400,
					message = $"El total de las denominaciones ({totalDenominaciones}) no coincide con el monto del movimiento ({montoMovimiento})"
				};
			}

			return new ResponseService()
			{
				status = 200,
				message = "Validación exitosa"
			};
		}
		public void SendNotification(Transaction_Movimiento item)
		{
			try
			{

				var dbUser = new Business.Security_Users { Id_User = item.id_usuario_crea }.Find<Business.Security_Users>();
				var constOrigen = item.Detail_Movimiento?.Find(x => x.credito == 0);
				var constDestino = item.Detail_Movimiento?.Find(x => x.debito == 0);
				var modelo = new
				{
					FechaMovimiento = item.fecha,
					CuentaOrigen = $"{constOrigen?.catalogo_Cuentas?.nombre} ({constOrigen?.catalogo_Cuentas?.id_sucursal?.ToString("D9")}) de la sucursal: {constOrigen?.catalogo_Cuentas?.Catalogo_Sucursales?.Descripcion}",
					CuentaDestino = $"{constDestino?.catalogo_Cuentas?.nombre} ({constDestino?.catalogo_Cuentas?.id_sucursal?.ToString("D9")}) de la sucursal: {constDestino?.catalogo_Cuentas?.Catalogo_Sucursales?.Descripcion}",
					TipoMoneda = item.moneda == MonedaEnum.DOLARES ? "$" : "C$",
					Monto = NumberUtility.ConvertToMoneyString(constDestino?.moneda.Equals(MonedaEnum.DOLARES) == true
					? constDestino?.credito_dolares : constDestino?.credito),
					Concepto = item.concepto,
					Usuario = $"{dbUser?.Nombres} ({item.id_usuario_crea?.ToString("D9")})"
				};
				MailServices.SendMailContract(new List<String>() {
					"wilberj1987@gmail.com",
					//"alderhernandez@gmail.com" 
					},
					"noreply@noreply",
					"Notificación de movimiento entre cuentas",
					NotificacionTemplate,
					modelo
				);//todo definir correos a enviar
				var update = new Transaction_Movimiento()
				{
					id_movimiento = item.id_movimiento
				}.Find<Transaction_Movimiento>();
			}
			catch (System.Exception ex)
			{
				LoggerServices.AddMessageError("ERROR ENVIENDO EL CORREO: ", ex);
			}
		}

		/// <summary>
		/// Actualiza el inventario de denominaciones de la caja después de cada movimiento
		/// </summary>
		private void ActualizarInventarioDenominaciones(int id_cuenta_caja,
													   List<Denominacion_Movimiento> denominaciones,
                                                       DirectionEnum direction)
		{
			if (denominaciones == null || denominaciones.Count == 0)
				return;

			foreach (var denom in denominaciones)
			{
				// Buscar si ya existe un registro para esta cuenta y denominación
				var inventario = new Inventario_Denominacion_Caja()
				{
					id_cuenta = id_cuenta_caja,
					id_denominacion = denom.id_denominacion
				}.Find<Inventario_Denominacion_Caja>();

				if (inventario == null)
				{
					// Crear nuevo registro
					inventario = new Inventario_Denominacion_Caja()
					{
						id_cuenta = id_cuenta_caja,
						id_denominacion = denom.id_denominacion,
						cantidad_actual = 0,
						ultima_actualizacion = DateTime.Now
					};
					inventario.Save();
				}

				// Actualizar cantidad según el tipo de operación
				if (direction == DirectionEnum.INGRESO)
				{
					inventario.cantidad_actual += denom.cantidad;
				}
				else if (direction == DirectionEnum.EGRESO)
				{
					inventario.cantidad_actual -= denom.cantidad;

					// Validar que no haya cantidades negativas
					if (inventario.cantidad_actual < 0)
					{
						throw new Exception(
							$"Error: No hay suficientes billetes de denominación {denom.id_denominacion}. " +
							$"Cantidad actual: {inventario.cantidad_actual + denom.cantidad}, " +
							$"Intentando retirar: {denom.cantidad}"
						);
					}
				}

				inventario.ultima_actualizacion = DateTime.Now;
				inventario.Update();
			}
		}
		/// <summary>
		/// Valida que la caja tenga suficientes billetes de una denominación específica
		/// </summary>
		public static bool TieneSuficientesBilletes(int id_cuenta_caja, int id_denominacion, int cantidad_requerida)
		{
			var inventario = new Inventario_Denominacion_Caja()
			{
				id_cuenta = id_cuenta_caja,
				id_denominacion = id_denominacion
			}.Find<Inventario_Denominacion_Caja>();

			return inventario != null && (inventario.cantidad_actual ?? 0) >= cantidad_requerida;
		}
		static readonly string NotificacionTemplate = @"<!DOCTYPE html>
			<html lang='es'>
			<head>
				<meta charset='UTF-8'>
				<meta name='viewport' content='width=device-width, initial-scale=1.0'>
				<title>Notificación de Movimiento entre Cuentas</title>
			</head>
			<body>
				<div style='font-family: Arial, sans-serif; padding: 20px; background-color: #f7f7f7;'>
					<h2 style='color: #333;'>Notificación de Movimiento entre Cuentas</h2>
					<p><strong>Fecha del movimiento:</strong> {{FechaMovimiento}}</p>        
					<p><strong>Cuenta de origen:</strong> {{CuentaOrigen}}</p>
					<p><strong>Cuenta de destino:</strong> {{CuentaDestino}}</p>        
					<p><strong>Monto:</strong> <span style='color: black; background-color: yellow;'>{{TipoMoneda}} {{Monto}}</span></p>
					<p><strong>Concepto:</strong> {{Concepto}}</p>
					<p><strong>Usuario que realizó el movimiento:</strong> {{Usuario}}</p>
				</div>
			</body>
			</html>";

		/// <summary>
		/// Obtiene el inventario actual de denominaciones de una caja
		/// </summary>
		public static List<InventarioActualDTO> GetInventarioActual(int id_cuenta_caja)
		{
			var inventario = new Inventario_Denominacion_Caja()
			{
				id_cuenta = id_cuenta_caja
			}.Get<Inventario_Denominacion_Caja>();

			return inventario.Select(i =>
			{
				var catalogo = i.Denominacion_Catalogo;
				return new InventarioActualDTO()
				{
					id_denominacion = i.id_denominacion.GetValueOrDefault(),
					valor = catalogo?.valor ?? 0,
					moneda = catalogo?.moneda ?? MonedaEnum.DOLARES,
					tipo = catalogo?.tipo ?? "",
					cantidad = i.cantidad_actual ?? 0,
					total = (catalogo?.valor ?? 0) * (i.cantidad_actual ?? 0),
					ultima_actualizacion = i.ultima_actualizacion
				};
			}).OrderBy(x => x.valor).ToList();
		}
	}

	public enum TipoMovimiento
	{
		COMPRA_DE_MONEDA,
		VENTA_DE_MONEDA,
		REEMBOLSO_POR_CONTRATO_ANULADO,
		DESEMBOLSO_POR_CONTRATO,
		INGRESO_POR_PAGO_DE_RECIBO,
		DESEMBOLSO_POR_ANULACION_DE_PAGO_DE_RECIBO,
		DESEMBOLSO_POR_ANULACION_DE_PAGO_DE_FACTURACION,
		INGRESO_POR_PAGO_DE_FACTURACION,
		PAGO, //PAGO GENERAL, POR EJEMPLO CUANDO SE PAGA LA LUZ O ALQUILERES
		INGRESO,//INGRESO GENERAL
		EGRESO,//EGRESO GENERAL
		MOVIMIENTO_CUENTA, //PARA EJEMPLIFICAR MOVIMIENTOS DE CAJA
		DESEMBOLSO_POR_COMPRA,
		REEMBOLSO_POR_COMPRA_ANULADA,
		BENEFICIO_VENTA_DE_MONEDA,
        PERDIDA_COMPRA_DE_MONEDA,
		CAMBIO_MONEDA
    }


}