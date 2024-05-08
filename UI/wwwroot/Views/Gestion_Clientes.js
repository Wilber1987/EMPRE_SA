//@ts-check
import { WRender, ComponentsManager, WAjaxTools } from "../WDevCore/WModules/WComponentsTools.js";
import { StylesControlsV2, StylesControlsV3, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { WFilterOptions } from "../WDevCore/WComponents/WFilterControls.js";
import { WModalForm } from "../WDevCore/WComponents/WModalForm.js";
import { ModalMessege, WForm } from "../WDevCore/WComponents/WForm.js";
import { Catalogo_Clientes, Condicion_Laboral_Cliente, Transaccion_Factura, Transaction_Contratos_ModelComponent } from "../FrontModel/DBODataBaseModel.js";
import { WOrtograficValidation } from "../WDevCore/WModules/WOrtograficValidation.js";
import { css } from "../WDevCore/WModules/WStyledRender.js";
import { WAppNavigator } from "../WDevCore/WComponents/WAppNavigator.js";
import { clientSearcher } from "../modules/SerchersModules.js";
import { Transaction_Contratos } from "../FrontModel/Model.js";
import { WDetailObject } from "../WDevCore/WComponents/WDetailObject.js";
import { ClientComponentView } from "./ClientComponentView.js";

class Gestion_ClientesView extends HTMLElement {
    constructor(props) {
        super();
        this.Draw();
    }
    Draw = async () => {
        const model = new Catalogo_Clientes();
       
        //const dataset = await model.Get();

        this.OptionContainer = WRender.Create({ className: "OptionContainer" });
        this.TabContainer = WRender.Create({ className: "TabContainer", id: 'TabContainer' });
        this.Manager = new ComponentsManager({ MainContainer: this.TabContainer, SPAManage: false });

        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Secundary', innerText: 'Historial de Clientes',
            onclick: () => this.NewGestionClientes()
        }))

        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Primary', innerText: 'Ingresar Cliente',
            onclick: () => this.NewTransaction()
        }))
        this.NewGestionClientes()
        this.append(
            StylesControlsV2.cloneNode(true),
            StyleScrolls.cloneNode(true),
            StylesControlsV3.cloneNode(true),
            this.OptionContainer,
            this.TabContainer
        );


    }

    NewTransaction(Model) {
        this.Gestion_ClientesForm = new ClientComponentView();
        this.Manager?.NavigateFunction("Gestion_ClientesForm", this.Gestion_ClientesForm)
    }
    NewGestionClientes() {
        this.Manager?.NavigateFunction("Historial_ClientesForm", clientSearcher([{
            name: "Selecionar",
            action: async (cliente) => {
                const response = await new Transaction_Contratos({ codigo_cliente: cliente.codigo_cliente }).Get();
                const responseFactura = await new Transaccion_Factura({ id_cliente: cliente.codigo_cliente }).Get();
                cliente.Transaction_Contratos = response;
                cliente.Transaction_Factura = responseFactura;
                this.Manager?.NavigateFunction("Gestion_ClientesDetail" + cliente.codigo_cliente, new WDetailObject({
                    ModelObject: new Catalogo_Clientes({
                        Transaction_Contratos:
                            { type: "MASTERDETAIL", ModelObject: () => new Transaction_Contratos_ModelComponent(), Dataset: response },
                        Transaction_Factura:
                            { type: "MASTERDETAIL", ModelObject: () => new Transaccion_Factura({ Catalogo_Clientes: undefined }), Dataset: responseFactura }
                    }),
                    ObjectDetail: cliente
                }))
            }
        }, {
            name: "Editar", action: (cliente) => {
                if (this.Gestion_ClientesForm != null) {
                    this.Gestion_ClientesForm.cliente = cliente
                    this.Gestion_ClientesForm.Draw();
                    this.NewTransaction();
                }

            }
        }]))
    }

}
customElements.define('w-gestion_clientes', Gestion_ClientesView);
// @ts-ignore
window.addEventListener('load', async () => { MainBody.append(new Gestion_ClientesView()) })


