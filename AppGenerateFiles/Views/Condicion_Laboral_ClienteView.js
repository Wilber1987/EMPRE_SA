import { WRender, ComponentsManager, WAjaxTools } from "../WDevCore/WModules/WComponentsTools.js";
import { StylesControlsV2, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { WFilterOptions } from "../WDevCore/WComponents/WFilterControls.js"
import { Condicion_Laboral_Cliente } from "../FrontModel/DBODataBaseModel.js"
class Condicion_Laboral_ClienteView extends HTMLElement {
   constructor(props) {
       super();
       this.Draw();
   }
   Draw = async () => {
       const model = new  Condicion_Laboral_Cliente();
       const dataset = await model.Get();
       this.TabContainer = WRender.createElement({ type: 'div', props: { class: 'TabContainer', id: 'TabContainer' } })
       this.MainComponent = new WTableComponent({ ModelObject: model, Dataset: dataset, Options: {
           Add: true, UrlAdd: "../api/ApiEntityDBO/saveCondicion_Laboral_Cliente",
           Edit: true, UrlUpdate: "../api/ApiEntityDBO/updateCondicion_Laboral_Cliente",
           Search: true, UrlSearch: "../api/ApiEntityDBO/getCondicion_Laboral_Cliente"
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
customElements.define('w-condicion_laboral_cliente', Condicion_Laboral_ClienteView );
window.addEventListener('load', async () => {  MainBody.append(new Condicion_Laboral_ClienteView())  })