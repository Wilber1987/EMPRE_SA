//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Tbl_Cuotas_ModelComponent }  from './Tbl_Cuotas_ModelComponent.js'
import { Transaccion_Factura_ModelComponent }  from './Transaccion_Factura_ModelComponent.js'
class Detalle_Factura_Recibo_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ total_cuota = { type: 'number' };
   /**@type {ModelProperty}*/ monto_pagado = { type: 'number' };
   /**@type {ModelProperty}*/ capital_restante = { type: 'number' };
   /**@type {ModelProperty}*/ concepto = { type: 'text' };
   /**@type {ModelProperty}*/ tasa_cambio = { type: 'number' };
   /**@type {ModelProperty}*/ Tbl_Cuotas = { type: 'WSELECT',  ModelObject: ()=> new Tbl_Cuotas_ModelComponent()};
   /**@type {ModelProperty}*/ Transaccion_Factura = { type: 'WSELECT',  ModelObject: ()=> new Transaccion_Factura_ModelComponent()};
}
export { Detalle_Factura_Recibo_ModelComponent }
