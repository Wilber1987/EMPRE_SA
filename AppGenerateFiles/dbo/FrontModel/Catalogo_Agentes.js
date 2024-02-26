//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Catalogo_Tipo_Agente }  from './Catalogo_Tipo_Agente.js'
import { Security_Users }  from './Security_Users.js'
class Catalogo_Agentes extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ id_agente;
   /**@type {String}*/ identificacion;
   /**@type {String}*/ nombre;
   /**@type {String}*/ telefono;
   /**@type {String}*/ direccion;
   /**@type {Date}*/ fecha;
   /**@type {String}*/ Estado;
   /**@type {Catalogo_Tipo_Agente} ManyToOne*/ Catalogo_Tipo_Agente;
   /**@type {Array<Security_Users>} OneToMany*/ Security_Users;
}
export { Catalogo_Agentes }
