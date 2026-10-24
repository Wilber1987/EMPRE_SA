using API.Controllers;
using APPCORE;
using BusinessLogic.Empresa.Entity;
using DataBaseModel;
using System;
using System.Linq;
using Transactions;

namespace Business
{
    public class ComprasServices
    {
        // ============================================================
        // GUARDAR COMPRA
        // ============================================================
        public static ResponseService? SaveCompra(Tbl_Compra compra, string identify)
        {
            try
            {
                if (compra.Detalle_Compra == null || compra.Detalle_Compra.Count == 0)
                {
                    return Error(400, "Ingrese al menos un artículo de compra");
                }

                var (user, dbUser) = Security_Users.GetUserData(identify);

                compra.Codigo_compra = GenerateCode();

                var proveedor = ResolverProveedor(compra);

                decimal? subtotal = 0;
                decimal? ivaTotal = 0;
                decimal? total = 0;

                foreach (var detalle in compra.Detalle_Compra)
                {
                    if (detalle.Cantidad <= 0)
                    {
                        return Error(400, "La cantidad de los productos (" + detalle?.Cat_Producto?.Descripcion + ") debe ser mayor que cero");
                    }

                    Cat_Producto.SetProductData(detalle.Cat_Producto);
                    detalle.SubTotal = Convert.ToDecimal(detalle.Cantidad) * detalle.Precio_Unitario;
                    detalle.Iva ??= 0;
                    detalle.Total = detalle.SubTotal + detalle.Iva;

                    subtotal += detalle.Total;
                    ivaTotal += detalle.Iva;
                    total += detalle.Total;
                    SetLote(dbUser, detalle);
                }

                compra.Id_User = dbUser?.Id_User;
                compra.Id_Sucursal = dbUser?.Id_Sucursal;
                compra.Datos_Compra = new Datos_Compra
                {
                    RUC = proveedor?.Identificacion, // TODO: es null si el proveedor era nuevo
                    Nombre_Comprador = dbUser?.Nombres
                };
                compra.Fecha = DateTime.Now;
                compra.Estado = EstadoEnum.PENDIENTE;
                compra.Sub_Total = subtotal;
                compra.Iva = ivaTotal;
                compra.Total = total;

                var responseCompra = compra.Save();
                compra.Id_Compra = ((Tbl_Compra?)responseCompra)?.Id_Compra;

                var cuentaOrigen = Catalogo_Cuentas.GetCuentaEgresoFacturasProveedor(dbUser);
                var cuentaDestino = Catalogo_Cuentas.GetCuentaIngresoFacturasProveedor(dbUser);

                if (cuentaDestino == null || cuentaOrigen == null)
                {
                    compra.RollBackGlobalTransaction(); // si es estático: EntityClass.RollBackGlobalTransaction()
                    return Error(400, "Cuentas no configuradas correctamente");
                }

                string detalleT = $"Compra directa de producto, factura: {compra.Id_Compra}, cliente: {compra.Cat_Proveedor?.Nombre}";


                var orden = new Orden_Movimiento()
                {
                    id_documento_origen = compra.Id_Compra,
                    tipo_documento_origen = "COMPRA",
                    descripcion = detalleT,
                    concepto = detalleT,
                    monto = compra?.Total,
                    id_sucursal = dbUser.Id_Sucursal,
                    moneda = compra?.Moneda,
                    Cliente = $"{compra?.Cat_Proveedor?.Identificacion} - ${compra?.Cat_Proveedor?.Nombre}",
                    tasa_cambio = compra?.Tasa_Cambio,
                    Id_cuenta_origen = cuentaOrigen?.id_cuentas,
                    Id_cuenta_destino = cuentaDestino?.id_cuentas,
                    Tipo_Movimiento = TipoMovimiento.DESEMBOLSO_POR_COMPRA,
                    direccion = DirectionEnum.EGRESO,
                    requiere_aprobacion = true  // Los EGRESO POR COMPRA siempre requieren aprobación si la orden origina ya fue ejecutada
                };

                var ordenResponse = orden.DoSaveOrder(dbUser);

                if (ordenResponse.status != 200)
                {
                    return ordenResponse;
                }
                return new ResponseService()
                {
                    status = 200,
                    body = compra,
                    message = "Compra registrada correctamente"
                };
            }
            catch (Exception ex)
            {
                // TODO: devolvía status 200 en error; se mantiene por compatibilidad, conviene 500
                return new ResponseService()
                {
                    status = 500,
                    message = "Ocurrio un error intente nuevamente",
                    body = ex.Message
                };
            }
        }

        // ============================================================
        // ANULAR COMPRA
        // ============================================================
        public static ResponseService? AnularCompra(Tbl_Compra request, string identify)
        {
            try
            {
                var (user, dbUser) = Security_Users.GetUserData(identify);
                var compra = new Tbl_Compra() { Id_Compra = request.Id_Compra }.Find<Tbl_Compra>();

                if (compra == null)
                {
                    return Error(400, "Compra no encontrado");
                }
                if (compra.Estado != EstadoEnum.ACTIVO && compra.Estado != EstadoEnum.PENDIENTE)
                {
                    return Error(400, "La Compra no se encuentra activa ni pendiente");
                }


                compra.BeginGlobalTransaction(); // si es estático: EntityClass.BeginGlobalTransaction()



                var cuentaOrigen = Catalogo_Cuentas.GetCuentaIngresoFacturasProveedor(dbUser);
                var cuentaDestino = Catalogo_Cuentas.GetCuentaEgresoFacturasProveedor(dbUser);
                if (cuentaDestino == null || cuentaOrigen == null)
                {
                    compra.RollBackGlobalTransaction();
                    return Error(400, "Cuentas no configuradas correctamente");
                }

                // Antes usaba this.Id_Compra / this.Total / this.Moneda (datos del request);
                // ahora se usa la compra cargada de BD.
                string detalleT = $"Anulacion de compra directa de producto, factura: {compra.Id_Compra} al cliente {compra.Cat_Proveedor?.Nombre}";

                var existingOrder = new Orden_Movimiento().Find<Orden_Movimiento>(
                    FilterData.Equal("id_documento_origen", compra.Id_Compra),
                    FilterData.Equal("tipo_documento_origen", "COMPRA"),
                    FilterData.Equal("direccion", DirectionEnum.EGRESO),
                    FilterData.Equal("estado", EstadoOrden.EJECUTADA)
                );
                if (existingOrder != null)
                {
                    var existingOrderAnulacion = new Orden_Movimiento().Find<Orden_Movimiento>(
                        FilterData.Equal("id_documento_origen", compra.Id_Compra),
                        FilterData.Equal("tipo_documento_origen", "COMPRA"),
                        FilterData.Equal("Tipo_Movimiento", TipoMovimiento.REEMBOLSO_POR_COMPRA_ANULADA),
                        FilterData.Equal("direccion", DirectionEnum.INGRESO),
                        FilterData.Equal("estado", EstadoOrden.PENDIENTE)
                    );
                    if (existingOrderAnulacion != null)
                    {
                        compra?.RollBackGlobalTransaction();
                        return new ResponseService()
                        {
                            status = 400,
                            message = "Ya existe una orden de anulación pendiente",
                            body = compra
                        };
                    }
                    var orden = new Orden_Movimiento()
                    {
                        id_documento_origen = compra.Id_Compra,
                        tipo_documento_origen = "COMPRA",
                        descripcion = detalleT,
                        concepto = detalleT,
                        monto = compra?.Total,
                        moneda = compra?.Moneda,
                        id_sucursal = dbUser.Id_Sucursal,
                        Cliente = $"{compra?.Cat_Proveedor?.Identificacion} - ${compra?.Cat_Proveedor?.Nombre}",
                        tasa_cambio = compra?.Tasa_Cambio,
                        Id_cuenta_origen = cuentaOrigen?.id_cuentas,
                        Id_cuenta_destino = cuentaDestino?.id_cuentas,
                        Tipo_Movimiento = TipoMovimiento.REEMBOLSO_POR_COMPRA_ANULADA,
                        direccion = DirectionEnum.INGRESO,
                        requiere_aprobacion = existingOrder != null  // Los EGRESO POR FACTURA siempre requieren aprobación si la orden origina ya fue ejecutada
                    };

                    var ordenResponse = orden.DoSaveOrder(dbUser);

                    if (ordenResponse.status != 200)
                    {
                        compra?.RollBackGlobalTransaction();
                        return ordenResponse;
                    }
                }
                else
                {
                    var existingOrderPendiente = new Orden_Movimiento().Find<Orden_Movimiento>(
                        FilterData.Equal("id_documento_origen", compra.Id_Compra),
                        FilterData.Equal("tipo_documento_origen", "COMPRA"),
                        FilterData.Equal("direccion", DirectionEnum.EGRESO),
                        FilterData.Equal("estado", EstadoOrden.PENDIENTE)
                    );
                    existingOrderPendiente?.Delete();
                    var ordenResponse = DoAnularCompra(compra);
                    if (ordenResponse.status != 200)
                    {
                        compra?.RollBackGlobalTransaction();
                        return ordenResponse;
                    }
                }

                compra?.CommitGlobalTransaction();

                return new ResponseService()
                {
                    status = 200,
                    message = "Compra anulada correctamente",
                    body = compra
                };
            }
            catch (Exception ex)
            {
                request.RollBackGlobalTransaction();
                return new ResponseService()
                {
                    message = "Error:" + ex.ToString(),
                    status = 500
                };
            }
        }

        public static ResponseService DoAnularCompra(Tbl_Compra? compra)
        {
            decimal? sumaDetalle = (decimal?)compra.Detalle_Compra?.Sum(c => c?.Cantidad);
            decimal? sumaCantidadLotes = 0;
            foreach (var detalleCompra in compra.Detalle_Compra ?? new())
            {
                var lote = new Tbl_Lotes() { Id_Detalle_Compra = detalleCompra.Id_Detalle_Compra }.Find<Tbl_Lotes>();                
                sumaCantidadLotes += (decimal?)lote?.Cantidad_Existente;
                lote?.Delete();
            }
            if (sumaDetalle == sumaCantidadLotes)
            {
                compra.Estado = EstadoEnum.ANULADO;
                compra.Update();
            } else
            {
                return new ResponseService(400, "Detalles de la compra no coinciden");
            }
            return new ResponseService(200, "Compra anulada");
            
        }

        // ============================================================
        // PRIVADOS
        // ============================================================
        private static Cat_Proveedor? ResolverProveedor(Tbl_Compra compra)
        {
            Cat_Proveedor? proveedor = new Cat_Proveedor { Identificacion = compra.Cat_Proveedor?.Identificacion }.Find<Cat_Proveedor>();

            if (proveedor != null)
            {
                compra.Cat_Proveedor = proveedor;
                return proveedor;
            }

            var datos = compra.Cat_Proveedor?.Datos_Proveedor;
            if (datos != null && datos.codigo_cliente == -1)
            {
                var nuevoCliente = new Catalogo_Clientes
                {
                    primer_nombre = datos.primer_nombre,
                    segundo_nombre = datos.segundo_nombre,
                    primer_apellido = datos.primer_apellido,
                    segundo_apellidio = datos.segundo_apellidio,
                    direccion = datos.direccion,
                    identificacion = compra.Cat_Proveedor?.Identificacion,
                    id_departamento = datos.Catalogo_Municipio?.id_departamento,
                    id_municipio = datos.Catalogo_Municipio?.id_municipio,
                    id_tipo_identificacion = datos.Catalogo_Tipo_Identificacion?.id_tipo_identificacion,
                }.Save() as Catalogo_Clientes;

                datos.codigo_cliente = nuevoCliente?.codigo_cliente;
            }
            return null;
        }

        private static void SetLote(Security_Users? dbUser, Detalle_Compra? detalle)
        {
            string codigo = Tbl_Lotes.GenerarLote();
            int porcentajesUtilidad = Transactional_Configuraciones.GetBeneficioVentaArticulo();
            int porcentajesApartado = Transactional_Configuraciones.GetPorcentajesApartado();
            int nCuotas = Transactional_Configuraciones.GetNumeroCuotasQuincenales(detalle?.Precio_Venta);

            Tbl_Lotes lote = new Tbl_Lotes()
            {
                Precio_Venta = detalle?.Precio_Venta,
                Precio_Compra = detalle?.Precio_Unitario,
                Cantidad_Inicial = detalle?.Cantidad,
                Cantidad_Existente = detalle?.Cantidad,
                Id_Sucursal = dbUser?.Id_Sucursal,
                Id_User = dbUser?.Id_User,
                Fecha_Ingreso = DateTime.Now,
                Detalles = $"{Tbl_Lotes.GetLoteDesc(detalle?.Datos_Producto_Lote)}",
                Datos_Producto = detalle?.Datos_Producto_Lote,
                Id_Almacen = new Cat_Almacenes().GetAlmacen(dbUser?.Id_Sucursal ?? 0),
                Lote = codigo,
                Estado = EstadoEnum.ACTIVO,
                EtiquetaLote = new EtiquetaLote
                {
                    Tipo = "CV",
                    Articulo = $"{Tbl_Lotes.GetLoteDesc(detalle?.Datos_Producto_Lote)}",
                    Codigo = codigo,
                    PorcentajesUtilidad = porcentajesUtilidad,
                    PorcentajesApartado = porcentajesApartado,
                    PorcentajeAdicional = 0,
                    Precio_compra_dolares = detalle?.Precio_Unitario,
                    N_Cuotas = nCuotas
                }
            };
            // TODO: el lote no recibe Id_Detalle_Compra, pero AnularCompra lo busca por ese campo
            lote.Save();
            detalle!.lotes = [lote];
        }

        private static string? GenerateCode() => ""; // TODO: pendiente de implementar

        private static ResponseService Error(int status, string message) =>
            new ResponseService() { status = status, message = message };
    }
}