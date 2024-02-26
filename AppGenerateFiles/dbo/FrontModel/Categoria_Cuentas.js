//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Catalogo_Cuentas }  from './Catalogo_Cuentas.js'
import { Permisos_Cuentas }  from './Permisos_Cuentas.js'
import { Permisos_Cuentas }  from './Permisos_Cuentas.js'
class Categoria_Cuentas extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ id_categoria;
   /**@type {String}*/ descripcion;
   /**@type {Array<Catalogo_Cuentas>} OneToMany*/ Catalogo_Cuentas;
   /**@type {Array<Permisos_Cuentas>} OneToMany*/ Permisos_Cuentas;
   /**@type {Array<Permisos_Cuentas>} OneToMany*/ Permisos_Cuentas;
}
export { Categoria_Cuentas }
