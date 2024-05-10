import { ModelProperty } from "../WDevCore/WModules/CommonModel.js";
import { EntityClass } from "../WDevCore/WModules/EntityClass.js";
import { Catalogo_Cuentas } from "./DBODataBaseModel.js";

class Movimientos_Cuentas extends EntityClass {
	constructor(props) {
		super(props, 'Cuentas');
		for (const prop in props) {
			this[prop] = props[prop];
		}
	}
	/**@type {ModelProperty} */ id_movimiento = { type: "number", primary: true }
	/**@type {ModelProperty} */ Catalogo_Cuentas_Origen = { type: 'WSELECT', ModelObject: () => new Catalogo_Cuentas() };
	/**@type {ModelProperty} */ Catalogo_Cuentas_Destino = { type: 'WSELECT', ModelObject: () => new Catalogo_Cuentas() };
	//moneda = { type: 'select', Dataset: ["C$", "$"], hiddenInTable: false,hidden:true, disabled: true, require: false, };
	/**@type {ModelProperty} */ moneda = { type: "radio", Dataset: ["CORDOBAS", "DOLARES"] };
	/**@type {ModelProperty} */ monto = { type: "money", hiddenFilter: true };
	/**@type {ModelProperty} */ tasa_cambio = { type: "money", disabled: true , hiddenFilter: true, hidden: true};
	//tasa_cambio_compra = { type: "number", disabled: true , hiddenFilter: true};	
	/**@type {ModelProperty} */ id_usuario_crea = { type: "number", hidden: true, hiddenFilter: true };
	/**@type {ModelProperty} */ fecha = { type: "datetime", disabled: true, require: false };		
	/**@type {ModelProperty} */ concepto = { type: "textarea" };
	/**@type {ModelProperty} */ descripcion = { type: "textarea", require: false , hiddenFilter: true, hiddenInTable: true};
}
export { Movimientos_Cuentas }


class Detail_Movimiento extends EntityClass {
	constructor(props) {
		super(props, 'Cuentas');
		for (const prop in props) {
			this[prop] = props[prop];
		};
	}
	id_movimiento = { type: "number", primary: true };
	fecha = { type: "date" };
	//moneda = { type: 'select', Dataset: ["C$", "$"], hiddenInTable: false,hidden:true, disabled: true, require: false, };
	debito = { type: "number" };
	credito = { type: "number" };
	debito_dolares = { type: "number" };
	credito_dolares = { type: "number" };
	monto_inicial = { type: "number" };
	monto_final = { type: "number" };
	monto_inicial_dolares = { type: "number" };
	monto_final_dolares = { type: "number" };
	Transaction_Movimiento = undefined;

}
export { Detail_Movimiento }