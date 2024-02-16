//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools, BasicStates } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Detalle_Factura_ModelComponent }  from './Detalle_Factura_ModelComponent.js'
class Tbl_Factura_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityFacturacion');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ Id_Factura = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ Tipo = { type: 'text' };
   /**@type {ModelProperty}*/ Concepto = { type: 'text' };
   /**@type {ModelProperty}*/ Serie = { type: 'text' };
   /**@type {ModelProperty}*/ Forma_Pago = { type: 'text' };
   /**@type {ModelProperty}*/ Direccion_Envio = { type: 'text' };
   /**@type {ModelProperty}*/ Id_Cliente = { type: 'number' };
   /**@type {ModelProperty}*/ Id_Sucursal = { type: 'number' };
   /**@type {ModelProperty}*/ Fecha = { type: 'date' };
   /**@type {ModelProperty}*/ Fecha_Vencimiento = { type: 'date' };
   /**@type {ModelProperty}*/ Observaciones = { type: 'text' };
   /**@type {ModelProperty}*/ Id_Usuario = { type: 'number' };
   /**@type {ModelProperty}*/ Estado = { type: 'text' };
   /**@type {ModelProperty}*/ Sub_Total = { type: 'number' };
   /**@type {ModelProperty}*/ Iva = { type: 'number' };
   /**@type {ModelProperty}*/ Tasa_Cambio = { type: 'number' };
   /**@type {ModelProperty}*/ Total = { type: 'number' };
   /**@type {ModelProperty}*/ Detalle_Factura = { type: 'MasterDetail',  ModelObject: ()=> new Detalle_Factura_ModelComponent()};
}
export { Tbl_Factura_ModelComponent }
