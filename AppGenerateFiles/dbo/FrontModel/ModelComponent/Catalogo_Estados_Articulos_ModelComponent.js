//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
class Catalogo_Estados_Articulos_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_estado_articulo = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ nombre = { type: 'text' };
   /**@type {ModelProperty}*/ descripcion = { type: 'text' };
   /**@type {ModelProperty}*/ porcentaje_compra = { type: 'number' };
   /**@type {ModelProperty}*/ porcentaje_empeno = { type: 'number' };
}
export { Catalogo_Estados_Articulos_ModelComponent }
