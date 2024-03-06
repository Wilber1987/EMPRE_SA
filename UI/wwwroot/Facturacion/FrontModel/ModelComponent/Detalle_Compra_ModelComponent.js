//@ts-check
import { EntityClass } from "../../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../../WDevCore/WModules/CommonModel.js";
import { Cat_Producto_ModelComponent }  from './Cat_Producto_ModelComponent.js'
import { Tbl_Compra_ModelComponent }  from './Tbl_Compra_ModelComponent.js'
import { Tbl_Lotes_ModelComponent }  from './Tbl_Lotes_ModelComponent.js'
class Detalle_Compra_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityFacturacion');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ Id_Detalle_Compra = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ Cantidad = { type: 'number' };
   /**@type {ModelProperty}*/ Precio_Unitario = { type: 'number' };
   /**@type {ModelProperty}*/ Total = { type: 'number' };
   /**@type {ModelProperty}*/ Presentacion = { type: 'text' };
   /**@type {ModelProperty}*/ Cat_Producto = { type: 'WSELECT',  ModelObject: ()=> new Cat_Producto_ModelComponent(), require: false};
   ///**@type {ModelProperty}*/ Tbl_Compra = { type: 'WSELECT',  ModelObject: ()=> new Tbl_Compra_ModelComponent()};
   ///**@type {ModelProperty}*/ Tbl_Lotes = { type: 'MasterDetail',  ModelObject: ()=> new Tbl_Lotes_ModelComponent()};
}
export { Detalle_Compra_ModelComponent }
