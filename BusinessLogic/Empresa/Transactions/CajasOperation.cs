using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Controllers;
using APPCORE;
using APPCORE.Security;
using BusinessLogic.Empresa.Transactions.Model;
using DataBaseModel;
using Transactions;

namespace BusinessLogic.Empresa.Transactions
{
    public class CajasOperation
    {

        /// <summary>
        /// Abre una nueva sesión de caja
        /// </summary>
        public static ResponseService AbrirCaja(Corte_Caja corte_caja,
            string? sessionKey)
        {
            try
            {
                var (User, dbUser) = Business.Security_Users.GetUserData(sessionKey);
                // Validar que no haya un corte abierto para esta cuenta
                var corteAbierto = new Corte_Caja()
                {
                    id_cuenta = corte_caja.id_cuenta
                }.Find<Corte_Caja>(
                    FilterData.Equal("estado", EstadoCorteCaja.ABIERTO)
                );

                if (corteAbierto != null)
                {
                    return new ResponseService()
                    {
                        status = 400,
                        message = "Ya existe un corte de caja abierto para esta cuenta"
                    };
                }

                // Calcular montos iniciales basándose en las denominaciones
                decimal montoInicialCordobas = 0;
                decimal montoInicialDolares = 0;

                if (corte_caja.Denominaciones_Apertura != null && corte_caja.Denominaciones_Apertura.Count > 0)
                {
                    foreach (var denom in corte_caja.Denominaciones_Apertura)
                    {
                        // Obtener información de la denominación
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

                        // Calcular subtotal
                        var subtotal = (catalogo.valor ?? 0) * (denom.cantidad ?? 0);
                        denom.subtotal = subtotal;

                        // Acumular según la moneda
                        if (catalogo.moneda == Business.MonedaEnum.CORDOBAS)
                        {
                            montoInicialCordobas += subtotal;
                        }
                        else if (catalogo.moneda == Business.MonedaEnum.DOLARES)
                        {
                            montoInicialDolares += subtotal;
                        }
                    }
                }

                // Asignar valores calculados
                corte_caja.estado = EstadoCorteCaja.ABIERTO;
                corte_caja.fecha_apertura = DateTime.Now;
                corte_caja.id_usuario_apertura = dbUser?.Id_User;
                corte_caja.id_sucursal = dbUser?.Id_Sucursal;
                corte_caja.monto_inicial_cordobas = montoInicialCordobas;
                corte_caja.monto_inicial_dolares = montoInicialDolares;

                var result = corte_caja.Save();

                // Guardar denominaciones iniciales
                /*if (denominacionesIniciales != null && denominacionesIniciales.Count > 0)
                {
                    foreach (var denom in denominacionesIniciales)
                    {
                        denom.id_corte_caja = corte_caja.id_corte_caja;
                        denom.Save();
                    }
                }*/

                return new ResponseService()
                {
                    status = 200,
                    message = "Caja abierta exitosamente",
                    body = new
                    {
                        corte = result,
                        monto_inicial_cordobas = montoInicialCordobas,
                        monto_inicial_dolares = montoInicialDolares,
                        total_denominaciones = corte_caja.Denominaciones_Apertura?.Count ?? 0
                    }
                };
            }
            catch (Exception ex)
            {
                return new ResponseService()
                {
                    status = 400,
                    message = "Error al abrir caja: " + ex.Message
                };
            }
        }

        /// <summary>
        /// Cierra la sesión de caja con conteo físico
        /// </summary>

        public static ResponseService CerrarCaja(Corte_Caja corte_caja, string? sessionKey,
                                      string observaciones = null,
                                      List<AjusteDenominacionDTO> ajustes = null)
        {
            try
            {
                var (User, dbUser) = Business.Security_Users.GetUserData(sessionKey);

                if (corte_caja.estado != EstadoCorteCaja.ABIERTO)
                {
                    return new ResponseService()
                    {
                        status = 400,
                        message = "El corte de caja no está abierto"
                    };
                }

                // ============================================
                // 1. Obtener inventario actual del sistema
                // ============================================
                var inventarioActual = GetInventarioActual(corte_caja.id_cuenta.GetValueOrDefault());

                decimal totalEsperadoCordobas = inventarioActual
                    .Where(i => i.moneda == Business.MonedaEnum.CORDOBAS)
                    .Sum(i => i.total);

                decimal totalEsperadoDolares = inventarioActual
                    .Where(i => i.moneda == Business.MonedaEnum.DOLARES)
                    .Sum(i => i.total);

                // ============================================
                // 2. Aplicar ajustes si el cajero reporta diferencias
                // ============================================
                if (ajustes != null && ajustes.Count > 0)
                {
                    foreach (var ajuste in ajustes)
                    {
                        var itemInventario = inventarioActual
                            .FirstOrDefault(i => i.id_denominacion == ajuste.id_denominacion);

                        if (itemInventario != null)
                        {
                            itemInventario.cantidad += ajuste.diferencia_cantidad;
                            itemInventario.total = itemInventario.valor * itemInventario.cantidad;

                            // Actualizar en la base de datos
                            var inventarioDb = new Inventario_Denominacion_Caja()
                            {
                                id_cuenta = corte_caja.id_cuenta,
                                id_denominacion = ajuste.id_denominacion
                            }.Find<Inventario_Denominacion_Caja>();

                            if (inventarioDb != null)
                            {
                                inventarioDb.cantidad_actual = itemInventario.cantidad;
                                inventarioDb.ultima_actualizacion = DateTime.Now;
                                inventarioDb.Update();
                            }
                        }
                    }

                    // Recalcular totales después de ajustes
                    totalEsperadoCordobas = inventarioActual
                        .Where(i => i.moneda == Business.MonedaEnum.CORDOBAS)
                        .Sum(i => i.total);

                    totalEsperadoDolares = inventarioActual
                        .Where(i => i.moneda == Business.MonedaEnum.DOLARES)
                        .Sum(i => i.total);
                }

                // ============================================
                // 3. Calcular movimientos del corte (para auditoría)
                // ============================================
                var movimientos = GetMovimientosDelCorte(corte_caja);
                var totales = CalcularTotalesDelCorte(corte_caja, movimientos);

                // ============================================
                // 4. Crear movimiento de transferencia a caja general
                // ============================================
                 /*
                 ar cuentaOrigen = new Catalogo_Cuentas() { id_cuentas = corte_caja.id_cuenta }.Find<Catalogo_Cuentas>();
                var cuentaDestino = Catalogo_Cuentas.GetCuentaCajaGeneral(dbUser); // Caja general

                if (cuentaDestino == null)
                {
                    return new ResponseService()
                    {
                        status = 400,
                        message = "No se encontró la cuenta de caja general"
                    };
                }
               
                // Preparar denominaciones para el movimiento de transferencia
                var denominacionesTransferencia = new List<DenominacionMovimientoDTO>();

                foreach (var item in inventarioActual.Where(i => i.cantidad > 0))
                {
                    // EGRESO de la caja que se cierra
                    denominacionesTransferencia.Add(new DenominacionMovimientoDTO()
                    {
                        id_denominacion = item.id_denominacion,
                        cantidad = item.cantidad,
                        tipo_operacion = "EGRESO"
                    });

                    // INGRESO a la caja general
                    denominacionesTransferencia.Add(new DenominacionMovimientoDTO()
                    {
                        id_denominacion = item.id_denominacion,
                        cantidad = item.cantidad,
                        tipo_operacion = "INGRESO"
                    });
                }

               // Crear movimiento de córdobas si hay saldo
                if (totalEsperadoCordobas > 0)
                {
                    var movimientoCordobas = new Movimientos_Cuentas()
                    {
                        descripcion = $"Transferencia por cierre de caja - {cuentaOrigen.nombre}",
                        concepto = $"Cierre de caja #{corte_caja.id_corte_caja}",
                        monto = totalEsperadoCordobas,
                        moneda = Business.MonedaEnum.CORDOBAS,
                        Catalogo_Cuentas_Origen = cuentaOrigen,
                        Catalogo_Cuentas_Destino = cuentaDestino,
                        Tipo_Movimiento = TipoMovimiento.MOVIMIENTO_CUENTA,
                        is_transaction = false,
                        Denominaciones = denominacionesTransferencia
                            .Where(d =>
                            {
                                var catalogo = new Denominacion_Catalogo() { id_denominacion = d.id_denominacion }.Find<Denominacion_Catalogo>();
                                return catalogo?.moneda == Business.MonedaEnum.CORDOBAS;
                            }).ToList()
                    };

                    var responseCordobas = movimientoCordobas.SaveMovimiento(dbUser);
                    if (responseCordobas.status != 200)
                    {
                        return responseCordobas;
                    }
                }

                // Crear movimiento de dólares si hay saldo
                if (totalEsperadoDolares > 0)
                {
                    var movimientoDolares = new Movimientos_Cuentas()
                    {
                        descripcion = $"Transferencia por cierre de caja - {cuentaOrigen.nombre}",
                        concepto = $"Cierre de caja #{corte_caja.id_corte_caja}",
                        monto = totalEsperadoDolares,
                        moneda = Business.MonedaEnum.DOLARES,
                        Catalogo_Cuentas_Origen = cuentaOrigen,
                        Catalogo_Cuentas_Destino = cuentaDestino,
                        Tipo_Movimiento = TipoMovimiento.MOVIMIENTO_CUENTA,
                        is_transaction = false,
                        Denominaciones = denominacionesTransferencia
                            .Where(d =>
                            {
                                var catalogo = new Denominacion_Catalogo() { id_denominacion = d.id_denominacion }.Find<Denominacion_Catalogo>();
                                return catalogo?.moneda == Business.MonedaEnum.DOLARES;
                            }).ToList()
                    };

                    var responseDolares = movimientoDolares.SaveMovimiento(dbUser);
                    if (responseDolares.status != 200)
                    {
                        return responseDolares;
                    }
                }*/

                // ============================================
                // 5. Asignar montos finales
                // ============================================
                corte_caja.monto_esperado_cordobas = totalEsperadoCordobas;
                corte_caja.monto_esperado_dolares = totalEsperadoDolares;

                // El monto físico es el mismo que el esperado (ya validado)
                corte_caja.monto_fisico_cordobas = totalEsperadoCordobas;
                corte_caja.monto_fisico_dolares = totalEsperadoDolares;

                // Diferencia es 0 si no hubo ajustes
                corte_caja.diferencia_cordobas = 0;
                corte_caja.diferencia_dolares = 0;

                // ============================================
                // 6. Cerrar el corte
                // ============================================
                corte_caja.estado = EstadoCorteCaja.CERRADO;
                corte_caja.fecha_cierre = DateTime.Now;
                corte_caja.id_usuario_cierre = dbUser.Id_User;
                corte_caja.observaciones_cierre = observaciones ?? "";

                corte_caja.Update();

                // Guardar el inventario final como denominaciones del cierre
                foreach (var item in inventarioActual.Where(i => i.cantidad > 0))
                {
                    var denominacion = corte_caja.Denominaciones_Cierre.Find(d => d.id_denominacion == item.id_denominacion);

                    if (denominacion == null)
                    {
                        corte_caja.Denominaciones_Cierre.Add(new Denominacion_Caja()
                        {
                            id_corte_caja = corte_caja.id_corte_caja,
                            id_denominacion = item.id_denominacion,
                            cantidad = item.cantidad,
                            subtotal = item.total
                        });
                        corte_caja.observaciones_cierre += $" - denominacion {item.moneda} {item.Denominacion_Catalogo?.valor} no fue reportada en el cierre";
                    }
                    else if (denominacion != null && item.cantidad != denominacion.cantidad)
                    {
                        corte_caja.observaciones_cierre += $" - denominacion {item.moneda} {item.Denominacion_Catalogo?.valor} no coincide con la cangidad reportada (reportada: ${denominacion.cantidad}, esperada: ${item.cantidad})";
                    }
                }

                // NO limpiamos el inventario bruscamente, el movimiento de transferencia ya lo actualizó
                // El inventario de la caja origen quedó en 0 automáticamente por el movimiento

                return new ResponseService()
                {
                    status = 200,
                    message = "Caja cerrada exitosamente y fondos transferidos a caja general",
                    body = new
                    {
                        id_corte = corte_caja.id_corte_caja,
                        inventario_final = inventarioActual,
                        monto_esperado_cordobas = totalEsperadoCordobas,
                        monto_esperado_dolares = totalEsperadoDolares,
                        total_ingresos_cordobas = totales.ingresosCordobas,
                        total_ingresos_dolares = totales.ingresosDolares,
                        total_egresos_cordobas = totales.egresosCordobas,
                        total_egresos_dolares = totales.egresosDolares,
                        cantidad_movimientos = movimientos.Count,
                        ajustes_aplicados = ajustes?.Count ?? 0,
                        //cuenta_destino = cuentaDestino.nombre,
                        transferencia_realizada = true
                    }
                };
            }
            catch (Exception ex)
            {
                return new ResponseService()
                {
                    status = 400,
                    message = "Error al cerrar caja: " + ex.Message
                };
            }
        }

        /// <summary>
        /// Obtiene el inventario actual de denominaciones de una caja
        /// </summary>
        private static List<InventarioActualDTO> GetInventarioActual(int id_cuenta_caja)
        {
            var inventario = new Inventario_Denominacion_Caja()
            {
                id_cuenta = id_cuenta_caja
            }.Get<Inventario_Denominacion_Caja>();

            return inventario.Select(i =>
            {
                var catalogo = new Denominacion_Catalogo()
                {
                    id_denominacion = i.id_denominacion
                }.Find<Denominacion_Catalogo>();

                return new InventarioActualDTO()
                {
                    id_denominacion = i.id_denominacion.GetValueOrDefault(),
                    valor = catalogo?.valor ?? 0,
                    moneda = catalogo?.moneda ?? Business.MonedaEnum.DOLARES,
                    tipo = catalogo?.tipo ?? "",
                    cantidad = i.cantidad_actual ?? 0,
                    total = (catalogo?.valor ?? 0) * (i.cantidad_actual ?? 0),
                    ultima_actualizacion = i.ultima_actualizacion,
                    Denominacion_Catalogo = catalogo
                };
            }).OrderBy(x => x.moneda).ThenBy(x => x.valor).ToList();
        }




        /// <summary>
        /// Calcula los totales de ingresos y egresos de la caja durante el corte
        /// </summary>
        private static (decimal ingresosCordobas, decimal ingresosDolares,
                 decimal egresosCordobas, decimal egresosDolares)
        CalcularTotalesDelCorte(Corte_Caja corte_caja, List<Transaction_Movimiento> movimientos)
        {
            decimal ingresosCordobas = 0;
            decimal ingresosDolares = 0;
            decimal egresosCordobas = 0;
            decimal egresosDolares = 0;

            foreach (var mov in movimientos)
            {
                // Buscar el detalle que pertenece a esta caja
                var detalleCaja = mov.Detail_Movimiento?
                    .FirstOrDefault(d => d.id_cuenta == corte_caja.id_cuenta);
                if (detalleCaja == null) continue;
                // Los créditos en el detalle de la caja = INGRESOS (dinero que entró)
                ingresosCordobas += detalleCaja.credito ?? 0;
                ingresosDolares += detalleCaja.credito_dolares ?? 0;
                // Los débitos en el detalle de la caja = EGRESOS (dinero que salió)
                egresosCordobas += detalleCaja.debito ?? 0;
                egresosDolares += detalleCaja.debito_dolares ?? 0;
            }

            return (ingresosCordobas, ingresosDolares, egresosCordobas, egresosDolares);
        }

        /// <summary>
        /// Obtiene todos los movimientos realizados durante este corte
        /// </summary>
        private static List<Transaction_Movimiento> GetMovimientosDelCorte(Corte_Caja corte_caja)
        {
            return new Transaction_Movimiento()
            {
                // Filtro: movimientos donde la cuenta origen o destino es esta caja
                // y la fecha está entre apertura y cierre
            }.Where<Transaction_Movimiento>(
                    FilterData.Or(FilterData.Equal("Id_cuenta_origen", corte_caja.id_cuenta),
                    FilterData.Equal("Id_cuenta_destino", corte_caja.id_cuenta)),
                    FilterData.GreaterEqual("fecha", corte_caja.fecha_apertura),
                    FilterData.LessEqual("fecha", corte_caja.fecha_cierre ?? DateTime.Now)
            );
        }

        /// <summary>
        /// Obtiene el corte abierto actual de una cuenta
        /// </summary>
        public static Corte_Caja? GetCorteAbierto(int? id_cuenta, string? sessionKey)
        {
            var (User, dbUser) = Business.Security_Users.GetUserData(sessionKey);
            return GetCorteAbierto(id_cuenta, dbUser);
        }

        public static Corte_Caja? GetCorteAbierto(int? id_cuenta, Business.Security_Users? dbUser)
        {
            var corte = new Corte_Caja().Find<Corte_Caja>(
                FilterData.Equal("estado", EstadoCorteCaja.ABIERTO),
                FilterData.Equal("id_cuenta", id_cuenta ?? -1),
                FilterData.Equal("id_sucursal", dbUser?.Id_Sucursal ?? -1)
            );
            var inventarioActual = GetInventarioActual(id_cuenta.GetValueOrDefault());
            // ============================================
            // 3. Calcular movimientos del corte (para auditoría)
            // ============================================
            if (corte == null)
            {
                return new Corte_Caja
                {
                    Denominaciones_Apertura = MapDenominaciones(corte, inventarioActual)
                };
            }
            var movimientos = GetMovimientosDelCorte(corte);
            var totales = CalcularTotalesDelCorte(corte, movimientos);


            corte.Denominaciones_Cierre = MapDenominaciones(corte, inventarioActual);
            return corte;
        }

        private static List<Denominacion_Caja> MapDenominaciones(Corte_Caja? corte, List<InventarioActualDTO> inventarioActual)
        {
            return inventarioActual.Select(i =>
                new Denominacion_Caja
                {
                    id_corte_caja = corte?.id_corte_caja,
                    id_denominacion = i.id_denominacion,
                    Denominacion_Catalogo = i.Denominacion_Catalogo,
                    subtotal = i.total,
                    cantidad = i.cantidad
                }
            ).ToList();
        }

        public static List<Corte_Caja> GetCortesAbiertos(string? sessionKey)
        {
            var (User, dbUser) = Business.Security_Users.GetUserData(sessionKey);

            return GetCortesAbiertos(dbUser);
        }

        public static List<Corte_Caja> GetCortesAbiertos(Business.Security_Users? dbUser)
        {
            return new Corte_Caja().Where<Corte_Caja>(
                FilterData.Equal("estado", EstadoCorteCaja.ABIERTO),
                FilterData.Equal("id_sucursal", dbUser?.Id_Sucursal ?? -1)
            );
        }

        public static List<Catalogo_Cuentas> GetOwCuentasCaja(string? sessionKey)
        {
            var (User, dbUser) = Business.Security_Users.GetUserData(sessionKey);
            List<Catalogo_Cuentas> cuentas = [];
            if (AuthNetCore.HavePermission(sessionKey, Permissions.GESTION_RECIBOS))
            {
                cuentas.Add(Catalogo_Cuentas.GetCuentaIngresoRecibos(dbUser));
            }
            if (AuthNetCore.HavePermission(sessionKey, Permissions.GESTION_VENTAS))
            {
                cuentas.Add(Catalogo_Cuentas.GetCuentaIngresoFacturas(dbUser));
            }
            if (AuthNetCore.HavePermission(sessionKey, Permissions.CAJA_CONTRATOS))
            {
                cuentas.Add(Catalogo_Cuentas.GetCuentaEgresoContratos(dbUser));
            }
            return [.. cuentas.DistinctBy(cuenta => cuenta.id_cuentas)];
        }
    }

}