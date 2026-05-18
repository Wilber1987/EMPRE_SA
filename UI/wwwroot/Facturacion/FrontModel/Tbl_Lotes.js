//@ts-check
import {Catalogo_Cambio_Divisa} from "../../FrontModel/Catalogo_Cambio_Divisa.js";
import {EntityClass} from "../../WDevCore/WModules/EntityClass.js";
import {Tbl_Transaccion} from "./Tbl_Transaction.js";

import {Transactional_Valoracion} from "../../FrontModel/Transaction_Valoracion.js";

class Tbl_Lotes extends EntityClass {

	/**
	* @param {Partial<Tbl_Lotes>} [props] 
	*/
	constructor(props) {
		super(props, 'TransactionLotes');
		Object.assign(this, props);;
	}
	/**@type {Number}*/ Id_Lote;
	/**@type {Number}*/ Id_Producto;
	/**@type {String}*/ Name;
	/**@type {String}*/ Detalles;
	/**@type {String}*/ Codigo;
	/**@type {String}*/ Tipo;
	//**@type {Number}*/ Precio_Venta;
	//**@type {Number}*/ Precio_Compra;
	/**@type {Number}*/ Cantidad_Inicial;
	/**@type {Number}*/ Cantidad_Existente;
	/**@type {String}*/ Lote;
	/**@type {Date}*/ Fecha_Ingreso;
	/**@type {Cat_Almacenes} ManyToOne*/ Cat_Almacenes;
	//**@type {Cat_Producto} ManyToOne*/ Cat_Producto;
	/**@type {Transactional_Valoracion}*/ Datos_Producto;
	/**@type {EtiquetaLote} */ EtiquetaLote;
	/**@type {Detalle_Compra} */ Detalle_Compra;
	/**@type {Boolean}*/ IsActivo;
	/**@type {String}*/ Estado;
	
	async DarDeBaja(/**@type {Tbl_Transaccion}*/Transaction) {
		return await this.SaveData("ApiTransactionLotes/DarDeBaja", Transaction)
	}
	async RevertirBaja(Transaction) {
		return await this.SaveData("ApiTransactionLotes/AnularTbl_Bajas_Almacen", Transaction)
	}
	/**@type {String}*/  get Descripcion() {
		return `${this.Detalle_Compra?.Cat_Producto.Descripcion ?? ""}`;
	}
	/**@type {String}*/  get Estado_Producto() {		
		return `${this.Datos_Producto?.Catalogo_Estados_Articulos?.nombre ?? ""}`;
	}
}
export { Tbl_Lotes };

export class Detail_Valores {
	/** @type {Number} */Valoracion_1;
	/** @type {Number} */dolares_1;
	/** @type {Number} */Valoracion_2;
	/** @type {Number} */dolares_2;
	/** @type {Number} */Valoracion_3;
	/** @type {Number} */dolares_3;
}



export class EtiquetaLote {
	/** @type {String} */ Articulo;
	/** @type {String} */ Tipo;
	/** @type {Number} */ Precio_compra_dolares;
	/** @type {Number} */ Precio_venta_Contado_dolares
	/** @type {Number} */ Precio_venta_Apartado_dolares;
	/** @type {Number} */ Cuota_apartado_quincenal_dolares;
	/** @type {Number} */ Cuota_apartado_mensual_dolares;
	/** @type {Number} */ N_Cuotas;
	/** @type {String} */ Codigo;
	/** @type {Date} */ Enviado_Liquidacion;
	/** @type {Number} */ PorcentajesUtilidad;
	/** @type {Number} */ PorcentajesApartado;
	/** @type {Number} */ PorcentajeAdicional;
	/** @type {Catalogo_Cambio_Divisa} */ TasaCambio;
	/** @type {Number} */ Intereses;
}

