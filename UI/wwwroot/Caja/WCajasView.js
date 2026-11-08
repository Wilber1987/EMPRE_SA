//@ts-check
import { Catalogo_Cuentas } from "../FrontModel/Catalogo_Cuentas.js";
import { StylesControlsV2, StylesControlsV3, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js";
import { WAppNavigator } from "../WDevCore/WComponents/WAppNavigator.js";
import { WModalForm } from "../WDevCore/WComponents/WModalForm.js";
import { FilterData, OrderData } from "../WDevCore/WModules/CommonModel.js";
import { ComponentsManager, html, WRender } from "../WDevCore/WModules/WComponentsTools.js";
import { css } from "../WDevCore/WModules/WStyledRender.js";
import { Denominacion_Catalogo } from "./Model/Denominacion_Catalogo.js";
import { Inventario_Denominacion_Caja } from "./Model/Inventario_Denominacion_Caja.js";
import { MonedaEnum, Orden_Movimiento, TipoMovimiento } from "./Model/Order_Movimiento.js";
import { WCashRegisterControl } from "./WCashRegisterControl.js";
import { WOrderProcessorComponent } from "./WOrderProcessorComponent.js";
import { WTransactionProcessor } from "./WTransactionProcessor.js";


/**
 * @typedef {Object} WCajasViewConfig
 * * @property {Object} [propierty]
 */
export class WCajasView extends HTMLElement {
    /**
     * 
     * @param {WCajasViewConfig} [Config] 
     */
    constructor(Config) {
        super();
        this.attachShadow({ mode: 'open' });
        this.Config = Config
        this.ComponentsTitle = undefined;
        this.OptionContainer = WRender.Create({ className: "OptionContainer" });
        this.TabContainer = WRender.Create({ className: "TabContainer", id: 'TabContainer' });
        this.Manager = new ComponentsManager({ MainContainer: this.TabContainer, SPAManage: false });
        this.AppNavigator = new WAppNavigator({
            NavStyle: "tab",
            NavTitle: this.ComponentsTitle,
            Inicialize: true
        })
        this.shadowRoot?.append(this.CustomStyle);
        this.shadowRoot?.append(
            StylesControlsV2.cloneNode(true),
            StyleScrolls.cloneNode(true),
            StylesControlsV3.cloneNode(true)
        );
        this.Draw();
    }
    Draw = async () => {
        /**@type {Array<Catalogo_Cuentas>} */
        const cuentas = await new Catalogo_Cuentas().GetOwCuentasCaja();

        /**@type {Array<Denominacion_Catalogo>} */
        this.denoms = await new Denominacion_Catalogo({ OrderData: [OrderData.Desc("valor")] }).Get();


        this.AppNavigator.Elements = this.SetOption(cuentas, this.denoms);
        this.AppNavigator.DrawAppNavigator()
        this.shadowRoot?.append(this.AppNavigator)
    }


    /**
     * @param {Catalogo_Cuentas[]} cuentas
     *  @param {Denominacion_Catalogo[]} denoms
     */
    SetOption(cuentas, denoms) {
        /**@type {Array<Object.<string,any>>} */
        const element = [{
            name: "transacciones", action: async () => {
                return await this.MainComponent()
            }
        }]
        const cuentasElements = cuentas.map(cuenta => ({
            name: cuenta.nombre ?? "",
            action: async () => this.CashRegisterControl(cuenta, denoms)
        }))
        element.push(...cuentasElements)
        element.push({
            name: "Nuevo Recibo", action: async () => {
                window.location.href = "/PagesViews/Gestion_Recibos"
            }
        }, {
            name: "Cambio de moneda", action: async () => {
                return await this.CambioMoneda()
            }
        })
        return element
    }
    CambioMoneda() {
        return html`<div class="cambio-monedas">
            <button class="Btn" onclick="${() => this.CambioMonedaView(MonedaEnum.DOLARES, MonedaEnum.CORDOBAS)}">COMPRA DE USD</button>
            <button class="Btn" onclick="${() => this.CambioMonedaView(MonedaEnum.CORDOBAS, MonedaEnum.DOLARES)}">VENTA DE USD</button>
            <!-- <button class="Btn" onclick="${() => this.CambioMonedaView(MonedaEnum.CORDOBAS, MonedaEnum.CORDOBAS)}">NIO - NIO</button>
            <button class="Btn" onclick="${() => this.CambioMonedaView(MonedaEnum.DOLARES, MonedaEnum.DOLARES)}">USD - USD</button> -->
        </div>`;
    }
    /**
     * @param {string} MONEDA_ENTRADA
     * @param {string} MONEDA_SALIDA
     */
    CambioMonedaView(MONEDA_ENTRADA, MONEDA_SALIDA) {
        const liquidationModeDescripcion = MONEDA_ENTRADA == MonedaEnum.DOLARES && MONEDA_SALIDA == MonedaEnum.CORDOBAS
            ? "Compra de Dolares" : "Venta de Dolares";
        const existMC = MONEDA_ENTRADA != MONEDA_ENTRADA;

        const order = new Orden_Movimiento({           
            tipo_documento_origen: "CAMBIO_MONEDA",
            descripcion: existMC ? liquidationModeDescripcion : `Cambio de ${MONEDA_ENTRADA} a ${MONEDA_SALIDA}`,
            direccion: "MIXED",
            concepto: existMC ?  liquidationModeDescripcion : `Cambio de ${MONEDA_ENTRADA} a ${MONEDA_SALIDA}`,
            //monto: 40,
            //tasa_cambio: 37.07,
            //tasa_cambio_compra: null,
            moneda: MONEDA_ENTRADA,           
            Tipo_Movimiento: TipoMovimiento.CAMBIO_MONEDA,           
            requiere_aprobacion: false
        })

        const orderProcessor = new WOrderProcessorComponent({
            entity: order,
            denominaciones: this.denoms ?? [],
            liquidationMode: order.direccion ?? "MIXED",
            isFlexibleLiquidationModeActive: false
        })

        document.body.append(new WModalForm({
            ObjectModal: orderProcessor,
            DivColumns: "FullScreen"
        }));
    }
    /**
     * @param {Catalogo_Cuentas} cuenta     * 
     *  @param {Denominacion_Catalogo[]} denoms
     */
    async CashRegisterControl(cuenta, denoms) {
        /**@type {Array<Inventario_Denominacion_Caja>} */
        const inventarioCaja = await new Inventario_Denominacion_Caja().
            Where(FilterData.Equal("id_cuenta", cuenta.id_cuentas))
        return new WCashRegisterControl({
            cuenta: cuenta,
            denominaciones: denoms,
            inventario: inventarioCaja
        })
    }
    async MainComponent() {
        return new WTransactionProcessor({
            //cuenta: cuenta,
            //entity: new Orden_Movimiento(),
            denominaciones: this.denoms ?? [],
            //action: () => { }
        })
    }

    CustomStyle = css`
        .component{
           display: block;
        }        
        .cambio-monedas {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 20px;
            button {
                width:200px;
                font-size: 20px;
                font-weight: bold;
            }
        }   
    `
}
customElements.define('w-cajas-view-component', WCajasView);


/**
 * @typedef {Object} ComponentConfig
 * * @property {Object} [propierty]
 */
class WViewComponent extends HTMLElement {
    /**
     * 
     * @param {ComponentConfig} [Config] 
     */
    constructor(Config) {
        super();
        this.attachShadow({ mode: 'open' });
        this.Config = Config
        this.ComponentsTitle = undefined;    
        /** WAppNavigator  ES UN WEB COMPONENT QUE PERMITE HACER NAVEGACION SPA DINAMICA*/    
        this.AppNavigator = new WAppNavigator({
            NavStyle: "tab",
            NavTitle: this.ComponentsTitle,
            Inicialize: true,
            Elements: this.SetOption()
        })       
        this.shadowRoot?.append(this.CustomStyle);        
        this.shadowRoot?.append(
            StylesControlsV2.cloneNode(true),
            StyleScrolls.cloneNode(true),
            StylesControlsV3.cloneNode(true),
            this.AppNavigator
        );
        this.Draw();
    }
    Draw = async () => {
    } 

    SetOption() {        
        return [
            {
                name: "Option1",
                action: async ()=> await this.MainComponent()
            },  {
                name: "Option2",
                action: async ()=> await this.MainComponent2()
            }
        ]
    }
    async MainComponent() { 
        return html`<div class="component"></div>`
    }
    async MainComponent2() { 
        return html`<h1 class="component">HOLA MUNDO</h1>`
    }
    CustomStyle = css`
        .component{
           display: block;
        }           
    `
}
customElements.define('w-view-component', WViewComponent);
export { WViewComponent  }