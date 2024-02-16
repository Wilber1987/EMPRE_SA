//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools, BasicStates } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Security_Users_ModelComponent }  from './Security_Users_ModelComponent.js'
class Transaction_Facturas_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ numero_factura = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ abono_de_cuota = { type: 'number' };
   /**@type {ModelProperty}*/ mora = { type: 'number' };
   /**@type {ModelProperty}*/ interes = { type: 'number' };
   /**@type {ModelProperty}*/ total = { type: 'number' };
   /**@type {ModelProperty}*/ numero_contrato = { type: 'number' };
   /**@type {ModelProperty}*/ fecha = { type: 'date' };
   /**@type {ModelProperty}*/ fecha_pago = { type: 'date' };
   /**@type {ModelProperty}*/ inte = { type: 'number' };
   /**@type {ModelProperty}*/ mor = { type: 'number' };
   /**@type {ModelProperty}*/ dm = { type: 'number' };
   /**@type {ModelProperty}*/ es = { type: 'text' };
   /**@type {ModelProperty}*/ tot = { type: 'number' };
   /**@type {ModelProperty}*/ an = { type: 'text' };
   /**@type {ModelProperty}*/ pago_contado = { type: 'number' };
   /**@type {ModelProperty}*/ saldo_monto = { type: 'number' };
   /**@type {ModelProperty}*/ ABONO = { type: 'number' };
   /**@type {ModelProperty}*/ descuento = { type: 'number' };
   /**@type {ModelProperty}*/ fecha_mora = { type: 'date' };
   /**@type {ModelProperty}*/ fecha_interes = { type: 'date' };
   /**@type {ModelProperty}*/ taza_cambio = { type: 'number' };
   /**@type {ModelProperty}*/ interes_actual = { type: 'number' };
   /**@type {ModelProperty}*/ Id_User_OLD = { type: 'number' };
   /**@type {ModelProperty}*/ fecha_grabado = { type: 'date' };
   /**@type {ModelProperty}*/ mes_pagado = { type: 'date' };
   /**@type {ModelProperty}*/ ultima_visita = { type: 'date' };
   /**@type {ModelProperty}*/ dmpagadas = { type: 'number' };
   /**@type {ModelProperty}*/ tipo = { type: 'text' };
   /**@type {ModelProperty}*/ morac = { type: 'number' };
   /**@type {ModelProperty}*/ interesc = { type: 'number' };
   /**@type {ModelProperty}*/ abonoc = { type: 'number' };
   /**@type {ModelProperty}*/ totalc = { type: 'number' };
   /**@type {ModelProperty}*/ parciales = { type: 'number' };
   /**@type {ModelProperty}*/ moraparcial = { type: 'number' };
   /**@type {ModelProperty}*/ interesparcial = { type: 'number' };
   /**@type {ModelProperty}*/ motivo_anulacion = { type: 'text' };
   /**@type {ModelProperty}*/ reestructuraciond = { type: 'number' };
   /**@type {ModelProperty}*/ reestructuracionc = { type: 'number' };
   /**@type {ModelProperty}*/ numero_reestructuracion = { type: 'number' };
   /**@type {ModelProperty}*/ fecha_cancelacion = { type: 'date' };
   /**@type {ModelProperty}*/ docnoentregadod = { type: 'number' };
   /**@type {ModelProperty}*/ docnoentregadoc = { type: 'number' };
   /**@type {ModelProperty}*/ Security_Users = { type: 'WSELECT',  ModelObject: ()=> new Security_Users_ModelComponent()};
}
export { Transaction_Facturas_ModelComponent }
