using System;
using System.Collections.Generic;
using API.Controllers;
using APPCORE;
using Business;
using BusinessLogic.Empresa.Entity;
using BusinessLogic.Empresa.Transactions;
using DataBaseModel;

namespace Transactions
{
    public class Orden_Movimiento : EntityClass
    {

        [PrimaryKey(Identity = true)]
        public int? id_orden { get; set; }

        // Referencia al documento que originó la orden
        public int? id_documento_origen { get; set; }  // id_contrato, id_factura, etc.
        public string? tipo_documento_origen { get; set; }  // "CONTRATO", "FACTURA", "COMPRA"

        // Datos del movimiento
        public string? descripcion { get; set; }
        public DirectionEnum? direccion { get; set; }
        public string? concepto { get; set; }
        public decimal? monto { get; set; }
        public decimal? tasa_cambio { get; set; }
        public decimal? tasa_cambio_compra { get; set; }
        public MonedaEnum? moneda { get; set; }

        // Cuentas involucradas
        public int? Id_cuenta_origen { get; set; }
        public int? Id_cuenta_destino { get; set; }

        // Tipo de movimiento
        public TipoMovimiento? Tipo_Movimiento { get; set; }

        // Control de flujo
        public EstadoOrden? estado { get; set; }  // EstadoOrden
        public int? id_usuario_crea { get; set; }
        public int? id_usuario_aprueba { get; set; }
        public DateTime? fecha_creacion { get; set; }
        public DateTime? fecha_aprobacion { get; set; }
        public string? motivo_rechazo { get; set; }
        public int? id_sucursal { get; set; }

        // Relación con el movimiento ejecutado
        public int? id_movimiento_ejecutado { get; set; }

        // Flag para indicar si requiere aprobación
        public bool? requiere_aprobacion { get; set; }
        public string? Cliente { get; set; }
        //MONEDA DE LA ORDEN
        [JsonProp]
        public List<Denominacion_Movimiento> DenominationsUSD { get; set; } = [];
        [JsonProp]
        public List<Denominacion_Movimiento> DenominationsNIO { get; set; } = [];

        //CAMBIO DE MONEDA
        [JsonProp]
        public List<Denominacion_Movimiento> DenominationsCambioNIO { get; set; } = [];

        [JsonProp]
        public List<Denominacion_Movimiento> DenominationsCambioUSD { get; set; } = [];

        //VUELTOS DE MONEDA
        [JsonProp]
        public List<Denominacion_Movimiento> DenominationsVueltoUSD { get; set; } = [];

        [JsonProp]
        public List<Denominacion_Movimiento> DenominationsVueltoNIO { get; set; } = [];



        public TipoOperacionEnum? tipo_operacion_cambio { get; set; }
        public decimal? monto_cambio_nio { get; set; }
        public decimal? tasa_cambio_aplicada { get; set; }
        public decimal? monto_cambio_usd { get; set; }

        // Tipo de vuelto: "NONE", "USD", "NIO"
        public string? tipo_vuelto { get; set; }

        // Monto de vuelto calculado
        public decimal? monto_vuelto_usd { get; set; }
        public decimal? monto_vuelto_nio { get; set; }
        public bool AutoCreate { get; internal set; }
        public int? Id_OrderRelated { get;  set; }

        [ManyToOne(TableName = "Orden_Movimiento", KeyColumn = "id_orden", ForeignKeyColumn = "Id_OrderRelated")]
		public Orden_Movimiento? Orden_Related { get; set; }


        /// <summary>
        /// Crea una orden pendiente de aprobación
        /// </summary>
        public ResponseService SaveOrder(string? sessionKey)
        {
            var (User, dbUser) = Business.Security_Users.GetUserData(sessionKey);
            return DoSaveOrder(dbUser);
        }

        public ResponseService DoSaveOrder(Security_Users? dbUser)
        {
            try
            {
                this.estado = EstadoOrden.PENDIENTE;
                this.fecha_creacion = DateTime.Now;
                this.id_usuario_crea = dbUser.Id_User;
                this.id_sucursal = dbUser.Id_Sucursal;

                // Si el monto es menor a cierto umbral, podría no requerir aprobación
                // this.requiere_aprobacion = this.monto > 10000;

                var result = this.Save();
                return new ResponseService()
                {
                    status = 200,
                    message = "Orden creada exitosamente. Pendiente de aprobación.",
                    body = result
                };
            }
            catch (Exception ex)
            {
                return new ResponseService()
                {
                    status = 400,
                    message = "Error al crear orden: " + ex.Message
                };
            }
        }


    }

    public enum TipoOperacionEnum
    {
        MIXED_PAYMENT, NONE,
        VENTA_MONEDA,
        COMPRA_MONEDA,
    }

    public enum DirectionEnum
    {
        INGRESO, EGRESO, MIXED
    }
}