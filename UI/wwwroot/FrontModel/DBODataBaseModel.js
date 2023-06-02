import { EntityClass } from "../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../WDevCore/WModules/WComponentsTools.js";
class Catalogo_Estados_Articulos extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    id_estado_articulo = { type: 'number', primary: true };
    nombre = { type: 'text' };
    descripcion = { type: 'text' };
    porcentaje_compra = { type: 'number' };
    porcentaje_empeno = { type: 'number' };
}
export { Catalogo_Estados_Articulos }
class Transactional_Valoracion extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    id_valoracion = { type: 'number', primary: true };
    Descripcion = { type: 'textarea' };
    Marca = { type: 'text' };
    Modelo = { type: 'text' };
    Tasa_interes = { type: 'number', hiddenInTable: true };
    Plazo = { type: 'number', hiddenInTable: true };
    Fecha = { type: 'date', hiddenInTable: true };
    Tasa_de_cambio = { type: 'number', hiddenInTable: true };
    valoracion_compra_cordobas = { type: 'number' };
    valoracion_compra_dolares = { type: 'number' };
    valoracion_empeño_cordobas = { type: 'number' };
    valoracion_empeño_dolares = { type: 'number' };
    Catalogo_Estados_Articulos = { type: 'WSELECT', hiddenInTable: true, ModelObject: () => new Catalogo_Estados_Articulos() };
    GuardarValoraciones = async (valoraciones) => {
        return await this.SaveData("Transactional_Valoracion/GuardarValoraciones", { valoraciones: valoraciones })
    }
}
export { Transactional_Valoracion }

class Catalogo_Agentes extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    id_agente = { type: 'number', primary: true };
    identificacion = { type: 'text' };
    nombre = { type: 'text', label: "nombres y apellidos" };
    telefono = { type: 'text' };
    direccion = { type: 'text' };
    fecha = { type: 'date' };
    Estado = { type: 'select', Dataset: ["ACTIVO", "INACTIVO"] };
    Catalogo_Tipo_Agente = { type: 'WSELECT', ModelObject: () => new Catalogo_Tipo_Agente() };
}
export { Catalogo_Agentes }

class Catalogo_Clasificacion_Cliente extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    id_clasificacion = { type: 'number', primary: true };
    Descripcion = { type: 'text' };
    Estado = { type: 'select', Dataset: ["ACTIVO", "INACTIVO"] };
}
export { Catalogo_Clasificacion_Cliente }

class Catalogo_Clientes extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    codigo_cliente = { type: 'number', primary: true };
    primer_nombre = { type: 'text' };
    segundo_nombre = { type: 'text' };
    primer_apellido = { type: 'text' };
    segundo_apellidio = { type: 'text' };
    identificacion = { type: 'text', hiddenFilter: true };
    sexo = { type: 'select', Dataset: [{id: "Masculino", Descripcion:"Masculino"},{id: "Femenino", Descripcion: "Femenino"}], hiddenInTable: true, hiddenFilter: true };
    fecha_nacimiento = { type: 'date', hiddenInTable: true, hiddenFilter: true };
    id_departemento = { type: 'number', hiddenInTable: true, hiddenFilter: true, hidden: true };
    id_municipio = { type: 'number', hiddenInTable: true, hiddenFilter: true, hidden: true };
    correo = { type: 'text', hiddenInTable: true, hiddenFilter: true };
    telefono = { type: 'text', hiddenInTable: true, hiddenFilter: true };
    direccion = { type: 'text', hiddenInTable: true, hiddenFilter: true };
    hora = { type: 'text', hiddenInTable: true, hiddenFilter: true, hidden: true };
    fecha = { type: 'date', hiddenInTable: true, hiddenFilter: true, hidden: true };
    observaciones = { type: 'text', hiddenInTable: true, hiddenFilter: true, hidden: true };
    estado_civil = { type: 'select', Dataset: ["Soltero", "Casado"], hiddenInTable: true, hiddenFilter: true };
    tipoc = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    tipo_firma = { type: 'select', Dataset: [{id: "Iletrado", Descripcion:"Iletrado"},{id: "Ilegible", Descripcion: "Ilegible"},{id: "Legible", Descripcion: "Legible"}], hiddenInTable: true, hiddenFilter: true };
    valor_cliente = { type: 'text', hiddenInTable: true, hiddenFilter: true };
    operadora_celular = { type: 'select', Dataset: ["Tigo", "Claro"], hiddenInTable: true, hiddenFilter: true };
    valor_interes = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    solo_acreedor = { type: 'select',Dataset: [{id: "Si", Descripcion:"Si"},{id: "No", Descripcion: "Ambos"}],  hiddenInTable: true, hiddenFilter: true };
    promedio = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    Catalogo_Clasificacion_Cliente = { type: 'WSELECT', ModelObject: () => new Catalogo_Clasificacion_Cliente(), hiddenFilter: true };
    Catalogo_Tipo_Identificacion = { type: 'WSELECT', ModelObject: () => new Catalogo_Tipo_Identificacion(), hiddenFilter: true };
    Catalogo_Profesiones = { type: 'WSELECT', ModelObject: () => new Catalogo_Profesiones(), hiddenInTable: true, hiddenFilter: true };
    Condicion_Laboral_Cliente = { type: 'WSELECT', ModelObject: () => new Condicion_Laboral_Cliente(), hiddenInTable: true, hiddenFilter: true, hidden: true };

}
export { Catalogo_Clientes }

class Condicion_Laboral_Cliente extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    id = { type: 'number', primary: true };
    fecha_ingreso = { type: 'date' };
    ocupacion_cargo = { type: 'text' };
    ingresos_mensuales = { type: 'number' };
    direccion = { type: 'text' };
    /*Catalogo_Clientes = { type: 'WSELECT', ModelObject: () => new Catalogo_Clientes() };*/
    Catalogo_Municipio = { type: 'WSELECT', ModelObject: () => new Catalogo_Municipio() };
    Catalogo_Departamento = { type: 'WSELECT', ModelObject: () => new Catalogo_Departamento() };
}
export { Condicion_Laboral_Cliente }

class Catalogo_Tipo_Agente extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    Id_Tipo_Agente = { type: 'number', primary: true };
    Descripcion = { type: 'text' };
    Estado = { type: 'select', Dataset: ["ACTIVO", "INACTIVO"] };
}
export { Catalogo_Tipo_Agente }
class Catalogo_Tipo_Identificacion extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    Id_Tipo_Identificacion = { type: 'number', primary: true };
    Descripcion = { type: 'text' };
    Estado = { type: 'select', Dataset: ["ACTIVO", "INACTIVO"] };
}
export { Catalogo_Tipo_Identificacion }
class Transaction_Contratos extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    numero_contrato = { type: 'number', primary: true };
    fecha_contrato = { type: 'date' };
    fecha_cancelar = { type: 'date' };
    monto = { type: 'number' };
    interes = { type: 'number' };
    mora = { type: 'number' };
    estado = { type: 'select', Dataset: ["ACTIVO", "INACTIVO"] };
    fecha_vencimiento = { type: 'date' };
    saldo = { type: 'number' };
    dias_mora = { type: 'number' };
    saldo_mora = { type: 'number' };
    fecha_baja = { type: 'date' };
    abonos = { type: 'number' };
    ultima_visita = { type: 'date' };
    tipo = { type: 'number' };
    entregado = { type: 'text' };
    interes_actual = { type: 'number' };
    observaciones = { type: 'text' };
    iva = { type: 'number' };
    margen = { type: 'number' };
    interesl = { type: 'number' };
    moral = { type: 'number' };
    descuento = { type: 'number' };
    util = { type: 'number' };
    taza_interes_cargos = { type: 'number' };
    taza_mora = { type: 'number' };
    fecha_mora = { type: 'date' };
    fecha_interes = { type: 'date' };
    taza_gestion_crediticia = { type: 'number' };
    Id_User_OLD = { type: 'number' };
    taza_cambio = { type: 'number' };
    dkm = { type: 'number' };
    gasolinamonto = { type: 'number' };
    valorcad = { type: 'number' };
    plazo = { type: 'number' };
    cuotafija = { type: 'number' };
    montocuotaatrazadas = { type: 'number' };
    mes_pagado = { type: 'date' };
    tasa_hoy = { type: 'number' };
    numero_protocolo = { type: 'number' };
    valor_dolar = { type: 'number' };
    parciales = { type: 'number' };
    mora_parcial = { type: 'number' };
    interes_parcial = { type: 'number' };
    motivo_anulacion = { type: 'text' };
    idcatemp = { type: 'number' };
    cuota_fija_inicial = { type: 'number' };
    fecha_cancelar_inicial = { type: 'date' };
    plazo_inicial = { type: 'number' };
    dias_para_baja = { type: 'number' };
    Catalogo_Agentes = { type: 'WSELECT', ModelObject: () => new Catalogo_Agentes() };
    Catalogo_Clientes = { type: 'WSELECT', ModelObject: () => new Catalogo_Clientes() };
    Detail_Prendas = { type: 'MasterDetail', ModelObject: () => new Detail_Prendas() };
}
export { Transaction_Contratos }
class Detail_Prendas extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    numero_prenda = { type: 'number', primary: true };
    numero_contrato_OLD = { type: 'number' };
    Descripcion = { type: 'text' };
    pprenda = { type: 'number' };
    Tipo = { type: 'text' };
    marca = { type: 'text' };
    serie = { type: 'text' };
    modelo = { type: 'text' };
    iva = { type: 'text' };
    margen = { type: 'text' };
    estado = { type: 'select', Dataset: ["ACTIVO", "INACTIVO"] };
    interesl = { type: 'number' };
    moral = { type: 'number' };
    fliquidacion = { type: 'date' };
    precio_venta = { type: 'number' };
    en_manos_de = { type: 'text' };
    color = { type: 'text' };
    factura = { type: 'text' };
    tipo_movimiento = { type: 'text' };
    uso = { type: 'text' };
    servicio = { type: 'text' };
    v_porcentage_etiqueta = { type: 'number' };
    Detail_Prendas_Vehiculos = { type: 'WSELECT', ModelObject: () => new Detail_Prendas_Vehiculos() };
}
export { Detail_Prendas }
class Detail_Prendas_Vehiculos extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    capacidad_cilindros = { type: 'text' };
    cantidad_cilindros = { type: 'text' };
    cantidad_pasajeros = { type: 'text' };
    year_vehiculo = { type: 'number' };
    montor = { type: 'text' };
    chasis = { type: 'text' };
    placa = { type: 'text' };
    circuacion = { type: 'text' };
    defectuoso = { type: 'text' };
    fecha_aut_descuento = { type: 'date' };
    defecto = { type: 'text' };
    porcentage_descuento_maximo = { type: 'number' };
    fecha_seguro = { type: 'date' };
    combustible = { type: 'text' };
    Detail_Prendas = { type: 'WSELECT', ModelObject: () => new Detail_Prendas() };
}
export { Detail_Prendas_Vehiculos }
class Catalogo_Cambio_Dolar extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    id_cambio = { type: 'number', primary: true };
    fecha = { type: 'date' };
    valor_de_compra = { type: 'number' };
    valor_de_venta = { type: 'number' };
}
export { Catalogo_Cambio_Dolar }
class Catalogo_Cuentas extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    id_cuentas = { type: 'number', primary: true };
    nombre = { type: 'text' };
}
export { Catalogo_Cuentas }
class Catalogo_Departamento extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    id_departamento = { type: 'number', primary: true };
    nombre = { type: 'text' };
    ponderacion = { type: 'number' };
    puntaje = { type: 'number' };
    clasificacion = { type: 'text' };
    Catalogo_Nacionalidad = { type: 'WSELECT', ModelObject: () => new Catalogo_Nacionalidad() };
}
export { Catalogo_Departamento }
class Catalogo_Inversores extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    id_inversor = { type: 'number', primary: true };
    nombre = { type: 'text' };
    direccion = { type: 'text' };
    estado_civil = { type: 'text' };
    identificacion = { type: 'text' };
    telefono = { type: 'text' };
    Catalogo_Municipio = { type: 'WSELECT', ModelObject: () => new Catalogo_Municipio() };
    Catalogo_Nacionalidad = { type: 'WSELECT', ModelObject: () => new Catalogo_Nacionalidad() };
}
export { Catalogo_Inversores }
class Catalogo_Municipio extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    id_municipio = { type: 'number', primary: true };
    nombre = { type: 'text' };
    Catalogo_Departamento = { type: 'WSELECT', ModelObject: () => new Catalogo_Departamento() };
}
export { Catalogo_Municipio }
class Catalogo_Nacionalidad extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    id_nacionalidad = { type: 'number', primary: true };
    nombre = { type: 'text' };
    nacionalidad = { type: 'text' };
    ponderacion = { type: 'number' };
    puntaje = { type: 'number' };
    clasificacion = { type: 'text' };
}
export { Catalogo_Nacionalidad }
class Catalogo_Profesiones extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    id_profesion = { type: 'number', primary: true };
    nombre = { type: 'text' };
}
export { Catalogo_Profesiones }
class id_tipo_transaccion extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    id_tipo_transaccion = { type: 'number', primary: true };
    descripcion = { type: 'text' };
}
export { id_tipo_transaccion }
class Transaction_Contratos_Inversionistas extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    numero_cont = { type: 'number', primary: true };
    fecha = { type: 'date' };
    taza = { type: 'number' };
    monto_inicial = { type: 'number' };
    nombre_sustituto = { type: 'text' };
    identificacion_sustituto = { type: 'text' };
    direccion_sustituto = { type: 'text' };
    departamento_sus = { type: 'text' };
    municipio_sustituto = { type: 'text' };
    fecha_pago = { type: 'date' };
    fecha_ultimo_pago = { type: 'date' };
    saldo = { type: 'number' };
    montointeres = { type: 'number' };
    interes = { type: 'number' };
    fecha_restructura = { type: 'date' };
    Catalogo_Inversores = { type: 'WSELECT', ModelObject: () => new Catalogo_Inversores() };
}
export { Transaction_Contratos_Inversionistas }
class Transaction_Egresos extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    numero_egreso = { type: 'number', primary: true };
    monto = { type: 'number' };
    fecha = { type: 'date' };
    descripcion = { type: 'text' };
    nombre = { type: 'text' };
    banco = { type: 'text' };
    anulado = { type: 'text' };
    observaciones = { type: 'text' };
    tc = { type: 'number' };
    dolar = { type: 'number' };
    fanulado = { type: 'date' };
}
export { Transaction_Egresos }
class Transaction_Facturas extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    numero_factura = { type: 'number', primary: true };
    abono_de_cuota = { type: 'number' };
    mora = { type: 'number' };
    interes = { type: 'number' };
    total = { type: 'number' };
    fecha = { type: 'date' };
    fecha_pago = { type: 'date' };
    inte = { type: 'number' };
    mor = { type: 'number' };
    dm = { type: 'number' };
    es = { type: 'text' };
    tot = { type: 'number' };
    an = { type: 'text' };
    pago_contado = { type: 'number' };
    saldo_monto = { type: 'number' };
    ABONO = { type: 'number' };
    descuento = { type: 'number' };
    fecha_mora = { type: 'date' };
    fecha_interes = { type: 'date' };
    taza_cambio = { type: 'number' };
    interes_actual = { type: 'number' };
    Id_User_OLD = { type: 'number' };
    fecha_grabado = { type: 'date' };
    mes_pagado = { type: 'date' };
    ultima_visita = { type: 'date' };
    dmpagadas = { type: 'number' };
    tipo = { type: 'text' };
    morac = { type: 'number' };
    interesc = { type: 'number' };
    abonoc = { type: 'number' };
    totalc = { type: 'number' };
    parciales = { type: 'number' };
    moraparcial = { type: 'number' };
    interesparcial = { type: 'number' };
    motivo_anulacion = { type: 'text' };
    reestructuraciond = { type: 'number' };
    reestructuracionc = { type: 'number' };
    numero_reestructuracion = { type: 'number' };
    fecha_cancelacion = { type: 'date' };
    docnoentregadod = { type: 'number' };
    docnoentregadoc = { type: 'number' };
    Transaction_Contratos = { type: 'WSELECT', ModelObject: () => new Transaction_Contratos() };
}
export { Transaction_Facturas }
class Transaction_Ingresos extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    numero_ingreso = { type: 'number', primary: true };
    monto = { type: 'number' };
    fecha = { type: 'date' };
    descripcion = { type: 'text' };
    nombre = { type: 'text' };
    que = { type: 'number' };
    anulado = { type: 'text' };
    observaciones = { type: 'text' };
    tzcambio = { type: 'number' };
    total = { type: 'number' };
    fanulado = { type: 'date' };
}
export { Transaction_Ingresos }
class Transaction_Ingresos_Egresos extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    id_transaccion = { type: 'number', primary: true };
    monto_dolares = { type: 'number' };
    tasa_cambio = { type: 'number' };
    monto_total = { type: 'number' };
    descripcion = { type: 'text' };
    nombre = { type: 'text' };
    que = { type: 'number' };
    fecha_anulado = { type: 'date' };
    banco = { type: 'text' };
    estado = { type: 'select', Dataset: ["ACTIVO", "INACTIVO"] };
    numero_original = { type: 'number' };
    fecha = { type: 'date' };
    Catalogo_Cuentas = { type: 'WSELECT', ModelObject: () => new Catalogo_Cuentas() };
}
export { Transaction_Ingresos_Egresos }
class Catalogo_Sucursales extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    Id_Sucursal = { type: 'number', primary: true };
    Nombre = { type: 'text' };
    Descripcion = { type: 'text' };
    Direccion = { type: 'text' };
}
export { Catalogo_Sucursales }
class Datos_Configuracion extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    Encabezado = { type: 'text' };
    AutoDebito = { type: 'checkbox' };
    Catalogo_Sucursales = { type: 'WSELECT', ModelObject: () => new Catalogo_Sucursales() };
}
export { Datos_Configuracion }
