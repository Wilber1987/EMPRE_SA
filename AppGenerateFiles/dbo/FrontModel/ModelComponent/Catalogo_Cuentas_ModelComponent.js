//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Catalogo_Sucursales_ModelComponent }  from './Catalogo_Sucursales_ModelComponent.js'
import { Catalogo_Sucursales_ModelComponent }  from './Catalogo_Sucursales_ModelComponent.js'
import { Categoria_Cuentas_ModelComponent }  from './Categoria_Cuentas_ModelComponent.js'
class Catalogo_Cuentas_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_cuentas = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ nombre = { type: 'text' };
   /**@type {ModelProperty}*/ tipo_cuenta = { type: 'text' };
   /**@type {ModelProperty}*/ saldo = { type: 'number' };
   /**@type {ModelProperty}*/ saldo_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ permite_dolares = { type: 'checkbox' };
   /**@type {ModelProperty}*/ permite_cordobas = { type: 'checkbox' };
   /**@type {ModelProperty}*/ Catalogo_Sucursales = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Sucursales_ModelComponent()};
   /**@type {ModelProperty}*/ Catalogo_Sucursales = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Sucursales_ModelComponent()};
   /**@type {ModelProperty}*/ Categoria_Cuentas = { type: 'WSELECT',  ModelObject: ()=> new Categoria_Cuentas_ModelComponent()};
}
export { Catalogo_Cuentas_ModelComponent }
