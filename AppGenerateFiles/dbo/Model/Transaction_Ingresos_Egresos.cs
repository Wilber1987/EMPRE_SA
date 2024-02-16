using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Transaction_Ingresos_Egresos : EntityClass {
       [PrimaryKey(Identity = false)]
       public int? id_transaccion { get; set; }
       public int? id_tipo_transaccion { get; set; }
       public Double? monto_dolares { get; set; }
       public Double? tasa_cambio { get; set; }
       public Double? monto_total { get; set; }
       public string? descripcion { get; set; }
       public string? nombre { get; set; }
       public int? id_cuenta { get; set; }
       public int? que { get; set; }
       public DateTime? fecha_anulado { get; set; }
       public string? banco { get; set; }
       public string? estado { get; set; }
       public int? numero_original { get; set; }
       public DateTime? fecha { get; set; }
       [ManyToOne(TableName = "Catalogo_Cuentas", KeyColumn = "id_cuentas", ForeignKeyColumn = "id_cuenta")]
       public Catalogo_Cuentas? Catalogo_Cuentas { get; set; }
       [ManyToOne(TableName = "Catalogo_Tipo_Transaccion", KeyColumn = "id_tipo_transaccion", ForeignKeyColumn = "id_tipo_transaccion")]
       public Catalogo_Tipo_Transaccion? Catalogo_Tipo_Transaccion { get; set; }
   }
}
