//@ts-check
import { WRender, ComponentsManager, WAjaxTools } from "../WDevCore/WModules/WComponentsTools.js";
import { StylesControlsV2, StylesControlsV3, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { WFilterOptions } from "../WDevCore/WComponents/WFilterControls.js";
import { WModalForm } from "../WDevCore/WComponents/WModalForm.js";
import { ModalMessege, WForm } from "../WDevCore/WComponents/WForm.js";
import { Recibos } from "../FrontModel/DBODataBaseModel.js";//todo eliminar notulizados
import { WOrtograficValidation } from "../WDevCore/WModules/WOrtograficValidation.js";
import { css } from "../WDevCore/WModules/WStyledRender.js";
import { WAppNavigator } from "../WDevCore/WComponents/WAppNavigator.js";
class Gestion_RecibosView extends HTMLElement {
    constructor(props) {
        super();
        this.Draw();
    }
    Draw = async () => {
        const model = new Recibos();
        //const dataset = await model.Get();

        this.OptionContainer = WRender.Create({ className: "OptionContainer" });
        this.TabContainer = WRender.Create({ className: "TabContainer", id: 'TabContainer' });

        this.Manager = new ComponentsManager({ MainContainer: this.TabContainer, SPAManage: false });
        this.TableComponent = new WTableComponent({
            ModelObject: model, Dataset: [], Options: {
                UserActions: [
                    {
                        name: "Ver", action: (cliente) => {
                            this.Gestion_ReciboForm.cliente = cliente
                            this.Gestion_ReciboForm.Draw();
                            this.NewTransaction();
                        }
                    }
                ]
            }
        })
        this.FilterOptions = new WFilterOptions({
            Dataset: [],
            ModelObject: model,
            Display: true,
            FilterFunction: (DFilt) => {
                this.TableComponent?.DrawTable(DFilt);
            }
        });
        this.MainComponent = WRender.Create({ className: "main-container", children: [this.FilterOptions, this.TableComponent] })

        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Basic', innerText: 'Ingresar ROC',
            onclick: () => this.NewTransaction()
        }))
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Secundary', innerText: 'Lista de Recibos',
            onclick: async () => {
                const datasetUpdated = await model.Get();
                // @ts-ignore
                this.TableComponent.Dataset = datasetUpdated;
                this.TableComponent?.DrawTable();
                this.Manager?.NavigateFunction("tabla", this.MainComponent);
            }
        }))

        this.NewTransaction();
        this.append(
            StylesControlsV2.cloneNode(true),
            StyleScrolls.cloneNode(true),
            StylesControlsV3.cloneNode(true),
            this.OptionContainer,
            this.TabContainer
        );


    }
    Gestion_ReciboForm = new Gestion_ReciboForm();
    NewTransaction(Model) {
        this.Manager?.NavigateFunction("Gestion_ReciboForm", this.Gestion_ReciboForm)
    }

}
customElements.define('w-gestion_clientes', Gestion_RecibosView);
// @ts-ignore
window.addEventListener('load', async () => { MainBody.append(new Gestion_RecibosView()) })


class Gestion_ReciboForm extends HTMLElement {
    constructor(recibo) {
        super();
        this.recibo = recibo ?? {};
        this.Draw();
    }

    ModelRecibo = new Recibos({ grupo1: { type: 'title' } });    

    Draw = async () => {
        /*this.cliente.Condicion_Laboral_Cliente = this.cliente.Condicion_Laboral_Cliente ?? [];
        if (this.cliente.Condicion_Laboral_Cliente.length == 0) {
            this.cliente.Condicion_Laboral_Cliente.push({});
        }*/

        this.innerHTML = "";

        this.FormularioRecibo = new WForm({
            ModelObject: this.ModelRecibo, EditObject: this.cliente, Options: false, DivColumns: "32% 32% 32%"
        });


        this.OptionContainer = new WAppNavigator({
            Elements: [
                {
                    name: 'Datos Recibo', action: () => {
                        this.ReciboFormulario()
                    }
                }
            ]
        }); //WRender.Create({ className: "OptionContainer" });
        this.OptionContainerBottom = WRender.Create({ className: "OptionContainer OptionBottom" });
        this.TabContainer = WRender.Create({ className: "TabNewContainer", id: 'TabNewContainer' });

        this.Manager = new ComponentsManager({ MainContainer: this.TabContainer, SPAManage: false });

        this.OptionContainerBottom.append(WRender.Create({
            tagName: 'button', className: 'Block-Success', innerText: 'Guardar',
            onclick: async () => {
                if (!this.FormularioRecibo?.Validate()) {
                    this.Manager?.NavigateFunction("formularioRecibo", this.FormularioRecibo)
                    this.append(ModalMessege("Necesita llenar todos los datos del recibo primeramente"));
                    return;
                }              

                if (this.recibo.id_recibo == null || this.recibo.id_recibo == undefined) {
                    /**@type {Recibos} */
                    const result = await new Recibos(this.recibo).Save();

                    if (result?.id_recibo != null) {
                        this.recibo.id_recibo = result?.id_recibo;
                        this.append(ModalMessege("Datos guardados correctamente"));
                        this.updateForms();
                    } else {
                        this.append(ModalMessege("Error al guardar intentelo nuevamente"));
                    }
                } else {
                    const result = await new Recibos(this.recibo).Update();
                    this.append(ModalMessege(WOrtograficValidation.es(result.message)));
                }
            }
        }))
        this.OptionContainerBottom.append(WRender.Create({
            tagName: 'button', className: 'Block-Basic', innerText: 'Limpiar',
            onclick: () => {
                this.updateForms()
            }
        }));
        this.ReciboFormulario()

        this.append(
            StylesControlsV2.cloneNode(true),
            StyleScrolls.cloneNode(true),
            StylesControlsV3.cloneNode(true),
            this.CustomStyle,
            this.OptionContainer,
            this.TabContainer,
            this.OptionContainerBottom
        );
    }
    updateForms() {
        this.cliente = {};
        this.cliente.Condicion_Laboral_Cliente = [{}];
        // @ts-ignore
        this.FormularioRecibo.FormObject = this.cliente;
        // @ts-ignore
        this.FormularioDatos.FormObject = this.cliente.Condicion_Laboral_Cliente[0];
        this.FormularioRecibo?.DrawComponent();
    }

    /***formulario para creacion y edicion de recibo  */
    ReciboFormulario() {
        this.Manager?.NavigateFunction("formularioRecibo", this.FormularioRecibo)
    }

    CustomStyle = css`
        w-form {
            margin: 20px;
            border: 1px solid #cacaca;
            border-radius: 20px;
            padding: 20px;
        }
    `
}
customElements.define('w-recibos', Gestion_ReciboForm);
