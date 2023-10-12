import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools, BasicStates } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
class Transaction_Ingresos extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ numero_ingreso;
   /**@type {Number}*/ monto;
   /**@type {Date}*/ fecha;
   /**@type {String}*/ descripcion;
   /**@type {String}*/ nombre;
   /**@type {Number}*/ que;
   /**@type {String}*/ anulado;
   /**@type {String}*/ observaciones;
   /**@type {Number}*/ tzcambio;
   /**@type {Number}*/ total;
   /**@type {Date}*/ fanulado;
}
export { Transaction_Ingresos }
class Transaction_Ingresos_Egresos extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ id_transaccion;
   /**@type {Number}*/ monto_dolares;
   /**@type {Number}*/ tasa_cambio;
   /**@type {Number}*/ monto_total;
   /**@type {String}*/ descripcion;
   /**@type {String}*/ nombre;
   /**@type {Number}*/ que;
   /**@type {Date}*/ fecha_anulado;
   /**@type {String}*/ banco;
   /**@type {String}*/ estado;
   /**@type {Number}*/ numero_original;
   /**@type {Date}*/ fecha;
   /**@type {Catalogo_Cuentas} ManyToOne*/ Catalogo_Cuentas;
   /**@type {Catalogo_Tipo_Transaccion} ManyToOne*/ Catalogo_Tipo_Transaccion;
}
export { Transaction_Ingresos_Egresos }
class Transaction_Movimiento extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ id_movimiento;
   /**@type {String}*/ descripcion;
   /**@type {String}*/ concepto;
   /**@type {Number}*/ id_usuario_crea;
   /**@type {Date}*/ fecha;
   /**@type {String}*/ tipo;
   /**@type {String}*/ moneda;
   /**@type {Number}*/ tasa_cambio;
   /**@type {Number}*/ tasa_cambio_compra;
   /**@type {Boolean}*/ correo_enviado;
}
export { Transaction_Movimiento }
class Transactional_Valoracion extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ id_valoracion;
   /**@type {String}*/ Descripcion;
   /**@type {String}*/ Marca;
   /**@type {String}*/ Modelo;
   /**@type {Number}*/ Tasa_interes;
   /**@type {Number}*/ Plazo;
   /**@type {Date}*/ Fecha;
   /**@type {Number}*/ Tasa_de_cambio;
   /**@type {Number}*/ valoracion_compra_cordobas;
   /**@type {Number}*/ valoracion_compra_dolares;
   /**@type {Number}*/ valoracion_empeño_cordobas;
   /**@type {Number}*/ valoracion_empeño_dolares;
   /**@type {String}*/ Serie;
   /**@type {Number}*/ precio_venta_empeño_dolares;
   /**@type {Number}*/ precio_venta_empeño_cordobas;
   /**@type {Catalogo_Categoria} ManyToOne*/ Catalogo_Categoria;
   /**@type {Catalogo_Estados_Articulos} ManyToOne*/ Catalogo_Estados_Articulos;
   /**@type {Array<Detail_Prendas>} OneToMany*/ Detail_Prendas;
   /**@type {Array<Detail_Valores>} OneToMany*/ Detail_Valores;
}
export { Transactional_Valoracion }
class Transaccion_Factura extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ id_factura;
   /**@type {String}*/ tipo;
   /**@type {String}*/ concepto;
   /**@type {Number}*/ tasa_cambio;
   /**@type {Number}*/ total;
   /**@type {Number}*/ id_cliente;
   /**@type {Number}*/ id_sucursal;
   /**@type {Date}*/ fecha;
   /**@type {Number}*/ id_usuario;
   /**@type {String}*/ Factura_contrato;
   /**@type {Array<Detalle_Factura_Recibo>} OneToMany*/ Detalle_Factura_Recibo;
}
export { Transaccion_Factura }
class Detalle_Factura_Recibo extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ id;
   /**@type {Number}*/ total_cuota;
   /**@type {Number}*/ monto_pagado;
   /**@type {Number}*/ capital_restante;
   /**@type {String}*/ concepto;
   /**@type {Number}*/ tasa_cambio;
   /**@type {Transaccion_Factura} ManyToOne*/ Transaccion_Factura;
   /**@type {Tbl_Cuotas} ManyToOne*/ Tbl_Cuotas;
}
export { Detalle_Factura_Recibo }
class Catalogo_Agentes extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ id_agente;
   /**@type {String}*/ identificacion;
   /**@type {String}*/ nombre;
   /**@type {String}*/ telefono;
   /**@type {String}*/ direccion;
   /**@type {Date}*/ fecha;
   /**@type {String}*/ Estado;
   /**@type {Catalogo_Tipo_Agente} ManyToOne*/ Catalogo_Tipo_Agente;
   /**@type {Array<Transaction_Contratos_old>} OneToMany*/ Transaction_Contratos_old;
   /**@type {Array<Security_Users>} OneToMany*/ Security_Users;
}
export { Catalogo_Agentes }
class Recibos extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ id_recibo;
   /**@type {Number}*/ consecutivo;
   /**@type {Boolean}*/ temporal;
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
   /**@type {Transaction_Contratos_old} ManyToOne*/ Transaction_Contratos_old;
}
export { Recibos }
class Catalogo_Cambio_Dolar extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ id_cambio;
   /**@type {Date}*/ fecha;
   /**@type {Number}*/ valor_de_compra;
   /**@type {Number}*/ valor_de_venta;
}
export { Catalogo_Cambio_Dolar }
class Catalogo_Categoria extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ id_categoria;
   /**@type {String}*/ tipo;
   /**@type {String}*/ descripcion;
   /**@type {Number}*/ plazo_limite;
   /**@type {Number}*/ prioridad;
   /**@type {Array<Detail_Prendas>} OneToMany*/ Detail_Prendas;
   /**@type {Array<Transactional_Valoracion>} OneToMany*/ Transactional_Valoracion;
}
export { Catalogo_Categoria }
class Tbl_Cuotas extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ id_cuota;
   /**@type {Date}*/ fecha;
   /**@type {Number}*/ total;
   /**@type {Number}*/ interes;
   /**@type {Number}*/ abono_capital;
   /**@type {Number}*/ capital_restante;
   /**@type {Date}*/ fecha_pago;
   /**@type {Number}*/ pago_contado;
   /**@type {Number}*/ descuento;
   /**@type {Number}*/ tasa_cambio;
   /**@type {Number}*/ mora;
   /**@type {Transaction_Contratos_old} ManyToOne*/ Transaction_Contratos_old;
   /**@type {Array<Detalle_Factura_Recibo>} OneToMany*/ Detalle_Factura_Recibo;
}
export { Tbl_Cuotas }
class Catalogo_Clasificacion_Cliente extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ id_clasificacion;
   /**@type {String}*/ Descripcion;
   /**@type {String}*/ Estado;
   /**@type {Array<Catalogo_Clientes>} OneToMany*/ Catalogo_Clientes;
}
export { Catalogo_Clasificacion_Cliente }
class Catalogo_Clasificacion_Interes extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ id_clasificacion_interes;
   /**@type {String}*/ Descripcion;
   /**@type {String}*/ Estado;
   /**@type {Number}*/ porcentaje;
   /**@type {Array<Catalogo_Clientes>} OneToMany*/ Catalogo_Clientes;
}
export { Catalogo_Clasificacion_Interes }
class Catalogo_Clientes extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ codigo_cliente;
   /**@type {String}*/ primer_nombre;
   /**@type {String}*/ segundo_nombre;
   /**@type {String}*/ primer_apellido;
   /**@type {String}*/ segundo_apellidio;
   /**@type {String}*/ identificacion;
   /**@type {String}*/ sexo;
   /**@type {Date}*/ fecha_nacimiento;
   /**@type {String}*/ correo;
   /**@type {String}*/ telefono;
   /**@type {String}*/ direccion;
   /**@type {String}*/ hora;
   /**@type {Date}*/ fecha;
   /**@type {String}*/ observaciones;
   /**@type {String}*/ estado_civil;
   /**@type {Number}*/ tipoc;
   /**@type {String}*/ tipo_firma;
   /**@type {String}*/ valor_cliente;
   /**@type {String}*/ operadora_celular;
   /**@type {Number}*/ valor_interes;
   /**@type {String}*/ solo_acreedor;
   /**@type {Number}*/ promedio;
   /**@type {Catalogo_Clasificacion_Cliente} ManyToOne*/ Catalogo_Clasificacion_Cliente;
   /**@type {Catalogo_Clasificacion_Interes} ManyToOne*/ Catalogo_Clasificacion_Interes;
   /**@type {Catalogo_Departamento} ManyToOne*/ Catalogo_Departamento;
   /**@type {Catalogo_Municipio} ManyToOne*/ Catalogo_Municipio;
   /**@type {Catalogo_Profesiones} ManyToOne*/ Catalogo_Profesiones;
   /**@type {Catalogo_Tipo_Identificacion} ManyToOne*/ Catalogo_Tipo_Identificacion;
   /**@type {Array<Condicion_Laboral_Cliente>} OneToMany*/ Condicion_Laboral_Cliente;
   /**@type {Array<Transaction_Contratos_old>} OneToMany*/ Transaction_Contratos_old;
}
export { Catalogo_Clientes }
class Catalogo_Cuentas extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ id_cuentas;
   /**@type {String}*/ nombre;
   /**@type {String}*/ tipo_cuenta;
   /**@type {Number}*/ saldo;
   /**@type {Number}*/ saldo_dolares;
   /**@type {Boolean}*/ permite_dolares;
   /**@type {Boolean}*/ permite_cordobas;
   /**@type {Catalogo_Sucursales} ManyToOne*/ Catalogo_Sucursales;
   /**@type {Catalogo_Sucursales} ManyToOne*/ Catalogo_Sucursales;
   /**@type {Categoria_Cuentas} ManyToOne*/ Categoria_Cuentas;
   /**@type {Array<Detail_Movimiento>} OneToMany*/ Detail_Movimiento;
   /**@type {Array<Transaction_Ingresos_Egresos>} OneToMany*/ Transaction_Ingresos_Egresos;
}
export { Catalogo_Cuentas }
class Catalogo_Departamento extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ id_departamento;
   /**@type {String}*/ nombre;
   /**@type {Number}*/ ponderacion;
   /**@type {Number}*/ puntaje;
   /**@type {String}*/ clasificacion;
   /**@type {Catalogo_Nacionalidad} ManyToOne*/ Catalogo_Nacionalidad;
   /**@type {Array<Catalogo_Clientes>} OneToMany*/ Catalogo_Clientes;
   /**@type {Array<Catalogo_Municipio>} OneToMany*/ Catalogo_Municipio;
   /**@type {Array<Condicion_Laboral_Cliente>} OneToMany*/ Condicion_Laboral_Cliente;
}
export { Catalogo_Departamento }
class Catalogo_Estados_Articulos extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ id_estado_articulo;
   /**@type {String}*/ nombre;
   /**@type {String}*/ descripcion;
   /**@type {Number}*/ porcentaje_compra;
   /**@type {Number}*/ porcentaje_empeno;
   /**@type {Array<Transactional_Valoracion>} OneToMany*/ Transactional_Valoracion;
}
export { Catalogo_Estados_Articulos }
class Catalogo_Inversores extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ id_inversor;
   /**@type {String}*/ nombre;
   /**@type {String}*/ direccion;
   /**@type {String}*/ estado_civil;
   /**@type {String}*/ identificacion;
   /**@type {String}*/ telefono;
   /**@type {Catalogo_Municipio} ManyToOne*/ Catalogo_Municipio;
   /**@type {Catalogo_Nacionalidad} ManyToOne*/ Catalogo_Nacionalidad;
   /**@type {Array<Transaction_Contratos_Inversionistas>} OneToMany*/ Transaction_Contratos_Inversionistas;
}
export { Catalogo_Inversores }
class Catalogo_Municipio extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ id_municipio;
   /**@type {String}*/ nombre;
   /**@type {Catalogo_Departamento} ManyToOne*/ Catalogo_Departamento;
   /**@type {Array<Catalogo_Clientes>} OneToMany*/ Catalogo_Clientes;
   /**@type {Array<Catalogo_Inversores>} OneToMany*/ Catalogo_Inversores;
   /**@type {Array<Condicion_Laboral_Cliente>} OneToMany*/ Condicion_Laboral_Cliente;
}
export { Catalogo_Municipio }
class Catalogo_Nacionalidad extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ id_nacionalidad;
   /**@type {String}*/ nombre;
   /**@type {String}*/ nacionalidad;
   /**@type {Number}*/ ponderacion;
   /**@type {Number}*/ puntaje;
   /**@type {String}*/ clasificacion;
   /**@type {Array<Catalogo_Departamento>} OneToMany*/ Catalogo_Departamento;
   /**@type {Array<Catalogo_Inversores>} OneToMany*/ Catalogo_Inversores;
}
export { Catalogo_Nacionalidad }
class Catalogo_Profesiones extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ id_profesion;
   /**@type {String}*/ nombre;
   /**@type {Array<Catalogo_Clientes>} OneToMany*/ Catalogo_Clientes;
}
export { Catalogo_Profesiones }
class Catalogo_Sucursales extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ Id_Sucursal;
   /**@type {String}*/ Nombre;
   /**@type {String}*/ Descripcion;
   /**@type {String}*/ Direccion;
   /**@type {Number}*/ id_municipio;
   /**@type {Array<Catalogo_Cuentas>} OneToMany*/ Catalogo_Cuentas;
   /**@type {Array<Catalogo_Cuentas>} OneToMany*/ Catalogo_Cuentas;
   /**@type {Array<Datos_Configuracion>} OneToMany*/ Datos_Configuracion;
   /**@type {Array<Security_Users>} OneToMany*/ Security_Users;
}
export { Catalogo_Sucursales }
class Transaction_Contratos extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ numero_contrato;
   /**@type {Date}*/ fecha_contrato;
   /**@type {Date}*/ fecha_cancelar;
   /**@type {Number}*/ monto;
   /**@type {Number}*/ interes;
   /**@type {Number}*/ mora;
   /**@type {String}*/ estado;
   /**@type {Date}*/ fecha_vencimiento;
   /**@type {Number}*/ codigo_cliente;
   /**@type {Number}*/ saldo;
   /**@type {Number}*/ abonos;
   /**@type {Number}*/ tipo;
   /**@type {String}*/ entregado;
   /**@type {Number}*/ interes_actual;
   /**@type {String}*/ observaciones;
   /**@type {Number}*/ iva;
   /**@type {Number}*/ descuento;
   /**@type {Number}*/ taza_cambio;
   /**@type {Number}*/ taza_cambio_compra;
   /**@type {Number}*/ id_agente;
   /**@type {Number}*/ plazo;
   /**@type {Number}*/ cuotafija;
   /**@type {Number}*/ tasa_hoy;
   /**@type {String}*/ motivo_anulacion;
   /**@type {Number}*/ valoracion_compra_dolares;
   /**@type {Number}*/ valoracion_compra_cordobas;
   /**@type {Number}*/ valoracion_empeño_cordobas;
   /**@type {Number}*/ valoracion_empeño_dolares;
   /**@type {Number}*/ tasas_interes;
   /**@type {Number}*/ gestion_crediticia;
   /**@type {Number}*/ cuotafija_dolares;
   /**@type {Date}*/ fecha;
   /**@type {Number}*/ total_pagar_cordobas;
   /**@type {Number}*/ total_pagar_dolares;
   /**@type {Number}*/ interes_dolares;
   /**@type {Number}*/ Id_User;
}
export { Transaction_Contratos }
class Catalogo_Tipo_Agente extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ Id_Tipo_Agente;
   /**@type {String}*/ Descripcion;
   /**@type {String}*/ Estado;
   /**@type {Array<Catalogo_Agentes>} OneToMany*/ Catalogo_Agentes;
}
export { Catalogo_Tipo_Agente }
class Catalogo_Tipo_Identificacion extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ id_tipo_identificacion;
   /**@type {String}*/ Descripcion;
   /**@type {String}*/ Estado;
   /**@type {Array<Catalogo_Clientes>} OneToMany*/ Catalogo_Clientes;
}
export { Catalogo_Tipo_Identificacion }
class Catalogo_Tipo_Transaccion extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ id_tipo_transaccion;
   /**@type {String}*/ descripcion;
   /**@type {Array<Transaction_Ingresos_Egresos>} OneToMany*/ Transaction_Ingresos_Egresos;
}
export { Catalogo_Tipo_Transaccion }
class Categoria_Cuentas extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ id_categoria;
   /**@type {String}*/ descripcion;
   /**@type {Array<Catalogo_Cuentas>} OneToMany*/ Catalogo_Cuentas;
   /**@type {Array<Permisos_Cuentas>} OneToMany*/ Permisos_Cuentas;
   /**@type {Array<Permisos_Cuentas>} OneToMany*/ Permisos_Cuentas;
}
export { Categoria_Cuentas }
class Condicion_Laboral_Cliente extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ id;
   /**@type {Date}*/ fecha_ingreso;
   /**@type {String}*/ ocupacion_cargo;
   /**@type {Number}*/ ingresos_mensuales;
   /**@type {String}*/ direccion;
   /**@type {String}*/ nombre_empresa;
   /**@type {Catalogo_Clientes} ManyToOne*/ Catalogo_Clientes;
   /**@type {Catalogo_Departamento} ManyToOne*/ Catalogo_Departamento;
   /**@type {Catalogo_Municipio} ManyToOne*/ Catalogo_Municipio;
}
export { Condicion_Laboral_Cliente }
class Datos_Configuracion extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {String}*/ Encabezado;
   /**@type {Boolean}*/ AutoDebito;
   /**@type {Catalogo_Sucursales} ManyToOne*/ Catalogo_Sucursales;
}
export { Datos_Configuracion }
class Detail_Movimiento extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ id_detalle;
   /**@type {Number}*/ id_movimiento;
   /**@type {Number}*/ debito;
   /**@type {Number}*/ credito;
   /**@type {Number}*/ tasa_cambio;
   /**@type {Date}*/ fecha;
   /**@type {Number}*/ debito_dolares;
   /**@type {Number}*/ credito_dolares;
   /**@type {Number}*/ monto_inicial;
   /**@type {Number}*/ monto_final;
   /**@type {Number}*/ monto_inicial_dolares;
   /**@type {Number}*/ monto_final_dolares;
   /**@type {String}*/ moneda;
   /**@type {Number}*/ tasa_cambio_compra;
   /**@type {Catalogo_Cuentas} ManyToOne*/ Catalogo_Cuentas;
}
export { Detail_Movimiento }
class Detail_Prendas extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ numero_prenda;
   /**@type {Number}*/ numero_contrato_OLD;
   /**@type {String}*/ Descripcion;
   /**@type {Number}*/ pprenda;
   /**@type {String}*/ Tipo;
   /**@type {String}*/ marca;
   /**@type {String}*/ serie;
   /**@type {String}*/ modelo;
   /**@type {String}*/ iva;
   /**@type {String}*/ margen;
   /**@type {String}*/ estado;
   /**@type {Number}*/ interesl;
   /**@type {Number}*/ moral;
   /**@type {Date}*/ fliquidacion;
   /**@type {Number}*/ precio_venta;
   /**@type {String}*/ en_manos_de;
   /**@type {String}*/ color;
   /**@type {String}*/ factura;
   /**@type {String}*/ tipo_movimiento;
   /**@type {String}*/ uso;
   /**@type {String}*/ servicio;
   /**@type {Number}*/ v_porcentage_etiqueta;
   /**@type {Transactional_Valoracion} ManyToOne*/ Transactional_Valoracion;
   /**@type {Catalogo_Categoria} ManyToOne*/ Catalogo_Categoria;
   /**@type {Transaction_Contratos_old} ManyToOne*/ Transaction_Contratos_old;
   /**@type {Array<Detail_Prendas_Vehiculos>} OneToMany*/ Detail_Prendas_Vehiculos;
}
export { Detail_Prendas }
class Detail_Prendas_Vehiculos extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {String}*/ capacidad_cilindros;
   /**@type {String}*/ cantidad_cilindros;
   /**@type {String}*/ cantidad_pasajeros;
   /**@type {Number}*/ year_vehiculo;
   /**@type {String}*/ montor;
   /**@type {String}*/ chasis;
   /**@type {String}*/ placa;
   /**@type {String}*/ circuacion;
   /**@type {String}*/ defectuoso;
   /**@type {Date}*/ fecha_aut_descuento;
   /**@type {String}*/ defecto;
   /**@type {Number}*/ porcentage_descuento_maximo;
   /**@type {Date}*/ fecha_seguro;
   /**@type {String}*/ combustible;
   /**@type {Detail_Prendas} ManyToOne*/ Detail_Prendas;
}
export { Detail_Prendas_Vehiculos }
class Detail_Valores extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ Valoracion_1;
   /**@type {Number}*/ Valoracion_2;
   /**@type {Number}*/ Valoracion_3;
   /**@type {Number}*/ dolares_1;
   /**@type {Number}*/ dolares_2;
   /**@type {Number}*/ dolares_3;
   /**@type {Transactional_Valoracion} ManyToOne*/ Transactional_Valoracion;
}
export { Detail_Valores }
class Permisos_Cuentas extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ id_permiso;
   /**@type {Boolean}*/ permite_debito;
   /**@type {Boolean}*/ permite_credito;
   /**@type {Categoria_Cuentas} ManyToOne*/ Categoria_Cuentas;
   /**@type {Categoria_Cuentas} ManyToOne*/ Categoria_Cuentas;
}
export { Permisos_Cuentas }
class Transaction_Contratos_old extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ numero_contrato;
   /**@type {Date}*/ fecha_contrato;
   /**@type {Date}*/ fecha_cancelar;
   /**@type {Number}*/ monto;
   /**@type {Number}*/ interes;
   /**@type {Number}*/ mora;
   /**@type {String}*/ estado;
   /**@type {Date}*/ fecha_vencimiento;
   /**@type {Number}*/ saldo;
   /**@type {Number}*/ dias_mora;
   /**@type {Number}*/ saldo_mora;
   /**@type {Date}*/ fecha_baja;
   /**@type {Number}*/ abonos;
   /**@type {Date}*/ ultima_visita;
   /**@type {Number}*/ tipo;
   /**@type {String}*/ entregado;
   /**@type {Number}*/ interes_actual;
   /**@type {String}*/ observaciones;
   /**@type {Number}*/ iva;
   /**@type {Number}*/ margen;
   /**@type {Number}*/ interesl;
   /**@type {Number}*/ moral;
   /**@type {Number}*/ descuento;
   /**@type {Number}*/ util;
   /**@type {Number}*/ taza_interes_cargos;
   /**@type {Number}*/ taza_mora;
   /**@type {Date}*/ fecha_mora;
   /**@type {Date}*/ fecha_interes;
   /**@type {Number}*/ taza_gestion_crediticia;
   /**@type {Number}*/ Id_User_OLD;
   /**@type {Number}*/ taza_cambio;
   /**@type {Number}*/ dkm;
   /**@type {Number}*/ gasolinamonto;
   /**@type {Number}*/ valorcad;
   /**@type {Number}*/ plazo;
   /**@type {Number}*/ cuotafija;
   /**@type {Number}*/ montocuotaatrazadas;
   /**@type {Date}*/ mes_pagado;
   /**@type {Number}*/ tasa_hoy;
   /**@type {Number}*/ numero_protocolo;
   /**@type {Number}*/ valor_dolar;
   /**@type {Number}*/ parciales;
   /**@type {Number}*/ mora_parcial;
   /**@type {Number}*/ interes_parcial;
   /**@type {String}*/ motivo_anulacion;
   /**@type {Number}*/ idcatemp;
   /**@type {Number}*/ cuota_fija_inicial;
   /**@type {Date}*/ fecha_cancelar_inicial;
   /**@type {Number}*/ plazo_inicial;
   /**@type {Number}*/ dias_para_baja;
   /**@type {Security_Users} ManyToOne*/ Security_Users;
   /**@type {Catalogo_Agentes} ManyToOne*/ Catalogo_Agentes;
   /**@type {Catalogo_Clientes} ManyToOne*/ Catalogo_Clientes;
   /**@type {Array<Detail_Prendas>} OneToMany*/ Detail_Prendas;
   /**@type {Array<Recibos>} OneToMany*/ Recibos;
   /**@type {Array<Tbl_Cuotas>} OneToMany*/ Tbl_Cuotas;
   /**@type {Array<Transaction_Facturas_old>} OneToMany*/ Transaction_Facturas_old;
}
export { Transaction_Contratos_old }
class Transaction_Contratos_Inversionistas extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ numero_cont;
   /**@type {Date}*/ fecha;
   /**@type {Number}*/ taza;
   /**@type {Number}*/ monto_inicial;
   /**@type {String}*/ nombre_sustituto;
   /**@type {String}*/ identificacion_sustituto;
   /**@type {String}*/ direccion_sustituto;
   /**@type {String}*/ departamento_sus;
   /**@type {String}*/ municipio_sustituto;
   /**@type {Date}*/ fecha_pago;
   /**@type {Date}*/ fecha_ultimo_pago;
   /**@type {Number}*/ saldo;
   /**@type {Number}*/ montointeres;
   /**@type {Number}*/ interes;
   /**@type {Date}*/ fecha_restructura;
   /**@type {Security_Users} ManyToOne*/ Security_Users;
   /**@type {Catalogo_Inversores} ManyToOne*/ Catalogo_Inversores;
}
export { Transaction_Contratos_Inversionistas }
class Transaction_Egresos extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ numero_egreso;
   /**@type {Number}*/ monto;
   /**@type {Date}*/ fecha;
   /**@type {String}*/ descripcion;
   /**@type {String}*/ nombre;
   /**@type {String}*/ banco;
   /**@type {String}*/ anulado;
   /**@type {String}*/ observaciones;
   /**@type {Number}*/ tc;
   /**@type {Number}*/ dolar;
   /**@type {Date}*/ fanulado;
}
export { Transaction_Egresos }
class Transaction_Facturas_old extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ numero_factura;
   /**@type {Number}*/ abono_de_cuota;
   /**@type {Number}*/ mora;
   /**@type {Number}*/ interes;
   /**@type {Number}*/ total;
   /**@type {Date}*/ fecha;
   /**@type {Date}*/ fecha_pago;
   /**@type {Number}*/ inte;
   /**@type {Number}*/ mor;
   /**@type {Number}*/ dm;
   /**@type {String}*/ es;
   /**@type {Number}*/ tot;
   /**@type {String}*/ an;
   /**@type {Number}*/ pago_contado;
   /**@type {Number}*/ saldo_monto;
   /**@type {Number}*/ ABONO;
   /**@type {Number}*/ descuento;
   /**@type {Date}*/ fecha_mora;
   /**@type {Date}*/ fecha_interes;
   /**@type {Number}*/ taza_cambio;
   /**@type {Number}*/ interes_actual;
   /**@type {Number}*/ Id_User_OLD;
   /**@type {Date}*/ fecha_grabado;
   /**@type {Date}*/ mes_pagado;
   /**@type {Date}*/ ultima_visita;
   /**@type {Number}*/ dmpagadas;
   /**@type {String}*/ tipo;
   /**@type {Number}*/ morac;
   /**@type {Number}*/ interesc;
   /**@type {Number}*/ abonoc;
   /**@type {Number}*/ totalc;
   /**@type {Number}*/ parciales;
   /**@type {Number}*/ moraparcial;
   /**@type {Number}*/ interesparcial;
   /**@type {String}*/ motivo_anulacion;
   /**@type {Number}*/ reestructuraciond;
   /**@type {Number}*/ reestructuracionc;
   /**@type {Number}*/ numero_reestructuracion;
   /**@type {Date}*/ fecha_cancelacion;
   /**@type {Number}*/ docnoentregadod;
   /**@type {Number}*/ docnoentregadoc;
   /**@type {Security_Users} ManyToOne*/ Security_Users;
   /**@type {Transaction_Contratos_old} ManyToOne*/ Transaction_Contratos_old;
}
export { Transaction_Facturas_old }
