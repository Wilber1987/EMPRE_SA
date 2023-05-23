import { WRender, ComponentsManager, WAjaxTools } from "../WDevCore/WModules/WComponentsTools.js";
import { StylesControlsV2, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { id_tipo_transaccion } from "../FrontModel/DBODataBaseModel.js"
class id_tipo_transaccionView extends HTMLElement {
   constructor(props) {
       super();
       this.TabContainer = WRender.createElement({ type: 'div', props: { class: 'TabContainer', id: 'TabContainer' } })
       this.MainComponent = new WTableComponent({ ModelObject: new id_tipo_transaccion(), Dataset: [], Options: {
           Add: true, UrlAdd: "../api/ApiEntityDBO/saveid_tipo_transaccion",
           Edit: true, UrlUpdate: "../api/ApiEntityDBO/updateid_tipo_transaccion",
           Search: true, UrlSearch: "../api/ApiEntityDBO/getid_tipo_transaccion"
       }})
       this.TabContainer.append(this.MainComponent)
       this.append(
           StylesControlsV2.cloneNode(true),
           StyleScrolls.cloneNode(true),
           this.TabContainer
       );
   }
}
customElements.define('w-id_tipo_transaccion', id_tipo_transaccionView );
window.addEventListener('load', async () => {  MainBody.append(new id_tipo_transaccionView())  })
