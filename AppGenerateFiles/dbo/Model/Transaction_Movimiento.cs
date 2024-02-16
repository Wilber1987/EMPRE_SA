using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Transaction_Movimiento : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? id_movimiento { get; set; }
       public string? descripcion { get; set; }
       public string? concepto { get; set; }
       public int? id_usuario_crea { get; set; }
       public DateTime? fecha { get; set; }
       public string? tipo { get; set; }
       public string? moneda { get; set; }
       public Double? tasa_cambio { get; set; }
       public Double? tasa_cambio_compra { get; set; }
       public bool? correo_enviado { get; set; }
       public bool? is_transaction { get; set; }
   }
}
