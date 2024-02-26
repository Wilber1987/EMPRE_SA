//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Catalogo_Agentes }  from './Catalogo_Agentes.js'
class Catalogo_Tipo_Agente extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ Id_Tipo_Agente;
   /**@type {String}*/ Descripcion;
   /**@type {String}*/ Estado;
   /**@type {Array<Catalogo_Agentes>} OneToMany*/ Catalogo_Agentes;
}
export { Catalogo_Tipo_Agente }
