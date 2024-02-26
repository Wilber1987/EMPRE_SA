//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Catalogo_Cuentas_ModelComponent }  from './Catalogo_Cuentas_ModelComponent.js'
import { Catalogo_Tipo_Transaccion_ModelComponent }  from './Catalogo_Tipo_Transaccion_ModelComponent.js'
class Transaction_Ingresos_Egresos_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_transaccion = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ monto_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ tasa_cambio = { type: 'number' };
   /**@type {ModelProperty}*/ monto_total = { type: 'number' };
   /**@type {ModelProperty}*/ descripcion = { type: 'text' };
   /**@type {ModelProperty}*/ nombre = { type: 'text' };
   /**@type {ModelProperty}*/ que = { type: 'number' };
   /**@type {ModelProperty}*/ fecha_anulado = { type: 'date' };
   /**@type {ModelProperty}*/ banco = { type: 'text' };
   /**@type {ModelProperty}*/ estado = { type: 'text' };
   /**@type {ModelProperty}*/ numero_original = { type: 'number' };
   /**@type {ModelProperty}*/ fecha = { type: 'date' };
   /**@type {ModelProperty}*/ Catalogo_Cuentas = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Cuentas_ModelComponent()};
   /**@type {ModelProperty}*/ Catalogo_Tipo_Transaccion = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Tipo_Transaccion_ModelComponent()};
}
export { Transaction_Ingresos_Egresos_ModelComponent }
