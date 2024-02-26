//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Catalogo_Clientes_ModelComponent }  from './Catalogo_Clientes_ModelComponent.js'
import { Detail_Prendas_ModelComponent }  from './Detail_Prendas_ModelComponent.js'
import { Tbl_Cuotas_ModelComponent }  from './Tbl_Cuotas_ModelComponent.js'
class Transaction_Contratos_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ numero_contrato = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ fecha_contrato = { type: 'date' };
   /**@type {ModelProperty}*/ fecha_cancelar = { type: 'date' };
   /**@type {ModelProperty}*/ monto = { type: 'number' };
   /**@type {ModelProperty}*/ interes = { type: 'number' };
   /**@type {ModelProperty}*/ mora = { type: 'number' };
   /**@type {ModelProperty}*/ estado = { type: 'text' };
   /**@type {ModelProperty}*/ fecha_vencimiento = { type: 'date' };
   /**@type {ModelProperty}*/ saldo = { type: 'number' };
   /**@type {ModelProperty}*/ abonos = { type: 'number' };
   /**@type {ModelProperty}*/ tipo = { type: 'text' };
   /**@type {ModelProperty}*/ observaciones = { type: 'text' };
   /**@type {ModelProperty}*/ iva = { type: 'number' };
   /**@type {ModelProperty}*/ descuento = { type: 'number' };
   /**@type {ModelProperty}*/ taza_cambio = { type: 'number' };
   /**@type {ModelProperty}*/ taza_cambio_compra = { type: 'number' };
   /**@type {ModelProperty}*/ plazo = { type: 'number' };
   /**@type {ModelProperty}*/ cuotafija = { type: 'number' };
   /**@type {ModelProperty}*/ tasa_hoy = { type: 'number' };
   /**@type {ModelProperty}*/ motivo_anulacion = { type: 'text' };
   /**@type {ModelProperty}*/ valoracion_compra_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ valoracion_compra_cordobas = { type: 'number' };
   /**@type {ModelProperty}*/ valoracion_empeño_cordobas = { type: 'number' };
   /**@type {ModelProperty}*/ valoracion_empeño_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ tasas_interes = { type: 'number' };
   /**@type {ModelProperty}*/ gestion_crediticia = { type: 'number' };
   /**@type {ModelProperty}*/ cuotafija_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ fecha = { type: 'date' };
   /**@type {ModelProperty}*/ total_pagar_cordobas = { type: 'number' };
   /**@type {ModelProperty}*/ total_pagar_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ interes_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ Id_User = { type: 'number' };
   /**@type {ModelProperty}*/ reestructurado = { type: 'number' };
   /**@type {ModelProperty}*/ Catalogo_Clientes = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Clientes_ModelComponent()};
   /**@type {ModelProperty}*/ Detail_Prendas = { type: 'MasterDetail',  ModelObject: ()=> new Detail_Prendas_ModelComponent()};
   /**@type {ModelProperty}*/ Tbl_Cuotas = { type: 'MasterDetail',  ModelObject: ()=> new Tbl_Cuotas_ModelComponent()};
}
export { Transaction_Contratos_ModelComponent }
