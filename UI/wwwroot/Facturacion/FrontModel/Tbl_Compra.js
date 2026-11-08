//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { Money } from "../../WDevCore/WModules/Types/Money.js";
import { Cat_Proveedor } from './Cat_Proveedor.js'
import { Detalle_Compra } from './Detalle_Compra.js'
class Tbl_Compra extends EntityClass {
    /**
     * @param { Partial<Tbl_Compra>} [props]
     */
    constructor(props) {
        super(props, 'EntityFacturacion');
        Object.assign(this, props);
    }
   /**@type {Money?}*/ Id_Compra = null; 
   /**@type {Datos_Compra?}*/ Datos_Compra = null; 
   /**@type {Date?}*/ Fecha = null; 
   /**@type {Money?}*/ Tasa_Cambio = null; 
   /**@type {String?}*/ Moneda = null;
   /**@type {Money?}*/ Sub_Total = null; 
   /**@type {Money?}*/ Iva = null; 
   /**@type {Money?}*/ Total = null; 
   /**@type {String?}*/ Estado = null;
   /**@type {String?}*/ Observaciones = null;
   /**@type {Cat_Proveedor?} ManyToOne*/ Cat_Proveedor  = null;
   /**@type {Array<Detalle_Compra>} OneToMany*/ Detalle_Compra = [];
   /**@type {Boolean?}*/ IsAnulable  = null;
    Anular = async () => {
        return await this.SaveData("apiEntityFacturacion/anularCompra", this);
    }
}
export { Tbl_Compra }

export class Datos_Compra {
    /**
     * @type {String?}
     */
    RUC = null;
    /**
     * @type {String?}
     */
    Nombre_Comprador = null;
}
