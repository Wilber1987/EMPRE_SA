//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools, BasicStates } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
class Recibos_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_recibo = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ consecutivo = { type: 'number' };
   /**@type {ModelProperty}*/ temporal = { type: 'checkbox' };
   /**@type {ModelProperty}*/ numero_contrato = { type: 'number' };
   /**@type {ModelProperty}*/ monto = { type: 'number' };
   /**@type {ModelProperty}*/ saldo_actual_cordobas = { type: 'number' };
   /**@type {ModelProperty}*/ saldo_actual_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ plazo = { type: 'number' };
   /**@type {ModelProperty}*/ interes_cargos = { type: 'number' };
   /**@type {ModelProperty}*/ tasa_cambio = { type: 'number' };
   /**@type {ModelProperty}*/ tasa_cambio_compra = { type: 'number' };
   /**@type {ModelProperty}*/ interes_demas_cargos_pagar_cordobas = { type: 'number' };
   /**@type {ModelProperty}*/ interes_demas_cargos_pagar_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ abono_capital_cordobas = { type: 'number' };
   /**@type {ModelProperty}*/ abono_capital_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ cuota_pagar_cordobas = { type: 'number' };
   /**@type {ModelProperty}*/ cuota_pagar_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ mora_cordobas = { type: 'number' };
   /**@type {ModelProperty}*/ mora_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ mora_interes_cordobas = { type: 'number' };
   /**@type {ModelProperty}*/ mora_interes_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ total_cordobas = { type: 'number' };
   /**@type {ModelProperty}*/ total_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ total_parciales = { type: 'number' };
   /**@type {ModelProperty}*/ fecha_roc = { type: 'date' };
   /**@type {ModelProperty}*/ paga_cordobas = { type: 'number' };
   /**@type {ModelProperty}*/ paga_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ solo_abono = { type: 'checkbox' };
   /**@type {ModelProperty}*/ cancelar = { type: 'checkbox' };
}
export { Recibos_ModelComponent }
