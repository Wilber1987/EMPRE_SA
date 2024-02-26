//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Security_Roles }  from './Security_Roles.js'
import { Security_Users }  from './Security_Users.js'
class Security_Users_Roles extends EntityClass {
   constructor(props) {
       super(props, 'EntitySecurity');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {String}*/ Estado;
   /**@type {Security_Roles} ManyToOne*/ Security_Roles;
   /**@type {Security_Users} ManyToOne*/ Security_Users;
}
export { Security_Users_Roles }
