//@ts-check
import { WRender, ComponentsManager, WAjaxTools } from "../WDevCore/WModules/WComponentsTools.js";
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
            tagName: 'button', className: 'Block-Primary', innerText: 'Registrar Movimiento',
            onclick: () => {
                // @ts-ignore
                this.Manager.NavigateFunction("PROPIAS", new GestionCuentaComponent({ Dataset: dataset.filter(c => c.tipo_cuenta == "PROPIA") }));
            }
        }))
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Basic', innerText: 'Ingresos',
            onclick: () => {
                // @ts-ignore
                this.Manager.NavigateFunction("PAGOS", new GestionCuentaComponent({ Dataset: dataset.filter(c => c.tipo_cuenta == "EXTERNA") }));
            }
        }))
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Secundary', innerText: 'Pagos',
            onclick: () => {
                // @ts-ignore
                this.Manager.NavigateFunction("PAGOS", new GestionCuentaComponent({ Dataset: dataset.filter(c => c.tipo_cuenta == "PAGO") }));
            }
        }))
    }

    CustomStyle = css`
            .component{
               display: block;
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
        console.log(this.Config.Dataset);
        const elements = [];
        this.Config.Dataset?.forEach(cuenta => {
            elements.push({
                name: cuenta.nombre, action: async () => {
                    const detail = WRender.Create({ className: "detail" });
                    /**@type {Array<Detail_Movimiento>} */
                    const movimientos = await new Detail_Movimiento({ id_cuenta: cuenta.id_cuentas }).Get();
                    const detalleCuenta = WRender.Create({
                        className: "detalle-cuenta",
                        innerHTML: `<div>${cuenta.nombre}</div>
                            <div class="monto-cuenta"> Monto C$: ${cuenta.saldo}</div>`
                    });
                    const movimientosMap = movimientos.map(c => ({
                        // @ts-ignore
                        Caso: c.debito == 0 ? "Credito" : "Debito",
                        Mes: c.fecha.getMonthFormatEs(),
                        val: 1
                    }));
                    const columChartMovimientos = new ColumChart({
                        Title: "Movimientos",
                        // @ts-ignore
                        TypeChart: "Line",
                        Dataset: movimientosMap,
                        EvalValue: "val",
                        AttNameEval: "Caso",
                        groupParams: ["Mes"]
                    });
                    const fecha = WRender.Create({ className: "fecha", children: [WRender.Create({ className: "header", innerHTML: "Fecha" })] });
                    const debito = WRender.Create({ className: "debito", children: [WRender.Create({ className: "header", innerHTML: "Egreso" })] });
                    const creadito = WRender.Create({ className: "creadito", children: [WRender.Create({ className: "header", innerHTML: "Ingreso" })] });
                    detail.append(detalleCuenta, columChartMovimientos, fecha, debito, creadito);
                    movimientos.forEach(movimiento => {
                        fecha.append(WRender.Create({ className: "fecha-label", innerHTML: movimiento.fecha.toDateFormatEs() }));
                        debito.append(WRender.Create({ className: "debito-label", innerHTML: "$ -" + movimiento.debito.toFixed(2) }));
                        creadito.append(WRender.Create({ className: "creadito-label", innerHTML: "$ +" + movimiento.credito.toFixed(2) }));
                    });




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

    CustomStyle = css`
        .component{
           display: block;
        } 
        .detail {
            display: grid;
            grid-template-columns: auto auto auto auto;
            row-gap: 20px;
        }
        .detalle-cuenta {
            border-radius: 10px;
            padding: 10px;
            border: solid 1px #888;
            display: flex;
            align-items: center;
            font-weight: bold;
            text-transform: uppercase; 
            grid-column: span 4;  
            gap: 20px;   
        }  

        .fecha ,
        .debito ,
        .creadito {
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
        .fecha-label ,.debito-label ,
        .creadito-label  {
            margin-bottom: 10px
        }
        w-colum-chart {
            grid-column: span 1;
        }
    `
}
customElements.define('w-component', GestionCuentaComponent);
export { GestionCuentaComponent }
