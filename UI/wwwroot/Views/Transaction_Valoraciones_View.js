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
import { Cuota, ValoracionesContrato } from "../FrontModel/Model.js";
import { CuotaComponent } from "../FrontModel/ModelComponents.js";
import { WAppNavigator } from "../WDevCore/WComponents/WAppNavigator.js";
import { Transactional_Configuraciones } from "../FrontModel/ADMINISTRATIVE_ACCESSDataBaseModel.js";
class Transaction_Valoraciones_View extends HTMLElement {
    constructor(props) {
        super();
        this.OptionContainer = WRender.Create({ className: "OptionContainer" });
        this.TabContainer = WRender.Create({ className: "TabContainer", id: 'TabContainer' });
        this.Manager = new ComponentsManager({ MainContainer: this.TabContainer, SPAManage: false });
        this.valoracionesContainer = WRender.Create({ className: "valoraciones-container" });
        this.append(this.CustomStyle);
        this.Cliente = {}

        this.valoresObject = {
            Valoracion_1: 0, dolares_1: 0,
            Valoracion_2: 0, dolares_2: 0,
            Valoracion_3: 0, dolares_3: 0,
        }
        this.valoracionesDataset = [];
        this.amortizacionResumen = WRender.Create({ tagName: "label", innerText: this.valoracionResumen(0, 0, 0, 0) });
        this.Draw();
    }
    Draw = async () => {
        this.valoracionesContainer.innerHTML = "";
        const tasasCambio = await new Catalogo_Cambio_Dolar().Get();
        const estadosArticulos = await new Catalogo_Estados_Articulos().Get();
        this.Intereses = await new Transactional_Configuraciones().getTransactional_Configuraciones_Intereses();
        this.InteresBase = WArrayF.SumValAtt(this.Intereses, "Valor");

        this.buildValoresModel(tasasCambio);

        this.multiSelectEstadosArticulos = new WTableComponent({
            Dataset: estadosArticulos,
            ModelObject: new Catalogo_Estados_Articulos({
                porcentaje_compra: { type: 'number', hidden: true },
                porcentaje_empeno: { type: 'number', hidden: true },
                valor_compra_cordobas: {
                    type: "operation", action: (element) => {
                        return this.calculoCordobas(element.porcentaje_compra);
                    }
                }, valor_compra_dolares: {
                    type: "operation", action: (element) => {
                        return this.calculoDolares(element.porcentaje_compra, tasasCambio[0].valor_de_compra);
                    }
                },
                valor_empeño_cordobas: {
                    type: "operation", action: (element) => {
                        return this.calculoCordobas(element.porcentaje_empeno);
                    }
                }, valor_empeño_dolares: {
                    type: "operation", action: (element) => {
                        return this.calculoDolares(element.porcentaje_empeno, tasasCambio[0].valor_de_compra);
                    }
                }
            }),
            selectedItems: [estadosArticulos[0]],
            paginate: false,
            Options: {
                Select: true, MultiSelect: false, SelectAction: () => {
                    this.valoracionesForm?.DrawComponent();
                }
            }
        });
        this.valoracionModel = this.valoracionesModel(tasasCambio,
            this.multiSelectEstadosArticulos);

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
                }  .ModalElement label {
                    display: block;
                    width: 100%;
                    margin: 0px;
                } `
        });

        this.valoracionesTable = new WTableComponent({
            Dataset: this.valoracionesDataset,
            ModelObject: new Transactional_Valoracion({}),
            paginate: false,
            AutoSave: false,
            id: "valoracionesTable",
            Options: {
                Select: true, MultiSelect: true,
                Delete: true,
                DeleteAction: () => this.calculoAmortizacion(),
            }
        });

        this.CuotasTable = new WTableComponent({
            Dataset: [],
            ModelObject: new CuotaComponent(),
            paginate: false,
            AutoSave: false,
            id: "cuotasTable",
            Options: {

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

        this.TabContainerTables = WRender.Create({ className: "TabContainerTables", id: 'TabContainerTables' });
        this.ManagerTables = new ComponentsManager({ MainContainer: this.TabContainerTables });
        this.TableNavigator = new WAppNavigator({
            NavStyle: "Tab",
            Inicialize: true,
            Elements: [{
                name: "Amortización de deuda", action: () => {
                    this.ManagerTables?.NavigateFunction("cuotas", this.CuotasTable)
                }
            }, {
                name: "Valoraciones", action: () => {
                    this.ManagerTables?.NavigateFunction("valoraciones", this.valoracionesTable)
                }
            }]
        })

        this.valoracionesContainer.append(
            this.valoracionesForm,
            this.valoresForm,
            this.multiSelectEstadosArticulos,
            WRender.Create({ className: "nav-header", children: [this.TableNavigator, this.amortizacionResumen] }),
            this.TabContainerTables
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
    /**
     * 
     * @param {Number} valoracion_compra_cordobas 
     * @param {Number} valoracion_compra_dolares 
     * @param {Number} valoracion_empeño_cordobas 
     * @param {Number} valoracion_empeño_dolares 
     * @returns {string}
     */
    valoracionResumen(valoracion_compra_cordobas, valoracion_compra_dolares, valoracion_empeño_cordobas, valoracion_empeño_dolares) {
        return `Compra C$: ${valoracion_compra_cordobas.toFixed(2)} - Compra $: ${valoracion_compra_dolares.toFixed(2)} - Empeño C$: ${valoracion_empeño_cordobas.toFixed(2)} - Empeño $: ${valoracion_empeño_dolares.toFixed(2)}`;
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
                    this.multiSelectEstadosArticulos?.SetOperationValues()
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
                    this.multiSelectEstadosArticulos?.SetOperationValues()
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
                    this.multiSelectEstadosArticulos?.SetOperationValues()
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
                    this.multiSelectEstadosArticulos?.SetOperationValues()
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
                    this.multiSelectEstadosArticulos?.SetOperationValues()
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
                    this.multiSelectEstadosArticulos?.SetOperationValues()
                }
            },
        };
    }
    valoracionesModel(tasasCambio, multiSelectEstadosArticulos) {
        return new Transactional_Valoracion({
            Fecha: { type: 'date', disabled: true },
            Tasa_de_cambio: { type: 'number', disabled: true, defaultValue: tasasCambio[0].valor_de_compra },
            // @ts-ignore
            Tasa_interes: { type: 'number', disabled: true, defaultValue: this.InteresBase + 6 },
            Plazo: {
                type: "number", action: () => this.calculoAmortizacion(), min: 1, max: 24, defaultValue: 1
            }, Catalogo_Estados_Articulos: { type: 'WSELECT', hidden: true },
            valoracion_compra_cordobas: {
                type: 'operation', action: (/**@type {Transactional_Valoracion} */ valoracion) => {
                    return this.calculoCordobas(multiSelectEstadosArticulos.selectedItems[0].porcentaje_compra);
                }
            }, valoracion_empeño_cordobas: {
                type: 'operation', action: (/**@type {Transactional_Valoracion} */ valoracion) => {
                    return this.calculoCordobas(multiSelectEstadosArticulos.selectedItems[0].porcentaje_empeno);
                }
            }, valoracion_compra_dolares: {
                type: 'operation', action: (/**@type {Transactional_Valoracion} */ valoracion) => {
                    return this.calculoDolares(multiSelectEstadosArticulos.selectedItems[0].porcentaje_compra, tasasCambio[0].valor_de_compra);
                }
            }, valoracion_empeño_dolares: {
                type: 'operation', action: (/**@type {Transactional_Valoracion} */ valoracion) => {
                    return this.calculoDolares(multiSelectEstadosArticulos.selectedItems[0].porcentaje_empeno, tasasCambio[0].valor_de_compra);
                }
            },
        });
    }
    calculoCordobas = (porcentaje) => {
        return (this.avgValores() * (porcentaje / 100)).toFixed(2);
    }
    calculoDolares = (porcentaje, tasa_cambio) => {
        return ((this.avgValores() * (porcentaje / 100)) / tasa_cambio).toFixed(2);
    }
    avgValores() {
        return (parseFloat(this.valoresObject.Valoracion_1.toString()) +
            parseFloat(this.valoresObject.Valoracion_2.toString()) +
            parseFloat(this.valoresObject.Valoracion_3.toString())) / 3;
    }
    SetOption() {
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Alert', innerText: 'Nueva valoración',
            onclick: () => this.Manager.NavigateFunction("valoraciones")
        }))
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Alert', innerText: 'Buscar cliente',
            onclick: () => this.Manager.NavigateFunction("buscar-cliente", clientSearcher(this.selectCliente))
        }))

        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Basic', innerText: 'Buscar valoraciones',
            onclick: () => this.Manager.NavigateFunction("Searcher", new ValoracionesSearch(this.selectValoracion))
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
                    newValoracion[prop] = this.valoracionesForm?.FormObject[prop];
                }
                const newValores = {};
                for (const prop in this.valoresObject) {
                    newValores[prop] = this.valoresObject[prop];
                }
                newValoracion.Detail_Valores = newValores;
                const serch = this.valoracionesTable?.Dataset.find(f => WArrayF.compareObj(f, newValoracion));
                this.valoracionesTable?.Dataset.push(newValoracion);
                this.valoracionesTable?.DrawTable();
                this.calculoAmortizacion();
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
    selectCliente = (selectCliente) => {
        this.Cliente = selectCliente;
        if (this.valoracionesForm != undefined) {
            this.valoracionesForm.FormObject.Tasa_interes =
                parseFloat(this.Cliente.Catalogo_Clasificacion_Cliente.porcentaje)
                // @ts-ignore
                + this.InteresBase;
            this.valoracionesForm.DrawComponent();
        }
        this.calculoAmortizacion();
        this.Manager.NavigateFunction("valoraciones");
    }
    selectValoracion = (valoracion) => {
        if (this.valoracionesForm != undefined) {
            for (const prop in this.valoracionesForm?.FormObject) {
                if (prop == "Detail_Valores" || prop == "id_valoracion") continue;
                this.valoracionesForm.FormObject[prop] = valoracion[prop]
            }
            this.valoracionesForm.DrawComponent();
            // @ts-ignore
            if (new Date().subtractDays(40) < new Date(valoracion.Fecha)) {
                if (this.valoresForm != undefined) {
                    this.valoresObject.Valoracion_1 = valoracion.Detail_Valores?.Valoracion_1.toFixed(2) ?? 0;
                    this.valoresObject.dolares_1 = valoracion.Detail_Valores?.dolares_1.toFixed(2) ?? 0;
                    this.valoresObject.Valoracion_2 = valoracion.Detail_Valores?.Valoracion_2.toFixed(2) ?? 0;
                    this.valoresObject.dolares_2 = valoracion.Detail_Valores?.dolares_2.toFixed(2) ?? 0;
                    this.valoresObject.Valoracion_3 = valoracion.Detail_Valores?.Valoracion_3.toFixed(2) ?? 0;
                    this.valoresObject.dolares_3 = valoracion.Detail_Valores?.dolares_3.toFixed(2) ?? 0;
                    this.valoresForm.DrawComponent();
                }
            }
        }
        this.Manager.NavigateFunction("valoraciones");
    }
    calculoAmortizacion = () => {
        if (this.valoracionesTable?.Dataset.length == 0) {
            return;
        }
        // const total = this.valoracionesTable?.Dataset.reduce((sum, value) => (typeof value.Edad == "number" ? sum + value.Edad : sum), 0);
        const constrato = new ValoracionesContrato({
            valoracion_compra_cordobas: WArrayF.SumValAtt(this.valoracionesTable?.Dataset, "valoracion_compra_cordobas"),
            valoracion_compra_dolares: WArrayF.SumValAtt(this.valoracionesTable?.Dataset, "valoracion_compra_dolares"),
            valoracion_empeño_cordobas: WArrayF.SumValAtt(this.valoracionesTable?.Dataset, "valoracion_empeño_cordobas"),
            valoracion_empeño_dolares: WArrayF.SumValAtt(this.valoracionesTable?.Dataset, "valoracion_empeño_dolares"),
            tasas_interes: this.valoracionesForm?.FormObject.Tasa_interes / 100,
            plazo: this.valoracionesForm?.FormObject.Plazo ?? 1,
            fecha: new Date(),
            cuotas: new Array()
        })
        const cuotaFija = this.getPago(constrato);
        let capital = constrato.valoracion_empeño_cordobas;
        for (let index = 0; index < constrato.plazo; index++) {
            const abono_capital = cuotaFija - (capital * constrato.tasas_interes);
            const cuota = new Cuota({
                // @ts-ignore
                fecha: constrato.fecha.modifyMonth(index + 1),
                cuotaFija: cuotaFija.toFixed(2),
                interes: (capital * constrato.tasas_interes).toFixed(2),
                abono_capital: abono_capital.toFixed(2),
                capital: (capital - abono_capital).toFixed(2)
            })
            capital = capital - abono_capital;
            constrato.cuotas.push(cuota)
        }
        //console.log(constrato);
        if (this.CuotasTable != undefined) {
            this.CuotasTable.Dataset = constrato.cuotas;
            this.CuotasTable?.Draw();
        }
        this.amortizacionResumen.innerText = this.valoracionResumen(
            constrato.valoracion_compra_cordobas,
            constrato.valoracion_compra_dolares,
            constrato.valoracion_empeño_cordobas,
            constrato.valoracion_empeño_dolares);
        return constrato;
    }
    CustomStyle = css`
        .valoraciones-container{
            padding: 20px;
            display: grid;
            grid-template-columns: 400px calc(100% - 430px);
            gap: 30px;
        }
        #valoracionesForm, #valoracionesTable, #cuotasTable, .TabContainerTables,.nav-header{
            grid-column: span 2;
        }
        .nav-header {
            display: flex;
            width: 100%;
            justify-content: space-between;
            font-size: 14px;
            font-weight: bold;
            color: #00238a
        }        
        .OptionContainer{
            display: flex;
        } w-filter-option {
            grid-column: span 2;
        }
    `
    getPago(constrato) {
        const monto = constrato.valoracion_empeño_cordobas;
        const cuotas = constrato.plazo;
        const tasa = constrato.tasas_interes;
        const payment = ((tasa * Math.pow(1 + tasa, cuotas)) * monto) / (Math.pow(1 + tasa, cuotas) - 1);
        return payment;
    }
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
        const model = new Transactional_Valoracion({ requiere_valoracion: { type: "TEXT" } });
        const dataset = await model.Get();

        this.SearchContainer = WRender.Create({
            className: "search-container"
        })
        this.MainComponent = new WTableComponent({
            ModelObject: model,
            Dataset: dataset.map(x => {
                // @ts-ignore
                x.requiere_valoracion = (new Date().subtractDays(40) < new Date(x.Fecha)) ? "NO" : "SI";
                return x;
            }),
            Options: {
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
            Display: true,
            FilterFunction: (DFilt) => {
                this.MainComponent?.DrawTable(DFilt.map(x => {
                    // @ts-ignore
                    x.requiere_valoracion = (new Date().subtractDays(40) < new Date(x.Fecha)) ?"NO" : "SI";
                    return x;
                }));
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
/**
 * 
 * @param { Function } action 
 * @returns { HTMLElement }
 */
const clientSearcher = (action) => {
    const model = new Catalogo_Clientes();
    const TableComponent = new WTableComponent({
        ModelObject: model, Dataset: [], Options: {
            UserActions: [{
                name: "Selecionar",
                action: async (cliente) => {
                    await action(cliente);
                }
            }]
        }
    })
    const FilterOptions = new WFilterOptions({
        Dataset: [],
        ModelObject: model,
        Display: true,
        FilterFunction: (DFilt) => {
            TableComponent?.DrawTable(DFilt);
        }
    });
    return WRender.Create({ className: "main-container", children: [FilterOptions, TableComponent] });
}
export { clientSearcher }