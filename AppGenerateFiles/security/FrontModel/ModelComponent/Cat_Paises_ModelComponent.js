//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
class Cat_Paises_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntitySecurity');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ Id_Pais = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ Estado = { type: 'text' };
   /**@type {ModelProperty}*/ Descripcion = { type: 'text' };
}
export { Cat_Paises_ModelComponent }
