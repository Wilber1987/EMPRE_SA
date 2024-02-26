//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Tbl_Factura }  from './Tbl_Factura.js'
import { Cat_Producto }  from './Cat_Producto.js'
class Detalle_Factura extends EntityClass {
   constructor(props) {
       super(props, 'EntityFacturacion');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ Id_DetalleFactura;
   /**@type {Number}*/ Cantidad;
   /**@type {Number}*/ Precio_Venta;
   /**@type {Number}*/ Iva;
   /**@type {Number}*/ Total;
   /**@type {Number}*/ Id_Lote;
   /**@type {Number}*/ Descuento;
   /**@type {Number}*/ Sub_Total;
   /**@type {Tbl_Factura} ManyToOne*/ Tbl_Factura;
   /**@type {Cat_Producto} ManyToOne*/ Cat_Producto;
}
export { Detalle_Factura }
