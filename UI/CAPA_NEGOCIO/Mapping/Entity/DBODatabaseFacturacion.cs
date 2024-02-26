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
    }

    public class Detalle_Compra : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? Id_Detalle_Compra { get; set; }
        public int? Id_Compra { get; set; }
        public int? Id_Producto { get; set; }
        public int? Cantidad { get; set; }
        public Double? Precio_Unitario { get; set; }
        public Double? Total { get; set; }
        public string? Presentacion { get; set; }
        [ManyToOne(TableName = "Cat_Producto", KeyColumn = "Id_Producto", ForeignKeyColumn = "Id_Producto")]
        public Cat_Producto? Cat_Producto { get; set; }
        [ManyToOne(TableName = "Tbl_Compra", KeyColumn = "Id_Compra", ForeignKeyColumn = "Id_Compra")]
        public Tbl_Compra? Tbl_Compra { get; set; }
        [OneToMany(TableName = "Tbl_Lotes", KeyColumn = "Id_Detalle_Compra", ForeignKeyColumn = "Id_Detalle_Compra")]
        public List<Tbl_Lotes>? Tbl_Lotes { get; set; }
    }

    public class Tbl_Lotes : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? Id_Lote { get; set; }
        public int? Id_Producto { get; set; }
        public Double? Precio_Venta { get; set; }
        public Double? Precio_Compra { get; set; }
        public int? Cantidad_Inicial { get; set; }
        public int? Cantidad_Existente { get; set; }
        public DateTime? Fecha_Ingreso { get; set; }
        public int? Id_Almacen { get; set; }
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