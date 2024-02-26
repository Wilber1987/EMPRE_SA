//@ts-check
import { EntityClass } from "../../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../../WDevCore/WModules/CommonModel.js";
import { Detalle_Factura_Recibo_ModelComponent }  from './Detalle_Factura_Recibo_ModelComponent.js'
class Transaccion_Factura_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityFacturacion');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_factura = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ tipo = { type: 'text' };
   /**@type {ModelProperty}*/ concepto = { type: 'text' };
   /**@type {ModelProperty}*/ tasa_cambio = { type: 'number' };
   /**@type {ModelProperty}*/ total = { type: 'number' };
   /**@type {ModelProperty}*/ id_cliente = { type: 'number' };
   /**@type {ModelProperty}*/ id_sucursal = { type: 'number' };
   /**@type {ModelProperty}*/ fecha = { type: 'date' };
   /**@type {ModelProperty}*/ id_usuario = { type: 'number' };
   /**@type {ModelProperty}*/ Factura_contrato = { type: 'text' };
   /**@type {ModelProperty}*/ estado = { type: 'text' };
   /**@type {ModelProperty}*/ no_factura = { type: 'text' };
   /**@type {ModelProperty}*/ subtotal = { type: 'number' };
   /**@type {ModelProperty}*/ iva = { type: 'number' };
   /**@type {ModelProperty}*/ Detalle_Factura_Recibo = { type: 'MasterDetail',  ModelObject: ()=> new Detalle_Factura_Recibo_ModelComponent()};
}
export { Transaccion_Factura_ModelComponent }
