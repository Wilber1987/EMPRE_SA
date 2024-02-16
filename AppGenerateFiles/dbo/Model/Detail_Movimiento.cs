using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Detail_Movimiento : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? id_detalle { get; set; }
       public int? id_movimiento { get; set; }
       public int? id_cuenta { get; set; }
       public Double? debito { get; set; }
       public Double? credito { get; set; }
       public Double? tasa_cambio { get; set; }
       public DateTime? fecha { get; set; }
       public Double? debito_dolares { get; set; }
       public Double? credito_dolares { get; set; }
       public Double? monto_inicial { get; set; }
       public Double? monto_final { get; set; }
       public Double? monto_inicial_dolares { get; set; }
       public Double? monto_final_dolares { get; set; }
       public string? moneda { get; set; }
       public Double? tasa_cambio_compra { get; set; }
       [ManyToOne(TableName = "Catalogo_Cuentas", KeyColumn = "id_cuentas", ForeignKeyColumn = "id_cuenta")]
       public Catalogo_Cuentas? Catalogo_Cuentas { get; set; }
   }
}
