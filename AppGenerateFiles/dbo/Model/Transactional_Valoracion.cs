using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Transactional_Valoracion : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? id_valoracion { get; set; }
       public string? Descripcion { get; set; }
       public string? Marca { get; set; }
       public string? Modelo { get; set; }
       public Double? Tasa_interes { get; set; }
       public int? Plazo { get; set; }
       public DateTime? Fecha { get; set; }
       public Double? Tasa_de_cambio { get; set; }
       public int? id_estado { get; set; }
       public Double? Valoracion_compra_cordobas { get; set; }
       public Double? Valoracion_compra_dolares { get; set; }
       public Double? Valoracion_empeño_cordobas { get; set; }
       public Double? Valoracion_empeño_dolares { get; set; }
       public string? Serie { get; set; }
       public int? id_categoria { get; set; }
       public Double? Precio_venta_empeño_dolares { get; set; }
       public Double? Precio_venta_empeño_cordobas { get; set; }
       [ManyToOne(TableName = "Catalogo_Categoria", KeyColumn = "id_categoria", ForeignKeyColumn = "id_categoria")]
       public Catalogo_Categoria? Catalogo_Categoria { get; set; }
       [ManyToOne(TableName = "Catalogo_Estados_Articulos", KeyColumn = "id_estado_articulo", ForeignKeyColumn = "id_estado")]
       public Catalogo_Estados_Articulos? Catalogo_Estados_Articulos { get; set; }
       [OneToMany(TableName = "Detail_Prendas", KeyColumn = "id_valoracion", ForeignKeyColumn = "id_valoracion")]
       public List<Detail_Prendas>? Detail_Prendas { get; set; }
       [OneToOne(TableName = "Detail_Valores", KeyColumn = "id_valoracion", ForeignKeyColumn = "id_valoracion")]
       public Detail_Valores? Detail_Valores { get; set; }
   }
}
