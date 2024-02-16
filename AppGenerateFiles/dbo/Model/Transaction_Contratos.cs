using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Transaction_Contratos : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? numero_contrato { get; set; }
       public DateTime? fecha_contrato { get; set; }
       public DateTime? fecha_cancelar { get; set; }
       public Double? monto { get; set; }
       public Double? interes { get; set; }
       public Double? mora { get; set; }
       public string? estado { get; set; }
       public DateTime? fecha_vencimiento { get; set; }
       public int? codigo_cliente { get; set; }
       public Double? saldo { get; set; }
       public Double? abonos { get; set; }
       public string? tipo { get; set; }
       public string? observaciones { get; set; }
       public Double? iva { get; set; }
       public Double? descuento { get; set; }
       public Double? taza_cambio { get; set; }
       public Double? taza_cambio_compra { get; set; }
       public int? plazo { get; set; }
       public Double? cuotafija { get; set; }
       public Double? tasa_hoy { get; set; }
       public string? motivo_anulacion { get; set; }
       public Double? valoracion_compra_dolares { get; set; }
       public Double? valoracion_compra_cordobas { get; set; }
       public Double? valoracion_empeño_cordobas { get; set; }
       public Double? valoracion_empeño_dolares { get; set; }
       public Double? tasas_interes { get; set; }
       public Double? gestion_crediticia { get; set; }
       public Double? cuotafija_dolares { get; set; }
       public DateTime? fecha { get; set; }
       public Double? total_pagar_cordobas { get; set; }
       public Double? total_pagar_dolares { get; set; }
       public Double? interes_dolares { get; set; }
       public int? Id_User { get; set; }
       public int? reestructurado { get; set; }
       [ManyToOne(TableName = "Catalogo_Clientes", KeyColumn = "codigo_cliente", ForeignKeyColumn = "codigo_cliente")]
       public Catalogo_Clientes? Catalogo_Clientes { get; set; }
       [OneToMany(TableName = "Detail_Prendas", KeyColumn = "numero_contrato", ForeignKeyColumn = "numero_contrato")]
       public List<Detail_Prendas>? Detail_Prendas { get; set; }
       [OneToMany(TableName = "Tbl_Cuotas", KeyColumn = "numero_contrato", ForeignKeyColumn = "numero_contrato")]
       public List<Tbl_Cuotas>? Tbl_Cuotas { get; set; }
   }
}
