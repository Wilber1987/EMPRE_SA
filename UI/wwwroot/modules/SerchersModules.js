//@ts-check
// @ts-ignore
import { WRender, ComponentsManager, WAjaxTools } from "../WDevCore/WModules/WComponentsTools.js";
import { StylesControlsV2, StylesControlsV3, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
// @ts-ignore
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { Catalogo_Clientes, Transaction_Contratos_ModelComponent, Transactional_Valoracion } from "../FrontModel/DBODataBaseModel.js"
// @ts-ignore
import { WFilterOptions } from "../WDevCore/WComponents/WFilterControls.js";
import { Tbl_Cuotas, Transaction_Contratos, ValoracionesTransaction } from "../FrontModel/Model.js";
import { css } from "../WDevCore/WModules/WStyledRender.js";
import { Tbl_Cuotas_ModelComponent } from "../FrontModel/ModelComponents.js";
class ValoracionesSearch extends HTMLElement {
    constructor(/** @type {Function} */ action,/** @type {Function|undefined} */ secondAction,/** @type {Boolean} */ onlyValids = false) {
        super();
        this.TabContainer = WRender.Create({ className: "TabContainer", id: 'TabContainer' });
        this.Manager = new ComponentsManager({ MainContainer: this.TabContainer, SPAManage: false });
        this.action = action;
        this.secondAction = secondAction;
        this.onlyValids = onlyValids;
        this.DrawComponent();
    }
    DrawComponent = async () => {
        const model = new Transactional_Valoracion({ requiere_valoracion: { type: "TEXT", hiddenFilter: true } });
        if (this.onlyValids) {
            model.FilterData.push({PropName : "Fecha",
                FilterType : ">",
                // @ts-ignore
                Values: [new Date().subtractDays(40)]});
        }
        let dataset = await model.Get();        

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
                        name: "Seleccionar", action: (/**@type {Transactional_Valoracion}*/ selected) => {
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
            Filter: true,
            FilterDisplay: true,
            UserActions: [{
                name: "Selecionar",
                action: async (cliente) => {
                    await action(cliente);
                }
            }]
        }
    })    
    return WRender.Create({ className: "main-container", children: [TableComponent] });
}
export { clientSearcher }

/**
 * 
 * @param { Function } [action] 
 * @returns { HTMLElement }
 */
const contratosSearcher = (action) => {
    const model = new Transaction_Contratos_ModelComponent();
    model.Tbl_Cuotas.ModelObject = () => new Tbl_Cuotas_ModelComponent({
        Estado: { type: "operation" , action: (/** @type {Tbl_Cuotas} */ cuota)=>{
            if(cuota.total == cuota.pago_contado) {
                return "CANCELADA";
            } else if(cuota.pago_contado > 0) {
                return "PAGO PARCIAL";
            }
        }}
    });
    const TableComponent = new WTableComponent({
        EntityModel: model,
        ModelObject: new Transaction_Contratos_ModelComponent({
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
        //EntityModel: model,
        ModelObject: new Transaction_Contratos_ModelComponent(),
        Display: true,
        FilterFunction: (DFilt) => {
            TableComponent.Dataset = DFilt;
            TableComponent?.DrawTable();
            // @ts-ignore
            //action(DFilt, FilterOptions);
        }
    });
    return WRender.Create({ className: "main-contratos-searcher", children: [FilterOptions, TableComponent] });
}
export { contratosSearcher }