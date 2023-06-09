//@ts-check
import { WRender, ComponentsManager, WAjaxTools } from "../WDevCore/WModules/WComponentsTools.js";
import { StylesControlsV2, StylesControlsV3, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { WFilterOptions } from "../WDevCore/WComponents/WFilterControls.js";
import { WModalForm } from "../WDevCore/WComponents/WModalForm.js";
import { ModalMessege, WForm } from "../WDevCore/WComponents/WForm.js";
import { Catalogo_Clientes, Condicion_Laboral_Cliente } from "../FrontModel/DBODataBaseModel.js";
import { WOrtograficValidation } from "../WDevCore/WModules/WOrtograficValidation.js";
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
                //Add: false, UrlAdd: "../api/ApiEntityDBO/saveCatalogo_Clientes",
                //Edit: true, UrlUpdate: "../api/ApiEntityDBO/updateCatalogo_Clientes",
                //Search: true, UrlSearch: "../api/ApiEntityDBO/getCatalogo_Clientes"
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
            tagName: 'button', className: 'Block-Basic', innerText: 'Editar cliente',
            onclick: () => { this.Manager?.NavigateFunction("tabla", this.MainComponent) }
        }))
        /*this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Alert', innerText: 'Egreso por baja',
            //onclick: () => this.NewTransaction(new Catalogo_Tipo_Transaccion())
        }))
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Success', innerText: 'Egreso por Venta',
            //onclick: () => this.NewTransaction(this.VentaModel())
        }))*/



        // this.TabContainer.append(this.MainComponent)

        //this.Manager.NavigateFunction("tabla", this.MainComponent)
        this.NewTransaction()


        this.append(
            StylesControlsV2.cloneNode(true),
            StyleScrolls.cloneNode(true),
            StylesControlsV3.cloneNode(true),
            //this.FilterOptions,
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

    ModelCliente = new Catalogo_Clientes();
    ModelDatosLaborales = new Condicion_Laboral_Cliente();

    Draw = async () => {
        this.cliente.Condicion_Laboral_Cliente = this.cliente.Condicion_Laboral_Cliente ?? [];
        if (this.cliente.Condicion_Laboral_Cliente.length == 0) {
            this.cliente.Condicion_Laboral_Cliente.push({});
        }

        this.innerHTML = "";

        this.FormularioCliente = new WForm({
            ModelObject: this.ModelCliente, EditObject: this.cliente, Options: false,DivColumns: "32% 32% 32%" 
        });
        this.FormularioDatos = new WForm({
            ModelObject: this.ModelDatosLaborales, EditObject: this.cliente.Condicion_Laboral_Cliente[0], Options: false
        });


        this.OptionContainer = WRender.Create({ className: "OptionContainer" });
        this.TabContainer = WRender.Create({ className: "TabNewContainer", id: 'TabNewContainer' });

        this.Manager = new ComponentsManager({ MainContainer: this.TabContainer, SPAManage: false });

        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Basic', innerText: 'Datos Cliente',
            onclick: () => { this.ClienteFormulario() }
        }))

        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Basic', innerText: 'Datos Laborales',
            onclick: () => {
                // if (!this.FormularioCliente?.Validate()) {
                //     this.append(ModalMessege("Necesita llenar los datos del cliente primeramente"));
                //     return;
                // }
                this.DatosLaborales();
            }
        }))

        this.TabContainer.append(WRender.Create({
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
                    } else {
                        this.append(ModalMessege("Error al guardar intentelo nuevamente"));
                    }
                } else {
                    const result = await new Catalogo_Clientes(this.cliente).Update();
                    this.append(ModalMessege(WOrtograficValidation.es(result.message)));
                }
            }
        }))
        this.TabContainer.append(WRender.Create({
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
            this.OptionContainer,
            this.TabContainer
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

}
customElements.define('w-catalogo_clientes', Gestion_ClientesForm);
