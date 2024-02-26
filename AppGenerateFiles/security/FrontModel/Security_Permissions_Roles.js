//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Security_Permissions }  from './Security_Permissions.js'
import { Security_Roles }  from './Security_Roles.js'
class Security_Permissions_Roles extends EntityClass {
   constructor(props) {
       super(props, 'EntitySecurity');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {String}*/ Estado;
   /**@type {Security_Permissions} ManyToOne*/ Security_Permissions;
   /**@type {Security_Roles} ManyToOne*/ Security_Roles;
}
export { Security_Permissions_Roles }
