//@ts-check
import { EntityClass } from "../../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../../WDevCore/WModules/CommonModel.js";
import { Cat_Producto_ModelComponent }  from './Cat_Producto_ModelComponent.js'
class Cat_Categorias_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityFacturacion');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ Id_Categoria = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ Descripcion = { type: 'text' };
   /**@type {ModelProperty}*/ Estado = { type: 'text' };
   ///**@type {ModelProperty}*/ Cat_Producto = { type: 'MasterDetail',  ModelObject: ()=> new Cat_Producto_ModelComponent()};
}
export { Cat_Categorias_ModelComponent }