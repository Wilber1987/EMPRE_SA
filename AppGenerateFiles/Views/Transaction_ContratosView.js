import { WRender, ComponentsManager, WAjaxTools } from "../WDevCore/WModules/WComponentsTools.js";
import { StylesControlsV2, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { WFilterOptions } from "../WDevCore/WComponents/WFilterControls.js"
import { Transaction_Contratos } from "../FrontModel/DBODataBaseModel.js"
class Transaction_ContratosView extends HTMLElement {
   constructor(props) {
       super();
       this.Draw();
   }
   Draw = async () => {
       const model = new  Transaction_Contratos();
       const dataset = await model.Get();
       this.TabContainer = WRender.createElement({ type: 'div', props: { class: 'TabContainer', id: 'TabContainer' } })
       this.MainComponent = new WTableComponent({ ModelObject: model, Dataset: dataset, Options: {
           Add: true, UrlAdd: "../api/ApiEntityDBO/saveTransaction_Contratos",
           Edit: true, UrlUpdate: "../api/ApiEntityDBO/updateTransaction_Contratos",
           Search: true, UrlSearch: "../api/ApiEntityDBO/getTransaction_Contratos"
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
customElements.define('w-transaction_contratos', Transaction_ContratosView );
window.addEventListener('load', async () => {  MainBody.append(new Transaction_ContratosView())  })
