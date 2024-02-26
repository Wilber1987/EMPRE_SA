//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Catalogo_Departamento }  from './Catalogo_Departamento.js'
import { Catalogo_Clientes }  from './Catalogo_Clientes.js'
import { Catalogo_Inversores }  from './Catalogo_Inversores.js'
import { Condicion_Laboral_Cliente }  from './Condicion_Laboral_Cliente.js'
class Catalogo_Municipio extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ id_municipio;
   /**@type {String}*/ nombre;
   /**@type {Catalogo_Departamento} ManyToOne*/ Catalogo_Departamento;
   /**@type {Array<Catalogo_Clientes>} OneToMany*/ Catalogo_Clientes;
   /**@type {Array<Catalogo_Inversores>} OneToMany*/ Catalogo_Inversores;
   /**@type {Array<Condicion_Laboral_Cliente>} OneToMany*/ Condicion_Laboral_Cliente;
}
export { Catalogo_Municipio }
