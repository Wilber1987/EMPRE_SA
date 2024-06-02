import { EntityClass } from "../WDevCore/WModules/EntityClass.js";
import { WAjaxTools } from "../WDevCore/WModules/WComponentsTools.js";
class Transactional_Configuraciones extends EntityClass {
    constructor(props) {
        super(props, 'EntityADMINISTRATIVE_ACCESS');
        for (const prop in props) {
            this[prop] = props[prop];
        }
    }
    Id_Configuracion = { type: 'number', primary: true };
    Nombre = { type: 'text', disabled: true };
    Descripcion = { type: 'text', disabled: true };
    Valor = { type: 'text' };
    Tipo_Configuracion = { type: 'text' , disabled: true };
    getTransactional_Configuraciones_Intereses =  async () => {
        return await this.GetData("ApiEntityADMINISTRATIVE_ACCESS/getTransactional_Configuraciones_Intereses");
    }
    getTransactional_Configuraciones_Beneficios =  async () => {
        return await this.GetData("ApiEntityADMINISTRATIVE_ACCESS/getTransactional_Configuraciones_Beneficios");
    }
}
export { Transactional_Configuraciones }
