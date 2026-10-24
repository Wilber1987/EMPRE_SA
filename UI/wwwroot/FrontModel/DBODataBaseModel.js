//@ts-check
import { WForm } from "../WDevCore/WComponents/WForm.js";
// @ts-ignore
import { FilterData, ModelProperty } from "../WDevCore/WModules/CommonModel.js";
import { EntityClass } from "../WDevCore/WModules/EntityClass.js";
import { Catalogo_Cuentas_ModelComponent, Catalogo_Sucursales_ModelComponent } from "./Catalogo_Cuentas.js";
import { Catalogo_Categoria } from "./Model.js";

class Catalogo_Estados_Articulos extends EntityClass {
    /**
    * @param {Partial<Catalogo_Estados_Articulos>} [props]
    */
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
    /**
    * @param {Partial<Catalogo_Estados_Articulos_ModelComponent>} [props]
    */
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }
    /**@type {ModelProperty} */id_estado_articulo = { type: 'number', primary: true };
    /**@type {ModelProperty} */nombre = { type: 'text' };
    /**@type {ModelProperty} */descripcion = { type: 'text', hiddenInTable: true };
    /**@type {ModelProperty} */porcentaje_compra = { type: 'number' };
    /**@type {ModelProperty} */porcentaje_empeno = { type: 'number' };
    /**@type {ModelProperty} */Porcentaje_venta_compra = { type: 'number' };
    /**@type {ModelProperty} */Porcentaje_venta_empeno = { type: 'number' };
    /**@type {ModelProperty} */ Categoria = { type: 'Text', isReadOnly: true }
    /**@type {ModelProperty?} */ valor_compra_cordobas = null;
    /**@type {ModelProperty?} */ valor_compra_dolares = null;
    /**@type {ModelProperty?} */ valor_empeño_cordobas = null;
    /**@type {ModelProperty?} */ valor_empeño_dolares = null;
    /**@type {ModelProperty?} */ porcentaje_venta_compra = null;
    /**@type {ModelProperty?} */ porcentaje_venta_empeno = null;
}
export { Catalogo_Estados_Articulos_ModelComponent }


class Catalogo_Categoria_ModelComponent extends EntityClass {
    /**
    * @param {Partial<Catalogo_Categoria_ModelComponent>} [props]
    */
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }
    /**@type {ModelProperty} */ id_categoria = { type: 'number', primary: true };
    /**@type {ModelProperty} */ tipo = { type: 'text' };
    /**@type {ModelProperty} */ descripcion = { type: 'text', hiddenFilter: true, require: false };
    /**@type {ModelProperty} */ plazo_limite = { type: 'number' };
    /**@type {ModelProperty} */ prioridad = { type: 'number', hiddenInTable: true };
    /**@type {ModelProperty} */ IsForVehiculo = { type: 'checkbox', hiddenInTable: true, label: "Para Vehículo" };
    /**@type {ModelProperty} */ Catalogo_Estados_Articulos = { type: "MasterDetail", ModelObject: () => new Catalogo_Estados_Articulos_ModelComponent(), require: false }
}
export { Catalogo_Categoria_ModelComponent }

class Catalogo_Cambio_Divisa_ModelComponent extends EntityClass {
    /**
    * @param {Partial<Catalogo_Cambio_Divisa_ModelComponent>} [props]
    */
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







class Catalogo_Departamento extends EntityClass {
    /**
    * @param {Partial<Catalogo_Departamento>} [props]
    */
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }
    /**@type {ModelProperty} */ id_departamento = { type: 'number', primary: true };
    /**@type {ModelProperty} */ nombre = { type: 'text' };
    /**@type {ModelProperty} */ ponderacion = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    /**@type {ModelProperty} */ puntaje = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    /**@type {ModelProperty} */ clasificacion = { type: 'text', hiddenInTable: true, hiddenFilter: true };
    /**@type {ModelProperty} */ Catalogo_Nacionalidad = { type: 'WSELECT', ModelObject: () => new Catalogo_Nacionalidad(), hiddenInTable: true };

    /**
     * @param {{ Catalogo_Departamento: { id_departamento: { toString: () => any; }; }; Catalogo_Municipio: any; }} editObject
     */
    static async ChargeMunicipios(editObject, /** @type {WForm} */ Form) {
        const municipios = await new Catalogo_Municipio({
            FilterData: [
                FilterData.In("id_departamento", [editObject.Catalogo_Departamento.id_departamento.toString()])
            ]
        }).Get();
        Form.ModelObject.Catalogo_Municipio.Dataset = municipios;
        if (municipios.length == 0) {
            Form.ModelObject.Catalogo_Municipio.require = false;
        } else {
            Form.ModelObject.Catalogo_Municipio.require = true;
        }
        //this.Tbl_Servicios_editObject.disabled = false;
        editObject.Catalogo_Municipio = municipios[0];
        // @ts-ignore
        Form.Controls.Catalogo_Municipio.Dataset = municipios;
        // @ts-ignore
        Form.Controls.Catalogo_Municipio.selectedItems = municipios[0] ? [municipios[0]] : [];
        // @ts-ignore
        Form.Controls.Catalogo_Municipio.Draw();
    }
}
export { Catalogo_Departamento }
class Catalogo_Inversores extends EntityClass {
    /**
    * @param {Partial<Catalogo_Inversores>} [props]
    */
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }
    /**@type {ModelProperty} */ id_inversor = { type: 'number', primary: true };
    /**@type {ModelProperty} */ nombre = { type: 'text' };
    /**@type {ModelProperty} */ identificacion = { type: 'text' };
    /**@type {ModelProperty} */ telefono = { type: 'tel' };
    /**@type {ModelProperty} */ stado_civil = { type: 'select', Dataset: ["Soltero", "Casado"], hiddenInTable: true, hiddenFilter: true };
    /**@type {ModelProperty} */ direccion = { type: 'text', hiddenInTable: true, hiddenFilter: true };
    /**@type {ModelProperty} */ Catalogo_Municipio = { type: 'WSELECT', ModelObject: () => new Catalogo_Municipio(), hiddenInTable: true, hiddenFilter: true };
    /**@type {ModelProperty} */ Catalogo_Nacionalidad = { type: 'WSELECT', ModelObject: () => new Catalogo_Nacionalidad(), hiddenInTable: true, hiddenFilter: true };
}
export { Catalogo_Inversores }
class Catalogo_Municipio extends EntityClass {
    /**
    * @param {Partial<Catalogo_Municipio>} [props]
    */
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }
    /**@type {ModelProperty} */ id_municipio = { type: 'number', primary: true };
    /**@type {ModelProperty} */ nombre = { type: 'text' };
    /**@type {ModelProperty} */ Catalogo_Departamento = { type: 'WSELECT', ModelObject: () => new Catalogo_Departamento() };
}
export { Catalogo_Municipio }
class Catalogo_Nacionalidad extends EntityClass {
    /**
    * @param {Partial<Catalogo_Nacionalidad>} [props]
    */
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }
    /**@type {ModelProperty} */ id_nacionalidad = { type: 'number', primary: true };
    /**@type {ModelProperty} */ nombre = { type: 'text' };
    /**@type {ModelProperty} */ nacionalidad = { type: 'text' };
    /**@type {ModelProperty} */ ponderacion = { type: 'number', hiddenFilter: true };
    /**@type {ModelProperty} */ puntaje = { type: 'number', hiddenFilter: true };
    /**@type {ModelProperty} */ clasificacion = { type: 'text' };
}
export { Catalogo_Nacionalidad }
class Catalogo_Profesiones extends EntityClass {
    /**
    * @param {Partial<Catalogo_Profesiones>} [props]
    */
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }
    /**@type {ModelProperty} */ id_profesion = { type: 'number', primary: true };
    /**@type {ModelProperty} */ nombre = { type: 'text' };
}
export { Catalogo_Profesiones }

class Transaction_Contratos_Inversionistas extends EntityClass {
    /**
    * @param {Partial<Transaction_Contratos_Inversionistas>} [props]
    */
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }
    /**@type {ModelProperty} */ numero_cont = { type: 'number', primary: true };
    /**@type {ModelProperty} */ fecha = { type: 'date' };
    /**@type {ModelProperty} */ taza = { type: 'number' };
    /**@type {ModelProperty} */ monto_inicial = { type: 'number' };
    /**@type {ModelProperty} */ nombre_sustituto = { type: 'text' };
    /**@type {ModelProperty} */ identificacion_sustituto = { type: 'text' };
    /**@type {ModelProperty} */ direccion_sustituto = { type: 'text' };
    /**@type {ModelProperty} */ departamento_sus = { type: 'text' };
    /**@type {ModelProperty} */ municipio_sustituto = { type: 'text' };
    /**@type {ModelProperty} */ fecha_pago = { type: 'date' };
    /**@type {ModelProperty} */ fecha_ultimo_pago = { type: 'date' };
    /**@type {ModelProperty} */ saldo = { type: 'number' };
    /**@type {ModelProperty} */ montointeres = { type: 'number' };
    /**@type {ModelProperty} */ interes = { type: 'number' };
    /**@type {ModelProperty} */ fecha_restructura = { type: 'date' };
    /**@type {ModelProperty} */ Catalogo_Inversores = { type: 'WSELECT', ModelObject: () => new Catalogo_Inversores() };
}
export { Transaction_Contratos_Inversionistas }
class Transaction_Egresos extends EntityClass {
    /**
    * @param {Partial<Transaction_Egresos>} [props]
    */
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }
    /**@type {ModelProperty} */ numero_egreso = { type: 'number', primary: true };
    /**@type {ModelProperty} */ monto = { type: 'number' };
    /**@type {ModelProperty} */ fecha = { type: 'date' };
    /**@type {ModelProperty} */ descripcion = { type: 'text' };
    /**@type {ModelProperty} */ nombre = { type: 'text' };
    /**@type {ModelProperty} */ banco = { type: 'text' };
    /**@type {ModelProperty} */ anulado = { type: 'text' };
    /**@type {ModelProperty} */ observaciones = { type: 'text' };
    /**@type {ModelProperty} */ tc = { type: 'number' };
    /**@type {ModelProperty} */ dolar = { type: 'number' };
    /**@type {ModelProperty} */ fanulado = { type: 'date' };
}
export { Transaction_Egresos }

class Transaction_Ingresos extends EntityClass {
    /**
    * @param {Partial<Transaction_Ingresos>} [props]
    */
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }
    /**@type {ModelProperty} */ numero_ingreso = { type: 'number', primary: true };
    /**@type {ModelProperty} */ monto = { type: 'number' };
    /**@type {ModelProperty} */ fecha = { type: 'date' };
    /**@type {ModelProperty} */ descripcion = { type: 'text' };
    /**@type {ModelProperty} */ nombre = { type: 'text' };
    /**@type {ModelProperty} */ que = { type: 'number' };
    /**@type {ModelProperty} */ anulado = { type: 'text' };
    /**@type {ModelProperty} */ observaciones = { type: 'text' };
    /**@type {ModelProperty} */ tzcambio = { type: 'number' };
    /**@type {ModelProperty} */ total = { type: 'number' };
    /**@type {ModelProperty} */ fanulado = { type: 'date' };
}
export { Transaction_Ingresos }
class Transaction_Ingresos_Egresos extends EntityClass {
    /**
    * @param {Partial<Transaction_Ingresos_Egresos>} [props]
    */
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }
    /**@type {ModelProperty} */ id_transaccion = { type: 'number', primary: true };
    /**@type {ModelProperty} */ monto_dolares = { type: 'number' };
    /**@type {ModelProperty} */ tasa_cambio = { type: 'number' };
    /**@type {ModelProperty} */ monto_total = { type: 'number' };
    /**@type {ModelProperty} */ descripcion = { type: 'text' };
    /**@type {ModelProperty} */ nombre = { type: 'text' };
    /**@type {ModelProperty} */ que = { type: 'number' };
    /**@type {ModelProperty} */ fecha_anulado = { type: 'date' };
    /**@type {ModelProperty} */ banco = { type: 'text' };
    /**@type {ModelProperty} */ estado = { type: 'select', Dataset: ["ACTIVO", "INACTIVO"] };
    /**@type {ModelProperty} */ numero_original = { type: 'number' };
    /**@type {ModelProperty} */ fecha = { type: 'date' };
    /**@type {ModelProperty} */ Catalogo_Cuentas = { type: 'WSELECT', ModelObject: () => new Catalogo_Cuentas_ModelComponent() };
}
export { Transaction_Ingresos_Egresos }

class Datos_Configuracion extends EntityClass {
    /**
    * @param {Partial<Datos_Configuracion>} [props]
    */
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }
    /**@type {ModelProperty} */ Encabezado = { type: 'text' };
    /**@type {ModelProperty} */ AutoDebito = { type: 'checkbox' };
    /**@type {ModelProperty} */ Catalogo_Sucursales = { type: 'WSELECT', ModelObject: () => new Catalogo_Sucursales_ModelComponent() };
}
export { Datos_Configuracion }





