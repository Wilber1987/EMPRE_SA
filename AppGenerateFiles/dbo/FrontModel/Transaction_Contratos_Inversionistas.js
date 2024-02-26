//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Security_Users }  from './Security_Users.js'
import { Catalogo_Inversores }  from './Catalogo_Inversores.js'
class Transaction_Contratos_Inversionistas extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ numero_cont;
   /**@type {Date}*/ fecha;
   /**@type {Number}*/ taza;
   /**@type {Number}*/ monto_inicial;
   /**@type {String}*/ nombre_sustituto;
   /**@type {String}*/ identificacion_sustituto;
   /**@type {String}*/ direccion_sustituto;
   /**@type {String}*/ departamento_sus;
   /**@type {String}*/ municipio_sustituto;
   /**@type {Date}*/ fecha_pago;
   /**@type {Date}*/ fecha_ultimo_pago;
   /**@type {Number}*/ saldo;
   /**@type {Number}*/ montointeres;
   /**@type {Number}*/ interes;
   /**@type {Date}*/ fecha_restructura;
   /**@type {Security_Users} ManyToOne*/ Security_Users;
   /**@type {Catalogo_Inversores} ManyToOne*/ Catalogo_Inversores;
}
export { Transaction_Contratos_Inversionistas }
