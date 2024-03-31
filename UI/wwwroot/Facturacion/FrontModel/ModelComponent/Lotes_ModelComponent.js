//@ts-check
import { EntityClass } from "../../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../../WDevCore/WModules/WComponentsTools.js";
// @ts-ignore
import { ModelProperty } from "../../../WDevCore/WModules/CommonModel.js";
class Lotes_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityFacturacion');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ Id_Transaccion = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ Descripcion = { type: 'text' };
   /**@type {ModelProperty}*/ Fecha = { type: 'date' };
   /**@type {ModelProperty}*/ Id_Usuario = { type: 'number' };
   /**@type {ModelProperty}*/ Id_Tipo_transaccion = { type: 'number' };
   /**@type {ModelProperty}*/ Estado = { type: 'text' };
}
export { Lotes_ModelComponent }
