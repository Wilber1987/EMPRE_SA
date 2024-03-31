//@ts-check

import { WAjaxTools } from "../../../WDevCore/WModules/WComponentsTools.js";
// @ts-ignore
import { ModelProperty } from "../../../WDevCore/WModules/CommonModel.js";
import { Cat_Proveedor_ModelComponent } from './Cat_Proveedor_ModelComponent.js'
import { Detalle_Compra_ModelComponent } from './Detalle_Compra_ModelComponent.js'
import { EntityClass } from "../../../WDevCore/WModules/EntityClass.js";
class Tbl_Compra_ModelComponent extends EntityClass {
    constructor(props) {
        super(props, 'EntityFacturacion');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {ModelProperty}*/ Id_Compra = { type: 'number', primary: true, hiddenFilter: true };
   /**@type {ModelProperty}*/ Datos_Compra = {
        type: 'Model',
        ModelObject: () => new BasicDatosCompra(), hiddenFilter: true, hiddenInTable: true, require: false
    };
   /**@type {ModelProperty}*/ Fecha = { type: 'date' };
   /**@type {ModelProperty}*/ Tasa_Cambio = { type: 'number', hiddenFilter: true, disabled: true, require: false };
   /**@type {ModelProperty}*/ Sub_Total = { type: 'operation', hiddenFilter: true, hidden: true };
   /**@type {ModelProperty}*/ Iva = { type: 'number', hiddenFilter: true, hidden: true };
   /**@type {ModelProperty}*/ Total = { type: 'number', hiddenFilter: true, hidden: true };
   /**@type {ModelProperty}*/ Estado = { type: 'select', Dataset: ["ACTIVO", "INACTIVO"], hidden: true };
   /**@type {ModelProperty}*/ Cat_Proveedor = { type: 'WSELECT', ModelObject: () => new Cat_Proveedor_ModelComponent() };
   /**@type {ModelProperty}*/ Moneda = { type: "radio", Dataset: ["CORDOBAS", "DOLARES"] };
   /**@type {ModelProperty}*/ Detalle_Compra = { type: 'MasterDetail', ModelObject: () => new Detalle_Compra_ModelComponent() };
}
export { Tbl_Compra_ModelComponent }

class BasicDatosCompra {
     /**@type {ModelProperty}*/ RUC = { type: 'text' };
}