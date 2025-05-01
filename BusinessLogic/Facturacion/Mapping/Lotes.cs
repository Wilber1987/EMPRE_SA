
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using APPCORE;
namespace DataBaseModel {
   public class Lotes : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? Id_Transaccion { get; set; }
       public string? Descripcion { get; set; }
       public DateTime? Fecha { get; set; }
       public int? Id_Usuario { get; set; }
       public int? Id_Tipo_transaccion { get; set; }
       public string? Estado { get; set; }
   }
}
