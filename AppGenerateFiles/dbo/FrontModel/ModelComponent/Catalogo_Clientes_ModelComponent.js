//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { Catalogo_Clasificacion_Cliente_ModelComponent }  from './Catalogo_Clasificacion_Cliente_ModelComponent.js'
import { Catalogo_Clasificacion_Interes_ModelComponent }  from './Catalogo_Clasificacion_Interes_ModelComponent.js'
import { Catalogo_Departamento_ModelComponent }  from './Catalogo_Departamento_ModelComponent.js'
import { Catalogo_Municipio_ModelComponent }  from './Catalogo_Municipio_ModelComponent.js'
import { Catalogo_Profesiones_ModelComponent }  from './Catalogo_Profesiones_ModelComponent.js'
import { Catalogo_Tipo_Identificacion_ModelComponent }  from './Catalogo_Tipo_Identificacion_ModelComponent.js'
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
