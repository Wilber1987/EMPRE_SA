import { WForm } from "../WDevCore/WComponents/WForm.js";
import { EntityClass } from "../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../WDevCore/WModules/WComponentsTools.js";
import { Detail_Prendas_Vehiculos, Tbl_Cuotas } from "./Model.js";
import { Tbl_Cuotas_ModelComponent } from "./ModelComponents.js";

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
     /**@type {Catalogo_Clientes} */Catalogo_Clientes;
 }
 export { Tbl_Factura }
 

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

 class Tbl_Compra extends EntityClass {
    constructor(props) {
        super(props, 'EntityFacturacion');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    /**@type {Number}*/ Id_Compra;
    /**@type {String}*/ DatosCompra;
    /**@type {Date}*/ Fecha;
    /**@type {Number}*/ Tasa_Cambio;
    /**@type {String}*/ Moneda;
    /**@type {Number}*/ Sub_Total;
    /**@type {Number}*/ Iva;
    /**@type {Number}*/ Total;
    /**@type {String}*/ Estado;
    /**@type {Cat_Proveedor} ManyToOne*/ Cat_Proveedor;
    /**@type {Array<Detalle_Compra>} OneToMany*/ Detalle_Compra;
 }
 export { Tbl_Compra }

class Cat_Almacenes extends EntityClass {
    constructor(props) {
        super(props, 'EntityFacturacion');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    /**@type {Number}*/ Id_Almacen;
    /**@type {String}*/ Descripcion;
    /**@type {String}*/ Estado;
    /**@type {Array<Tbl_Lotes>} OneToMany*/ Tbl_Lotes;
 }
 export { Cat_Almacenes }
 
 class Cat_Categorias extends EntityClass {
    constructor(props) {
        super(props, 'EntityFacturacion');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    /**@type {Number}*/ Id_Categoria;
    /**@type {String}*/ Descripcion;
    /**@type {String}*/ Estado;
    /**@type {Array<Cat_Producto>} OneToMany*/ Cat_Producto;
 }
 export { Cat_Categorias }
 
 class Cat_Marca extends EntityClass {
    constructor(props) {
        super(props, 'EntityFacturacion');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    /**@type {Number}*/ Id_Marca;
    /**@type {String}*/ Nombre;
    /**@type {String}*/ Descripcion;
    /**@type {String}*/ Estado;
    /**@type {Array<Cat_Producto>} OneToMany*/ Cat_Producto;
 }
 export { Cat_Marca }

 class Cat_Producto extends EntityClass {
    constructor(props) {
        super(props, 'EntityFacturacion');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    /**@type {Number}*/ Id_Producto;
    /**@type {String}*/ Descripcion;
    /**@type {Cat_Marca} ManyToOne*/ Cat_Marca;
    /**@type {Cat_Categorias} ManyToOne*/ Cat_Categorias;
    /**@type {Array<Detalle_Compra>} OneToMany*/ Detalle_Compra;
    /**@type {Array<Detalle_Factura>} OneToMany*/ Detalle_Factura;
 }
 export { Cat_Producto }
 
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
 
 class Detalle_Compra extends EntityClass {
    constructor(props) {
        super(props, 'EntityFacturacion');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    /**@type {Number}*/ Id_Detalle_Compra;
    /**@type {Number}*/ Cantidad;
    /**@type {Number}*/ Precio_Unitario;
    /**@type {Number}*/ Total;
    /**@type {String}*/ Presentacion;
    /**@type {Cat_Producto} ManyToOne*/ Cat_Producto;
    /**@type {Tbl_Compra} ManyToOne*/ Tbl_Compra;
    /**@type {Array<Tbl_Lotes>} OneToMany*/ Tbl_Lotes;
 }
 export { Detalle_Compra }
 
 class Tbl_Lotes extends EntityClass {
    constructor(props) {
        super(props, 'EntityFacturacion');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    /**@type {Number}*/ Id_Lote;
    /**@type {Number}*/ Id_Producto;
    /**@type {Number}*/ Precio_Venta;
    /**@type {Number}*/ Precio_Compra;
    /**@type {Number}*/ Cantidad_Inicial;
    /**@type {Number}*/ Cantidad_Existente;
    /**@type {Date}*/ Fecha_Ingreso;
    /**@type {Cat_Almacenes} ManyToOne*/ Cat_Almacenes;
    /**@type {Detalle_Compra} ManyToOne*/ Detalle_Compra;
 }
 export { Tbl_Lotes }


 class Detail_Factura_ModelComponent extends EntityClass {
    constructor(props) {
        super(props, 'EntityFacturacion');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    
    Id_DetalleFactura = { type: 'text' };
    Cantidad = { type: 'text' };
    Precio_Venta = { type: 'text' };
    Iva = { type: 'text' };
    Total = { type: 'text' };
    Id_Lote = { type: 'text' };
    Descuento = { type: 'text' };
    Sub_Total = { type: 'text' };
    //Tbl_Factura; = ????
    //Cat_Producto; = ????

}
export { Detail_Factura_ModelComponent }