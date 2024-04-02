using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Cat_Almacenes : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? Id_Almacen { get; set; }
        public string? Descripcion { get; set; }
        public string? Estado { get; set; }
        public int? Id_Sucursal { get; set; }
        [OneToMany(TableName = "Tbl_Lotes", KeyColumn = "Id_Almacen", ForeignKeyColumn = "Id_Almacen")]
        public List<Tbl_Lotes>? Tbl_Lotes { get; set; }
    }
}
