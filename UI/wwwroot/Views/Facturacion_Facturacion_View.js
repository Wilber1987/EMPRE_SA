//@ts-check
// @ts-ignore
import { StylesControlsV2, StylesControlsV3, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js";
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js";
import { ComponentsManager, WArrayF, WRender } from "../WDevCore/WModules/WComponentsTools.js";
// @ts-ignore
import { Catalogo_Cambio_Dolar, Catalogo_Categoria, Catalogo_Clientes, Catalogo_Estados_Articulos, Transactional_Valoracion } from "../FrontModel/DBODataBaseModel.js";
import { ModalMessege, WForm } from "../WDevCore/WComponents/WForm.js";
// @ts-ignore
import { Transactional_Configuraciones } from "../FrontModel/ADMINISTRATIVE_ACCESSDataBaseModel.js";
import { Detail_Prendas, Transaction_Contratos, ValoracionesTransaction } from "../FrontModel/Model.js";
import { Tbl_Cuotas_ModelComponent } from "../FrontModel/ModelComponents.js";
import { AmoritizationModule } from "../modules/AmortizacionModule.js";
import { clientSearcher, ValoracionesSearch } from "../modules/SerchersModules.js";
import { WAppNavigator } from "../WDevCore/WComponents/WAppNavigator.js";
import { css } from "../WDevCore/WModules/WStyledRender.js";
class Facturacion_Facturacion_View extends HTMLElement {
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
            tagName: 'button', className: 'Block-Secundary', innerText: 'Historial de Facturas',
            onclick: () => this.NewGestionFacturas()
        }))
       
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Tertiary', innerText: 'Imprimir Factura',
            onclick: async () => {
                //todo
                /*if (this.TableComponent != undefined) {
                    const datasetUpdated = await model.Get();
                    // @ts-ignore
                    this.TableComponent.Dataset = datasetUpdated;
                    this.TableComponent?.DrawTable();

                } else {
                    const data = await model.Get();
                    this.TableComponent = new WTableComponent({
                        ModelObject: model, Dataset: data, Options: {
                            Filter: true,
                            FilterDisplay: true,
                            UserActions: [
                                {
                                    name: "Editar", action: (cliente) => {
                                        if (this.Gestion_ClientesForm != null) {
                                            this.Gestion_ClientesForm.cliente = cliente
                                            this.Gestion_ClientesForm.Draw();
                                            this.NewTransaction();
                                        }

                                    }
                                }
                            ]
                        }
                    })
                    this.MainComponent = WRender.Create({ className: "main-container", children: [this.TableComponent] })
                }
                this.Manager?.NavigateFunction("tabla", this.MainComponent);*/
            }
        }))

        //this.NewTransaction();
        this.NewGestionFacturas()
        this.append(
            StylesControlsV2.cloneNode(true),
            StyleScrolls.cloneNode(true),
            StylesControlsV3.cloneNode(true),
            this.OptionContainer,
            this.TabContainer
        );


    }

    NewGestionFacturas() {
        this.Manager?.NavigateFunction("Historial_ClientesForm", clientSearcher(async (cliente) => {
            const response = await new Transaction_Contratos({ codigo_cliente: cliente.codigo_cliente }).Get();
            cliente.Transaction_Contratos = response;
            this.Manager?.NavigateFunction("Gestion_ClientesDetail" + cliente.codigo_cliente, new WDetailObject({
                ModelObject: new Catalogo_Clientes({
                    Transaction_Contratos:
                        { type: "MASTERDETAIL", ModelObject: () => new Transaction_Contratos_ModelComponent(), Dataset: response }
                }),
                ObjectDetail: cliente
            }))
        }))
    }
}