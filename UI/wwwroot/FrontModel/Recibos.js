import { Catalogo_Clientes } from "../ClientModule/FrontModel/Catalogo_Clientes.js";
import { EntityClass } from "../WDevCore/WModules/EntityClass.js";
class Recibos extends EntityClass {
    constructor(props) {
        super(props, 'Recibos');
        this.monto_dolares = undefined;
        this.monto_cordobas = undefined;
        this.cambio_dolares = undefined;
        this.cambio_cordobas = undefined;
        this.Is_cambio_cordobas = undefined;
        this.pago_parcial = undefined;
        this.reestructurar = undefined;
        this.solo_interes_mora = undefined;
        this.perdida_de_documento_monto = undefined;
        this.fecha_original = undefined;
        Object.assign(this, props);
    }
    /**@type {Number}*/ id_recibo;
    /**@type {Number}*/ consecutivo;
    /**@type {Boolean}*/ temporal;
    /**@type {Number}*/ numero_contrato;
    /**@type {String}*/ moneda;
    /**@type {Number}*/ monto;
    /**@type {Number}*/ saldo_actual_cordobas;
    /**@type {Number}*/ saldo_actual_dolares;
    /**@type {Number}*/ plazo;
    /**@type {Number}*/ interes_cargos;
    /**@type {Number}*/ tasa_cambio;
    /**@type {Number}*/ tasa_cambio_compra;
    /**@type {Number}*/ interes_demas_cargos_pagar_cordobas;
    /**@type {Number}*/ interes_demas_cargos_pagar_dolares;
    /**@type {Number}*/ abono_capital_cordobas;
    /**@type {Number}*/ abono_capital_dolares;
    /**@type {Number}*/ cuota_pagar_cordobas;
    /**@type {Number}*/ cuota_pagar_dolares;
    /**@type {Number}*/ mora_cordobas;
    /**@type {Number}*/ mora_dolares;
    /**@type {Number}*/ mora_interes_cordobas;
    /**@type {Number}*/ mora_interes_dolares;
    /**@type {Number}*/ total_cordobas;
    /**@type {Number}*/ total_dolares;
    /**@type {Number}*/ total_parciales;
    /**@type {Date}*/ fecha_roc;
    /**@type {Number}*/ paga_cordobas;
    /**@type {Number}*/ paga_dolares;
    /**@type {Boolean}*/ solo_abono;
    /**@type {Boolean}*/ cancelar;
}
export { Recibos }

export class Transaccion_Recibos extends EntityClass {
    constructor(props) {
        super(props, 'Transaccion_Recibos');
        Object.assign(this, props);
    }
    /** @type {Number|null} */
    id_factura;
    /** @type {Number|null} */
    numero_contrato;
    /** @type {String|null} */
    tipo;
    /** @type {String|null} */
    concepto;
    /** @type {Number|null} */
    tasa_cambio;
    /** @type {Number|null} */
    total;
    /** @type {Number|null} */
    id_cliente;
    /** @type {Number|null} */
    id_sucursal;
    /** @type {Date|null} */
    fecha;
    /** @type {Number|null} */
    id_usuario;
    /** @type {String|null} */
    estado;
    /** @type {String|null} */
    no_factura;
    /** @type {Number|null} */
    subtotal;
    /** @type {Number|null} */
    iva;
    /** @type {Number|null} */
    total_cordobas;
    /** @type {String|null} */
    Moneda;
    /** @type {String|null} */
    Motivo_Anulacion;
    /** @type {String|null} */
    Consecutivo;    
     /** @type {Boolean} */ 
     IsAnulable;
    /** @type {Factura_contrato|null} */
    Factura_contrato;
    /** @type {Array<Detalle_Factura_Recibo>|null} */
    Detalle_Factura_Recibo;
}
