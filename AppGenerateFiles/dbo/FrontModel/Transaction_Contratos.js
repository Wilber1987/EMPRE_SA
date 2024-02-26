//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Catalogo_Clientes }  from './Catalogo_Clientes.js'
import { Detail_Prendas }  from './Detail_Prendas.js'
import { Tbl_Cuotas }  from './Tbl_Cuotas.js'
class Transaction_Contratos extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ numero_contrato;
   /**@type {Date}*/ fecha_contrato;
   /**@type {Date}*/ fecha_cancelar;
   /**@type {Number}*/ monto;
   /**@type {Number}*/ interes;
   /**@type {Number}*/ mora;
   /**@type {String}*/ estado;
   /**@type {Date}*/ fecha_vencimiento;
   /**@type {Number}*/ saldo;
   /**@type {Number}*/ abonos;
   /**@type {String}*/ tipo;
   /**@type {String}*/ observaciones;
   /**@type {Number}*/ iva;
   /**@type {Number}*/ descuento;
   /**@type {Number}*/ taza_cambio;
   /**@type {Number}*/ taza_cambio_compra;
   /**@type {Number}*/ plazo;
   /**@type {Number}*/ cuotafija;
   /**@type {Number}*/ tasa_hoy;
   /**@type {String}*/ motivo_anulacion;
   /**@type {Number}*/ valoracion_compra_dolares;
   /**@type {Number}*/ valoracion_compra_cordobas;
   /**@type {Number}*/ valoracion_empeño_cordobas;
   /**@type {Number}*/ valoracion_empeño_dolares;
   /**@type {Number}*/ tasas_interes;
   /**@type {Number}*/ gestion_crediticia;
   /**@type {Number}*/ cuotafija_dolares;
   /**@type {Date}*/ fecha;
   /**@type {Number}*/ total_pagar_cordobas;
   /**@type {Number}*/ total_pagar_dolares;
   /**@type {Number}*/ interes_dolares;
   /**@type {Number}*/ Id_User;
   /**@type {Number}*/ reestructurado;
   /**@type {Catalogo_Clientes} ManyToOne*/ Catalogo_Clientes;
   /**@type {Array<Detail_Prendas>} OneToMany*/ Detail_Prendas;
   /**@type {Array<Tbl_Cuotas>} OneToMany*/ Tbl_Cuotas;
}
export { Transaction_Contratos }
