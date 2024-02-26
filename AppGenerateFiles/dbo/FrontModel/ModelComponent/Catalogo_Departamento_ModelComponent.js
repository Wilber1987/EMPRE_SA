//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Catalogo_Nacionalidad_ModelComponent }  from './Catalogo_Nacionalidad_ModelComponent.js'
class Catalogo_Departamento_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_departamento = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ nombre = { type: 'text' };
   /**@type {ModelProperty}*/ ponderacion = { type: 'number' };
   /**@type {ModelProperty}*/ puntaje = { type: 'number' };
   /**@type {ModelProperty}*/ clasificacion = { type: 'text' };
   /**@type {ModelProperty}*/ Catalogo_Nacionalidad = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Nacionalidad_ModelComponent()};
}
export { Catalogo_Departamento_ModelComponent }
