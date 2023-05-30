import { WRender, ComponentsManager, WAjaxTools } from "../WDevCore/WModules/WComponentsTools.js";
import { StylesControlsV2, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { WFilterOptions } from "../WDevCore/WComponents/WFilterControls.js"
import { Transactional_Valoracion } from "../FrontModel/DBODataBaseModel.js"
class Transactional_ValoracionView extends HTMLElement {
   constructor(props) {
       super();
       this.Draw();
   }
   Draw = async () => {
       const model = new  Transactional_Valoracion();
       const dataset = await model.Get();
       this.TabContainer = WRender.createElement({ type: 'div', props: { class: 'TabContainer', id: 'TabContainer' } })
       this.MainComponent = new WTableComponent({ ModelObject: model, Dataset: dataset, Options: {
           Add: true, UrlAdd: "../api/ApiEntityDBO/saveTransactional_Valoracion",
           Edit: true, UrlUpdate: "../api/ApiEntityDBO/updateTransactional_Valoracion",
           Search: true, UrlSearch: "../api/ApiEntityDBO/getTransactional_Valoracion"
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
customElements.define('w-transactional_valoracion', Transactional_ValoracionView );
window.addEventListener('load', async () => {  MainBody.append(new Transactional_ValoracionView())  })
