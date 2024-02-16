//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools, BasicStates } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Catalogo_Departamento_ModelComponent }  from './Catalogo_Departamento_ModelComponent.js'
class Catalogo_Municipio_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_municipio = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ nombre = { type: 'text' };
   /**@type {ModelProperty}*/ Catalogo_Departamento = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Departamento_ModelComponent()};
}
export { Catalogo_Municipio_ModelComponent }
