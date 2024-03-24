//@ts-check
// @ts-ignore
import { WRender, ComponentsManager, WAjaxTools, WArrayF, html, type } from "../WDevCore/WModules/WComponentsTools.js";
import { StylesControlsV2, StylesControlsV3, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
// @ts-ignore
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
//import {  Catalogo_Cambio_Dolar, Catalogo_Clientes,  Detail_Prendas_Vehiculos_ModelComponent, Transaction_Contratos_ModelComponent } from "../FrontModel/DBODataBaseModel.js"
//import {  Detalle_Factura, Tbl_Factura, Detail_Factura_ModelComponent, Cat_Proveedor  } from "../FrontModel/FacturacionModel.js"
// @ts-ignore
import { WFilterOptions } from "../WDevCore/WComponents/WFilterControls.js";
import { Detail_Prendas, Detail_Prendas_Vehiculos, Transaction_Contratos, ValoracionesTransaction } from "../FrontModel/Model.js";
import { css } from "../WDevCore/WModules/WStyledRender.js";
import { ValoracionesSearch, clientSearcher, contratosSearcher } from "../modules/SerchersModules.js";
import { ModalMessege, ModalVericateAction, WForm } from "../WDevCore/WComponents/WForm.js";
import { AmoritizationModule } from "../modules/AmortizacionModule.js";
import { WAppNavigator } from "../WDevCore/WComponents/WAppNavigator.js";
import { WModalForm } from "../WDevCore/WComponents/WModalForm.js";
import { Transactional_Configuraciones } from "../FrontModel/ADMINISTRATIVE_ACCESSDataBaseModel.js";
import { Tbl_Compra } from "../Facturacion/FrontModel/Tbl_Compra.js";
import { Tbl_Compra_ModelComponent } from "../Facturacion/FrontModel/ModelComponent/Tbl_Compra_ModelComponent.js";
import { Catalogo_Cambio_Dolar_ModelComponent, Transactional_Valoracion } from "../FrontModel/DBODataBaseModel.js";
import { Detalle_Compra } from "../Facturacion/FrontModel/Detalle_Compra.js";

/**
 * @typedef {Object} facturaconfig
 * * @property {Tbl_Compra} [Entity]
 */

class MainFactura extends HTMLElement {
    constructor(factura) {
        super();
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
        this.ivaPercent = this.ivaPercent ?? 0.15;//todo recibir del constructor

        this.setComprasContainer();

    }



    async setComprasContainer() {
        const tasa = await new Catalogo_Cambio_Dolar_ModelComponent().Get();
        this.valoracionesContainer = WRender.Create({ className: "valoraciones-container" });
        this.totalesDetail = WRender.Create({ tagName: "div", className: "resumen-container" });
        this.BuildCompraModel(tasa)
        this.facturaForm = new WForm({
            ModelObject: this.ComprasModel, //new Tbl_Compra_ModelComponent(),
            AutoSave: false,
            //Options: false,
            // @ts-ignore
            SaveFunction: async (/**@type {Tbl_Compra} */ valoracion) => {

                console.log(valoracion);
                if (!this.facturaForm?.Validate()) {
                    this.append(ModalMessege("Agregue datos para poder continuar"));
                    return;
                }
                const response = await new Tbl_Compra(this.facturaForm?.FormObject).Save();

                this.append(ModalMessege(response.message));
                return;
            }
        });


        this.valoracionesContainer.append(
            this.facturaForm,
            this.totalesDetail
        );
    }

    totalesDetailUpdate(subtotal, iva, total) {
        // @ts-ignore
        this.totalesDetail.innerHTML = "";
        const detail = this.facturaForm?.FormObject;
        // @ts-ignore
        //this.valoracionesForm.FormObject.precio_venta_empeño_cordobas = (precio_venta_empeño);

        // @ts-ignore
        this.totalesDetail?.append(html`<div class="detail-container"> 
        <div>
            <label class="value-container">
                Sub Total: 
                <span>${subtotal} C$</span>
            </label>
            <label class="value-container">
                Iva : 
                <span>${iva} C$</span>
            </label>
            <label class="value-container">
                Total: 
                <span>${total} C$</span>
            </label>            
        </div>       
    </div>`);
        /*this.multiSelectEstadosArticulos?.SetOperationValues();
        this.multiSelectEstadosArticulos?.DrawTable();*/
    }

    ElementsNav = [
        {
            name: "Facturas Proveedor", action: () => {
                this.Manager.NavigateFunction("facturas", new WTableComponent({
                    ModelObject: new Tbl_Compra_ModelComponent, EntityModel: new Tbl_Compra,
                    Options: {
                        Search: false, Filter: true, Add: false, Edit: false,
                        UserActions: [{
                            name: "Anular",
                            action: async (/**@type {Tbl_Compra}*/compra) => {
                                this.append(ModalVericateAction(async () => {
                                    const response = await compra.Anular();
                                    // @ts-ignore
                                    this.append(ModalMessege(response.message));

                                    //modal.close();
                                }, "¿Esta seguro que desea anular esta compra?"))
                            }
                        }]
                    }
                }))
            }
        }, {
            name: "Nueva Factura Proveedor", action: () => {
                this.Manager.NavigateFunction("newFactura", this.valoracionesContainer);
                //new WForm({ ModelObject: this.ComprasModel, EntityModel: new Tbl_Compra }))
                this.indexFactura++;
            }
        }
    ]

    Draw = async () => {
    }//end draw

    BuildCompraModel(tasa) {
        this.ComprasModel = new Tbl_Compra_ModelComponent();
        //this.ComprasModel.Tasa_Cambio = tasa[0].valor_de_compra.toFixed(3);
        this.ComprasModel.Tasa_Cambio.defaultValue = tasa[0].valor_de_compra.toFixed(3);
        this.ComprasModel.Detalle_Compra.ModelObject = this.ComprasModel.Detalle_Compra.ModelObject();
        this.ComprasModel.Detalle_Compra.ModelObject.Iva.action = (/**@type {Detalle_Compra} */ cuota) => {            
            return  cuota.Aplica_Iva ? ((cuota.Cantidad * cuota.Precio_Unitario) * this.ivaPercent).toFixed(3) : 0;
        };

        this.ComprasModel.Detalle_Compra.ModelObject.Total.action = (/**@type {Detalle_Compra} */ cuota) => {         
            return  (parseFloat(cuota.Iva) + parseFloat(cuota.SubTotal)).toFixed(3);
        };

        this.ComprasModel.Sub_Total.action = (/**@type {Tbl_Compra} */ EditObject, form, control) => {
            //console.log(EditObject);
            let subtotal;
            let total;
            let iva;
            if (EditObject.Detalle_Compra != undefined) {
                subtotal = WArrayF.SumValAtt(EditObject.Detalle_Compra, "SubTotal");                
                iva = WArrayF.SumValAtt(EditObject.Detalle_Compra, "Iva");
                total = WArrayF.SumValAtt(EditObject.Detalle_Compra, "Total");
            }
            this.totalesDetailUpdate(subtotal ?? 0, iva ?? 0, total ?? 0);
        }

        return this.ComprasModel;
    }
    //this.contratosForm.append(optionContainer, this.facturaForm);

    CustomStyle = css`
    .valoraciones-container{
        padding: 20px;
        display: grid;
        grid-template-columns: 400px calc(100% - 730px) 300px;
        gap: 20px 30px;
    }
    #valoracionesForm, .multiSelectEstadosArticulos,#facturaForm {
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
    #cuotasTable,
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
    }
`
}
customElements.define('w-main-contract', MainFactura);
export { MainFactura }

window.addEventListener('load', async () => {
    //const contrato = await new Tbl_Compra().Get();
    //await new ValoracionesTransaction().GetValoracionContrato(); getTbl_Factura
    //console.log(contrato)
    // @ts-ignore
    //
    MainBody.append(new MainFactura())
    //MainBody.append(new MainFactura(testData))
});