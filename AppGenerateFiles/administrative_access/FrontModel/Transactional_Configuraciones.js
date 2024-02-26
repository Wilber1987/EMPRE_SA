//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
class Transactional_Configuraciones extends EntityClass {
   constructor(props) {
       super(props, 'EntityAdministrative_access');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ Id_Configuracion;
   /**@type {String}*/ Nombre;
   /**@type {String}*/ Descripcion;
   /**@type {String}*/ Valor;
   /**@type {String}*/ Tipo_Configuracion;
}
export { Transactional_Configuraciones }
