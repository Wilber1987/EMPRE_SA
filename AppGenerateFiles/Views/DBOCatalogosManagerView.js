//@ts-check
import { WRender, ComponentsManager, WAjaxTools } from "../WDevCore/WModules/WComponentsTools.js";
import { WOrtograficValidation } from "../WDevCore/WModules/WOrtograficValidation.js";
import { StylesControlsV2, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { WAppNavigator } from "../WDevCore/WComponents/WAppNavigator.js"
import { Catalogo_Sucursales } from "../FrontModel/DBODataBaseModel.js"
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
       { name: WOrtograficValidation.es('Catalogo_Sucursales'), action : async ()=> {
           this.NavigateFunction(new Catalogo_Sucursales())
        }},
   ]});
}
customElements.define('w-catalogos_manager', CatalogosManagerView );
window.addEventListener('load', async () => {  MainBody.append(new CatalogosManagerView()) })
