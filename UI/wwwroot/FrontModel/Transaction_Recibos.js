//@ts-check
//@ts-ignore
import { ModelProperty } from "../WDevCore/WModules/CommonModel.js";
import {EntityClass} from "../WDevCore/WModules/EntityClass.js";
import { Catalogo_Clientes_ModelComponent } from "./ClientesModel.js";


//<property name="HOTELES_URL" value="https://apinetdemo.grupoiris.net/securityapi/token/web"/>
class Transaccion_Recibos_ModelComponent extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }

    /**@type {ModelProperty}*/ Catalogo_Clientes = {
        type: 'WSELECT',
        ModelObject: () => new Catalogo_Clientes_ModelComponent(),
        ForeignKeyColumn: "id_cliente",
        hiddenInTable: true
    };
    /**@type {ModelProperty}*/ id_factura = {type: "number", primary: true, label: "Número recibo"};
    /**@type {ModelProperty}*/ Consecutivo = {type: "text"};
    /**@type {ModelProperty}*/ tipo = {type: "text", hidden: true};
    /**@type {ModelProperty}*/ concepto = {type: "text", hiddenFilter: true};
    /**@type {ModelProperty}*/ tasa_cambio = {type: "money", label: "tasa_cambio C$", hiddenFilter: true};
    /**@type {ModelProperty}*/ Moneda = {type: "text", label: "Moneda", hiddenFilter: true};
    /**@type {ModelProperty}*/ total = {type: "money", hiddenFilter: true};
    /**@type {ModelProperty}*/ estado = {type: "select", Dataset: ["ANULADO", "ACTIVO"]};
    /**@type {ModelProperty}*/ id_cliente = {type: "number", hidden: true};
    /**@type {ModelProperty}*/ id_sucursal = {type: "number", hidden: true};
    /**@type {ModelProperty}*/ fecha = {type: "date"};
    /**@type {ModelProperty}*/ Detalle_Factura_Recibo = {
        type: 'MasterDetail',
        label: "Detalle recibos",
        ModelObject: () => new Detalle_Factura_Recibo(),
        hiddenFilter: true
    };
    /**@type {ModelProperty}*/ Factura_contrato = {
        type: 'model',
        label: "Datos del contrato al momento del pago",
        ModelObject: () => new Factura_contrato()
    };
    /**@type {Boolean}*/ IsAnulable;
}

class Factura_contrato {
    constructor(props) {
        Object.assign(this, props);
    }

    numero_contrato = {type: "number"};
    cuotas_pendientes = {type: "number"};
    saldo_anterior = {type: "money"};
    saldo_actual = {type: "money"};
    mora = {type: "money"};
    interes_demas_cargos_pagar = {type: "money"};
    abono_capital = {type: "money"};
    total = {type: "money"};
    tasa_cambio = {type: "number"};

}

class Detalle_Factura_Recibo extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }

    id = {type: "number", primary: true};
    id_factura = {type: "number", hidden: true};
    id_cuota = {type: "number", hidden: true};
    concepto = {type: "text"};
    total_cuota = {type: "money"};
    monto_pagado = {type: "money", hidden: true};
    capital_restante = {type: "money", hidden: true};

    tasa_cambio = {type: "money"};
}

export {Detalle_Factura_Recibo};
export {Factura_contrato};
export {Transaccion_Recibos_ModelComponent};