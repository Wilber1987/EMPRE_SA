//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Security_Users }  from './Security_Users.js'
class Transaction_Facturas extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ numero_factura;
   /**@type {Number}*/ abono_de_cuota;
   /**@type {Number}*/ mora;
   /**@type {Number}*/ interes;
   /**@type {Number}*/ total;
   /**@type {Number}*/ numero_contrato;
   /**@type {Date}*/ fecha;
   /**@type {Date}*/ fecha_pago;
   /**@type {Number}*/ inte;
   /**@type {Number}*/ mor;
   /**@type {Number}*/ dm;
   /**@type {String}*/ es;
   /**@type {Number}*/ tot;
   /**@type {String}*/ an;
   /**@type {Number}*/ pago_contado;
   /**@type {Number}*/ saldo_monto;
   /**@type {Number}*/ ABONO;
   /**@type {Number}*/ descuento;
   /**@type {Date}*/ fecha_mora;
   /**@type {Date}*/ fecha_interes;
   /**@type {Number}*/ taza_cambio;
   /**@type {Number}*/ interes_actual;
   /**@type {Number}*/ Id_User_OLD;
   /**@type {Date}*/ fecha_grabado;
   /**@type {Date}*/ mes_pagado;
   /**@type {Date}*/ ultima_visita;
   /**@type {Number}*/ dmpagadas;
   /**@type {String}*/ tipo;
   /**@type {Number}*/ morac;
   /**@type {Number}*/ interesc;
   /**@type {Number}*/ abonoc;
   /**@type {Number}*/ totalc;
   /**@type {Number}*/ parciales;
   /**@type {Number}*/ moraparcial;
   /**@type {Number}*/ interesparcial;
   /**@type {String}*/ motivo_anulacion;
   /**@type {Number}*/ reestructuraciond;
   /**@type {Number}*/ reestructuracionc;
   /**@type {Number}*/ numero_reestructuracion;
   /**@type {Date}*/ fecha_cancelacion;
   /**@type {Number}*/ docnoentregadod;
   /**@type {Number}*/ docnoentregadoc;
   /**@type {Security_Users} ManyToOne*/ Security_Users;
}
export { Transaction_Facturas }
