using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Catalogo_Estados_Articulos : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? id_estado_articulo { get; set; }
       public string? nombre { get; set; }
       public string? descripcion { get; set; }
       public Double? porcentaje_compra { get; set; }
       public Double? porcentaje_empeno { get; set; }
       [OneToMany(TableName = "Transactional_Valoracion", KeyColumn = "id_estado_articulo", ForeignKeyColumn = "id_estado")]
       public List<Transactional_Valoracion>? Transactional_Valoracion { get; set; }
   }
}
