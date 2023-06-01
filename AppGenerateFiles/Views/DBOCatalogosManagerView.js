//@ts-check
import { WRender, ComponentsManager, WAjaxTools } from "../WDevCore/WModules/WComponentsTools.js";
import { WOrtograficValidation } from "../WDevCore/WModules/WOrtograficValidation.js";
import { StylesControlsV2, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { WAppNavigator } from "../WDevCore/WComponents/WAppNavigator.js"
import { Catalogo_Agentes,Catalogo_Cambio_Dolar,Catalogo_Clasificacion_Cliente,Catalogo_Clientes,Catalogo_Cuentas,Catalogo_Departamento,Catalogo_Estados_Articulos,Catalogo_Inversores,Catalogo_Municipio,Catalogo_Nacionalidad,Catalogo_Profesiones,Catalogo_Sucursales,Catalogo_Tipo_Agente,Catalogo_Tipo_Identificacion,Catalogo_Tipo_Transaccion } from "../FrontModel/DBODataBaseModel.js"
class CatalogosManagerView extends HTMLElement {
   constructor() {
       super();
       this.TabContainer = WRender.createElement({ type: 'div', props: { class: 'TabContainer', id: 'TabContainer' } })
       this.TabManager = new ComponentsManager({ MainContainer: this.TabContainer });
       this.append(
           StylesControlsV2.cloneNode(true),
           StyleScrolls.cloneNode(true),
          this.MainNav,
           this.TabContainer
       );
   }
   /** @param {Object} Model*/
   NavigateFunction = (Model)=>{
       const mainComponent = new WTableComponent({ ModelObject: model, Dataset: [], Options: {
           Add: true,
           Edit: true,
           Search: true,
           Delete: true
       }})
       this.TabManager.NavigateFunction(Model.constructor.name, mainComponent);
   }
    MainNav = new WAppNavigator({  Elements: [
       { name: WOrtograficValidation.es('Catalogo_Agentes'), action : async ()=> {
           this.NavigateFunction(new Catalogo_Agentes())
        }},
       { name: WOrtograficValidation.es('Catalogo_Cambio_Dolar'), action : async ()=> {
           this.NavigateFunction(new Catalogo_Cambio_Dolar())
        }},
       { name: WOrtograficValidation.es('Catalogo_Clasificacion_Cliente'), action : async ()=> {
           this.NavigateFunction(new Catalogo_Clasificacion_Cliente())
        }},
       { name: WOrtograficValidation.es('Catalogo_Clientes'), action : async ()=> {
           this.NavigateFunction(new Catalogo_Clientes())
        }},
       { name: WOrtograficValidation.es('Catalogo_Cuentas'), action : async ()=> {
           this.NavigateFunction(new Catalogo_Cuentas())
        }},
       { name: WOrtograficValidation.es('Catalogo_Departamento'), action : async ()=> {
           this.NavigateFunction(new Catalogo_Departamento())
        }},
       { name: WOrtograficValidation.es('Catalogo_Estados_Articulos'), action : async ()=> {
           this.NavigateFunction(new Catalogo_Estados_Articulos())
        }},
       { name: WOrtograficValidation.es('Catalogo_Inversores'), action : async ()=> {
           this.NavigateFunction(new Catalogo_Inversores())
        }},
       { name: WOrtograficValidation.es('Catalogo_Municipio'), action : async ()=> {
           this.NavigateFunction(new Catalogo_Municipio())
        }},
       { name: WOrtograficValidation.es('Catalogo_Nacionalidad'), action : async ()=> {
           this.NavigateFunction(new Catalogo_Nacionalidad())
        }},
       { name: WOrtograficValidation.es('Catalogo_Profesiones'), action : async ()=> {
           this.NavigateFunction(new Catalogo_Profesiones())
        }},
       { name: WOrtograficValidation.es('Catalogo_Sucursales'), action : async ()=> {
           this.NavigateFunction(new Catalogo_Sucursales())
        }},
       { name: WOrtograficValidation.es('Catalogo_Tipo_Agente'), action : async ()=> {
           this.NavigateFunction(new Catalogo_Tipo_Agente())
        }},
       { name: WOrtograficValidation.es('Catalogo_Tipo_Identificacion'), action : async ()=> {
           this.NavigateFunction(new Catalogo_Tipo_Identificacion())
        }},
       { name: WOrtograficValidation.es('Catalogo_Tipo_Transaccion'), action : async ()=> {
           this.NavigateFunction(new Catalogo_Tipo_Transaccion())
        }},
   ]});
}
customElements.define('w-catalogos_manager', CatalogosManagerView );
window.addEventListener('load', async () => {  MainBody.append(new CatalogosManagerView()) })
