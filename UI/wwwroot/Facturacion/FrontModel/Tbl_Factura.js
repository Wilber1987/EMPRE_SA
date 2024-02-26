//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Detalle_Factura }  from './Detalle_Factura.js'
class Tbl_Factura extends EntityClass {
   constructor(props) {
       super(props, 'EntityFacturacion');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ Id_Factura;
   /**@type {String}*/ Tipo;
   /**@type {String}*/ Concepto;
   /**@type {String}*/ Serie;
   /**@type {String}*/ Forma_Pago;
   /**@type {String}*/ Direccion_Envio;
   /**@type {Number}*/ Id_Cliente;
   /**@type {Number}*/ Id_Sucursal;
   /**@type {Date}*/ Fecha;
   /**@type {Date}*/ Fecha_Vencimiento;
   /**@type {String}*/ Observaciones;
   /**@type {Number}*/ Id_Usuario;
   /**@type {String}*/ Estado;
   /**@type {Number}*/ Sub_Total;
   /**@type {Number}*/ Iva;
   /**@type {Number}*/ Tasa_Cambio;
   /**@type {Number}*/ Total;
   /**@type {Array<Detalle_Factura>} OneToMany*/ Detalle_Factura;

    GetValoracionContrato = async () => {
        return await this.SaveData("Transactional_Contrato/GetDataContract", this)
    }
}
export { Tbl_Factura }
