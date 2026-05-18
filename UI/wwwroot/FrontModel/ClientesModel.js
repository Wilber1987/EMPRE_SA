//@ts-check

import { Catalogo_Tipo_Identificacion } from "../ClientModule/FrontModel/Catalogo_Clientes.js";
import {EntityClass} from "../WDevCore/WModules/EntityClass.js";
import { DateTime } from "../WDevCore/WModules/Types/DateTime.js";
import { Catalogo_Departamento, Catalogo_Municipio, Catalogo_Profesiones } from "./DBODataBaseModel.js";

class Condicion_Laboral_Cliente extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }
    id = { type: 'number', primary: true };
    fecha_ingreso = { type: 'date' };
    ocupacion_cargo = { type: 'text' };
    nombre_empresa = { type: 'text' };
    ingresos_mensuales = { type: 'number' };
    direccion = { type: 'text' };
    /*Catalogo_Clientes_ModelComponent = { type: 'WSELECT', ModelObject: () => new Catalogo_Clientes_ModelComponent() };*/
    Catalogo_Departamento = {
        type: 'WSELECT', ModelObject: () => new Catalogo_Departamento(), hiddenFilter: true,
        action: async (editObject, /** @type {WForm} */ Form) => {
            await Catalogo_Departamento.ChargeMunicipios(editObject, Form);


        },
        hiddenInTable: true
    };
    Catalogo_Municipio = { type: 'WSELECT', ModelObject: () => new Catalogo_Municipio() };


    //Catalogo_Departamento = { type: 'WSELECT', ModelObject: () => new Catalogo_Departamento() };
}

export {Condicion_Laboral_Cliente};

class Catalogo_Clasificacion_Cliente extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }

    id_clasificacion = {type: 'number', primary: true};
    Descripcion = {type: 'text'};
    porcentaje = {type: 'number'};
    Estado = {type: 'select', Dataset: ["ACTIVO", "INACTIVO"]};
}

class Catalogo_Clasificacion_Interes extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }

    id_clasificacion_interes = {type: 'number', primary: true};
    Descripcion = {type: 'text'};
    porcentaje = {type: 'number'};
    Estado = {type: 'select', Dataset: ["ACTIVO", "INACTIVO"]};
}

class Catalogo_Clientes extends EntityClass {
    /**
    * @param {Partial<Catalogo_Clientes>} [props]
    */
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }    
    /**@type {Number?} */ codigo_cliente = null;
    /**@type {String?} */ primer_nombre = null;
    /**@type {String?} */segundo_nombre = null;
    /**@type {String?} */primer_apellido = null;
    /**@type {String?} */segundo_apellidio = null;
    /**@type {Catalogo_Tipo_Identificacion?} */Catalogo_Tipo_Identificacion  = null;
    /**@type {String?} */identificacion = null;
    /**@type {String?} */sexo = null;
    /**@type {DateTime?} */fecha_nacimiento = null;
    /**@type {Number?} */id_departamento = null;
    /**@type {Number?} */ id_municipio = null;
    /**@type {String?} */correo = null;
    /**@type {String?} */operadora_celular = null;
    /**@type {String?} */telefono = null;
    /**@type {String?} */direccion = null;
    /**@type {String?} */hora = null;
    /**@type {DateTime?} */fecha = null;
    /**@type {String?} */observaciones = null;
    /**@type {String?} */estado_civil = null;
    /**@type {Catalogo_Clasificacion_Cliente?} */ Catalogo_Clasificacion_Interes = null;
     get Nombre_completo() {
        return `${this.primer_nombre} ${this.segundo_nombre} ${this.primer_apellido} ${this.segundo_apellidio}`
    }
    
}
export { Catalogo_Clientes }

class Catalogo_Clientes_ModelComponent extends EntityClass {
    /**
    * @param {Partial<Catalogo_Clientes_ModelComponent>} [props]
    */
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
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
    fecha_nacimiento = { type: 'date', hiddenFilter: true, hiddenInTable: true };
    id_departamento = { type: 'number', hiddenInTable: true, hiddenFilter: true, hidden: true };
    id_municipio = { type: 'number', hiddenInTable: true, hiddenFilter: true, hidden: true };
    //id_tipo_identificacion = { type: 'number', hiddenInTable: true, hiddenFilter: true, hidden: true };
    correo = { type: 'text', hiddenInTable: true, hiddenFilter: true, require: false };
    operadora_celular = { type: 'select', Dataset: ["Tigo", "Claro"], hiddenInTable: true, hiddenFilter: true };
    telefono = { type: 'tel', hiddenInTable: true, hiddenFilter: true };
    direccion = { type: 'text', hiddenInTable: true, hiddenFilter: true };
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
    Catalogo_Departamento = {
        type: 'WSELECT', ModelObject: () => new Catalogo_Departamento(), hiddenFilter: true,
        action: async (editObject, /** @type {WForm} */ Form) => {
            await Catalogo_Departamento.ChargeMunicipios(editObject, Form);
        },
        hiddenInTable: true
    };

    Catalogo_Municipio = {
        type: 'WSELECT', ModelObject: () => new Catalogo_Municipio(), hiddenFilter: true,
        action: async (editObject, /** @type {WForm} */ Form) => {
            const findObject = this.Catalogo_Departamento.Dataset.find(d => d.id_departamento == editObject.Catalogo_Municipio.id_departamento);
            editObject.Catalogo_Departamento = findObject;
            Form.shadowRoot.querySelector("#ControlValueCatalogo_Departamento").selectedItems = [findObject]
            Form.shadowRoot.querySelector("#ControlValueCatalogo_Departamento").Draw();
        },
        hiddenInTable: true
    };

    get Nombre_completo() {
        return `${this.primer_nombre} ${this.segundo_nombre} ${this.primer_apellido} ${this.segundo_apellidio}`
    }


}

export {Catalogo_Clientes_ModelComponent};
export {Catalogo_Clasificacion_Interes};
export {Catalogo_Clasificacion_Cliente};
