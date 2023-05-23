import { WRender, ComponentsManager, WAjaxTools } from "../WDevCore/WModules/WComponentsTools.js";
import { StylesControlsV2, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { Transaction_Contratos } from "../FrontModel/DBODataBaseModel.js"
class Transaction_ContratosView extends HTMLElement {
   constructor(props) {
       super();
       this.TabContainer = WRender.createElement({ type: 'div', props: { class: 'TabContainer', id: 'TabContainer' } })
       this.MainComponent = new WTableComponent({ ModelObject: new Transaction_Contratos(), Dataset: [], Options: {
           Add: true, UrlAdd: "../api/ApiEntityDBO/saveTransaction_Contratos",
           Edit: true, UrlUpdate: "../api/ApiEntityDBO/updateTransaction_Contratos",
           Search: true, UrlSearch: "../api/ApiEntityDBO/getTransaction_Contratos"
       }})
       this.TabContainer.append(this.MainComponent)
       this.append(
           StylesControlsV2.cloneNode(true),
           StyleScrolls.cloneNode(true),
           this.TabContainer
       );
   }
}
customElements.define('w-transaction_contratos', Transaction_ContratosView );
window.addEventListener('load', async () => {  MainBody.append(new Transaction_ContratosView())  })
