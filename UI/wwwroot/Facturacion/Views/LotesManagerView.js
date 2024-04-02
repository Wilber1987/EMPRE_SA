//@ts-check
// @ts-ignore
import { ComponentsManager, WRender } from "../../WDevCore/WModules/WComponentsTools.js";
// @ts-ignore
import { WTableComponent } from "../../WDevCore/WComponents/WTableComponent.js";
// @ts-ignore
import { WAppNavigator } from "../../WDevCore/WComponents/WAppNavigator.js";
import { ModalMessege, ModalVericateAction } from "../../WDevCore/WComponents/WForm.js";
import { css } from "../../WDevCore/WModules/WStyledRender.js";
import { Tbl_Lotes_ModelComponent } from "../FrontModel/ModelComponent/Tbl_Lotes_ModelComponent.js";
import { Tbl_Lotes } from "../FrontModel/Tbl_Lotes.js";

/**
 * @typedef {Object} LotesConfig
 * * @property {Tbl_Lotes} [Entity]
 * * @property {Tbl_Lotes}[TasaCambio]
 */
class LotesManagerView extends HTMLElement {
    constructor(LotesConfig) {
        super();
        this.LotesConfig = LotesConfig;
        this.OptionContainer = WRender.Create({ className: "OptionContainer" });
        this.TabContainer = WRender.Create({ className: "TabContainer", id: 'TabContainer' });
        this.Manager = new ComponentsManager({ MainContainer: this.TabContainer, SPAManage: false });

        this.navigator = new WAppNavigator({ Inicialize: true, Elements: this.ElementsNav })
        this.append(this.CustomStyle, this.OptionContainer, this.navigator, this.TabContainer);
        this.indexFactura = 0;
        this.Draw();
        this.valoresObject = {
            subtotal: 0,
            iva: 0,
        }
    }
    ElementsNav = [
        {
            name: "Lotes Proveedor", action: () => {
                this.Manager.NavigateFunction("Lotes", new WTableComponent({
                    ModelObject: new Tbl_Lotes_ModelComponent,
                    EntityModel: new Tbl_Lotes,
                    TypeMoney: "Dollar",                  
                    Options: {
                        Search: false, Filter: true, Add: false, Edit: false, FilterDisplay: true,
                        UserActions: [{
                            name: "Anular",
                            action: async (/**@type {Tbl_Lotes}*/Lote) => {
                                this.append(ModalVericateAction(async () => {
                                 
                                }, "¿Esta seguro que desea anular esta Lote?"))
                            }
                        }]
                    }
                }))
            }
        }, {
            name: "Nueva Factura Proveedor", action: () => {
               window.location.href = "/Facturacion/LotesComponentView";
            }
        }
    ]

    Draw = async () => {
    }//end draw

    BuildLoteModel = () => {
        this.LotesModel = new Tbl_Lotes_ModelComponent();
    }
    CustomStyle = css`       
        .OptionContainer{
            display: flex;
        }
    `
}
customElements.define('w-main-lotes-manager', LotesManagerView);
export { LotesManagerView };

window.addEventListener('load', async () => {
    // @ts-ignore
    MainBody.append(new LotesManagerView())
});