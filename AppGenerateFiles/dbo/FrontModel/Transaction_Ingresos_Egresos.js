//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Catalogo_Cuentas }  from './Catalogo_Cuentas.js'
import { Catalogo_Tipo_Transaccion }  from './Catalogo_Tipo_Transaccion.js'
class Transaction_Ingresos_Egresos extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ id_transaccion;
   /**@type {Number}*/ monto_dolares;
   /**@type {Number}*/ tasa_cambio;
   /**@type {Number}*/ monto_total;
   /**@type {String}*/ descripcion;
   /**@type {String}*/ nombre;
   /**@type {Number}*/ que;
   /**@type {Date}*/ fecha_anulado;
   /**@type {String}*/ banco;
   /**@type {String}*/ estado;
   /**@type {Number}*/ numero_original;
   /**@type {Date}*/ fecha;
   /**@type {Catalogo_Cuentas} ManyToOne*/ Catalogo_Cuentas;
   /**@type {Catalogo_Tipo_Transaccion} ManyToOne*/ Catalogo_Tipo_Transaccion;
}
export { Transaction_Ingresos_Egresos }
