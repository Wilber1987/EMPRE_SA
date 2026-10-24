//@ts-check

// @ts-ignore
import { Catalogo_Cuentas, Catalogo_Cuentas_ModelComponent } from "../../FrontModel/Catalogo_Cuentas.js";
// @ts-ignore
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { DateTime } from "../../WDevCore/WModules/Types/DateTime.js";
import { Money } from "../../WDevCore/WModules/Types/Money.js";



export const DirectionEnum = {
    INGRESO: "INGRESO",
    EGRESO: "EGRESO",
    MIXED: "MIXED"
};

export class Orden_Movimiento extends EntityClass {
    /**
     * @param {Partial<Orden_Movimiento>} [props]
     */
    constructor(props) {
        super(props, 'Cuentas');
        Object.assign(this, props);
    }

    /** @type {Number?} */
    id_orden = null;

    /** @type {Number?} */
    id_documento_origen = null;

    /** @type {String?} */
    tipo_documento_origen = null;

    /** @type {String?} */
    descripcion = null;

    /** @type {String?} */
    direccion = null;

    /** @type {String?} */
    concepto = null;

    /** @type {Money?} */
    monto = null;

    /** @type {Number?} */
    tasa_cambio = null;

    /** @type {Number?} */
    tasa_cambio_compra = null;

    /** @type {String?} */
    moneda = null;

    /** @type {Number?} */
    Id_cuenta_origen = null;

    /** @type {Number?} */
    Id_cuenta_destino = null;

    /** @type {String?} */ //TipoMovimiento
    Tipo_Movimiento = null;

    /** @type {String?} */
    estado = null;

    /** @type {String?} */
    Cliente = null;

    /** @type {Number?} */
    id_usuario_crea = null;

    /** @type {Number?} */
    id_usuario_aprueba = null;

    /** @type {Date?} */
    fecha_creacion = null;

    /** @type {Date?} */
    fecha_aprobacion = null;

    /** @type {String?} */
    motivo_rechazo = null;

    /** @type {Number?} */
    id_sucursal = null;

    /** @type {Number?} */
    id_movimiento_ejecutado = null;

    /** @type {Boolean?} */
    requiere_aprobacion = null;

    /** @type {Catalogo_Cuentas?} */
    Catalogo_Cuentas_Origen = null;

    /** @type {Catalogo_Cuentas?} */
    Catalogo_Cuentas_Destino = null;

    /** @type {DenominacionMovimientoDTO[]} */
    //denominaciones del monto dolares
    DenominationsUSD = [];

    /** @type {DenominacionMovimientoDTO[]} */
    //denominaciones del monto cordobas
    DenominationsNIO = [];



     /** @type {String?} */
    // "NONE", "VENTA_MONEDA" (caja entrega USD, recibe NIO), "COMPRA_MONEDA" (caja recibe USD, entrega NIO)
    tipo_operacion_cambio = null;

    /** @type {Number?} */
    monto_cambio_usd = null;  // Monto en USD que se cambia

    /** @type {Number?} */
    monto_cambio_nio = null;  // Monto en NIO equivalente al cambio

    /** @type {Number?} */
    tasa_cambio_aplicada = null;  // Tasa usada para el cambio
    
    /** @type {String?} */
    tipo_vuelto = null;

    /** @type {DenominacionMovimientoDTO[]} */
    DenominationsCambioUSD = [];  // Billetes USD que la caja entrega/recibe en la mesa cambiaria

    /** @type {DenominacionMovimientoDTO[]} */
    DenominationsCambioNIO = [];  // Billetes NIO que la caja entrega/recibe en la mesa cambiaria

    /** @type {DenominacionMovimientoDTO[]} */
    DenominationsVueltoUSD = [];  // Billetes USD que la caja entrega/recibe en la mesa cambiaria

    /** @type {DenominacionMovimientoDTO[]} */
    DenominationsVueltoNIO = [];  // Billetes NIO que la caja entrega/recibe en la mesa cambiaria

    

    //ENTITY #########################################
    /**@return {Promise<ResponseServices>} */;
    AprobarOrden = async () => {
        return await this.SaveData("ApiCuentas/AprobarOrden", this)
    }
    /**@return {Promise<ResponseServices>} */;
    RechazarOrden = async () => {
        return await this.SaveData("ApiCuentas/RechazarOrden", this)
    }

}

export class Orden_Movimiento_ModelComponent extends EntityClass {
    /**
   * @param {Partial<Orden_Movimiento_ModelComponent>} props 
   */
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }

    /**@type {ModelProperty} */ id_orden = {
        type: 'number',
        primary: true
    };

    /**@type {ModelProperty} */ id_documento_origen = {
        type: 'number',
        require: false
    };

    /**@type {ModelProperty} */ tipo_documento_origen = {
        type: 'text',
        require: false
    };
    /**@type {ModelProperty} */ cliente = {
        type: 'text',
        require: false
    };

    /**@type {ModelProperty} */ descripcion = {
        type: 'textarea'
    };

    /**@type {ModelProperty} */ direccion = {
        type: 'select',
        Dataset: [
            DirectionEnum.INGRESO,
            DirectionEnum.EGRESO
        ]
    };

    /**@type {ModelProperty} */ concepto = {
        type: 'text'
    };

    /**@type {ModelProperty} */ monto = {
        type: 'number'
    };

    /**@type {ModelProperty} */ tasa_cambio = {
        type: 'number',
        require: false
    };

    /**@type {ModelProperty} */ tasa_cambio_compra = {
        type: 'number',
        require: false
    };

    /**@type {ModelProperty} */ moneda = {
        type: 'select',
        Dataset: Object.keys(MonedaEnum)
    };

    /**@type {ModelProperty} */ Id_cuenta_origen = {
        type: 'number',
        hidden: true,
        require: false
    };

    /**@type {ModelProperty} */ Id_cuenta_destino = {
        type: 'number',
        hidden: true,
        require: false
    };

    /**@type {ModelProperty} */ Catalogo_Cuentas_Origen = {
        type: 'WSELECT',
        ModelObject: () => new Catalogo_Cuentas_ModelComponent()
    };

    /**@type {ModelProperty} */ Catalogo_Cuentas_Destino = {
        type: 'WSELECT',
        ModelObject: () => new Catalogo_Cuentas_ModelComponent()
    };

    /**@type {ModelProperty} */ Tipo_Movimiento = {
        type: 'SELECT', Dataset: Object.keys(TipoMovimiento)
    };

    /**@type {ModelProperty} */ estado = {
        type: 'select',
        Dataset: [
            "PENDIENTE",
            "APROBADA",
            "RECHAZADA",
            "EJECUTADA"
        ],
        disabled: true,
        require: false
    };

    /**@type {ModelProperty} */ id_usuario_crea = {
        type: 'number',
        hidden: true,
        require: false
    };

    /**@type {ModelProperty} */ id_usuario_aprueba = {
        type: 'number',
        hidden: true,
        require: false
    };

    /**@type {ModelProperty} */ fecha_creacion = {
        type: 'date',
        disabled: true,
        require: false
    };

    /**@type {ModelProperty} */ fecha_aprobacion = {
        type: 'date',
        disabled: true,
        require: false
    };

    /**@type {ModelProperty} */ motivo_rechazo = {
        type: 'textarea',
        require: false
    };

    /**@type {ModelProperty} */ id_sucursal = {
        type: 'number',
        hidden: true,
        require: false
    };

    /**@type {ModelProperty} */ id_movimiento_ejecutado = {
        type: 'number',
        hiddenInTable: true,
        require: false,
        disabled: true
    };

    /**@type {ModelProperty} */ requiere_aprobacion = {
        type: 'checkbox',
        require: false
    };
}


export class DenominacionMovimientoDTO {
    /**
     * @param {Partial<DenominacionMovimientoDTO>} [props]
     */
    constructor(props) {
        Object.assign(this, props);
    }
    /** @type {Number?} */id_denominacion = null
    /** @type {Number?} */ cantidad = null
    /** @type {String?} */tipo_operacion = null  // INGRESO o EGRESO
}

export const EstadoOrden = {
    PENDIENTE: "PENDIENTE",
    APROBADA: "APROBADA",
    RECHAZADA: "RECHAZADA",
    EJECUTADA: "EJECUTADA"
};


export const MonedaEnum = {
    CORDOBAS: "CORDOBAS",
    DOLARES: "DOLARES"
};

export const TipoMovimiento =
{
    COMPRA_DE_MONEDA: "COMPRA_DE_MONEDA",
    VENTA_DE_MONEDA: "VENTA_DE_MONEDA",
    REEMBOLSO_POR_CONTRATO_ANULADO: "REEMBOLSO_POR_CONTRATO_ANULADO",
    DESEMBOLSO_POR_CONTRATO: "DESEMBOLSO_POR_CONTRATO",
    INGRESO_POR_PAGO_DE_RECIBO: "INGRESO_POR_PAGO_DE_RECIBO",
    DESEMBOLSO_POR_ANULACION_DE_PAGO_DE_RECIBO: "DESEMBOLSO_POR_ANULACION_DE_PAGO_DE_RECIBO",
    DESEMBOLSO_POR_ANULACION_DE_PAGO_DE_FACTURACION: "DESEMBOLSO_POR_ANULACION_DE_PAGO_DE_FACTURACION",
    INGRESO_POR_PAGO_DE_FACTURACION: "INGRESO_POR_PAGO_DE_FACTURACION",
    PAGO: "PAGO", //PAGO GENERAL :"PAGO", //PAGO GENERAL", POR EJEMPLO CUANDO SE PAGA LA LUZ O ALQUILERES
    INGRESO: "INGRESO",//INGRESO GENERAL
    EGRESO: "EGRESO",//EGRESO GENERAL
    MOVIMIENTO_CUENTA: "MOVIMIENTO_CUENTA", //PARA EJEMPLIFICAR MOVIMIENTOS DE CAJA
    DESEMBOLSO_POR_COMPRA: "DESEMBOLSO_POR_COMPRA",
    REEMBOLSO_POR_COMPRA_ANULADA: "REEMBOLSO_POR_COMPRA_ANULADA",
    BENEFICIO_VENTA_DE_MONEDA: "BENEFICIO_VENTA_DE_MONEDA",
    CAMBIO_MONEDA: "CAMBIO_MONEDA"
}


