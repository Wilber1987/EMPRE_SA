//@ts-check
import { EntityClass } from "../../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../../WDevCore/WModules/WComponentsTools.js";
// @ts-ignore
import { ModelProperty } from "../../../WDevCore/WModules/CommonModel.js";
import { Cat_Almacenes_ModelComponent } from './Cat_Almacenes_ModelComponent.js'
import { Detalle_Compra_ModelComponent } from './Detalle_Compra_ModelComponent.js'
import { Cat_Producto_ModelComponent } from "./Cat_Producto_ModelComponent.js";
class Tbl_Lotes_ModelComponent extends EntityClass {
    constructor(props) {
        super(props, 'EntityFacturacion');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    /**@type {ModelProperty}*/ Id_Lote = { type: 'number', primary: true };
    /**@type {ModelProperty}*/ Lote = { type: 'text' };
    /**@type {ModelProperty}*/ Id_Producto = { type: 'number', hiddenInTable: true};
    /**@type {ModelProperty}*/ Cat_Producto = { type: 'WSELECT', ModelObject: () => new Cat_Producto_ModelComponent() };
    /**@type {ModelProperty}*/ Cat_Almacenes = { type: 'WSELECT', ModelObject: () => new Cat_Almacenes_ModelComponent() };
    /**@type {ModelProperty}*/ Precio_Venta = { type: 'Money' };
    /**@type {ModelProperty}*/ Precio_Compra = { type: 'Money' };
    /**@type {ModelProperty}*/ Cantidad_Inicial = { type: 'number' };
    /**@type {ModelProperty}*/ Cantidad_Existente = { type: 'number'};    
    /**@type {ModelProperty}*/ Fecha_Ingreso = { type: 'date', hiddenInTable: true  };    
    /**@type {ModelProperty}*/ Detalle_Compra = { type: 'WSELECT', ModelObject: () => new Detalle_Compra_ModelComponent(), hiddenInTable: true };
}
export { Tbl_Lotes_ModelComponent }
