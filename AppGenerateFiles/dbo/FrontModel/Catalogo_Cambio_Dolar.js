//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
class Catalogo_Cambio_Dolar extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ id_cambio;
   /**@type {Date}*/ fecha;
   /**@type {Number}*/ valor_de_compra;
   /**@type {Number}*/ valor_de_venta;
}
export { Catalogo_Cambio_Dolar }
