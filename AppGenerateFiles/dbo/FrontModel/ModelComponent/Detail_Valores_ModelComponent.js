//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools, BasicStates } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Transactional_Valoracion_ModelComponent }  from './Transactional_Valoracion_ModelComponent.js'
class Detail_Valores_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ Valoracion_1 = { type: 'number' };
   /**@type {ModelProperty}*/ Valoracion_2 = { type: 'number' };
   /**@type {ModelProperty}*/ Valoracion_3 = { type: 'number' };
   /**@type {ModelProperty}*/ dolares_1 = { type: 'number' };
   /**@type {ModelProperty}*/ dolares_2 = { type: 'number' };
   /**@type {ModelProperty}*/ dolares_3 = { type: 'number' };
   /**@type {ModelProperty}*/ Transactional_Valoracion = { type: 'WSELECT',  ModelObject: ()=> new Transactional_Valoracion_ModelComponent()};
}
export { Detail_Valores_ModelComponent }
