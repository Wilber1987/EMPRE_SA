//@ts-check
import { WRender, ComponentsManager, WAjaxTools, WArrayF } from "../WDevCore/WModules/WComponentsTools.js";
import { StylesControlsV2, StylesControlsV3, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { WFilterOptions } from "../WDevCore/WComponents/WFilterControls.js";
import { WModalForm } from "../WDevCore/WComponents/WModalForm.js";
import { ModalMessege, WForm } from "../WDevCore/WComponents/WForm.js";
import { Catalogo_Cambio_Dolar, Catalogo_Clientes, Catalogo_Estados_Articulos, Transactional_Valoracion } from "../FrontModel/DBODataBaseModel.js";
import { MultiSelect } from "../WDevCore/WComponents/WMultiSelect.js";
import { css } from "../WDevCore/WModules/WStyledRender.js";
class Transaction_Valoraciones_View extends HTMLElement {
    constructor(props) {
        super();
        this.OptionContainer = WRender.Create({ className: "OptionContainer" });
        this.TabContainer = WRender.Create({ className: "TabContainer", id: 'TabContainer' });
        this.Manager = new ComponentsManager({ MainContainer: this.TabContainer, SPAManage: false });
        this.valoracionesContainer = WRender.Create({ className: "valoraciones-container" });
        this.append(this.CustomStyle)

        this.valoresObject = {
            Valoracion_1: 0, dolares_1: 0,
            Valoracion_2: 0, dolares_2: 0,
            Valoracion_3: 0, dolares_3: 0,
        }
        this.valoracionesDataset = [];
        this.Draw();
    }
    Draw = async () => {
        this.valoracionesContainer.innerHTML = "";
        const tasasCambio = await new Catalogo_Cambio_Dolar().Get();
        const estadosArticulos = await new Catalogo_Estados_Articulos().Get();
        this.buildValoresModel(tasasCambio);

        const multiSelectEstadosArticulos = new WTableComponent({
            Dataset: estadosArticulos,
            ModelObject: new Catalogo_Estados_Articulos(),
            selectedItems: [estadosArticulos[0]],
            paginate: false,
            Options: {
                Select: true, MultiSelect: false, SelectAction: () => {
                    this.calcValoracionCompraCordobas(multiSelectEstadosArticulos, this.valoracionesForm?.FormObject);
                    this.calcValoracionEmpenoCordobas(multiSelectEstadosArticulos, this.valoracionesForm?.FormObject);
                    this.calcValoracionCompraDolares(multiSelectEstadosArticulos, this.valoracionesForm?.FormObject, tasasCambio);
                    this.calcValoracionEmpenoDolares(multiSelectEstadosArticulos, this.valoracionesForm?.FormObject, tasasCambio);
                    this.valoracionesForm?.DrawComponent();
                }
            }
        });
        this.valoracionModel = this.valoracionesModel(tasasCambio, multiSelectEstadosArticulos);

        this.SetOption();

        this.valoracionesForm = new WForm({
            ModelObject: this.valoracionModel,
            AutoSave: false,
            Options: false,
            id: "valoracionesForm",
            SaveFunction: (/**@type {Transactional_Valoracion} */ valoracion) => {

            }, CustomStyle: css`
            .divForm{
                display: "grid";
                grid-template-columns: repeat(6, calc(16% - 15px));
                grid-template-rows: repeat(3, auto)
            } .textAreaContainer{
                grid-row: span 1 !important;
                padding-bottom: 0px !important;
            }
            .ModalElement {
            } .ModalElement label {
                display: block;
                width: 100%;
                margin: 0px;
            } `
        });

        this.valoracionesTable = new WTableComponent({
            Dataset: this.valoracionesDataset,
            ModelObject: new Transactional_Valoracion(),
            paginate: false,
            AutoSave: false,
            id: "valoracionesTable",
            Options: {
                Select: true, MultiSelect: true,
                Delete: true
            }
        });
        this.valoresForm = new WForm({
            EditObject: this.valoresObject,
            ModelObject: this.valoresModel,
            Options: false,
            DivColumns: "calc(100% - 160px) 150px",
            ProxyAction: (/**@type {WForm} */ valoracion) => {
                this.valoracionesForm?.SetOperationValues();
            }, CustomStyle: css`
                .ModalElement {
                    display: flex;
                    align-items: center;
                } .ModalElement label {
                    display: block;
                    width: 100%;
                    margin: 0px;
                } input {
                    min-width: 120px;
                }`
        });

        this.valoracionesContainer.append(
            this.valoracionesForm,
            this.valoresForm,
            multiSelectEstadosArticulos,
            this.valoracionesTable
        );
        this.Manager.NavigateFunction("valoraciones", this.valoracionesContainer);
        this.append(
            StylesControlsV2.cloneNode(true),
            StyleScrolls.cloneNode(true),
            StylesControlsV3.cloneNode(true),
            this.OptionContainer,
            this.TabContainer
        );
    }
    buildValoresModel(tasasCambio) {
        this.valoresModel = {
            Valoracion_1: {
                type: "number", label: "Valoración 1 - C$:", action: () => {
                    this.valoresObject.dolares_1 = this.valoresObject.Valoracion_1 / tasasCambio[0].valor_de_compra;
                    /** @type {HTMLInputElement|undefined|null} */
                    const control = this.valoresForm?.shadowRoot?.querySelector(".dolares_1");
                    if (control != undefined || control != null) {
                        control.value = this.valoresObject.dolares_1.toFixed(2).toString();
                    }
                }
            },
            dolares_1: {
                type: "number", label: "$:", action: () => {
                    this.valoresObject.Valoracion_1 = this.valoresObject.dolares_1 * tasasCambio[0].valor_de_compra;
                    /** @type {HTMLInputElement|undefined|null} */
                    const control = this.valoresForm?.shadowRoot?.querySelector(".Valoracion_1");
                    if (control != undefined || control != null) {
                        control.value = this.valoresObject.Valoracion_1.toFixed(2).toString();
                    }
                }
            },
            Valoracion_2: {
                type: "number", label: "Valoración 2 - C$:", action: () => {
                    this.valoresObject.dolares_2 = this.valoresObject.Valoracion_2 / tasasCambio[0].valor_de_compra;
                    /** @type {HTMLInputElement|undefined|null} */
                    const control = this.valoresForm?.shadowRoot?.querySelector(".dolares_2");
                    if (control != undefined || control != null) {
                        control.value = this.valoresObject.dolares_2.toFixed(2).toString();
                    }
                }
            },
            dolares_2: {
                type: "number", label: "$:", action: () => {
                    this.valoresObject.Valoracion_2 = this.valoresObject.dolares_2 * tasasCambio[0].valor_de_compra;
                    /** @type {HTMLInputElement|undefined|null} */
                    const control = this.valoresForm?.shadowRoot?.querySelector(".Valoracion_2");
                    if (control != undefined || control != null) {
                        control.value = this.valoresObject.Valoracion_2.toFixed(2).toString();
                    }
                }
            },
            Valoracion_3: {
                type: "number", label: "Valoración 3 - C$:", action: () => {
                    this.valoresObject.dolares_3 = this.valoresObject.Valoracion_3 / tasasCambio[0].valor_de_compra;
                    /** @type {HTMLInputElement|undefined|null} */
                    const control = this.valoresForm?.shadowRoot?.querySelector(".dolares_3");
                    if (control != undefined || control != null) {
                        control.value = this.valoresObject.dolares_3.toFixed(2).toString();
                    }
                }
            },
            dolares_3: {
                type: "number", label: "$:", action: () => {
                    this.valoresObject.Valoracion_3 = this.valoresObject.dolares_3 * tasasCambio[0].valor_de_compra;
                    /** @type {HTMLInputElement|undefined|null} */
                    const control = this.valoresForm?.shadowRoot?.querySelector(".Valoracion_3");
                    if (control != undefined || control != null) {
                        control.value = this.valoresObject.Valoracion_3.toFixed(2).toString();
                    }
                }
            },
        };
    }

    valoracionesModel(tasasCambio, multiSelectEstadosArticulos) {
        return new Transactional_Valoracion({
            Fecha: { type: 'date', disabled: true },
            Tasa_de_cambio: { type: 'number', disabled: true, defaultValue: tasasCambio[0].valor_de_compra },
            Catalogo_Estados_Articulos: { type: 'WSELECT', hidden: true },
            valoracion_compra_cordobas: {
                type: 'operation', action: (/**@type {Transactional_Valoracion} */ valoracion) => {
                    this.calcValoracionCompraCordobas(multiSelectEstadosArticulos, valoracion);
                    return valoracion.valoracion_compra_cordobas.toFixed(2);
                }
            },  valoracion_empeño_cordobas: {
                type: 'operation', action: (/**@type {Transactional_Valoracion} */ valoracion) => {
                    this.calcValoracionEmpenoCordobas(multiSelectEstadosArticulos, valoracion);
                    return valoracion.valoracion_empeño_cordobas.toFixed(2);
                }
            }, valoracion_compra_dolares: {
                type: 'operation', action: (/**@type {Transactional_Valoracion} */ valoracion) => {
                    this.calcValoracionCompraDolares(multiSelectEstadosArticulos, valoracion, tasasCambio);
                    return valoracion.valoracion_compra_dolares.toFixed(2);
                }
            }, valoracion_empeño_dolares: {
                type: 'operation', action: (/**@type {Transactional_Valoracion} */ valoracion) => {
                    this.calcValoracionEmpenoDolares(multiSelectEstadosArticulos, valoracion, tasasCambio);
                    return valoracion.valoracion_empeño_dolares.toFixed(2);
                }
            },
        });
    }

    calcValoracionEmpenoDolares(multiSelectEstadosArticulos, valoracion, tasasCambio) {
        if (multiSelectEstadosArticulos.selectedItems.length > 0) {
            valoracion.valoracion_empeño_dolares = (this.avgValores()
                * (multiSelectEstadosArticulos.selectedItems[0].porcentaje_empeno / 100)) / tasasCambio[0].valor_de_compra;
        } else {
            valoracion.valoracion_empeño_dolares = 0;
        }
    }

    calcValoracionCompraDolares(multiSelectEstadosArticulos, valoracion, tasasCambio) {
        if (multiSelectEstadosArticulos.selectedItems.length > 0) {
            valoracion.valoracion_compra_dolares = (this.avgValores()
                * (multiSelectEstadosArticulos.selectedItems[0].porcentaje_compra / 100)) / tasasCambio[0].valor_de_compra;
        } else {
            valoracion.valoracion_compra_dolares = 0;
        }
    }

    calcValoracionEmpenoCordobas(multiSelectEstadosArticulos, valoracion) {
        if (multiSelectEstadosArticulos.selectedItems.length > 0) {
            valoracion.valoracion_empeño_cordobas = this.avgValores()
                * (multiSelectEstadosArticulos.selectedItems[0].porcentaje_empeno / 100);
        } else {
            valoracion.valoracion_empeño_cordobas = 0;
        }
    }

    calcValoracionCompraCordobas(multiSelectEstadosArticulos, valoracion) {
        if (multiSelectEstadosArticulos.selectedItems.length > 0) {
            valoracion.valoracion_compra_cordobas = this.avgValores()
                * (multiSelectEstadosArticulos.selectedItems[0].porcentaje_compra / 100);
        } else {
            valoracion.valoracion_compra_cordobas = 0;
        }
    }

    avgValores() {
        return (parseFloat(this.valoresObject.Valoracion_1.toString()) +
            parseFloat(this.valoresObject.Valoracion_2.toString()) +
            parseFloat(this.valoresObject.Valoracion_3.toString())) / 3;
    }

    SetOption() {
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Alert', innerText: 'Nueva valoración',
            onclick: () => this.Manager.NavigateFunction( "valoraciones")
        }))

        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Basic', innerText: 'Buscar valoraciones',
            onclick: () => this.Manager.NavigateFunction( "Searcher", new ValoracionesSearch(this.setValoracion))
        }))

        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Success', innerText: 'Añadir',
            onclick: () => {
                if (!this.valoracionesForm?.Validate()) {
                    return;
                }
                if (this.valoresObject.Valoracion_1 <= 0 ||
                    this.valoresObject.Valoracion_3 <= 0 ||
                    this.valoresObject.Valoracion_3 <= 0) {
                    this.append(ModalMessege("Llene el formulario de valoraciones con montos mayores a 0"))
                    return;
                }
                const newValoracion = {};
                for (const prop in this.valoracionesForm?.FormObject) {
                    newValoracion[prop] =  this.valoracionesForm?.FormObject[prop];
                }
                const newValores = {};
                for (const prop in this.valoresObject) {
                    newValores[prop] = this.valoresObject[prop];
                }
                newValoracion.Detail_Valores = newValores;
                const serch = this.valoracionesTable?.Dataset.find(f => WArrayF.compareObj(f, newValoracion));
                this.valoracionesTable?.Dataset.push(newValoracion);
                this.valoracionesTable?.DrawTable();
            }
        }))
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Basic', innerText: 'Guardar valoraciones',
            onclick: async () => {
                const valoracionesGuardadas = await this.valoracionModel?.GuardarValoraciones(this.valoracionesTable?.Dataset);
                if (valoracionesGuardadas?.length > 0) {
                    this.append(ModalMessege("Valoraciones guardadas correctamente"));
                }
            }
        }))
    }
    setValoracion = (valoracion)=> {
        this.valoracionesForm?.FormObject
        
        //throw new Error("Method not implemented.");
    }
    CustomStyle = css`
        .valoraciones-container{
            padding: 20px;
            display: grid;
            grid-template-columns: 400px calc(100% - 430px);
            gap: 30px;
        }
        #valoracionesForm, #valoracionesTable{
            grid-column: span 2;
        }
        .OptionContainer{
            display: flex;
        }
    `
}
customElements.define('w-valoraciones-view', Transaction_Valoraciones_View);
export { Transaction_Valoraciones_View }
// @ts-ignore
window.addEventListener('load', async () => { MainBody.append(new Transaction_Valoraciones_View()) })

class ValoracionesSearch extends HTMLElement {
    constructor(/** @type {Function} */ action) {
        super();
        this.TabContainer = WRender.Create({ className: "TabContainer", id: 'TabContainer' });
        this.Manager = new ComponentsManager({ MainContainer: this.TabContainer, SPAManage: false });
        this.action = action;
        this.DrawComponent();
    }
    DrawComponent = async () => {
        const model = new Transactional_Valoracion();
        const dataset = await model.Get();

        this.SearchContainer = WRender.Create({
            className: "search-container"
        })
        this.MainComponent = new WTableComponent({
            ModelObject: model, Dataset: dataset, Options: {
                UserActions: [
                    {
                        name: "seleccionar", action: (/**@type {Transactional_Valoracion}*/ selected) => {
                            this.action(selected);
                        }
                    }
                ]
            }
        })
        this.FilterOptions = new WFilterOptions({
            Dataset: dataset,
            ModelObject: model,
            FilterFunction: (DFilt) => {
                this.MainComponent?.DrawTable(DFilt);
            }
        });
        this.append(
            StylesControlsV2.cloneNode(true),
            StyleScrolls.cloneNode(true),
            StylesControlsV3.cloneNode(true),
            this.FilterOptions,
            this.TabContainer,
            this.MainComponent
        );
    }
}
customElements.define('w-component', ValoracionesSearch);
export { ValoracionesSearch }