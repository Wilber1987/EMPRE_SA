import { WRender, ComponentsManager, WAjaxTools } from "../WDevCore/WModules/WComponentsTools.js";
import { StylesControlsV2, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { Transaction_Contratos_Inversionistas } from "../FrontModel/DBODataBaseModel.js"
import { WFilterOptions } from "../WDevCore/WComponents/WFilterControls.js";
class Transaction_Contratos_InversionistasView extends HTMLElement {
    constructor(props) {
        super();
        this.Draw();
    }
    Draw = async () => {
        const model = new Transaction_Contratos_Inversionistas();
        const dataset = await model.Get();
        this.TabContainer = WRender.createElement({ type: 'div', props: { class: 'TabContainer', id: 'TabContainer' } })
        this.MainComponent = new WTableComponent({
            ModelObject: model, Dataset: dataset, Options: {
                Add: true, UrlAdd: "../api/ApiEntityDBO/saveTransaction_Contratos_Inversionistas",
                //Edit: true, UrlUpdate: "../api/ApiEntityDBO/updateTransaction_Contratos_Inversionistas",
                Search: true, UrlSearch: "../api/ApiEntityDBO/getTransaction_Contratos_Inversionistas"
            }
        })
        this.FilterOptions = new WFilterOptions({
            Dataset: dataset,
            ModelObject: model,
            FilterFunction: (DFilt) => {
                this.MainComponent.DrawTable(DFilt);
            }
        });
        this.TabContainer.append(this.MainComponent)
        this.append(
            StylesControlsV2.cloneNode(true),
            StyleScrolls.cloneNode(true),
            this.FilterOptions,
            this.TabContainer
        );
    }
}
customElements.define('w-transaction_contratos_inversionistas', Transaction_Contratos_InversionistasView);
window.addEventListener('load', async () => { MainBody.append(new Transaction_Contratos_InversionistasView()) })
