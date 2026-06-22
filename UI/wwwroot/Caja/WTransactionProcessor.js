//@ts-check

import { Money } from "../WDevCore/WModules/Types/Money.js";
import { WRender } from "../WDevCore/WModules/WComponentsTools.js";
import { css } from "../WDevCore/WModules/WStyledRender.js";
import { Order } from "./Model/Order.js";


/**
 * @typedef {Object.<string, any>} Config
 * @property {Function} [action]
 * @property {Order} [entity]
 */

class WTransactionProcessor extends HTMLElement {
    /**
     * @param {Config} [Config]
     */
    constructor(Config = { action: (/** @type {any} */ value) => { } }) {
        super();

        this.style.backgroundColor = "#f8fafc";
        this.style.display = "flex";
        this.style.flexDirection = "column";
        this.style.height = "100%";
        this.style.overflow = "hidden";

        this.Config = Config;
        this.Entity = Config?.entity ?? new Order();
        this.Entity.LoadMockData();

        /** @type {Order|null} */
        this.selectedOrder = null;
        this.liquidationMode = null;
        this.targetUsd = 0;
        this.targetNio = 0;
        this.countedUsd = 0;
        this.countedNio = 0;

        this.usdDenoms = [100, 50, 20, 10, 5, 1];
        this.nioDenoms = [500, 200, 100, 50, 20, 10, 5, 1];

        /** @type {Object.<string, Object.<number, number>>} */
        this.denomCounts = {
            USD: {},
            NIO: {}
        };

        this.usdDenoms.forEach(d => this.denomCounts.USD[d] = 0);
        this.nioDenoms.forEach(d => this.denomCounts.NIO[d] = 0);

        this.DrawComponent();
    }

    connectedCallback() {
    }

    DrawComponent = async () => {
        this.innerHTML = "";
        this.append(WTransactionProcessorStyle.cloneNode(true));

        // Header
        const header = WRender.Create({
            tagName: "header",
            className: "tp-header",
            children: [
                WRender.Create({
                    className: "tp-header-content",
                    children: [
                        WRender.Create({
                            className: "tp-header-icon",
                            innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>`
                        }),
                        WRender.Create({
                            className: "tp-header-text",
                            children: [
                                WRender.Create({ tagName: "h1", innerText: "Caja General" }),
                                WRender.Create({ tagName: "p", innerText: "Sistema de Gestión de Desembolsos e Ingresos" })
                            ]
                        })
                    ]
                }),
                WRender.Create({
                    className: "tp-header-user",
                    children: [
                        WRender.Create({
                            className: "tp-user-info",
                            children: [
                                WRender.Create({ tagName: "p", innerText: "Cajero: Will" }),
                                WRender.Create({ tagName: "p", innerText: "Turno: Mañana" })
                            ]
                        }),
                        WRender.Create({
                            className: "tp-user-avatar",
                            innerText: "W"
                        })
                    ]
                })
            ]
        });

        // Main content
        const main = WRender.Create({
            tagName: "main",
            className: "tp-main",
            children: [
                this.CreateLeftPanel(),
                this.CreateRightPanel()
            ]
        });

        this.append(header, main);
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

    CreateRightPanel = () => {
        return WRender.Create({
            tagName: "section",
            className: "tp-right-panel",
            children: [
                this.CreateEmptyState(),
                this.CreateProcessingInterface()
            ]
        });
    }

    CreateEmptyState = () => {
        return WRender.Create({
            className: "tp-empty-state",
            id: "emptyState",
            children: [
                WRender.Create({
                    innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>`
                }),
                WRender.Create({ tagName: "p", innerText: "Seleccione una orden para procesar" }),
                WRender.Create({ tagName: "p", innerText: "Las órdenes pendientes aparecen en el panel izquierdo." })
            ]
        });
    }

    CreateProcessingInterface = () => {
        return WRender.Create({
            className: "tp-processing-interface",
            id: "processingInterface",
            children: [
                this.CreateTransactionData(),
                this.CreateDenominationsSection()
            ]
        });
    }

    CreateTransactionData = () => {
        return WRender.Create({
            className: "tp-transaction-data",
            children: [
                this.CreateOrderHeaderCard(),
                this.CreateLiquidationMethod(),
                this.CreateActionButton()
            ]
        });
    }

    CreateOrderHeaderCard = () => {
        return WRender.Create({
            className: "tp-card",
            children: [
                WRender.Create({
                    className: "tp-order-header",
                    children: [
                        WRender.Create({
                            children: [
                                WRender.Create({
                                    className: "tp-badges",
                                    children: [
                                        WRender.Create({ tagName: "span", id: "orderTypeBadge", className: "tp-badge tp-badge-type" }),
                                        WRender.Create({ tagName: "span", id: "orderDirectionBadge", className: "tp-badge tp-badge-direction" })
                                    ]
                                }),
                                WRender.Create({ tagName: "h2", id: "orderIdDisplay", className: "tp-order-id" }),
                                WRender.Create({
                                    className: "tp-client-info",
                                    children: [
                                        WRender.Create({
                                            innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>`
                                        }),
                                        WRender.Create({ tagName: "span", id: "clientNameDisplay" })
                                    ]
                                })
                            ]
                        }),
                        WRender.Create({
                            className: "tp-amount-display",
                            children: [
                                WRender.Create({ tagName: "p", innerText: "Monto Base de la Orden" }),
                                WRender.Create({ tagName: "p", id: "baseAmountDisplay", className: "tp-amount-value" })
                            ]
                        })
                    ]
                }),
                WRender.Create({
                    className: "tp-info-box",
                    children: [
                        WRender.Create({
                            innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>`
                        }),
                        WRender.Create({
                            tagName: "span",
                            innerText: "Esta orden fue generada en SAC. El monto original está en USD. Seleccione el método de liquidación a continuación."
                        })
                    ]
                })
            ]
        });
    }

    CreateLiquidationMethod = () => {
        return WRender.Create({
            className: "tp-card",
            children: [
                WRender.Create({ tagName: "h3", innerText: "1. Método de Liquidación", className: "tp-section-title" }),
                WRender.Create({
                    className: "tp-liquidation-grid",
                    children: [
                        this.CreateLiquidationButton("USD", "Solo Dólares (USD)", "Entrega o cobro 100% en moneda estadounidense."),
                        this.CreateLiquidationButton("NIO", "Solo Córdobas (NIO)", `Conversión total a moneda local (Tasa: ${this.Entity.GetExchangeRate().toFixed(2)}).`),
                        this.CreateLiquidationButton("MIXED", "Mixto / Mesa Cambiaria", "Dividir el monto entre USD y NIO.")
                    ]
                }),
                this.CreateMixedInputs()
            ]
        });
    }

    /**
     * @param {string} mode
     * @param {string} title
     * @param {string} description
     */
    CreateLiquidationButton = (mode, title, description) => {
        return WRender.Create({
            tagName: "button",
            className: "tp-liquidation-btn",
            id: `btnMode${mode}`,
            onclick: () => this.setLiquidationMode(mode),
            children: [
                WRender.Create({ tagName: "div", innerText: title, className: "tp-btn-title" }),
                WRender.Create({ tagName: "div", innerText: description, className: "tp-btn-desc" })
            ]
        });
    }

    CreateMixedInputs = () => {
        this.InputUsd = WRender.Create({
            tagName: "input",
            type: "number",
            id: "mixedUsdAmount",
            step: "0.01",
            min: 0,
            className: "tp-mixed-input",
            oninput: () => this.updateMixedAmounts(),
            onchange: (ev) => {
                if (this.selectedOrder != null) {
                    const amount = new Money(ev.target.value);
                    this.selectedOrder?.amountUSD
                    const amountCordobas = new Money(this.selectedOrder.amountUSD).subtract(amount) * 36.5
                    // @ts-ignore
                    this.InputNIO.value = new Money(amountCordobas).toNumber();
                }

            }
        })

        this.InputNIO = WRender.Create({
            tagName: "input",
            type: "number",
            id: "mixedNioAmount",
            min: 0,
            step: "0.01",
            className: "tp-mixed-input",
            oninput: () => this.updateMixedAmounts()
        })
        return WRender.Create({
            className: "tp-mixed-inputs",
            id: "mixedInputs",
            children: [
                WRender.Create({
                    className: "tp-mixed-header",
                    children: [
                        WRender.Create({
                            innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>`
                        }),
                        WRender.Create({ tagName: "h4", innerText: "Distribución del Monto (Mesa Cambiaria)" })
                    ]
                }),
                WRender.Create({
                    className: "tp-mixed-grid",
                    children: [
                        WRender.Create({
                            children: [
                                WRender.Create({ tagName: "label", innerText: "Monto a liquidar en USD" }),
                                WRender.Create({
                                    className: "tp-input-wrapper",
                                    children: [
                                        WRender.Create({ tagName: "span", innerText: "$", className: "tp-input-prefix" }),
                                        this.InputUsd
                                    ]
                                })
                            ]
                        }),
                        WRender.Create({
                            children: [
                                WRender.Create({ tagName: "label", innerText: "Monto a liquidar en NIO" }),
                                WRender.Create({
                                    className: "tp-input-wrapper",
                                    children: [
                                        WRender.Create({ tagName: "span", innerText: "C$", className: "tp-input-prefix" }),
                                        this.InputNIO
                                    ]
                                })
                            ]
                        })
                    ]
                }),
                WRender.Create({ tagName: "p", id: "mixedValidationMsg", className: "tp-validation-msg" })
            ]
        });
    }

    CreateActionButton = () => {
        return WRender.Create({
            className: "tp-action-container",
            children: [
                WRender.Create({
                    tagName: "button",
                    id: "processBtn",
                    className: "tp-process-btn tp-process-btn-disabled",
                    disabled: true,
                    onclick: () => this.processTransaction(),
                    children: [
                        WRender.Create({
                            innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>`
                        }),
                        WRender.Create({ innerText: "Procesar Transacción" })
                    ]
                })
            ]
        });
    }

    CreateDenominationsSection = () => {
        return WRender.Create({
            className: "tp-denominations-section",
            id: "denominationsSection",
            children: [
                WRender.Create({ tagName: "h3", innerText: "2. Registro de Denominaciones", className: "tp-section-title" }),
                this.CreateCurrencyDenomination("USD", "Dólares (USD)"),
                this.CreateCurrencyDenomination("NIO", "Córdobas (NIO)"),
                this.CreateValidationStatus()
            ]
        });
    }

    /**
     * @param {string} currency
     * @param {string} label
     */
    CreateCurrencyDenomination = (currency, label) => {
        const colorClass = currency === "USD" ? "tp-color-green" : "tp-color-blue";
        return WRender.Create({
            className: `tp-currency-container`,
            id: `${currency.toLowerCase()}DenomContainer`,
            children: [
                WRender.Create({
                    className: "tp-currency-header",
                    children: [
                        WRender.Create({
                            className: "tp-currency-title",
                            children: [
                                WRender.Create({ className: `tp-color-dot ${colorClass}` }),
                                WRender.Create({ tagName: "h4", innerText: label })
                            ]
                        }),
                        WRender.Create({
                            className: "tp-currency-summary",
                            children: [
                                WRender.Create({ innerHTML: `Requerido: <span class="tp-bold" id="target${currency}Display">$0.00</span>` }),
                                WRender.Create({ innerHTML: ` | Contado: <span class="tp-bold" id="counted${currency}Display">$0.00</span>` })
                            ]
                        })
                    ]
                }),
                WRender.Create({
                    className: `tp-denom-grid`,
                    id: `${currency.toLowerCase()}DenomGrid`
                })
            ]
        });
    }

    CreateValidationStatus = () => {
        return WRender.Create({
            className: "tp-validation-status tp-validation-error",
            id: "validationStatus",
            children: [
                WRender.Create({
                    id: "statusIcon",
                    innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>`
                }),
                WRender.Create({
                    children: [
                        WRender.Create({ tagName: "p", id: "statusTitle", innerText: "Monto no coincide", className: "tp-status-title" }),
                        WRender.Create({ tagName: "p", id: "statusDesc", innerText: "Revise las denominaciones ingresadas.", className: "tp-status-desc" })
                    ]
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
        const orders = await this.Entity.GetPending();

        const filtered = orders.filter(o =>
            o.Code.toLowerCase().includes(filter.toLowerCase()) ||
            o.client.toLowerCase().includes(filter.toLowerCase())
        );

        filtered.forEach(order => {
            const isDesembolso = order.direction === "DESEMBOLSO";
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
                            WRender.Create({ tagName: "span", innerText: order.Code, className: "tp-order-id-small" }),
                            WRender.Create({ tagName: "span", innerText: order.type, className: "tp-order-type-badge" })
                        ]
                    }),
                    WRender.Create({
                        className: "tp-order-card-body",
                        children: [
                            WRender.Create({
                                children: [
                                    WRender.Create({ tagName: "p", innerText: order.client, className: "tp-client-name" }),
                                    WRender.Create({ tagName: "p", innerText: `$${order.amountUSD.toFixed(2)}`, className: "tp-order-amount" })
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
     * @param {Order} order
     */
    selectOrder = (order) => {
        this.selectedOrder = order;
        this.liquidationMode = null;
        this.targetUsd = 0;
        this.targetNio = 0;
        this.countedUsd = 0;
        this.countedNio = 0;

        this.usdDenoms.forEach(d => this.denomCounts.USD[d] = 0);
        this.nioDenoms.forEach(d => this.denomCounts.NIO[d] = 0);

        const emptyState = this.querySelector("#emptyState");
        const processingInterface = this.querySelector("#processingInterface");

        if (emptyState) emptyState.classList.add("hidden");
        if (processingInterface) processingInterface.classList.remove("hidden");

        const orderIdDisplay = this.querySelector("#orderIdDisplay");
        const clientNameDisplay = this.querySelector("#clientNameDisplay");
        const baseAmountDisplay = this.querySelector("#baseAmountDisplay");

        if (orderIdDisplay) orderIdDisplay.textContent = order.Code;
        if (clientNameDisplay) clientNameDisplay.textContent = order.client;
        if (baseAmountDisplay) baseAmountDisplay.textContent = `$${order.amountUSD.toFixed(2)} USD`;

        const typeBadge = this.querySelector("#orderTypeBadge");
        if (typeBadge) {
            typeBadge.textContent = order.type;
            typeBadge.className = `tp-badge tp-badge-type ${order.type === "EMPEÑO" ? "tp-badge-purple" : "tp-badge-blue"}`;
        }

        const dirBadge = this.querySelector("#orderDirectionBadge");
        if (dirBadge) {
            dirBadge.textContent = order.direction;
            dirBadge.className = `tp-badge tp-badge-direction ${order.direction === "DESEMBOLSO" ? "tp-badge-red" : "tp-badge-green"}`;
        }

        this.querySelectorAll(".tp-liquidation-btn").forEach(btn => {
            btn.classList.remove("tp-liquidation-btn-active");
        });

        const mixedInputs = this.querySelector("#mixedInputs");
        if (mixedInputs) mixedInputs.classList.add("hidden");

        const denominationsSection = this.querySelector("#denominationsSection");
        if (denominationsSection) denominationsSection.classList.add("hidden");

        this.updateValidation();
    }

    /**
     * @param {string} mode
     */
    setLiquidationMode = (mode) => {
        this.liquidationMode = mode;

        this.querySelectorAll(".tp-liquidation-btn").forEach(btn => {
            btn.classList.remove("tp-liquidation-btn-active");
        });

        const activeBtn = this.querySelector(`#btnMode${mode}`);
        if (activeBtn) activeBtn.classList.add("tp-liquidation-btn-active");

        const mixedInputs = this.querySelector("#mixedInputs");
        if (mode === "MIXED") {
            if (mixedInputs) mixedInputs.classList.remove("hidden");
            const mixedUsdAmount = this.querySelector("#mixedUsdAmount");
            const mixedNioAmount = this.querySelector("#mixedNioAmount");
            if (mixedUsdAmount) /** @type {HTMLInputElement} */ (mixedUsdAmount).value = "";
            if (mixedNioAmount) /** @type {HTMLInputElement} */ (mixedNioAmount).value = "";
            this.targetUsd = 0;
            this.targetNio = 0;
        } else {
            if (mixedInputs) mixedInputs.classList.add("hidden");
            if (mode === "USD") {
                this.targetUsd = this.selectedOrder?.amountUSD ?? 0;
                this.targetNio = 0;
            } else if (mode === "NIO") {
                this.targetUsd = 0;
                this.targetNio = (this.selectedOrder?.amountUSD ?? 0) * this.Entity.GetExchangeRate();
            }
        }

        const denominationsSection = this.querySelector("#denominationsSection");
        if (denominationsSection) denominationsSection.classList.remove("hidden");

        this.renderDenominationGrids();
        this.updateValidation();
    }

    updateMixedAmounts = () => {
        const mixedUsdAmount = /** @type {HTMLInputElement} */ (this.querySelector("#mixedUsdAmount"));
        const mixedNioAmount = /** @type {HTMLInputElement} */ (this.querySelector("#mixedNioAmount"));

        const usdVal = parseFloat(mixedUsdAmount?.value ?? "0") || 0;
        const nioVal = parseFloat(mixedNioAmount?.value ?? "0") || 0;

        this.targetUsd = usdVal;
        this.targetNio = nioVal;

        const exchangeRate = this.Entity.GetExchangeRate();
        const totalEquivalentUsd = usdVal + (nioVal / exchangeRate);
        const orderUsd = this.selectedOrder?.amountUSD ?? 0;
        const diff = Math.abs(totalEquivalentUsd - orderUsd);

        const msgEl = this.querySelector("#mixedValidationMsg");
        if (msgEl) {
            if (diff < 0.01) {
                msgEl.textContent = "✓ Distribución correcta";
                msgEl.className = "tp-validation-msg tp-validation-success";
            } else {
                msgEl.textContent = `⚠ La suma equivale a $${totalEquivalentUsd.toFixed(2)} USD (Debe ser $${orderUsd.toFixed(2)})`;
                msgEl.className = "tp-validation-msg tp-validation-error-text";
            }
        }

        this.renderDenominationGrids();
        this.updateValidation();
    }

    renderDenominationGrids = () => {
        const usdContainer = this.querySelector("#usdDenomContainer");
        const nioContainer = this.querySelector("#nioDenomContainer");

        const targetUsdDisplay = this.querySelector("#targetUsdDisplay");
        const targetNioDisplay = this.querySelector("#targetNioDisplay");

        if (targetUsdDisplay) targetUsdDisplay.textContent = `$${this.targetUsd.toFixed(2)}`;
        if (targetNioDisplay) targetNioDisplay.textContent = `C$${this.targetNio.toFixed(2)}`;

        if (this.liquidationMode === "NIO") {
            if (usdContainer) usdContainer.classList.add("hidden");
            if (nioContainer) nioContainer.classList.remove("hidden");
        } else if (this.liquidationMode === "USD") {
            if (usdContainer) usdContainer.classList.remove("hidden");
            if (nioContainer) nioContainer.classList.add("hidden");
        } else {
            if (usdContainer) usdContainer.classList.remove("hidden");
            if (nioContainer) nioContainer.classList.remove("hidden");
        }

        const usdGrid = this.querySelector("#usdDenomGrid");
        if (usdGrid) {
            usdGrid.innerHTML = "";
            this.usdDenoms.forEach(denom => {
                const count = this.denomCounts.USD[denom];
                const subtotal = count * denom;
                usdGrid.innerHTML += this.createDenomCard("USD", denom, count, subtotal);
            });
        }

        const nioGrid = this.querySelector("#nioDenomGrid");
        if (nioGrid) {
            nioGrid.innerHTML = "";
            this.nioDenoms.forEach(denom => {
                const count = this.denomCounts.NIO[denom];
                const subtotal = count * denom;
                nioGrid.innerHTML += this.createDenomCard("NIO", denom, count, subtotal);
            });
        }
    }

    /**
     * @param {string} currency
     * @param {number} denom
     * @param {number} count
     * @param {number} subtotal
     */
    createDenomCard = (currency, denom, count, subtotal) => {
        const isDisabled = count === 0 && ((currency === "USD" && this.targetUsd === 0) || (currency === "NIO" && this.targetNio === 0));
        const opacityClass = isDisabled ? "tp-denom-disabled" : "";
        const symbol = currency === "USD" ? "$" : "C$";

        return `
            <div class="tp-denom-card ${opacityClass}">
                <span class="tp-denom-value">${symbol}${denom}</span>
                <div class="tp-denom-controls">
                    <button onclick="this.getRootNode().host.updateDenom('${currency}', ${denom}, -1)" class="tp-denom-btn tp-denom-btn-minus">-</button>
                    <input type="number" value="${count}" class="tp-denom-count" />
                    <button onclick="this.getRootNode().host.updateDenom('${currency}', ${denom}, 1)" class="tp-denom-btn tp-denom-btn-plus">+</button>
                </div>
                <span class="tp-denom-subtotal">${symbol}${subtotal.toFixed(2)}</span>
            </div>
        `;
    }

    /**
     * @param {string} currency
     * @param {number} denom
     * @param {number} change
     */
    updateDenom = (currency, denom, change) => {
        const newCount = this.denomCounts[currency][denom] + change;
        if (newCount < 0) return;

        this.denomCounts[currency][denom] = newCount;
        this.calculateTotals();
        this.renderDenominationGrids();
        this.updateValidation();
    }

    calculateTotals = () => {
        this.countedUsd = this.usdDenoms.reduce((sum, d) => sum + (this.denomCounts.USD[d] * d), 0);
        this.countedNio = this.nioDenoms.reduce((sum, d) => sum + (this.denomCounts.NIO[d] * d), 0);

        const countedUsdDisplay = this.querySelector("#countedUsdDisplay");
        const countedNioDisplay = this.querySelector("#countedNioDisplay");

        if (countedUsdDisplay) countedUsdDisplay.textContent = `$${this.countedUsd.toFixed(2)}`;
        if (countedNioDisplay) countedNioDisplay.textContent = `C$${this.countedNio.toFixed(2)}`;
    }

    updateValidation = () => {
        const statusDiv = this.querySelector("#validationStatus");
        const statusIcon = this.querySelector("#statusIcon");
        const statusTitle = this.querySelector("#statusTitle");
        const statusDesc = this.querySelector("#statusDesc");
        const processBtn = this.querySelector("#processBtn");

        if (!statusDiv || !statusIcon || !statusTitle || !statusDesc || !processBtn) return;

        if (this.liquidationMode === "MIXED") {
            const exchangeRate = this.Entity.GetExchangeRate();
            const totalEquivalentUsd = this.targetUsd + (this.targetNio / exchangeRate);
            const orderUsd = this.selectedOrder?.amountUSD ?? 0;
            if (Math.abs(totalEquivalentUsd - orderUsd) > 0.01) {
                this.setValidationState(false, "Distribución de montos incorrecta", "La suma de USD y NIO debe equivaler al monto total de la orden.", statusDiv, statusIcon, statusTitle, statusDesc, processBtn);
                return;
            }
        }

        const usdMatch = Math.abs(this.countedUsd - this.targetUsd) < 0.01;
        const nioMatch = Math.abs(this.countedNio - this.targetNio) < 0.01;

        const usdValid = (this.targetUsd === 0 && this.countedUsd === 0) || usdMatch;
        const nioValid = (this.targetNio === 0 && this.countedNio === 0) || nioMatch;

        if (usdValid && nioValid && this.liquidationMode !== null) {
            this.setValidationState(true, "Monto correcto", "Las denominaciones coinciden exactamente con el monto requerido.", statusDiv, statusIcon, statusTitle, statusDesc, processBtn);
        } else {
            let diffUsd = this.countedUsd - this.targetUsd;
            let diffNio = this.countedNio - this.targetNio;
            let msg = "Revise las denominaciones ingresadas.";
            if (Math.abs(diffUsd) > 0.01) msg += ` Diferencia USD: ${diffUsd > 0 ? "+" : ""}$${diffUsd.toFixed(2)}.`;
            if (Math.abs(diffNio) > 0.01) msg += ` Diferencia NIO: ${diffNio > 0 ? "+" : ""}C$${diffNio.toFixed(2)}.`;

            this.setValidationState(false, "Monto no coincide", msg, statusDiv, statusIcon, statusTitle, statusDesc, processBtn);
        }
    }

    /**
     * @param {boolean} isValid
     * @param {string} title
     * @param {string} desc
     * @param {Element} statusDiv
     * @param {Element} icon
     * @param {Element} titleEl
     * @param {Element} descEl
     * @param {Element} btn
     */
    setValidationState = (isValid, title, desc, statusDiv, icon, titleEl, descEl, btn) => {
        if (isValid) {
            statusDiv.className = "tp-validation-status tp-validation-success";
            icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
            titleEl.className = "tp-status-title tp-status-title-success";
            descEl.className = "tp-status-desc tp-status-desc-success";

            /** @type {HTMLButtonElement} */ (btn).disabled = false;
            btn.className = "tp-process-btn tp-process-btn-enabled";
        } else {
            statusDiv.className = "tp-validation-status tp-validation-error";
            icon.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
            titleEl.className = "tp-status-title tp-status-title-error";
            descEl.className = "tp-status-desc tp-status-desc-error";

            /** @type {HTMLButtonElement} */ (btn).disabled = true;
            btn.className = "tp-process-btn tp-process-btn-disabled";
        }
        titleEl.textContent = title;
        descEl.textContent = desc;
    }

    processTransaction = async () => {
        if (!this.selectedOrder) return;

        this.selectedOrder.liquidationMode = this.liquidationMode;
        this.selectedOrder.liquidationUsd = this.targetUsd;
        this.selectedOrder.liquidationNio = this.targetNio;
        this.selectedOrder.denominationsUSD = JSON.stringify(this.denomCounts.USD);
        this.selectedOrder.denominationsNIO = JSON.stringify(this.denomCounts.NIO);

        await this.Entity.Process(this.selectedOrder);

        if (this.Config?.action) {
            this.Config.action(this.selectedOrder);
        }

        this.showSuccessModal();
    }

    showSuccessModal = () => {
        const modal = WRender.Create({
            className: "tp-modal-overlay",
            id: "successModal",
            children: [
                WRender.Create({
                    className: "tp-modal-content",
                    children: [
                        WRender.Create({
                            className: "tp-modal-icon",
                            innerHTML: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                            </svg>`
                        }),
                        WRender.Create({ tagName: "h3", innerText: "¡Transacción Exitosa!" }),
                        WRender.Create({
                            tagName: "p",
                            innerHTML: `La orden <span class="tp-bold">${this.selectedOrder?.Code}</span> ha sido procesada correctamente y el arqueo de denominaciones ha sido registrado.`
                        }),
                        WRender.Create({
                            tagName: "button",
                            innerText: "Aceptar y Nueva Operación",
                            className: "tp-modal-btn",
                            onclick: () => this.closeModal()
                        })
                    ]
                })
            ]
        });

        this.append(modal);
    }

    closeModal = async () => {
        const modal = this.querySelector("#successModal");
        if (modal) modal.remove();

        const emptyState = this.querySelector("#emptyState");
        const processingInterface = this.querySelector("#processingInterface");
        const searchInput = /** @type {HTMLInputElement} */ (this.querySelector("#searchInput"));

        if (emptyState) emptyState.classList.remove("hidden");
        if (processingInterface) processingInterface.classList.add("hidden");
        if (searchInput) searchInput.value = "";

        this.selectedOrder = null;
        await this.renderOrderList();
    }
}

const WTransactionProcessorStyle = css`
w-transaction-processor {
    display: flex;
    flex-direction: column;
    height: 100%;
    font-family: 'Inter', sans-serif;
    color: #1e293b;
}

.tp-header {
    background: white;
    border-bottom: 1px solid #e2e8f0;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    z-index: 10;
}

.tp-header-content {
    display: flex;
    align-items: center;
    gap: 12px;
}

.tp-header-icon {
    background: #2563eb;
    color: white;
    padding: 8px;
    border-radius: 8px;
}

.tp-header-icon svg {
    width: 24px;
    height: 24px;
}

.tp-header-text h1 {
    font-size: 20px;
    font-weight: bold;
    color: #0f172a;
    margin: 0;
}

.tp-header-text p {
    font-size: 12px;
    color: #64748b;
    margin: 0;
}

.tp-header-user {
    display: flex;
    align-items: center;
    gap: 16px;
}

.tp-user-info {
    text-align: right;
}

.tp-user-info p:first-child {
    font-size: 14px;
    font-weight: 600;
    color: #334155;
    margin: 0;
}

.tp-user-info p:last-child {
    font-size: 12px;
    color: #64748b;
    margin: 0;
}

.tp-user-avatar {
    width: 40px;
    height: 40px;
    background: #e2e8f0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: #475569;
}

.tp-main {
    flex: 1;
    display: flex;
    overflow: hidden;
}

.tp-left-panel {
    width: 20%;
    background: white;
    border-right: 1px solid #e2e8f0;
    display: flex;
    flex-direction: column;
}

.tp-search-container {
    padding: 16px;
    border-bottom: 1px solid #f1f5f9;
}

.tp-search-input {
    width: 100%;
    padding: 8px 16px 8px 40px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    outline: none;
    transition: all 0.2s;
}

.tp-search-input:focus {
    box-shadow: 0 0 0 2px #3b82f6;
    border-color: transparent;
}

.tp-order-list {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.tp-order-card {
    padding: 16px;
    border-radius: 8px;
    border: 1px solid;
    cursor: pointer;
    transition: all 0.2s;
}

.tp-order-card:hover {
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.tp-order-card-red {
    background: #fef2f2;
    color: #b91c1c;
    border-color: #fecaca;
}

.tp-order-card-green {
    background: #f0fdf4;
    color: #15803d;
    border-color: #bbf7d0;
}

.tp-order-card-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 8px;
}

.tp-order-id-small {
    font-weight: bold;
    font-size: 14px;
}

.tp-order-type-badge {
    font-size: 12px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 4px;
    background: rgba(255,255,255,0.6);
}

.tp-order-card-body {
    display: flex;
    justify-content: space-between;
    align-items: end;
}

.tp-client-name {
    font-size: 12px;
    opacity: 0.8;
    margin-bottom: 4px;
}

.tp-order-amount {
    font-weight: bold;
    font-size: 18px;
}

.tp-right-panel {
    flex: 1;
    background: #f8fafc;
    overflow-y: auto;
    padding: 32px;
    position: relative;
}

.tp-empty-state {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #94a3b8;
}

.tp-empty-state svg {
    width: 64px;
    height: 64px;
    margin-bottom: 16px;
    opacity: 0.5;
}

.tp-empty-state p:first-of-type {
    font-size: 18px;
    font-weight: 500;
    margin: 0 0 8px 0;
}

.tp-empty-state p:last-of-type {
    font-size: 14px;
    margin: 0;
}

.tp-processing-interface {
    display: grid;
    grid-template-columns: calc(100% - 520px) 500px;
    gap: 10px;
    max-width: 1200px;
    margin: 0 auto;
}

.tp-transaction-data {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.tp-card {
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    border: 1px solid #e2e8f0;
    padding: 24px;
}

.tp-order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    gap: 16px;
}

.tp-badges {
    display: flex;
    gap: 8px;
    margin-bottom: 4px;
}

.tp-badge {
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
}

.tp-badge-type {
    background: #dbeafe;
    color: #1e40af;
}

.tp-badge-purple {
    background: #f3e8ff;
    color: #6b21a8;
}

.tp-badge-blue {
    background: #dbeafe;
    color: #1e40af;
}

.tp-badge-direction {
    background: #fee2e2;
    color: #991b1b;
}

.tp-badge-red {
    background: #fee2e2;
    color: #991b1b;
}

.tp-badge-green {
    background: #d1fae5;
    color: #065f46;
}

.tp-order-id {
    font-size: 24px;
    font-weight: bold;
    color: #0f172a;
    margin: 0;
}

.tp-client-info {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #64748b;
    font-size: 14px;
    margin-top: 4px;
}

.tp-client-info svg {
    width: 16px;
    height: 16px;
}

.tp-amount-display {
    text-align: right;
}

.tp-amount-display p:first-child {
    font-size: 14px;
    color: #64748b;
    margin: 0 0 4px 0;
}

.tp-amount-value {
    font-size: 30px;
    font-weight: bold;
    color: #0f172a;
    margin: 0;
}

.tp-info-box {
    background: #f8fafc;
    border-radius: 8px;
    padding: 12px;
    border: 1px solid #e2e8f0;
    font-size: 14px;
    color: #475569;
    display: flex;
    align-items: start;
    gap: 8px;
}

.tp-info-box svg {
    width: 20px;
    height: 20px;
    color: #3b82f6;
    flex-shrink: 0;
    margin-top: 2px;
}

.tp-section-title {
    font-size: 18px;
    font-weight: 600;
    color: #0f172a;
    margin: 0 0 16px 0;
}

.tp-liquidation-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
}

.tp-liquidation-btn {
    padding: 16px;
    border-radius: 8px;
    border: 2px solid #e2e8f0;
    background: white;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s;
}

.tp-liquidation-btn:hover {
    border-color: #3b82f6;
    background: #eff6ff;
}

.tp-liquidation-btn-active {
    border-color: #3b82f6;
    background: #eff6ff;
    box-shadow: 0 0 0 2px #bfdbfe;
}

.tp-btn-title {
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 4px;
}

.tp-liquidation-btn:hover .tp-btn-title {
    color: #1d4ed8;
}

.tp-btn-desc {
    font-size: 14px;
    color: #64748b;
}

.tp-mixed-inputs {
    margin-top: 24px;
    padding: 16px;
    background: #fef3c7;
    border: 1px solid #fde68a;
    border-radius: 8px;
    display: none;
}

.tp-mixed-inputs:not(.hidden) {
    display: block;
}

.tp-mixed-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
}

.tp-mixed-header svg {
    width: 16px;
    height: 16px;
    color: #92400e;
}

.tp-mixed-header h4 {
    font-size: 14px;
    font-weight: 600;
    color: #78350f;
    margin: 0;
}

.tp-mixed-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
}

.tp-mixed-grid label {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: #92400e;
    margin-bottom: 4px;
}

.tp-input-wrapper {
    position: relative;
}

.tp-input-prefix {
    position: absolute;
    left: 12px;
    top: 8px;
    color: #64748b;
}

.tp-mixed-input {
    width: 100%;
    padding: 8px 12px 8px 35px;
    border: 1px solid #fcd34d;
    border-radius: 6px;
    font-size: 14px;
    box-sizing: border-box;

    outline: none;
}

.tp-mixed-input:focus {
    box-shadow: 0 0 0 2px #f59e0b;
    border-color: #f59e0b;
}

.tp-validation-msg {
    font-size: 12px;
    margin-top: 8px;
    font-weight: 500;
}

.tp-validation-success {
    color: #15803d;
    padding: 5px;
}

.tp-validation-error-text {
    color: #b91c1c;
}

.tp-action-container {
    display: flex;
    justify-content: flex-end;
    padding-top: 16px;
    padding-bottom: 32px;
}

.tp-process-btn {
    padding: 12px 32px;
    font-weight: 600;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
}

.tp-process-btn svg {
    width: 20px;
    height: 20px;
}

.tp-process-btn-disabled {
    background: #cbd5e1;
    color: #64748b;
    cursor: not-allowed;
}

.tp-process-btn-enabled {
    background: #2563eb;
    color: white;
    box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);
}

.tp-process-btn-enabled:hover {
    background: #1d4ed8;
    transform: scale(1.05);
}

.tp-denominations-section {
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    border: 1px solid #e2e8f0;
    padding: 24px;
}

.tp-currency-container {
    margin-bottom: 24px;
}

.tp-currency-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
}

.tp-currency-title {
    display: flex;
    align-items: center;
    gap: 8px;
}

.tp-color-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
}

.tp-color-green {
    background: #10b981;
}

.tp-color-blue {
    background: #3b82f6;
}

.tp-currency-title h4 {
    font-size: 14px;
    font-weight: 600;
    color: #334155;
    margin: 0;
}

.tp-currency-summary {
    font-size: 14px;
    color: #475569;
}

.tp-bold {
    font-weight: bold;
    color: #0f172a;
}

.tp-denom-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
}

.tp-denom-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px;
    display: flex;
    align-items: center;
    transition: all 0.2s;
    gap: 5px;
}

.tp-denom-disabled {
}

.tp-denom-value {
    font-size: 18px;
    font-weight: bold;
    color: #334155;
}

.tp-denom-controls {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
}

.tp-denom-btn {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid #cbd5e1;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.tp-denom-btn-minus {
    background: white;
    color: #475569;
}

.tp-denom-btn-minus:hover {
    background: #f1f5f9;
}

.tp-denom-btn-plus {
    background: #2563eb;
    color: white;
    border-color: #2563eb;
    box-shadow: 0 1px 2px rgba(37, 99, 235, 0.3);
}

.tp-denom-btn-plus:hover {
    background: #1d4ed8;
}

.tp-denom-count {
    width: 100%;
    text-align: center;
    background: transparent;
    border: none;
    font-weight: 600;
    color: #0f172a;
    padding: 0;
    font-size: 16px;
}

.tp-denom-subtotal {
    font-size: 12px;
    color: #64748b;
    margin-top: 8px;
    font-weight: 500;
}

.tp-validation-status {
    margin-top: 24px;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: all 0.3s;
}

.tp-validation-error {
    background: #fef2f2;
    border-color: #fecaca;
}

.tp-validation-success {
    background: #f0fdf4;
    border-color: #bbf7d0;
}

.tp-validation-status svg {
    width: 24px;
    height: 24px;
}

.tp-validation-error svg {
    color: #ef4444;
}

.tp-validation-success svg {
    color: #10b981;
}

.tp-status-title {
    font-size: 14px;
    font-weight: 600;
    margin: 0 0 4px 0;
}

.tp-status-title-error {
    color: #991b1b;
}

.tp-status-title-success {
    color: #065f46;
}

.tp-status-desc {
    font-size: 12px;
    margin: 0;
}

.tp-status-desc-error {
    color: #dc2626;
}

.tp-status-desc-success {
    color: #059669;
}

.tp-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px;
    backdrop-filter: blur(4px);
}

.tp-modal-content {
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 25px rgba(0,0,0,0.1);
    max-width: 400px;
    width: 100%;
    padding: 32px;
    text-align: center;
}

.tp-modal-icon {
    width: 64px;
    height: 64px;
    background: #d1fae5;
    color: #059669;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
}

.tp-modal-icon svg {
    width: 32px;
    height: 32px;
}

.tp-modal-content h3 {
    font-size: 24px;
    font-weight: bold;
    color: #0f172a;
    margin: 0 0 8px 0;
}

.tp-modal-content p {
    color: #475569;
    margin: 0 0 24px 0;
}

.tp-modal-btn {
    width: 100%;
    padding: 12px;
    background: #2563eb;
    color: white;
    font-weight: 600;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
}

.tp-modal-btn:hover {
    background: #1d4ed8;
}

.hidden {
    display: none !important;
}

@media (max-width: 1024px) {
    .tp-main {
        flex-direction: column;
    }
    
    .tp-left-panel {
        width: 100%;
        max-height: 300px;
    }
    
    .tp-processing-interface {
        grid-template-columns: 1fr;
    }
}
`;

customElements.define("w-transaction-processor", WTransactionProcessor);
export { WTransactionProcessor };