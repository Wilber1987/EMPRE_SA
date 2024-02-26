//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
class Catalogo_Categoria_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_categoria = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ tipo = { type: 'text' };
   /**@type {ModelProperty}*/ descripcion = { type: 'text' };
   /**@type {ModelProperty}*/ plazo_limite = { type: 'number' };
   /**@type {ModelProperty}*/ prioridad = { type: 'number' };
   /**@type {ModelProperty}*/ isEditable = { type: 'checkbox' };
}
export { Catalogo_Categoria_ModelComponent }
