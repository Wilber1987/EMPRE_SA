import { EntityClass } from "../WDevCore/WModules/EntityClass.js";

export class CuentasCompras extends EntityClass {
     /**
    * @param {Partial<CuentasCompras>} [props]
    */
    constructor(props) {
        super(props, 'Cuentas');
        Object.assign(this, props);
    }
    /**@type {Number?} */ Id_cuenta_origen = null;
    /**@type {Number??} */ Id_cuenta_destino = null;
}

export class CuentasAnularCompras extends EntityClass {
     /**
    * @param {Partial<CuentasCompras>} [props]
    */
    constructor(props) {
        super(props, 'Cuentas');
        Object.assign(this, props);
    }
    /**@type {Number?} */ Id_cuenta_origen = null;
    /**@type {Number??} */ Id_cuenta_destino = null;
}