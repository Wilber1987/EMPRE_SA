import { WRender, ComponentsManager, WAjaxTools } from "../WDevCore/WModules/WComponentsTools.js";
import { StylesControlsV2, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { Transaction_Egresos } from "../FrontModel/DBODataBaseModel.js"
class Transaction_EgresosView extends HTMLElement {
   constructor(props) {
       super();
       this.TabContainer = WRender.createElement({ type: 'div', props: { class: 'TabContainer', id: 'TabContainer' } })
       this.MainComponent = new WTableComponent({ ModelObject: new Transaction_Egresos(), Dataset: [], Options: {
           Add: true, UrlAdd: "../api/ApiEntityDBO/saveTransaction_Egresos",
           Edit: true, UrlUpdate: "../api/ApiEntityDBO/updateTransaction_Egresos",
           Search: true, UrlSearch: "../api/ApiEntityDBO/getTransaction_Egresos"
       }})
       this.TabContainer.append(this.MainComponent)
       this.append(
           StylesControlsV2.cloneNode(true),
           StyleScrolls.cloneNode(true),
           this.TabContainer
       );
   }
}
customElements.define('w-transaction_egresos', Transaction_EgresosView );
window.addEventListener('load', async () => {  MainBody.append(new Transaction_EgresosView())  })
