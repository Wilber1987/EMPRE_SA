//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools, BasicStates } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Catalogo_Cuentas_ModelComponent }  from './Catalogo_Cuentas_ModelComponent.js'
import { Permisos_Cuentas_ModelComponent }  from './Permisos_Cuentas_ModelComponent.js'
import { Permisos_Cuentas_ModelComponent }  from './Permisos_Cuentas_ModelComponent.js'
class Categoria_Cuentas_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_categoria = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ descripcion = { type: 'text' };
   /**@type {ModelProperty}*/ Catalogo_Cuentas = { type: 'MULTYSELECT',  ModelObject: ()=> new Catalogo_Cuentas_ModelComponent()};
   /**@type {ModelProperty}*/ Permisos_Cuentas = { type: 'MasterDetail',  ModelObject: ()=> new Permisos_Cuentas_ModelComponent()};
   /**@type {ModelProperty}*/ Permisos_Cuentas = { type: 'MasterDetail',  ModelObject: ()=> new Permisos_Cuentas_ModelComponent()};
}
export { Categoria_Cuentas_ModelComponent }
