import { EntityClass } from "../WDevCore/WModules/EntityClass.js";
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
    getConfiguraciones_Intereses =  async () => {
        return await this.GetData("ApiEntityADMINISTRATIVE_ACCESS/getConfiguraciones_Intereses");
    }
    getConfiguraciones_Beneficios =  async () => {
        return await this.GetData("ApiEntityADMINISTRATIVE_ACCESS/getConfiguraciones_Beneficios");
    }
    /**
    * @returns {Promise<Array<Transactional_Configuraciones>>}
    */
    getConfiguraciones_Configs =  async () => {
        return await this.GetData("ApiEntityADMINISTRATIVE_ACCESS/getConfiguraciones_Configs");
    }
    GetConfigs =  async () => {
        return await this.GetData("ApiEntityADMINISTRATIVE_ACCESS/getConfiguraciones_Theme");
    }
}
export { Transactional_Configuraciones }
