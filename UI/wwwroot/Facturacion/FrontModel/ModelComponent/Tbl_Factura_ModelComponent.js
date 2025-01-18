//@ts-check
import { EntityClass } from "../../../WDevCore/WModules/EntityClass.js";
// @ts-ignore
import { ModelProperty } from "../../../WDevCore/WModules/CommonModel.js";
import { Detalle_Factura_ModelComponent } from './Detalle_Factura_ModelComponent.js'
import { Catalogo_Clientes } from "../../../ClientModule/FrontModel/Catalogo_Clientes.js";
import { Tbl_Factura } from "../Tbl_Factura.js";
class Tbl_Factura_ModelComponent extends EntityClass {
    constructor(props) {
        super(props, 'EntityFacturacion');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    /**@type {ModelProperty}*/ Id_Factura = { type: 'number', primary: true };
    /**@type {ModelProperty}*/ Cliente = { type: 'wselect', ModelObject: () => new Catalogo_Clientes(), defaultValue: null };
    /**@type {ModelProperty}*/ Tipo = { type: 'select', Dataset: ["VENTA", "APARTADO_MENSUAL", "APARTADO_QUINCENAL"] };
    //**@type {ModelProperty}*/ Concepto = { type: 'textarea' };
    //**@type {ModelProperty}*/ Serie = { type: 'text', hidden: true  };
    /**@type {ModelProperty}*/ Forma_Pago = { type: 'select', Dataset: ["CONTADO"] };
    //**@type {ModelProperty}*/ Direccion_Envio = { type: 'text', hidden: true  };
    /**@type {ModelProperty}*/ Id_Cliente = { type: 'number', hidden: true };
    /**@type {ModelProperty}*/ Id_Sucursal = { type: 'number', hidden: true };
    /**@type {ModelProperty}*/ Fecha = { type: 'date', disabled: true };
    /**@type {ModelProperty}*/ Moneda = {
        type: "radio", Dataset: ["DOLARES", "CORDOBAS"],
        action: (/**@type {Tbl_Factura}*/ ObjectF, form) => {
            if (ObjectF.Moneda == "DOLARES") {
                form.ModelObject.monto_dolares.hidden = false;
                form.ModelObject.monto_cordobas.hidden = true;


                form.ModelObject.is_cambio_cordobas.hidden = false;
                ObjectF.is_cambio_cordobas = false;
                form?.DrawComponent();
            } else {
                form.ModelObject.monto_dolares.hidden = true;
                form.ModelObject.monto_cordobas.hidden = false;


                form.ModelObject.is_cambio_cordobas.hidden = true;
                ObjectF.is_cambio_cordobas = false;
                form?.DrawComponent();
            }
        }
    }
    /**@type {ModelProperty}*/ Fecha_Vencimiento = { type: 'date', hidden: true };
    /**@type {ModelProperty}*/ Observaciones = { type: 'textarea', require: false };
    /**@type {ModelProperty}*/ Id_Usuario = { type: 'number', hidden: true };
    /**@type {ModelProperty}*/ Estado = { type: 'text', hidden: true };
    /**@type {ModelProperty}*/ Sub_Total = { type: 'number', hidden: true };
    /**@type {ModelProperty}*/ Iva = { type: 'number', hidden: true };
    /**@type {ModelProperty}*/ Tasa_Cambio = { type: 'number', hidden: true };
    /**@type {ModelProperty}*/ Total = { type: 'number', hidden: true };
    /**@type {ModelProperty}*/ Detalle_Factura = { type: 'MasterDetail', ModelObject: () => new Detalle_Factura_ModelComponent() };
    /**@type {ModelProperty}*/ Datos_de_pago = { type: 'title', label: "Datos de pago", hiddenFilter: true, hiddenInTable: true };
    /**@type {ModelProperty}*/monto_dolares = {
        type: 'MONEY', defaultValue: 0, hiddenFilter: true, hiddenInTable: true, action: (/**@type {Tbl_Factura}*/ ObjectF, form) => {
            ObjectF.monto_cordobas = parseFloat((ObjectF.monto_dolares * ObjectF.Tasa_Cambio).toFixed(3));

            ObjectF.cambio_dolares = parseFloat((ObjectF.monto_dolares - ObjectF.Total).toFixed(3));
            ObjectF.cambio_cordobas = parseFloat((ObjectF.monto_cordobas - ObjectF.Total).toFixed(3));

            if (ObjectF.Moneda == "DOLARES") {
                ObjectF.cambio_cordobas = parseFloat(((ObjectF.monto_dolares - ObjectF.Total) * ObjectF.Tasa_Cambio_Venta).toFixed(3));
            }
            form?.DrawComponent();
        }
    };
    /**@type {ModelProperty}*/monto_cordobas = {
        type: 'MONEY', defaultValue: 0, hiddenFilter: true, hiddenInTable: true, hidden: true, action: (/**@type {Tbl_Factura}*/ ObjectF, form) => {
            //console.log(ObjectF.monto_dolares, ObjectF.Total);
            ObjectF.monto_dolares = parseFloat((ObjectF.monto_cordobas / ObjectF.Tasa_Cambio).toFixed(3));
            ObjectF.cambio_dolares = parseFloat((ObjectF.monto_dolares - ObjectF.Total).toFixed(3));
            ObjectF.cambio_cordobas = parseFloat((ObjectF.monto_cordobas - (ObjectF.Total * ObjectF.Tasa_Cambio)).toFixed(3));
            if (ObjectF.Moneda == "DOLARES") {
                ObjectF.cambio_cordobas = parseFloat(((ObjectF.monto_dolares - ObjectF.Total) * ObjectF.Tasa_Cambio).toFixed(3));
            }
            form?.DrawComponent();
        }
    };
    /**@type {ModelProperty}*/cambio_dolares = {
        type: 'MONEY', disabled: true, require: false, defaultValue: 0, hiddenFilter: true, hiddenInTable: true, action: (/**@type {Tbl_Factura}*/ ObjectF, form) => {
            //console.log(ObjectF.monto_dolares);
            //return ConvertToMoneyString(ObjectF.cambio_dolares = ObjectF.monto_dolares - ObjectF.paga_dolares);
        }
    };
    /**@type {ModelProperty}*/cambio_cordobas = {
        type: 'MONEY', disabled: true, require: false, defaultValue: 0, hiddenFilter: true, hiddenInTable: true, action: (/**@type {Tbl_Factura}*/ ObjectF, form) => {
            //return ConvertToMoneyString(ObjectF.cambio_cordobas = ObjectF.monto_cordobas - (ObjectF.Total * ObjectF.Tasa_Cambio));
        }
    };
    /**@type {ModelProperty} */ is_cambio_cordobas = { type: "checkbox", require: false, hiddenFilter: true, hiddenInTable: true, label: "dar cambio en córdobas", hidden: false };



}
export { Tbl_Factura_ModelComponent }
