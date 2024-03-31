using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel
{
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
        [JsonProp]
        public object? Datos_Producto { get; set; }

        [ManyToOne(TableName = "Cat_Almacenes", KeyColumn = "Id_Almacen", ForeignKeyColumn = "Id_Almacen")]
        public Cat_Almacenes? Cat_Almacenes { get; set; }
        [ManyToOne(TableName = "Detalle_Compra", KeyColumn = "Id_Detalle_Compra", ForeignKeyColumn = "Id_Detalle_Compra")]
        public Detalle_Compra? Detalle_Compra { get; set; }
        [ManyToOne(TableName = "Cat_Producto", KeyColumn = "Id_Producto", ForeignKeyColumn = "Id_Producto")]
        public Cat_Producto? Cat_Producto { get; set; }
    }
}
