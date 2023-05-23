import { WRender, ComponentsManager, WAjaxTools } from "../WDevCore/WModules/WComponentsTools.js";
import { StylesControlsV2, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { Transaction_Ingresos_Egresos } from "../FrontModel/DBODataBaseModel.js"
class Transaction_Ingresos_EgresosView extends HTMLElement {
   constructor(props) {
       super();
       this.TabContainer = WRender.createElement({ type: 'div', props: { class: 'TabContainer', id: 'TabContainer' } })
       this.MainComponent = new WTableComponent({ ModelObject: new Transaction_Ingresos_Egresos(), Dataset: [], Options: {
           Add: true, UrlAdd: "../api/ApiEntityDBO/saveTransaction_Ingresos_Egresos",
           Edit: true, UrlUpdate: "../api/ApiEntityDBO/updateTransaction_Ingresos_Egresos",
           Search: true, UrlSearch: "../api/ApiEntityDBO/getTransaction_Ingresos_Egresos"
       }})
       this.TabContainer.append(this.MainComponent)
       this.append(
           StylesControlsV2.cloneNode(true),
           StyleScrolls.cloneNode(true),
           this.TabContainer
       );
   }
}
customElements.define('w-transaction_ingresos_egresos', Transaction_Ingresos_EgresosView );
window.addEventListener('load', async () => {  MainBody.append(new Transaction_Ingresos_EgresosView())  })
