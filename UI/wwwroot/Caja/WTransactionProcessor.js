//@ts-check

import { Catalogo_Cuentas } from "../FrontModel/Catalogo_Cuentas.js";
import { ComponentsManager, WRender } from "../WDevCore/WModules/WComponentsTools.js";
import { Denominacion_Catalogo } from "./Model/Denominacion_Catalogo.js";
import { DirectionEnum, Orden_Movimiento } from "./Model/Order_Movimiento.js";
import { WTransactionProcessorStyle } from "./Modules/TransactionsStyles.js";
import { WOrderProcessorComponent } from "./WOrderProcessorComponent.js";


/**
 * @typedef {Object} Config
 * @property {Function} [action]
 * @property {Catalogo_Cuentas} [cuenta]
 * @property {Denominacion_Catalogo[]} denominaciones
 */

class WTransactionProcessor extends HTMLElement {
    /**
     * @param {Config} [Config]
     */
    constructor(Config) {
        super();

        this.style.backgroundColor = "#f8fafc";
        this.style.display = "flex";
        this.style.flexDirection = "column";
        this.style.height = "100%";
        this.style.overflow = "hidden";
        this.style.minHeight = "400px";
        this.style.borderRadius = "10px";
        this.append(WTransactionProcessorStyle.cloneNode(true));
        this.Config = Config;
        this.TabContainer = WRender.Create({
            tagName: "section",
            className: "tp-right-panel"
        });
        this.Manager = new ComponentsManager({ MainContainer: this.TabContainer, SPAManage: false });
        this.DrawComponent();
    }

    connectedCallback() {
    }

    DrawComponent = async () => {
        // Main content
        const main = WRender.Create({
            tagName: "main",
            className: "tp-main",
            children: [
                this.CreateLeftPanel(),
                this.TabContainer
            ]
        });

        this.append(main);
        this.renderOrderList();
    }

    CreateLeftPanel = () => {
        return WRender.Create({
            tagName: "aside",
            className: "tp-left-panel",
            children: [
                WRender.Create({
                    className: "tp-search-container",
                    children: [
                        WRender.Create({
                            tagName: "input",
                            type: "text",
                            id: "searchInput",
                            placeholder: "Buscar por código de orden...",
                            className: "tp-search-input",
                            oninput: (/** @type {Event} */ e) => {
                                const target = /** @type {HTMLInputElement} */ (e.target);
                                this.renderOrderList(target.value);
                            }
                        })
                    ]
                }),
                WRender.Create({
                    className: "tp-order-list",
                    id: "orderListContainer"
                })
            ]
        });
    }


    /**
     * @param {string} filter
     */
    renderOrderList = async (filter = "") => {
        const container = this.querySelector("#orderListContainer");
        if (!container) return;

        container.innerHTML = "";
        let orders = await new Orden_Movimiento().Where(
            //FilterData.Equal("Id_cuenta_origen", this.Config?.cuenta?.id_cuentas)
        );

        //orders = await this.Entity.GetPending()
        const filtered = orders.filter((/** @type {{ id_usuario_crea: string; cliente : string; }} */ o) =>
            o.id_usuario_crea?.toString().toLowerCase().includes(filter.toLowerCase()) ||
            o.cliente.toLowerCase().includes(filter.toLowerCase())
        );

        filtered.forEach((/** @type {Orden_Movimiento} */ order) => {
            const isDesembolso = order.direccion === DirectionEnum.EGRESO;
            const colorClass = isDesembolso ? "tp-order-card-red" : "tp-order-card-green";
            const icon = isDesembolso
                ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />'
                : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />';

            const div = WRender.Create({
                className: `tp-order-card ${colorClass}`,
                onclick: () => this.selectOrder(order),
                children: [
                    WRender.Create({
                        className: "tp-order-card-header",
                        children: [
                            //WRender.Create({ tagName: "span", innerText: order.id_usuario_crea?.toString(), className: "tp-order-id-small" }),
                            WRender.Create({ tagName: "span", innerText: order.Tipo_Movimiento?.replaceAll("_", " "), className: "tp-order-type-badge" })
                        ]
                    }),
                    WRender.Create({
                        className: "tp-order-card-body",
                        children: [
                            WRender.Create({
                                children: [
                                    WRender.Create({ tagName: "p", innerText: order.Cliente, className: "tp-cliente-name" }),
                                    WRender.Create({ tagName: "p", innerText: `$${order.monto?.toFixed(2)}`, className: "tp-order-amount" })
                                ]
                            }),
                            WRender.Create({
                                innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">${icon}</svg>`
                            })
                        ]
                    })
                ]
            });
            container.appendChild(div);
        });
    }

    /**
     * @param {Orden_Movimiento} order
     */
    selectOrder = (order) => {
        this.Manager.Remove("order" + order.id_orden);
        this.Manager.NavigateFunction("order" + order.id_orden,
            new WOrderProcessorComponent({
                entity: order,
                //cuenta: this.Config?.cuenta,
                denominaciones: this.Config?.denominaciones ?? [],
                action: this.Config?.action
            }))
    }
}




customElements.define("w-transaction-processor", WTransactionProcessor);
export { WTransactionProcessor };

