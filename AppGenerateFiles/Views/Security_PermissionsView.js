import { WRender, ComponentsManager, WAjaxTools } from "../WDevCore/WModules/WComponentsTools.js";
import { StylesControlsV2, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { WFilterOptions } from "../WDevCore/WComponents/WFilterControls.js"
import { Security_Permissions } from "../FrontModel/SECURITYDataBaseModel.js"
class Security_PermissionsView extends HTMLElement {
   constructor(props) {
       super();
       this.Draw();
   }
   Draw = async () => {
       const model = new  Security_Permissions();
       const dataset = await model.Get();
       this.TabContainer = WRender.createElement({ type: 'div', props: { class: 'TabContainer', id: 'TabContainer' } })
       this.MainComponent = new WTableComponent({ ModelObject: model, Dataset: dataset, Options: {
           Add: true, UrlAdd: "../api/ApiEntitySECURITY/saveSecurity_Permissions",
           Edit: true, UrlUpdate: "../api/ApiEntitySECURITY/updateSecurity_Permissions",
           Search: true, UrlSearch: "../api/ApiEntitySECURITY/getSecurity_Permissions"
       }})
       this.TabContainer.append(this.MainComponent)
       this.FilterOptions = new WFilterOptions({
           Dataset: dataset,
           ModelObject: model,
           FilterFunction: (DFilt) => {
               this.MainComponent.DrawTable(DFilt);
           }
      });
       this.append(
           StylesControlsV2.cloneNode(true),
           StyleScrolls.cloneNode(true),
           this.FilterOptions,
           this.TabContainer
       );
   }
}
customElements.define('w-security_permissions', Security_PermissionsView );
window.addEventListener('load', async () => {  MainBody.append(new Security_PermissionsView())  })
