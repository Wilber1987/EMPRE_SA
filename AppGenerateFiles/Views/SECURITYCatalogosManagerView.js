//@ts-check
import { WRender, ComponentsManager, WAjaxTools } from "../WDevCore/WModules/WComponentsTools.js";
import { WOrtograficValidation } from "../WDevCore/WModules/WOrtograficValidation.js";
import { StylesControlsV2, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { WAppNavigator } from "../WDevCore/WComponents/WAppNavigator.js"
import {  } from "../FrontModel/SECURITYDataBaseModel.js"
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
   ]});
}
customElements.define('w-catalogos_manager', CatalogosManagerView );
window.addEventListener('load', async () => {  MainBody.append(new CatalogosManagerView()) })
