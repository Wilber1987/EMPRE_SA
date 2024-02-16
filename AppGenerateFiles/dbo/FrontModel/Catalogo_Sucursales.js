//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools, BasicStates } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Catalogo_Cuentas }  from './Catalogo_Cuentas.js'
import { Catalogo_Cuentas }  from './Catalogo_Cuentas.js'
import { Datos_Configuracion }  from './Datos_Configuracion.js'
import { Security_Users }  from './Security_Users.js'
class Catalogo_Sucursales extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ Id_Sucursal;
   /**@type {String}*/ Nombre;
   /**@type {String}*/ Descripcion;
   /**@type {String}*/ Direccion;
   /**@type {Number}*/ id_municipio;
   /**@type {Array<Catalogo_Cuentas>} OneToMany*/ Catalogo_Cuentas;
   /**@type {Array<Catalogo_Cuentas>} OneToMany*/ Catalogo_Cuentas;
   /**@type {Array<Datos_Configuracion>} OneToMany*/ Datos_Configuracion;
   /**@type {Array<Security_Users>} OneToMany*/ Security_Users;
}
export { Catalogo_Sucursales }
