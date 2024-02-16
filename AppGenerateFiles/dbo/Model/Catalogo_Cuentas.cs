using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Catalogo_Cuentas : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? id_cuentas { get; set; }
       public string? nombre { get; set; }
       public string? tipo_cuenta { get; set; }
       public int? id_sucursal { get; set; }
       public int? id_categoria { get; set; }
       public Double? saldo { get; set; }
       public Double? saldo_dolares { get; set; }
       public bool? permite_dolares { get; set; }
       public bool? permite_cordobas { get; set; }
       [ManyToOne(TableName = "Catalogo_Sucursales", KeyColumn = "Id_Sucursal", ForeignKeyColumn = "id_sucursal")]
       public Catalogo_Sucursales? Catalogo_Sucursales_id_sucursal { get; set; }
       [ManyToOne(TableName = "Catalogo_Sucursales", KeyColumn = "Id_Sucursal", ForeignKeyColumn = "id_sucursal")]
       public Catalogo_Sucursales? Catalogo_Sucursales_id_sucursal { get; set; }
       [ManyToOne(TableName = "Categoria_Cuentas", KeyColumn = "id_categoria", ForeignKeyColumn = "id_categoria")]
       public Categoria_Cuentas? Categoria_Cuentas { get; set; }
       [OneToMany(TableName = "Detail_Movimiento", KeyColumn = "id_cuentas", ForeignKeyColumn = "id_cuenta")]
       public List<Detail_Movimiento>? Detail_Movimiento { get; set; }
       [OneToMany(TableName = "Transaction_Ingresos_Egresos", KeyColumn = "id_cuentas", ForeignKeyColumn = "id_cuenta")]
       public List<Transaction_Ingresos_Egresos>? Transaction_Ingresos_Egresos { get; set; }
   }
}
