//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Tbl_Cuotas }  from './Tbl_Cuotas.js'
import { Transaccion_Factura }  from './Transaccion_Factura.js'
class Detalle_Factura_Recibo extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ id;
   /**@type {Number}*/ total_cuota;
   /**@type {Number}*/ monto_pagado;
   /**@type {Number}*/ capital_restante;
   /**@type {String}*/ concepto;
   /**@type {Number}*/ tasa_cambio;
   /**@type {Tbl_Cuotas} ManyToOne*/ Tbl_Cuotas;
   /**@type {Transaccion_Factura} ManyToOne*/ Transaccion_Factura;
}
export { Detalle_Factura_Recibo }
