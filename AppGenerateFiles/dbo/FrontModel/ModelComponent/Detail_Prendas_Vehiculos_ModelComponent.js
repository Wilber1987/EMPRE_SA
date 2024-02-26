//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Detail_Prendas_ModelComponent }  from './Detail_Prendas_ModelComponent.js'
class Detail_Prendas_Vehiculos_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ capacidad_cilindros = { type: 'text' };
   /**@type {ModelProperty}*/ cantidad_cilindros = { type: 'text' };
   /**@type {ModelProperty}*/ cantidad_pasajeros = { type: 'text' };
   /**@type {ModelProperty}*/ year_vehiculo = { type: 'number' };
   /**@type {ModelProperty}*/ montor = { type: 'text' };
   /**@type {ModelProperty}*/ chasis = { type: 'text' };
   /**@type {ModelProperty}*/ placa = { type: 'text' };
   /**@type {ModelProperty}*/ circuacion = { type: 'text' };
   /**@type {ModelProperty}*/ defectuoso = { type: 'text' };
   /**@type {ModelProperty}*/ fecha_aut_descuento = { type: 'date' };
   /**@type {ModelProperty}*/ defecto = { type: 'text' };
   /**@type {ModelProperty}*/ porcentage_descuento_maximo = { type: 'number' };
   /**@type {ModelProperty}*/ fecha_seguro = { type: 'date' };
   /**@type {ModelProperty}*/ combustible = { type: 'text' };
   /**@type {ModelProperty}*/ uso = { type: 'text' };
   /**@type {ModelProperty}*/ servicio = { type: 'text' };
   /**@type {ModelProperty}*/ Detail_Prendas = { type: 'WSELECT',  ModelObject: ()=> new Detail_Prendas_ModelComponent()};
}
export { Detail_Prendas_Vehiculos_ModelComponent }
