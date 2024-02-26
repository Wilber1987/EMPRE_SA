//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Detail_Prendas }  from './Detail_Prendas.js'
import { Transactional_Valoracion }  from './Transactional_Valoracion.js'
class Catalogo_Categoria extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ id_categoria;
   /**@type {String}*/ tipo;
   /**@type {String}*/ descripcion;
   /**@type {Number}*/ plazo_limite;
   /**@type {Number}*/ prioridad;
   /**@type {Boolean}*/ isEditable;
   /**@type {Array<Detail_Prendas>} OneToMany*/ Detail_Prendas;
   /**@type {Array<Transactional_Valoracion>} OneToMany*/ Transactional_Valoracion;
}
export { Catalogo_Categoria }
