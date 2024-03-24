//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { Cat_Proveedor } from './Cat_Proveedor.js'
import { Detalle_Compra } from './Detalle_Compra.js'
class Tbl_Compra extends EntityClass {
    constructor(props) {
        super(props, 'EntityFacturacion');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
   /**@type {Number}*/ Id_Compra;
   /**@type {String}*/ Datos_Compra;
   /**@type {Date}*/ Fecha;
   /**@type {Number}*/ Tasa_Cambio;
   /**@type {String}*/ Moneda;
   /**@type {Number}*/ Sub_Total;
   /**@type {Number}*/ Iva;
   /**@type {Number}*/ Total;
   /**@type {String}*/ Estado;
   /**@type {Cat_Proveedor} ManyToOne*/ Cat_Proveedor;
   /**@type {Array<Detalle_Compra>} OneToMany*/ Detalle_Compra;
    Anular = async () => {
        return await this.SaveData("apiEntityFacturacion/anularCompra",this);
    }
}
export { Tbl_Compra }
