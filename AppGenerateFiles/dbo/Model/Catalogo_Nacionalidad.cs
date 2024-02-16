using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Catalogo_Nacionalidad : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? id_nacionalidad { get; set; }
       public string? nombre { get; set; }
       public string? nacionalidad { get; set; }
       public int? ponderacion { get; set; }
       public int? puntaje { get; set; }
       public string? clasificacion { get; set; }
       [OneToMany(TableName = "Catalogo_Departamento", KeyColumn = "id_nacionalidad", ForeignKeyColumn = "id_nacionalidad")]
       public List<Catalogo_Departamento>? Catalogo_Departamento { get; set; }
       [OneToMany(TableName = "Catalogo_Inversores", KeyColumn = "id_nacionalidad", ForeignKeyColumn = "id_nacionalidad")]
       public List<Catalogo_Inversores>? Catalogo_Inversores { get; set; }
   }
}
