using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Detail_Prendas : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? numero_prenda { get; set; }
       public int? numero_contrato_OLD { get; set; }
       public string? Descripcion { get; set; }
       public Double? pprenda { get; set; }
       public string? Tipo { get; set; }
       public string? marca { get; set; }
       public string? serie { get; set; }
       public string? modelo { get; set; }
       public string? iva { get; set; }
       public string? margen { get; set; }
       public string? estado { get; set; }
       public Double? interesl { get; set; }
       public Double? moral { get; set; }
       public DateTime? fliquidacion { get; set; }
       public Double? precio_venta { get; set; }
       public string? en_manos_de { get; set; }
       public string? color { get; set; }
       public string? factura { get; set; }
       public string? tipo_movimiento { get; set; }
       public Double? v_porcentage_etiqueta { get; set; }
       public int? numero_contrato { get; set; }
       public int? id_categoria { get; set; }
       public int? id_valoracion { get; set; }
       [ManyToOne(TableName = "Transactional_Valoracion", KeyColumn = "id_valoracion", ForeignKeyColumn = "id_valoracion")]
       public Transactional_Valoracion? Transactional_Valoracion { get; set; }
       [ManyToOne(TableName = "Catalogo_Categoria", KeyColumn = "id_categoria", ForeignKeyColumn = "id_categoria")]
       public Catalogo_Categoria? Catalogo_Categoria { get; set; }
       [ManyToOne(TableName = "Transaction_Contratos", KeyColumn = "numero_contrato", ForeignKeyColumn = "numero_contrato")]
       public Transaction_Contratos? Transaction_Contratos { get; set; }
       [OneToOne(TableName = "Detail_Prendas_Vehiculos", KeyColumn = "numero_prenda", ForeignKeyColumn = "numero_prenda")]
       public Detail_Prendas_Vehiculos? Detail_Prendas_Vehiculos { get; set; }
   }
}
