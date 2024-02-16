//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools, BasicStates } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Transactional_Valoracion }  from './Transactional_Valoracion.js'
import { Catalogo_Categoria }  from './Catalogo_Categoria.js'
import { Transaction_Contratos }  from './Transaction_Contratos.js'
import { Detail_Prendas_Vehiculos }  from './Detail_Prendas_Vehiculos.js'
class Detail_Prendas extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ numero_prenda;
   /**@type {Number}*/ numero_contrato_OLD;
   /**@type {String}*/ Descripcion;
   /**@type {Number}*/ pprenda;
   /**@type {String}*/ Tipo;
   /**@type {String}*/ marca;
   /**@type {String}*/ serie;
   /**@type {String}*/ modelo;
   /**@type {String}*/ iva;
   /**@type {String}*/ margen;
   /**@type {String}*/ estado;
   /**@type {Number}*/ interesl;
   /**@type {Number}*/ moral;
   /**@type {Date}*/ fliquidacion;
   /**@type {Number}*/ precio_venta;
   /**@type {String}*/ en_manos_de;
   /**@type {String}*/ color;
   /**@type {String}*/ factura;
   /**@type {String}*/ tipo_movimiento;
   /**@type {Number}*/ v_porcentage_etiqueta;
   /**@type {Transactional_Valoracion} ManyToOne*/ Transactional_Valoracion;
   /**@type {Catalogo_Categoria} ManyToOne*/ Catalogo_Categoria;
   /**@type {Transaction_Contratos} ManyToOne*/ Transaction_Contratos;
   /**@type {Array<Detail_Prendas_Vehiculos>} OneToMany*/ Detail_Prendas_Vehiculos;
}
export { Detail_Prendas }
