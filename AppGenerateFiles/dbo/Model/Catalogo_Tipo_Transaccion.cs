using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Catalogo_Tipo_Transaccion : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? id_tipo_transaccion { get; set; }
       public string? descripcion { get; set; }
       [OneToMany(TableName = "Transaction_Ingresos_Egresos", KeyColumn = "id_tipo_transaccion", ForeignKeyColumn = "id_tipo_transaccion")]
       public List<Transaction_Ingresos_Egresos>? Transaction_Ingresos_Egresos { get; set; }
   }
}
