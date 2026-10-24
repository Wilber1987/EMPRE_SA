//@ts-check
// @ts-ignore
import { WForm } from "../WDevCore/WComponents/WForm.js";
import { MultiSelect } from "../WDevCore/WComponents/WMultiSelect.js";
import { ModelProperty } from "../WDevCore/WModules/CommonModel.js";
import { EntityClass } from "../WDevCore/WModules/EntityClass.js";
import { Catalogo_Municipio } from "./DBODataBaseModel.js";

export class Catalogo_Cuentas_ModelComponent extends EntityClass {
    /**
     * @param {Partial<Catalogo_Cuentas_ModelComponent>} [props]
     */
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }
    /**@type {ModelProperty} */
    id_cuentas = { type: 'number', primary: true };
    /**@type {ModelProperty} */
    nombre = { type: 'text' };
    /**@type {ModelProperty} */
    saldo = { type: 'number', disabled: true, hiddenInTable: true, require: false };
    /**@type {ModelProperty} */
    saldo_dolares = { type: 'number', disabled: true, hiddenInTable: true, require: false };
    /**@type {ModelProperty} */
    permite_dolares = { type: "checkbox", require: false, defaultValue: true };
    /**@type {ModelProperty} */
    permite_cordobas = { type: "checkbox", require: false, defaultValue: true };
    /**@type {ModelProperty} */
    tipo_cuenta = { type: 'select', Dataset: ['PROPIA', 'PAGO', 'EXTERNA'] };
    /**@type {ModelProperty} */
    Catalogo_Sucursales = { type: 'WSELECT', ModelObject: () => new Catalogo_Sucursales_ModelComponent() };
    /**@type {ModelProperty} */
    Categoria_Cuentas = { type: 'WSELECT', ModelObject: () => new Categoria_Cuentas_ModelComponent() };
    /**@type {ModelProperty} */
    Transacciones_Permitidas = {
        type: 'MULTISELECT',
        ModelObject: { Descripcion: { type: "text" } },
        Dataset: Object.keys(Transacciones_Permitidas).map(
            transaccion => ({ descripcion: transaccion })
        ), action: (/**@type {Catalogo_Cuentas}*/ cuenta, /**@type {WForm} */ form)=> {
            //**@type {MultiSelect} */ // @ts-ignore
            //const control = form.Controls["Transacciones"];
            //cuenta.Transacciones_Permitidas = control.selectedItems.map((/** @type {{ descripcion: any; }} */ item) => item.descripcion);
        }
    };
}

export class Categoria_Cuentas_ModelComponent extends EntityClass {
    /**
     * @param {Partial<Categoria_Cuentas_ModelComponent>} [props]
     */
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }
    /**@type {ModelProperty} */
    id_categoria = { type: "number", primary: true };
    /**@type {ModelProperty} */
    descripcion = { type: "text" };
}

export class Permisos_Cuentas_ModelComponent extends EntityClass {
    /**
     * @param {Partial<Permisos_Cuentas_ModelComponent>} [props]
     */
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }
    /**@type {ModelProperty} */
    id_permiso = { type: "number", primary: true };
    /**@type {ModelProperty} */
    Categoria_Cuentas_Origen = { type: 'WSELECT', ModelObject: () => new Categoria_Cuentas_ModelComponent() };
    /**@type {ModelProperty} */
    Categoria_Cuentas_Destino = { type: 'WSELECT', ModelObject: () => new Categoria_Cuentas_ModelComponent() };
    /**@type {ModelProperty} */
    permite_debito = { type: "checkbox", require: false };
    /**@type {ModelProperty} */
    permite_credito = { type: "checkbox", require: false };
    /**@type {ModelProperty} */
    //Categoria_Cuentas = { type: 'WSELECT', ModelObject: () => new Categoria_Cuentas() };//todo eliminar
}

export class Catalogo_Sucursales_ModelComponent extends EntityClass {
    /**
     * @param {Partial<Catalogo_Sucursales_ModelComponent>} [props]
     */
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }
    /**@type {ModelProperty} */
    Id_Sucursal = { type: 'number', primary: true };
    /**@type {ModelProperty} */
    Nombre = { type: 'text' };
    /**@type {ModelProperty} */
    Descripcion = { type: 'text', hiddenInTable: true };
    /**@type {ModelProperty} */
    Direccion = { type: 'text' };
    /**@type {ModelProperty} */
    Catalogo_Municipio = { type: 'WSELECT', ModelObject: () => new Catalogo_Municipio(), hiddenInTable: true };

}

export class Catalogo_Cuentas extends EntityClass {
    /**
     * @param {Partial<Catalogo_Cuentas>} [props]
     */
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }

    /** @type {Number?} */
    id_cuentas = null;

    /** @type {String?} */
    nombre = null;

    /** @type {Number?} */
    saldo = null;

    /** @type {Number?} */
    saldo_dolares = null;

    /** @type {Boolean?} */
    permite_dolares = true;

    /** @type {Boolean?} */
    permite_cordobas = true;

    /** @type {"PROPIA"|"PAGO"|"EXTERNA"|String?} */
    tipo_cuenta = null;

    /** @type {Catalogo_Sucursales?} */
    Catalogo_Sucursales = null;

    /** @type {Categoria_Cuentas?} */
    Categoria_Cuentas = null;

    /** @type {Array<Object>} */
    Transacciones = []

     /** @type {Array<string>} */
    Transacciones_Permitidas = []

    /** @return {Promise<Array<Catalogo_Cuentas>>} */;
    GetOwCuentasCaja = async () => {
        return await this.SaveData("ApiCuentas/GetOwCuentasCaja", this)
    }
}

export class Categoria_Cuentas extends EntityClass {
    /**
     * @param {Partial<Categoria_Cuentas>} [props]
     */
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }

    /** @type {Number?} */
    id_categoria = null;

    /** @type {String?} */
    descripcion = null;
}
export class Permisos_Cuentas extends EntityClass {
    /**
     * @param {Partial<Permisos_Cuentas>} [props]
     */
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }

    /** @type {Number?} */
    id_permiso = null;

    /** @type {Categoria_Cuentas?} */
    Categoria_Cuentas_Origen = null;

    /** @type {Categoria_Cuentas?} */
    Categoria_Cuentas_Destino = null;

    /** @type {Boolean?} */
    permite_debito = null;

    /** @type {Boolean?} */
    permite_credito = null;
}

export class Catalogo_Sucursales extends EntityClass {
    /**
     * @param {Partial<Catalogo_Sucursales>} [props]
     */
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }

    /** @type {Number?} */
    Id_Sucursal = null;

    /** @type {String?} */
    Nombre = null;

    /** @type {String?} */
    Descripcion = null;

    /** @type {String?} */
    Direccion = null;

    /** @type {Catalogo_Municipio?} */
    Catalogo_Municipio = null;
}

const Transacciones_Permitidas =
{
    EGRESO_FACTURA: "EGRESO_FACTURA",
    INGRESO_FACTURA: "INGRESO_FACTURA",
    INGRESO_RECIBO: "INGRESO_RECIBO",
    EGRESO_RECIBO: "EGRESO_RECIBO",
    EGRESO_CONTRATO: "EGRESO_CONTRATO",
    CAMBIO_MONEDA: "CAMBIO_MONEDA", 
    EGRESO_COMPRA: "EGRESO_COMPRA", 
    INGRESO_COMPRA: "INGRESO_COMPRA"
}