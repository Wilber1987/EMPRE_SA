//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { Detalle_Factura } from './Detalle_Factura.js';
class Tbl_Factura extends EntityClass {
    /**
     * @param {Partial<Tbl_Factura> } props
     */
    constructor(props) {
        ``
        super(props, 'EntityFacturacion');
        for (const prop in props) {
            this[prop] = props[prop];
        };
    }
   /**@type {Number}*/ Id_Factura;
   /**@type {String}*/ Tipo;
   /**@type {String}*/ Concepto;
   /**@type {String}*/ Codigo_venta;
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
   /**@type {Number}*/ Descuento;
   /**@type {Number}*/ Tasa_Cambio;
   /**@type {Number}*/ Tasa_Cambio_Venta;
   /**@type {Number}*/ Total;
   /**@type {Array<Detalle_Factura>} OneToMany*/ Detalle_Factura;
   /**@type {DatosFactura}*/ Datos;

    /**@type {Boolean}*/ is_cambio_cordobas;
    /**@type {String}*/ Moneda;
    /**@type {Number}*/ monto_dolares;
    /**@type {Number}*/ cambio_cordobas;
    /**@type {Number}*/ cambio_dolares;
    /**@type {Number}*/ monto_cordobas;

    GetValoracionContrato = async () => {
        return await this.SaveData("Transactional_Contrato/GetDataContract", this)
    }
}
export { Tbl_Factura };
export class DatosFactura {
    constructor(props) {
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    /**@type {String}*/ Nombre_Vendedor;
    /**@type {String}*/ Nombre_Cliente
    /**@type {String}*/ Direccion_Cliente
    /**@type {String}*/ Telefono_Cliente
}
