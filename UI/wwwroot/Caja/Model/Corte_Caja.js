import { Catalogo_Cuentas, Catalogo_Cuentas_ModelComponent } from "../../FrontModel/Catalogo_Cuentas.js";
import { ResponseServices } from "../../WDevCore/WModules/CommonModel.js";
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { Denominacion_Catalogo } from "./Denominacion_Catalogo.js";

export const EstadoCorteCaja = {
    ABIERTO: "ABIERTO",
    CERRADO: "CERRADO",
    ARQUEADO: "ARQUEADO"
};

export class Corte_Caja extends EntityClass {
    /**
     * @param {Partial<Corte_Caja>} [props]
     */
    constructor(props) {
        super(props, "Cuentas")
        Object.assign(this, props);
    }

    /** @type {Number?} */
    id_corte_caja = null;

    /** @type {Number?} */
    id_cuenta = null;

    /** @type {Number?} */
    id_usuario_apertura = null;

    /** @type {Number?} */
    id_usuario_cierre = null;

    /** @type {Date?} */
    fecha_apertura = null;

    /** @type {Date?} */
    fecha_cierre = null;

    /** @type {String?} */
    estado = null;

    /** @type {Number?} */
    id_sucursal = null;

    /** @type {Number?} */
    monto_inicial_cordobas = null;

    /** @type {Number?} */
    monto_inicial_dolares = null;

    /** @type {Number?} */
    monto_esperado_cordobas = null;

    /** @type {Number?} */
    monto_esperado_dolares = null;

    /** @type {Number?} */
    monto_fisico_cordobas = null;

    /** @type {Number?} */
    monto_fisico_dolares = null;

    /** @type {Number?} */
    diferencia_cordobas = null;

    /** @type {Number?} */
    diferencia_dolares = null;

    /** @type {String?} */
    observaciones_apertura = null;

    /** @type {String?} */
    observaciones_cierre = null;

    /** @type {Catalogo_Cuentas?} */
    Catalogo_Cuentas = null;

    /** @type {Array<Denominacion_Caja>} */
    Denominaciones_Apertura = [];

    /** @type {Array<Denominacion_Caja>} */
    Denominaciones_Cierre = [];

    //ENTITY #########################################
    /**@return {Promise<ResponseServices>} */;
    AbrirCaja = async () => {
        return await this.SaveData("ApiCuentas/AbrirCaja", this)
    }
    /**@return {Promise<ResponseServices>} */;
    CerrarCaja = async () => {
        return await this.SaveData("ApiCuentas/CerrarCaja", this)
    }
    /**@return {Promise<Array<Corte_Caja>>} */;
    GetCortesAbiertos = async () => {
        return await this.Post("ApiCuentas/GetCortesAbiertos", this)
    }
    /**@return {Promise<Array<Corte_Caja>>} */;
    GetCorteAbierto = async () => {
        const response = await this.Post("ApiCuentas/GetCorteAbierto", this)
        return new Corte_Caja(response)
    }
}

export class Corte_Caja_ModelComponent extends EntityClass {
     /**
     * @param {Partial<Corte_Caja_ModelComponent>} [props] 
     */
    constructor(props) {
        super(props, "Cuentas")
        Object.assign(this, props);
    }

    id_corte_caja = {
        type: 'number',
        primary: true
    };

    id_cuenta = {
        type: 'number',
        hidden: true,
        require: false
    };

    id_usuario_apertura = {
        type: 'number',
        hidden: true,
        require: false
    };

    id_usuario_cierre = {
        type: 'number',
        hidden: true,
        require: false
    };

    fecha_apertura = {
        type: 'date'
    };

    fecha_cierre = {
        type: 'date',
        require: false
    };

    estado = {
        type: 'select',
        Dataset: [
            EstadoCorteCaja.ABIERTO,
            EstadoCorteCaja.CERRADO,
            EstadoCorteCaja.ARQUEADO
        ]
    };

    id_sucursal = {
        type: 'number',
        hidden: true,
        require: false
    };

    monto_inicial_cordobas = {
        type: 'number'
    };

    monto_inicial_dolares = {
        type: 'number'
    };

    monto_esperado_cordobas = {
        type: 'number',
        disabled: true,
        require: false
    };

    monto_esperado_dolares = {
        type: 'number',
        disabled: true,
        require: false
    };

    monto_fisico_cordobas = {
        type: 'number',
        require: false
    };

    monto_fisico_dolares = {
        type: 'number',
        require: false
    };

    diferencia_cordobas = {
        type: 'number',
        disabled: true,
        require: false
    };

    diferencia_dolares = {
        type: 'number',
        disabled: true,
        require: false
    };

    observaciones_apertura = {
        type: 'textarea',
        require: false
    };

    observaciones_cierre = {
        type: 'textarea',
        require: false
    };

    Catalogo_Cuentas = {
        type: 'WSELECT',
        ModelObject: () => new Catalogo_Cuentas_ModelComponent()
    };

    Denominaciones_Apertura = {
        type: 'MASTERDETAIL',
        ModelObject: () => new Denominacion_Caja_ModelComponent(),
        require: false
    };

    Denominaciones_Cierre = {
        type: 'MASTERDETAIL',
        ModelObject: () => new Denominacion_Caja_ModelComponent(),
        require: false
    };
}


export class Denominacion_Caja {
    /**
     * @param {Partial<Denominacion_Caja>} [props]
     */
    constructor(props) {
        Object.assign(this, props);
    }

    /** @type {Number?} */
    id_corte_caja = null;

    /** @type {Number?} */
    id_denominacion = null;

    /** @type {Number?} */
    cantidad = null;

    /** @type {Number?} */
    subtotal = null;

    /** @type {Denominacion_Catalogo?} */
    Denominacion_Catalogo = null;
}

export class Denominacion_Caja_ModelComponent {
    /**
     * @param {Partial<Denominacion_Caja_ModelComponent>} [props]
     */
    constructor(props) {
        Object.assign(this, props);
    }

    id_corte_caja = {
        type: 'number',
        hidden: true,
        require: false
    };

    id_denominacion = {
        type: 'number',
        hidden: true,
        require: false
    };

    cantidad = {
        type: 'number'
    };

    subtotal = {
        type: 'number',
        disabled: true,
        require: false
    };

    Denominacion_Catalogo = {
        type: 'WSELECT',
        ModelObject: () => new Denominacion_Caja_ModelComponent()
    };
}