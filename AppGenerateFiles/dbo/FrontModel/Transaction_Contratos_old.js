//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools, BasicStates } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
class Transaction_Contratos_old extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ numero_contrato;
   /**@type {Date}*/ fecha_contrato;
   /**@type {Date}*/ fecha_cancelar;
   /**@type {Number}*/ monto;
   /**@type {Number}*/ interes;
   /**@type {Number}*/ mora;
   /**@type {String}*/ estado;
   /**@type {Date}*/ fecha_vencimiento;
   /**@type {Number}*/ codigo_cliente;
   /**@type {Number}*/ saldo;
   /**@type {Number}*/ dias_mora;
   /**@type {Number}*/ saldo_mora;
   /**@type {Date}*/ fecha_baja;
   /**@type {Number}*/ abonos;
   /**@type {Date}*/ ultima_visita;
   /**@type {Number}*/ tipo;
   /**@type {String}*/ entregado;
   /**@type {Number}*/ interes_actual;
   /**@type {String}*/ observaciones;
   /**@type {Number}*/ iva;
   /**@type {Number}*/ margen;
   /**@type {Number}*/ interesl;
   /**@type {Number}*/ moral;
   /**@type {Number}*/ descuento;
   /**@type {Number}*/ util;
   /**@type {Number}*/ taza_interes_cargos;
   /**@type {Number}*/ taza_mora;
   /**@type {Date}*/ fecha_mora;
   /**@type {Date}*/ fecha_interes;
   /**@type {Number}*/ taza_gestion_crediticia;
   /**@type {Number}*/ Id_User_OLD;
   /**@type {Number}*/ taza_cambio;
   /**@type {Number}*/ id_agente;
   /**@type {Number}*/ dkm;
   /**@type {Number}*/ gasolinamonto;
   /**@type {Number}*/ valorcad;
   /**@type {Number}*/ plazo;
   /**@type {Number}*/ cuotafija;
   /**@type {Number}*/ montocuotaatrazadas;
   /**@type {Date}*/ mes_pagado;
   /**@type {Number}*/ tasa_hoy;
   /**@type {Number}*/ numero_protocolo;
   /**@type {Number}*/ valor_dolar;
   /**@type {Number}*/ parciales;
   /**@type {Number}*/ mora_parcial;
   /**@type {Number}*/ interes_parcial;
   /**@type {String}*/ motivo_anulacion;
   /**@type {Number}*/ idcatemp;
   /**@type {Number}*/ cuota_fija_inicial;
   /**@type {Date}*/ fecha_cancelar_inicial;
   /**@type {Number}*/ plazo_inicial;
   /**@type {Number}*/ dias_para_baja;
   /**@type {Number}*/ Id_User;
}
export { Transaction_Contratos_old }
