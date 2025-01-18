//@ts-check
// @ts-ignore
import { ComponentsManager, html, WRender } from "../../WDevCore/WModules/WComponentsTools.js";
// @ts-ignore
import { WTableComponent } from "../../WDevCore/WComponents/WTableComponent.js";
// @ts-ignore
import { WAppNavigator } from "../../WDevCore/WComponents/WAppNavigator.js";
import { ModalMessege, ModalVericateAction } from "../../WDevCore/WComponents/WForm.js";
import { css } from "../../WDevCore/WModules/WStyledRender.js";
import { Tbl_Lotes_ModelComponent } from "../FrontModel/ModelComponent/Tbl_Lotes_ModelComponent.js";
import { Tbl_Lotes } from "../FrontModel/Tbl_Lotes.js";
import { WModalForm } from "../../WDevCore/WComponents/WModalForm.js";
import { Tbl_Transaccion } from "../FrontModel/Tbl_Transaction.js";
import { Tbl_Transaccion_ModelComponent } from "../FrontModel/ModelComponent/Tbl_Transaction_ModelComponent.js";
import { FilterData } from "../../WDevCore/WModules/CommonModel.js";

/**
 * @typedef {Object} LotesConfig
 * * @property {Tbl_Lotes} [Entity]
 * * @property {Tbl_Lotes}[TasaCambio]
 */
class LotesManagerView extends HTMLElement {
    constructor(LotesConfig) {
        super();
        this.LotesConfig = LotesConfig;
        this.OptionContainer = WRender.Create({ className: "OptionContainer" });
        this.TabContainer = WRender.Create({ className: "TabContainer", id: 'TabContainer' });
        this.Manager = new ComponentsManager({ MainContainer: this.TabContainer, SPAManage: false });

        this.navigator = new WAppNavigator({ Inicialize: true, Elements: this.ElementsNav })
        this.append(this.CustomStyle, this.OptionContainer, this.navigator, this.TabContainer);
        this.indexFactura = 0;
        this.Draw();
        this.valoresObject = {
            subtotal: 0,
            iva: 0,
        }
    }
    ElementsNav = [
        {
            name: "Etiquetas ventas", action: async () => {
                this.Manager.NavigateFunction("Etiquetas-Venta", await this.EtiquetasView());
            }
        }, {
            name: "Lotes Proveedor", action: () => {
                this.Manager.NavigateFunction("Lotes", this.ExistenciasView())
            }
        },
    ]

    Draw = async () => {
    }//end draw

    BuildLoteModel = () => {
        this.LotesModel = new Tbl_Lotes_ModelComponent();
    }
    

    ExistenciasView() {
        return new WTableComponent({
            ModelObject: new Tbl_Lotes_ModelComponent(),
            EntityModel: new Tbl_Lotes(),
            TypeMoney: "Dollar",
            Options: {
                Search: false, Filter: true, Add: false, Edit: false, FilterDisplay: true,
                UserActions: [{
                    name: "Dar de baja",
                    action: async (/**@type {Tbl_Lotes}*/ Lote) => {
                        this.DarLoteDeBaja(Lote);
                    }
                }]
            }
        });
    }
    DarLoteDeBaja(Lote) {
        const modal = new WModalForm({
            ModelObject: new Tbl_Transaccion_ModelComponent({
                Cantidad: { type: 'number', min: 1, max: Lote.Cantidad_Existente, defaultValue: 1 }
            }),
            //EditObject: Transaction,
            title: "BAJA DE EXISTENCIA",
            ObjectOptions: {
                SaveFunction: async (/**@type {Tbl_Transaccion}*/ editObject) => {
                    editObject.Id_Lote = Lote.Id_Lote;
                    this.append(ModalVericateAction(async () => {
                        console.log(editObject);
                        const response = await new Tbl_Lotes().DarDeBaja(editObject);
                        this.append(ModalMessege(response.message));
                        modal.close();
                    }, "Esta seguro que desea dar de baja esta existencia?"));
                }
            }
        });
        this.append(modal);
    }

    async EtiquetasView() {
        /**@type {Array<Tbl_Lotes>} */
        const lotes = await new Tbl_Lotes().Where(
            FilterData.Greater("Cantidad_Existente", 0)
        );
        return html`<div class="etiquetas-container">
             <div class="etiqueta-detail">
                <div class="etiqueta-header">Detalle</div>
                <div class="etiqueta-header">Código</div>
                <div class="etiqueta-header">Tipo</div>
                <div class="etiqueta-header">Precio Venta</div>
                <div class="etiqueta-header">Precio Compra</div>
                <div class="etiqueta-header">Cuota Mensual</div>
                <div class="etiqueta-header">Porcentaje</div>
                <div class="etiqueta-header">Total</div>
                <div class="etiqueta-header">Ajuste</div>
            </div>
            ${lotes.map(lote => this.CreateEtiqueta(lote))}
        </div>`

    }
    /**
     * @param {Tbl_Lotes} lote
     * @returns {HTMLElement}
     */
    CreateEtiqueta(lote) {
        const etiqueta = html`<div class="etiqueta-detail">
            <div>${lote.Detalles}</div>
            <div>${lote.EtiquetaLote?.Codigo}</div>
            <div>${lote.EtiquetaLote?.Tipo}</div>
            <div>${lote.EtiquetaLote?.Precio_compra_dolares}</div>
            <div>${lote.EtiquetaLote?.PorcentajesUtilidad}</div>
            <div>${lote.EtiquetaLote?.Precio_venta_Contado_dolares}</div>
            <div>${lote.EtiquetaLote?.PorcentajesApartado}</div>
            <div>${lote.EtiquetaLote?.Precio_venta_Apartado_dolares}</div>
            <div><input type="number"
                value="${lote.EtiquetaLote?.PorcentajeAdicional}" 
                max="100" min="0" pattern="\d*" 
                onchange="${async (ev) => {
                const value = ev.target.value;
                lote.EtiquetaLote.PorcentajeAdicional = value;
                const response = await lote.Update();
                if (response.status == 200) {
                    location.reload();
                }
            }}"></div>
        </div>`
        return etiqueta;
    }
    CustomStyle = css`       
        .OptionContainer{
            display: flex;
        }
        .etiquetas-container {
            display: grid;
            grid-template-columns: repeat(9, 1fr); /* Ocho columnas de igual tamaño */
            gap: 5px; /* Espaciado entre columnas */
            padding: 20px;      
            margin: 20px 0px;      
            border-radius: 15px;
            background-color: #f9f9f9;
        }

        .etiqueta-detail {
            display: contents; /* Permite que los hijos hereden el grid del contenedor */
        }

        .etiqueta-header {
            font-weight: bold;
            text-align: center;
            background-color: #e0e0e0;
            padding: 5px 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .etiqueta-detail > div {
            text-align: center;
            padding: 5px 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }

        .etiqueta-detail input {
            width: calc(100% - 5);
            text-align: center;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 5px;
        }

        /* Estilo responsivo */
        @media (max-width: 768px) {
            .etiquetas-container {
                grid-template-columns: repeat(4, 1fr); /* Reducir a 4 columnas */
            }

            .etiqueta-header,
            .etiqueta-detail > div {
                font-size: 12px; /* Reducir el tamaño de fuente */
                padding: 3px 5px; /* Reducir el espaciado */
            }
        }

        @media (max-width: 480px) {
            .etiquetas-container {
                grid-template-columns: repeat(2, 1fr); /* Reducir a 2 columnas */
            }

            .etiqueta-header,
            .etiqueta-detail > div {
                font-size: 10px; /* Reducir aún más el tamaño de fuente */
                padding: 2px 3px; /* Reducir el espaciado */
            }
        }
    `
}
customElements.define('w-main-lotes-manager', LotesManagerView);
export { LotesManagerView };

window.addEventListener('load', async () => {
    // @ts-ignore
    MainBody.append(new LotesManagerView())
});