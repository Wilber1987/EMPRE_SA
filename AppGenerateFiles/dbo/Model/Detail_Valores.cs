using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Detail_Valores : EntityClass {
       [PrimaryKey(Identity = false)]
       public int? id_valoracion { get; set; }
       public Double? Valoracion_1 { get; set; }
       public Double? Valoracion_2 { get; set; }
       public Double? Valoracion_3 { get; set; }
       public Double? dolares_1 { get; set; }
       public Double? dolares_2 { get; set; }
       public Double? dolares_3 { get; set; }
       [OneToOne(TableName = "Transactional_Valoracion", KeyColumn = "id_valoracion", ForeignKeyColumn = "id_valoracion")]
       public Transactional_Valoracion? Transactional_Valoracion { get; set; }
   }
}
