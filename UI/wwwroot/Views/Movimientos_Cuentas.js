//@ts-check
import { WRender, ComponentsManager, WAjaxTools } from "../WDevCore/WModules/WComponentsTools.js";
import { StylesControlsV2, StylesControlsV3, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { WFilterOptions } from "../WDevCore/WComponents/WFilterControls.js";
import { WModalForm } from "../WDevCore/WComponents/WModalForm.js";
import { ModalMessege, WForm } from "../WDevCore/WComponents/WForm.js";
import { Movimientos_Cuentas, Catalogo_Cambio_Dolar } from "../FrontModel/DBODataBaseModel.js";
import { WOrtograficValidation } from "../WDevCore/WModules/WOrtograficValidation.js";
import { css } from "../WDevCore/WModules/WStyledRender.js";
import { WAppNavigator } from "../WDevCore/WComponents/WAppNavigator.js";
class Gestion_movimientos_CuentasView extends HTMLElement {
    constructor(props) {
        super();
        this.Draw();
    }
    Draw = async () => {
        const model = new Movimientos_Cuentas();
        const dataset = await model.Get();

        model.tasa_cambio = await new Catalogo_Cambio_Dolar().Get();

        this.OptionContainer = WRender.Create({ className: "OptionContainer" });
        this.TabContainer = WRender.Create({ className: "TabContainer", id: 'TabContainer' });

        this.Manager = new ComponentsManager({ MainContainer: this.TabContainer, SPAManage: false });
        this.TableComponent = new WTableComponent({
            ModelObject: model, Dataset: dataset, Options: {
                Add: true, UrlAdd: "guardarMovimiento",
                Edit: true, UrlUpdate: "editarMovimiento",
                Search: true, //UrlSearch: "../application/controllers/Vehiculos_Controller.php/get" + Model.constructor.name,
                /*UserActions: [
                    {
                        name: "Editar", action: (cliente) => {
                            this.Gestion_CuentasForm.cliente = cliente
                            this.Gestion_CuentasForm.Draw();
                            this.NewTransaction();
                        }
                    }
                ]*/
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


        this.MainComponent = WRender.Create({ className: "main-container", children: [/*this.FilterOptions*/, this.TableComponent] })

        //this.MainComponent.shadowRoot?.prepend(this.FilterOptions);

        /*this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Basic', innerText: 'Nuevo Movimiento',
            onclick: () => this.NewTransaction()
        }))*/
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Basic', innerText: 'Editar Regla',
            onclick: () => { this.Manager?.NavigateFunction("tabla", this.MainComponent) }
        }))

        this.Manager?.NavigateFunction("tabla", this.MainComponent)


        this.append(
            StylesControlsV2.cloneNode(true),
            StyleScrolls.cloneNode(true),
            StylesControlsV3.cloneNode(true),
            this.OptionContainer,
            this.TabContainer
        );


    }
    /*Gestion_CuentasForm = new Gestion_CuentasForm();
    NewTransaction(Model) {
        this.Manager?.NavigateFunction("Gestion_CuentasForm", this.Gestion_CuentasForm)
    }*/

}
customElements.define('w-gestion_movimientos_cuentas', Gestion_movimientos_CuentasView);
// @ts-ignore
window.addEventListener('load', async () => { MainBody.append(new Gestion_movimientos_CuentasView()) })
