import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";

export class Denominacion_Catalogo extends EntityClass {
    /**
     * @param {Partial<Denominacion_Catalogo>} [props]
     */
    constructor(props) {
        super(props, 'Cuentas');
        Object.assign(this, props);
    }

    /** @type {Number} */
    id_denominacion;

    /** @type {Number?} */
    valor = null;

    /** @type {String?} */
    moneda = null;

    /** @type {String?} */
    tipo = null;

    /** @type {Boolean?} */
    activa = true;
}

export class Denominacion_Caja_ModelComponent extends EntityClass {
    /**
     * @param {Partial<Denominacion_Caja_ModelComponent>} [props] 
     */
    constructor(props) {
        super(props, 'Cuentas');
        Object.assign(this, props);
    }

    /** @type {ModelProperty} */ id_corte_caja = {
        type: 'number',
        hidden: true,
        require: false
    };

    /** @type {ModelProperty} */ id_denominacion = {
        type: 'number',
        hidden: true,
        require: false
    };

    /** @type {ModelProperty} */ cantidad = {
        type: 'number'
    };

    /** @type {ModelProperty} */ subtotal = {
        type: 'number',
        disabled: true,
        require: false
    };

    /** @type {ModelProperty} */ Denominacion_Catalogo = {
        type: 'WSELECT',
        ModelObject: () => new Denominacion_Caja_ModelComponent()
    };
}
