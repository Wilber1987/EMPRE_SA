using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Catalogo_Cambio_Dolar : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? id_cambio { get; set; }
       public DateTime? fecha { get; set; }
       public Double? valor_de_compra { get; set; }
       public Double? valor_de_venta { get; set; }
   }
}
