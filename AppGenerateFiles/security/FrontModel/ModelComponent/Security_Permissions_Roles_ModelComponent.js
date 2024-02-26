//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Security_Permissions_ModelComponent }  from './Security_Permissions_ModelComponent.js'
import { Security_Roles_ModelComponent }  from './Security_Roles_ModelComponent.js'
class Security_Permissions_Roles_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntitySecurity');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ Estado = { type: 'text' };
   /**@type {ModelProperty}*/ Security_Permissions = { type: 'WSELECT',  ModelObject: ()=> new Security_Permissions_ModelComponent()};
   /**@type {ModelProperty}*/ Security_Roles = { type: 'WSELECT',  ModelObject: ()=> new Security_Roles_ModelComponent()};
}
export { Security_Permissions_Roles_ModelComponent }
