//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
class Recibos extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ id_recibo;
   /**@type {Number}*/ consecutivo;
   /**@type {Boolean}*/ temporal;
   /**@type {Number}*/ numero_contrato;
   /**@type {Number}*/ monto;
   /**@type {Number}*/ saldo_actual_cordobas;
   /**@type {Number}*/ saldo_actual_dolares;
   /**@type {Number}*/ plazo;
   /**@type {Number}*/ interes_cargos;
   /**@type {Number}*/ tasa_cambio;
   /**@type {Number}*/ tasa_cambio_compra;
   /**@type {Number}*/ interes_demas_cargos_pagar_cordobas;
   /**@type {Number}*/ interes_demas_cargos_pagar_dolares;
   /**@type {Number}*/ abono_capital_cordobas;
   /**@type {Number}*/ abono_capital_dolares;
   /**@type {Number}*/ cuota_pagar_cordobas;
   /**@type {Number}*/ cuota_pagar_dolares;
   /**@type {Number}*/ mora_cordobas;
   /**@type {Number}*/ mora_dolares;
   /**@type {Number}*/ mora_interes_cordobas;
   /**@type {Number}*/ mora_interes_dolares;
   /**@type {Number}*/ total_cordobas;
   /**@type {Number}*/ total_dolares;
   /**@type {Number}*/ total_parciales;
   /**@type {Date}*/ fecha_roc;
   /**@type {Number}*/ paga_cordobas;
   /**@type {Number}*/ paga_dolares;
   /**@type {Boolean}*/ solo_abono;
   /**@type {Boolean}*/ cancelar;
}
export { Recibos }
