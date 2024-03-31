//@ts-check
// @ts-ignore
import { ComponentsManager, WRender } from "../../WDevCore/WModules/WComponentsTools.js";
// @ts-ignore
import { WTableComponent } from "../../WDevCore/WComponents/WTableComponent.js";
// @ts-ignore
import { WAppNavigator } from "../../WDevCore/WComponents/WAppNavigator.js";
import { ModalMessege, ModalVericateAction } from "../../WDevCore/WComponents/WForm.js";
import { css } from "../../WDevCore/WModules/WStyledRender.js";
import { Tbl_Compra_ModelComponent } from "../FrontModel/ModelComponent/Tbl_Compra_ModelComponent.js";
import { Tbl_Compra } from "../FrontModel/Tbl_Compra.js";

/**
 * @typedef {Object} ComprasConfig
 * * @property {Tbl_Compra} [Entity]
 * * @property {Tbl_Compra}[TasaCambio]
 */
class ComprasManagerView extends HTMLElement {
    constructor(ComprasConfig) {
        super();
        this.ComprasConfig = ComprasConfig;
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
            name: "Compras Proveedor", action: () => {
                this.Manager.NavigateFunction("Compras", new WTableComponent({
                    ModelObject: new Tbl_Compra_ModelComponent, EntityModel: new Tbl_Compra,
                    Options: {
                        Search: false, Filter: true, Add: false, Edit: false,
                        UserActions: [{
                            name: "Anular",
                            action: async (/**@type {Tbl_Compra}*/compra) => {
                                this.append(ModalVericateAction(async () => {
                                    const response = await compra.Anular();
                                    // @ts-ignore
                                    this.append(ModalMessege(response.message));

                                    //modal.close();
                                }, "¿Esta seguro que desea anular esta compra?"))
                            }
                        }]
                    }
                }))
            }
        }, {
            name: "Nueva Factura Proveedor", action: () => {
               window.location.href = "/Facturacion/ComprasComponentView";
            }
        }
    ]

    Draw = async () => {
    }//end draw

    BuildCompraModel = () => {
        this.ComprasModel = new Tbl_Compra_ModelComponent();
    }
    CustomStyle = css`       
        .OptionContainer{
            display: flex;
        }
    `
}
customElements.define('w-main-compras-manager', ComprasManagerView);
export { ComprasManagerView };

window.addEventListener('load', async () => {
    // @ts-ignore
    MainBody.append(new ComprasManagerView())
});