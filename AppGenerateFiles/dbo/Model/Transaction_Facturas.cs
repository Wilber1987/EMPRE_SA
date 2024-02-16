using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Transaction_Facturas : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? numero_factura { get; set; }
       public Double? abono_de_cuota { get; set; }
       public Double? mora { get; set; }
       public Double? interes { get; set; }
       public Double? total { get; set; }
       public int? numero_contrato { get; set; }
       public DateTime? fecha { get; set; }
       public DateTime? fecha_pago { get; set; }
       public Double? inte { get; set; }
       public Double? mor { get; set; }
       public int? dm { get; set; }
       public string? es { get; set; }
       public Double? tot { get; set; }
       public string? an { get; set; }
       public Double? pago_contado { get; set; }
       public Double? saldo_monto { get; set; }
       public Double? ABONO { get; set; }
       public Double? descuento { get; set; }
       public DateTime? fecha_mora { get; set; }
       public DateTime? fecha_interes { get; set; }
       public Double? taza_cambio { get; set; }
       public Double? interes_actual { get; set; }
       public int? Id_User_OLD { get; set; }
       public DateTime? fecha_grabado { get; set; }
       public DateTime? mes_pagado { get; set; }
       public DateTime? ultima_visita { get; set; }
       public Double? dmpagadas { get; set; }
       public string? tipo { get; set; }
       public Double? morac { get; set; }
       public Double? interesc { get; set; }
       public Double? abonoc { get; set; }
       public Double? totalc { get; set; }
       public Double? parciales { get; set; }
       public Double? moraparcial { get; set; }
       public Double? interesparcial { get; set; }
       public string? motivo_anulacion { get; set; }
       public Double? reestructuraciond { get; set; }
       public Double? reestructuracionc { get; set; }
       public int? numero_reestructuracion { get; set; }
       public DateTime? fecha_cancelacion { get; set; }
       public Double? docnoentregadod { get; set; }
       public Double? docnoentregadoc { get; set; }
       public int? Id_User { get; set; }
       [ManyToOne(TableName = "Security_Users", KeyColumn = "Id_User", ForeignKeyColumn = "Id_User")]
       public Security_Users? Security_Users { get; set; }
   }
}
