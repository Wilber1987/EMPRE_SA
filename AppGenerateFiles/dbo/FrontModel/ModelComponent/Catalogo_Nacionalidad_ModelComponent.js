//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
class Catalogo_Nacionalidad_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_nacionalidad = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ nombre = { type: 'text' };
   /**@type {ModelProperty}*/ nacionalidad = { type: 'text' };
   /**@type {ModelProperty}*/ ponderacion = { type: 'number' };
   /**@type {ModelProperty}*/ puntaje = { type: 'number' };
   /**@type {ModelProperty}*/ clasificacion = { type: 'text' };
}
export { Catalogo_Nacionalidad_ModelComponent }
