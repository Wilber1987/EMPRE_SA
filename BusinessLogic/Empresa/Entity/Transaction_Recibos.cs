using APPCORE;
using CAPA_NEGOCIO.Util;
using DataBaseModel;

namespace DataBaseModel
{
    public class Transaccion_Recibos : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? id_factura { get; set; }
        public int? numero_contrato { get; set; }
        public string? tipo { get; set; }
        public string? concepto { get; set; }
        public decimal? tasa_cambio { get; set; }
        public decimal? total { get; set; }
        public int? id_cliente { get; set; }
        public int? id_sucursal { get; set; }
        public DateTime? fecha { get; set; }
        public int? id_usuario { get; set; }
        public string? estado { get; set; }
        public string? no_factura { get; set; }
        public decimal? subtotal { get; set; }
        public decimal? iva { get; set; }
        public decimal? total_cordobas { get; set; }
        public string? Moneda { get; set; }
        public string? Motivo_Anulacion { get; set; }
        public string? Consecutivo { get; set; }

        public bool IsAnulable
        {
            get
            {
                return estado != "ANULADO" && estado != "CANCELADO" && !DateUtil.IsAffterNDays(fecha, 1);
            }
        }

        [JsonProp]
        public Factura_contrato? Factura_contrato { get; set; }

        [OneToMany(TableName = "Detalle_Factura_Recibo", KeyColumn = "id_factura", ForeignKeyColumn = "id_factura")]
        public List<Detalle_Factura_Recibo>? Detalle_Factura_Recibo { get; set; }

    }

    public class Detalle_Factura_Recibo : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? id { get; set; }

        public int? id_cuota { get; set; }
        public decimal? total_cuota { get; set; }
        public decimal? monto_pagado { get; set; }
        public decimal? capital_restante { get; set; }
        public string? concepto { get; set; }
        public decimal? tasa_cambio { get; set; }
        public int? id_factura { get; set; }
        [JsonProp]
        public EstadoAnteriorCuota? EstadoAnterior { get; set; }

        //[ManyToOne(TableName = "Transaccion_Factura", KeyColumn = "id_factura", ForeignKeyColumn = "id_factura")]
        public Transaccion_Recibos? Transaccion_Factura { get; set; }
        [ManyToOne(TableName = "Tbl_Cuotas", KeyColumn = "id_cuota", ForeignKeyColumn = "id_cuota")]
        public Tbl_Cuotas? Tbl_Cuotas { get; set; }
    }

    public class EstadoAnteriorCuota
    {
        public DateTime? fecha_pago { get; set; }
        public decimal? pago_contado { get; set; }
        public string? Estado { get; set; }
        public decimal? total { get; set; }
        public decimal? interes { get; set; }
        public decimal? abono_capital { get; set; }
    }

    public class Factura_contrato
    {
        public int? numero_contrato { get; set; }
        public int? cuotas_pactadas { get; set; }
        public int? cuotas_pendientes { get; set; }
        public decimal? saldo_anterior { get; set; }
        public decimal? saldo_actual { get; set; }
        public decimal? mora { get; set; }
        public decimal? interes_demas_cargos_pagar { get; set; }
        public DateTime? proximo_pago_pactado { get; set; }
        public decimal? total_parciales { get; set; }
        public string? tipo { get; set; }
        public string? tipo_cuenta { get; set; }
        public decimal? total { get; set; }
        public decimal? tasa_cambio { get; set; }
        public int? id_cliente { get; set; }
        public int? id_clasificacion_interes_anterior { get; set; }
        public int? id_sucursal { get; set; }
        public decimal? reestructuracion { get; set; }
        public decimal? perdida_de_documento { get; set; }
        public decimal? total_pagado { get; set; }
        public bool? cancel_with_perdida { get; set; }

        public bool? Solo_Interes_Mora { get; set; }
        public Datos_Reestructuracion? Datos_Reestructuracion { get; set; }
        public decimal? mora_pagado { get; set; }
        public decimal? interes_pagado { get; set; }
        public decimal? abono_capital { get; set; }
        public int? reestructurado_anterior { get; set; }
    }

    public class Datos_Reestructuracion
    {

        public int? Plazo_Anterior { get; set; }
        public int? Nuevo_Plazo { get; set; }
        public decimal? Monto_Anterior { get; set; }
        public decimal? Nuevo_Monto { get; set; }
        public decimal? Cuota_Anterior { get; set; }
        public decimal? Nuevo_Cuota { get; set; }
        public List<Tbl_Cuotas>? Cuotas_reestructuradas { get; set; }
        public decimal? Cuota_Anterior_Cordobas { get; set; }
        public decimal? Nueva_Cuota_Cordobas { get; set; }
        public decimal? Monto_Anterior_Cordobas { get; set; }
        public decimal? Nuevo_Monto_Cordobas { get; set; }
    }

}