//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools, BasicStates } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Catalogo_Municipio_ModelComponent }  from './Catalogo_Municipio_ModelComponent.js'
import { Catalogo_Nacionalidad_ModelComponent }  from './Catalogo_Nacionalidad_ModelComponent.js'
class Catalogo_Inversores_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_inversor = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ nombre = { type: 'text' };
   /**@type {ModelProperty}*/ direccion = { type: 'text' };
   /**@type {ModelProperty}*/ estado_civil = { type: 'text' };
   /**@type {ModelProperty}*/ identificacion = { type: 'text' };
   /**@type {ModelProperty}*/ telefono = { type: 'text' };
   /**@type {ModelProperty}*/ Catalogo_Municipio = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Municipio_ModelComponent()};
   /**@type {ModelProperty}*/ Catalogo_Nacionalidad = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Nacionalidad_ModelComponent()};
}
export { Catalogo_Inversores_ModelComponent }
