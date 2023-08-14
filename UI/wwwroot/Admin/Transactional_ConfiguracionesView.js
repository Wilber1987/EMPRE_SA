import { WRender, ComponentsManager, WAjaxTools } from "../WDevCore/WModules/WComponentsTools.js";
import { StylesControlsV2, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { WFilterOptions } from "../WDevCore/WComponents/WFilterControls.js"
import { Transactional_Configuraciones } from "../FrontModel/ADMINISTRATIVE_ACCESSDataBaseModel.js"
import { WModalForm } from "../WDevCore/WComponents/WModalForm.js";
class Transactional_ConfiguracionesView extends HTMLElement {
    constructor(props) {
        super();
        this.Draw();
    }
    Draw = async () => {
        const model = new Transactional_Configuraciones();
        const dataset = await model.Get();
        this.TabContainer = WRender.createElement({ type: 'div', props: { class: 'TabContainer', id: 'TabContainer' } })
        this.MainComponent = new WTableComponent({
            ModelObject: model, Dataset: dataset, Options: {
                UrlUpdate: "../api/ApiEntityADMINISTRATIVE_ACCESS/updateTransactional_Configuraciones",
                Search: true, UserActions: [
                    {
                        name: "Editar", action: (element) => {
                            this.append(new WModalForm({
                                ModelObject: new Transactional_Configuraciones({
                                    Valor: { type: this.IsNumber(element) ? "NUMBER" : "TEXT" }
                                }),
                                EditObject: element
                            }))
                        }
                    }
                ]

            }
        })
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

    IsNumber(element) {
        return element.Tipo_Configuracion == "INTERESES" || element.Tipo_Configuracion == "BENEFICIOS";
    }
}
customElements.define('w-transactional_configuraciones', Transactional_ConfiguracionesView);
export { Transactional_ConfiguracionesView }
