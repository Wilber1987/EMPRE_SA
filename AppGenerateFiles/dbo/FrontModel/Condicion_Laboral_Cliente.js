//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools, BasicStates } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Catalogo_Clientes }  from './Catalogo_Clientes.js'
import { Catalogo_Departamento }  from './Catalogo_Departamento.js'
import { Catalogo_Municipio }  from './Catalogo_Municipio.js'
class Condicion_Laboral_Cliente extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ id;
   /**@type {Date}*/ fecha_ingreso;
   /**@type {String}*/ ocupacion_cargo;
   /**@type {Number}*/ ingresos_mensuales;
   /**@type {String}*/ direccion;
   /**@type {String}*/ nombre_empresa;
   /**@type {Catalogo_Clientes} ManyToOne*/ Catalogo_Clientes;
   /**@type {Catalogo_Departamento} ManyToOne*/ Catalogo_Departamento;
   /**@type {Catalogo_Municipio} ManyToOne*/ Catalogo_Municipio;
}
export { Condicion_Laboral_Cliente }
