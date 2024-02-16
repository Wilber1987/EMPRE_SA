using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Detail_Prendas_Vehiculos : EntityClass {
       [PrimaryKey(Identity = false)]
       public int? numero_prenda { get; set; }
       public string? capacidad_cilindros { get; set; }
       public string? cantidad_cilindros { get; set; }
       public string? cantidad_pasajeros { get; set; }
       public int? year_vehiculo { get; set; }
       public string? montor { get; set; }
       public string? chasis { get; set; }
       public string? placa { get; set; }
       public string? circuacion { get; set; }
       public string? defectuoso { get; set; }
       public DateTime? fecha_aut_descuento { get; set; }
       public string? defecto { get; set; }
       public Double? porcentage_descuento_maximo { get; set; }
       public DateTime? fecha_seguro { get; set; }
       public string? combustible { get; set; }
       public string? uso { get; set; }
       public string? servicio { get; set; }
       [OneToOne(TableName = "Detail_Prendas", KeyColumn = "numero_prenda", ForeignKeyColumn = "numero_prenda")]
       public Detail_Prendas? Detail_Prendas { get; set; }
   }
}
