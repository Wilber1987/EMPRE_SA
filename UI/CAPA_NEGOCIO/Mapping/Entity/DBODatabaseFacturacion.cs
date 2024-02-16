using CAPA_DATOS;
using CAPA_DATOS.Security;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseFacturacion
{
     
    public class TransaccionFactura: EntityClass {
        [PrimaryKey(Identity = false)]
        public int IdFactura { get; set; }
        public string Tipo { get; set; }
        public string Concepto { get; set; }
        public string Serie { get; set; }
        public string FormaPago { get; set; }
        public string DireccionEnvio { get; set; }
        public int? IdCliente { get; set; }
        public int? IdSucursal { get; set; }
        public DateTime? Fecha { get; set; }
        public DateTime? FechaVencimiento { get; set; }
        public string Observaciones { get; set; }
        public int? IdUsuario { get; set; }
        public string Estado { get; set; }
        public string SubTotal { get; set; }
        public string? Iva { get; set; }
        public string? TasaCambio { get; set; }
        public string? Total { get; set; }
    }
    public class FacturaDetalle: EntityClass {
        [PrimaryKey(Identity = false)]
        public int IdDetalleFactura { get; set; }
        public int IdFactura { get; set; }
        public int IdProducto { get; set; }
        public string Cantidad { get; set; }
        public string PrecioVenta { get; set; }
        public string? Iva { get; set; }
        public string? Total { get; set; }
    }

    public class CatalogoProducto: EntityClass {
        public int IdProducto { get; set; }
        public string Descripcion { get; set; }
        public int? IdCategoria { get; set; }
        public int? IdMarca { get; set; }
    }

     
    public class CatalogoMarca: EntityClass {
        public int IdMarca { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public string Estado { get; set; }
    }

     
    public class CatalogoCategorias: EntityClass {
        public int IdCategoria { get; set; }
        public string Descripcion { get; set; }
        public string Estado { get; set; }
    }

     
    public class Lotes: EntityClass {
        public int IdTransaccion { get; set; }
        public string Descripcion { get; set; }
        public DateTime? Fecha { get; set; }
        public int? IdUsuario { get; set; }
        public int? IdTipo_transaccion { get; set; }
        public string Estado { get; set; }
    }

    public class DetalleLotes: EntityClass {
        public int IdDetalle { get; set; }
        public int? IdLote { get; set; }
        public int? CantidadAfectada { get; set; }
        public int? IdTransaccion { get; set; }
        public int? IdDetalleFactura { get; set; }
    }
 
 
}