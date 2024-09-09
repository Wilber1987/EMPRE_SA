//@ts-check
import { EntityClass } from "../WDevCore/WModules/EntityClass.js";

class Catalogo_Cambio_Divisa extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    /**@type {Number}*/ Id_cambio;
    /**@type {Date}*/ Fecha;
    /**@type {Number}*/ Valor_de_compra;
    /**@type {Number}*/ Valor_de_venta;
}
export { Catalogo_Cambio_Divisa }
