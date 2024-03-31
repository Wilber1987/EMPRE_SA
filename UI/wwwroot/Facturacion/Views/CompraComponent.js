//@ts-check
// @ts-ignore
import { ComponentsManager, html, WArrayF, WRender } from "../../WDevCore/WModules/WComponentsTools.js";
// @ts-ignore
import { WTableComponent } from "../../WDevCore/WComponents/WTableComponent.js";
// @ts-ignore
import { WAppNavigator } from "../../WDevCore/WComponents/WAppNavigator.js";
import { ModalMessege, ModalVericateAction, WForm } from "../../WDevCore/WComponents/WForm.js";
import { css } from "../../WDevCore/WModules/WStyledRender.js";
import { Detalle_Compra } from "../FrontModel/Detalle_Compra.js";
import { Tbl_Compra_ModelComponent } from "../FrontModel/ModelComponent/Tbl_Compra_ModelComponent.js";
import { Tbl_Compra } from "../FrontModel/Tbl_Compra.js";
// @ts-ignore
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";

/**
 * @typedef {Object} ComprasConfig
 * * @property {Tbl_Compra} [Entity]
 * * @property {Object} [TasaCambio]
 * * @property {Number} [IvaPercent]
 * * @property {Boolean} [WithTemplate]
 * * @property {Function} [action]
 * * @property {ModelProperty} [DatosCompra]
 * * @property {ModelProperty} [DatosProveedor]
 */

class ComprasComponent extends HTMLElement {
    /**
     * @param {ComprasConfig} ComprasConfig
     */
    constructor(ComprasConfig) {
        super();
        this.ComprasConfig = ComprasConfig ?? {};
        this.OptionContainer = WRender.Create({ className: "OptionContainer" });
        this.TabContainer = WRender.Create({ className: "TabContainer", id: 'TabContainer' });
        this.CompraContainer = WRender.Create({ className: "valoraciones-container" });
        this.append(this.CustomStyle, this.OptionContainer, this.TabContainer);
        this.indexFactura = 0;
        this.valoresObject = {
            subtotal: 0,
            iva: 0,
        }
        this.IvaPercent = this.ComprasConfig.IvaPercent ?? 0.15;
        this.setComprasContainer();
        this.TasaCambio = this.ComprasConfig.TasaCambio ?? 36.95;
        this.Draw();

    }
    async setComprasContainer() {
        //const tasa = await new Catalogo_Cambio_Divisa_ModelComponent().Get();      
        this.TotalesDetail = WRender.Create({ tagName: "div", className: "resumen-container" });
        this.BuildCompraModel()
        this.ComprasForm = new WForm({
            ModelObject: this.ComprasModel,
            AutoSave: false,
            EditObject: this.ComprasConfig.Entity,
            //Options: false,
            // @ts-ignore
            SaveFunction: async (/**@type {Tbl_Compra} */ compra) => {
                if (!this.ComprasForm?.Validate()) {
                    this.append(ModalMessege("Agregue datos para poder continuar"));
                    return;
                }
                const response = await new Tbl_Compra(compra).Save();
                if (response.status == 200) {
                    if (this.ComprasConfig?.action != undefined) {
                        this.append(ModalVericateAction(async () => {
                            // @ts-ignore
                            this.ComprasConfig?.action(compra);
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
     */
    TotalesDetailUpdate(subtotal, iva, total) {
        // @ts-ignore
        this.TotalesDetail.innerHTML = "";
        this.TotalesDetail?.append(html`<div class="detail-container">
            <label class="value-container">
                Sub Total:
                <span>C$ ${subtotal}</span>
            </label>
            <label class="value-container">
                Iva :
                <span>C$ ${iva}</span>
            </label>
            <label class="value-container">
                Total:
                <span>C$ ${total} </span>
            </label>
        </div>`
        );
    }

    Draw = async () => {
        this.append(this.CompraContainer)
    }//end draw

    BuildCompraModel = () => {
        this.ComprasModel = new Tbl_Compra_ModelComponent();
        this.ComprasModel.Tasa_Cambio.defaultValue = this.TasaCambio;
        this.ComprasModel.Detalle_Compra.ModelObject = this.ComprasModel.Detalle_Compra.ModelObject();
        if (this.ComprasConfig.WithTemplate) {
            this.ComprasModel.Cat_Proveedor.Dataset = [this.ComprasConfig.Entity?.Cat_Proveedor];
            this.ComprasModel.Detalle_Compra.ModelObject.Cat_Producto.Dataset = this.ComprasConfig.Entity?.Detalle_Compra?.map(d => d.Cat_Producto) ?? [];
        }
        this.ComprasModel.Detalle_Compra.ModelObject.Iva.action = (/**@type {Detalle_Compra} */ detalleCompra) => {
            return detalleCompra.Aplica_Iva ? ((detalleCompra.Cantidad * detalleCompra.Precio_Unitario) * this.IvaPercent).toFixed(3) : 0;
        };

        this.ComprasModel.Detalle_Compra.ModelObject.Total.action = (/**@type {Detalle_Compra} */ detalleCompra) => {
            // @ts-ignore
            return (parseFloat(detalleCompra.Iva) + parseFloat(detalleCompra.SubTotal)).toFixed(3);
        };
        if (this.ComprasConfig.DatosCompra) {
            this.ComprasModel.Datos_Compra = this.ComprasConfig.DatosCompra;
        }

        this.ComprasModel.Sub_Total.action = (/**@type {Tbl_Compra} */ EditObject, form, control) => {
            //console.log(EditObject);
            let subtotal;
            let total;
            let iva;
            if (EditObject.Detalle_Compra != undefined) {
                console.log(EditObject);
                subtotal = WArrayF.SumValAtt(EditObject.Detalle_Compra, "SubTotal");
                iva = WArrayF.SumValAtt(EditObject.Detalle_Compra, "Iva");
                total = WArrayF.SumValAtt(EditObject.Detalle_Compra, "Total");
            }
            this.TotalesDetailUpdate(subtotal ?? 0, iva ?? 0, total ?? 0);
        }
        return this.ComprasModel;
    }
    //this.contratosForm.append(optionContainer, this.ComprasForm);

    CustomStyle = css`
        .valoraciones-container{
            padding: 20px;
            display: grid;
            grid-template-columns:  calc(100% - 180px) 160px;
            gap: 20px 30px;
        }
        .resumen-container .detail-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        #valoracionesForm, .multiSelectEstadosArticulos,#ComprasForm {
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
        #valoracionesTable,
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
            color: #00238a
        }        
        .OptionContainer{
            display: flex;
        } w-filter-option {
            grid-column: span 2;
        }w-main-compras {
            display: block;
            width: 98%;
        }
    `
}
customElements.define('w-main-compras', ComprasComponent);
export { ComprasComponent };
