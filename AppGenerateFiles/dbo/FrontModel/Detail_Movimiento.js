//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Catalogo_Cuentas }  from './Catalogo_Cuentas.js'
class Detail_Movimiento extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ id_detalle;
   /**@type {Number}*/ id_movimiento;
   /**@type {Number}*/ debito;
   /**@type {Number}*/ credito;
   /**@type {Number}*/ tasa_cambio;
   /**@type {Date}*/ fecha;
   /**@type {Number}*/ debito_dolares;
   /**@type {Number}*/ credito_dolares;
   /**@type {Number}*/ monto_inicial;
   /**@type {Number}*/ monto_final;
   /**@type {Number}*/ monto_inicial_dolares;
   /**@type {Number}*/ monto_final_dolares;
   /**@type {String}*/ moneda;
   /**@type {Number}*/ tasa_cambio_compra;
   /**@type {Catalogo_Cuentas} ManyToOne*/ Catalogo_Cuentas;
}
export { Detail_Movimiento }
