import { ModelProperty } from "../WDevCore/WModules/CommonModel.js";

class CuotaComponent {
    constructor(props) {
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    /**@type {ModelProperty} */
    fecha = { type: "date" };    
    /**@type {ModelProperty} */
    interes = { type: "number" };
    /**@type {ModelProperty} */
    abono_capital = { type: "number" };    
    /**@type {ModelProperty} */
    cuotaFija = { type: "number" };
    /**@type {ModelProperty} */
    capital = { type: "number" };
}
export { CuotaComponent }