//@ts-check
// @ts-ignore
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { Denominacion_Caja_ModelComponent, Denominacion_Catalogo } from "./Denominacion_Catalogo.js";

export class Inventario_Denominacion_Caja extends EntityClass {
    /**
     * @param {Partial<Inventario_Denominacion_Caja>} [props]
     */
    constructor(props) {
        super(props, 'Cuentas');
        Object.assign(this, props);
    }

    /** @type {Number?} */
    id_inventario= null;

    /** @type {Number?} */
    id_cuenta = null;

    /** @type {Number?} */
    id_denominacion = null;

    /** @type {Number?} */
    cantidad_actual = null;

    /** @type {Date?} */
    ultima_actualizacion = null;

    /** @type {Denominacion_Catalogo?} */
    Denominacion_Catalogo = null;
}

export class Inventario_Denominacion_Caja_ModelComponent extends EntityClass {
    /**
     * @param {Partial<Inventario_Denominacion_Caja_ModelComponent>} [props]
     */
    constructor(props) {
        super(props, 'Cuentas');
        Object.assign(this, props);
    }

    /** @type {ModelProperty} */ id_inventario = {
        type: 'number',
        primary: true,
        hidden: true,
        require: false
    };

    /** @type {ModelProperty} */ id_cuenta = {
        type: 'number',
        hidden: true,
        require: false
    };

    /** @type {ModelProperty} */ id_denominacion = {
        type: 'number',
        hidden: true,
        require: false
    };

    /** @type {ModelProperty} */ cantidad_actual = {
        type: 'number'
    };

    /** @type {ModelProperty} */ ultima_actualizacion = {
        type: 'date',
        disabled: true,
        require: false
    };

    /** @type {ModelProperty} */ Denominacion_Catalogo = {
        type: 'WSELECT',
        ModelObject: () => new Denominacion_Caja_ModelComponent()
    };
}