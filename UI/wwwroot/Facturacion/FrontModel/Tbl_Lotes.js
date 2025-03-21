//@ts-check
import { Catalogo_Cambio_Divisa } from "../../FrontModel/Catalogo_Cambio_Divisa.js";
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { Cat_Almacenes } from './Cat_Almacenes.js';
import { Cat_Producto } from "./Cat_Producto.js";
import { Detalle_Compra } from './Detalle_Compra.js';
import { Tbl_Transaccion } from "./Tbl_Transaction.js";
class Tbl_Lotes extends EntityClass {

	constructor(props) {
		super(props, 'EntityFacturacion');
		for (const prop in props) {
			this[prop] = props[prop];
		}
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
	async DarDeBaja(/**@type {Tbl_Transaccion}*/Transaction) {
		return await this.SaveData("TransactionLotes/DarDeBaja", Transaction)
	}
	/**@type {String}*/  get Descripcion() {
		return `${this.Detalle_Compra.Cat_Producto.Descripcion}`;
	}
}
export { Tbl_Lotes };
class Transactional_Valoracion extends EntityClass {
	/**
	 * 
	 * @param {Partial<Transactional_Valoracion>} props 
	 */
	constructor(props) {
		super(props, 'EntityDBO');
		for (const prop in props) {
			this[prop] = props[prop];
		}
	}
	/** @type {Number} */ id_valoracion;
	/** @type {String} */ Descripcion;
	/** @type {String} */ Serie;
	/** @type {String} */ Marca;
	/** @type {String} */ Modelo;
	/** @type {Object} */ Catalogo_Categoria;
	/** @type {Number} */ Plazo;
	/** @type {Number} */ Tasa_interes;
	/** @type {Date} */ Fecha;
	/** @type {Number} */ Tasa_de_cambio;
	/** @type {Number} */ Valoracion_compra_cordobas;
	/** @type {Number} */ Valoracion_compra_dolares;
	/** @type {Number} */ Valoracion_empeño_cordobas;
	/** @type {Number} */ Valoracion_empeño_dolares;
	/** @type {Object} */ Catalogo_Estados_Articulos;
	/** @type {Number} */ Precio_venta_empeño_cordobas;
	/** @type {Number} */ Precio_venta_empeño_dolares;
	/** @type {Detail_Valores} */
	Detail_Valores;

	GuardarValoraciones = async (valoraciones) => {
		return await this.SaveData("Transactional_Valoracion/GuardarValoraciones", { valoraciones: valoraciones })
	}
}
class Detail_Valores {
	/** @type {Number} */Valoracion_1;
	/** @type {Number} */dolares_1;
	/** @type {Number} */Valoracion_2;
	/** @type {Number} */dolares_2;
	/** @type {Number} */Valoracion_3;
	/** @type {Number} */dolares_3;
}
export { Transactional_Valoracion }
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

