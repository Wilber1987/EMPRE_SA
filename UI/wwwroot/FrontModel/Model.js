//@ts-check
class ValoracionesContrato {
    constructor(props) {
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    /**@type {Number} */
    valoracion_compra_cordobas;
    /**@type {Number} */
    valoracion_compra_dolares;
    /**@type {Number} */
    valoracion_empeño_cordobas;
    /**@type {Number} */
    valoracion_empeño_dolares;
    /**@type {Number} */
    tasas_interes;
    /**@type {Number} */
    plazo;
    /**@type {Date} */
    fecha;
    /**@type {Array} */
    cuotas;
}
export { ValoracionesContrato }
class Cuota {
    constructor(props) {
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    /**@type {Number} */
    fecha;
    /**@type {Number} */
    cuotaFija;
    /**@type {Number} */
    interes;
    /**@type {Number} */
    abono_capital;
    /**@type {Number} */
    capital;
}
export { Cuota }