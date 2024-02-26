//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Catalogo_Categoria_ModelComponent }  from './Catalogo_Categoria_ModelComponent.js'
import { Catalogo_Estados_Articulos_ModelComponent }  from './Catalogo_Estados_Articulos_ModelComponent.js'
import { Detail_Prendas_ModelComponent }  from './Detail_Prendas_ModelComponent.js'
import { Detail_Valores_ModelComponent }  from './Detail_Valores_ModelComponent.js'
class Transactional_Valoracion_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_valoracion = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ Descripcion = { type: 'text' };
   /**@type {ModelProperty}*/ Marca = { type: 'text' };
   /**@type {ModelProperty}*/ Modelo = { type: 'text' };
   /**@type {ModelProperty}*/ Tasa_interes = { type: 'number' };
   /**@type {ModelProperty}*/ Plazo = { type: 'number' };
   /**@type {ModelProperty}*/ Fecha = { type: 'date' };
   /**@type {ModelProperty}*/ Tasa_de_cambio = { type: 'number' };
   /**@type {ModelProperty}*/ valoracion_compra_cordobas = { type: 'number' };
   /**@type {ModelProperty}*/ valoracion_compra_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ valoracion_empeño_cordobas = { type: 'number' };
   /**@type {ModelProperty}*/ valoracion_empeño_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ Serie = { type: 'text' };
   /**@type {ModelProperty}*/ precio_venta_empeño_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ precio_venta_empeño_cordobas = { type: 'number' };
   /**@type {ModelProperty}*/ Catalogo_Categoria = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Categoria_ModelComponent()};
   /**@type {ModelProperty}*/ Catalogo_Estados_Articulos = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Estados_Articulos_ModelComponent()};
   /**@type {ModelProperty}*/ Detail_Prendas = { type: 'MasterDetail',  ModelObject: ()=> new Detail_Prendas_ModelComponent()};
   /**@type {ModelProperty}*/ Detail_Valores = { type: 'MasterDetail',  ModelObject: ()=> new Detail_Valores_ModelComponent()};
}
export { Transactional_Valoracion_ModelComponent }
