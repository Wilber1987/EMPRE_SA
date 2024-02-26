//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Tbl_Compra }  from './Tbl_Compra.js'
class Cat_Proveedor extends EntityClass {
   constructor(props) {
       super(props, 'EntityFacturacion');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ Id_Proveedor;
   /**@type {String}*/ Nombre;
   /**@type {String}*/ Estado;
   /**@type {String}*/ Datos_Proveedor;
   /**@type {Array<Tbl_Compra>} OneToMany*/ Tbl_Compra;
}
export { Cat_Proveedor }
