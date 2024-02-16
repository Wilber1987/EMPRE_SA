//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools, BasicStates } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Cat_Proveedor_ModelComponent }  from './Cat_Proveedor_ModelComponent.js'
import { Detalle_Compra_ModelComponent }  from './Detalle_Compra_ModelComponent.js'
class Tbl_Compra_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityFacturacion');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ Id_Compra = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ DatosCompra = { type: 'text' };
   /**@type {ModelProperty}*/ Fecha = { type: 'date' };
   /**@type {ModelProperty}*/ Tasa_Cambio = { type: 'number' };
   /**@type {ModelProperty}*/ Moneda = { type: 'text' };
   /**@type {ModelProperty}*/ Sub_Total = { type: 'number' };
   /**@type {ModelProperty}*/ Iva = { type: 'number' };
   /**@type {ModelProperty}*/ Total = { type: 'number' };
   /**@type {ModelProperty}*/ Estado = { type: 'text' };
   /**@type {ModelProperty}*/ Cat_Proveedor = { type: 'WSELECT',  ModelObject: ()=> new Cat_Proveedor_ModelComponent()};
   /**@type {ModelProperty}*/ Detalle_Compra = { type: 'MasterDetail',  ModelObject: ()=> new Detalle_Compra_ModelComponent()};
}
export { Tbl_Compra_ModelComponent }
