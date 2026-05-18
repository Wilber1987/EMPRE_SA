import {EntityClass} from "../WDevCore/WModules/EntityClass.js";

//@ts-check
class ValoracionesTransaction extends EntityClass {
	constructor(props) {
		super();
		Object.assign(this, props);;
		this.Moneda = undefined;
	}
	/**@type {Array<Transactional_Valoracion_ModelComponent>} */
	valoraciones;

	/**@type {Transaction_Contratos} */
	Transaction_Contratos;

	SaveDataContract = async () => {
		return await this.SaveData("Transactional_Contrato/SaveDataContract", this)
		true;
	}
	SaveContract = async () => {
		return this.SaveData("Transactional_Contrato/SaveContract", this)
	}
	GetValoracionContrato = async () => {
		console.log("carajo")
		return await this.SaveData("Transactional_Contrato/GetDataContract", this)
	}
	VerContrato = async () => {
		return await this.SaveData("PDF/GeneratePdfContract", this.Transaction_Contratos)
	}
}
export { ValoracionesTransaction }


class Catalogo_Categoria extends EntityClass {
	constructor(props) {
		super(props, 'EntityDbo');
		Object.assign(this, props);
	}
	/**@type {Number}*/ id_categoria;
	/**@type {String}*/ tipo;
	/**@type {String}*/ descripcion;
	/**@type {Number}*/ plazo_limite;
	/**@type {Number}*/ prioridad;
	/**@type {Boolean}*/ isEditable;
	/**@type {Boolean}*/ IsForVehiculo;
	/**@type {Array<Detail_Prendas>} OneToMany*/ Detail_Prendas;
	/**@type {Array<Transactional_Valoracion_ModelComponent>} OneToMany*/ Transactional_Valoracion_ModelComponent;
}
export { Catalogo_Categoria }
