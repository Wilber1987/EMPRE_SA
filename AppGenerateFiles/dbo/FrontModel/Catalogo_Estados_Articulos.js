//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools, BasicStates } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Transactional_Valoracion }  from './Transactional_Valoracion.js'
class Catalogo_Estados_Articulos extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ id_estado_articulo;
   /**@type {String}*/ nombre;
   /**@type {String}*/ descripcion;
   /**@type {Number}*/ porcentaje_compra;
   /**@type {Number}*/ porcentaje_empeno;
   /**@type {Array<Transactional_Valoracion>} OneToMany*/ Transactional_Valoracion;
}
export { Catalogo_Estados_Articulos }
