//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Catalogo_Categoria }  from './Catalogo_Categoria.js'
import { Catalogo_Estados_Articulos }  from './Catalogo_Estados_Articulos.js'
import { Detail_Prendas }  from './Detail_Prendas.js'
import { Detail_Valores }  from './Detail_Valores.js'
class Transactional_Valoracion extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ id_valoracion;
   /**@type {String}*/ Descripcion;
   /**@type {String}*/ Marca;
   /**@type {String}*/ Modelo;
   /**@type {Number}*/ Tasa_interes;
   /**@type {Number}*/ Plazo;
   /**@type {Date}*/ Fecha;
   /**@type {Number}*/ Tasa_de_cambio;
   /**@type {Number}*/ Valoracion_compra_cordobas;
   /**@type {Number}*/ Valoracion_compra_dolares;
   /**@type {Number}*/ Valoracion_empeño_cordobas;
   /**@type {Number}*/ Valoracion_empeño_dolares;
   /**@type {String}*/ Serie;
   /**@type {Number}*/ Precio_venta_empeño_dolares;
   /**@type {Number}*/ Precio_venta_empeño_cordobas;
   /**@type {Catalogo_Categoria} ManyToOne*/ Catalogo_Categoria;
   /**@type {Catalogo_Estados_Articulos} ManyToOne*/ Catalogo_Estados_Articulos;
   /**@type {Array<Detail_Prendas>} OneToMany*/ Detail_Prendas;
   /**@type {Array<Detail_Valores>} OneToMany*/ Detail_Valores;
}
export { Transactional_Valoracion }
