//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Categoria_Cuentas_ModelComponent }  from './Categoria_Cuentas_ModelComponent.js'
import { Categoria_Cuentas_ModelComponent }  from './Categoria_Cuentas_ModelComponent.js'
class Permisos_Cuentas_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_permiso = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ permite_debito = { type: 'checkbox' };
   /**@type {ModelProperty}*/ permite_credito = { type: 'checkbox' };
   /**@type {ModelProperty}*/ Categoria_Cuentas = { type: 'WSELECT',  ModelObject: ()=> new Categoria_Cuentas_ModelComponent()};
   /**@type {ModelProperty}*/ Categoria_Cuentas = { type: 'WSELECT',  ModelObject: ()=> new Categoria_Cuentas_ModelComponent()};
}
export { Permisos_Cuentas_ModelComponent }
