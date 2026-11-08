
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AppCore.Services;
using APPCORE;
namespace DataBaseModel
{
    public class Cat_Producto : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? Id_Producto { get; set; }
        public string? Descripcion { get; set; }
        public string? Modelo { get; set; }
        public int? Id_Categoria { get; set; }
        public int? Id_Marca { get; set; }
        [ManyToOne(TableName = "Cat_Marca", KeyColumn = "Id_Marca", ForeignKeyColumn = "Id_Marca")]
        public Cat_Marca? Cat_Marca { get; set; }
        [ManyToOne(TableName = "Cat_Categorias", KeyColumn = "Id_Categoria", ForeignKeyColumn = "Id_Categoria")]
        public Cat_Categorias? Cat_Categorias { get; set; }
        //[OneToMany(TableName = "Detalle_Compra", KeyColumn = "Id_Producto", ForeignKeyColumn = "Id_Producto")]
        public List<Detalle_Compra>? Detalle_Compra { get; set; }
        //[OneToMany(TableName = "Detalle_Factura", KeyColumn = "Id_Producto", ForeignKeyColumn = "Id_Producto")]
        public List<Detalle_Factura>? Detalle_Factura { get; set; }

        public static void SetProductData(Cat_Producto productParam)
        {
            Cat_Marca? marca = new Cat_Marca().Find<Cat_Marca>(
                FilterData.Equal("Descripcion", StringUtil.NormalizeString(productParam.Cat_Marca?.Descripcion))
            );
            if (marca == null)
            {
                productParam.Cat_Marca?.Save();
            } else
            {
                productParam.Cat_Marca = marca;
            }
            Cat_Categorias? cat_Categorias = new Cat_Categorias().Find<Cat_Categorias>(
                FilterData.Equal("Descripcion", StringUtil.NormalizeString(productParam.Cat_Categorias?.Descripcion))
            );
            if (cat_Categorias == null)
            {
                productParam.Cat_Categorias?.Save();
            } else
            {
                productParam.Cat_Categorias = cat_Categorias;
            }
            Cat_Producto? producto = new Cat_Producto().Find<Cat_Producto>(
                FilterData.Equal("Descripcion", StringUtil.NormalizeString(productParam.Descripcion)),
                FilterData.Equal("Id_Marca", productParam.Cat_Marca?.Id_Marca),
                FilterData.Equal("Id_Categoria", productParam.Cat_Categorias?.Id_Categoria),
                FilterData.Equal("Modelo", productParam.Modelo)
            );
            if (producto == null)
            {
                productParam.Save();
            } else
            {
                productParam.Id_Producto = producto.Id_Producto;
            }

        }
    }
}
