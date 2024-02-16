using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Transaction_Contratos_old : EntityClass {
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
       public int? dias_mora { get; set; }
       public Double? saldo_mora { get; set; }
       public DateTime? fecha_baja { get; set; }
       public Double? abonos { get; set; }
       public DateTime? ultima_visita { get; set; }
       public int? tipo { get; set; }
       public string? entregado { get; set; }
       public Double? interes_actual { get; set; }
       public string? observaciones { get; set; }
       public Double? iva { get; set; }
       public Double? margen { get; set; }
       public Double? interesl { get; set; }
       public Double? moral { get; set; }
       public Double? descuento { get; set; }
       public Double? util { get; set; }
       public Double? taza_interes_cargos { get; set; }
       public Double? taza_mora { get; set; }
       public DateTime? fecha_mora { get; set; }
       public DateTime? fecha_interes { get; set; }
       public Double? taza_gestion_crediticia { get; set; }
       public int? Id_User_OLD { get; set; }
       public Double? taza_cambio { get; set; }
       public int? id_agente { get; set; }
       public Double? dkm { get; set; }
       public Double? gasolinamonto { get; set; }
       public Double? valorcad { get; set; }
       public int? plazo { get; set; }
       public Double? cuotafija { get; set; }
       public Double? montocuotaatrazadas { get; set; }
       public DateTime? mes_pagado { get; set; }
       public Double? tasa_hoy { get; set; }
       public int? numero_protocolo { get; set; }
       public Double? valor_dolar { get; set; }
       public Double? parciales { get; set; }
       public Double? mora_parcial { get; set; }
       public Double? interes_parcial { get; set; }
       public string? motivo_anulacion { get; set; }
       public int? idcatemp { get; set; }
       public Double? cuota_fija_inicial { get; set; }
       public DateTime? fecha_cancelar_inicial { get; set; }
       public int? plazo_inicial { get; set; }
       public int? dias_para_baja { get; set; }
       public int? Id_User { get; set; }
   }
}
