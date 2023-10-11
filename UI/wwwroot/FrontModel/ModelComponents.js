import { ModelProperty } from "../WDevCore/WModules/CommonModel.js";

class Tbl_Cuotas_ModelComponent {
    constructor(props) {
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    /**@type {ModelProperty} */
    fecha = { type: "date",  label: "FECHA" };   
    /**@type {ModelProperty} */
    interes = { type: "number", label: "IDCP"  };    
    /**@type {ModelProperty} */
    abono_capital = { type: "number", label: "ABONO AL CAPITAL" };
    /**@type {ModelProperty} */
    total = { type: "number",  label: "CUOTA A PAGAR" };
    /**@type {ModelProperty} */
    capital_restante = { type: "number", label: "MONTO RESTANTE" };
}
export { Tbl_Cuotas_ModelComponent }