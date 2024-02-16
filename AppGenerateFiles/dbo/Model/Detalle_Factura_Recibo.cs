using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Detalle_Factura_Recibo : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? id { get; set; }
       public int? id_factura { get; set; }
       public int? id_cuota { get; set; }
       public Double? total_cuota { get; set; }
       public Double? monto_pagado { get; set; }
       public Double? capital_restante { get; set; }
       public string? concepto { get; set; }
       public Double? tasa_cambio { get; set; }
       [ManyToOne(TableName = "Tbl_Cuotas", KeyColumn = "id_cuota", ForeignKeyColumn = "id_cuota")]
       public Tbl_Cuotas? Tbl_Cuotas { get; set; }
       [ManyToOne(TableName = "Transaccion_Factura", KeyColumn = "id_factura", ForeignKeyColumn = "id_factura")]
       public Transaccion_Factura? Transaccion_Factura { get; set; }
   }
}
