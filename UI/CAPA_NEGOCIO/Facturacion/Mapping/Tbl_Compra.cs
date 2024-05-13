using API.Controllers;
using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel
{
    public class Tbl_Compra : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? Id_Compra { get; set; }
        public int? Id_User { get; set; }
        public int? Id_Sucursal { get; set; }
        [JsonProp]
        public Object? Datos_Compra { get; set; }
        public int? Id_Proveedor { get; set; }
        public DateTime? Fecha { get; set; }
        public Double? Tasa_Cambio { get; set; }
        public string? Moneda { get; set; }
        public Double? Sub_Total { get; set; }
        public Double? Iva { get; set; }
        public Double? Total { get; set; }
        public string? Estado { get; set; }
        [ManyToOne(TableName = "Cat_Proveedor", KeyColumn = "Id_Proveedor", ForeignKeyColumn = "Id_Proveedor")]
        public Cat_Proveedor? Cat_Proveedor { get; set; }
        [OneToMany(TableName = "Detalle_Compra", KeyColumn = "Id_Compra", ForeignKeyColumn = "Id_Compra")]
        public List<Detalle_Compra>? Detalle_Compra { get; set; }
        public object? SaveCompra(string token)
        {
            try
            {
                var user = AuthNetCore.User(token);
                if (this.Detalle_Compra.Count() == 0)
                {
                    return new ResponseService()
                    {
                        status = 400,
                        message = "Ingrese al menos un artículo de compra"
                    };
                }
                double? subtotal = 0;
                double? ivaTotal = 0;
                double? total = 0;
                var User = AuthNetCore.User(token);
                var dbUser = new Security_Users { Id_User = User.UserId }.Find<Security_Users>();

                Cat_Proveedor? proveedor = new Cat_Proveedor { Identificacion = Cat_Proveedor?.Identificacion }.Find<Cat_Proveedor>();
                if (proveedor != null)
                {
                    Cat_Proveedor = proveedor;
                }
                foreach (var detalle in this.Detalle_Compra)
                {
                    if (detalle.Cantidad <= 0)
                    {
                        return new ResponseService()
                        {
                            status = 400,
                            message = "La cantidad de los productos (" + detalle?.Cat_Producto?.Descripcion + ") debe ser mayor que cero"
                        };
                    }
                    Cat_Producto.SetProductData(detalle.Cat_Producto);
                    detalle.SubTotal = detalle.Cantidad * detalle.Precio_Unitario;
                    detalle.Iva ??= 0;
                    detalle.Total += detalle.Iva;

                    subtotal += detalle.Total;
                    ivaTotal += detalle.Iva;
                    total += detalle.SubTotal;
                    SetLote(dbUser, detalle);
                };
                Fecha = DateTime.Now;
                Total = total;
                Estado = EstadoEnum.ACTIVO.ToString();
                Sub_Total = subtotal;
                Iva = ivaTotal;
                Total = total;
                Save();
                return new ResponseService()
                {
                    status = 200,
                    message = "Compra registrada correctamente"
                };
            }
            catch (Exception ex)
            {
                return new ResponseService()
                {
                    status = 200,
                    message = "Ocurrio un error intente nuevamente",
                    body = ex.Message
                };
            }

        }

        

        private void SetLote(Security_Users? dbUser, Detalle_Compra? detalle)
        {

            detalle.lotes = new List<Tbl_Lotes>{ new Tbl_Lotes()
                {
                    Cat_Producto = detalle?.Cat_Producto,
                    Precio_Venta = detalle?.Precio_Venta,
                    Precio_Compra = detalle?.Precio_Unitario,
                    Cantidad_Inicial = detalle?.Cantidad,
                    Cantidad_Existente = detalle?.Cantidad,
                    Id_Sucursal = dbUser?.Id_Sucursal,
                    Id_User =  dbUser?.Id_User,
                    Fecha_Ingreso = DateTime.Now,
                    Datos_Producto = detalle?.Datos_Producto_Lote,
                    Id_Almacen = new Cat_Almacenes().GetAlmacen(dbUser?.Id_Sucursal ?? 0),
                    Lote =Tbl_Lotes.GenerarLote()
                }
            };
        }
        
       

        public object? AnularCompra(string token)
        {
            try
            {
                var user = AuthNetCore.User(token);
                var compra = new Tbl_Compra() { Id_Compra = this.Id_Compra }.Find<Tbl_Compra>();

                if (compra == null)
                {
                    return new ResponseService()
                    {
                        status = 400,
                        message = "Compra no encontrado"
                    };
                }
                if (compra.Estado != EstadoEnum.ACTIVO.ToString())
                {
                    return new ResponseService()
                    {
                        status = 400,
                        message = "La Compra no se encuentra activa"
                    };
                }
                compra.Estado = EstadoEnum.ANULADO.ToString();
                compra.Update();
                BeginGlobalTransaction();
                decimal? sumaDetalle = (decimal?)compra.Detalle_Compra.Sum(c => c?.Cantidad);
                decimal? sumaCantidadLotes = 0;
                foreach (var detalleCompra in compra.Detalle_Compra)
                {
                    var lote = new Tbl_Lotes() { Id_Detalle_Compra = detalleCompra.Id_Detalle_Compra }.Find<Tbl_Lotes>();
                    sumaCantidadLotes += (decimal?)lote?.Cantidad_Existente;
                }
                if (sumaDetalle == sumaCantidadLotes)
                {
                    compra.Estado = EstadoEnum.ANULADO.ToString();
                    compra.Update();
                }
                CommitGlobalTransaction();

                return new ResponseService()
                {
                    status = 200,
                    message = "Compra anulada correctamente",
                    body = compra
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
    }
}
