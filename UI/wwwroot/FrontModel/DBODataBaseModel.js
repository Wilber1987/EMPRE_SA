//@ts-check
import {WForm} from "../WDevCore/WComponents/WForm.js";
// @ts-ignore
import {ModelProperty} from "../WDevCore/WModules/CommonModel.js";
import {EntityClass} from "../WDevCore/WModules/EntityClass.js";
import { Catalogo_Categoria } from "./Model.js";

class Catalogo_Estados_Articulos extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }
    /**@type {Number?} */ id_estado_articulo = null;
    /**@type {String?} */ nombre = null;
    /**@type {String?} */ descripcion = null;
    /**@type {Number?} */ porcentaje_compra = null;
    /**@type {Number?} */ porcentaje_empeno = null;
    /**@type {Number?} */ Porcentaje_venta_compra = null;
    /**@type {Number?} */ Porcentaje_venta_empeno = null;
    /**@type {Catalogo_Categoria?} */ Catalogo_Categoria = null;
    get Categoria() {
        return this.Catalogo_Categoria?.descripcion?.toUpperCase() ?? "Ninguna"
    }
}
export { Catalogo_Estados_Articulos }
class Catalogo_Estados_Articulos_ModelComponent extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }
    id_estado_articulo = { type: 'number', primary: true };
    nombre = { type: 'text' };
    descripcion = { type: 'text', hiddenInTable: true };
    porcentaje_compra = { type: 'number' };
    porcentaje_empeno = { type: 'number' };
    Porcentaje_venta_compra = { type: 'number' };
    Porcentaje_venta_empeno = { type: 'number' };
    /**@type {ModelProperty} */
     Categoria = { type: 'Text', isReadOnly: true }
}
export { Catalogo_Estados_Articulos_ModelComponent }


class Catalogo_Categoria_ModelComponent extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }
    id_categoria = { type: 'number', primary: true };
    tipo = { type: 'text' };
    descripcion = { type: 'text', hiddenFilter: true, require: false };
    plazo_limite = { type: 'number' };
    prioridad = { type: 'number', hiddenInTable: true };    
    IsForVehiculo = { type: 'checkbox', hiddenInTable: true, label: "Para Vehículo"};
    Catalogo_Estados_Articulos = { type: "MasterDetail", ModelObject: ()=> new Catalogo_Estados_Articulos_ModelComponent(), require: false }
}
export { Catalogo_Categoria_ModelComponent }

class Catalogo_Cambio_Divisa_ModelComponent extends EntityClass {
    constructor(props) {
        super(props, 'EntityDbo');
        Object.assign(this, props);
    }
    /**@type {ModelProperty}*/ Id_cambio = { type: 'number', primary: true, hiddenFilter: true };
    /**@type {ModelProperty}*/ Fecha = { type: 'date' };
    /**@type {ModelProperty}*/ Valor_de_compra = { type: 'number', hiddenFilter: true };
    /**@type {ModelProperty}*/ Valor_de_venta = { type: 'number', hiddenFilter: true };
}
export { Catalogo_Cambio_Divisa_ModelComponent }

class Catalogo_Cuentas extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }
    id_cuentas = { type: 'number', primary: true };
    nombre = { type: 'text' };
    saldo = { type: 'number', disabled: true, hiddenInTable: true, require: false };
    saldo_dolares = { type: 'number', disabled: true, hiddenInTable: true, require: false };
    permite_dolares = { type: "checkbox", require: false, defaultValue: true };
    permite_cordobas = { type: "checkbox", require: false, defaultValue: true };
    tipo_cuenta = { type: 'select', Dataset: ['PROPIA', 'PAGO', 'EXTERNA'] };
    Catalogo_Sucursales = { type: 'WSELECT', ModelObject: () => new Catalogo_Sucursales_ModelComponent() };
    Categoria_Cuentas = { type: 'WSELECT', ModelObject: () => new Categoria_Cuentas() };
}
export { Catalogo_Cuentas }

class Categoria_Cuentas extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }
    id_categoria = { type: "number", primary: true };
    descripcion = { type: "text" };
}
export { Categoria_Cuentas }

class Permisos_Cuentas extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
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
        Object.assign(this, props);
    }
    id_departamento = { type: 'number', primary: true };
    nombre = { type: 'text' };
    ponderacion = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    puntaje = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    clasificacion = { type: 'text', hiddenInTable: true, hiddenFilter: true };
    Catalogo_Nacionalidad = { type: 'WSELECT', ModelObject: () => new Catalogo_Nacionalidad(), hiddenInTable: true };

    static async ChargeMunicipios(editObject, /** @type {WForm} */ Form) {
        const municipios = await new Catalogo_Municipio({
            FilterData: [{
                PropName: "id_departamento", FilterType: "in", Values: [editObject.Catalogo_Departamento.id_departamento.toString()]
            }]
        }).Get();
        Form.ModelObject.Catalogo_Municipio.Dataset = municipios;
        if (municipios.length == 0) {
            Form.ModelObject.Catalogo_Municipio.require = false;
        } else {
            Form.ModelObject.Catalogo_Municipio.require = true;
        }
        //this.Tbl_Servicios_editObject.disabled = false;
        editObject.Catalogo_Municipio = municipios[0];
        Form.Controls.Catalogo_Municipio.Dataset = municipios;
        Form.Controls.Catalogo_Municipio.selectedItems = municipios[0] ?  [municipios[0]] : [];
        Form.Controls.Catalogo_Municipio.Draw();
    }
}
export { Catalogo_Departamento }
class Catalogo_Inversores extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
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
        Object.assign(this, props);
    }
    id_municipio = { type: 'number', primary: true };
    nombre = { type: 'text' };
    Catalogo_Departamento = { type: 'WSELECT', ModelObject: () => new Catalogo_Departamento() };
}
export { Catalogo_Municipio }
class Catalogo_Nacionalidad extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
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
        Object.assign(this, props);
    }
    id_profesion = { type: 'number', primary: true };
    nombre = { type: 'text' };
}
export { Catalogo_Profesiones }

class Transaction_Contratos_Inversionistas extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
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
        Object.assign(this, props);
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
        Object.assign(this, props);
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
        Object.assign(this, props);
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
class Catalogo_Sucursales_ModelComponent extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }
    Id_Sucursal = { type: 'number', primary: true };
    Nombre = { type: 'text' };
    Descripcion = { type: 'text', hiddenInTable: true };
    Direccion = { type: 'text' };
    Catalogo_Municipio = { type: 'WSELECT', ModelObject: () => new Catalogo_Municipio(), hiddenInTable: true };

}
export { Catalogo_Sucursales_ModelComponent }

class Datos_Configuracion extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }
    Encabezado = { type: 'text' };
    AutoDebito = { type: 'checkbox' };
    Catalogo_Sucursales = { type: 'WSELECT', ModelObject: () => new Catalogo_Sucursales_ModelComponent() };
}
export { Datos_Configuracion }





