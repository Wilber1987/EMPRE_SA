import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools, BasicStates } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
class Security_Permissions_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntitySecurity');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ Id_Permission = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ Descripcion = { type: 'text' };
   /**@type {ModelProperty}*/ Estado = { type: 'text' };
   /**@type {ModelProperty}*/ Security_Permissions_Roles = { type: 'MasterDetail',  ModelObject: ()=> new Security_Permissions_Roles_ModelComponent()};
}
export { Security_Permissions_ModelComponent }
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
class Security_Roles_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntitySecurity');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ Id_Role = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ Descripcion = { type: 'text' };
   /**@type {ModelProperty}*/ Estado = { type: 'text' };
   /**@type {ModelProperty}*/ Security_Permissions_Roles = { type: 'MasterDetail',  ModelObject: ()=> new Security_Permissions_Roles_ModelComponent()};
   /**@type {ModelProperty}*/ Security_Users_Roles = { type: 'MasterDetail',  ModelObject: ()=> new Security_Users_Roles_ModelComponent()};
}
export { Security_Roles_ModelComponent }
class Security_Users_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntitySecurity');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ Id_User = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ Nombres = { type: 'text' };
   /**@type {ModelProperty}*/ Estado = { type: 'text' };
   /**@type {ModelProperty}*/ Descripcion = { type: 'text' };
   /**@type {ModelProperty}*/ Password = { type: 'text' };
   /**@type {ModelProperty}*/ Mail = { type: 'text' };
   /**@type {ModelProperty}*/ Token = { type: 'text' };
   /**@type {ModelProperty}*/ Token_Date = { type: 'date' };
   /**@type {ModelProperty}*/ Token_Expiration_Date = { type: 'date' };
   /**@type {ModelProperty}*/ Catalogo_Agentes = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Agentes_ModelComponent()};
   /**@type {ModelProperty}*/ Catalogo_Sucursales = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Sucursales_ModelComponent()};
   /**@type {ModelProperty}*/ Security_Users_Roles = { type: 'MasterDetail',  ModelObject: ()=> new Security_Users_Roles_ModelComponent()};
}
export { Security_Users_ModelComponent }
class Security_Users_Roles_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntitySecurity');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ Estado = { type: 'text' };
   /**@type {ModelProperty}*/ Security_Roles = { type: 'WSELECT',  ModelObject: ()=> new Security_Roles_ModelComponent()};
   /**@type {ModelProperty}*/ Security_Users = { type: 'WSELECT',  ModelObject: ()=> new Security_Users_ModelComponent()};
}
export { Security_Users_Roles_ModelComponent }
