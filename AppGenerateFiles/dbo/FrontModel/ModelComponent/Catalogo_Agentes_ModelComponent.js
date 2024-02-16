//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools, BasicStates } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Catalogo_Tipo_Agente_ModelComponent }  from './Catalogo_Tipo_Agente_ModelComponent.js'
class Catalogo_Agentes_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_agente = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ identificacion = { type: 'text' };
   /**@type {ModelProperty}*/ nombre = { type: 'text' };
   /**@type {ModelProperty}*/ telefono = { type: 'text' };
   /**@type {ModelProperty}*/ direccion = { type: 'text' };
   /**@type {ModelProperty}*/ fecha = { type: 'date' };
   /**@type {ModelProperty}*/ Estado = { type: 'text' };
   /**@type {ModelProperty}*/ Catalogo_Tipo_Agente = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Tipo_Agente_ModelComponent()};
}
export { Catalogo_Agentes_ModelComponent }
