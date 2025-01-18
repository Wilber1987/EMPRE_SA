//@ts-check
// @ts-ignore
import { ComponentsManager, html, WRender } from "../../WDevCore/WModules/WComponentsTools.js";
// @ts-ignore
// @ts-ignore
import { WAppNavigator } from "../../WDevCore/WComponents/WAppNavigator.js";
import { css } from "../../WDevCore/WModules/WStyledRender.js";
import { Tbl_Compra } from "../FrontModel/Tbl_Compra.js";
import { VentasComponent } from "./VentasComponent.js";
import { Tbl_Factura } from "../FrontModel/Tbl_Factura.js";
import { DocumentViewer } from "../../WDevCore/WComponents/WDocumentViewer.js";
import { WPrintExportToolBar } from "../../WDevCore/WComponents/WPrintExportToolBar.mjs";
import { DocumentsData } from "../FrontModel/DocumentsData.js";
import { WTableComponent } from "../../WDevCore/WComponents/WTableComponent.js";
import { Tbl_Factura_ModelComponent } from "../FrontModel/ModelComponent/Tbl_Factura_ModelComponent.js";
import { WModalForm } from "../../WDevCore/WComponents/WModalForm.js";
import { Catalogo_Cambio_Divisa_ModelComponent } from "../../FrontModel/DBODataBaseModel.js";
import { Catalogo_Cambio_Divisa } from "../../FrontModel/Catalogo_Cambio_Divisa.js";
import { DateTime } from "../../WDevCore/WModules/Types/DateTime.js";
import { WOrtograficValidation } from "../../WDevCore/WModules/WOrtograficValidation.js";
import { Detalle_Factura } from "../FrontModel/Detalle_Factura.js";
import { FacturasBuilder } from "./Builders/FacturasBuilder.js";

/**
 * @typedef {Object} FacturacionConfig
 * * @property {Tbl_Factura} [Entity]
 * * @property {Object}[TasaCambio]
 * * @property {Number}[IvaPercent]
 */

class FacturaComponentView extends HTMLElement {

    /**
     * @param {FacturacionConfig} FacturacionConfig
     */
    constructor(FacturacionConfig) {
        super();
        this.FacturacionConfig = FacturacionConfig ?? {};
        this.OptionContainer = WRender.Create({ className: "OptionContainer" });
        this.TabContainer = WRender.Create({ className: "TabContainer", id: 'TabContainer' });
        this.Manager = new ComponentsManager({ MainContainer: this.TabContainer, SPAManage: true });
        this.navigator = new WAppNavigator({ Inicialize: true, Elements: this.ElementsNav,   })
        this.append(this.CustomStyle, this.OptionContainer, this.navigator, this.TabContainer);
        this.Draw();
    }
    ElementsNav = [{
        name: "Ventas", action: async () => {
            this.Manager.NavigateFunction("FacturasRealizadas", await this.VerFacturasRealizadas())
        }
    }, {
        name: "Nueva Venta", action: async () => {
            await this.NewFactura();

            //new WForm({ ModelObject: this.ComprasModel, EntityModel: new Tbl_Compra }))
        }
    }]

    Draw = async () => {
        this.TabContainer
    }
    async NewFactura() {
        this.tasasCambio = await new Catalogo_Cambio_Divisa().Get();
        /**@type  {Catalogo_Cambio_Divisa}*/
        this.TasaActual = this.tasasCambio[0];

        this.Manager.NavigateFunction("newFactura", new VentasComponent({
            TasaActual: this.TasaActual,
            action: async (/**@type {Tbl_Factura} */ factura) => {
                switch (factura.Tipo) {
                    case "VENTA":
                        this.Manager.NavigateFunction("newFacturaPrinter", await this.VerFactura(factura));
                        break;    
                    case "VENTA":           
                    default:
                        break;
                }
                
            }
        }));
    }

    VerFacturasRealizadas() {
        return new WTableComponent({
            ModelObject: new Tbl_Factura_ModelComponent(),
            Options: {
                Filter: true,
                UserActions: [
                    {
                        name: "Imprimir", action: async (/**@type {Tbl_Factura} */ factura) => {
                            this.append(new WModalForm({
                                ObjectModal: await this.VerFactura(factura)
                            }))
                        }
                    }
                ]
            }
        });
    }

    /**
     * @param {Tbl_Factura} factura
     * @returns {Promise<HTMLElement>}
     */
    async VerFactura(factura) {
        /**@type {DocumentsData} */
        const documentsData = await new DocumentsData().GetDataFragments();
        documentsData.Header.style.width = "100%";
        this.factura = FacturasBuilder.BuildFactura(factura, documentsData)
        return html`<div class="factura-container-modal">
            ${this.BuildOptionsBar(this.factura, documentsData)}
            <div class="factura-container"> ${this.factura}</div>           
        </div>`;
    }   

    /**
    * @param {HTMLElement} factura
    */
    BuildOptionsBar(factura, documentsData) {

        return new WPrintExportToolBar({
            PrintAction: (toolBar) => {
                toolBar.Print(html`<div class="page">                   
                    ${factura.innerHTML}    
                </div>`);
                return;
            }, ExportPdfAction: (/** @type {WPrintExportToolBar} */ toolBar) => {
                const body = html`<div class="page" style="position:relative">
                    ${factura.innerHTML}
                </div>`
                toolBar.ExportPdf(body);
                return;
            },
        });
    }

    CustomStyle = css`
        .factura-container {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
    `
}
customElements.define('w-main-factura-component', FacturaComponentView);
export { FacturaComponentView };

window.addEventListener('load', async () => {
    // @ts-ignore
    MainBody.append(new FacturaComponentView())
});