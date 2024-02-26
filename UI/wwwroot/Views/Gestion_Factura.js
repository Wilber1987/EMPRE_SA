//@ts-check
// @ts-ignore
import { WRender, ComponentsManager, WAjaxTools, WArrayF, html } from "../WDevCore/WModules/WComponentsTools.js";
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

/**
 * @typedef {Object} facturaconfig
 * * @property {Tbl_Compra} [Entity]
 */

class MainFactura extends HTMLElement {
    constructor(factura) {
        super();
        // AmoritizationModule.calculoAmortizacion(factura);     
        // if (factura.Transaction_Contratos != null) {            
        //     this.ElementsNav.unshift({
        //         name: "Contrato valorado", action: () => this.Manager.NavigateFunction("contrato-valorado", new Gestion_FacturacionView({ Entity: contrato }))
        //     });
        // }
        //this.componentsModel = new Transaction_Contratos_ModelComponent();
        this.OptionContainer = WRender.Create({ className: "OptionContainer" });
        this.TabContainer = WRender.Create({ className: "TabContainer", id: 'TabContainer' });
        this.Manager = new ComponentsManager({ MainContainer: this.TabContainer, SPAManage: false });
        this.valoracionesContainer = WRender.Create({ className: "valoraciones-container" });
        this.navigator = new WAppNavigator({ Inicialize: true, Elements: this.ElementsNav })
        this.append(this.CustomStyle, this.OptionContainer, this.navigator, this.TabContainer);
        this.indexContract = 0;
        this.DrawComponent();        
        this.buildTotalesModel(36.62 /*factura.tasa_cambio*/);
        this.valoresObject = {
            subtotal: 0,
            iva: 0,
        }
       
    }

    
    buildTotalesModel(tasasCambio) {        
        this.valoresModel = {
            subtotal: {
                type: "number", label: "Subtotal - C$:", action: () => {
                    this.valoresObject.dolares_1 = this.valoresObject.subtotal / tasasCambio[0].valor_de_venta;
                    /** @type {HTMLInputElement|undefined|null} */
                    const control = this.valoresForm?.shadowRoot?.querySelector(".dolares_1");
                    if (control != undefined || control != null) {
                        control.value = this.valoresObject.dolares_1.toString();
                    }
                    //this.promediarValoresDolares(this.valoresObject);
                    this.promediarValoresCordobas(this.valoresObject);
                    //this.beneficiosDetailUpdate();
                    //this.multiSelectEstadosArticulos?.SetOperationValues()
                }
            },
            
            iva: {
                type: "number", label: "Iva - C$:", action: () => {
                    this.valoresObject.dolares_2 = this.valoresObject.iva / tasasCambio[0].valor_de_venta;
                    /** @type {HTMLInputElement|undefined|null} */
                    const control = this.valoresForm?.shadowRoot?.querySelector(".dolares_2");
                    if (control != undefined || control != null) {
                        control.value = this.valoresObject.dolares_2.toString();
                    }
                    //this.promediarValoresDolares(this.valoresObject);
                    this.promediarValoresCordobas(this.valoresObject);
                    //this.beneficiosDetailUpdate();
                    //this.multiSelectEstadosArticulos?.SetOperationValues()
                }
            },
            total_cordobas: {
                type: "text", label: "Total - C$", disabled: true, action: (data) => {
                    //return this.promediarValoresCordobas(data)
                }
            }/*, total_dolares: {
                type: "text", label: "$:", disabled: true, action: (data) => {
                    //return this.promediarValoresDolares(data)
                }
            }*/
        };
    }

    promediarValoresCordobas(data) {
        data.total_cordobas = ((parseFloat(data.subtotal) + parseFloat(data.iva))).toFixed(3);
        const control = this.valoresForm?.shadowRoot?.querySelector(".total_cordobas");
        if (control != undefined || control != null) {
            // @ts-ignore
            control.value = data.total_cordobas.toString();
        }
        return data.total_cordobas;
    }

    ElementsNav = [
        {
            name: "Facturas Proveedor", action: () => {
                this.Manager.NavigateFunction("facturas", new WTableComponent({
                    ModelObject: new Tbl_Compra_ModelComponent, EntityModel: new Tbl_Compra,
                    Options: { Search: false, Filter: true, Add: false, Edit: false }
                }))
            }
        }, {
            name: "Nueva Factura Proveedor", action: () => {
                this.Manager.NavigateFunction("newFactura", new WForm({ ModelObject: new Tbl_Compra_ModelComponent({Tasa_Cambio: 36}), EntityModel: new Tbl_Compra }))
                this.indexContract++;
            }
        }
    ]
    
    DrawComponent = async () => {        
        this.valoresForm = new WForm({
            EditObject: this.valoresObject,
            ModelObject: this.valoresModel,
            Options: false,
            DivColumns: "calc(100% - 160px) 150px",
            // @ts-ignore
            ProxyAction: (/**@type {WForm} */ factura) => {
                //this.valoracionesForm?.SetOperationValues();
            }, CustomStyle: css`
                .ModalElement {
                    display: grid;
                    grid-template-columns: auto 120px;
                    align-items: center;
                } .ModalElement label {
                    display: block;
                    width: 100%;
                    margin: 0px;
                } input {
                    min-width: 120px;
                }`
        });

        this.append(
            this.valoresForm
        );

        if (this.valoresForm != undefined) {            
            this.valoresForm.DrawComponent();
        }
        
    }
    CustomStyle = css``
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
})