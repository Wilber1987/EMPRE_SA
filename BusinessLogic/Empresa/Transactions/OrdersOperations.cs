using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using APPCORE;
using Business;
using BusinessLogic.Empresa.Entity;
using BusinessLogic.Facturacion.Operations;
using DataBaseModel;
using Transactions;
using UI.CAPA_NEGOCIO.Facturacion.Operations;

namespace BusinessLogic.Empresa.Transactions
{
    public class OrdersOperations : TransactionalClass
    {

        public ResponseService AprobarYEjecutar(string? sessionKey, Orden_Movimiento order)
        {
            try
            {
                BeginGlobalTransaction();
                var (User, dbUser) = Business.Security_Users.GetUserData(sessionKey);

                var response = DoAprobaryEjecutarOrder(order, dbUser);

                if (response.status == 200)
                    CommitGlobalTransaction();
                else
                    RollBackGlobalTransaction();

                return response;
            }
            catch (Exception ex)
            {
                RollBackGlobalTransaction();
                return new ResponseService() { status = 400, message = "Error al aprobar orden: " + ex.Message };
            }
        }

        public static ResponseService DoAprobaryEjecutarOrder(Orden_Movimiento order, Security_Users? dbUser)
        {

            if (order.Tipo_Movimiento == TipoMovimiento.CAMBIO_MONEDA
                || order.Tipo_Movimiento == TipoMovimiento.MOVIMIENTO_CUENTA
                || order.AutoCreate)
            {
                order.estado = EstadoOrden.PENDIENTE;
                order.Save();
            }

            var orderBd = new Orden_Movimiento { }.Find<Orden_Movimiento>(
                FilterData.Equal("id_orden", order.id_orden)
            );

            if (orderBd == null)
                return new ResponseService() { status = 400, message = "La orden no existe" };

            if (orderBd.estado != EstadoOrden.PENDIENTE)
                return new ResponseService() { status = 400, message = $"La orden no está pendiente. Estado actual: {orderBd.estado}" };

            // ============================================
            // 1. VALIDACIÓN DE DENOMINACIONES
            // ============================================
            var validacionDenoms = OrderValidationOperation.ValidarDenominacionesDeOrden(order);
            if (validacionDenoms.status != 200)
                return validacionDenoms;

            // ============================================
            // 2. PROCESAR OPERACIÓN DE CAMBIO (SI APLICA)
            // ============================================
            if (order.tipo_operacion_cambio == TipoOperacionEnum.MIXED_PAYMENT)
            {
                var responseCambio = MesaCambiariaService.ProcesarCambioEnOrden(dbUser, order);
                if (responseCambio.status != 200)
                    return responseCambio;
            }

            if (order.direccion == DirectionEnum.MIXED)
            {
                var responseCambio = MesaCambiariaService.ProcesarCambioEnOrden(dbUser, order);
                return responseCambio; // el commit/rollback lo decide el status en el wrapper
            }

            // NUEVO: 3. PROCESAR VUELTO (SI APLICA)
            if (!string.IsNullOrEmpty(order.tipo_vuelto) && order.tipo_vuelto != "NONE")
            {
                var responseVuelto = MesaCambiariaService.ProcesarVueltoEnOrden(dbUser, order);
                if (responseVuelto.status != 200)
                    return responseVuelto;
            }

            // ============================================
            // 3. APROBAR Y EJECUTAR LA ORDEN ORIGINAL
            // ============================================
            order.estado = EstadoOrden.APROBADA;
            order.id_usuario_aprueba = dbUser.Id_User;
            order.fecha_aprobacion = DateTime.Now;
            order.Update();

            var movimiento = new Movimientos_Cuentas()
            {
                descripcion = order.descripcion,
                concepto = order.concepto,
                monto = order.monto,
                tasa_cambio = order.tasa_cambio,
                tasa_cambio_compra = order.tasa_cambio_compra,
                moneda = order.moneda,
                Catalogo_Cuentas_Origen = new Catalogo_Cuentas() { id_cuentas = order.Id_cuenta_origen },
                Catalogo_Cuentas_Destino = new Catalogo_Cuentas() { id_cuentas = order.Id_cuenta_destino },
                Tipo_Movimiento = order.Tipo_Movimiento,
                is_transaction = false,
            };

            foreach (var item in order.DenominationsNIO ?? new List<Denominacion_Movimiento>())
                movimiento.Denominaciones.Add(item);

            foreach (var item in order.DenominationsUSD ?? new List<Denominacion_Movimiento>())
                movimiento.Denominaciones.Add(item);

            var response = movimiento.SaveMovimiento(dbUser);

            if (response.status == 200)
            {
                order.estado = EstadoOrden.EJECUTADA;
                order.id_movimiento_ejecutado = ((Transaction_Movimiento)response.body)?.id_movimiento;
                order.Update();
            }
            (bool flowControl, ResponseService value) = ProcesarDocumentoAsociado(order, dbUser);
            if (!flowControl)
            {
                return value;
            }

            return response;
        }

        private static (bool flowControl, ResponseService value) ProcesarDocumentoAsociado(Orden_Movimiento order, Security_Users dbUser)
        {
            if (order.Tipo_Movimiento == TipoMovimiento.DESEMBOLSO_POR_CONTRATO)
            {
                var contrato = new Transaction_Contratos().Find<Transaction_Contratos>(FilterData.Equal("numero_contrato", order.id_documento_origen));
                if (contrato != null)
                {
                    contrato.estado = Contratos_State.ACTIVO;
                    contrato.Update();
                }
                else
                {
                    return (flowControl: false, value: new ResponseService() { status = 400, message = $"La orden  es de tipo contrato y el contrato No {order.id_documento_origen} no existe" });
                }
            }
            if (order.Tipo_Movimiento == TipoMovimiento.DESEMBOLSO_POR_COMPRA)
            {
                var compra = new Tbl_Compra().Find<Tbl_Compra>(FilterData.Equal("Id_Compra", order.id_documento_origen));
                if (compra != null)
                {
                    compra.Estado = EstadoEnum.ACTIVO;
                    compra.Update();
                }
                else
                {
                    return (flowControl: false, value: new ResponseService() { status = 400, message = $"La orden  es de tipo compra {order.id_documento_origen} no existe" });
                }
            }
            if (order.Tipo_Movimiento == TipoMovimiento.REEMBOLSO_POR_COMPRA_ANULADA)
            {
                var compra = new Tbl_Compra().Find<Tbl_Compra>(FilterData.Equal("Id_Compra", order.id_documento_origen));
                if (compra != null)
                {
                    compra.Estado = EstadoEnum.ANULADO;
                    var response = ComprasServices.DoAnularCompra(compra);
                    if (response.status != 200)
                    {                        
                        return (flowControl: false, response);
                    }
                }
                else
                {
                    return (flowControl: false, value: new ResponseService() { status = 400, message = $"La orden  es de tipo compra {order.id_documento_origen} no existe" });
                }
            }
            if (order.Tipo_Movimiento == TipoMovimiento.INGRESO_POR_PAGO_DE_FACTURACION)
            {
                var venta = new Tbl_Factura().Find<Tbl_Factura>(FilterData.Equal("Id_Factura", order.id_documento_origen));
                if (venta != null)
                {
                    venta.Estado = EstadoEnum.ACTIVO;
                    venta.Update();
                }
                else
                {
                    return (flowControl: false, value: new ResponseService() { status = 400, message = $"La orden  es de tipo factura  {order.id_documento_origen} no existe" });
                }
            }
            if (order.Tipo_Movimiento == TipoMovimiento.DESEMBOLSO_POR_ANULACION_DE_PAGO_DE_FACTURACION)
            {
                var venta = new Tbl_Factura().Find<Tbl_Factura>(FilterData.Equal("Id_Factura", order.id_documento_origen));
                if (venta != null)
                {
                   return new FacturacionServices().DoAnulacionFactura(venta, dbUser);
                }
                else
                {
                    return (flowControl: false, value: new ResponseService() { status = 400, message = $"La orden  es de tipo factura  {order.id_documento_origen} no existe" });
                }
            }

            return (flowControl: true, value: null);
        }

        /// <summary>
        /// Rechaza la orden
        /// </summary>
        public static ResponseService Rechazar(string? sessionKey, Orden_Movimiento order)
        {
            try
            {
                if (order.motivo_rechazo == null || order.motivo_rechazo.Trim() == "" || order.motivo_rechazo.Length == 5)
                {
                    return new ResponseService()
                    {
                        status = 400,
                        message = $"Motivo es requerido"
                    };
                }
                var (User, dbUser) = Business.Security_Users.GetUserData(sessionKey);
                if (order.estado != EstadoOrden.PENDIENTE)
                {
                    return new ResponseService()
                    {
                        status = 400,
                        message = $"La orden no está pendiente. Estado actual: {order.estado}"
                    };
                }

                order.estado = EstadoOrden.RECHAZADA;
                order.id_usuario_aprueba = dbUser.Id_User;
                order.fecha_aprobacion = DateTime.Now;
                order.Update();

                return new ResponseService()
                {
                    status = 200,
                    message = "Orden rechazada exitosamente"
                };
            }
            catch (Exception ex)
            {
                return new ResponseService()
                {
                    status = 400,
                    message = "Error al rechazar orden: " + ex.Message
                };
            }
        }

        /// <summary>
        /// Obtiene las órdenes pendientes de una sucursal
        /// </summary>
        public static List<Orden_Movimiento> GetPendientes(int id_sucursal)
        {
            return new Orden_Movimiento().Where<Orden_Movimiento>(
                FilterData.Equal("estado", EstadoOrden.PENDIENTE),
                FilterData.Equal("id_sucursal", id_sucursal)
            );
        }

        public static List<Orden_Movimiento> GetOrder(string? sessionKey)
        {
            var (User, dbUser) = Business.Security_Users.GetUserData(sessionKey);
            var ordersPendientes = GetPendientes(dbUser?.Id_Sucursal.GetValueOrDefault() ?? -1);

            return ordersPendientes;
        }

        public static Orden_Movimiento? FindOrder(string? sessionKey, Orden_Movimiento inst)
        {
            var (User, dbUser) = Business.Security_Users.GetUserData(sessionKey);
           /* var ordersPendientes = new Orden_Movimiento().Find<Orden_Movimiento>(
                FilterData.Equal("id_sucursal", dbUser?.Id_Sucursal),
                FilterData.Equal("id_orden", inst.id_orden)
            ); ;*/
            inst.filterData.Add(FilterData.Equal("id_sucursal", dbUser?.Id_Sucursal));

            return inst.Find<Orden_Movimiento>();
        }

    }


}