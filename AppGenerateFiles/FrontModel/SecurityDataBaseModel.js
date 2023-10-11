import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools, BasicStates } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
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
class Security_Roles extends EntityClass {
   constructor(props) {
       super(props, 'EntitySecurity');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ Id_Role;
   /**@type {String}*/ Descripcion;
   /**@type {String}*/ Estado;
   /**@type {Array<Security_Permissions_Roles>} OneToMany*/ Security_Permissions_Roles;
   /**@type {Array<Security_Users_Roles>} OneToMany*/ Security_Users_Roles;
}
export { Security_Roles }
class Security_Users extends EntityClass {
   constructor(props) {
       super(props, 'EntitySecurity');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ Id_User;
   /**@type {String}*/ Nombres;
   /**@type {String}*/ Estado;
   /**@type {String}*/ Descripcion;
   /**@type {String}*/ Password;
   /**@type {String}*/ Mail;
   /**@type {String}*/ Token;
   /**@type {Date}*/ Token_Date;
   /**@type {Date}*/ Token_Expiration_Date;
   /**@type {Catalogo_Agentes} ManyToOne*/ Catalogo_Agentes;
   /**@type {Catalogo_Sucursales} ManyToOne*/ Catalogo_Sucursales;
   /**@type {Array<Transaction_Contratos_Inversionistas>} OneToMany*/ Transaction_Contratos_Inversionistas;
   /**@type {Array<Transaction_Contratos_old>} OneToMany*/ Transaction_Contratos_old;
   /**@type {Array<Transaction_Facturas_old>} OneToMany*/ Transaction_Facturas_old;
   /**@type {Array<Security_Users_Roles>} OneToMany*/ Security_Users_Roles;
}
export { Security_Users }
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
