//@ts-check
import { WRender, ComponentsManager, WAjaxTools } from "../WDevCore/WModules/WComponentsTools.js";
import { StylesControlsV2, StylesControlsV3, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { WFilterOptions } from "../WDevCore/WComponents/WFilterControls.js";
import { WModalForm } from "../WDevCore/WComponents/WModalForm.js";
import { WForm } from "../WDevCore/WComponents/WForm.js";
import { Catalogo_Cambio_Dolar, Catalogo_Clientes, Catalogo_Estados_Articulos, Transactional_Valoracion } from "../FrontModel/DBODataBaseModel.js";
class Transaction_Valoraciones_View extends HTMLElement {
    constructor(props) {
        super();
        this.OptionContainer = WRender.Create({ className: "OptionContainer" });
        this.TabContainer = WRender.Create({ className: "TabContainer" ,id: 'TabContainer'});        
        this.Manager = new ComponentsManager({MainContainer: this.TabContainer, SPAManage: false}); 
        this.Draw();
    }
    Draw = async () => {
        const tasasCambio = await new Catalogo_Cambio_Dolar().Get();
        const estadosArticulos  = await new Catalogo_Estados_Articulos().Get();
        const model = new Transactional_Valoracion();
        const dataset = await model.Get();
        
       
        this.SearchContainer = WRender.Create({
            className: "search-container"
        })
        this.MainComponent = new WTableComponent({
            ModelObject: model, Dataset: dataset, Options: {
                //Add: false, UrlAdd: "../api/ApiEntityDBO/saveCatalogo_Clientes",
                Edit: true, UrlUpdate: "../api/ApiEntityDBO/updateCatalogo_Clientes",
                //Search: true, UrlSearch: "../api/ApiEntityDBO/getCatalogo_Clientes"
            }
        })
        this.FilterOptions = new WFilterOptions({
            Dataset: dataset,
            ModelObject: model,
            FilterFunction: (DFilt) => {
                this.MainComponent?.DrawTable(DFilt);
            }
        });

        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Alert', innerText: 'Nueva valoración',
            //onclick: () => this.NewTransaction(new Catalogo_Tipo_Transaccion())
        }))
        
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Basic', innerText: 'Buscar valoraciones',
            onclick: () => this.NewTransaction(model)
        }))
       
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Success', innerText: 'Guardar',
            //onclick: () => this.NewTransaction(this.VentaModel())
        }))

       // this.TabContainer.append(this.MainComponent)
       this.Manager.NavigateFunction("tabla", this.MainComponent)

        this.append(
            StylesControlsV2.cloneNode(true),
            StyleScrolls.cloneNode(true),
            StylesControlsV3.cloneNode(true),
            this.FilterOptions,
            this.OptionContainer,
            this.TabContainer
        );

    }
    NewTransaction(Model) {
        this.Manager?.NavigateFunction(Model.constructor.name, new WForm({ModelObject: Model, AutoSave : true, ObjectOptions: {SaveFunction: (NewObject)=>{
            this.MainComponent?.Dataset.unshift(NewObject);
            this.MainComponent?.DrawTable();
        }}}),undefined,true)
    }
  
}
customElements.define('w-valoraciones-view', Transaction_Valoraciones_View);
// @ts-ignore
window.addEventListener('load', async () => { MainBody.append(new Transaction_Valoraciones_View()) })