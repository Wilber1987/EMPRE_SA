//@ts-check
// @ts-ignore
import { WRender, ComponentsManager, WAjaxTools } from "../WDevCore/WModules/WComponentsTools.js";
import { StylesControlsV2, StylesControlsV3, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
// @ts-ignore
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { Catalogo_Clientes, Transaction_ContratosModel } from "../FrontModel/DBODataBaseModel.js"
// @ts-ignore
import { WFilterOptions } from "../WDevCore/WComponents/WFilterControls.js";
import { Transaction_Contratos, ValoracionesContrato } from "../FrontModel/Model.js";
import { css } from "../WDevCore/WModules/WStyledRender.js";
import { ValoracionesSearch, clientSearcher } from "../modules/SerchersModules.js";
/**
 * @typedef {Object} ContratosConfig
 * * @property {Transaction_Contratos} [Entity]
 */
class Transaction_ContratosView extends HTMLElement {
    /**
     * 
     * @param {ContratosConfig} props 
     */
    constructor(props) {
        super();
        //models
        this.entity = props?.Entity ?? new Transaction_Contratos();
        this.componentsModel = new Transaction_ContratosModel();
        this.OptionContainer = WRender.Create({ className: "OptionContainer" });
        this.TabContainer = WRender.Create({ className: "TabContainer", id: 'TabContainer' });
        this.Manager = new ComponentsManager({ MainContainer: this.TabContainer, SPAManage: false });
        this.valoracionesContainer = WRender.Create({ className: "valoraciones-container" });
        this.append(this.CustomStyle);
        this.Cliente = {}
        this.valoracionesDataset = [];
        this.selectedClientDetail = WRender.Create({ tagName: "label", className: "selected-client" });
        // @ts-ignore
        this.amortizacionResumen = WRender.Create({ tagName: "label", innerText: this.valoracionResumen(this.entity) });

        this.TabContainer = WRender.createElement({ type: 'div', props: { class: 'TabContainer', id: 'TabContainer' } })


        this.SetOption();
        this.append(
            StylesControlsV2.cloneNode(true),
            StyleScrolls.cloneNode(true),
            StylesControlsV3.cloneNode(true),
            this.OptionContainer,
            this.TabContainer
        );
        this.Draw();
    }
    /**
     * 
     * @param {ValoracionesContrato} entity 
     * @returns 
     */
    valoracionResumen(entity) {
        // @ts-ignore
        return `Compra C$: ${entity.valoracion_compra_cordobas?.toFixed(2)} - Compra $: ${entity.valoracion_compra_dolares?.toFixed(2)}
         Empeño C$: ${entity.valoracion_empeño_cordobas?.toFixed(2)} - Empeño $: ${entity.valoracion_empeño_dolares?.toFixed(2)}`;

    }
    Draw = async () => {
        //const dataset = await this.model.Get();


    }
    SetOption() {
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Primary', innerText: 'Nueva valoración',
            onclick: () => this.Manager.NavigateFunction("valoraciones")
        }))
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Secundary', innerText: 'Buscar cliente',
            onclick: () => {
                if (!this.clientSercher) {
                    this.clientSercher = clientSearcher(this.selectCliente);
                }
                this.Manager.NavigateFunction("buscar-cliente", this.clientSercher)
            }
        }))
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Tertiary', innerText: 'Buscar valoraciones',
            onclick: () => this.Manager.NavigateFunction("Searcher", new ValoracionesSearch(this.selectValoracion))
        }))
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Fifth', innerText: 'Guardar contrato',
            onclick: async () => {
                //this.append(ModalMessege("Valoraciones guardadas correctamente"));
            }
        }))        
    }
    selectCliente = (/**@type {Catalogo_Clientes} */ selectCliente) => {
        this.Cliente = selectCliente;
        this.selectedClientDetail.innerText = `
            Cliente seleccionado: ${selectCliente.primer_nombre} ${selectCliente.segundo_nombre ?? ''} ${selectCliente.primer_apellido} ${selectCliente.segundo_apellidio ?? ''}
        `;
        this.Manager.NavigateFunction("valoraciones");
    }
    // @ts-ignore
    selectValoracion = (valoracion) => {
        this.Manager.NavigateFunction("valoraciones");
    }
    CustomStyle = css`
        .valoraciones-container{
            padding: 20px;
            display: grid;
            grid-template-columns: 400px calc(100% - 430px);
            gap: 20px 30px;
        }
        #valoracionesForm, 
        #valoracionesTable,
        #cuotasTable,
        .TabContainerTables,
        .nav-header,
        .selected-client{
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
}
customElements.define('w-transaction_contratos', Transaction_ContratosView);
// @ts-ignore
window.addEventListener('load', async () => { MainBody.append(new Transaction_ContratosView({})) })
