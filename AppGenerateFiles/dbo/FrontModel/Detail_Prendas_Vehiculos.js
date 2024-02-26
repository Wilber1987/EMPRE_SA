//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Detail_Prendas }  from './Detail_Prendas.js'
class Detail_Prendas_Vehiculos extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {String}*/ capacidad_cilindros;
   /**@type {String}*/ cantidad_cilindros;
   /**@type {String}*/ cantidad_pasajeros;
   /**@type {Number}*/ year_vehiculo;
   /**@type {String}*/ montor;
   /**@type {String}*/ chasis;
   /**@type {String}*/ placa;
   /**@type {String}*/ circuacion;
   /**@type {String}*/ defectuoso;
   /**@type {Date}*/ fecha_aut_descuento;
   /**@type {String}*/ defecto;
   /**@type {Number}*/ porcentage_descuento_maximo;
   /**@type {Date}*/ fecha_seguro;
   /**@type {String}*/ combustible;
   /**@type {String}*/ uso;
   /**@type {String}*/ servicio;
   /**@type {Detail_Prendas} ManyToOne*/ Detail_Prendas;
}
export { Detail_Prendas_Vehiculos }
