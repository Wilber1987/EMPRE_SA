//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
class Transaction_Egresos_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ numero_egreso = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ monto = { type: 'number' };
   /**@type {ModelProperty}*/ fecha = { type: 'date' };
   /**@type {ModelProperty}*/ descripcion = { type: 'text' };
   /**@type {ModelProperty}*/ nombre = { type: 'text' };
   /**@type {ModelProperty}*/ banco = { type: 'text' };
   /**@type {ModelProperty}*/ anulado = { type: 'text' };
   /**@type {ModelProperty}*/ observaciones = { type: 'text' };
   /**@type {ModelProperty}*/ tc = { type: 'number' };
   /**@type {ModelProperty}*/ dolar = { type: 'number' };
   /**@type {ModelProperty}*/ fanulado = { type: 'date' };
}
export { Transaction_Egresos_ModelComponent }
