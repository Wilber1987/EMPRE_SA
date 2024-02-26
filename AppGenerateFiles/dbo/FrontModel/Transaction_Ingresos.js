//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
class Transaction_Ingresos extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ numero_ingreso;
   /**@type {Number}*/ monto;
   /**@type {Date}*/ fecha;
   /**@type {String}*/ descripcion;
   /**@type {String}*/ nombre;
   /**@type {Number}*/ que;
   /**@type {String}*/ anulado;
   /**@type {String}*/ observaciones;
   /**@type {Number}*/ tzcambio;
   /**@type {Number}*/ total;
   /**@type {Date}*/ fanulado;
}
export { Transaction_Ingresos }
