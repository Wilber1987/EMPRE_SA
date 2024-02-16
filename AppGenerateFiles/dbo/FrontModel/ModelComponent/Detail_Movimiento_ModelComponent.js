//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools, BasicStates } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Catalogo_Cuentas_ModelComponent }  from './Catalogo_Cuentas_ModelComponent.js'
class Detail_Movimiento_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_detalle = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ id_movimiento = { type: 'number' };
   /**@type {ModelProperty}*/ debito = { type: 'number' };
   /**@type {ModelProperty}*/ credito = { type: 'number' };
   /**@type {ModelProperty}*/ tasa_cambio = { type: 'number' };
   /**@type {ModelProperty}*/ fecha = { type: 'date' };
   /**@type {ModelProperty}*/ debito_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ credito_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ monto_inicial = { type: 'number' };
   /**@type {ModelProperty}*/ monto_final = { type: 'number' };
   /**@type {ModelProperty}*/ monto_inicial_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ monto_final_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ moneda = { type: 'text' };
   /**@type {ModelProperty}*/ tasa_cambio_compra = { type: 'number' };
   /**@type {ModelProperty}*/ Catalogo_Cuentas = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Cuentas_ModelComponent()};
}
export { Detail_Movimiento_ModelComponent }
