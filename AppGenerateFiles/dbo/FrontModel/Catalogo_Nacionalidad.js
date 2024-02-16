//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools, BasicStates } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Catalogo_Departamento }  from './Catalogo_Departamento.js'
import { Catalogo_Inversores }  from './Catalogo_Inversores.js'
class Catalogo_Nacionalidad extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ id_nacionalidad;
   /**@type {String}*/ nombre;
   /**@type {String}*/ nacionalidad;
   /**@type {Number}*/ ponderacion;
   /**@type {Number}*/ puntaje;
   /**@type {String}*/ clasificacion;
   /**@type {Array<Catalogo_Departamento>} OneToMany*/ Catalogo_Departamento;
   /**@type {Array<Catalogo_Inversores>} OneToMany*/ Catalogo_Inversores;
}
export { Catalogo_Nacionalidad }
