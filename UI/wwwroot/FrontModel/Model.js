import { EntityClass } from "../WDevCore/WModules/EntityClass.js";
import { Catalogo_Categoria, Catalogo_Clientes } from "./DBODataBaseModel.js";

//@ts-check
class ValoracionesTransaction extends EntityClass {
    constructor(props) {
        super();
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    /**@type {Number} */
    valoracion_compra_cordobas;
    /**@type {Number} */
    valoracion_compra_dolares;
    /**@type {Number} */
    valoracion_empeño_cordobas;
    /**@type {Number} */
    valoracion_empeño_dolares;
    /**@type {Number} */
    tasas_interes;
    /**@type {Number} */
    taza_interes_cargos;    
    /**@type {Number} */
    cuotafija;
    /**@type {Number} */
    cuotafija_dolares;
    /**@type {Number} */
    gestion_crediticia;
    /**@type {Number} */
    plazo;
    /**@type {Date} */
    fecha;
    /**@type {Catalogo_Clientes} */
    Catalogo_Clientes;
    /**@type {Array<Tbl_Cuotas>} */
    Transaction_Facturas;
    /**@type {Array<Detail_Prendas>} */
    Detail_Prendas;
    /**@type {String} */
    observaciones;


    //?????????????????
    /**@type {Number} */
    monto;

    /**@type {Number} */
    total_pagar_cordobas;
    /**@type {Number} */
    total_pagar_dolares;
    /**@type {Number} */
    interes;
    /**@type {Number} */
    interes_dolares;
    /**@type {Number} cuota del abono*/
    taza_cambio;

    /**@type {Transaction_Contratos} */
    Transaction_Contratos;

    SaveDataContract = async () => {
        await this.SaveData("Transactional_Contrato/SaveDataContract", this)
        return true;
    }
    SaveContract = async () => {
        await this.SaveData("Transactional_Contrato/SaveContract", this)
        return true;
    }
    GetValoracionContrato = async () => {
        return await this.SaveData("Transactional_Contrato/GetDataContract", this)
    }
    VerContrato = async () => {
        return await this.SaveData("PDF/GeneratePdfContract", this)
    }
}
export { ValoracionesTransaction }
class Tbl_Cuotas extends EntityClass {
    /**
     * 
     * @param {Tbl_Cuotas} props 
     */
    constructor(props) {
        super();
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    /**Datos de la Tbl_cuotas*/
    /**@type {Date} */
    fecha;
    /**@type {Number} Tbl_cuotas del abono*/
    total;
    /**@type {Number} valor del interes del capital*/
    interes;
    /**@type {Number} */
    abono_capital;
    /**@type {Number} capital restante*/
    capital_restante;
    /**@type {Number} mora*/
    mora;
    /**DATOS DE LA FATURA */
    /**@type {Date} */
    fecha_pago;
    /**@type {Number} Tbl_cuotas del abono*/
    pago_contado;
    /**@type {Number} Tbl_cuotas del abono*/
    descuento;
    /**@type {Number} Tbl_cuotas del abono*/
    tasa_cambio;

}
export { Tbl_Cuotas }

class Transaction_Contratos extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    numero_contrato;
    fecha_contrato;
    fecha_cancelar;
    /**@type {Number} */
    monto;
    /**@type {Number} */
    interes;
    /**@type {Number} */
    interes_dolares;
    /**@type {Number} */
    mora;
    estado;
    fecha_vencimiento;
    /**@type {Number} */
    saldo;
    dias_mora;
    /**@type {Number} */
    saldo_mora;
    fecha_baja;
    /**@type {Number} */
    abonos;
    ultima_visita;
    tipo;
    entregado;
    /**@type {Number} */
    interes_actual;
    observaciones;
    /**@type {Number} */
    iva;
    /**@type {Number} */
    margen;
    /**@type {Number} */
    descuento;
    /**@type {Number} */
    util;
    /**@type {Number} */
    taza_interes_cargos;
    taza_mora;
    fecha_mora;
    fecha_interes;
    taza_gestion_crediticia;
    Id_User_OLD;
    /**@type {Number} cuota del abono*/
    taza_cambio;
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
    /**@type {Catalogo_Clientes} */
    Catalogo_Clientes;
    /**@type {Array<Tbl_Cuotas>} */
    Tbl_Cuotas;
    /**@type {Array<Transaction_Facturas>} */
    Transaction_Facturas;
    /**@type {Array<Detail_Prendas>} */
    Detail_Prendas;

    //nuevas
    /**@type {Number} */
    valoracion_compra_cordobas;
    /**@type {Number} */
    valoracion_compra_dolares;
    /**@type {Number} */
    valoracion_empeño_cordobas;
    /**@type {Number} */
    valoracion_empeño_dolares;  
    /**@type {Number} */
    taza_interes_cargos;

    /**@type {Number} */
    cuotafija;
    /**@type {Number} */
    cuotafija_dolares;
    /**@type {Number} */
    gestion_crediticia;
    /**@type {Number} */
    plazo;
    /**@type {Date} */
    fecha;



    /**@type {Number} */
    total_pagar_cordobas;
    /**@type {Number} */
    total_pagar_dolares;
   
    
    
}

export { Transaction_Contratos }
class Detail_Prendas extends EntityClass {
    /**
     * 
     * @param {Object} props 
     */
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
            //console.log(this[prop], props[prop]);
        }
    }
    /**@type {Number} */ numero_prenda;
    /**@type {Number} */ numero_contrato_OLD;
    /**@type {Number} */ Descripcion;
    /**@type {Number} */ pprenda;
    /**@type {Number} */ Tipo;
    /**@type {Number} */ marca;
    /**@type {Number} */ serie;
    /**@type {Number} */ modelo;
    /**@type {Number} */ iva;
    /**@type {Number} */ margen;
    /**@type {Number} */ estado;
    /**@type {Number} */ interesl;
    /**@type {Number} */ moral;
    /**@type {Number} */ fliquidacion;
    /**@type {Number} */ precio_venta;
    /**@type {Number} */ en_manos_de;
    /**@type {Number} */ color;
    // /**@type {Number} */ factura;
    // /**@type {Number} */ tipo_movimiento;
    // /**@type {Number} */ uso;
    // /**@type {Number} */ servicio;
    // /**@type {Number} */ v_porcentage_etiqueta;
    /**@type {Number} */ Detail_Prendas_Vehiculos;
    /**@type {Catalogo_Categoria} */ Catalogo_Categoria;
    /**@type {Transactional_Valoracion} */ Transactional_Valoracion;
}
export { Detail_Prendas }
class Detail_Prendas_Vehiculos extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    capacidad_cilindros;
    cantidad_cilindros;
    cantidad_pasajeros;
    year_vehiculo;
    montor;
    chasis;
    placa;
    circuacion;
    defectuoso;
    fecha_aut_descuento;
    defecto;
    porcentage_descuento_maximo;
    fecha_seguro;
    combustible;
    Detail_Prendas;
}
export { Detail_Prendas_Vehiculos }

class Transaction_Facturas extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    numero_factura;
    abono_de_cuota;
    mora;
    interes;
    total;
    fecha;
    fecha_pago;
    pago_contado;
    saldo_monto;
    fecha_mora;
    fecha_interes;
    taza_cambio;
    //interes_actual;
    //Id_User_OLD;
    fecha_grabado;
    mes_pagado;
    ultima_visita;
    dmpagadas;
    tipo;
    morac;
    interesc;
    abonoc;
    totalc;
    parciales;
    moraparcial;
    interesparcial;
    motivo_anulacion;
    Transaction_Contratos;
}
export { Transaction_Facturas }