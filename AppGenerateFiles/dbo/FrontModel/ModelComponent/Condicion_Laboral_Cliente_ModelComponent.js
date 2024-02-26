//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Catalogo_Clientes_ModelComponent }  from './Catalogo_Clientes_ModelComponent.js'
import { Catalogo_Departamento_ModelComponent }  from './Catalogo_Departamento_ModelComponent.js'
import { Catalogo_Municipio_ModelComponent }  from './Catalogo_Municipio_ModelComponent.js'
class Condicion_Laboral_Cliente_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ fecha_ingreso = { type: 'date' };
   /**@type {ModelProperty}*/ ocupacion_cargo = { type: 'text' };
   /**@type {ModelProperty}*/ ingresos_mensuales = { type: 'number' };
   /**@type {ModelProperty}*/ direccion = { type: 'text' };
   /**@type {ModelProperty}*/ nombre_empresa = { type: 'text' };
   /**@type {ModelProperty}*/ Catalogo_Clientes = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Clientes_ModelComponent()};
   /**@type {ModelProperty}*/ Catalogo_Departamento = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Departamento_ModelComponent()};
   /**@type {ModelProperty}*/ Catalogo_Municipio = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Municipio_ModelComponent()};
}
export { Condicion_Laboral_Cliente_ModelComponent }
