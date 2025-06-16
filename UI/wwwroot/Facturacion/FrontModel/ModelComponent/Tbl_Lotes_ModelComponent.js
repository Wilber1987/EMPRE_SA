//@ts-check
import { EntityClass } from "../../../WDevCore/WModules/EntityClass.js";
// @ts-ignore
import { ModelProperty } from "../../../WDevCore/WModules/CommonModel.js";
import { Cat_Almacenes_ModelComponent } from './Cat_Almacenes_ModelComponent.js'
import { Detalle_Compra_ModelComponent } from './Detalle_Compra_ModelComponent.js'
class Tbl_Lotes_ModelComponent extends EntityClass {
    constructor(props) {
        super(props, 'TransactionLotes');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    /**@type {ModelProperty}*/ Id_Lote = { type: 'number',   label: "Código" , primary: true};
   
    /**@type {ModelProperty}*/ Id_Producto = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    /**@type {ModelProperty}*/ Id_Almacen = { type: 'number', hiddenInTable: true, hiddenFilter: true };
<<<<<<< HEAD
    /**@type {ModelProperty}*/ Name = { type: 'text' };
    /**@type {ModelProperty}*/ Detalles = { type: 'text' };    
    /**@type {ModelProperty}*/ Lote = { type: 'text', label: "Código" };
    //**@type {ModelProperty}*/ Cat_Producto = { type: 'WSELECT', ModelObject: () => new Cat_Producto_ModelComponent() };
    /**@type {ModelProperty}*/ Cat_Almacenes = { type: 'WSELECT', ModelObject: () => new Cat_Almacenes_ModelComponent() };
=======
    /**@type {ModelProperty}*/ Name = { type: 'text', hiddenFilter: true };
    /**@type {ModelProperty}*/ Detalles = { type: 'text' };    
    /**@type {ModelProperty}*/ Lote = { type: 'text', label: "Identificador" };
    //**@type {ModelProperty}*/ Cat_Producto = { type: 'WSELECT', ModelObject: () => new Cat_Producto_ModelComponent() };
    /**@type {ModelProperty}*/ Cat_Almacenes = { type: 'WSELECT', label: "Almacén",
        ModelObject: () => new Cat_Almacenes_ModelComponent() , hiddenFilter: true};
>>>>>>> main
   
    //**@type {ModelProperty}*/ Precio_Venta = { type: 'Money', hiddenFilter: true };
    //**@type {ModelProperty}*/ Precio_Compra = { type: 'Money', hiddenFilter: true };
    /**@type {ModelProperty}*/ Cantidad_Inicial = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    /**@type {ModelProperty}*/ Cantidad_Existente = { type: 'number', hiddenFilter: true };
    /**@type {ModelProperty}*/ Fecha_Ingreso = { type: 'date', hiddenInTable: true };
    /**@type {ModelProperty}*/ Detalle_Compra = { type: 'WSELECT', ModelObject: () => new Detalle_Compra_ModelComponent(), hiddenInTable: true, hiddenFilter: true };
}
export { Tbl_Lotes_ModelComponent }
