//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools, BasicStates } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Catalogo_Nacionalidad }  from './Catalogo_Nacionalidad.js'
import { Catalogo_Clientes }  from './Catalogo_Clientes.js'
import { Catalogo_Municipio }  from './Catalogo_Municipio.js'
import { Condicion_Laboral_Cliente }  from './Condicion_Laboral_Cliente.js'
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
