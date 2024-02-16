using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Catalogo_Clasificacion_Interes : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? id_clasificacion_interes { get; set; }
       public string? Descripcion { get; set; }
       public string? Estado { get; set; }
       public Double? porcentaje { get; set; }
       [OneToMany(TableName = "Catalogo_Clientes", KeyColumn = "id_clasificacion_interes", ForeignKeyColumn = "id_clasificacion_interes")]
       public List<Catalogo_Clientes>? Catalogo_Clientes { get; set; }
   }
}
