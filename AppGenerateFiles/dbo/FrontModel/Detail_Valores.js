//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Transactional_Valoracion }  from './Transactional_Valoracion.js'
class Detail_Valores extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ Valoracion_1;
   /**@type {Number}*/ Valoracion_2;
   /**@type {Number}*/ Valoracion_3;
   /**@type {Number}*/ dolares_1;
   /**@type {Number}*/ dolares_2;
   /**@type {Number}*/ dolares_3;
   /**@type {Transactional_Valoracion} ManyToOne*/ Transactional_Valoracion;
}
export { Detail_Valores }
