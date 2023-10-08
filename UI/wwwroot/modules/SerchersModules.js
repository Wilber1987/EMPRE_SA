//@ts-check
// @ts-ignore
import { WRender, ComponentsManager, WAjaxTools } from "../WDevCore/WModules/WComponentsTools.js";
import { StylesControlsV2, StylesControlsV3, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
// @ts-ignore
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { Catalogo_Clientes, Transaction_ContratosModel, Transactional_Valoracion } from "../FrontModel/DBODataBaseModel.js"
// @ts-ignore
import { WFilterOptions } from "../WDevCore/WComponents/WFilterControls.js";
import { Transaction_Contratos, ValoracionesTransaction } from "../FrontModel/Model.js";
import { css } from "../WDevCore/WModules/WStyledRender.js";
class ValoracionesSearch extends HTMLElement {
    constructor(/** @type {Function} */ action) {
        super();
        this.TabContainer = WRender.Create({ className: "TabContainer", id: 'TabContainer' });
        this.Manager = new ComponentsManager({ MainContainer: this.TabContainer, SPAManage: false });
        this.action = action;
        this.DrawComponent();
    }
    DrawComponent = async () => {
        const model = new Transactional_Valoracion({ requiere_valoracion: { type: "TEXT", hiddenFilter: true } });
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
                // @ts-ignore
                this.MainComponent.Dataset = DFilt.map(x => {
                    // @ts-ignore
                    x.requiere_valoracion = (new Date().subtractDays(40) < new Date(x.Fecha)) ? "NO" : "SI";
                    return x;
                });
                this.MainComponent?.DrawTable();
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
            TableComponent.Dataset = DFilt;
            TableComponent?.DrawTable();
        }
    });
    return WRender.Create({ className: "main-container", children: [FilterOptions, TableComponent] });
}
export { clientSearcher }

/**
 * 
 * @param { Function } [action] 
 * @returns { HTMLElement }
 */
const contratosSearcher = (action) => {
    const model = new Transaction_Contratos();
    const TableComponent = new WTableComponent({
        EntityModel: model,
        ModelObject: new Transaction_ContratosModel({
            numero_contrato: { type: "text", primary: false }
        }),
        AddItemsFromApi: true,
        Options: {
            Show: true,
            UserActions: [{
                name: "Seleccionar",
                action: async (cliente) => {
                    // @ts-ignore
                    await action(cliente);
                }
            }]
        }
    })
    const FilterOptions = new WFilterOptions({
        Dataset: [],
        EntityModel: model,
        ModelObject: new Transaction_ContratosModel(),
        Display: true,
        FilterFunction: (DFilt) => {
            TableComponent.Dataset = DFilt;
            TableComponent?.DrawTable();
            // @ts-ignore
            action(DFilt, FilterOptions);
        }
    });
    return WRender.Create({ className: "main-contratos-searcher", children: [FilterOptions, TableComponent] });
}
export { contratosSearcher }