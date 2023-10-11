import { WRender, ComponentsManager, WAjaxTools } from "../WDevCore/WModules/WComponentsTools.js";
import { StylesControlsV2, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { Recibos, Transaccion_Factura } from "../FrontModel/DBODataBaseModel.js"
import { WModalForm } from "../WDevCore/WComponents/WModalForm.js";
class Ver_RecibosView extends HTMLElement {
    constructor(props) {
        super();
        this.TabContainer = WRender.createElement({ type: 'div', props: { class: 'TabContainer', id: 'TabContainer' } })
        this.MainComponent = new WTableComponent({
            EntityModel: new Transaccion_Factura({ Factura_contrato: {}}),
            ModelObject: new Transaccion_Factura(), Dataset: [],
            Options: {                
                Show: true,
                Search: true                
            }
        })
        this.TabContainer.append(this.MainComponent)
        this.append(
            StylesControlsV2.cloneNode(true),
            StyleScrolls.cloneNode(true),
            this.TabContainer
        );
    }
}
customElements.define('w-datos_configuracion', Ver_RecibosView);
window.addEventListener('load', async () => { MainBody.append(new Ver_RecibosView()) })
