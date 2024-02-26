//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Detalle_Factura_Recibo }  from './Detalle_Factura_Recibo.js'
class Transaccion_Factura extends EntityClass {
   constructor(props) {
       super(props, 'EntityFacturacion');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ id_factura;
   /**@type {String}*/ tipo;
   /**@type {String}*/ concepto;
   /**@type {Number}*/ tasa_cambio;
   /**@type {Number}*/ total;
   /**@type {Number}*/ id_cliente;
   /**@type {Number}*/ id_sucursal;
   /**@type {Date}*/ fecha;
   /**@type {Number}*/ id_usuario;
   /**@type {String}*/ Factura_contrato;
   /**@type {String}*/ estado;
   /**@type {String}*/ no_factura;
   /**@type {Number}*/ subtotal;
   /**@type {Number}*/ iva;
   /**@type {Array<Detalle_Factura_Recibo>} OneToMany*/ Detalle_Factura_Recibo;
}
export { Transaccion_Factura }
