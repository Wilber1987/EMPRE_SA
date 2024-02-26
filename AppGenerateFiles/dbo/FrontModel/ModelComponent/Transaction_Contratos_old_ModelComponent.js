//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
class Transaction_Contratos_old_ModelComponent extends EntityClass {
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
   /**@type {ModelProperty}*/ codigo_cliente = { type: 'number' };
   /**@type {ModelProperty}*/ saldo = { type: 'number' };
   /**@type {ModelProperty}*/ dias_mora = { type: 'number' };
   /**@type {ModelProperty}*/ saldo_mora = { type: 'number' };
   /**@type {ModelProperty}*/ fecha_baja = { type: 'date' };
   /**@type {ModelProperty}*/ abonos = { type: 'number' };
   /**@type {ModelProperty}*/ ultima_visita = { type: 'date' };
   /**@type {ModelProperty}*/ tipo = { type: 'number' };
   /**@type {ModelProperty}*/ entregado = { type: 'text' };
   /**@type {ModelProperty}*/ interes_actual = { type: 'number' };
   /**@type {ModelProperty}*/ observaciones = { type: 'text' };
   /**@type {ModelProperty}*/ iva = { type: 'number' };
   /**@type {ModelProperty}*/ margen = { type: 'number' };
   /**@type {ModelProperty}*/ interesl = { type: 'number' };
   /**@type {ModelProperty}*/ moral = { type: 'number' };
   /**@type {ModelProperty}*/ descuento = { type: 'number' };
   /**@type {ModelProperty}*/ util = { type: 'number' };
   /**@type {ModelProperty}*/ taza_interes_cargos = { type: 'number' };
   /**@type {ModelProperty}*/ taza_mora = { type: 'number' };
   /**@type {ModelProperty}*/ fecha_mora = { type: 'date' };
   /**@type {ModelProperty}*/ fecha_interes = { type: 'date' };
   /**@type {ModelProperty}*/ taza_gestion_crediticia = { type: 'number' };
   /**@type {ModelProperty}*/ Id_User_OLD = { type: 'number' };
   /**@type {ModelProperty}*/ taza_cambio = { type: 'number' };
   /**@type {ModelProperty}*/ id_agente = { type: 'number' };
   /**@type {ModelProperty}*/ dkm = { type: 'number' };
   /**@type {ModelProperty}*/ gasolinamonto = { type: 'number' };
   /**@type {ModelProperty}*/ valorcad = { type: 'number' };
   /**@type {ModelProperty}*/ plazo = { type: 'number' };
   /**@type {ModelProperty}*/ cuotafija = { type: 'number' };
   /**@type {ModelProperty}*/ montocuotaatrazadas = { type: 'number' };
   /**@type {ModelProperty}*/ mes_pagado = { type: 'date' };
   /**@type {ModelProperty}*/ tasa_hoy = { type: 'number' };
   /**@type {ModelProperty}*/ numero_protocolo = { type: 'number' };
   /**@type {ModelProperty}*/ valor_dolar = { type: 'number' };
   /**@type {ModelProperty}*/ parciales = { type: 'number' };
   /**@type {ModelProperty}*/ mora_parcial = { type: 'number' };
   /**@type {ModelProperty}*/ interes_parcial = { type: 'number' };
   /**@type {ModelProperty}*/ motivo_anulacion = { type: 'text' };
   /**@type {ModelProperty}*/ idcatemp = { type: 'number' };
   /**@type {ModelProperty}*/ cuota_fija_inicial = { type: 'number' };
   /**@type {ModelProperty}*/ fecha_cancelar_inicial = { type: 'date' };
   /**@type {ModelProperty}*/ plazo_inicial = { type: 'number' };
   /**@type {ModelProperty}*/ dias_para_baja = { type: 'number' };
   /**@type {ModelProperty}*/ Id_User = { type: 'number' };
}
export { Transaction_Contratos_old_ModelComponent }
