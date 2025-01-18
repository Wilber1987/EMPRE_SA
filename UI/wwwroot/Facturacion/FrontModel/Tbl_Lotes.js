//@ts-check
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
   /**@type {String}*/ Detalles;
   /**@type {String}*/ Codigo;
   /**@type {String}*/ Tipo;
   /**@type {Number}*/ Precio_Venta;
   /**@type {Number}*/ Precio_Compra;
   /**@type {Number}*/ Cantidad_Inicial;
   /**@type {Number}*/ Cantidad_Existente;
   /**@type {String}*/ Lote;
   /**@type {Date}*/ Fecha_Ingreso;
   /**@type {Cat_Almacenes} ManyToOne*/ Cat_Almacenes;
   /**@type {Cat_Producto} ManyToOne*/ Cat_Producto;
   /**@type {Transactional_Valoracion}*/ Datos_Producto;
   /**@type {EtiquetaLote} */ EtiquetaLote;
    async DarDeBaja(/**@type {Tbl_Transaccion}*/Transaction) {
        return await this.SaveData("TransactionLotes/DarDeBaja", Transaction)
    }
    /**@type {String}*/  get Nombre() {
        return `${this.Cat_Producto.Descripcion}`;
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
    /** @type {Array} */ Detail_Valores;

    GuardarValoraciones = async (valoraciones) => {
        return await this.SaveData("Transactional_Valoracion/GuardarValoraciones", { valoraciones: valoraciones })
    }
}
export { Transactional_Valoracion }
export class EtiquetaLote {
    /** @type {String} */ Articulo;
    Tipo;
    Precio_compra_dolares;
    Precio_venta_Contado_dolares
    Precio_venta_Apartado_dolares;
    Cuota_apartado_quincenal_dolares;
    Cuota_apartado_mensual_dolares;
    N_Cuotas;
    Codigo;
    Enviado_Liquidacion;
    PorcentajesUtilidad;
    PorcentajesApartado;
    PorcentajeAdicional;
    TasaCambio
    Intereses
}

