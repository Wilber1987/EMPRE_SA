using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Transaction_Egresos : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? numero_egreso { get; set; }
       public Double? monto { get; set; }
       public DateTime? fecha { get; set; }
       public string? descripcion { get; set; }
       public string? nombre { get; set; }
       public string? banco { get; set; }
       public string? anulado { get; set; }
       public string? observaciones { get; set; }
       public Double? tc { get; set; }
       public Double? dolar { get; set; }
       public DateTime? fanulado { get; set; }
   }
}
