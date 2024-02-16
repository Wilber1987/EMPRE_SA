using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Catalogo_Tipo_Agente : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? Id_Tipo_Agente { get; set; }
       public string? Descripcion { get; set; }
       public string? Estado { get; set; }
       [OneToMany(TableName = "Catalogo_Agentes", KeyColumn = "Id_Tipo_Agente", ForeignKeyColumn = "Id_Tipo_Agente")]
       public List<Catalogo_Agentes>? Catalogo_Agentes { get; set; }
   }
}
