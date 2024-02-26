//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Categoria_Cuentas }  from './Categoria_Cuentas.js'
import { Categoria_Cuentas }  from './Categoria_Cuentas.js'
class Permisos_Cuentas extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ id_permiso;
   /**@type {Boolean}*/ permite_debito;
   /**@type {Boolean}*/ permite_credito;
   /**@type {Categoria_Cuentas} ManyToOne*/ Categoria_Cuentas;
   /**@type {Categoria_Cuentas} ManyToOne*/ Categoria_Cuentas;
}
export { Permisos_Cuentas }
