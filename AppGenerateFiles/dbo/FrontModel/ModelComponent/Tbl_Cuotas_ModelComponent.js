//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools, BasicStates } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Transaction_Contratos_ModelComponent }  from './Transaction_Contratos_ModelComponent.js'
import { Detalle_Factura_Recibo_ModelComponent }  from './Detalle_Factura_Recibo_ModelComponent.js'
class Tbl_Cuotas_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_cuota = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ fecha = { type: 'date' };
   /**@type {ModelProperty}*/ total = { type: 'number' };
   /**@type {ModelProperty}*/ interes = { type: 'number' };
   /**@type {ModelProperty}*/ abono_capital = { type: 'number' };
   /**@type {ModelProperty}*/ capital_restante = { type: 'number' };
   /**@type {ModelProperty}*/ fecha_pago = { type: 'date' };
   /**@type {ModelProperty}*/ pago_contado = { type: 'number' };
   /**@type {ModelProperty}*/ descuento = { type: 'number' };
   /**@type {ModelProperty}*/ tasa_cambio = { type: 'number' };
   /**@type {ModelProperty}*/ mora = { type: 'number' };
   /**@type {ModelProperty}*/ Transaction_Contratos = { type: 'WSELECT',  ModelObject: ()=> new Transaction_Contratos_ModelComponent()};
   /**@type {ModelProperty}*/ Detalle_Factura_Recibo = { type: 'MasterDetail',  ModelObject: ()=> new Detalle_Factura_Recibo_ModelComponent()};
}
export { Tbl_Cuotas_ModelComponent }
