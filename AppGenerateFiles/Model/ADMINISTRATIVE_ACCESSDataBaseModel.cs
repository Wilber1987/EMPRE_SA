using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Transactional_Configuraciones : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? Id_Configuracion { get; set; }
       public string? Nombre { get; set; }
       public string? Descripcion { get; set; }
       public string? Valor { get; set; }
   }
}
