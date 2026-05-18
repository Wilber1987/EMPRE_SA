import {ModelProperty} from "../WDevCore/WModules/CommonModel.js";
import {ConvertToMoneyString} from "../WDevCore/WModules/WComponentsTools.js";
import {EntityClass} from "../WDevCore/WModules/EntityClass.js";

class Tbl_Cuotas_ModelComponent {
    constructor(props) {
        Object.assign(this, props);
    }
    /**@type {ModelProperty} */
    fecha = { type: "date",  label: "FECHA" };   
    /**@type {ModelProperty} */
    interes = { type: "money", label: "IDCP $"  };    
    /**@type {ModelProperty} */
    abono_capital = { type: "money", label: "ABONO AL CAPITAL $" };
    /**@type {ModelProperty} */
    total = { type: "money",  label: "CUOTA A PAGAR $" };
    /**@type {ModelProperty} */
    total_cordobas = { type: "OPERATION",  label: "CUOTA A PAGAR CORDOBAS", action: (/**@type {Tbl_Cuotas_ModelComponent} */ cuota)=>{
        return ConvertToMoneyString(cuota.total * cuota.tasa_cambio);
    } };
    /**@type {ModelProperty} */
    capital_restante = { type: "money", label: "MONTO RESTANTE $" };
    /**@type {ModelProperty} */
    Estado = { type: "text"};
}
export { Tbl_Cuotas_ModelComponent }

class Tbl_Cuotas extends EntityClass {
    /**
     *
     * @param {Tbl_Cuotas} [props]
     */
    constructor(props) {
        super();
        Object.assign(this, props);
    }

    /**Datos de la Tbl_cuotas*/
    /**@type {Date} */
    fecha;
    /**@type {Number} Tbl_cuotas del abono total a pagar dolares*/
    id_cuota;
    /**@type {Number} Tbl_cuotas del abono total a pagar dolares*/
    total;
    /**@type {Number} valor del interes del capital*/
    interes;
    /**@type {Number} */
    abono_capital;
    /**@type {Number} capital restante*/
    capital_restante;
    /**@type {Number} mora*/
    mora;
    /**DATOS DE LA FATURA */
    /**@type {Date} */
    fecha_pago;
    /**@type {Number} Tbl_cuotas del abono*/
    pago_contado;
    /**@type {Number} Tbl_cuotas del abono*/
    descuento;
    /**@type {Number} Tbl_cuotas del abono*/
    tasa_cambio;
    /**@type {String} Tbl_cuotas del abono*/
    Estado;

}

export {Tbl_Cuotas};