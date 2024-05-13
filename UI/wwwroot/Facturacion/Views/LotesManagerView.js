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
import { WModalForm } from "../../WDevCore/WComponents/WModalForm.js";
import { Tbl_Transaccion } from "../FrontModel/Tbl_Transaction.js";
import { Tbl_Transaccion_ModelComponent } from "../FrontModel/ModelComponent/Tbl_Transaction_ModelComponent.js";

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
                            name: "Dar de baja",
                            action: async (/**@type {Tbl_Lotes}*/Lote) => {

                                const modal = new WModalForm({
                                    ModelObject: new Tbl_Transaccion_ModelComponent({
                                        Cantidad: { type: 'number', min: 1, max: Lote.Cantidad_Existente, defaultValue: 1 }
                                    }),
                                    //EditObject: Transaction,
                                    title: "BAJA DE EXISTENCIA",
                                    ObjectOptions: {
                                        SaveFunction: async (/**@type {Tbl_Transaccion}*/ editObject) => {
                                            editObject.Id_Lote = Lote.Id_Lote;
                                            this.append(ModalVericateAction(async ( ) => {
                                                console.log(editObject);
                                                const response = await new Tbl_Lotes().DarDeBaja(editObject);
                                                this.append(ModalMessege(response.message));
                                                modal.close();
                                            }, "Esta seguro que desea dar de baja esta existencia?"))
                                        }
                                    }
                                });
                                this.append(modal);

                            }
                        }]
                    }
                }))
            }
        }/*, {
            name: "Nueva Factura Proveedor", action: () => {
               window.location.href = "/Facturacion/LotesComponentView";
            }
        }*/
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