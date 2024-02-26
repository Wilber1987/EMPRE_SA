//@ts-check
import { EntityClass } from "../../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../../WDevCore/WModules/WComponentsTools.js";
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
class Tbl_Profile extends EntityClass {
   constructor(props) {
       super(props, 'EntitySecurity');
       for (const prop in props) {
           this[prop] = props[prop];
       }
   }
   /**@type {Number}*/ Id_Perfil;
   /**@type {String}*/ Nombres;
   /**@type {String}*/ Apellidos;
   /**@type {Date}*/ FechaNac;
   /**@type {Number}*/ IdUser;
   /**@type {String}*/ Sexo;
   /**@type {String}*/ Foto;
   /**@type {String}*/ DNI;
   /**@type {String}*/ Correo_institucional;
   /**@type {Number}*/ Id_Pais_Origen;
   /**@type {String}*/ Estado;
}
export { Tbl_Profile }
