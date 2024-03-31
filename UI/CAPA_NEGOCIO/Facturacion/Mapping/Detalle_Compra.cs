using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   

    public class Detalle_Compra : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? Id_Detalle_Compra { get; set; }
        public int? Id_Compra { get; set; }
        public int? Id_Producto { get; set; }
        public Double? Cantidad { get; set; }
        public Double? Precio_Unitario { get; set; }
        public Double? Precio_Venta { get; set; }
        public Double? SubTotal { get; set; }
        public Double? Iva { get; set; }
        public Double? Total { get; set; }
        public string? Presentacion { get; set; }
        //Datos del producto que se agregara al lote
        public object? Datos_Producto_Lote { get; set; }
        
        [ManyToOne(TableName = "Cat_Producto", KeyColumn = "Id_Producto", ForeignKeyColumn = "Id_Producto")]
        public Cat_Producto? Cat_Producto { get; set; }
        [ManyToOne(TableName = "Tbl_Compra", KeyColumn = "Id_Compra", ForeignKeyColumn = "Id_Compra")]
        public Tbl_Compra? Tbl_Compra { get; set; }
        [OneToMany(TableName = "Tbl_Lotes", KeyColumn = "Id_Detalle_Compra", ForeignKeyColumn = "Id_Detalle_Compra")]
        public List<Tbl_Lotes>? lotes { get; set; }
    }
}
