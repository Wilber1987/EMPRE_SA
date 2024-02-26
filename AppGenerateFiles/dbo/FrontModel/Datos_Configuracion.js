//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Catalogo_Sucursales }  from './Catalogo_Sucursales.js'
class Datos_Configuracion extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {String}*/ Encabezado;
   /**@type {Boolean}*/ AutoDebito;
   /**@type {Catalogo_Sucursales} ManyToOne*/ Catalogo_Sucursales;
}
export { Datos_Configuracion }
