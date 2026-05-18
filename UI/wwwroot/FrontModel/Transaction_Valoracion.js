//@ts-check
import { Cat_Categorias } from "../Facturacion/FrontModel/Cat_Categorias.js";
import { Detail_Valores } from "../Facturacion/FrontModel/Tbl_Lotes.js";
import { WForm } from "../WDevCore/WComponents/WForm.js";
// @ts-ignore
import { ModelProperty } from "../WDevCore/WModules/CommonModel.js";
import {EntityClass} from "../WDevCore/WModules/EntityClass.js";
import { DateTime } from "../WDevCore/WModules/Types/DateTime.js";
import { Catalogo_Categoria_ModelComponent, Catalogo_Estados_Articulos, Catalogo_Estados_Articulos_ModelComponent } from "./DBODataBaseModel.js";

class Transactional_Valoracion_ModelComponent extends EntityClass {
    /**
     * @param {Partial<Transactional_Valoracion_ModelComponent>} [props]
     */
    constructor(props) {
        super(props, 'EntityDBO');
        Object.assign(this, props);
    }

    /**@type {ModelProperty} */ id_valoracion = {type: 'number', primary: true};
    /**@type {ModelProperty} */ Descripcion = {type: 'textarea'};
    /**@type {ModelProperty} */ Serie = {type: 'text', require: false};
    /**@type {ModelProperty} */ Marca = {type: 'text'};
    /**@type {ModelProperty} */ Modelo = {type: 'text'};
    /**@type {ModelProperty} */ Catalogo_Categoria = {
        type: 'WSELECT',
        ModelObject: () => new Catalogo_Categoria_ModelComponent(), action: (/**@type {Transactional_Valoracion} */ObjectF, /**@type {WForm} */ form,) => {
            // console.log(ObjectF.Catalogo_Categoria.plazo_limite);
            this.Plazo.max = ObjectF?.Catalogo_Categoria?.plazo_limite ?? 6;
            if (ObjectF.Plazo > this.Plazo.max) {
                ObjectF.Plazo = this.Plazo.max;
            }
            form.DrawComponent();
        }, hiddenFilter: true
    };
    /**@type {ModelProperty} */ Plazo = {type: 'number', hiddenInTable: true, max: 24, min: 1, hiddenFilter: true};
    /**@type {ModelProperty} */ Tasa_interes = {
        type: 'number',
        hiddenInTable: true,
        Dataset: [],
        hiddenFilter: true
    };
    /**@type {ModelProperty} */ Fecha = {type: 'date', hiddenInTable: true, hiddenFilter: true};
    /**@type {ModelProperty} */ Tasa_de_cambio = {type: 'money', hiddenInTable: true, hiddenFilter: true};
    /**@type {ModelProperty} */ Valoracion_compra_cordobas = {type: 'money', hiddenFilter: true};
    /**@type {ModelProperty} */ Valoracion_compra_dolares = {type: 'money', hiddenFilter: true};
    /**@type {ModelProperty} */ Valoracion_empeño_cordobas = {type: 'money', hiddenFilter: true};
    /**@type {ModelProperty} */ Valoracion_empeño_dolares = {type: 'money', hiddenFilter: true};
    /**@type {ModelProperty} */ Catalogo_Estados_Articulos = {
        type: 'WSELECT',
        ModelObject: () => new Catalogo_Estados_Articulos_ModelComponent(),
        hiddenFilter: true
    };
    //TASAS DE INTERES
    //Valoracion_empeño_dolares = { type: 'operation' };

    /**@type {ModelProperty} */ Precio_venta_empeño_cordobas = {type: 'number', hidden: true};
    /**@type {ModelProperty} */ Precio_venta_empeño_dolares = {type: 'number', hidden: true};
    /**@type {ModelProperty} */ Detail_Valores = {type: 'MASTERDETAIL', hidden: true}
    /**@type {ModelProperty?} */ requiere_valoracion = null
    GuardarValoraciones = async (/** @type {any[] | undefined} */ valoraciones) => {
        return await this.SaveData("Transactional_Valoracion/GuardarValoraciones", {valoraciones: valoraciones})
    }

    requireReValoracion(dias = 40) {
        // @ts-ignore
        return new Date().subtractDays(dias) > new Date(this.Fecha);
    }
}

export {Transactional_Valoracion_ModelComponent};

class Transactional_Valoracion extends EntityClass {
    /**
     * @param {Partial<Transactional_Valoracion>} [props]
     */
    constructor(props) {
        super(props, 'TransactionLotes');
        Object.assign(this, props);
    }

    /** @type {Number?} */ id_valoracion = null;
    /** @type {String?} */ Descripcion = null;
    /** @type {String?} */ Serie = null;
    /** @type {String?} */ Marca = null;
    /** @type {String?} */ Modelo = null;
    /** @type {Cat_Categorias?} */ Catalogo_Categoria = null;
    /** @type {Number?} */ Plazo = null;
    /** @type {Number?} */ Tasa_interes = null;
    /** @type {Date?} */ Fecha = null;
    /** @type {Number?} */ Tasa_de_cambio = null;
    /** @type {Number?} */ Valoracion_compra_cordobas = null;
    /** @type {Number?} */ Valoracion_compra_dolares = null;
    /** @type {Number?} */ Valoracion_empeño_cordobas = null;
    /** @type {Number?} */ Valoracion_empeño_dolares = null;
    /** @type {Catalogo_Estados_Articulos?} */ Catalogo_Estados_Articulos = null;
    /** @type {Number?} */ Precio_venta_empeño_cordobas = null;
    /** @type {Number?} */ Precio_venta_empeño_dolares = null;
    /** @type {Number?} */ id_estado = null;
    /** @type {Detail_Valores?} */ Detail_Valores = null;

    

    GuardarValoraciones = async (/** @type {any} */ valoraciones) => {
        return await this.SaveData("Transactional_Valoracion/GuardarValoraciones", {valoraciones: valoraciones})
    }

    requireReValoracion(dias = 40) {
        // @ts-ignore
        return new Date().subtractDays(dias) > new Date(this.Fecha);
    }

}

export {Transactional_Valoracion};