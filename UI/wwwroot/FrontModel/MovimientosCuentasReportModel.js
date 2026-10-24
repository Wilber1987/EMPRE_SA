//@ts-check

// @ts-ignore
import { ModelProperty } from "../WDevCore/WModules/CommonModel.js";
import { DateTime } from "../WDevCore/WModules/Types/DateTime.js";
import { ConvertToMoneyString } from "../WDevCore/WModules/WComponentsTools.js";
import { Detail_Movimiento } from "./MovimientosCuentas.js";

export class Movimiento {

    /**
    * @param {Detail_Movimiento} movimiento 
    */
    constructor(movimiento, type = "cordobas") {
        this.montos = movimiento;
        this.Transaction_Movimiento = movimiento.Transaction_Movimiento || {};
        this.fecha = new DateTime(movimiento.fecha);
        // Determina las propiedades según el tipo
        const tipo = type.toLowerCase();
        this.debitoPropUSD = "debito_dolares";
        this.creaditoPropUSD = "credito_dolares";
        this.montoPropUSD = "monto_final_dolares";


        this.debitoPropNIO = "debito";
        this.creaditoPropNIO = "credito";
        this.montoPropNIO = "monto_final";


        this.currency = tipo === "dolares" ? "$" : "C$";
    }

    get concepto() {
        return this.Transaction_Movimiento?.concepto || "";
    }

    get fechaFormateada() {
        return this.fecha ? this.toDateFormatEs(this.fecha) : "";
    }
    get month() {
        return this.fecha?.getMonthFormatEs();
    }
    get day() {
        return this.fecha?.getDayFormatWithDateEs();
    }
    get debito_cordobas() {
        const value = this.montos[this.debitoPropNIO];
        return value ? value : 0;
    }

    get credito_cordobas() {
        const value = this.montos[this.creaditoPropNIO];
        return value ? value : 0;
    }

    get saldo_cordobas() {
        const value = this.montos[this.montoPropNIO];
        return value ?? 0;
    }

    get debito_dolares() {
        const value = this.montos[this.debitoPropUSD];
        return value ? value : 0;
    }

    get credito_dolares() {
        const value = this.montos[this.creaditoPropUSD];
        return value ? value : 0;
    }

    get saldo_dolares() {
        const value = this.montos[this.montoPropUSD];
        return value ?? 0;
    }

    toDateFormatEs(date) {
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }

}

export class Movimiento_ModelComponent {
    constructor(props) {
        // Cargar propiedades dinámicamente si se proporcionan
        Object.assign(this, props);
    }
    /**@type {ModelProperty} */  id_movimiento = { type: "number", primary: true };
    /**@type {ModelProperty} */  concepto = { type: "text" };
    /**@type {ModelProperty} */  fecha = { type: "datetime" };
    /**@type {ModelProperty} */  debito_dolares = { type: "money" };
    /**@type {ModelProperty} */  credito_dolares = { type: "money" };
    /**@type {ModelProperty} */  saldo_dolares = { type: "money" };
    /**@type {ModelProperty} */  debito_cordobas = { type: "money" };
    /**@type {ModelProperty} */  credito_cordobas = { type: "money" };
    /**@type {ModelProperty} */  saldo_cordobas = { type: "money" };
}
