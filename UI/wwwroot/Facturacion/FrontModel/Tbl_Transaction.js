import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";

class Tbl_Transaccion extends EntityClass {
  constructor(props) {
    super(props, 'EntityFacturacion');
    for (const prop in props) {
      this[prop] = props[prop];
    }
  }
  /** @type {Number} */ Id_Transaccion;
  /** @type {Number} */ Cantidad;
  /** @type {Number} */ Id_Lote;
  /** @type {String} */ Tipo;
  /** @type {String} */ Descripcion;
}
export { Tbl_Transaccion }