//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
class Tbl_Profile_ModelComponent extends EntityClass {
   constructor(props) {
       super(props, 'EntitySecurity');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {ModelProperty}*/ Id_Perfil = { type: 'number', primary: true };
   /**@type {ModelProperty}*/ Nombres = { type: 'text' };
   /**@type {ModelProperty}*/ Apellidos = { type: 'text' };
   /**@type {ModelProperty}*/ FechaNac = { type: 'date' };
   /**@type {ModelProperty}*/ IdUser = { type: 'number' };
   /**@type {ModelProperty}*/ Sexo = { type: 'text' };
   /**@type {ModelProperty}*/ Foto = { type: 'text' };
   /**@type {ModelProperty}*/ DNI = { type: 'text' };
   /**@type {ModelProperty}*/ Correo_institucional = { type: 'text' };
   /**@type {ModelProperty}*/ Id_Pais_Origen = { type: 'number' };
   /**@type {ModelProperty}*/ Estado = { type: 'text' };
}
export { Tbl_Profile_ModelComponent }
