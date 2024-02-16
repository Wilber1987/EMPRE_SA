//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools, BasicStates } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Catalogo_Sucursales_ModelComponent }  from './Catalogo_Sucursales_ModelComponent.js'
class Datos_Configuracion_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ Encabezado = { type: 'text' };
   /**@type {ModelProperty}*/ AutoDebito = { type: 'checkbox' };
   /**@type {ModelProperty}*/ Catalogo_Sucursales = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Sucursales_ModelComponent()};
}
export { Datos_Configuracion_ModelComponent }
