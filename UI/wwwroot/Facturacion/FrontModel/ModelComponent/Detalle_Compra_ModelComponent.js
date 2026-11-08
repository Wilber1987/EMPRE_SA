//@ts-check
import { EntityClass } from "../../../WDevCore/WModules/EntityClass.js";
// @ts-ignore
import { ModelProperty } from "../../../WDevCore/WModules/CommonModel.js";
import { Detalle_Compra } from "../Detalle_Compra.js";
import { Cat_Producto_ModelComponent } from './Cat_Producto_ModelComponent.js';
import { WForm } from "../../../WDevCore/WComponents/WForm.js";
import { Catalogo_Cambio_Divisa } from "../../../FrontModel/Catalogo_Cambio_Divisa.js";
import { Money } from "../../../WDevCore/WModules/Types/Money.js";
class Detalle_Compra_ModelComponent extends EntityClass {
    /**
     * @param {Partial<Detalle_Compra_ModelComponent>} [props]
     */
    constructor(props) {
        super(props, 'EntityFacturacion');
        Object.assign(this, props);
    }
    /**@type {ModelProperty}*/ Id_Detalle_Compra = { type: 'number', primary: true };
    /**@type {ModelProperty}*/ Cantidad = {
        type: 'number', IsEditableInGrid: true, min: 0,
        action: (/**@type {Detalle_Compra} */ detail, /**@type {WForm} */ form) => {
            console.log(detail);

            this.CalculeTotal(detail, form);
        }
    };
    /**@type {ModelProperty}*/ Precio_Unitario = { type: 'MONEY' };
    /**@type {ModelProperty}*/ SubTotal = {
        type: "OPERATION",
        action: (/**@type {Detalle_Compra} */ detail) => {
            this.CalculeTotal(detail);
            return new Money(detail.Cantidad).multiply(detail.Precio_Unitario);
        }
    };
    /**@type {ModelProperty}*/ Aplica_Iva = { type: 'CHECKBOX', require: false, hiddenInTable: true };
    /**@type {ModelProperty}*/ Iva = {
        type: "OPERATION", disabled: true, label: "Iva Cordobas", hidden: true,
        action: (/**@type {Detalle_Compra} */ detail) => {
            return new Money(detail.Cantidad).multiply(detail.Precio_Unitario);
        }
    };
    /**@type {ModelProperty}*/ Total = {
        type: "OPERATION",
        action: (/**@type {Detalle_Compra} */ detail) => {
            return new Money(detail.Cantidad).multiply(detail.Precio_Unitario);
        }
    };
    /**@type {ModelProperty}*/ Presentacion = {
        type: 'select',
        Dataset: ["UND"] // ["KILATE", "UND", "LBS", "KILO", "DOCENA"]
    };
    /**@type {ModelProperty}*/ Cat_Producto = { type: 'WSELECT', ModelObject: () => new Cat_Producto_ModelComponent() };
    /**@type {ModelProperty}*/ Datos_Producto_Lote = { type: 'Model', ModelObject: () => new BasicDatosCompra(), hiddenInTable: true };

    /**
     * @param {Detalle_Compra} detail
     * @param {WForm} [form]
     */
    CalculeTotal(detail, form) {
        const subtotal = new Money(detail.Cantidad).multiply(detail.Precio_Unitario);
        /** asumiendo que el descuento es negativo */
        detail.SubTotal = subtotal;
        //detail.Monto_Descuento = parseFloat((subtotal * ((detail.Descuento ?? 0) / 100)).toFixed(2));
        detail.Iva = new Money(0) //parseFloat((detail.Sub_Total * 0.15).toFixed(2));
        detail.Total = new Money(detail.SubTotal);
        console.log(detail);



        //form.DrawComponent();
        //console.log(detail);
    }
    /**
    * @returns {Catalogo_Cambio_Divisa}
    */
    GetTasa() {
        return JSON.parse(sessionStorage.getItem("TasasCambio") ?? "{}");
    }
}
export { Detalle_Compra_ModelComponent };
class BasicDatosCompra {
    /**@type {ModelProperty}*/ Model = { type: 'text', require: false };
    /**@type {ModelProperty}*/ Serie = { type: 'text', require: false };
}

