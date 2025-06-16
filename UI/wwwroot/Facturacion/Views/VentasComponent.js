//@ts-check
import { Transactional_Configuraciones } from "../../Admin/ADMINISTRATIVE_ACCESSDataBaseModel.js";
import { Catalogo_Cambio_Divisa } from "../../FrontModel/Catalogo_Cambio_Divisa.js";
import { Catalogo_Cambio_Divisa_ModelComponent } from "../../FrontModel/DBODataBaseModel.js";
import { ModalMessage } from "../../WDevCore/WComponents/ModalMessage.js";
import { ModalVericateAction } from "../../WDevCore/WComponents/ModalVericateAction.js";
<<<<<<< HEAD
=======
import { WAlertMessage } from "../../WDevCore/WComponents/WAlertMessage.js";
>>>>>>> main
import { WForm } from "../../WDevCore/WComponents/WForm.js";
import { ComponentsManager, ConvertToMoneyString, html, WRender } from "../../WDevCore/WModules/WComponentsTools.js";
import { WOrtograficValidation } from "../../WDevCore/WModules/WOrtograficValidation.js";
import { css } from "../../WDevCore/WModules/WStyledRender.js";
import { Tbl_Factura_ModelComponent } from "../FrontModel/ModelComponent/Tbl_Factura_ModelComponent.js";
import { Tbl_Factura } from "../FrontModel/Tbl_Factura.js";
<<<<<<< HEAD

/**
 * @typedef {Object} VentasConfig
 * @property {string} someProperty - Description of the property
 * @property {function} [action] - Optional action function
 * @property {Catalogo_Cambio_Divisa}  TasaActual
 * @property {Tbl_Factura} [Entity] - Optional entity object
=======
import { Tbl_Lotes } from "../FrontModel/Tbl_Lotes.js";

/**
 * @typedef {Object} Config
 * @property {function} [saveAction] - Optional para enviar una peticion personalisada a la api
 * @property {function} [action] - Optional action function que se ejecuta despues de la respuesta de la api si es exitosa
 * @property {Catalogo_Cambio_Divisa}  TasaActual
 * @property {Tbl_Factura} [Entity] - Optional entity object
 * @property {Boolean} [IsReturn] - Optional entity object
 * @property {Boolean} [IsActiveCredit] - Optional entity object
 * @property {{ IsDevolucion: boolean, MaxAmount: Number, MinAmount: Number, ArticulosRemplazados: Array,  IsAllArticulosRemplazados: boolean}} [ReturnData]
>>>>>>> main
 */

class VentasComponent extends HTMLElement {
    /**
<<<<<<< HEAD
     * @param {Partial<VentasConfig>} VentasConfig
     */
    constructor(VentasConfig) {
        super();
        this.TasaActual = VentasConfig.TasaActual;
        this.VentasConfig = VentasConfig ?? {};
        this.VentasConfig.Entity = this.VentasConfig.Entity ?? new Tbl_Factura({
=======
     * @param {Partial<Config>} Config
     */
    constructor(Config) {
        super();
        this.TasaActual = Config.TasaActual;
        this.Config = Config ?? {};
        this.Config.Entity = this.Config.Entity ?? new Tbl_Factura({
>>>>>>> main
            Tasa_Cambio: this.TasaActual?.Valor_de_compra,
            Tasa_Cambio_Venta: this.TasaActual?.Valor_de_venta
        });
        this.OptionContainer = WRender.Create({ className: "OptionContainer" });
        this.TabContainer = WRender.Create({ className: "TabContainer", id: 'TabContainer' });
        this.Manager = new ComponentsManager({ MainContainer: this.TabContainer, SPAManage: false });
<<<<<<< HEAD
        this.CompraContainer = WRender.Create({ className: "compras-container" });
=======
        this.CompraContainer = WRender.Create({ className: "Factura-container" });
>>>>>>> main

        //this.navigator = new WAppNavigator({ Inicialize: true, Elements: this.ElementsNav })
        this.append(this.CustomStyle, this.OptionContainer, this.CompraContainer, this.TabContainer);
    }
    connectedCallback() {
        this.CompraContainer.innerHTML = "";
        this.Draw();
    }


    Draw = async () => {
        this.Intereses = await new Transactional_Configuraciones().getConfiguraciones_Intereses();
        this.Configs = await new Transactional_Configuraciones().getConfiguraciones_Beneficios();
        this.TasasCambioList = await new Catalogo_Cambio_Divisa_ModelComponent().Get();
        this.TasasCambio = this.TasasCambioList[0];
<<<<<<< HEAD
        this.setComprasContainer();
    }

    async setComprasContainer() {
        this.TotalesDetail = WRender.Create({ tagName: "div", className: "resumen-container" });
        this.TotalesDetailUpdate(0, 0, 0, 0);
        this.ComprasModel = this.BuildCompraModel()
        this.ComprasForm = new WForm({
            ModelObject: this.ComprasModel,
            AutoSave: false,
            limit: 5,
            EditObject: this.VentasConfig.Entity,
=======
        this.setFacturaContainer();
    }

    async setFacturaContainer() {
        this.TotalesDetail = WRender.Create({ tagName: "div", className: "resumen-container" });
        this.TotalesDetailUpdate(0, 0, 0, 0);
        this.FacturaModel = this.BuildFacturaModel()
        this.FacturaForm = new WForm({
            ModelObject: this.FacturaModel,
            AutoSave: false,
            limit: 5,
            EditObject: this.Config.Entity,
>>>>>>> main
            Groups: [  // Grupos de controles para organizar el formulario
                {
                    Name: "Datos_de_pago",  // Nombre del grupo
                    Propertys: [
                        "Monto_dolares",
                        "Monto_cordobas",
                        "cambio_dolares",
                        "cambio_cordobas",
                        "is_cambio_cordobas"
                    ],  // Propiedades que pertenecen a este grupo
                    WithAcordeon: false  // Si el grupo debe mostrarse como un acordeón
                }, {
                    Name: "Articulos",  // Nombre del grupo
                    Propertys: [
                        "Detalle_Factura",
                    ],  // Propiedades que pertenecen a este grupo
                    WithAcordeon: false  // Si el grupo debe mostrarse como un acordeón
                }
            ],
            //DivColumns: "repeat(5, 20%)",
            //Options: false,
            // @ts-ignore
            SaveFunction: async (/**@type {Tbl_Factura} */ factura) => {
                await this.SaveVenta(factura);
            }
        });
<<<<<<< HEAD
        this.CompraContainer.append(
            this.ComprasForm,
=======

        if (this.Config.ReturnData?.IsDevolucion == true) {
            this.CalculeTotal(this.FacturaForm.FormObject, this.FacturaForm, this.FacturaModel)
        }

        this.CompraContainer.append(
            this.FacturaForm,
>>>>>>> main
            this.TotalesDetail
        );
    }
    async SaveVenta(factura) {
<<<<<<< HEAD
        if (!this.ComprasForm?.Validate()) {
            this.append(ModalMessage("Agregue datos para poder continuar"));
            return;
        }
        this.append(ModalVericateAction(async () => {
            // @ts-ignore
            const response = await new Tbl_Factura(factura).Save();
            if (response.status == 200) {
                if (this.VentasConfig?.action != undefined) {
                    this.append(ModalVericateAction(async () => {
                        // @ts-ignore
                        this.VentasConfig?.action(response.body, response);
=======
        if (!this.FacturaForm?.Validate()) {
            WAlertMessage.Warning("Agregue datos para poder continuar");
            return;
        }
        if (this.Config.IsReturn) {
            if (this.Config.ReturnData?.IsAllArticulosRemplazados == false && (this.Config.ReturnData?.MinAmount ?? 0) > factura.Total) {
                WAlertMessage.Info(`El monto minímo de la factura es de $ ${ConvertToMoneyString(this.Config.ReturnData?.MinAmount)} dólares, 
                    equivalentes a C$ ${ConvertToMoneyString(this.Config.ReturnData?.MinAmount * (this.Config.TasaActual?.Valor_de_compra ?? 1))} córdobas.`);
                return;
            }
        }
        this.append(ModalVericateAction(async () => {

            let response = { status: 400 };
            if (this.Config.saveAction) {
                response = await this.Config.saveAction(new Tbl_Factura(factura));
            } else {
                response = await new Tbl_Factura(factura).Save();
            }
            if (response.status == 200) {
                if (this.Config?.action != undefined) {
                    this.append(ModalVericateAction(async () => {
                        // @ts-ignore
                        this.Config?.action(response.body, response);
>>>>>>> main
                    }, response.message, false));
                } else {
                    this.append(ModalMessage(response.message, undefined, true));
                }
<<<<<<< HEAD
                this.setComprasContainer();
            } else {
                this.append(ModalMessage(response.message));
=======
                this.setFacturaContainer();
            } else {
                WAlertMessage.Danger(response.message);
>>>>>>> main
            }
        }, "¿Desea guardar la venta?"));
    }

    /**
    * @param {Number} subtotal
    * @param {Number} iva
    * @param {Number} total
    * @param {Number} descuento
    */
    TotalesDetailUpdate(subtotal, iva, total, descuento) {
        // @ts-ignore
<<<<<<< HEAD
        this.VentasConfig.Entity.Moneda = this.VentasConfig.Entity?.Moneda ?? "CORDOBAS"
=======
        this.Config.Entity.Moneda = this.Config.Entity?.Moneda ?? "CORDOBAS"
>>>>>>> main
        // @ts-ignore                
        this.TotalesDetail.innerHTML = "";
        this.TotalesDetail?.append(html`<div class="detail-container">
            <h3>DATOS DE CONTADO</h3>
            <hr/>
            <label class="value-container">
                <span>Sub Total:</span>
<<<<<<< HEAD
                <span class="value">${WOrtograficValidation.es(this.VentasConfig.Entity?.Moneda)} ${ConvertToMoneyString(subtotal ?? 0)}</span>
            </label>
            <label class="value-container">
                <span>Descuento:</span>
                <span class="value">${WOrtograficValidation.es(this.VentasConfig.Entity?.Moneda)} ${ConvertToMoneyString(descuento ?? 0)}</span>
            </label>
            <!-- <label class="value-container">
                <span>Iva:</span>
                <span class="value">${WOrtograficValidation.es(this.VentasConfig.Entity?.Moneda)} ${ConvertToMoneyString(iva ?? 0)}</span>
=======
                <span class="value">${WOrtograficValidation.es(this.Config.Entity?.Moneda)} ${ConvertToMoneyString(subtotal ?? 0)}</span>
            </label>
            <label class="value-container">
                <span>Descuento:</span>
                <span class="value">${WOrtograficValidation.es(this.Config.Entity?.Moneda)} ${ConvertToMoneyString(descuento ?? 0)}</span>
            </label>
            <!-- <label class="value-container">
                <span>Iva:</span>
                <span class="value">${WOrtograficValidation.es(this.Config.Entity?.Moneda)} ${ConvertToMoneyString(iva ?? 0)}</span>
>>>>>>> main
            </label> -->
            <hr/>
            <label class="value-container total">
                <span>Total:</span>
<<<<<<< HEAD
                <span class="value">${WOrtograficValidation.es(this.VentasConfig.Entity?.Moneda)} ${ConvertToMoneyString(total ?? 0)} </span>
            </label>
            <hr/>
        </div>`);
        if (["APARTADO_MENSUAL", "APARTADO_QUINCENAL"].includes(this.VentasConfig.Entity?.Tipo ?? "VENTA")) {
=======
                <span class="value">${WOrtograficValidation.es(this.Config.Entity?.Moneda)} ${ConvertToMoneyString(total ?? 0)} </span>
            </label>
            <hr/>
        </div>`);
        if (["APARTADO_MENSUAL", "APARTADO_QUINCENAL"].includes(this.Config.Entity?.Tipo ?? "VENTA")) {
>>>>>>> main
            this.TotalesDetail?.append(html`<div class="detail-container">       
                <h3>DATOS DE FINANCIAMIENTO</h3>
                <hr/>
                <label class="value-container">
                    <span>Plazo:</span>
<<<<<<< HEAD
                    <span class="value">${ConvertToMoneyString(this.VentasConfig.Entity?.Datos_Financiamiento?.Plazo ?? 0)}</span>
                </label>
                <label class="value-container">
                    <span>Cuota Fija $:</span>
                    <span class="value"> ${ConvertToMoneyString(this.VentasConfig.Entity?.Datos_Financiamiento?.Cuota_Fija_Dolares ?? 0)}</span>
                </label>
                <label class="value-container">
                    <span>Cuota Fija C$:</span>
                    <span class="value"> ${ConvertToMoneyString(this.VentasConfig.Entity?.Datos_Financiamiento?.Cuota_Fija_Cordobas ?? 0)}</span>
=======
                    <span class="value">${this.Config.Entity?.Datos_Financiamiento?.Plazo ?? 1}</span>
                </label>
                <label class="value-container">
                    <span>Cuota Fija $:</span>
                    <span class="value"> ${ConvertToMoneyString(this.Config.Entity?.Datos_Financiamiento?.Cuota_Fija_Dolares ?? 0)}</span>
                </label>
                <label class="value-container">
                    <span>Cuota Fija C$:</span>
                    <span class="value"> ${ConvertToMoneyString(this.Config.Entity?.Datos_Financiamiento?.Cuota_Fija_Cordobas ?? 0)}</span>
>>>>>>> main
                </label>                
                <hr/>
            </div>`);
        }
<<<<<<< HEAD
    }
    BuildCompraModel() {
=======
        if (this.Config.IsReturn && this.Config.ReturnData?.IsAllArticulosRemplazados == false) {
            this.TotalesDetail?.append(html`<div class="detail-container">       
                <h3>DATOS DE ANULACIÓN DE ACTA DE ENTREGA</h3>
                <hr/>
                <label class="value-container">
                    <span>Monto disponible C$:</span>
                    <span class="value">${ConvertToMoneyString((this.Config.ReturnData?.MinAmount ?? 1) * (this.Config.TasaActual?.Valor_de_compra ?? 1))}</span>
                </label>
                <label class="value-container">
                    <span>Monto disponible $:</span>
                    <span class="value">${ConvertToMoneyString(this.Config.ReturnData?.MinAmount ?? 1)}</span>
                </label>                              
                <hr/>
            </div>`);
        }
    }
    BuildFacturaModel() {
>>>>>>> main
        sessionStorage.setItem("Intereses", JSON.stringify(this.Intereses));
        sessionStorage.setItem("TasasCambio", JSON.stringify(this.TasasCambio));
        sessionStorage.setItem("Configs", JSON.stringify(this.Configs));
        const ventasModel = new Tbl_Factura_ModelComponent();
        /**analisa EditObject.Detalle_Factura y el elmento Lote de cada detalle factura y detecta si los lotes (id_lote) estan repetidos analisa si la cantidad_existente del primer lote encontrado es suficiente para la sumatoria de la cantidad de cada detalle, si no es asi retorna false, si es asi fusionalos en un solo detalle, seleccionado el primer lote como lote seleccionado */
<<<<<<< HEAD
        ventasModel.Detalle_Factura.action = (/**@type {Tbl_Factura} */ EditObject, form, control) => { this.CalculeTotal(EditObject, form, ventasModel) }
=======
        ventasModel.Detalle_Factura.action = (/**@type {Tbl_Factura} */ EditObject, form, control) => {
            this.CalculeTotal(EditObject, form, ventasModel)
        }
>>>>>>> main
        ventasModel.Tipo.action = (/**@type {Tbl_Factura} */ EditObject, form, control) => {
            ventasModel.TypeAction(EditObject, form);
            this.CalculeTotal(EditObject, form, ventasModel)
        }
<<<<<<< HEAD
=======

        if (this.Config.IsActiveCredit == false) {
            ventasModel.Tipo.Dataset = ["VENTA"];
        }
        if (this.Config.ReturnData?.IsDevolucion == true) {
            ventasModel.Cliente.hidden = true;
            if (this.Config.ReturnData?.IsAllArticulosRemplazados == true) {
                ventasModel.Detalle_Factura.Options = {}
                ventasModel.Monto_dolares.hidden = true;
                ventasModel.Monto_cordobas.hidden = true;
                ventasModel.cambio_dolares.hidden = true;
                ventasModel.cambio_cordobas.hidden = true;
                ventasModel.is_cambio_cordobas.hidden = true;
            }
        }



>>>>>>> main
        return ventasModel;
    }
    /**
     * @param {Tbl_Factura} EditObject
     * @param {WForm} form
     * @param {Tbl_Factura_ModelComponent} ventasModel
     */
    CalculeTotal = (EditObject, form, ventasModel) => {
        try {
            //ventasModel.TypeAction(EditObject, form);
            //** @type {Tbl_Factura} */
            const response = ventasModel.CalculeTotal(EditObject, form);
            this.TotalesDetailUpdate(EditObject.Sub_Total ?? 0, EditObject.Iva ?? 0, EditObject.Total ?? 0, EditObject.Descuento ?? 0);
            //form.DrawComponent();
        } catch (error) {
            console.error(error);
<<<<<<< HEAD
            this.append(ModalMessage(error))
=======
            WAlertMessage.Danger(error);
>>>>>>> main
        }
    }

    CustomStyle = css`
<<<<<<< HEAD
        .compras-container{
=======
        .Factura-container{
>>>>>>> main
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
<<<<<<< HEAD
        #comprasForm, .multiSelectEstadosArticulos,#ComprasForm {
=======
        #FacturaForm, .multiSelectEstadosArticulos,#FacturaForm {
>>>>>>> main
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
<<<<<<< HEAD
        #comprasTable,
        #detalleComprasTable,
=======
        #FacturaTable,
        #detalleFacturaTable,
>>>>>>> main
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
<<<<<<< HEAD
        }w-main-compras {
=======
        }w-main-Factura {
>>>>>>> main
            display: block;
            width: 98%;
        }
        @media (max-width: 900px){
<<<<<<< HEAD
            .compras-container{
=======
            .Factura-container{
>>>>>>> main
                grid-template-columns:  100%;
            }
        }
    `
}
customElements.define('w-main-ventas-component', VentasComponent);
export { VentasComponent };
