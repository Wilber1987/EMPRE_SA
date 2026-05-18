//@ts-check
import { Catalogo_Tipo_Identificacion } from "../ClientModule/FrontModel/Catalogo_Clientes.js";
import { Catalogo_Cambio_Divisa_ModelComponent, Catalogo_Categoria_ModelComponent, Catalogo_Cuentas, Catalogo_Departamento, Catalogo_Estados_Articulos, Catalogo_Estados_Articulos_ModelComponent, Catalogo_Municipio, Catalogo_Nacionalidad, Catalogo_Profesiones, Catalogo_Sucursales_ModelComponent, Permisos_Cuentas } from "../FrontModel/DBODataBaseModel.js";
import { StylesControlsV2, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js";
import { WAppNavigator } from "../WDevCore/WComponents/WAppNavigator.js";
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js";
import { EntityClass } from "../WDevCore/WModules/EntityClass.js";
import { ComponentsManager, html, WRender } from "../WDevCore/WModules/WComponentsTools.js";
import { WOrtograficValidation } from "../WDevCore/WModules/WOrtograficValidation.js";
import { css } from "../WDevCore/WModules/WStyledRender.js";
import {Catalogo_Clasificacion_Cliente, Catalogo_Clasificacion_Interes} from "../FrontModel/ClientesModel.js";
class DBOCatalogosManagerView extends HTMLElement {
    constructor() {
        super();              
        this.append(
            StylesControlsV2.cloneNode(true),
            StyleScrolls.cloneNode(true),
            this.MainNav,
            this.CustomStyle
        );
    }
    /** 
     * @param {EntityClass} Model
     * @param {EntityClass} [Entity]
    */
    NavigateFunction = async (Model, Entity) => {
        const mainComponent = new WTableComponent({
            ModelObject: Model,
            EntityModel: Entity,
            AutoSave: true,           
            Options: {
                Add: true,
                Edit: true,
                AutoSetDate: false,
                Filter: true,
                FilterDisplay: true,
                Delete: true
            }
        })
        return html`<div class="catalogo-container">
            <h2>${WOrtograficValidation.es(Model.constructor.name)}</h2>
            ${mainComponent}
        </div>`
    }
    MainNav = new WAppNavigator({
        NavStyle: "tab",
        Inicialize: true,
        //@ts-ignore
        Elements: [
            {
                name: WOrtograficValidation.es('Catalogo_Cambio_Divisa'), action: async () => {
                    return this.NavigateFunction(new Catalogo_Cambio_Divisa_ModelComponent())
                }
            }, {
                name: WOrtograficValidation.es('Catalogo_Sucursales_ModelComponent'), action: async () => {
                    return this.NavigateFunction(new Catalogo_Sucursales_ModelComponent())
                }
            }, {
                name: WOrtograficValidation.es('Catalogo_Cuentas'), action: async () => {
                    return this.NavigateFunction(new Catalogo_Cuentas())
                }
            }, {
                name: WOrtograficValidation.es('Permisos_Cuentas'), action: async () => {
                    return this.NavigateFunction(new Permisos_Cuentas())
                }
            }, {
                name: WOrtograficValidation.es('Catalogo_Clasificacion_Interes'), action: async () => {
                    return this.NavigateFunction(new Catalogo_Clasificacion_Interes())
                }
            },/*//TODO ELIMINAR A POSTERIOR LO DE LOS AGENTES { {
                name: WOrtograficValidation.es('Catalogo_Tipo_Agente'), action: async () => {
                    return this.NavigateFunction(new Catalogo_Tipo_Agente())
                }
            },
            
                name: WOrtograficValidation.es('Catalogo_Agentes'), action: async () => {
                    return this.NavigateFunction(new Catalogo_Agentes())
                }
            },*/ {
                name: WOrtograficValidation.es('Catalogo_Nacionalidad'), action: async () => {
                    return this.NavigateFunction(new Catalogo_Nacionalidad())
                }
            }, {
                name: WOrtograficValidation.es('Catalogo_Departamento'), action: async () => {
                    return this.NavigateFunction(new Catalogo_Departamento())
                }
            }, {
                name: WOrtograficValidation.es('Catalogo_Municipio'), action: async () => {
                    return this.NavigateFunction(new Catalogo_Municipio())
                }
            }, {
                name: WOrtograficValidation.es('Catalogo_Profesiones'), action: async () => {
                    return this.NavigateFunction(new Catalogo_Profesiones())
                }
            }, {
                name: WOrtograficValidation.es('Catalogo_Clasificacion_Cliente'), action: async () => {
                    return this.NavigateFunction(new Catalogo_Clasificacion_Cliente())
                }
            }, {
                name: 'Tipo Identificación', action: async () => {
                    return this.NavigateFunction(new Catalogo_Tipo_Identificacion())
                }
            }, {
                name: WOrtograficValidation.es('Catalogo_Estados_Articulos'), action: async () => {
                    return this.NavigateFunction(new Catalogo_Estados_Articulos_ModelComponent(), new Catalogo_Estados_Articulos())
                }
            }, {
                name: WOrtograficValidation.es('Catalogo_Categoria'), action: async () => {
                    return this.NavigateFunction(new Catalogo_Categoria_ModelComponent())
                }
            },
        ]
    });
    CustomStyle = css`
        w-catalogos-manager {            
            gap: 20px
        }
    `
}
customElements.define('w-catalogos-manager', DBOCatalogosManagerView);
export { DBOCatalogosManagerView };
