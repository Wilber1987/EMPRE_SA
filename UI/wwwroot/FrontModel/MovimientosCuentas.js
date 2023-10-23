import { EntityClass } from "../WDevCore/WModules/EntityClass.js";
import { Catalogo_Cuentas } from "./DBODataBaseModel.js";

class Movimientos_Cuentas extends EntityClass {
	constructor(props) {
		super(props, 'Cuentas');
		for (const prop in props) {
			this[prop] = props[prop];
		}
	}
	id_movimiento = { type: "number", primary: true }
	Catalogo_Cuentas_Origen = { type: 'WSELECT', ModelObject: () => new Catalogo_Cuentas() };
	Catalogo_Cuentas_Destino = { type: 'WSELECT', ModelObject: () => new Catalogo_Cuentas() };
	//moneda = { type: 'select', Dataset: ["C$", "$"], hiddenInTable: false,hidden:true, disabled: true, require: false, };
	monto = { type: "number" };
	tasa_cambio = { type: "number", disabled: true };
	tasa_cambio_compra = { type: "number", disabled: true };
	moneda = { type: "radio", Dataset: ["CORDOBAS", "DOLARES"] };
	id_usuario_crea = { type: "number", hidden: true };
	fecha = { type: "date", disabled: true, required: false, hidden: true };	
	concepto = { type: "textarea" };
	descripcion = { type: "textarea", required: false };
	correo_enviado = { type: "checkbox", require: false, hiddenInTable: true, hidden: true };
	is_transaction = { type: "checkbox", require: false, disabled: true, hidden: true};
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