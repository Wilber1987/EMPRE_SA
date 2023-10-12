//@ts-check
import { WRender, ComponentsManager, WAjaxTools, WArrayF } from "../WDevCore/WModules/WComponentsTools.js";
import { StylesControlsV2, StylesControlsV3, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { WFilterOptions } from "../WDevCore/WComponents/WFilterControls.js";
import { WModalForm } from "../WDevCore/WComponents/WModalForm.js";
import { ModalMessege, WForm } from "../WDevCore/WComponents/WForm.js";
import { Catalogo_Cambio_Dolar, Catalogo_Cuentas } from "../FrontModel/DBODataBaseModel.js";
import { WOrtograficValidation } from "../WDevCore/WModules/WOrtograficValidation.js";
import { css } from "../WDevCore/WModules/WStyledRender.js";
import { WAppNavigator } from "../WDevCore/WComponents/WAppNavigator.js";
import { Detail_Movimiento, Movimientos_Cuentas } from "../FrontModel/MovimientosCuentas.js";
import { ColumChart } from "../WDevCore/WComponents/WChartJSComponents.js";

/**
 * @typedef {Object} ComponentConfig
 * * @property {Object} [propierty]
 */
class Gestion_CuentasView extends HTMLElement {
    /**
     * 
     * @param {ComponentConfig} props 
     */
    constructor(props) {
        super();
        this.attachShadow({ mode: 'open' });
        this.OptionContainer = WRender.Create({ className: "OptionContainer" });
        this.TabContainer = WRender.Create({ className: "TabContainer", id: 'TabContainer' });
        this.Manager = new ComponentsManager({ MainContainer: this.TabContainer, SPAManage: false });
        this.shadowRoot?.append(this.CustomStyle);
        this.shadowRoot?.append(
            StylesControlsV2.cloneNode(true),
            StyleScrolls.cloneNode(true),
            StylesControlsV3.cloneNode(true),
            this.OptionContainer,
            this.TabContainer
        );
        this.Draw();
    }
    Draw = async () => {
        this.SetOption();       
    }

    SetOption = async () => {
        const model = new Catalogo_Cuentas();
        /**@type {Array<Catalogo_Cuentas>} */
        const dataset = await model.Get();

        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Primary', innerText: 'Movimiento Internos',
            onclick: () => {
                // @ts-ignore
                this.Manager.NavigateFunction("PROPIAS", new GestionCuentaComponent({ Dataset: dataset.filter(c => c.tipo_cuenta == "PROPIA") }));
            }
        }))
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Basic', innerText: 'Ingresos',
            onclick: () => {
                // @ts-ignore
                this.Manager.NavigateFunction("INGRESOS", new GestionCuentaComponent({ Dataset: dataset.filter(c => c.tipo_cuenta == "EXTERNA") }));
            }
        }))
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Secundary', innerText: 'Pagos',
            onclick: () => {
                // @ts-ignore
                this.Manager.NavigateFunction("PAGOS", new GestionCuentaComponent({ Dataset: dataset.filter(c => c.tipo_cuenta == "PAGO") }));
            }
        }))
          // @ts-ignore
        this.Manager.NavigateFunction("PROPIAS", new GestionCuentaComponent({ Dataset: dataset.filter(c => c.tipo_cuenta == "PROPIA") }));
    }

    CustomStyle = css`
            .component{
               display: block;
            }    
            .OptionContainer {
                margin-bottom: 20px;
            }       
        `

}
customElements.define('w-gestion_cuentas', Gestion_CuentasView);
// @ts-ignore
window.addEventListener('load', async () => { MainBody.append(new Gestion_CuentasView()) })

/**
 * @typedef {Object} WCuentaComponentConfig
 * * @property {Array<Catalogo_Cuentas>} [Dataset]
 */
class GestionCuentaComponent extends HTMLElement {
    /**
     * 
     * @param {WCuentaComponentConfig} Config 
     */
    constructor(Config) {
        super();
        this.Config = Config;
        this.attachShadow({ mode: 'open' });
        this.OptionContainer = WRender.Create({ className: "OptionContainer" });
        this.TabContainer = WRender.Create({ className: "TabContainer", id: 'TabContainer' });
        this.Manager = new ComponentsManager({ MainContainer: this.TabContainer, SPAManage: false });
        this.shadowRoot?.append(this.CustomStyle);
        this.shadowRoot?.append(
            StylesControlsV2.cloneNode(true),
            StyleScrolls.cloneNode(true),
            StylesControlsV3.cloneNode(true),
            this.OptionContainer,
            this.TabContainer
        );
        this.Draw();
    }
    Draw = async () => {
        WRender.SetStyle(this, {
            display: "grid",
            gridTemplateColumns: "200px calc(100% - 220px)",
            gridGap: "20px"
        });
        this.SetOption();
    }

    SetOption() {
        const elements = [];
        this.Config.Dataset?.forEach(cuenta => {
            elements.push({
                name: cuenta.nombre, action: async () => {
                    const detail = await this.detailCuenta(cuenta);
                    this.Manager.NavigateFunction("detalle" + cuenta.id_cuentas, detail);
                }
            });
        });
        this.OptionContainer.append(new WAppNavigator({
            Direction: "column",
            Inicialize: true,
            Elements: elements
        }))
    }

    /**
     * @param {Catalogo_Cuentas} cuenta
     */
    async detailCuenta(cuenta) {
        let displayType = "dolares";
        const detail = WRender.Create({ className: "detail" });
        /**@type {Array<Detail_Movimiento>} */
        const movimientos = await new Detail_Movimiento({ id_cuenta: cuenta.id_cuentas }).Get();
        const filterModel = new Detail_Movimiento({
            id_cuenta: cuenta.id_cuentas,
            debito: undefined,
            credito: undefined,
            debito_dolares: undefined,
            credito_dolares: undefined,
            monto_inicial: undefined,
            monto_final: undefined,
            monto_inicial_dolares: undefined,
            monto_final_dolares: undefined
        })
        filterModel.fecha.defaultValue = Date.now();
        //console.log(filterModel.fecha.defaultValue);
        const filterOptions = new WFilterOptions({
            Dataset: movimientos,
            ModelObject: filterModel,
            Display: true,
            FilterFunction: (DFilt) => {
                this.buildDetailMovimientos(DFilt, detalle, fecha, debito, creadito, saldo, displayType);
            }
        });
        const movimientosMap = movimientos.map(c => ({
            // @ts-ignore
            Caso: c.debito == 0 ? "Credito" : "Debito",
            Mes: c.fecha.getMonthFormatEs(),
            val: 1
        }));
        //TODO REVISAR COLUMNS CART
        console.log(movimientos, movimientosMap);
        const columChartMovimientos = new ColumChart({
            Title: "Movimientos",
            // @ts-ignore
            TypeChart: "Line",
            Dataset: movimientosMap,
            EvalValue: "val",
            AttNameEval: "Caso",
            groupParams: ["Mes"]
        });
        const detalleCuenta = WRender.Create({
            className: "detalle-cuenta",
            children: [
                WRender.CreateStringNode(`<div>${cuenta.nombre}</div>`),
                WRender.CreateStringNode(`<div class="monto-cuenta"> Monto C$: ${(cuenta.saldo ?? 0).toFixed(2)}</div>`),
                WRender.CreateStringNode(`<div class="monto-cuenta"> Monto $: ${(cuenta.saldo_dolares ?? 0).toFixed(2)}</div>`),
                WRender.Create({
                    tagName: 'input', type: 'button', className: 'Btn-Mini', value: 'Movimientos $', onclick: async () => {
                        displayType = "dolares";
                        this.buildDetailMovimientos(movimientos, detalle, fecha, debito, creadito, saldo, displayType);
                    }
                }),
                WRender.Create({
                    tagName: 'input', type: 'button', className: 'Btn-Mini', value: 'Movimientos C$', onclick: async () => {
                        displayType = "cordobas";
                        this.buildDetailMovimientos(movimientos, detalle, fecha, debito, creadito, saldo, displayType);
                        
                    }
                })
            ]
        });
       
        const detalle = WRender.Create({ className: "detalle" });
        const fecha = WRender.Create({ className: "fecha" });
        const debito = WRender.Create({ className: "debito" });
        const creadito = WRender.Create({ className: "creadito" });
        const saldo = WRender.Create({ className: "saldo" });
        this.buildDetailMovimientos(movimientos, detalle, fecha, debito, creadito, saldo);
        detail.append(detalleCuenta, filterOptions, detalle, fecha, debito, creadito, saldo, columChartMovimientos);
        return detail;
    }

    /**
     * @param {any[]} movimientos
     * @param {HTMLElement} detalle
     * @param {HTMLElement} fecha
     * @param {HTMLElement} debito
     * @param {HTMLElement} creadito
     * @param {HTMLElement} saldo
     * @param {String} [type]
     */
    buildDetailMovimientos(movimientos, detalle, fecha, debito, creadito, saldo, type = "dolares") {
        console.log(type);
        detalle.innerHTML = "";
        fecha.innerHTML = "";
        debito.innerHTML = "";
        creadito.innerHTML = "";
        saldo.innerHTML = "";
        let debitoProp = type == "dolares" ? "debito_dolares" : "debito";
        let creaditoProp = type == "dolares" ? "credito_dolares" : "credito";
        let montoProp = type == "dolares" ? "monto_final_dolares" : "monto_final";
        let currency = type == "dolares" ? "$" : "C$";

        detalle.append(WRender.Create({ className: "header", innerHTML: "Detalle" }));
        fecha.append(WRender.Create({ className: "header", innerHTML: "Fecha" }));
        debito.append(WRender.Create({ className: "header", innerHTML: "Egreso" }));
        creadito.append(WRender.Create({ className: "header", innerHTML: "Ingreso" }));
        saldo.append(WRender.Create({ className: "header", innerHTML: "Saldo" }));
        movimientos.filter(movimiento => movimiento[creaditoProp] != null).forEach(movimiento => {
            // @ts-ignore
            detalle.append(WRender.Create({ className: "detail-label", children: [movimiento.Transaction_Movimiento?.concepto] }));
            fecha.append(WRender.Create({ className: "fecha-label", children: [movimiento.fecha?.toDateFormatEs()] }));
            debito.append(WRender.Create({ className: "debito-label", children: [currency, "- " + movimiento[debitoProp]?.toFixed(3)] }));
            creadito.append(WRender.Create({ className: "creadito-label", children: [currency, "+ " + movimiento[creaditoProp]?.toFixed(3)] }));
            saldo.append(WRender.Create({ className: "saldo-label", children: [currency, movimiento[montoProp]?.toFixed(3)] }));
        });
        detalle.append(WRender.Create({ className: "total ", innerHTML: "Total" }));
        debito.append(WRender.Create({ className: "debito-label total", children: [currency, "- " + WArrayF.SumValAtt(movimientos, debitoProp).toFixed(3)] }));
        creadito.append(WRender.Create({ className: "creadito-label total", children: [currency, "+ " + WArrayF.SumValAtt(movimientos, creaditoProp).toFixed(3)] }));
    }

    CustomStyle = css`
        .component{
           display: block;
        } 
        .detail {
            display: grid;
            grid-template-columns: auto auto auto auto auto;
            row-gap: 20px;
            font-size: 12px;
        }
        .detalle-cuenta {
            border-radius: 10px;
            padding: 10px;
            border: solid 1px #b3b3b3;
            display: flex;
            align-items: center;
            font-weight: bold;
            text-transform: uppercase; 
            grid-column: span 5;  
            gap: 20px;   
        }  

        .fecha ,
        .debito ,
        .creadito, .detalle, .saldo {
            border: solid 1px #888;
            padding: 10px
        } 
        .header  {
            color: #000;
            border-bottom: solid 1px #888; 
            padding: 10px;   
            margin-bottom: 10px;
            font-weight: bold;
        }
        .debito {
            text-align: right;   
            color: red;         
        }
        .creadito {
            text-align: right;  
            color: green;      
        }
        .saldo {
            text-align: right;  
        }
        .fecha-label ,.debito-label ,
        .creadito-label, .detail-label, .saldo-label  {
            margin-bottom: 10px
        }

        .debito-label ,  .creadito-label, .saldo-label  {
            display: flex;
            justify-content: space-between;
        }
        w-colum-chart, w-filter-option {
            grid-column: span 5;
        }
        .total {
            font-weight: bold;
            padding-top: 10px;
        }
    `
}
customElements.define('w-component', GestionCuentaComponent);
export { GestionCuentaComponent }
