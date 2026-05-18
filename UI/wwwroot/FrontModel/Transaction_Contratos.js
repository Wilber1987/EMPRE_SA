//@ts-check
import { Catalogo_Clientes } from "../ClientModule/FrontModel/Catalogo_Clientes.js";
import { Catalogo_Clientes_ModelComponent } from "../Facturacion/FrontModel/Catalogo_Clientes.js";
// @ts-ignore
import { ModelProperty } from "../WDevCore/WModules/CommonModel.js";
import { EntityClass } from "../WDevCore/WModules/EntityClass.js";
import { DateTime } from "../WDevCore/WModules/Types/DateTime.js";
import { Detail_Prendas, Detail_Prendas_ModelComponent } from "./Detail_Prendas.js";
import { Transaccion_Recibos } from "./Recibos.js";
import { Tbl_Cuotas, Tbl_Cuotas_ModelComponent } from "./Tbl_Cuotas_ModelComponent.js";
import { Transaccion_Recibos_ModelComponent } from "./Transaction_Recibos.js";

class Notas_de_contrato {
    /** @type {ModelProperty}*/
    Fecha = { type: "date" };
    /**
     * @type {ModelProperty}
     */
    Descripcion = { type: "richtext" };
}

class Transaction_Contratos_ModelComponent extends EntityClass {
    /**
     * @param {Partial<Transaction_Contratos_ModelComponent>} [props]
     */
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }

    /** @type {ModelProperty}*/
    numero_contrato = { type: "number", primary: true };
    /** @type {ModelProperty}*/
    Catalogo_Clientes = { type: 'WSELECT', ModelObject: () => new Catalogo_Clientes_ModelComponent() };
    /** @type {ModelProperty}*/
    fecha_contrato = { type: "date", hiddenFilter: true };
    /** @type {ModelProperty}*/
    fecha_cancelar = { type: "date", hiddenInTable: true, hiddenFilter: true };
    /** @type {ModelProperty}*/
    monto = { type: "MONEY", label: "monto $", hiddenInTable: true, hiddenFilter: true };
    /** @type {ModelProperty}*/
    interes = { type: "MONEY", hiddenInTable: true, hiddenFilter: true, label: "interés $" };
    /** @type {ModelProperty}*/
    mora = { type: "PERCENTAGE", hiddenInTable: true, hiddenFilter: true };
    /** @type {ModelProperty}*/
    estado = { type: "Select", Dataset: ["ACTIVO", "CANCELADO", "ANULADO", "VENCIDO"] };
    /** @type {ModelProperty}*/
    fecha_vencimiento = { type: "date", hiddenFilter: true };
    /** @type {ModelProperty}*/
    codigo_cliente = { type: "number", hiddenInTable: true, hiddenFilter: true };
    /** @type {ModelProperty}*/
    saldo = { type: "MONEY", label: "saldo $", hiddenFilter: true, hiddenInTable: true };
    /** @type {ModelProperty}*/
    abonos = { type: "number", hiddenInTable: true, hiddenFilter: true };
    /** @type {ModelProperty}*/
    tipo = { type: "text", hiddenFilter: true };
    /** @type {ModelProperty}*/
    entregado = { type: "text", hiddenInTable: true, hiddenFilter: true };
    /** @type {ModelProperty}*/
    interes_actual = { type: "number", hiddenInTable: true, hiddenFilter: true };
    /** @type {ModelProperty}*/
    observaciones = { type: "text", hiddenInTable: true, hiddenFilter: true };
    /** @type {ModelProperty}*/
    iva = { type: "MONEY", hiddenInTable: true, hiddenFilter: true };
    /** @type {ModelProperty}*/
    descuento = { type: "MONEY", hiddenInTable: true, hiddenFilter: true };
    /** @type {ModelProperty}*/
    taza_cambio = { type: "MONEY", hiddenInTable: true, hiddenFilter: true, label: "tasa cambio C$" };
    /** @type {ModelProperty}*/
    taza_cambio_compra = { type: "MONEY", hiddenInTable: true, hiddenFilter: true, label: "tasa cambio compra C$" };
    /** @type {ModelProperty}*/
    id_agente = { type: "number", hiddenInTable: true, hiddenFilter: true };
    /** @type {ModelProperty}*/
    plazo = { type: "number", hiddenInTable: true, hiddenFilter: true };
    /** @type {ModelProperty}*/
    cuotafija = { type: "MONEY", hiddenInTable: true, hiddenFilter: true, label: "cuota fija C$" };
    /** @type {ModelProperty}*/
    cuotafija_dolares = { type: "MONEY", hiddenInTable: true, hiddenFilter: true };
    /** @type {ModelProperty}*/
    tasa_hoy = { type: "number", hiddenInTable: true, hiddenFilter: true };
    /** @type {ModelProperty}*/
    motivo_anulacion = { type: "text", hiddenInTable: true, hiddenFilter: true };
    /** @type {ModelProperty}*/
    Valoracion_compra_dolares = { type: "MONEY", hiddenInTable: true, hiddenFilter: true };
    /** @type {ModelProperty}*/
    Valoracion_compra_cordobas = { type: "MONEY", hiddenInTable: true, hiddenFilter: true };
    /** @type {ModelProperty}*/
    Valoracion_empeño_cordobas = { type: "MONEY", hiddenInTable: true, hiddenFilter: true };
    /** @type {ModelProperty}*/
    Valoracion_empeño_dolares = { type: "MONEY", hiddenInTable: true, hiddenFilter: true };
    /** @type {ModelProperty}*/
    tasas_interes = { type: "number", hiddenInTable: true, hiddenFilter: true };
    /** @type {ModelProperty}*/
    gestion_crediticia = { type: "PERCENTAGE", hiddenInTable: true, hiddenFilter: true };

    /** @type {ModelProperty}*/
    fecha = { type: "date", hidden: true, hiddenFilter: true };
    /** @type {ModelProperty}*/
    total_pagar_cordobas = { type: "MONEY", hiddenInTable: true, hiddenFilter: true };
    /** @type {ModelProperty}*/
    total_pagar_dolares = { type: "MONEY", hiddenInTable: true, hiddenFilter: true };
    /** @type {ModelProperty}*/
    //interes_dolares = { type: "MONEY", hiddenInTable: true, hiddenFilter: true };
    /** @type {ModelProperty}*/
    Id_User = { type: "number", hidden: true, hiddenFilter: true };
    /** @type {ModelProperty}*/
    reestructurado = { type: "number", hiddenFilter: true };
    /** @type {ModelProperty}*/
    //Catalogo_Agentes = { type: 'WSELECT', ModelObject: () => new Catalogo_Agentes(), hiddenInTable: true, hiddenFilter: true };
    /** @type {ModelProperty}*/
    Detail_Prendas = { type: 'MasterDetail', ModelObject: () => new Detail_Prendas_ModelComponent(), hiddenFilter: true };
    /** @type {ModelProperty}*/
    Tbl_Cuotas = { type: 'MasterDetail', ModelObject: () => new Tbl_Cuotas_ModelComponent(), hiddenFilter: true };
    /** @type {ModelProperty}*/
    Recibos = { type: 'MasterDetail', ModelObject: () => new Transaction_Contratos_ModelComponent(), hiddenFilter: true };
    /** @type {ModelProperty}*/
    Notas = { type: 'MasterDetail', ModelObject: () => new Notas_de_contrato(), hiddenFilter: true };
}

export { Transaction_Contratos_ModelComponent };
export { Notas_de_contrato };

class Transaction_Contratos extends EntityClass {
    /**
     * @param {Partial<Transaction_Contratos>} [props]
     */
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
        this.Tbl_Cuotas = this.Tbl_Cuotas?.map(c => new Tbl_Cuotas(c));
    }

    /**@type {Number} */numero_contrato;
    /**@type {Date} */fecha_contrato;
    /**@type {Date} */fecha_cancelar;
    /**@type {Number} */ monto;
    /**@type {Number} */ interes;
    /**@type {Number} */ interes_dolares;
    /**@type {Number} */ mora;
    /**@type {Boolean}*/ IsAnulable;
    estado;
    fecha_vencimiento;
    /**@type {Number} */ saldo;
    dias_mora;
    /**@type {Number} */ saldo_mora;
    fecha_baja;
    /**@type {Number} */ abonos;
    ultima_visita;
    tipo;
    entregado;
    /**@type {Number} */ interes_actual;
    observaciones;
    /**@type {Number} */ iva;
    /**@type {Number} */ margen;
    /**@type {Number} */ descuento;
    /**@type {Number} */ util;
    /**@type {Number} */ taza_interes_cargos;
    taza_mora;
    fecha_mora;
    fecha_interes;
    taza_gestion_crediticia;
    Id_User_OLD;
    /**@type {Number} */ taza_cambio;
    taza_cambio_compra;
    dkm;
    gasolinamonto;
    valorcad;
    montocuotaatrazadas;
    mes_pagado;
    tasa_hoy;
    numero_protocolo;
    valor_dolar;
    parciales;
    mora_parcial;
    interes_parcial;
    motivo_anulacion;
    idcatemp;
    cuota_fija_inicial;
    fecha_cancelar_inicial;
    plazo_inicial;
    dias_para_baja;
    codigo_cliente;
    /**@type {Catalogo_Clientes} */ Catalogo_Clientes;
    /**@type {Array<Tbl_Cuotas>} */ Tbl_Cuotas;
    /**@type {Array<Transaccion_Recibos>} */ Transaction_Facturas;
    /**@type {Array<Detail_Prendas>} */ Detail_Prendas;
    //nuevas
    /**@type {Number} */ Valoracion_compra_cordobas;
    /**@type {Number} */ Valoracion_compra_dolares;
    /**@type {Number} */ Valoracion_empeño_cordobas;
    /**@type {Number} */ Valoracion_empeño_dolares;
    /**@type {Number} */ taza_interes_cargos;

    /**@type {Number} */ cuotafija;
    /**@type {Number} */ cuotafija_dolares;
    /**@type {Number} */ gestion_crediticia;
    /**@type {Number} */ tasas_interes;
    /**@type {Number} */ plazo;
    /**@type {DateTime} */ fecha;
    /**@type {Number} */ total_pagar_cordobas;
    /**@type {Number} */ total_pagar_dolares;
    /**@type {Number} */ reestructurado;
    /**@type {Array<Transaccion_Recibos_ModelComponent>} */ Recibos;
    Anular = async () => {
        return await this.SaveData("Transactional_Contrato/AnularContract", this)
    }

}

export { Transaction_Contratos };