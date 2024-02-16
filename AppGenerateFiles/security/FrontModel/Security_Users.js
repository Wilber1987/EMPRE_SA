//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools, BasicStates } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Catalogo_Agentes }  from './Catalogo_Agentes.js'
import { Catalogo_Sucursales }  from './Catalogo_Sucursales.js'
import { Transaction_Contratos_Inversionistas }  from './Transaction_Contratos_Inversionistas.js'
import { Transaction_Facturas }  from './Transaction_Facturas.js'
import { Security_Users_Roles }  from './Security_Users_Roles.js'
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
   /**@type {Array<Transaction_Facturas>} OneToMany*/ Transaction_Facturas;
   /**@type {Array<Security_Users_Roles>} OneToMany*/ Security_Users_Roles;
}
export { Security_Users }
