//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools, BasicStates } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Catalogo_Sucursales }  from './Catalogo_Sucursales.js'
import { Catalogo_Sucursales }  from './Catalogo_Sucursales.js'
import { Categoria_Cuentas }  from './Categoria_Cuentas.js'
import { Detail_Movimiento }  from './Detail_Movimiento.js'
import { Transaction_Ingresos_Egresos }  from './Transaction_Ingresos_Egresos.js'
class Catalogo_Cuentas extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ id_cuentas;
   /**@type {String}*/ nombre;
   /**@type {String}*/ tipo_cuenta;
   /**@type {Number}*/ saldo;
   /**@type {Number}*/ saldo_dolares;
   /**@type {Boolean}*/ permite_dolares;
   /**@type {Boolean}*/ permite_cordobas;
   /**@type {Catalogo_Sucursales} ManyToOne*/ Catalogo_Sucursales;
   /**@type {Catalogo_Sucursales} ManyToOne*/ Catalogo_Sucursales;
   /**@type {Categoria_Cuentas} ManyToOne*/ Categoria_Cuentas;
   /**@type {Array<Detail_Movimiento>} OneToMany*/ Detail_Movimiento;
   /**@type {Array<Transaction_Ingresos_Egresos>} OneToMany*/ Transaction_Ingresos_Egresos;
}
export { Catalogo_Cuentas }
