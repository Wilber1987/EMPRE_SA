//@ts-check
import { WRender, ComponentsManager } from "../WDevCore/WModules/WComponentsTools.js";
import { StylesControlsV2, StylesControlsV3, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { WFilterOptions } from "../WDevCore/WComponents/WFilterControls.js";
import { WModalForm } from "../WDevCore/WComponents/WModalForm.js";
import { ModalMessege, WForm } from "../WDevCore/WComponents/WForm.js";
import { Catalogo_Clientes, Condicion_Laboral_Cliente, Transaction_Contratos_ModelComponent } from "../FrontModel/DBODataBaseModel.js";
import { WOrtograficValidation } from "../WDevCore/WModules/WOrtograficValidation.js";
import { css } from "../WDevCore/WModules/WStyledRender.js";
import { WAppNavigator } from "../WDevCore/WComponents/WAppNavigator.js";
import { clientSearcher } from "../modules/SerchersModules.js";
import { Transaction_Contratos } from "../FrontModel/Model.js";
import { WDetailObject } from "../WDevCore/WComponents/WDetailObject.js";
import {WAjaxTools} from "../WDevCore/WModules/WAjaxTools";
class ClientComponentView extends HTMLElement {
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
                }, {
                    name: 'Nuevo Cliente', action: () => {
                        this.cliente = {}
                        this.Draw()
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
                if (!this.FormularioCliente?.Validate()) {
                    this.Manager?.NavigateFunction("formularioCliente", this.FormularioCliente)
                    this.append(ModalMessege("Necesita llenar todos los datos del cliente primeramente"));
                    return;
                }
                // if (!this.FormularioDatos?.Validate()) {
                //     this.Manager?.NavigateFunction("formularioDatosLabora    les", this.FormularioDatos)
                //     this.append(ModalMessege("Necesita llenar todos los datos laborales del cliente primeramente"));
                //     return;
                // }

                if (this.cliente.codigo_cliente == null || this.cliente.codigo_cliente == undefined) {
                    ///**@type {Catalogo_Clientes} */
                    const result = await new Catalogo_Clientes(this.cliente).Save();

                    if (result?.codigo_cliente != null) {
                        this.cliente.codigo_cliente = result?.codigo_cliente;
                        this.append(ModalMessege("Datos guardados correctamente"));
                        this.updateForms();
                    } else if (result?.status == 403) {
                        this.append(ModalMessege(result?.message));
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
                this.updateForms()
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
    updateForms() {
        this.cliente = {};
        this.cliente.Condicion_Laboral_Cliente = [{}];
        // @ts-ignore
        this.FormularioCliente.FormObject = this.cliente;
        // @ts-ignore
        this.FormularioDatos.FormObject = this.cliente.Condicion_Laboral_Cliente[0];
        this.FormularioCliente?.DrawComponent();
        this.FormularioDatos?.DrawComponent();
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
            border: 1px solid #cacaca;
            border-radius: 20px;
            padding: 20px;
        }
    `
}
customElements.define('w-catalogo_clientes', ClientComponentView);
export { ClientComponentView }