//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Transaction_Ingresos_Egresos }  from './Transaction_Ingresos_Egresos.js'
class Catalogo_Tipo_Transaccion extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ id_tipo_transaccion;
   /**@type {String}*/ descripcion;
   /**@type {Array<Transaction_Ingresos_Egresos>} OneToMany*/ Transaction_Ingresos_Egresos;
}
export { Catalogo_Tipo_Transaccion }
