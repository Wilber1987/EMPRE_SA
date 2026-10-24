//@ts-check

import { Catalogo_Tipo_Identificacion } from "../ClientModule/FrontModel/Catalogo_Clientes.js";
import { WForm } from "../WDevCore/WComponents/WForm.js";
// @ts-ignore
import { ModelProperty } from "../WDevCore/WModules/CommonModel.js";
import { EntityClass } from "../WDevCore/WModules/EntityClass.js";
import { DateTime } from "../WDevCore/WModules/Types/DateTime.js";
import { Catalogo_Departamento, Catalogo_Municipio, Catalogo_Profesiones } from "./DBODataBaseModel.js";

class Condicion_Laboral_Cliente extends EntityClass {
    /**
     * @param {Partial<Condicion_Laboral_Cliente>} [props]
     */
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }
    /**@type {ModelProperty} */  id = { type: 'number', primary: true };
    /**@type {ModelProperty} */  fecha_ingreso = { type: 'date', require: false };
    /**@type {ModelProperty} */  ocupacion_cargo = { type: 'text', require: false  };
    /**@type {ModelProperty} */  nombre_empresa = { type: 'text', require: false  };
    /**@type {ModelProperty} */  ingresos_mensuales = { type: 'number', require: false  };
    /**@type {ModelProperty} */  direccion = { type: 'text', require: false  };
    /**@type {ModelProperty} */  /*Catalogo_Clientes_ModelComponent = { type: 'WSELECT', ModelObject: () => new Catalogo_Clientes_ModelComponent() };*/
    Catalogo_Departamento = {
        type: 'WSELECT', ModelObject: () => new Catalogo_Departamento(), hiddenFilter: true, require: false, 
        action: async (editObject, /** @type {WForm} */ Form) => {
            await Catalogo_Departamento.ChargeMunicipios(editObject, Form);


        },
        hiddenInTable: true
    };
    /**@type {ModelProperty} */  Catalogo_Municipio = { type: 'WSELECT', require: false , ModelObject: () => new Catalogo_Municipio() };


    /**@type {ModelProperty} */  //Catalogo_Departamento = { type: 'WSELECT', ModelObject: () => new Catalogo_Departamento() };
}

export { Condicion_Laboral_Cliente };

export class Catalogo_Clasificacion_Cliente extends EntityClass {
    /**
     * @param {Partial<Catalogo_Clasificacion_Cliente>} [props]
     */
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }

    /**@type {Number?} */  id_clasificacion = null;
    /**@type {String?} */  Descripcion = null;
    /**@type {String?} */  porcentaje = null;
    /**@type {String?} */  Estado = null;
}


export class Catalogo_Clasificacion_Cliente_ModelComponent extends EntityClass {
    /**
     * @param {Partial<Catalogo_Clasificacion_Cliente_ModelComponent>} [props]
     */
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }

    /**@type {ModelProperty} */  id_clasificacion = { type: 'number', primary: true };
    /**@type {ModelProperty} */  Descripcion = { type: 'text' };
    /**@type {ModelProperty} */  porcentaje = { type: 'number' };
    /**@type {ModelProperty} */  Estado = { type: 'select', Dataset: ["ACTIVO", "INACTIVO"] };
}

class Catalogo_Clasificacion_Interes extends EntityClass {
    
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }

    /**@type {ModelProperty} */  id_clasificacion_interes = { type: 'number', primary: true };
    /**@type {ModelProperty} */  Descripcion = { type: 'text' };
    /**@type {ModelProperty} */  porcentaje = { type: 'number' };
    /**@type {ModelProperty} */  Estado = { type: 'select', Dataset: ["ACTIVO", "INACTIVO"] };
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
    /**@type {Catalogo_Tipo_Identificacion?} */Catalogo_Tipo_Identificacion = null;
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
    /**@type {ModelProperty} */  codigo_cliente = { type: 'number', primary: true };
    /**@type {ModelProperty} */  primer_nombre = { type: 'text' };
    /**@type {ModelProperty} */  segundo_nombre = { type: 'text', hiddenFilter: true, require: false };
    /**@type {ModelProperty} */  primer_apellido = { type: 'text' };
    /**@type {ModelProperty} */  segundo_apellidio = { type: 'text', require: false };
    Catalogo_Tipo_Identificacion = {
        type: 'WSELECT', ModelObject: () => new Catalogo_Tipo_Identificacion(), label: "Tipo Identificación",
        hiddenFilter: true, hiddenInTable: true
    };
    /**@type {ModelProperty} */  identificacion = { type: 'text' };
    sexo = {
        type: 'select',
        Dataset: [{ id: "Masculino", Descripcion: "Masculino" }, { id: "Femenino", Descripcion: "Femenino" }], hiddenInTable: true, hiddenFilter: true
    };
    /**@type {ModelProperty} */  fecha_nacimiento = { type: 'date', hiddenFilter: true, hiddenInTable: true };
    /**@type {ModelProperty} */  id_departamento = { type: 'number', hiddenInTable: true, hiddenFilter: true, hidden: true };
    /**@type {ModelProperty} */  id_municipio = { type: 'number', hiddenInTable: true, hiddenFilter: true, hidden: true };
    /**@type {ModelProperty} */  //id_tipo_identificacion = { type: 'number', hiddenInTable: true, hiddenFilter: true, hidden: true };
    /**@type {ModelProperty} */  correo = { type: 'text', hiddenInTable: true, hiddenFilter: true, require: false };
    /**@type {ModelProperty} */  operadora_celular = { type: 'select', Dataset: ["Tigo", "Claro"], hiddenInTable: true, hiddenFilter: true };
    /**@type {ModelProperty} */  telefono = { type: 'tel', hiddenInTable: true, hiddenFilter: true };
    /**@type {ModelProperty} */  direccion = { type: 'text', hiddenInTable: true, hiddenFilter: true };
    /**@type {ModelProperty} */  hora = { type: 'text', hiddenInTable: true, hiddenFilter: true, hidden: true };
    /**@type {ModelProperty} */  fecha = { type: 'date', hiddenInTable: true, hiddenFilter: true, hidden: true };
    /**@type {ModelProperty} */  observaciones = { type: 'text', hiddenInTable: true, hiddenFilter: true, hidden: true };
    /**@type {ModelProperty} */  estado_civil = { type: 'select', Dataset: ["Soltero", "Casado", "Unión libre", "Viudo"], hiddenInTable: true, hiddenFilter: true };

    /**@type {ModelProperty} */  tipo_firma = { type: 'select', Dataset: ["Iletrado", "Ilegible", "Legible"], hiddenInTable: true, hiddenFilter: true };
    /**@type {ModelProperty} */  valor_cliente = { type: 'select', Dataset: [{ id: "MP", Descripcion: "Más prestamos" }, { id: "NMP", Descripcion: "No más prestamos" }], hiddenInTable: true, hiddenFilter: true };

    /**@type {ModelProperty} */  //valor_interes = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    /**@type {ModelProperty} */  solo_acreedor = { type: 'radio', Dataset: ["Ambos", "Si"], hiddenInTable: true, hiddenFilter: true };

    /**@type {ModelProperty} */  Catalogo_Clasificacion_Interes = { type: 'WSELECT', ModelObject: () => new Catalogo_Clasificacion_Interes(), hiddenFilter: true };
    /**@type {ModelProperty} */  //promedio = { type: 'number', hiddenInTable: true, hiddenFilter: true };
    /**@type {ModelProperty} */  Catalogo_Clasificacion_Cliente = { type: 'WSELECT', ModelObject: () => new Catalogo_Clasificacion_Cliente_ModelComponent(), hiddenFilter: true };

    /**@type {ModelProperty} */  Catalogo_Profesiones = { type: 'WSELECT', ModelObject: () => new Catalogo_Profesiones(), hiddenInTable: true, hiddenFilter: true };
    /**@type {ModelProperty} */  Condicion_Laboral_Cliente = { type: 'WSELECT', ModelObject: () => new Condicion_Laboral_Cliente(), hiddenInTable: true, hiddenFilter: true, hidden: true };
    /**@type {ModelProperty} */ Catalogo_Departamento = {
        type: 'WSELECT', ModelObject: () => new Catalogo_Departamento(), hiddenFilter: true,
        action: async (editObject, /** @type {WForm} */ Form) => {
            await Catalogo_Departamento.ChargeMunicipios(editObject, Form);
        },
        hiddenInTable: true
    };

    /**@type {ModelProperty} */ Catalogo_Municipio = {
        type: 'WSELECT', ModelObject: () => new Catalogo_Municipio(), hiddenFilter: true,
        action: async (editObject, /** @type {WForm} */ Form) => {
            const findObject = this.Catalogo_Departamento.Dataset?.find(d => d.id_departamento == editObject.Catalogo_Municipio.id_departamento);
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

export { Catalogo_Clientes_ModelComponent };
export { Catalogo_Clasificacion_Interes };
