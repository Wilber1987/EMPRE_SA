import { WForm } from "../WDevCore/WComponents/WForm.js";
import { EntityClass } from "../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../WDevCore/WModules/WComponentsTools.js";
import { Detail_Prendas_Vehiculos, Tbl_Cuotas } from "./Model.js";
import { Tbl_Cuotas_ModelComponent } from "./ModelComponents.js";
class Catalogo_Estados_Articulos extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    id_estado_articulo = { type: 'number', primary: true };
    nombre = { type: 'text' };
    descripcion = { type: 'text', hiddenInTable: true };
    porcentaje_compra = { type: 'number' };
    porcentaje_empeno = { type: 'number' };
}
export { Catalogo_Estados_Articulos }
class Transactional_Valoracion extends EntityClass {
    /**
     * 
     * @param {Transactional_Valoracion | Object} props 
     */
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    id_valoracion = { type: 'number', primary: true };
    Descripcion = { type: 'textarea' };
    Serie = { type: 'text', require: false };
    Marca = { type: 'text' };
    Modelo = { type: 'text' };
    Catalogo_Categoria = {
        type: 'WSELECT',
        ModelObject: () => new Catalogo_Categoria(), action: (ObjectF, /**@type {WForm} */ form, InputControl, prop) => {
            console.log(ObjectF.Catalogo_Categoria.plazo_limite);
            this.Plazo.max = ObjectF.Catalogo_Categoria.plazo_limite;
            if (ObjectF.Plazo > this.Plazo.max) {
                ObjectF.Plazo = this.Plazo.max;
            }
            form.DrawComponent();
        }, hiddenFilter: true
    };
    Plazo = { type: 'number', hiddenInTable: true, max: 24, min: 1, hiddenFilter: true };
    Tasa_interes = { type: 'number', hiddenInTable: true, enabled: false, Dataset: [], hiddenFilter: true };
    Fecha = { type: 'date', hiddenInTable: true, hiddenFilter: true };
    Tasa_de_cambio = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    valoracion_compra_cordobas = { type: 'number', hiddenFilter: true };
    valoracion_compra_dolares = { type: 'number', hiddenFilter: true };
    valoracion_empeño_cordobas = { type: 'number', hiddenFilter: true };
    valoracion_empeño_dolares = { type: 'number', hiddenFilter: true };
    Catalogo_Estados_Articulos = { type: 'WSELECT', hiddenInTable: true, ModelObject: () => new Catalogo_Estados_Articulos(), hiddenFilter: true };
    //TASAS DE INTERES
    valoracion_empeño_dolares = { type: 'operation' };

    precio_venta_empeño_cordobas = { type: 'number', hidden: true };
    precio_venta_empeño_dolares = { type: 'number', hidden: true };
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
    identificacion = { type: 'text', hiddenFilter: true };
    nombre = { type: 'text', label: "nombres y apellidos" };
    telefono = { type: 'text' };
    fecha = { type: 'date', hiddenFilter: true, hiddenInTable: true };
    direccion = { type: 'textarea', hiddenInTable: true };
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
    porcentaje = { type: 'number' };
    Estado = { type: 'select', Dataset: ["ACTIVO", "INACTIVO"] };
}
export { Catalogo_Clasificacion_Cliente }

class Catalogo_Clasificacion_Interes extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    id_clasificacion_interes = { type: 'number', primary: true };
    Descripcion = { type: 'text' };
    porcentaje = { type: 'number' };
    Estado = { type: 'select', Dataset: ["ACTIVO", "INACTIVO"] };
}
export { Catalogo_Clasificacion_Interes }

class Catalogo_Clientes extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    codigo_cliente = { type: 'number', primary: true };
    primer_nombre = { type: 'text' };
    segundo_nombre = { type: 'text', hiddenFilter: true, require: false };
    primer_apellido = { type: 'text' };
    segundo_apellidio = { type: 'text', require: false };
    Catalogo_Tipo_Identificacion = {
        type: 'WSELECT', ModelObject: () => new Catalogo_Tipo_Identificacion(), label: "Tipo Identificación",
        hiddenFilter: true, hiddenInTable: true
    };
    identificacion = { type: 'text' };
    sexo = {
        type: 'select',
        Dataset: [{ id: "Masculino", Descripcion: "Masculino" }, { id: "Femenino", Descripcion: "Femenino" }], hiddenInTable: true, hiddenFilter: true
    };
    fecha_nacimiento = { type: 'date', hiddenInTable: true, hiddenFilter: true, hiddenInTable: true };
    id_departamento = { type: 'number', hiddenInTable: true, hiddenFilter: true, hidden: true };
    id_municipio = { type: 'number', hiddenInTable: true, hiddenFilter: true, hidden: true };
    //id_tipo_identificacion = { type: 'number', hiddenInTable: true, hiddenFilter: true, hidden: true };
    correo = { type: 'text', hiddenInTable: true, hiddenFilter: true, require: false };
    operadora_celular = { type: 'select', Dataset: ["Tigo", "Claro"], hiddenInTable: true, hiddenFilter: true };
    telefono = { type: 'tel', hiddenInTable: true, hiddenFilter: true };
    direccion = { type: 'text', hiddenInTable: true, hiddenFilter: true };
    //grupo1 = undefined;
    hora = { type: 'text', hiddenInTable: true, hiddenFilter: true, hidden: true };
    fecha = { type: 'date', hiddenInTable: true, hiddenFilter: true, hidden: true };
    observaciones = { type: 'text', hiddenInTable: true, hiddenFilter: true, hidden: true };
    estado_civil = { type: 'select', Dataset: ["Soltero", "Casado", "Unión libre", "Viudo"], hiddenInTable: true, hiddenFilter: true };
    tipo_firma = { type: 'select', Dataset: ["Iletrado", "Ilegible", "Legible"], hiddenInTable: true, hiddenFilter: true };
    valor_cliente = { type: 'select', Dataset: [{ id: "MP", Descripcion: "Más prestamos" }, { id: "NMP", Descripcion: "No más prestamos" }], hiddenInTable: true, hiddenFilter: true };

    //valor_interes = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    solo_acreedor = { type: 'radio', Dataset: ["Ambos", "Si"], hiddenInTable: true, hiddenFilter: true };

    Catalogo_Clasificacion_Interes = { type: 'WSELECT', ModelObject: () => new Catalogo_Clasificacion_Interes(), hiddenFilter: true };
    //promedio = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    Catalogo_Clasificacion_Cliente = { type: 'WSELECT', ModelObject: () => new Catalogo_Clasificacion_Cliente(), hiddenFilter: true };

    Catalogo_Profesiones = { type: 'WSELECT', ModelObject: () => new Catalogo_Profesiones(), hiddenInTable: true, hiddenFilter: true };
    Condicion_Laboral_Cliente = { type: 'WSELECT', ModelObject: () => new Condicion_Laboral_Cliente(), hiddenInTable: true, hiddenFilter: true, hidden: true };
    Catalogo_Municipio = { type: 'WSELECT', ModelObject: () => new Catalogo_Municipio(), hiddenInTable: true };
    Catalogo_Departamento = { type: 'WSELECT', ModelObject: () => new Catalogo_Departamento(), hiddenInTable: true };

}
export { Catalogo_Clientes }


class Catalogo_Categoria extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    id_categoria = { type: 'number', primary: true };
    tipo = { type: 'text' };
    descripcion = { type: 'text', hiddenFilter: true, require: false };
    plazo_limite = { type: 'number' };
    prioridad = { type: 'number', hiddenInTable: true };
}
export { Catalogo_Categoria }

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
    nombre_empresa = { type: 'text' };
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
    id_tipo_identificacion = { type: 'number', primary: true };
    Descripcion = { type: 'text' };
    Estado = { type: 'select', Dataset: ["ACTIVO", "INACTIVO"] };
}
export { Catalogo_Tipo_Identificacion }

class Transaction_Contratos_ModelComponent extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    Catalogo_Clientes = { type: 'WSELECT', ModelObject: () => new Catalogo_Clientes(), hiddenFilter: true };
    numero_contrato = { type: "number", primary: true };
    fecha_contrato = { type: "date" };
    fecha_cancelar = { type: "date", hiddenInTable: true };
    monto = { type: "number", hiddenInTable: true, hiddenFilter: true };
    interes = { type: "number", hiddenInTable: true, hiddenFilter: true };
    mora = { type: "number", hiddenInTable: true, hiddenFilter: true };
    estado = { type: "Select", Dataset: ["ACTIVO", "CANCELADO", "ANULADO"] };
    fecha_vencimiento = { type: "date", hiddenFilter: true };
    codigo_cliente = { type: "number", hiddenInTable: true, hiddenFilter: true };
    saldo = { type: "number", hiddenFilter: true, hiddenInTable: true };
    abonos = { type: "number", hiddenInTable: true, hiddenFilter: true };
    tipo = { type: "number", hiddenInTable: true, hiddenFilter: true };
    entregado = { type: "text", hiddenInTable: true, hiddenFilter: true };
    interes_actual = { type: "number", hiddenInTable: true, hiddenFilter: true };
    observaciones = { type: "text", hiddenInTable: true, hiddenFilter: true };
    iva = { type: "number", hiddenInTable: true, hiddenFilter: true };
    descuento = { type: "number", hiddenInTable: true, hiddenFilter: true };
    taza_cambio = { type: "number", hiddenInTable: true, hiddenFilter: true };
    taza_cambio_compra = { type: "number", hiddenInTable: true, hiddenFilter: true };
    id_agente = { type: "number", hiddenInTable: true, hiddenFilter: true };
    plazo = { type: "number", hiddenInTable: true, hiddenFilter: true };
    cuotafija = { type: "number", hiddenInTable: true, hiddenFilter: true };
    tasa_hoy = { type: "number", hiddenInTable: true, hiddenFilter: true };
    motivo_anulacion = { type: "text", hiddenInTable: true, hiddenFilter: true };
    valoracion_compra_dolares = { type: "number", hiddenInTable: true, hiddenFilter: true };
    valoracion_compra_cordobas = { type: "number", hiddenInTable: true, hiddenFilter: true };
    valoracion_empeño_cordobas = { type: "number", hiddenInTable: true, hiddenFilter: true };
    valoracion_empeño_dolares = { type: "number", hiddenInTable: true, hiddenFilter: true };
    tasas_interes = { type: "number", hiddenInTable: true, hiddenFilter: true };
    gestion_crediticia = { type: "number", hiddenInTable: true, hiddenFilter: true };
    cuotafija_dolares = { type: "number", hiddenInTable: true, hiddenFilter: true };
    fecha = { type: "date", hiddenInTable: true, hiddenFilter: true };
    total_pagar_cordobas = { type: "number", hiddenInTable: true, hiddenFilter: true };
    total_pagar_dolares = { type: "number", hiddenInTable: true, hiddenFilter: true };
    interes_dolares = { type: "number", hiddenInTable: true, hiddenFilter: true };
    Id_User = { type: "number", hiddenInTable: true, hiddenFilter: true };
    Catalogo_Agentes = { type: 'WSELECT', ModelObject: () => new Catalogo_Agentes(), hiddenInTable: true, hiddenFilter: true };
    Detail_Prendas = { type: 'MasterDetail', ModelObject: () => new Detail_Prendas_ModelComponent(), hiddenFilter: true };
    Tbl_Cuotas = { type: 'MasterDetail', ModelObject: () => new Tbl_Cuotas_ModelComponent(), hiddenFilter: true };
}
export { Transaction_Contratos_ModelComponent }

/*class Transaction_Contratos_ModelComponent extends EntityClass { //todo eliminar
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    Catalogo_Clientes = { type: 'WSELECT', ModelObject: () => new Catalogo_Clientes() };
    numero_contrato = { type: 'number', primary: true };
    fecha_contrato = { type: 'date' };
    fecha_cancelar = { type: 'date', hiddenInTable: true, hiddenFilter: true };
    monto = { type: 'number', hiddenFilter: true };
    interes = { type: 'number', hiddenFilter: true };
    mora = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    estado = { type: 'select', Dataset: ["ACTIVO", "INACTIVO"] };
    fecha_vencimiento = { type: 'date' };
    dias_mora = { type: 'number' , hiddenFilter: true};
    saldo_mora = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    saldo = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    fecha_baja = { type: 'date', hiddenInTable: true, hiddenFilter: true };
    abonos = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    ultima_visita = { type: 'date', hiddenInTable: true, hiddenFilter: true };
    tipo = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    entregado = { type: 'text', hiddenInTable: true, hiddenFilter: true };
    interes_actual = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    observaciones = { type: 'text', hiddenInTable: true, hiddenFilter: true };
    iva = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    margen = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    interesl = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    moral = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    descuento = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    util = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    taza_interes_cargos = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    taza_mora = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    fecha_mora = { type: 'date', hiddenInTable: true, hiddenFilter: true };
    fecha_interes = { type: 'date', hiddenInTable: true, hiddenFilter: true };
    taza_gestion_crediticia = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    Id_User_OLD = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    taza_cambio = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    dkm = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    gasolinamonto = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    valorcad = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    plazo = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    cuotafija = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    montocuotaatrazadas = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    mes_pagado = { type: 'date', hiddenInTable: true, hiddenFilter: true };
    tasa_hoy = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    numero_protocolo = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    valor_dolar = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    parciales = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    mora_parcial = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    interes_parcial = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    motivo_anulacion = { type: 'text', hiddenInTable: true, hiddenFilter: true };
    idcatemp = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    cuota_fija_inicial = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    fecha_cancelar_inicial = { type: 'date', hiddenInTable: true, hiddenFilter: true };
    plazo_inicial = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    dias_para_baja = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    Catalogo_Agentes = { type: 'WSELECT', ModelObject: () => new Catalogo_Agentes(), hiddenInTable: true, hiddenFilter: true };
    Detail_Prendas = { type: 'MasterDetail', ModelObject: () => new Detail_Prendas_ModelComponent() };
}
export { Transaction_Contratos_ModelComponent }*/
class Detail_Prendas_ModelComponent extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    numero_prenda = { type: 'number', primary: true };
    numero_contrato_OLD = { type: 'number', hidden: true };
    Descripcion = { type: 'text' };
    Tipo = { type: 'text', hidden: true };
    marca = { type: 'text' };
    serie = { type: 'text' };
    modelo = { type: 'text' };
    pprenda = { type: 'number', label: "Monto aprob." };
    iva = { type: 'text', hidden: true };
    //margen = { type: 'text', hiddenInTable: true };
    estado = { type: 'select', Dataset: ["ACTIVO", "INACTIVO"], hiddenInTable: true };
    //interesl = { type: 'number' , hiddenInTable: true};
    //moral = { type: 'number' , hiddenInTable: true};
    //fliquidacion = { type: 'date', hiddenInTable: true };
    precio_venta = { type: 'number', hiddenInTable: true };
    en_manos_de = { type: 'select', Dataset: ["ACREEDOR", "DEUDOR"], hiddenInTable: true };
    color = { type: 'COLOR' };
    //factura = { type: 'text' };
    //tipo_movimiento = { type: 'text' , hiddenInTable: true};
    uso = { type: 'select', Dataset: ["PRIVADO", "PARTICULAR"], hiddenInTable: true };
    servicio = { type: 'select', Dataset: ["PRIVADO", "PARTICULAR"], hiddenInTable: true };
    //v_porcentage_etiqueta = { type: 'number' , hiddenInTable: true};
    Catalogo_Categoria = {
        hiddenInTable: true,
        type: 'WSELECT', ModelObject: () => new Catalogo_Categoria(), action: (ObjectF, form, InputControl, prop) => {

        }
    };
    Detail_Prendas_Vehiculos = {
        type: 'Model',
        ModelObject: () => new Detail_Prendas_Vehiculos_ModelComponent(),
        EntityModel: () => new Detail_Prendas_Vehiculos()
    };

}
export { Detail_Prendas_ModelComponent }
class Detail_Prendas_Vehiculos_ModelComponent extends EntityClass {
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
}
export { Detail_Prendas_Vehiculos_ModelComponent }

class Transaction_Facturas_ModelComponent extends EntityClass {
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
    pago_contado = { type: 'number' };
    saldo_monto = { type: 'number' };
    fecha_mora = { type: 'date' };
    fecha_interes = { type: 'date' };
    taza_cambio = { type: 'number' };
    //interes_actual = { type: 'number' };
    //Id_User_OLD = { type: 'number' };
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
    Transaction_Contratos = { type: 'WSELECT', ModelObject: () => new Transaction_Contratos_ModelComponent() };
}
export { Transaction_Facturas_ModelComponent }


class Catalogo_Cambio_Dolar extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    id_cambio = { type: 'number', primary: true };
    fecha = { type: 'date' };
    valor_de_compra = { type: 'number', hiddenFilter: true };
    valor_de_venta = { type: 'number', hiddenFilter: true };
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
    saldo = { type: 'number', disabled: true, hiddenInTable: true, require: false };
    saldo_dolares = { type: 'number', disabled: true, hiddenInTable: true, require: false };
    permite_dolares = { type: "checkbox", require: false };
    permite_cordobas = { type: "checkbox", require: false };
    tipo_cuenta = { type: 'select', Dataset: ['PROPIA', 'PAGO', 'EXTERNA'] };
    Catalogo_Sucursales = { type: 'WSELECT', ModelObject: () => new Catalogo_Sucursales() };
    Categoria_Cuentas = { type: 'WSELECT', ModelObject: () => new Categoria_Cuentas() };
    /*Catalogo_Tipo_Transaccion = { type: 'WSELECT', ModelObject: () => new Catalogo_Tipo_Transaccion() };*/
}
export { Catalogo_Cuentas }

class Categoria_Cuentas extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    id_categoria = { type: "number", primary: true };
    descripcion = { type: "text" };
}
export { Categoria_Cuentas }

class Permisos_Cuentas extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    id_permiso = { type: "number", primary: true };
    Categoria_Cuentas_Origen = { type: 'WSELECT', ModelObject: () => new Categoria_Cuentas() };
    Categoria_Cuentas_Destino = { type: 'WSELECT', ModelObject: () => new Categoria_Cuentas() };
    permite_debito = { type: "checkbox", require: false };
    permite_credito = { type: "checkbox", require: false };
    //Categoria_Cuentas = { type: 'WSELECT', ModelObject: () => new Categoria_Cuentas() };//todo eliminar
}
export { Permisos_Cuentas }

class Catalogo_Departamento extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    id_departamento = { type: 'number', primary: true };
    nombre = { type: 'text' };
    ponderacion = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    puntaje = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    clasificacion = { type: 'text', hiddenInTable: true, hiddenFilter: true };
    Catalogo_Nacionalidad = { type: 'WSELECT', ModelObject: () => new Catalogo_Nacionalidad(), hiddenInTable: true };
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
    identificacion = { type: 'text' };
    telefono = { type: 'tel' };
    stado_civil = { type: 'select', Dataset: ["Soltero", "Casado"], hiddenInTable: true, hiddenFilter: true };
    direccion = { type: 'text', hiddenInTable: true, hiddenFilter: true };
    Catalogo_Municipio = { type: 'WSELECT', ModelObject: () => new Catalogo_Municipio(), hiddenInTable: true, hiddenFilter: true };
    Catalogo_Nacionalidad = { type: 'WSELECT', ModelObject: () => new Catalogo_Nacionalidad(), hiddenInTable: true, hiddenFilter: true };
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
    ponderacion = { type: 'number', hiddenFilter: true };
    puntaje = { type: 'number', hiddenFilter: true };
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
    Descripcion = { type: 'text', hiddenInTable: true };
    Direccion = { type: 'text' };
    Catalogo_Municipio = { type: 'WSELECT', ModelObject: () => new Catalogo_Municipio(), hiddenInTable: true };

}
export { Catalogo_Sucursales }
class Catalogo_Tipo_Transaccion extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    id_tipo_transaccion = { type: 'number', primary: true };
    descripcion = { type: 'text' };
}
export { Catalogo_Tipo_Transaccion }
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


class Recibos extends EntityClass {
    constructor(props) {
        super(props, 'Recibos');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    id_recibo = { type: "number", primary: true };
    consecutivo = { type: "number", hidden: true, require: false };
    temporal = { type: "checkbox", require: false };
    numero_contrato = { type: "number", hidden: true, disabled: true };
    monto = { type: "number", disabled: true };
    saldo_actual_cordobas = { type: "number", disabled: true };
    saldo_actual_dolares = { type: "number", disabled: true };
    plazo = { type: "number", disabled: true };
    interes_cargos = { type: "number", disabled: true };
    tasa_cambio = { type: "number", hiddenInTable: true, disabled: true };
    tasa_cambio_compra = { type: "number", hiddenInTable: true, disabled: true };
    interes_demas_cargos_pagar_cordobas = { type: "number", hiddenInTable: true, disabled: true };
    interes_demas_cargos_pagar_dolares = { type: "number", hiddenInTable: true, disabled: true };
    abono_capital_cordobas = { type: "number", hiddenInTable: true, disabled: true };
    abono_capital_dolares = { type: "number", hiddenInTable: true, disabled: true };
    cuota_pagar_cordobas = { type: "number", hiddenInTable: true, disabled: true };
    cuota_pagar_dolares = { type: "number", hiddenInTable: true, disabled: true };
    mora_cordobas = { type: "number", hiddenInTable: true, disabled: true };
    mora_dolares = { type: "number", hiddenInTable: true, disabled: true };
    mora_interes_cordobas = { type: "number", hiddenInTable: true, disabled: true };
    mora_interes_dolares = { type: "number", hiddenInTable: true, disabled: true };
    total_cordobas = { type: "number", hiddenInTable: true, disabled: true };
    total_dolares = { type: "number", hiddenInTable: true, disabled: true };
    total_parciales = { type: "number", hiddenInTable: true, disabled: true };

    fecha_roc = { type: "date", disabled: true };
    paga_cordobas = { type: "number", hiddenInTable: true };
    paga_dolares = { type: "number", hiddenInTable: true };
    title = { type: "title", label: "Opciones:" };    
    //solo_abono = { type: "checkbox", hiddenInTable: true, require: false };
    cancelar = { type: "checkbox", hiddenInTable: true, require: false };

    VerRecibo = async () => {
        return await this.SaveData("PDF/GeneratePdfContract", this)
    }
}
export { Recibos }


class Transaccion_Factura extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    id_factura = { type: "number", primary: true };
    tipo = { type: "text" };
    concepto = { type: "text" };
    tasa_cambio = { type: "string" };
    total = { type: "string" };
    id_cliente = { type: "number" };
    id_sucursal = { type: "number" };
    fecha = { type: "date" };
    Factura_contrato = { type: 'model', label: "Datos del contrato al momento del pago", ModelObject: () => new Factura_contrato(), hiddenFilter: true };
    Detalle_Factura_Recibo = { type: 'MasterDetail', label: "Cuotas Pagadas", ModelObject: () => new Detalle_Factura_Recibo(), hiddenFilter: true };

}
export { Transaccion_Factura }

class Factura_contrato {
    constructor(props) {
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    numero_contrato = { type: "number" };
    cuotas_pendientes = { type: "number" };
    saldo_anterior = { type: "number" };
    saldo_actual = { type: "number" };
    mora = { type: "number" };
    interes_demas_cargos_pagar = { type: "number" };
    proximo_pago_pactado = { type: "date" };
    total_parciales = { type: "number" };
    tipo = { type: "number" };
    tipo_cuenta = { type: "number" };
    total = { type: "number" };
    tasa_cambio = { type: "number" };
}
export { Factura_contrato }

class Detalle_Factura_Recibo extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    id = { type: "number", primary: true };
    id_factura = { type: "number" };
    id_cuota = { type: "number" };
    total_cuota = { type: "string" };
    monto_pagado = { type: "string" };
    capital_restante = { type: "string" };
    concepto = { type: "text" };
    tasa_cambio = { type: "string" };
}
export { Detalle_Factura_Recibo }
