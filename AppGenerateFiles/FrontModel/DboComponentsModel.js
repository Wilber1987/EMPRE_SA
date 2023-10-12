import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools, BasicStates } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
class Transaction_Ingresos_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ numero_ingreso = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ monto = { type: 'number' };
   /**@type {ModelProperty}*/ fecha = { type: 'date' };
   /**@type {ModelProperty}*/ descripcion = { type: 'text' };
   /**@type {ModelProperty}*/ nombre = { type: 'text' };
   /**@type {ModelProperty}*/ que = { type: 'number' };
   /**@type {ModelProperty}*/ anulado = { type: 'text' };
   /**@type {ModelProperty}*/ observaciones = { type: 'text' };
   /**@type {ModelProperty}*/ tzcambio = { type: 'number' };
   /**@type {ModelProperty}*/ total = { type: 'number' };
   /**@type {ModelProperty}*/ fanulado = { type: 'date' };
}
export { Transaction_Ingresos_ModelComponent }
class Transaction_Ingresos_Egresos_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_transaccion = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ monto_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ tasa_cambio = { type: 'number' };
   /**@type {ModelProperty}*/ monto_total = { type: 'number' };
   /**@type {ModelProperty}*/ descripcion = { type: 'text' };
   /**@type {ModelProperty}*/ nombre = { type: 'text' };
   /**@type {ModelProperty}*/ que = { type: 'number' };
   /**@type {ModelProperty}*/ fecha_anulado = { type: 'date' };
   /**@type {ModelProperty}*/ banco = { type: 'text' };
   /**@type {ModelProperty}*/ estado = { type: 'text' };
   /**@type {ModelProperty}*/ numero_original = { type: 'number' };
   /**@type {ModelProperty}*/ fecha = { type: 'date' };
   /**@type {ModelProperty}*/ Catalogo_Cuentas = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Cuentas_ModelComponent()};
   /**@type {ModelProperty}*/ Catalogo_Tipo_Transaccion = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Tipo_Transaccion_ModelComponent()};
}
export { Transaction_Ingresos_Egresos_ModelComponent }
class Transaction_Movimiento_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_movimiento = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ descripcion = { type: 'text' };
   /**@type {ModelProperty}*/ concepto = { type: 'text' };
   /**@type {ModelProperty}*/ id_usuario_crea = { type: 'number' };
   /**@type {ModelProperty}*/ fecha = { type: 'date' };
   /**@type {ModelProperty}*/ tipo = { type: 'text' };
   /**@type {ModelProperty}*/ moneda = { type: 'text' };
   /**@type {ModelProperty}*/ tasa_cambio = { type: 'number' };
   /**@type {ModelProperty}*/ tasa_cambio_compra = { type: 'number' };
   /**@type {ModelProperty}*/ correo_enviado = { type: 'checkbox' };
}
export { Transaction_Movimiento_ModelComponent }
class Transactional_Valoracion_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_valoracion = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ Descripcion = { type: 'text' };
   /**@type {ModelProperty}*/ Marca = { type: 'text' };
   /**@type {ModelProperty}*/ Modelo = { type: 'text' };
   /**@type {ModelProperty}*/ Tasa_interes = { type: 'number' };
   /**@type {ModelProperty}*/ Plazo = { type: 'number' };
   /**@type {ModelProperty}*/ Fecha = { type: 'date' };
   /**@type {ModelProperty}*/ Tasa_de_cambio = { type: 'number' };
   /**@type {ModelProperty}*/ valoracion_compra_cordobas = { type: 'number' };
   /**@type {ModelProperty}*/ valoracion_compra_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ valoracion_empeño_cordobas = { type: 'number' };
   /**@type {ModelProperty}*/ valoracion_empeño_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ Serie = { type: 'text' };
   /**@type {ModelProperty}*/ precio_venta_empeño_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ precio_venta_empeño_cordobas = { type: 'number' };
   /**@type {ModelProperty}*/ Catalogo_Categoria = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Categoria_ModelComponent()};
   /**@type {ModelProperty}*/ Catalogo_Estados_Articulos = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Estados_Articulos_ModelComponent()};
   /**@type {ModelProperty}*/ Detail_Prendas = { type: 'MasterDetail',  ModelObject: ()=> new Detail_Prendas_ModelComponent()};
   /**@type {ModelProperty}*/ Detail_Valores = { type: 'MasterDetail',  ModelObject: ()=> new Detail_Valores_ModelComponent()};
}
export { Transactional_Valoracion_ModelComponent }
class Transaccion_Factura_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_factura = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ tipo = { type: 'text' };
   /**@type {ModelProperty}*/ concepto = { type: 'text' };
   /**@type {ModelProperty}*/ tasa_cambio = { type: 'number' };
   /**@type {ModelProperty}*/ total = { type: 'number' };
   /**@type {ModelProperty}*/ id_cliente = { type: 'number' };
   /**@type {ModelProperty}*/ id_sucursal = { type: 'number' };
   /**@type {ModelProperty}*/ fecha = { type: 'date' };
   /**@type {ModelProperty}*/ id_usuario = { type: 'number' };
   /**@type {ModelProperty}*/ Factura_contrato = { type: 'text' };
   /**@type {ModelProperty}*/ Detalle_Factura_Recibo = { type: 'MasterDetail',  ModelObject: ()=> new Detalle_Factura_Recibo_ModelComponent()};
}
export { Transaccion_Factura_ModelComponent }
class Detalle_Factura_Recibo_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ total_cuota = { type: 'number' };
   /**@type {ModelProperty}*/ monto_pagado = { type: 'number' };
   /**@type {ModelProperty}*/ capital_restante = { type: 'number' };
   /**@type {ModelProperty}*/ concepto = { type: 'text' };
   /**@type {ModelProperty}*/ tasa_cambio = { type: 'number' };
   /**@type {ModelProperty}*/ Transaccion_Factura = { type: 'WSELECT',  ModelObject: ()=> new Transaccion_Factura_ModelComponent()};
   /**@type {ModelProperty}*/ Tbl_Cuotas = { type: 'WSELECT',  ModelObject: ()=> new Tbl_Cuotas_ModelComponent()};
}
export { Detalle_Factura_Recibo_ModelComponent }
class Catalogo_Agentes_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_agente = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ identificacion = { type: 'text' };
   /**@type {ModelProperty}*/ nombre = { type: 'text' };
   /**@type {ModelProperty}*/ telefono = { type: 'text' };
   /**@type {ModelProperty}*/ direccion = { type: 'text' };
   /**@type {ModelProperty}*/ fecha = { type: 'date' };
   /**@type {ModelProperty}*/ Estado = { type: 'text' };
   /**@type {ModelProperty}*/ Catalogo_Tipo_Agente = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Tipo_Agente_ModelComponent()};
}
export { Catalogo_Agentes_ModelComponent }
class Recibos_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_recibo = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ consecutivo = { type: 'number' };
   /**@type {ModelProperty}*/ temporal = { type: 'checkbox' };
   /**@type {ModelProperty}*/ monto = { type: 'number' };
   /**@type {ModelProperty}*/ saldo_actual_cordobas = { type: 'number' };
   /**@type {ModelProperty}*/ saldo_actual_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ plazo = { type: 'number' };
   /**@type {ModelProperty}*/ interes_cargos = { type: 'number' };
   /**@type {ModelProperty}*/ tasa_cambio = { type: 'number' };
   /**@type {ModelProperty}*/ tasa_cambio_compra = { type: 'number' };
   /**@type {ModelProperty}*/ interes_demas_cargos_pagar_cordobas = { type: 'number' };
   /**@type {ModelProperty}*/ interes_demas_cargos_pagar_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ abono_capital_cordobas = { type: 'number' };
   /**@type {ModelProperty}*/ abono_capital_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ cuota_pagar_cordobas = { type: 'number' };
   /**@type {ModelProperty}*/ cuota_pagar_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ mora_cordobas = { type: 'number' };
   /**@type {ModelProperty}*/ mora_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ mora_interes_cordobas = { type: 'number' };
   /**@type {ModelProperty}*/ mora_interes_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ total_cordobas = { type: 'number' };
   /**@type {ModelProperty}*/ total_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ total_parciales = { type: 'number' };
   /**@type {ModelProperty}*/ fecha_roc = { type: 'date' };
   /**@type {ModelProperty}*/ paga_cordobas = { type: 'number' };
   /**@type {ModelProperty}*/ paga_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ solo_abono = { type: 'checkbox' };
   /**@type {ModelProperty}*/ cancelar = { type: 'checkbox' };
   /**@type {ModelProperty}*/ Transaction_Contratos_old = { type: 'WSELECT',  ModelObject: ()=> new Transaction_Contratos_old_ModelComponent()};
}
export { Recibos_ModelComponent }
class Catalogo_Cambio_Dolar_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_cambio = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ fecha = { type: 'date' };
   /**@type {ModelProperty}*/ valor_de_compra = { type: 'number' };
   /**@type {ModelProperty}*/ valor_de_venta = { type: 'number' };
}
export { Catalogo_Cambio_Dolar_ModelComponent }
class Catalogo_Categoria_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_categoria = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ tipo = { type: 'text' };
   /**@type {ModelProperty}*/ descripcion = { type: 'text' };
   /**@type {ModelProperty}*/ plazo_limite = { type: 'number' };
   /**@type {ModelProperty}*/ prioridad = { type: 'number' };
}
export { Catalogo_Categoria_ModelComponent }
class Tbl_Cuotas_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_cuota = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ fecha = { type: 'date' };
   /**@type {ModelProperty}*/ total = { type: 'number' };
   /**@type {ModelProperty}*/ interes = { type: 'number' };
   /**@type {ModelProperty}*/ abono_capital = { type: 'number' };
   /**@type {ModelProperty}*/ capital_restante = { type: 'number' };
   /**@type {ModelProperty}*/ fecha_pago = { type: 'date' };
   /**@type {ModelProperty}*/ pago_contado = { type: 'number' };
   /**@type {ModelProperty}*/ descuento = { type: 'number' };
   /**@type {ModelProperty}*/ tasa_cambio = { type: 'number' };
   /**@type {ModelProperty}*/ mora = { type: 'number' };
   /**@type {ModelProperty}*/ Transaction_Contratos_old = { type: 'WSELECT',  ModelObject: ()=> new Transaction_Contratos_old_ModelComponent()};
   /**@type {ModelProperty}*/ Detalle_Factura_Recibo = { type: 'MasterDetail',  ModelObject: ()=> new Detalle_Factura_Recibo_ModelComponent()};
}
export { Tbl_Cuotas_ModelComponent }
class Catalogo_Clasificacion_Cliente_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_clasificacion = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ Descripcion = { type: 'text' };
   /**@type {ModelProperty}*/ Estado = { type: 'text' };
}
export { Catalogo_Clasificacion_Cliente_ModelComponent }
class Catalogo_Clasificacion_Interes_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_clasificacion_interes = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ Descripcion = { type: 'text' };
   /**@type {ModelProperty}*/ Estado = { type: 'text' };
   /**@type {ModelProperty}*/ porcentaje = { type: 'number' };
}
export { Catalogo_Clasificacion_Interes_ModelComponent }
class Catalogo_Clientes_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ codigo_cliente = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ primer_nombre = { type: 'text' };
   /**@type {ModelProperty}*/ segundo_nombre = { type: 'text' };
   /**@type {ModelProperty}*/ primer_apellido = { type: 'text' };
   /**@type {ModelProperty}*/ segundo_apellidio = { type: 'text' };
   /**@type {ModelProperty}*/ identificacion = { type: 'text' };
   /**@type {ModelProperty}*/ sexo = { type: 'text' };
   /**@type {ModelProperty}*/ fecha_nacimiento = { type: 'date' };
   /**@type {ModelProperty}*/ correo = { type: 'text' };
   /**@type {ModelProperty}*/ telefono = { type: 'text' };
   /**@type {ModelProperty}*/ direccion = { type: 'text' };
   /**@type {ModelProperty}*/ hora = { type: 'text' };
   /**@type {ModelProperty}*/ fecha = { type: 'date' };
   /**@type {ModelProperty}*/ observaciones = { type: 'text' };
   /**@type {ModelProperty}*/ estado_civil = { type: 'text' };
   /**@type {ModelProperty}*/ tipoc = { type: 'number' };
   /**@type {ModelProperty}*/ tipo_firma = { type: 'text' };
   /**@type {ModelProperty}*/ valor_cliente = { type: 'text' };
   /**@type {ModelProperty}*/ operadora_celular = { type: 'text' };
   /**@type {ModelProperty}*/ valor_interes = { type: 'number' };
   /**@type {ModelProperty}*/ solo_acreedor = { type: 'text' };
   /**@type {ModelProperty}*/ promedio = { type: 'number' };
   /**@type {ModelProperty}*/ Catalogo_Clasificacion_Cliente = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Clasificacion_Cliente_ModelComponent()};
   /**@type {ModelProperty}*/ Catalogo_Clasificacion_Interes = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Clasificacion_Interes_ModelComponent()};
   /**@type {ModelProperty}*/ Catalogo_Departamento = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Departamento_ModelComponent()};
   /**@type {ModelProperty}*/ Catalogo_Municipio = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Municipio_ModelComponent()};
   /**@type {ModelProperty}*/ Catalogo_Profesiones = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Profesiones_ModelComponent()};
   /**@type {ModelProperty}*/ Catalogo_Tipo_Identificacion = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Tipo_Identificacion_ModelComponent()};
}
export { Catalogo_Clientes_ModelComponent }
class Catalogo_Cuentas_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_cuentas = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ nombre = { type: 'text' };
   /**@type {ModelProperty}*/ tipo_cuenta = { type: 'text' };
   /**@type {ModelProperty}*/ saldo = { type: 'number' };
   /**@type {ModelProperty}*/ saldo_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ permite_dolares = { type: 'checkbox' };
   /**@type {ModelProperty}*/ permite_cordobas = { type: 'checkbox' };
   /**@type {ModelProperty}*/ Catalogo_Sucursales = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Sucursales_ModelComponent()};
   /**@type {ModelProperty}*/ Catalogo_Sucursales = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Sucursales_ModelComponent()};
   /**@type {ModelProperty}*/ Categoria_Cuentas = { type: 'WSELECT',  ModelObject: ()=> new Categoria_Cuentas_ModelComponent()};
}
export { Catalogo_Cuentas_ModelComponent }
class Catalogo_Departamento_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_departamento = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ nombre = { type: 'text' };
   /**@type {ModelProperty}*/ ponderacion = { type: 'number' };
   /**@type {ModelProperty}*/ puntaje = { type: 'number' };
   /**@type {ModelProperty}*/ clasificacion = { type: 'text' };
   /**@type {ModelProperty}*/ Catalogo_Nacionalidad = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Nacionalidad_ModelComponent()};
}
export { Catalogo_Departamento_ModelComponent }
class Catalogo_Estados_Articulos_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_estado_articulo = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ nombre = { type: 'text' };
   /**@type {ModelProperty}*/ descripcion = { type: 'text' };
   /**@type {ModelProperty}*/ porcentaje_compra = { type: 'number' };
   /**@type {ModelProperty}*/ porcentaje_empeno = { type: 'number' };
}
export { Catalogo_Estados_Articulos_ModelComponent }
class Catalogo_Inversores_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_inversor = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ nombre = { type: 'text' };
   /**@type {ModelProperty}*/ direccion = { type: 'text' };
   /**@type {ModelProperty}*/ estado_civil = { type: 'text' };
   /**@type {ModelProperty}*/ identificacion = { type: 'text' };
   /**@type {ModelProperty}*/ telefono = { type: 'text' };
   /**@type {ModelProperty}*/ Catalogo_Municipio = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Municipio_ModelComponent()};
   /**@type {ModelProperty}*/ Catalogo_Nacionalidad = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Nacionalidad_ModelComponent()};
}
export { Catalogo_Inversores_ModelComponent }
class Catalogo_Municipio_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_municipio = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ nombre = { type: 'text' };
   /**@type {ModelProperty}*/ Catalogo_Departamento = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Departamento_ModelComponent()};
}
export { Catalogo_Municipio_ModelComponent }
class Catalogo_Nacionalidad_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_nacionalidad = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ nombre = { type: 'text' };
   /**@type {ModelProperty}*/ nacionalidad = { type: 'text' };
   /**@type {ModelProperty}*/ ponderacion = { type: 'number' };
   /**@type {ModelProperty}*/ puntaje = { type: 'number' };
   /**@type {ModelProperty}*/ clasificacion = { type: 'text' };
}
export { Catalogo_Nacionalidad_ModelComponent }
class Catalogo_Profesiones_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_profesion = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ nombre = { type: 'text' };
}
export { Catalogo_Profesiones_ModelComponent }
class Catalogo_Sucursales_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ Id_Sucursal = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ Nombre = { type: 'text' };
   /**@type {ModelProperty}*/ Descripcion = { type: 'text' };
   /**@type {ModelProperty}*/ Direccion = { type: 'text' };
   /**@type {ModelProperty}*/ id_municipio = { type: 'number' };
}
export { Catalogo_Sucursales_ModelComponent }
class Transaction_Contratos_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ numero_contrato = { type: 'number' };
   /**@type {ModelProperty}*/ fecha_contrato = { type: 'date' };
   /**@type {ModelProperty}*/ fecha_cancelar = { type: 'date' };
   /**@type {ModelProperty}*/ monto = { type: 'number' };
   /**@type {ModelProperty}*/ interes = { type: 'number' };
   /**@type {ModelProperty}*/ mora = { type: 'number' };
   /**@type {ModelProperty}*/ estado = { type: 'text' };
   /**@type {ModelProperty}*/ fecha_vencimiento = { type: 'date' };
   /**@type {ModelProperty}*/ codigo_cliente = { type: 'number' };
   /**@type {ModelProperty}*/ saldo = { type: 'number' };
   /**@type {ModelProperty}*/ abonos = { type: 'number' };
   /**@type {ModelProperty}*/ tipo = { type: 'number' };
   /**@type {ModelProperty}*/ entregado = { type: 'text' };
   /**@type {ModelProperty}*/ interes_actual = { type: 'number' };
   /**@type {ModelProperty}*/ observaciones = { type: 'text' };
   /**@type {ModelProperty}*/ iva = { type: 'number' };
   /**@type {ModelProperty}*/ descuento = { type: 'number' };
   /**@type {ModelProperty}*/ taza_cambio = { type: 'number' };
   /**@type {ModelProperty}*/ taza_cambio_compra = { type: 'number' };
   /**@type {ModelProperty}*/ id_agente = { type: 'number' };
   /**@type {ModelProperty}*/ plazo = { type: 'number' };
   /**@type {ModelProperty}*/ cuotafija = { type: 'number' };
   /**@type {ModelProperty}*/ tasa_hoy = { type: 'number' };
   /**@type {ModelProperty}*/ motivo_anulacion = { type: 'text' };
   /**@type {ModelProperty}*/ valoracion_compra_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ valoracion_compra_cordobas = { type: 'number' };
   /**@type {ModelProperty}*/ valoracion_empeño_cordobas = { type: 'number' };
   /**@type {ModelProperty}*/ valoracion_empeño_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ tasas_interes = { type: 'number' };
   /**@type {ModelProperty}*/ gestion_crediticia = { type: 'number' };
   /**@type {ModelProperty}*/ cuotafija_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ fecha = { type: 'date' };
   /**@type {ModelProperty}*/ total_pagar_cordobas = { type: 'number' };
   /**@type {ModelProperty}*/ total_pagar_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ interes_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ Id_User = { type: 'number' };
}
export { Transaction_Contratos_ModelComponent }
class Catalogo_Tipo_Agente_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ Id_Tipo_Agente = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ Descripcion = { type: 'text' };
   /**@type {ModelProperty}*/ Estado = { type: 'text' };
}
export { Catalogo_Tipo_Agente_ModelComponent }
class Catalogo_Tipo_Identificacion_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_tipo_identificacion = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ Descripcion = { type: 'text' };
   /**@type {ModelProperty}*/ Estado = { type: 'text' };
}
export { Catalogo_Tipo_Identificacion_ModelComponent }
class Catalogo_Tipo_Transaccion_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_tipo_transaccion = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ descripcion = { type: 'text' };
}
export { Catalogo_Tipo_Transaccion_ModelComponent }
class Categoria_Cuentas_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_categoria = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ descripcion = { type: 'text' };
   /**@type {ModelProperty}*/ Catalogo_Cuentas = { type: 'MULTYSELECT',  ModelObject: ()=> new Catalogo_Cuentas_ModelComponent()};
   /**@type {ModelProperty}*/ Permisos_Cuentas = { type: 'MasterDetail',  ModelObject: ()=> new Permisos_Cuentas_ModelComponent()};
   /**@type {ModelProperty}*/ Permisos_Cuentas = { type: 'MasterDetail',  ModelObject: ()=> new Permisos_Cuentas_ModelComponent()};
}
export { Categoria_Cuentas_ModelComponent }
class Condicion_Laboral_Cliente_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ fecha_ingreso = { type: 'date' };
   /**@type {ModelProperty}*/ ocupacion_cargo = { type: 'text' };
   /**@type {ModelProperty}*/ ingresos_mensuales = { type: 'number' };
   /**@type {ModelProperty}*/ direccion = { type: 'text' };
   /**@type {ModelProperty}*/ nombre_empresa = { type: 'text' };
   /**@type {ModelProperty}*/ Catalogo_Clientes = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Clientes_ModelComponent()};
   /**@type {ModelProperty}*/ Catalogo_Departamento = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Departamento_ModelComponent()};
   /**@type {ModelProperty}*/ Catalogo_Municipio = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Municipio_ModelComponent()};
}
export { Condicion_Laboral_Cliente_ModelComponent }
class Datos_Configuracion_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ Encabezado = { type: 'text' };
   /**@type {ModelProperty}*/ AutoDebito = { type: 'checkbox' };
   /**@type {ModelProperty}*/ Catalogo_Sucursales = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Sucursales_ModelComponent()};
}
export { Datos_Configuracion_ModelComponent }
class Detail_Movimiento_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_detalle = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ id_movimiento = { type: 'number' };
   /**@type {ModelProperty}*/ debito = { type: 'number' };
   /**@type {ModelProperty}*/ credito = { type: 'number' };
   /**@type {ModelProperty}*/ tasa_cambio = { type: 'number' };
   /**@type {ModelProperty}*/ fecha = { type: 'date' };
   /**@type {ModelProperty}*/ debito_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ credito_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ monto_inicial = { type: 'number' };
   /**@type {ModelProperty}*/ monto_final = { type: 'number' };
   /**@type {ModelProperty}*/ monto_inicial_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ monto_final_dolares = { type: 'number' };
   /**@type {ModelProperty}*/ moneda = { type: 'text' };
   /**@type {ModelProperty}*/ tasa_cambio_compra = { type: 'number' };
   /**@type {ModelProperty}*/ Catalogo_Cuentas = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Cuentas_ModelComponent()};
}
export { Detail_Movimiento_ModelComponent }
class Detail_Prendas_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ numero_prenda = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ numero_contrato_OLD = { type: 'number' };
   /**@type {ModelProperty}*/ Descripcion = { type: 'text' };
   /**@type {ModelProperty}*/ pprenda = { type: 'number' };
   /**@type {ModelProperty}*/ Tipo = { type: 'text' };
   /**@type {ModelProperty}*/ marca = { type: 'text' };
   /**@type {ModelProperty}*/ serie = { type: 'text' };
   /**@type {ModelProperty}*/ modelo = { type: 'text' };
   /**@type {ModelProperty}*/ iva = { type: 'text' };
   /**@type {ModelProperty}*/ margen = { type: 'text' };
   /**@type {ModelProperty}*/ estado = { type: 'text' };
   /**@type {ModelProperty}*/ interesl = { type: 'number' };
   /**@type {ModelProperty}*/ moral = { type: 'number' };
   /**@type {ModelProperty}*/ fliquidacion = { type: 'date' };
   /**@type {ModelProperty}*/ precio_venta = { type: 'number' };
   /**@type {ModelProperty}*/ en_manos_de = { type: 'text' };
   /**@type {ModelProperty}*/ color = { type: 'text' };
   /**@type {ModelProperty}*/ factura = { type: 'text' };
   /**@type {ModelProperty}*/ tipo_movimiento = { type: 'text' };
   /**@type {ModelProperty}*/ uso = { type: 'text' };
   /**@type {ModelProperty}*/ servicio = { type: 'text' };
   /**@type {ModelProperty}*/ v_porcentage_etiqueta = { type: 'number' };
   /**@type {ModelProperty}*/ Transactional_Valoracion = { type: 'WSELECT',  ModelObject: ()=> new Transactional_Valoracion_ModelComponent()};
   /**@type {ModelProperty}*/ Catalogo_Categoria = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Categoria_ModelComponent()};
   /**@type {ModelProperty}*/ Transaction_Contratos_old = { type: 'WSELECT',  ModelObject: ()=> new Transaction_Contratos_old_ModelComponent()};
   /**@type {ModelProperty}*/ Detail_Prendas_Vehiculos = { type: 'WSELECT',  ModelObject: ()=> new Detail_Prendas_Vehiculos_ModelComponent()};
}
export { Detail_Prendas_ModelComponent }
class Detail_Prendas_Vehiculos_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ capacidad_cilindros = { type: 'text' };
   /**@type {ModelProperty}*/ cantidad_cilindros = { type: 'text' };
   /**@type {ModelProperty}*/ cantidad_pasajeros = { type: 'text' };
   /**@type {ModelProperty}*/ year_vehiculo = { type: 'number' };
   /**@type {ModelProperty}*/ montor = { type: 'text' };
   /**@type {ModelProperty}*/ chasis = { type: 'text' };
   /**@type {ModelProperty}*/ placa = { type: 'text' };
   /**@type {ModelProperty}*/ circuacion = { type: 'text' };
   /**@type {ModelProperty}*/ defectuoso = { type: 'text' };
   /**@type {ModelProperty}*/ fecha_aut_descuento = { type: 'date' };
   /**@type {ModelProperty}*/ defecto = { type: 'text' };
   /**@type {ModelProperty}*/ porcentage_descuento_maximo = { type: 'number' };
   /**@type {ModelProperty}*/ fecha_seguro = { type: 'date' };
   /**@type {ModelProperty}*/ combustible = { type: 'text' };
   /**@type {ModelProperty}*/ Detail_Prendas = { type: 'WSELECT',  ModelObject: ()=> new Detail_Prendas_ModelComponent()};
}
export { Detail_Prendas_Vehiculos_ModelComponent }
class Detail_Valores_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ Valoracion_1 = { type: 'number' };
   /**@type {ModelProperty}*/ Valoracion_2 = { type: 'number' };
   /**@type {ModelProperty}*/ Valoracion_3 = { type: 'number' };
   /**@type {ModelProperty}*/ dolares_1 = { type: 'number' };
   /**@type {ModelProperty}*/ dolares_2 = { type: 'number' };
   /**@type {ModelProperty}*/ dolares_3 = { type: 'number' };
   /**@type {ModelProperty}*/ Transactional_Valoracion = { type: 'WSELECT',  ModelObject: ()=> new Transactional_Valoracion_ModelComponent()};
}
export { Detail_Valores_ModelComponent }
class Permisos_Cuentas_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ id_permiso = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ permite_debito = { type: 'checkbox' };
   /**@type {ModelProperty}*/ permite_credito = { type: 'checkbox' };
   /**@type {ModelProperty}*/ Categoria_Cuentas = { type: 'WSELECT',  ModelObject: ()=> new Categoria_Cuentas_ModelComponent()};
   /**@type {ModelProperty}*/ Categoria_Cuentas = { type: 'WSELECT',  ModelObject: ()=> new Categoria_Cuentas_ModelComponent()};
}
export { Permisos_Cuentas_ModelComponent }
class Transaction_Contratos_old_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ numero_contrato = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ fecha_contrato = { type: 'date' };
   /**@type {ModelProperty}*/ fecha_cancelar = { type: 'date' };
   /**@type {ModelProperty}*/ monto = { type: 'number' };
   /**@type {ModelProperty}*/ interes = { type: 'number' };
   /**@type {ModelProperty}*/ mora = { type: 'number' };
   /**@type {ModelProperty}*/ estado = { type: 'text' };
   /**@type {ModelProperty}*/ fecha_vencimiento = { type: 'date' };
   /**@type {ModelProperty}*/ saldo = { type: 'number' };
   /**@type {ModelProperty}*/ dias_mora = { type: 'number' };
   /**@type {ModelProperty}*/ saldo_mora = { type: 'number' };
   /**@type {ModelProperty}*/ fecha_baja = { type: 'date' };
   /**@type {ModelProperty}*/ abonos = { type: 'number' };
   /**@type {ModelProperty}*/ ultima_visita = { type: 'date' };
   /**@type {ModelProperty}*/ tipo = { type: 'number' };
   /**@type {ModelProperty}*/ entregado = { type: 'text' };
   /**@type {ModelProperty}*/ interes_actual = { type: 'number' };
   /**@type {ModelProperty}*/ observaciones = { type: 'text' };
   /**@type {ModelProperty}*/ iva = { type: 'number' };
   /**@type {ModelProperty}*/ margen = { type: 'number' };
   /**@type {ModelProperty}*/ interesl = { type: 'number' };
   /**@type {ModelProperty}*/ moral = { type: 'number' };
   /**@type {ModelProperty}*/ descuento = { type: 'number' };
   /**@type {ModelProperty}*/ util = { type: 'number' };
   /**@type {ModelProperty}*/ taza_interes_cargos = { type: 'number' };
   /**@type {ModelProperty}*/ taza_mora = { type: 'number' };
   /**@type {ModelProperty}*/ fecha_mora = { type: 'date' };
   /**@type {ModelProperty}*/ fecha_interes = { type: 'date' };
   /**@type {ModelProperty}*/ taza_gestion_crediticia = { type: 'number' };
   /**@type {ModelProperty}*/ Id_User_OLD = { type: 'number' };
   /**@type {ModelProperty}*/ taza_cambio = { type: 'number' };
   /**@type {ModelProperty}*/ dkm = { type: 'number' };
   /**@type {ModelProperty}*/ gasolinamonto = { type: 'number' };
   /**@type {ModelProperty}*/ valorcad = { type: 'number' };
   /**@type {ModelProperty}*/ plazo = { type: 'number' };
   /**@type {ModelProperty}*/ cuotafija = { type: 'number' };
   /**@type {ModelProperty}*/ montocuotaatrazadas = { type: 'number' };
   /**@type {ModelProperty}*/ mes_pagado = { type: 'date' };
   /**@type {ModelProperty}*/ tasa_hoy = { type: 'number' };
   /**@type {ModelProperty}*/ numero_protocolo = { type: 'number' };
   /**@type {ModelProperty}*/ valor_dolar = { type: 'number' };
   /**@type {ModelProperty}*/ parciales = { type: 'number' };
   /**@type {ModelProperty}*/ mora_parcial = { type: 'number' };
   /**@type {ModelProperty}*/ interes_parcial = { type: 'number' };
   /**@type {ModelProperty}*/ motivo_anulacion = { type: 'text' };
   /**@type {ModelProperty}*/ idcatemp = { type: 'number' };
   /**@type {ModelProperty}*/ cuota_fija_inicial = { type: 'number' };
   /**@type {ModelProperty}*/ fecha_cancelar_inicial = { type: 'date' };
   /**@type {ModelProperty}*/ plazo_inicial = { type: 'number' };
   /**@type {ModelProperty}*/ dias_para_baja = { type: 'number' };
   /**@type {ModelProperty}*/ Security_Users = { type: 'WSELECT',  ModelObject: ()=> new Security_Users_ModelComponent()};
   /**@type {ModelProperty}*/ Catalogo_Agentes = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Agentes_ModelComponent()};
   /**@type {ModelProperty}*/ Catalogo_Clientes = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Clientes_ModelComponent()};
   /**@type {ModelProperty}*/ Detail_Prendas = { type: 'MasterDetail',  ModelObject: ()=> new Detail_Prendas_ModelComponent()};
   /**@type {ModelProperty}*/ Recibos = { type: 'MasterDetail',  ModelObject: ()=> new Recibos_ModelComponent()};
   /**@type {ModelProperty}*/ Tbl_Cuotas = { type: 'MasterDetail',  ModelObject: ()=> new Tbl_Cuotas_ModelComponent()};
}
export { Transaction_Contratos_old_ModelComponent }
class Transaction_Contratos_Inversionistas_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ numero_cont = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ fecha = { type: 'date' };
   /**@type {ModelProperty}*/ taza = { type: 'number' };
   /**@type {ModelProperty}*/ monto_inicial = { type: 'number' };
   /**@type {ModelProperty}*/ nombre_sustituto = { type: 'text' };
   /**@type {ModelProperty}*/ identificacion_sustituto = { type: 'text' };
   /**@type {ModelProperty}*/ direccion_sustituto = { type: 'text' };
   /**@type {ModelProperty}*/ departamento_sus = { type: 'text' };
   /**@type {ModelProperty}*/ municipio_sustituto = { type: 'text' };
   /**@type {ModelProperty}*/ fecha_pago = { type: 'date' };
   /**@type {ModelProperty}*/ fecha_ultimo_pago = { type: 'date' };
   /**@type {ModelProperty}*/ saldo = { type: 'number' };
   /**@type {ModelProperty}*/ montointeres = { type: 'number' };
   /**@type {ModelProperty}*/ interes = { type: 'number' };
   /**@type {ModelProperty}*/ fecha_restructura = { type: 'date' };
   /**@type {ModelProperty}*/ Security_Users = { type: 'WSELECT',  ModelObject: ()=> new Security_Users_ModelComponent()};
   /**@type {ModelProperty}*/ Catalogo_Inversores = { type: 'WSELECT',  ModelObject: ()=> new Catalogo_Inversores_ModelComponent()};
}
export { Transaction_Contratos_Inversionistas_ModelComponent }
class Transaction_Egresos_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ numero_egreso = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ monto = { type: 'number' };
   /**@type {ModelProperty}*/ fecha = { type: 'date' };
   /**@type {ModelProperty}*/ descripcion = { type: 'text' };
   /**@type {ModelProperty}*/ nombre = { type: 'text' };
   /**@type {ModelProperty}*/ banco = { type: 'text' };
   /**@type {ModelProperty}*/ anulado = { type: 'text' };
   /**@type {ModelProperty}*/ observaciones = { type: 'text' };
   /**@type {ModelProperty}*/ tc = { type: 'number' };
   /**@type {ModelProperty}*/ dolar = { type: 'number' };
   /**@type {ModelProperty}*/ fanulado = { type: 'date' };
}
export { Transaction_Egresos_ModelComponent }
class Transaction_Facturas_old_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntityDbo');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ numero_factura = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ abono_de_cuota = { type: 'number' };
   /**@type {ModelProperty}*/ mora = { type: 'number' };
   /**@type {ModelProperty}*/ interes = { type: 'number' };
   /**@type {ModelProperty}*/ total = { type: 'number' };
   /**@type {ModelProperty}*/ fecha = { type: 'date' };
   /**@type {ModelProperty}*/ fecha_pago = { type: 'date' };
   /**@type {ModelProperty}*/ inte = { type: 'number' };
   /**@type {ModelProperty}*/ mor = { type: 'number' };
   /**@type {ModelProperty}*/ dm = { type: 'number' };
   /**@type {ModelProperty}*/ es = { type: 'text' };
   /**@type {ModelProperty}*/ tot = { type: 'number' };
   /**@type {ModelProperty}*/ an = { type: 'text' };
   /**@type {ModelProperty}*/ pago_contado = { type: 'number' };
   /**@type {ModelProperty}*/ saldo_monto = { type: 'number' };
   /**@type {ModelProperty}*/ ABONO = { type: 'number' };
   /**@type {ModelProperty}*/ descuento = { type: 'number' };
   /**@type {ModelProperty}*/ fecha_mora = { type: 'date' };
   /**@type {ModelProperty}*/ fecha_interes = { type: 'date' };
   /**@type {ModelProperty}*/ taza_cambio = { type: 'number' };
   /**@type {ModelProperty}*/ interes_actual = { type: 'number' };
   /**@type {ModelProperty}*/ Id_User_OLD = { type: 'number' };
   /**@type {ModelProperty}*/ fecha_grabado = { type: 'date' };
   /**@type {ModelProperty}*/ mes_pagado = { type: 'date' };
   /**@type {ModelProperty}*/ ultima_visita = { type: 'date' };
   /**@type {ModelProperty}*/ dmpagadas = { type: 'number' };
   /**@type {ModelProperty}*/ tipo = { type: 'text' };
   /**@type {ModelProperty}*/ morac = { type: 'number' };
   /**@type {ModelProperty}*/ interesc = { type: 'number' };
   /**@type {ModelProperty}*/ abonoc = { type: 'number' };
   /**@type {ModelProperty}*/ totalc = { type: 'number' };
   /**@type {ModelProperty}*/ parciales = { type: 'number' };
   /**@type {ModelProperty}*/ moraparcial = { type: 'number' };
   /**@type {ModelProperty}*/ interesparcial = { type: 'number' };
   /**@type {ModelProperty}*/ motivo_anulacion = { type: 'text' };
   /**@type {ModelProperty}*/ reestructuraciond = { type: 'number' };
   /**@type {ModelProperty}*/ reestructuracionc = { type: 'number' };
   /**@type {ModelProperty}*/ numero_reestructuracion = { type: 'number' };
   /**@type {ModelProperty}*/ fecha_cancelacion = { type: 'date' };
   /**@type {ModelProperty}*/ docnoentregadod = { type: 'number' };
   /**@type {ModelProperty}*/ docnoentregadoc = { type: 'number' };
   /**@type {ModelProperty}*/ Security_Users = { type: 'WSELECT',  ModelObject: ()=> new Security_Users_ModelComponent()};
   /**@type {ModelProperty}*/ Transaction_Contratos_old = { type: 'WSELECT',  ModelObject: ()=> new Transaction_Contratos_old_ModelComponent()};
}
export { Transaction_Facturas_old_ModelComponent }
