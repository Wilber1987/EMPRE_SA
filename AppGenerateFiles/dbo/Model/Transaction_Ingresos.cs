using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Transaction_Ingresos : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? numero_ingreso { get; set; }
       public Double? monto { get; set; }
       public DateTime? fecha { get; set; }
       public string? descripcion { get; set; }
       public string? nombre { get; set; }
       public int? que { get; set; }
       public string? anulado { get; set; }
       public string? observaciones { get; set; }
       public Double? tzcambio { get; set; }
       public Double? total { get; set; }
       public DateTime? fanulado { get; set; }
   }
}
