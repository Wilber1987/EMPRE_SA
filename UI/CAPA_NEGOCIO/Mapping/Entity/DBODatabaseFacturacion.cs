using API.Controllers;
using CAPA_DATOS;
using CAPA_DATOS.Security;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModelFacturacion
{
    public class Tbl_Factura : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? Id_Factura { get; set; }
        public string? Tipo { get; set; }
        public string? Concepto { get; set; }
        public string? Serie { get; set; }
        public string? Forma_Pago { get; set; }
        public string? Direccion_Envio { get; set; }
        public int? Id_Cliente { get; set; }
        public int? Id_Sucursal { get; set; }
        public DateTime? Fecha { get; set; }
        public DateTime? Fecha_Vencimiento { get; set; }
        public string? Observaciones { get; set; }
        public int? Id_Usuario { get; set; }
        public string? Estado { get; set; }
        public Double? Sub_Total { get; set; }
        public Double? Iva { get; set; }
        public Double? Tasa_Cambio { get; set; }
        public Double? Total { get; set; }
        [OneToMany(TableName = "Detalle_Factura", KeyColumn = "Id_Factura", ForeignKeyColumn = "Id_Factura")]
        public List<Detalle_Factura>? Detalle_Factura { get; set; }
    }

    public class Detalle_Factura : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? Id_DetalleFactura { get; set; }
        public int? Id_Factura { get; set; }
        public int? Id_Producto { get; set; }
        public Double? Cantidad { get; set; }
        public Double? Precio_Venta { get; set; }
        public Double? Iva { get; set; }
        public Double? Total { get; set; }
        public int? Id_Lote { get; set; }
        public Double? Descuento { get; set; }
        public Double? Sub_Total { get; set; }
        [ManyToOne(TableName = "Tbl_Factura", KeyColumn = "Id_Factura", ForeignKeyColumn = "Id_Factura")]
        public Tbl_Factura? Tbl_Factura { get; set; }
        [ManyToOne(TableName = "Cat_Producto", KeyColumn = "Id_Producto", ForeignKeyColumn = "Id_Producto")]
        public Cat_Producto? Cat_Producto { get; set; }
    }


    public class Tbl_Compra : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? Id_Compra { get; set; }
        public string? Datos_Compra { get; set; }
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
                var dbUser = new API.Extended.Security_Users { Id_User = user.UserId }.Find<API.Extended.Security_Users>();

                if (this.Detalle_Compra.Count() == 0)
                {
                    return new ResponseService()
                    {
                        status = 400,
                        message = "Ingrese al menos un artículo de compra"
                    };
                }
                
                var detalleCompra = new List<Detalle_Compra>();

                double subtotal = 0;
                double ivaTotal = 0;
                double total = 0;
                foreach (var item in this.Detalle_Compra)
                {
                    if (item.Cantidad <= 0)
                    {
                        return new ResponseService()
                        {
                            status = 400,
                            message = "La cantidad de los productos (" + item.Cat_Producto.Descripcion + ") debe ser mayor que cero"
                        };
                    }

                    double subtotalItem = (double)(item.Cantidad * item.Precio_Unitario);
                    double ivaItem = (double)item.Iva;
                    double totalItem = subtotalItem;

                    subtotal += subtotalItem;
                    ivaTotal += ivaItem;
                    total += totalItem;

                    detalleCompra.Add(
                        new Detalle_Compra()
                        {

                            Id_Producto = item.Cat_Producto.Id_Producto,
                            Cantidad = item.Cantidad,
                            Precio_Unitario = item.Precio_Unitario,
                            Iva = item.Iva,
                            SubTotal = item.SubTotal,
                            Total = item.Total,
                            Presentacion = item.Presentacion,
                            lotes = new List<Tbl_Lotes>
                                    {
                                        new Tbl_Lotes()
                                        {
                                            Id_Producto = item.Cat_Producto.Id_Producto,
                                            Precio_Venta = 0, //TODO
                                            Precio_Compra = item.Precio_Unitario,
                                            Cantidad_Inicial = item.Cantidad,
                                            Cantidad_Existente = item.Cantidad,
                                            Fecha_Ingreso = DateTime.Now,
                                            Id_Almacen = getAlmacen(),
                                            Lote = generarLote()
                                        }
                                    }
                        }
                    );
                }
                Fecha = DateTime.Now;
                Total = total;
                Estado = EstadoEnum.ACTIVO.ToString();
                Sub_Total = subtotal;
                Iva = ivaTotal;
                Total = total;
                Detalle_Compra = detalleCompra;
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

        public int getAlmacen()
        {
            try
            {
                var primerAlmacen = new Cat_Almacenes().Get<Cat_Almacenes>().FirstOrDefault();

                if (primerAlmacen != null)
                {
                    return primerAlmacen.Id_Almacen ?? 0;
                }
                else
                {
                    var nuevoAlmacen = new Cat_Almacenes()
                    {
                        Descripcion = "Nuevo Almacén",
                        Estado = "Activo"
                    };
                    nuevoAlmacen.Save();
                    return nuevoAlmacen.Id_Almacen ?? 0;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error al obtener el almacén: " + ex.Message);
                return 0;
            }
        }


        public string generarLote()
        {
            string fechaLote = DateTime.Now.ToString("yyyyMMddHHmmss");
            string caracteresPermitidos = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            Random random = new Random();
            string parteAleatoria = new string(Enumerable.Repeat(caracteresPermitidos, 3)
                                            .Select(s => s[random.Next(s.Length)]).ToArray());

            string codigoLote = fechaLote + parteAleatoria;
            return codigoLote;
        }

        public object? AnularCompra(string token)
        {
            try
            {
                var user = AuthNetCore.User(token);
                var dbUser = new API.Extended.Security_Users { Id_User = user.UserId }.Find<API.Extended.Security_Users>();
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

                decimal sumaDetalle = (decimal)compra.Detalle_Compra.Sum(c => c.Cantidad.Value);
                decimal sumaCantidadLotes = 0;
                foreach (var detalleCompra in compra.Detalle_Compra)
                {
                    var lote = new Tbl_Lotes() { Id_Detalle_Compra = detalleCompra.Id_Detalle_Compra }.Find<Tbl_Lotes>();
                    sumaCantidadLotes += (decimal)lote.Cantidad_Existente;
                }

                

                if (sumaDetalle == sumaCantidadLotes)
                {
                    compra.Estado = EstadoEnum.ANULADO.ToString();
                    compra.Update();
                }
                foreach (var item in compra.Detalle_Compra)
                {
                    var lote = new Tbl_Lotes() { Id_Detalle_Compra = item.Id_Detalle_Compra }.Find<Tbl_Lotes>();
                    lote.Cantidad_Existente = 0;
                    lote.Update();
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


    public class Detalle_Compra : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? Id_Detalle_Compra { get; set; }
        public int? Id_Compra { get; set; }
        public int? Id_Producto { get; set; }
        public Double? Cantidad { get; set; }
        public Double? Precio_Unitario { get; set; }
        public Double? SubTotal { get; set; }
        public Double? Iva { get; set; }
        public Double? Total { get; set; }
        public string? Presentacion { get; set; }
        [ManyToOne(TableName = "Cat_Producto", KeyColumn = "Id_Producto", ForeignKeyColumn = "Id_Producto")]
        public Cat_Producto? Cat_Producto { get; set; }
        [ManyToOne(TableName = "Tbl_Compra", KeyColumn = "Id_Compra", ForeignKeyColumn = "Id_Compra")]
        public Tbl_Compra? Tbl_Compra { get; set; }
        [OneToMany(TableName = "Tbl_Lotes", KeyColumn = "Id_Detalle_Compra", ForeignKeyColumn = "Id_Detalle_Compra")]
        public List<Tbl_Lotes>? lotes { get; set; }
    }

    public class Tbl_Lotes : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? Id_Lote { get; set; }
        public int? Id_Producto { get; set; }
        public Double? Precio_Venta { get; set; }
        public Double? Precio_Compra { get; set; }
        public Double? Cantidad_Inicial { get; set; }
        public Double? Cantidad_Existente { get; set; }
        public DateTime? Fecha_Ingreso { get; set; }
        public int? Id_Almacen { get; set; }
        public string? Lote { get; set; }
        public int? Id_Detalle_Compra { get; set; }
        [ManyToOne(TableName = "Cat_Almacenes", KeyColumn = "Id_Almacen", ForeignKeyColumn = "Id_Almacen")]
        public Cat_Almacenes? Cat_Almacenes { get; set; }
        [ManyToOne(TableName = "Detalle_Compra", KeyColumn = "Id_Detalle_Compra", ForeignKeyColumn = "Id_Detalle_Compra")]
        public Detalle_Compra? Detalle_Compra { get; set; }
    }

    public class Cat_Proveedor : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? Id_Proveedor { get; set; }
        public string? Nombre { get; set; }
        public string? Estado { get; set; }
        public string? Datos_Proveedor { get; set; }
        [OneToMany(TableName = "Tbl_Compra", KeyColumn = "Id_Proveedor", ForeignKeyColumn = "Id_Proveedor")]
        public List<Tbl_Compra>? Tbl_Compra { get; set; }
    }

    public class Cat_Producto : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? Id_Producto { get; set; }
        public string? Descripcion { get; set; }
        public int? Id_Categoria { get; set; }
        public int? Id_Marca { get; set; }
        [ManyToOne(TableName = "Cat_Marca", KeyColumn = "Id_Marca", ForeignKeyColumn = "Id_Marca")]
        public Cat_Marca? Cat_Marca { get; set; }
        [ManyToOne(TableName = "Cat_Categorias", KeyColumn = "Id_Categoria", ForeignKeyColumn = "Id_Categoria")]
        public Cat_Categorias? Cat_Categorias { get; set; }
        [OneToMany(TableName = "Detalle_Compra", KeyColumn = "Id_Producto", ForeignKeyColumn = "Id_Producto")]
        public List<Detalle_Compra>? Detalle_Compra { get; set; }
        [OneToMany(TableName = "Detalle_Factura", KeyColumn = "Id_Producto", ForeignKeyColumn = "Id_Producto")]
        public List<Detalle_Factura>? Detalle_Factura { get; set; }
    }
    public class Cat_Almacenes : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? Id_Almacen { get; set; }
        public string? Descripcion { get; set; }
        public string? Estado { get; set; }
        [OneToMany(TableName = "Tbl_Lotes", KeyColumn = "Id_Almacen", ForeignKeyColumn = "Id_Almacen")]
        public List<Tbl_Lotes>? Tbl_Lotes { get; set; }
    }

    public class Cat_Categorias : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? Id_Categoria { get; set; }
        public string? Descripcion { get; set; }
        public string? Estado { get; set; }
        [OneToMany(TableName = "Cat_Producto", KeyColumn = "Id_Categoria", ForeignKeyColumn = "Id_Categoria")]
        public List<Cat_Producto>? Cat_Producto { get; set; }
    }

    public class Cat_Marca : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? Id_Marca { get; set; }
        public string? Nombre { get; set; }
        public string? Descripcion { get; set; }
        public string? Estado { get; set; }
        [OneToMany(TableName = "Cat_Producto", KeyColumn = "Id_Marca", ForeignKeyColumn = "Id_Marca")]
        public List<Cat_Producto>? Cat_Producto { get; set; }
    }


}