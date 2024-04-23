import { WRender, ComponentsManager, WAjaxTools } from "../WDevCore/WModules/WComponentsTools.js";
import { StylesControlsV2, StylesControlsV3, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { Transaccion_Factura, Catalogo_Cambio_Divisa_ModelComponent } from "../FrontModel/DBODataBaseModel.js"
import { ModalMessege, ModalVericateAction } from "../WDevCore/WComponents/WForm.js";
class Ver_RecibosView extends HTMLElement {
    constructor(props) {
        super();
        this.Draw();
    }
    Draw = async () => {
        const tasa = await new Catalogo_Cambio_Divisa_ModelComponent().Get();
        this.OptionContainer = WRender.Create({ className: "OptionContainer" });
        this.TabContainer = WRender.createElement({ type: 'div', props: { class: 'TabContainer', id: 'TabContainer' } })
        this.MainComponent = new WTableComponent({
            EntityModel: new Transaccion_Factura({ Factura_contrato: {} }),
            ModelObject: new Transaccion_Factura(),
            Dataset: [],
            Options: {
                Filter: true,
                FilterDisplay: true,
                UserActions: [
                    {
                        name: "Anular", action: (factura) => {
                            const modal = ModalVericateAction(async () => {
                                const response =
                                    await WAjaxTools.PostRequest("../api/ApiRecibos/anularRecibo",
                                        { id_recibo: factura.id_factura, tasa_cambio: tasa[0].Valor_de_compra });

                                this.append(ModalMessege(response.message));

                                modal.close();
                            }, "¿Esta seguro que desea anular este recibo?")
                            this.append(modal)
                        }
                    }, {
                        name: "Imprimir", action: async (factura) => {
                            //this.append(ModalVericateAction(async () => {
                            const id_factura = factura.id_factura
                            await this.printRecibo(id_factura, tasa);
                            // }, "¿Esta seguro que desea imprimir este recibo?"))
                        }
                    }
                ]
            }
        })
        this.TabContainer.append(this.MainComponent)
        this.SetOption();
        this.append(
            StylesControlsV2.cloneNode(true),
            StyleScrolls.cloneNode(true),
            StylesControlsV3.cloneNode(true),
            this.OptionContainer,
            this.TabContainer
        );        
        const id_Recibo = new URLSearchParams(window.location.search).get('id_Recibo');
        if (id_Recibo != null) {
            await this.printRecibo(id_Recibo, tasa);
        }

    }
    SetOption() {
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Secundary', innerText: 'Nuevo Recibo',
            onclick: () => {
                window.location.href = "/PagesViews/Gestion_Recibos";
            }
        }))
    }


    async printRecibo(id_factura, tasa) {
        const response = await WAjaxTools.PostRequest("../api/ApiRecibos/printRecibo",
            { id_recibo: id_factura, tasa_cambio: tasa[0].Valor_de_compra });
        if (response.status == 200) {
            const ventimp = window.open(' ', 'popimpr');
            ventimp?.document.write(response.message);
            ventimp?.focus();
            setTimeout(() => {
                ventimp?.print();
                ventimp?.close();
            }, 100);
        }
    }
}
customElements.define('w-datos_configuracion', Ver_RecibosView);
window.addEventListener('load', async () => { MainBody.append(new Ver_RecibosView()) })
