//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools, BasicStates } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Transaction_Contratos }  from './Transaction_Contratos.js'
import { Detalle_Factura_Recibo }  from './Detalle_Factura_Recibo.js'
class Tbl_Cuotas extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ id_cuota;
   /**@type {Date}*/ fecha;
   /**@type {Number}*/ total;
   /**@type {Number}*/ interes;
   /**@type {Number}*/ abono_capital;
   /**@type {Number}*/ capital_restante;
   /**@type {Date}*/ fecha_pago;
   /**@type {Number}*/ pago_contado;
   /**@type {Number}*/ descuento;
   /**@type {Number}*/ tasa_cambio;
   /**@type {Number}*/ mora;
   /**@type {Transaction_Contratos} ManyToOne*/ Transaction_Contratos;
   /**@type {Array<Detalle_Factura_Recibo>} OneToMany*/ Detalle_Factura_Recibo;
}
export { Tbl_Cuotas }
