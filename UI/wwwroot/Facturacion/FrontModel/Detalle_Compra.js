//@ts-check
import { Transactional_Valoracion } from "../../FrontModel/Transaction_Valoracion.js";
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { Money } from "../../WDevCore/WModules/Types/Money.js";
import { Cat_Producto } from './Cat_Producto.js'
import { Tbl_Compra } from './Tbl_Compra.js'
import { Tbl_Lotes } from './Tbl_Lotes.js'
class Detalle_Compra extends EntityClass {
     /**
     * @param {Partial<Detalle_Compra>} [props]
     */
    constructor(props) {
        super(props, 'EntityFacturacion');
        Object.assign(this, props);;
        /**
         * @type {boolean | undefined}
         */
        this.Aplica_Iva = undefined;
         /**
         * @type {Money?}
         */
        this.Precio_Venta = null;
    }
   /**@type {Money?}*/ Id_Detalle_Compra = null;
   /**@type {Money?}*/ Cantidad = null;
   /**@type {Money?}*/ Precio_Unitario = null;
   /**@type {Money?}*/ SubTotal = null;
   /**@type {Money?}*/ Iva = null;
   /**@type {Money?}*/ Total = null;
   /**@type {String?}*/ Presentacion = null;
   /**@type {Transactional_Valoracion?}*/  Datos_Producto_Lote = null;
   /**@type {Cat_Producto?} ManyToOne*/ Cat_Producto = null;
   /**@type {Tbl_Compra?} ManyToOne*/ Tbl_Compra = null;
   /**@type {Array<Tbl_Lotes>} OneToMany*/ Tbl_Lotes = [];
}
export { Detalle_Compra }
