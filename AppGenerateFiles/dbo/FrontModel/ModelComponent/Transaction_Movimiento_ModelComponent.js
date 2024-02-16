//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools, BasicStates } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
class Transaction_Movimiento_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_movimiento = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ descripcion = { type: 'text' };
   /**@type {ModelProperty}*/ concepto = { type: 'text' };
   /**@type {ModelProperty}*/ id_usuario_crea = { type: 'number' };
   /**@type {ModelProperty}*/ fecha = { type: 'date' };
   /**@type {ModelProperty}*/ tipo = { type: 'text' };
   /**@type {ModelProperty}*/ moneda = { type: 'text' };
   /**@type {ModelProperty}*/ tasa_cambio = { type: 'number' };
   /**@type {ModelProperty}*/ tasa_cambio_compra = { type: 'number' };
   /**@type {ModelProperty}*/ correo_enviado = { type: 'checkbox' };
   /**@type {ModelProperty}*/ is_transaction = { type: 'checkbox' };
}
export { Transaction_Movimiento_ModelComponent }
