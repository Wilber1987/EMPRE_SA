//@ts-check
// @ts-ignore
import { ModelProperty } from "../WDevCore/WModules/CommonModel.js";
import {EntityClass} from "../WDevCore/WModules/EntityClass.js";
import { Catalogo_Categoria_ModelComponent } from "./DBODataBaseModel.js";
import { Catalogo_Categoria } from "./Model.js";
import { Transactional_Valoracion_ModelComponent } from "./Transaction_Valoracion.js";

class Detail_Prendas extends EntityClass {
	/**
	 *
	 * @param {Partial<Detail_Prendas>} [props]
	 */
	constructor(props) {
		super(props, 'EntityDBO');
        Object.assign(this, props);
	}
	/**@type {Number?} */ numero_prenda = null;
	/**@type {Number?} */ numero_contrato_OLD = null;
	/**@type {String?} */ Descripcion = null;
	/**@type {Number?} */ monto_aprobado_cordobas = null;
	/**@type {Number?} */ monto_aprobado_dolares = null;
	/**@type {String?} */ Tipo = null;
	/**@type {String?} */ marca = null;
	/**@type {String?} */ serie = null;
	/**@type {String?} */ modelo = null;
	/**@type {Number?} */ iva = null;
	/**@type {Number?} */ margen = null;
	/**@type {Number?} */ estado = null;
	/**@type {Number?} */ interesl = null;
	/**@type {Number?} */ moral = null;
	/**@type {Number?} */ fliquidacion = null;
	/**@type {Number?} */ precio_venta = null;
	/**@type {String?} */ en_manos_de = null;
	/**@type {String?} */ color = null;
	/**@type {Number?} */ Detail_Prendas_Vehiculos = null;
	/**@type {Catalogo_Categoria?} */ Catalogo_Categoria = null;
	/**@type {Transactional_Valoracion_ModelComponent?} */ Transactional_Valoracion = null;
}

class Detail_Prendas_Vehiculos extends EntityClass {
	/**
	 *
	 * @param {Partial<Detail_Prendas_Vehiculos>} [props]
	 */
    constructor(props) {
		super(props, 'EntityDBO');
		Object.assign(this, props);
	}
	/**@type {Number?} */ capacidad_cilindros = null;
	/**@type {Number?} */ cantidad_cilindros = null;
	/**@type {Number?} */ cantidad_pasajeros = null;
	/**@type {Number?} */ year_vehiculo = null;
	/**@type {Number?} */ montor = null;
	/**@type {Number?} */ chasis = null;
	/**@type {Number?} */ placa = null;
	/**@type {Number?} */ circuacion = null;
	/**@type {Number?} */ defectuoso = null;
	/**@type {Number?} */ fecha_aut_descuento = null;
	/**@type {Number?} */ defecto = null;
	/**@type {Number?} */ porcentage_descuento_maximo = null;
	/**@type {Number?} */ fecha_seguro = null;
	/**@type {Number?} */ combustible = null;
	/**@type {Number?} */ Detail_Prendas = null;
}

export {Detail_Prendas_Vehiculos};
export {Detail_Prendas};

class Detail_Prendas_ModelComponent extends EntityClass {
    /**
	 *
	 * @param {Partial<Detail_Prendas_ModelComponent>} [props]
	 */
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }
    /**@type {ModelProperty?} */ numero_prenda = { type: 'number', primary: true };
    /**@type {ModelProperty?} */ numero_contrato_OLD = { type: 'number', hidden: true };
    /**@type {ModelProperty?} */ Descripcion = { type: 'text' };
    /**@type {ModelProperty?} */ Tipo = { type: 'text', hidden: true };
    /**@type {ModelProperty?} */ marca = { type: 'text' };
    /**@type {ModelProperty?} */ serie = { type: 'text', require: true };
    /**@type {ModelProperty?} */ modelo = { type: 'text' };
    /**@type {ModelProperty?} */ monto_aprobado_cordobas = { type: 'money', label: "Monto aprob. cordobas", disabled: true };
    /**@type {ModelProperty?} */ monto_aprobado_dolares = { type: 'money', label: "Monto aprob. dolares", disabled: true };
    /**@type {ModelProperty?} */ iva = { type: 'text', hidden: true };
    /**@type {ModelProperty?} */ estado = { type: 'select', Dataset: ["ACTIVO", "INACTIVO"], hiddenInTable: true };
    /**@type {ModelProperty?} */ precio_venta = { type: 'money', hiddenInTable: true, hidden: true };
    /**@type {ModelProperty?} */ en_manos_de = { type: 'select', Dataset: ["ACREEDOR", "DEUDOR"], hiddenInTable: true };
    /**@type {ModelProperty?} */ color = { type: 'text' };
    /**@type {ModelProperty?} */ Catalogo_Categoria = {
        hiddenInTable: true,
        type: 'WSELECT', ModelObject: () => new Catalogo_Categoria_ModelComponent(), action: () => {

        }
    };
    /**@type {ModelProperty?} */ 
    Detail_Prendas_Vehiculos = {
        type: 'Model',
        hidden: (/** @type {{ Detail_Prendas_Vehiculos: null | undefined; }} */ element) => { return element.Detail_Prendas_Vehiculos == null || element.Detail_Prendas_Vehiculos == undefined },
        ModelObject: () => new Detail_Prendas_Vehiculos_ModelComponent(),
        EntityModel: () => new Detail_Prendas_Vehiculos()
    };

}
export { Detail_Prendas_ModelComponent }
class Detail_Prendas_Vehiculos_ModelComponent extends EntityClass {
    /**
	 *
	 * @param {Partial<Detail_Prendas_Vehiculos_ModelComponent>} [props]
	 */
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }
    /**@type {ModelProperty?} */ capacidad_cilindros = { type: 'text' };
    /**@type {ModelProperty?} */ cantidad_cilindros = { type: 'text' };
    /**@type {ModelProperty?} */ cantidad_pasajeros = { type: 'text' };
    /**@type {ModelProperty?} */ year_vehiculo = { type: 'number' };
    /**@type {ModelProperty?} */ montor = { type: 'text', label: "N° Motor" };
    /**@type {ModelProperty?} */ chasis = { type: 'text' };
    /**@type {ModelProperty?} */ placa = { type: 'text' };
    /**@type {ModelProperty?} */ circuacion = { type: 'text' };
    /**@type {ModelProperty?} */ defectuoso = { type: 'text', hidden: true };
    /**@type {ModelProperty?} */ fecha_aut_descuento = { type: 'date', hidden: true };
    /**@type {ModelProperty?} */ defecto = { type: 'text', hidden: true };
    /**@type {ModelProperty?} */ porcentage_descuento_maximo = { type: 'number', hidden: true };
    /**@type {ModelProperty?} */ fecha_seguro = { type: 'date', label: "Fecha Vencimiento Seguro" };
    /**@type {ModelProperty?} */ combustible = { type: 'text' };
    /**@type {ModelProperty?} */ uso = { type: 'select', Dataset: ["PRIVADO", "PARTICULAR"], hiddenInTable: true };
    /**@type {ModelProperty?} */ servicio = { type: 'select', Dataset: ["PRIVADO", "PARTICULAR"], hiddenInTable: true };

}
export { Detail_Prendas_Vehiculos_ModelComponent }