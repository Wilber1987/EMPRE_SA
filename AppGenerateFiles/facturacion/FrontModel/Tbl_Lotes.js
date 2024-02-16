//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools, BasicStates } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Cat_Almacenes }  from './Cat_Almacenes.js'
import { Detalle_Compra }  from './Detalle_Compra.js'
class Tbl_Lotes extends EntityClass {
   constructor(props) {
       super(props, 'EntityFacturacion');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ Id_Lote;
   /**@type {Number}*/ Id_Producto;
   /**@type {Number}*/ Precio_Venta;
   /**@type {Number}*/ Precio_Compra;
   /**@type {Number}*/ Cantidad_Inicial;
   /**@type {Number}*/ Cantidad_Existente;
   /**@type {Date}*/ Fecha_Ingreso;
   /**@type {Cat_Almacenes} ManyToOne*/ Cat_Almacenes;
   /**@type {Detalle_Compra} ManyToOne*/ Detalle_Compra;
}
export { Tbl_Lotes }
