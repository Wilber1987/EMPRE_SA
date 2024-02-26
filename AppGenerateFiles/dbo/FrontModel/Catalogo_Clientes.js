//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Catalogo_Clasificacion_Cliente }  from './Catalogo_Clasificacion_Cliente.js'
import { Catalogo_Clasificacion_Interes }  from './Catalogo_Clasificacion_Interes.js'
import { Catalogo_Departamento }  from './Catalogo_Departamento.js'
import { Catalogo_Municipio }  from './Catalogo_Municipio.js'
import { Catalogo_Profesiones }  from './Catalogo_Profesiones.js'
import { Catalogo_Tipo_Identificacion }  from './Catalogo_Tipo_Identificacion.js'
import { Condicion_Laboral_Cliente }  from './Condicion_Laboral_Cliente.js'
import { Transaction_Contratos }  from './Transaction_Contratos.js'
class Catalogo_Clientes extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ codigo_cliente;
   /**@type {String}*/ primer_nombre;
   /**@type {String}*/ segundo_nombre;
   /**@type {String}*/ primer_apellido;
   /**@type {String}*/ segundo_apellidio;
   /**@type {String}*/ identificacion;
   /**@type {String}*/ sexo;
   /**@type {Date}*/ fecha_nacimiento;
   /**@type {String}*/ correo;
   /**@type {String}*/ telefono;
   /**@type {String}*/ direccion;
   /**@type {String}*/ hora;
   /**@type {Date}*/ fecha;
   /**@type {String}*/ observaciones;
   /**@type {String}*/ estado_civil;
   /**@type {Number}*/ tipoc;
   /**@type {String}*/ tipo_firma;
   /**@type {String}*/ valor_cliente;
   /**@type {String}*/ operadora_celular;
   /**@type {Number}*/ valor_interes;
   /**@type {String}*/ solo_acreedor;
   /**@type {Number}*/ promedio;
   /**@type {Catalogo_Clasificacion_Cliente} ManyToOne*/ Catalogo_Clasificacion_Cliente;
   /**@type {Catalogo_Clasificacion_Interes} ManyToOne*/ Catalogo_Clasificacion_Interes;
   /**@type {Catalogo_Departamento} ManyToOne*/ Catalogo_Departamento;
   /**@type {Catalogo_Municipio} ManyToOne*/ Catalogo_Municipio;
   /**@type {Catalogo_Profesiones} ManyToOne*/ Catalogo_Profesiones;
   /**@type {Catalogo_Tipo_Identificacion} ManyToOne*/ Catalogo_Tipo_Identificacion;
   /**@type {Array<Condicion_Laboral_Cliente>} OneToMany*/ Condicion_Laboral_Cliente;
   /**@type {Array<Transaction_Contratos>} OneToMany*/ Transaction_Contratos;
}
export { Catalogo_Clientes }
