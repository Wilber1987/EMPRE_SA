import { ModelProperty } from "../WDevCore/WModules/CommonModel.js";

class CuotaComponent {
    constructor(props) {
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    /**@type {ModelProperty} */
    fecha = { type: "date",  label: "FECHA" };    
    /**@type {ModelProperty} */
    total = { type: "number",  label: "IDCP" };
    /**@type {ModelProperty} */
    interes = { type: "number", label: "ABONO AL CAPITAL"  };    
    /**@type {ModelProperty} */
    abono_capital = { type: "number", label: "CUOTA A PAGAR" };
    /**@type {ModelProperty} */
    capital_restante = { type: "number", label: "MONTO RESTANTE" };
}
export { CuotaComponent }