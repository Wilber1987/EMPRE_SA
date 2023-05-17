//@ts-check

import { EntityClass } from "../WDevCore/WModules/EntityClass.js";

class Catalogo_Sucursales extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    Id_Sucursal = { type: 'number', primary: true };
    Nombre = { type: 'text' };
    Descripcion = { type: 'text' };
    Direccion = { type: 'text' };
}
export { Catalogo_Sucursales }
class Datos_Configuracion extends EntityClass {
    constructor(props) {
        super(props, 'EntityDBO');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    Encabezado = { type: 'text' };
    AutoDebito = { type: 'checkbox' };
    Catalogo_Sucursales = { type: 'WSELECT', ModelObject: () => new Catalogo_Sucursales() };
}
export { Datos_Configuracion }