//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Catalogo_Clientes }  from './Catalogo_Clientes.js'
class Catalogo_Clasificacion_Interes extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ id_clasificacion_interes;
   /**@type {String}*/ Descripcion;
   /**@type {String}*/ Estado;
   /**@type {Number}*/ porcentaje;
   /**@type {Array<Catalogo_Clientes>} OneToMany*/ Catalogo_Clientes;
}
export { Catalogo_Clasificacion_Interes }