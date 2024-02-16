//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools, BasicStates } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Security_Users_ModelComponent }  from './Security_Users_ModelComponent.js'
import { Catalogo_Inversores_ModelComponent }  from './Catalogo_Inversores_ModelComponent.js'
class Transaction_Contratos_Inversionistas_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ numero_cont = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ fecha = { type: 'date' };
   /**@type {ModelProperty}*/ taza = { type: 'number' };
   /**@type {ModelProperty}*/ monto_inicial = { type: 'number' };
   /**@type {ModelProperty}*/ nombre_sustituto = { type: 'text' };
   /**@type {ModelProperty}*/ identificacion_sustituto = { type: 'text' };
   /**@type {ModelProperty}*/ direccion_sustituto = { type: 'text' };
   /**@type {ModelProperty}*/ departamento_sus = { type: 'text' };
   /**@type {ModelProperty}*/ municipio_sustituto = { type: 'text' };
   /**@type {ModelProperty}*/ fecha_pago = { type: 'date' };
   /**@type {ModelProperty}*/ fecha_ultimo_pago = { type: 'date' };
   /**@type {ModelProperty}*/ saldo = { type: 'number' };
   /**@type {ModelProperty}*/ montointeres = { type: 'number' };
   /**@type {ModelProperty}*/ interes = { type: 'number' };
   /**@type {ModelProperty}*/ fecha_restructura = { type: 'date' };
   /**@type {ModelProperty}*/ Security_Users = { type: 'WSELECT',  ModelObject: ()=> new Security_Users_ModelComponent()};
   /**@type {ModelProperty}*/ Catalogo_Inversores = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Inversores_ModelComponent()};
}
export { Transaction_Contratos_Inversionistas_ModelComponent }
