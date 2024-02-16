//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools, BasicStates } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
class Transaction_Movimiento extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ id_movimiento;
   /**@type {String}*/ descripcion;
   /**@type {String}*/ concepto;
   /**@type {Number}*/ id_usuario_crea;
   /**@type {Date}*/ fecha;
   /**@type {String}*/ tipo;
   /**@type {String}*/ moneda;
   /**@type {Number}*/ tasa_cambio;
   /**@type {Number}*/ tasa_cambio_compra;
   /**@type {Boolean}*/ correo_enviado;
   /**@type {Boolean}*/ is_transaction;
}
export { Transaction_Movimiento }
