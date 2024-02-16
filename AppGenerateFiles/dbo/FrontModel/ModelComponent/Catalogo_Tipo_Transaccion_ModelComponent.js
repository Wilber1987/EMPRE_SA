//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools, BasicStates } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
class Catalogo_Tipo_Transaccion_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_tipo_transaccion = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ descripcion = { type: 'text' };
}
export { Catalogo_Tipo_Transaccion_ModelComponent }
