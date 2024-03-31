//@ts-check
import { EntityClass } from "../../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../../WDevCore/WModules/WComponentsTools.js";
// @ts-ignore
import { ModelProperty } from "../../../WDevCore/WModules/CommonModel.js";
import { Tbl_Factura_ModelComponent }  from './Tbl_Factura_ModelComponent.js'
import { Cat_Producto_ModelComponent }  from './Cat_Producto_ModelComponent.js'
class Detalle_Factura_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityFacturacion');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ Id_DetalleFactura = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ Cantidad = { type: 'number' };
   /**@type {ModelProperty}*/ Precio_Venta = { type: 'number' };
   /**@type {ModelProperty}*/ Iva = { type: 'number' };
   /**@type {ModelProperty}*/ Total = { type: 'number' };
   /**@type {ModelProperty}*/ Id_Lote = { type: 'number' };
   /**@type {ModelProperty}*/ Descuento = { type: 'number' };
   /**@type {ModelProperty}*/ Sub_Total = { type: 'number' };
   /**@type {ModelProperty}*/ Tbl_Factura = { type: 'WSELECT',  ModelObject: ()=> new Tbl_Factura_ModelComponent()};
   /**@type {ModelProperty}*/ Cat_Producto = { type: 'WSELECT',  ModelObject: ()=> new Cat_Producto_ModelComponent()};
}
export { Detalle_Factura_ModelComponent }
