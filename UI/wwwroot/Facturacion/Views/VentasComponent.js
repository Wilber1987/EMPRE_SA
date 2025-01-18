//@ts-check
import { Catalogo_Cambio_Divisa } from "../../FrontModel/Catalogo_Cambio_Divisa.js";
import { WAppNavigator } from "../../WDevCore/WComponents/WAppNavigator.js";
import { ModalMessege, ModalVericateAction, WForm } from "../../WDevCore/WComponents/WForm.js";
import { WArrayF } from "../../WDevCore/WModules/WArrayF.js";
import { ComponentsManager, ConvertToMoneyString, html, WRender } from "../../WDevCore/WModules/WComponentsTools.js";
import { WOrtograficValidation } from "../../WDevCore/WModules/WOrtograficValidation.js";
import { css } from "../../WDevCore/WModules/WStyledRender.js";
import { Detalle_Factura } from "../FrontModel/Detalle_Factura.js";
import { Tbl_Factura_ModelComponent } from "../FrontModel/ModelComponent/Tbl_Factura_ModelComponent.js";
import { Tbl_Factura } from "../FrontModel/Tbl_Factura.js";

/**
 * @typedef {Object} VentasConfig
 * @property {string} someProperty - Description of the property
 * @property {function} [action] - Optional action function
 * @property {Catalogo_Cambio_Divisa}  TasaActual
 * @property {Object} [Entity] - Optional entity object
 */

class VentasComponent extends HTMLElement {
    /**
     * @param {Partial<VentasConfig>} VentasConfig
     */
    constructor(VentasConfig) {
        super();
        this.TasaActual = VentasConfig.TasaActual;
        this.VentasConfig = VentasConfig ?? {};
        this.VentasConfig.Entity = this.VentasConfig.Entity ?? new Tbl_Factura({
            Tasa_Cambio: this.TasaActual?.Valor_de_compra,
            Tasa_Cambio_Venta: this.TasaActual?.Valor_de_venta
        });
        this.OptionContainer = WRender.Create({ className: "OptionContainer" });
        this.TabContainer = WRender.Create({ className: "TabContainer", id: 'TabContainer' });
        this.Manager = new ComponentsManager({ MainContainer: this.TabContainer, SPAManage: false });
        this.CompraContainer = WRender.Create({ className: "compras-container" });

        //this.navigator = new WAppNavigator({ Inicialize: true, Elements: this.ElementsNav })
        this.append(this.CustomStyle, this.OptionContainer,this.CompraContainer, this.TabContainer);
    }
    connectedCallback() {
        this.Draw();
    }


    Draw = async () => {
        this.setComprasContainer();
    }

    async setComprasContainer() {
        this.TotalesDetail = WRender.Create({ tagName: "div", className: "resumen-container" });
        this.TotalesDetailUpdate(0,  0,  0,  0);
        this.ComprasModel = this.BuildCompraModel()
        this.ComprasForm = new WForm({
            ModelObject: this.ComprasModel,
            AutoSave: false,
            limit: 3,
            DivColumns: "repeat(3, 32%)",
            //Options: false,
            // @ts-ignore
            SaveFunction: async (/**@type {Tbl_Factura} */ factura) => {
                if (!this.ComprasForm?.Validate()) {
                    this.append(ModalMessege("Agregue datos para poder continuar"));
                    return;
                }
                const response = await new Tbl_Factura(factura).Save();
                if (response.status == 200) {
                    if (this.VentasConfig?.action != undefined) {
                        this.append(ModalVericateAction(async () => {
                            // @ts-ignore
                            this.VentasConfig?.action(factura, response);
                        }, response.message));
                    } else {
                        this.append(ModalMessege(response.message))
                    }
                } else {
                    this.append(ModalMessege(response.message))
                }
            }
        });
        this.CompraContainer.append(
            this.ComprasForm,
            this.TotalesDetail
        );
    }
     /**
     * @param {Number} subtotal
     * @param {Number} iva
     * @param {Number} total
     * @param {Number} descuento
     */
    TotalesDetailUpdate(subtotal, iva, total, descuento) {
        // @ts-ignore
        this.VentasConfig.Entity.Moneda = this.VentasConfig.Entity?.Moneda ?? "CORDOBAS"
        // @ts-ignore                
        this.TotalesDetail.innerHTML = "";
        this.TotalesDetail?.append(html`<div class="detail-container">
            <h3>Resumen</h3>
            <hr/>
            <label class="value-container">
                <span>Sub Total:</span>
                <span class="value">${WOrtograficValidation.es(this.VentasConfig.Entity?.Moneda)} ${ConvertToMoneyString(subtotal ?? 0)}</span>
            </label>
            <label class="value-container">
                <span>Descuento:</span>
                <span class="value">${WOrtograficValidation.es(this.VentasConfig.Entity?.Moneda)} ${ConvertToMoneyString(descuento ?? 0)}</span>
            </label>
            <label class="value-container">
                <span>Iva:</span>
                <span class="value">${WOrtograficValidation.es(this.VentasConfig.Entity?.Moneda)} ${ConvertToMoneyString(iva ?? 0)}</span>
            </label>
            <hr/>
            <label class="value-container total">
                <span>Total:</span>
                <span class="value">${WOrtograficValidation.es(this.VentasConfig.Entity?.Moneda)} ${ConvertToMoneyString(total ?? 0)} </span>
            </label>
        </div>`
        );
    }
    BuildCompraModel() {
        const ventasModel = new Tbl_Factura_ModelComponent();
        /**analisa EditObject.Detalle_Factura y el elmento Lote de cada detalle factura y detecta si los lotes (id_lote) estan repetidos analisa si la cantidad_existente del primer lote encontrado es suficiente para la sumatoria de la cantidad de cada detalle, si no es asi retorna false, si es asi fusionalos en un solo detalle, seleccionado el primer lote como lote seleccionado */
        ventasModel.Detalle_Factura.action =(/**@type {Tbl_Factura} */ EditObject, form, control) => {
            if (!EditObject.Detalle_Factura || !Array.isArray(EditObject.Detalle_Factura)) {
                console.error("Detalle_Factura no está definido o no es un array.");
                return false;
            }        
            // Crear un mapa para agrupar detalles por id_lote
            /**@type {Array<Detalle_Factura>} */
            const lotesMap = [];
        
            for (const detalle of EditObject.Detalle_Factura) {
                const loteFusionado = lotesMap.find(det => det.Lote.Id_Lote == detalle.Lote.Id_Lote)
                if (loteFusionado) {
                    continue;
                }
                const detalles = EditObject.Detalle_Factura.filter(det => det.Lote.Id_Lote = detalle.Lote.Id_Lote);
                const cantidadTotal = WArrayF.SumValAtt(detalles, "Cantidad");
                if (cantidadTotal > detalle.Lote.Cantidad_Existente ) {
                    this.append(ModalMessege("El lote seleccionado, supera la cantidad existente"))
                    return false;
                }
                if (!loteFusionado) {
                    const subtotal = WArrayF.SumValAtt(detalles, "Sub_Total");
                    const totalDescuento = subtotal * detalle.Descuento;
                    const totalIva = (subtotal - totalDescuento) * 0.15;
                    lotesMap.push(new Detalle_Factura({
                        Lote: detalle.Lote,
                        Cantidad: cantidadTotal,
                        Sub_Total: subtotal,
                        Descuento: detalle.Descuento,
                        Monto_Descuento: totalDescuento,
                        Iva: totalIva,
                        Total: subtotal - totalDescuento - totalIva
                    }))
                }
            }
            EditObject.Detalle_Factura.length = 0;
            EditObject.Detalle_Factura.push(...lotesMap);
            // Calcular los totales actualizados
            const subtotal = WArrayF.SumValAtt(EditObject.Detalle_Factura, "Sub_Total");
            const descuento = WArrayF.SumValAtt(EditObject.Detalle_Factura, "Monto_Descuento");
            const iva = WArrayF.SumValAtt(EditObject.Detalle_Factura, "Iva");
            const total = WArrayF.SumValAtt(EditObject.Detalle_Factura, "Total");
            EditObject.Sub_Total = subtotal;
            EditObject.Descuento = descuento;
            EditObject.Iva = iva;
            EditObject.Total = total;
        
            this.TotalesDetailUpdate(subtotal ?? 0, iva ?? 0, total ?? 0, descuento ?? 0);
        
            return true;
        }
        
        return ventasModel;
    }

    CustomStyle = css`
        .compras-container{
            padding: 20px;
            display: grid;
            grid-template-columns:  calc(100% - 320px) 300px;
            gap: 20px;
        }
        hr {
            width: 100%;
        }
        .resumen-container, w-form {
            box-shadow: 0 0 5px 0 #999;
            padding: 20px;
            border-radius: 5px;
        }
        .resumen-container .detail-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .detail-container h3 {
            color: #4894aa;
            margin: 10px 0px;
        }
        .value{
            text-align: right;
        }
        .value-container {
            display: grid;
            grid-template-columns: 50% 50%;
        }
        .total {
            font-weight: 700;
        }
        #comprasForm, .multiSelectEstadosArticulos,#ComprasForm {
            grid-column: span 2;
        }
        .beneficios-detail h4 {
            margin: 0px 10px 10px 10px;
        }
        .beneficios-detail {
            padding: 15px;
            border-radius: 10px;
            border: solid 1px #999;
            overflow: hidden;
            max-height:15px;
            transition: all 0.7s;
            cursor: pointer;
        }
        .beneficios-detail:hover {
            max-height:1500px;
        }
        .column-venta{
            display: grid;
            grid-template-columns: 47% 47%;
            gap: 10px;
            margin-bottom: 5px;
            font-size: 12px;
        }
        .column-venta label{
        grid-column: span 2;
        }
        .column-venta span{
        text-align: right;
        font-weight: bold;
        border-bottom: solid 1px #d4d4d4;
        }
        #comprasTable,
        #detalleComprasTable,
        .TabContainerTables,
        .nav-header,
        .selected-client{
            grid-column: span 3;
        }
        .nav-header {
            display: flex;
            width: 100%;
            justify-content: space-between;
            font-size: 14px;
            font-weight: bold;
            color: var(--font-secundary-color)
        }        
        .OptionContainer{
            display: flex;
        } w-filter-option {
            grid-column: span 2;
        }w-main-compras {
            display: block;
            width: 98%;
        }
        @media (max-width: 900px){
            .compras-container{
                grid-template-columns:  100%;
            }
        }
    `
}
customElements.define('w-main-ventas-component', VentasComponent);
export { VentasComponent };