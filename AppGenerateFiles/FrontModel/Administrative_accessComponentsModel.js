import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools, BasicStates } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
class Transactional_Configuraciones_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityAdministrative_access');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ Id_Configuracion = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ Nombre = { type: 'text' };
   /**@type {ModelProperty}*/ Descripcion = { type: 'text' };
   /**@type {ModelProperty}*/ Valor = { type: 'text' };
   /**@type {ModelProperty}*/ Tipo_Configuracion = { type: 'text' };
}
export { Transactional_Configuraciones_ModelComponent }
