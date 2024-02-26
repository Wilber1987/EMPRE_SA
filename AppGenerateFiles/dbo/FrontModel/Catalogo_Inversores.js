//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Catalogo_Municipio }  from './Catalogo_Municipio.js'
import { Catalogo_Nacionalidad }  from './Catalogo_Nacionalidad.js'
import { Transaction_Contratos_Inversionistas }  from './Transaction_Contratos_Inversionistas.js'
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
