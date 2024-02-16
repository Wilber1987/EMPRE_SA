//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools, BasicStates } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
class Transaction_Egresos extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ numero_egreso;
   /**@type {Number}*/ monto;
   /**@type {Date}*/ fecha;
   /**@type {String}*/ descripcion;
   /**@type {String}*/ nombre;
   /**@type {String}*/ banco;
   /**@type {String}*/ anulado;
   /**@type {String}*/ observaciones;
   /**@type {Number}*/ tc;
   /**@type {Number}*/ dolar;
   /**@type {Date}*/ fanulado;
}
export { Transaction_Egresos }
