//@ts-check
import { WRender, ComponentsManager, WAjaxTools } from "../WDevCore/WModules/WComponentsTools.js";
import { WOrtograficValidation } from "../WDevCore/WModules/WOrtograficValidation.js";
import { StylesControlsV2, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { WFilterOptions } from '../WDevCore/WComponents/WFilterControls.js';
import { WAppNavigator } from "../WDevCore/WComponents/WAppNavigator.js"
import { Catalogo_Agentes, Catalogo_Clasificacion_Cliente, Catalogo_Clientes, Catalogo_Tipo_Agente, Catalogo_Tipo_Identificacion, Catalogo_Cambio_Dolar, Catalogo_Cuentas, Categoria_Cuentas, Catalogo_Departamento, Catalogo_Inversores, Catalogo_Municipio, Catalogo_Nacionalidad, Catalogo_Profesiones, Catalogo_Sucursales, Catalogo_Estados_Articulos, Catalogo_Categoria, Permisos_Cuentas } from "../FrontModel/DBODataBaseModel.js"
import { EntityClass } from "../WDevCore/WModules/EntityClass.js";
class DBOCatalogosManagerView extends HTMLElement {
    constructor() {
        super();
        this.TabContainer = WRender.createElement({ type: 'div', props: { class: 'TabContainer', id: 'TabContainer' } })
        this.TabManager = new ComponentsManager({ MainContainer: this.TabContainer });
        this.append(
            StylesControlsV2.cloneNode(true),
            StyleScrolls.cloneNode(true),
            this.MainNav,
            this.TabContainer
        );
    }
    /** @param {EntityClass} Model*/
    NavigateFunction = async (Model) => {
        const data = await Model.Get();
        const mainComponent = new WTableComponent({
            ModelObject: Model,
            Dataset: data,
            AutoSave: true,
            Options: {
                Add: true,
                Edit: true,
                Search: true
            }
        })

        const filterOptions = new WFilterOptions({
            Dataset: data,
            ModelObject: Model,
            FilterFunction: (DFilt) => {
                mainComponent.DrawTable(DFilt);
            }
        });
        WRender.SetStyle(filterOptions, { marginBottom: "20px", display: "block" })
        this.TabManager.NavigateFunction(Model.constructor.name, WRender.Create({ className: "catalogo-container", children: [filterOptions, mainComponent] }));
    }
    MainNav = new WAppNavigator({
        //@ts-ignore
        Elements: [
            {
                name: WOrtograficValidation.es('Catalogo_Cambio_Dolar'), action: async () => {
                    this.NavigateFunction(new Catalogo_Cambio_Dolar())
                }
            }, {
                name: WOrtograficValidation.es('Catalogo_Sucursales'), action: async () => {
                    this.NavigateFunction(new Catalogo_Sucursales())
                }
            }, {
                name: WOrtograficValidation.es('Catalogo_Cuentas'), action: async () => {
                    this.NavigateFunction(new Catalogo_Cuentas())
                }
            }, {
                name: WOrtograficValidation.es('Categoria_Cuentas'), action: async () => {
                    this.NavigateFunction(new Categoria_Cuentas())
                }
            },{
                name: WOrtograficValidation.es('Permisos_Cuentas'), action: async () => {
                    this.NavigateFunction(new Permisos_Cuentas())
                }
            },{
                name: WOrtograficValidation.es('Catalogo_Tipo_Agente'), action: async () => {
                    this.NavigateFunction(new Catalogo_Tipo_Agente())
                }
            }, {
                name: WOrtograficValidation.es('Catalogo_Agentes'), action: async () => {
                    this.NavigateFunction(new Catalogo_Agentes())
                }
            }, {
                name: WOrtograficValidation.es('Catalogo_Nacionalidad'), action: async () => {
                    this.NavigateFunction(new Catalogo_Nacionalidad())
                }
            },{
                name: WOrtograficValidation.es('Catalogo_Departamento'), action: async () => {
                    this.NavigateFunction(new Catalogo_Departamento())
                }
            }, {
                name: WOrtograficValidation.es('Catalogo_Municipio'), action: async () => {
                    this.NavigateFunction(new Catalogo_Municipio())
                }
            }, {
                name: WOrtograficValidation.es('Catalogo_Profesiones'), action: async () => {
                    this.NavigateFunction(new Catalogo_Profesiones())
                }
            }, {
                name: WOrtograficValidation.es('Catalogo_Clasificacion_Cliente'), action: async () => {
                    this.NavigateFunction(new Catalogo_Clasificacion_Cliente())
                }
            }, {
                name: 'Tipo Identificación', action: async () => {
                    this.NavigateFunction(new Catalogo_Tipo_Identificacion())
                }
            }, {
                name: WOrtograficValidation.es('Catalogo_Estados_Articulos'), action: async () => {
                    this.NavigateFunction(new Catalogo_Estados_Articulos())
                }
            }, {
                name: WOrtograficValidation.es('Catalogo_Categoria'), action: async () => {
                    this.NavigateFunction(new Catalogo_Categoria())
                }
            },
        ]
    });
}
customElements.define('w-catalogos_manager', DBOCatalogosManagerView);
export { DBOCatalogosManagerView }