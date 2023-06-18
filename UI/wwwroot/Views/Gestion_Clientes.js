//@ts-check
import { WRender, ComponentsManager, WAjaxTools } from "../WDevCore/WModules/WComponentsTools.js";
import { StylesControlsV2, StylesControlsV3, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { WFilterOptions } from "../WDevCore/WComponents/WFilterControls.js";
import { WModalForm } from "../WDevCore/WComponents/WModalForm.js";
import { ModalMessege, WForm } from "../WDevCore/WComponents/WForm.js";
import { Catalogo_Clientes, Condicion_Laboral_Cliente } from "../FrontModel/DBODataBaseModel.js";
import { WOrtograficValidation } from "../WDevCore/WModules/WOrtograficValidation.js";
import { css } from "../WDevCore/WModules/WStyledRender.js";
import { WAppNavigator } from "../WDevCore/WComponents/WAppNavigator.js";
class Gestion_ClientesView extends HTMLElement {
    constructor(props) {
        super();
        this.Draw();
    }
    Draw = async () => {
        const model = new Catalogo_Clientes();
        const dataset = await model.Get();

        this.OptionContainer = WRender.Create({ className: "OptionContainer" });
        this.TabContainer = WRender.Create({ className: "TabContainer", id: 'TabContainer' });

        this.Manager = new ComponentsManager({ MainContainer: this.TabContainer, SPAManage: false });
        this.TableComponent = new WTableComponent({
            ModelObject: model, Dataset: dataset, Options: {
                UserActions: [
                    {
                        name: "Editar", action: (cliente) => {
                            this.Gestion_ClientesForm.cliente = cliente
                            this.Gestion_ClientesForm.Draw();
                            this.NewTransaction();
                        }
                    }
                ]
            }
        })
        this.FilterOptions = new WFilterOptions({
            Dataset: dataset,
            ModelObject: model,
            Display: true,
            FilterFunction: (DFilt) => {
                this.TableComponent?.DrawTable(DFilt);
            }
        });
        this.MainComponent = WRender.Create({ className: "main-container", children: [this.FilterOptions, this.TableComponent] })

        //this.MainComponent.shadowRoot?.prepend(this.FilterOptions);


        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Basic', innerText: 'Ingresar Cliente',
            onclick: () => this.NewTransaction()
        }))
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Secundary', innerText: 'Editar cliente',
            onclick: () => { this.Manager?.NavigateFunction("tabla", this.MainComponent) }
        }))

        this.NewTransaction()


        this.append(
            StylesControlsV2.cloneNode(true),
            StyleScrolls.cloneNode(true),
            StylesControlsV3.cloneNode(true),
            this.OptionContainer,
            this.TabContainer
        );


    }
    Gestion_ClientesForm = new Gestion_ClientesForm();
    NewTransaction(Model) {
        this.Manager?.NavigateFunction("Gestion_ClientesForm", this.Gestion_ClientesForm)
    }

}
customElements.define('w-gestion_clientes', Gestion_ClientesView);
// @ts-ignore
window.addEventListener('load', async () => { MainBody.append(new Gestion_ClientesView()) })


class Gestion_ClientesForm extends HTMLElement {
    constructor(cliente) {
        super();
        this.cliente = cliente ?? {};
        this.Draw();
    }

    ModelCliente = new Catalogo_Clientes({ grupo1: { type: 'title' } });
    ModelDatosLaborales = new Condicion_Laboral_Cliente();

    Draw = async () => {
        this.cliente.Condicion_Laboral_Cliente = this.cliente.Condicion_Laboral_Cliente ?? [];
        if (this.cliente.Condicion_Laboral_Cliente.length == 0) {
            this.cliente.Condicion_Laboral_Cliente.push({});
        }

        this.innerHTML = "";

        this.FormularioCliente = new WForm({
            ModelObject: this.ModelCliente, EditObject: this.cliente, Options: false, DivColumns: "32% 32% 32%"
        });
        this.FormularioDatos = new WForm({
            ModelObject: this.ModelDatosLaborales, EditObject: this.cliente.Condicion_Laboral_Cliente[0], Options: false
        });


        this.OptionContainer = new WAppNavigator({
            Elements: [
                {
                    name: 'Datos Cliente', action: () => {
                        this.ClienteFormulario()
                    }
                }, {
                    name: 'Datos Laborales', action: () => {
                        this.DatosLaborales()
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
                if (!this.FormularioCliente?.Validate() || !this.FormularioDatos?.Validate()) {
                    this.append(ModalMessege("Necesita llenar todos los datos del cliente primeramente"));
                    return;
                }
                if (this.cliente.codigo_cliente == null || this.cliente.codigo_cliente == undefined) {
                    /**@type {Catalogo_Clientes} */
                    const result = await new Catalogo_Clientes(this.cliente).Save();

                    if (result?.codigo_cliente != null) {
                        this.cliente.codigo_cliente = result?.codigo_cliente;
                        this.append(ModalMessege("Datos guardados correctamente"));
                    } else {
                        this.append(ModalMessege("Error al guardar intentelo nuevamente"));
                    }
                } else {
                    const result = await new Catalogo_Clientes(this.cliente).Update();
                    this.append(ModalMessege(WOrtograficValidation.es(result.message)));
                }
            }
        }))
        this.OptionContainerBottom.append(WRender.Create({
            tagName: 'button', className: 'Block-Basic', innerText: 'Limpiar',
            onclick: () => {
                for (const prop in this.cliente) {
                    this.cliente[prop] = undefined;
                }
                this.FormularioCliente?.DrawComponent();
            }
        }));
        this.ClienteFormulario()

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
    /***formulario para creacion y edicion de cliente  */
    ClienteFormulario() {
        this.Manager?.NavigateFunction("formularioCliente", this.FormularioCliente)
    }

    /***formulario para creacion y edicion de datos laborales  */
    DatosLaborales() {
        this.Manager?.NavigateFunction("formularioDatosLaborales", this.FormularioDatos)
    }

    CustomStyle = css`
        w-form {
            margin: 20px;
        }
    `
}
customElements.define('w-catalogo_clientes', Gestion_ClientesForm);
