//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Security_Permissions_Roles }  from './Security_Permissions_Roles.js'
class Security_Permissions extends EntityClass {
   constructor(props) {
       super(props, 'EntitySecurity');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ Id_Permission;
   /**@type {String}*/ Descripcion;
   /**@type {String}*/ Estado;
   /**@type {Array<Security_Permissions_Roles>} OneToMany*/ Security_Permissions_Roles;
}
export { Security_Permissions }
