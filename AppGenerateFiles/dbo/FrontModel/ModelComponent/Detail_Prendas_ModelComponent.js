//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Transactional_Valoracion_ModelComponent }  from './Transactional_Valoracion_ModelComponent.js'
import { Catalogo_Categoria_ModelComponent }  from './Catalogo_Categoria_ModelComponent.js'
import { Transaction_Contratos_ModelComponent }  from './Transaction_Contratos_ModelComponent.js'
import { Detail_Prendas_Vehiculos_ModelComponent }  from './Detail_Prendas_Vehiculos_ModelComponent.js'
class Detail_Prendas_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ numero_prenda = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ numero_contrato_OLD = { type: 'number' };
   /**@type {ModelProperty}*/ Descripcion = { type: 'text' };
   /**@type {ModelProperty}*/ pprenda = { type: 'number' };
   /**@type {ModelProperty}*/ Tipo = { type: 'text' };
   /**@type {ModelProperty}*/ marca = { type: 'text' };
   /**@type {ModelProperty}*/ serie = { type: 'text' };
   /**@type {ModelProperty}*/ modelo = { type: 'text' };
   /**@type {ModelProperty}*/ iva = { type: 'text' };
   /**@type {ModelProperty}*/ margen = { type: 'text' };
   /**@type {ModelProperty}*/ estado = { type: 'text' };
   /**@type {ModelProperty}*/ interesl = { type: 'number' };
   /**@type {ModelProperty}*/ moral = { type: 'number' };
   /**@type {ModelProperty}*/ fliquidacion = { type: 'date' };
   /**@type {ModelProperty}*/ precio_venta = { type: 'number' };
   /**@type {ModelProperty}*/ en_manos_de = { type: 'text' };
   /**@type {ModelProperty}*/ color = { type: 'text' };
   /**@type {ModelProperty}*/ factura = { type: 'text' };
   /**@type {ModelProperty}*/ tipo_movimiento = { type: 'text' };
   /**@type {ModelProperty}*/ v_porcentage_etiqueta = { type: 'number' };
   /**@type {ModelProperty}*/ Transactional_Valoracion = { type: 'WSELECT',  ModelObject: ()=> new Transactional_Valoracion_ModelComponent()};
   /**@type {ModelProperty}*/ Catalogo_Categoria = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Categoria_ModelComponent()};
   /**@type {ModelProperty}*/ Transaction_Contratos = { type: 'WSELECT',  ModelObject: ()=> new Transaction_Contratos_ModelComponent()};
   /**@type {ModelProperty}*/ Detail_Prendas_Vehiculos = { type: 'WSELECT',  ModelObject: ()=> new Detail_Prendas_Vehiculos_ModelComponent()};
}
export { Detail_Prendas_ModelComponent }
