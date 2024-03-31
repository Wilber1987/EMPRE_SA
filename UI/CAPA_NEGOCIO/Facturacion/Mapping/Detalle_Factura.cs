using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
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
}
