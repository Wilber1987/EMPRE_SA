using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Transaction_Contratos_Inversionistas : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? numero_cont { get; set; }
       public DateTime? fecha { get; set; }
       public Double? taza { get; set; }
       public Double? monto_inicial { get; set; }
       public string? nombre_sustituto { get; set; }
       public string? identificacion_sustituto { get; set; }
       public string? direccion_sustituto { get; set; }
       public string? departamento_sus { get; set; }
       public string? municipio_sustituto { get; set; }
       public int? id_inversor { get; set; }
       public DateTime? fecha_pago { get; set; }
       public DateTime? fecha_ultimo_pago { get; set; }
       public Double? saldo { get; set; }
       public Double? montointeres { get; set; }
       public Double? interes { get; set; }
       public DateTime? fecha_restructura { get; set; }
       public int? Id_User { get; set; }
       [ManyToOne(TableName = "Security_Users", KeyColumn = "Id_User", ForeignKeyColumn = "Id_User")]
       public Security_Users? Security_Users { get; set; }
       [ManyToOne(TableName = "Catalogo_Inversores", KeyColumn = "id_inversor", ForeignKeyColumn = "id_inversor")]
       public Catalogo_Inversores? Catalogo_Inversores { get; set; }
   }
}
