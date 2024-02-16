using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Catalogo_Categoria : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? id_categoria { get; set; }
       public string? tipo { get; set; }
       public string? descripcion { get; set; }
       public int? plazo_limite { get; set; }
       public int? prioridad { get; set; }
       public bool? isEditable { get; set; }
       [OneToMany(TableName = "Detail_Prendas", KeyColumn = "id_categoria", ForeignKeyColumn = "id_categoria")]
       public List<Detail_Prendas>? Detail_Prendas { get; set; }
       [OneToMany(TableName = "Transactional_Valoracion", KeyColumn = "id_categoria", ForeignKeyColumn = "id_categoria")]
       public List<Transactional_Valoracion>? Transactional_Valoracion { get; set; }
   }
}
