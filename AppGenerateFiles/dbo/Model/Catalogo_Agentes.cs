using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Catalogo_Agentes : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? id_agente { get; set; }
       public string? identificacion { get; set; }
       public string? nombre { get; set; }
       public string? telefono { get; set; }
       public string? direccion { get; set; }
       public DateTime? fecha { get; set; }
       public int? Id_Tipo_Agente { get; set; }
       public string? Estado { get; set; }
       [ManyToOne(TableName = "Catalogo_Tipo_Agente", KeyColumn = "Id_Tipo_Agente", ForeignKeyColumn = "Id_Tipo_Agente")]
       public Catalogo_Tipo_Agente? Catalogo_Tipo_Agente { get; set; }
       [OneToMany(TableName = "Security_Users", KeyColumn = "id_agente", ForeignKeyColumn = "id_agente")]
       public List<Security_Users>? Security_Users { get; set; }
   }
}
