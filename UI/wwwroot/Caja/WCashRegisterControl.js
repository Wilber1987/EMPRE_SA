//@ts-check
import { Catalogo_Cuentas } from "../FrontModel/Catalogo_Cuentas.js";
import { WAlertMessage } from "../WDevCore/WComponents/WAlertMessage.js";
import { WAppNavigator } from "../WDevCore/WComponents/WAppNavigator.js";
import { Money } from "../WDevCore/WModules/Types/Money.js";
import { html } from "../WDevCore/WModules/WComponentsTools.js";
import { css } from "../WDevCore/WModules/WStyledRender.js";
import { Corte_Caja, Denominacion_Caja, EstadoCorteCaja } from "./Model/Corte_Caja.js";
import { Denominacion_Catalogo } from "./Model/Denominacion_Catalogo.js";
import { Inventario_Denominacion_Caja } from "./Model/Inventario_Denominacion_Caja.js";
import { MonedaEnum } from "./Model/Order_Movimiento.js";

/**
 * @typedef {Object} Config
 * @property {Catalogo_Cuentas} cuenta
 * @property {Function} [action]
 * @property {Denominacion_Catalogo[]} denominaciones
 * @property {Inventario_Denominacion_Caja[]} inventario
 */


class WCashRegisterControl extends HTMLElement {

    /**
     * @param {Config} [Config]
     */
    constructor(Config) {
        super();
        this.Config = Config;

        // Estado interno
        /**@type {Object.<string, any>} */
        this.state = {
            view: 'loading', // 'loading', 'apertura', 'dashboard', 'cierre'
            corteActual: new Corte_Caja(), // Instancia de Corte_Caja si ya está abierta
            apertura: { usd: {}, nio: {} },
            cierre: { usd: {}, nio: {}, notes: '' },
            teorico: { usd: 0, nio: 0 } // Se llenará con el saldo de la cuenta
        };
        /**@type {Array<Denominacion_Catalogo>} */
        this.USD_DENOMS = Config?.denominaciones.filter(denom => denom.moneda == MonedaEnum.DOLARES) ?? [];
        /**@type {Array<Denominacion_Catalogo>} */
        this.NIO_DENOMS = Config?.denominaciones.filter(denom => denom.moneda == MonedaEnum.CORDOBAS) ?? [];
        // Inicializar contadores a 0
        this.DrawComponent();
    }

    connectedCallback() {
    }

    DrawComponent = async () => {
        this.innerHTML = "";
        this.append(WCashRegisterStyle.cloneNode(true));



        // Verificar si ya existe un corte abierto para esta cuenta
        await this.checkExistingCut();
        this.USD_DENOMS.forEach(d => {

            const aperturaD = this.state.corteActual.Denominaciones_Apertura
                .find((/** @type {{ id_denominacion: number; }} */ da) => da.id_denominacion == d.id_denominacion)
            const actualD = this.state.corteActual.Denominaciones_Cierre
                .find((/** @type {{ id_denominacion: number; }} */ da) => da.id_denominacion == d.id_denominacion)

            this.state.apertura.usd[d.id_denominacion] = aperturaD?.cantidad ?? 0;
            this.state.cierre.usd[d.id_denominacion] = actualD?.cantidad ?? 0;
        });
        this.NIO_DENOMS.forEach(d => {

            const aperturaD = this.state.corteActual.Denominaciones_Apertura
                .find((/** @type {{ id_denominacion: number; }} */ da) => da.id_denominacion == d.id_denominacion)
            const actualD = this.state.corteActual.Denominaciones_Cierre
                .find((/** @type {{ id_denominacion: number; }} */ da) => da.id_denominacion == d.id_denominacion)

            this.state.apertura.nio[d.id_denominacion] = aperturaD?.cantidad ?? 0;
            this.state.cierre.nio[d.id_denominacion] = actualD?.cantidad ?? 0;
        });

        this.render();
    }

    checkExistingCut = async () => {
        try {
            // Buscamos un corte abierto para la cuenta recibida
            const entity = new Corte_Caja({ id_cuenta: this.Config?.cuenta?.id_cuentas });
            const cortes = await entity.GetCorteAbierto();

            if (cortes.id_corte_caja) {
                this.state.corteActual = cortes;
                this.state.view = 'dashboard';
                this.updateTeoricoFromCuenta();
            } else {
                this.state.corteActual = cortes;
                this.state.view = 'apertura';
            }
        } catch (error) {
            console.error("Error verificando corte:", error);
            this.state.view = 'apertura';
        }
    }

    updateTeoricoFromCuenta = () => {
        if (this.Config?.cuenta) {
            this.state.teorico.usd = this.Config.cuenta.saldo_dolares || 0;
            this.state.teorico.nio = this.Config.cuenta.saldo || 0;
        }
    }

    render = () => {
        // Limpiar contenido principal manteniendo el estilo
        const mainContent = this.querySelector(".crc-main");
        if (mainContent) mainContent.remove();

        let content;
        switch (this.state.view) {
            case 'loading':
                content = this.renderLoading();
                break;
            case 'apertura':
                content = this.renderApertura();
                break;
            case 'dashboard':
                content = this.renderDashboard();
                break;
            case 'cierre':
                content = this.renderCierre();
                break;
        }
        if (content) {
            this.append(content);
        }
    }

    renderLoading = () => {
        return html`<div class="crc-main crc-loading">Cargando estado de caja...</div>`;
    }

    // ==========================================
    // VISTA: APERTURA
    // ==================================
    // ========
    renderApertura = () => {
        const usdContainer = html`<div class="crc-currency-section">
                <div class="crc-currency-header">
                    <span class="crc-badge crc-badge-usd">USD</span>
                    <span class="crc-total">Total: $${this.calculateTotal('apertura', 'usd').toFixed(2)}</span>
                </div>
                <div class="crc-grid crc-grid-usd">
                    ${this.USD_DENOMS.map(d => this.renderDenomCard('apertura', 'usd', d, '$'))}
                </div>
            </div>`;
        const nioContainer = html`<div class="crc-currency-section">
                <div class="crc-currency-header">
                    <span class="crc-badge crc-badge-nio">NIO</span>
                    <span class="crc-total">Total: C$${this.calculateTotal('apertura', 'nio').toFixed(2)}</span>
                </div>
                <div class="crc-grid crc-grid-nio">
                    ${this.NIO_DENOMS.map(d => this.renderDenomCard('apertura', 'nio', d, 'C$'))}
                </div>
            </div>`
        return html`<div class="crc-main crc-container">
            <div class="crc-header-section">
                <h2 class="crc-title">Apertura de Caja</h2>
                <p class="crc-subtitle">Cuenta: <strong>${this.Config?.cuenta?.nombre}</strong>. Ingrese el fondo inicial.</p>
            </div>
            ${this.Config?.cuenta.permite_dolares ? usdContainer : ""}
            ${this.Config?.cuenta.permite_cordobas ? nioContainer : ""}
            <div class="crc-actions">                
                <button class="crc-btn crc-btn-primary" onclick="${() => this.confirmApertura()}">
                    Confirmar Apertura
                </button>
            </div>
        </div>`;
    }

    // ==========================================
    // VISTA: DASHBOARD
    // ==========================================
    renderDashboard = () => {
        const cuenta = this.Config?.cuenta;
        //const Options = [];
        /*if (WSecurity.HavePermission(Permissions.GESTION_MOVIMIENTOS)) {
            Options.push(html`<button class="crc-btn crc-btn-dark" onclick="${() => this.setView('cierre')}">Ingresar montos</button>`)
            Options.push(html`<button class="crc-btn crc-btn-dark" onclick="${() => this.setView('cierre')}">Egresar montos</button>`)
        }*/
        const nav = new WAppNavigator({
            NavStyle: "tab",
            Inicialize: true,
            Elements: [
                {
                    name: "Invetario $", action: () => this.InventarioDetail(this.Config?.inventario
                        .filter(inv => inv.Denominacion_Catalogo?.moneda == MonedaEnum.DOLARES) ?? [])
                },
                {
                    name: "Invetario C$", action: () => this.InventarioDetail(this.Config?.inventario
                        .filter(inv => inv.Denominacion_Catalogo?.moneda == MonedaEnum.CORDOBAS) ?? [])
                }

            ]
        })
        return html`<div class="crc-main">
            <div class="crc-container">
                <div class="crc-status-banner crc-status-open">
                    <div class="crc-status-icon">✓</div>
                    <div>
                        <h3>Caja Abierta</h3>
                        <p>Cuenta: ${cuenta?.nombre} | Saldo Actual Teórico</p>
                    </div>
                </div>
                <div class="crc-stats-grid">
                    <div class="crc-stat-card">
                        <p class="crc-stat-label">Saldo Córdobas (Teórico)</p>
                        <p class="crc-stat-value crc-text-nio">C$ ${this.state.teorico.nio.toFixed(2)}</p>
                    </div>
                    <div class="crc-stat-card">
                        <p class="crc-stat-label">Saldo Dólares (Teórico)</p>
                        <p class="crc-stat-value crc-text-usd">$ ${this.state.teorico.usd.toFixed(2)}</p>
                    </div>
                </div>
                <div class="crc-card crc-info-card">
                    <h3>Resumen del Corte</h3>
                    <p>ID Corte: ${this.state.corteActual?.id_corte_caja}</p>
                    <p>Fecha Apertura: ${this.state.corteActual?.fecha_apertura ? new Date(this.state.corteActual.fecha_apertura).toLocaleString() : 'N/A'}</p>
                </div>
                ${nav}
                <div class="crc-actions crc-actions-end">                    
                    <button class="crc-btn crc-btn-dark" onclick="${() => this.setView('cierre')}">
                        Iniciar Cierre de Caja
                    </button>
                </div>
            </div>
        </div>`;
    }

    /**
     * @param {Inventario_Denominacion_Caja[]} inventario
     */
    InventarioDetail(inventario) {

        const currecy = inventario[0]?.Denominacion_Catalogo?.moneda == MonedaEnum.DOLARES ? "USD" : "NIO"
        return html`<div class="denom-detail-container">
            <style>
                .denom-detail-container {
                    display: flex;
                    flex-direction: column;
                    .title {
                        font-weight: bold;
                    }
                    .denom-detail  {
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        div {
                            padding: 5px;
                            border: 1px solid #eee;
                        }
                        .money {
                            text-align: right;
                        }
                        .cant {
                            text-align: center;
                        }
                    }                 
                }
            </style>
            <div class="denom-detail title">  
                <div>Moneda</div>
                <div>Valor Moneda</div>
                <div>Cantidad</div>
                <div>Monto total</div>
            </div>
            ${inventario.map(inv => html`<div class="denom-detail">
                <div>${inv.Denominacion_Catalogo?.moneda}</div>
                <div class="money">${new Money(inv.Denominacion_Catalogo?.valor, currecy).toString()}</div>
                <div class="cant">${inv.cantidad_actual}</div>
                <div class="money">${new Money(inv.Denominacion_Catalogo?.valor, currecy).multiply(inv.cantidad_actual).toString()}</div>
            </div>`)}
        </div>`
    }

    // ==========================================
    // VISTA: CIERRE
    // ==========================================
    renderCierre = () => {
        const diffUsd = this.calculateTotal('cierre', 'usd') - this.state.teorico.usd;
        const diffNio = this.calculateTotal('cierre', 'nio') - this.state.teorico.nio;

        return html`<div class="crc-main">
            <div class="crc-container">
                <div class="crc-header-section">
                    <h2 class="crc-title">Cierre de Caja (Arqueo)</h2>
                    <p class="crc-subtitle">Compare el conteo físico con el saldo teórico.</p>
                </div>

                <div class="crc-comparison-grid">
                    ${this.renderComparisonCard('USD', this.state.teorico.usd, this.calculateTotal('cierre', 'usd'), diffUsd, '$')}
                    ${this.renderComparisonCard('NIO', this.state.teorico.nio, this.calculateTotal('cierre', 'nio'), diffNio, 'C$')}
                </div>

                <div class="crc-card">
                    <h3 class="crc-section-title">Conteo Físico</h3>
                    
                    <div class="crc-currency-section">
                        <h4>Dólares (USD)</h4>
                        <div class="crc-grid crc-grid-usd">
                            ${this.USD_DENOMS.map(d => this.renderDenomCard('cierre', 'usd', d, '$'))}
                        </div>
                    </div>

                    <div class="crc-currency-section">
                        <h4>Córdobas (NIO)</h4>
                        <div class="crc-grid crc-grid-nio">
                            ${this.NIO_DENOMS.map(d => this.renderDenomCard('cierre', 'nio', d, 'C$'))}
                        </div>
                    </div>
                </div>

                <div class="crc-card">
                    <h3 class="crc-section-title">Observaciones</h3>
                    <textarea 
                        class="crc-textarea" 
                        placeholder="Justifique diferencias o eventos relevantes..."
                        onchange="${(/** @type {{ target: { value: any; }; }} */ e) => this.state.cierre.notes = e.target.value}">${this.state.cierre.notes}</textarea>
                </div>

                <div class="crc-actions crc-actions-split">
                    <button class="crc-btn crc-btn-secondary" onclick="${() => this.setView('dashboard')}">Cancelar</button>
                    <button class="crc-btn crc-btn-primary" onclick="${() => this.confirmCierre()}">
                        Finalizar Cierre
                    </button>
                </div>
            </div>
        </div>`;
    }

    renderComparisonCard = (/** @type {string} */ currency,
        /** @type {number} */ teorico,
        /** @type {number} */ fisico,
        /** @type {number} */ diff,
        /** @type {string} */ symbol) => {
        let diffClass = 'crc-diff-neutral';
        let diffLabel = 'Cuadrado';
        if (diff > 0.01) { diffClass = 'crc-diff-surplus'; diffLabel = 'Sobrante'; }
        else if (diff < -0.01) { diffClass = 'crc-diff-missing'; diffLabel = 'Faltante'; }

        return html`<div class="crc-card crc-comparison-card">
            <h4>${currency}</h4>
            <div class="crc-row"><span>Teórico:</span> <strong>${symbol}${teorico.toFixed(2)}</strong></div>
            <div class="crc-row"><span>Físico:</span> <strong>${symbol}${fisico.toFixed(2)}</strong></div>
            <div class="crc-row crc-diff-row">
                <span>Diferencia:</span>
                <span class="crc-badge-diff ${diffClass}">${diffLabel}: ${symbol}${Math.abs(diff).toFixed(2)}</span>
            </div>
        </div>`;
    }

    renderDenomCard = (/** @type {string} */ context, /** @type {string} */ currency, /** @type { Denominacion_Catalogo} */ denom, /** @type {string} */ symbol) => {
        // @ts-ignore
        const count = this.state[context][currency][denom.id_denominacion];
        const subtotal = count * (denom.valor ?? 0);

        return html`<div class="crc-denom-card">
            <span class="crc-denom-value">${symbol}${denom.valor}</span>
            <div class="crc-denom-controls">
                <button class="crc-btn-icon" onclick="${() => this.updateDenom(context, currency, denom, -1)}">-</button>
                <input type="number" class="crc-input-count" onchange="${(/** @type {{ target: { value: number; }; }} */ ev) => this.updateDenom(context, currency, denom, ev.target.value)}" value="${count}"/>
                <button class="crc-btn-icon crc-btn-icon-primary" onclick="${() => this.updateDenom(context, currency, denom, 1)}">+</button>
            </div>
            <span class="crc-denom-subtotal">${new Money(subtotal).toString()}</span>
        </div>`;
    }

    // ==========================================
    // LÓGICA
    // ==========================================

    setView = (/** @type {string} */ view) => {
        this.state.view = view;
        this.render();
    }

    updateDenom = (/** @type {string} */ context, /** @type {string} */ currency,
        /** @type {Denominacion_Catalogo} */ denom, /** @type {number} */ change) => {
        if (change < 0) {
            change = 0;
        }
        const newCount = change > 1
            ? change
            : this.state[context][currency][denom.id_denominacion] + change;
        if (newCount < 0) return;

        this.state[context][currency][denom.id_denominacion] = newCount;
        this.render();
    }

    calculateTotal = (/** @type {string} */ context, /** @type {string} */ currency) => {
        const denoms = currency === 'usd' ? this.USD_DENOMS : this.NIO_DENOMS;
        return denoms.reduce((sum, d) => sum + (this.state[context][currency][d.id_denominacion] * (d.valor ?? 0)), 0);
    }

    /**
     * Prepara la lista de Denominacion_Caja para enviar al backend
     * @param {string} context 
     * @param {string} currency 
     * @param {string} moneda 
     */
    buildDenominationsList = (context, currency, moneda) => {
        const denoms = currency === 'usd' ? this.USD_DENOMS : this.NIO_DENOMS;
        /**
         * @type {Denominacion_Caja[]}
         */
        const list = [];

        denoms.forEach(val => {
            const qty = this.state[context][currency][val.id_denominacion];
            if (qty > 0) {
                const item = new Denominacion_Caja();
                item.cantidad = qty;
                item.subtotal = qty * (val.valor ?? 0);
                item.id_denominacion = val.id_denominacion;

                //item.Denominacion_Catalogo = { valor: val, moneda: moneda }; // Estructura auxiliar
                list.push(item);
            }
        });
        return list;
    }

    confirmApertura = async () => {
        const totalUsd = this.calculateTotal('apertura', 'usd');
        const totalNio = this.calculateTotal('apertura', 'nio');

        if (totalUsd === 0 && totalNio === 0) {
            WAlertMessage.Warning("El fondo de caja no puede ser cero.");
            return;
        }

        const corte = new Corte_Caja();
        corte.id_cuenta = this.Config?.cuenta?.id_cuentas ?? null;
        corte.monto_inicial_dolares = totalUsd;
        corte.monto_inicial_cordobas = totalNio;
        corte.Denominaciones_Apertura = [
            ...this.buildDenominationsList('apertura', 'usd', 'DOLARES'),
            ...this.buildDenominationsList('apertura', 'nio', 'CORDOBAS')
        ];
        corte.estado = EstadoCorteCaja.ABIERTO;

        try {
            const response = await corte.AbrirCaja();
            if (response.status == 200) {
                WAlertMessage.Success("Caja abierta exitosamente.");
                this.state.corteActual = corte;
                this.updateTeoricoFromCuenta(); // Asumimos que la cuenta se actualiza o usamos los montos iniciales
                this.setView('dashboard');
                if (this.Config?.action) this.Config.action(corte);
            } else {
                WAlertMessage.Danger(response.message || "Error al abrir caja");
            }
        } catch (error) {
            WAlertMessage.Danger("Error de conexión al abrir caja.");
        }
    }

    confirmCierre = async () => {
        if (!this.state.corteActual) return;

        const corte = this.state.corteActual;
        corte.monto_fisico_dolares = this.calculateTotal('cierre', 'usd');
        corte.monto_fisico_cordobas = this.calculateTotal('cierre', 'nio');

        // Calculo de diferencias
        corte.diferencia_dolares = corte.monto_fisico_dolares - (corte.monto_esperado_dolares || this.state.teorico.usd);
        corte.diferencia_cordobas = corte.monto_fisico_cordobas - (corte.monto_esperado_cordobas || this.state.teorico.nio);

        corte.observaciones_cierre = this.state.cierre.notes;
        corte.Denominaciones_Cierre = [
            ...this.buildDenominationsList('cierre', 'usd', 'DOLARES'),
            ...this.buildDenominationsList('cierre', 'nio', 'CORDOBAS')
        ];

        try {
            const response = await corte.CerrarCaja();
            if (response.success) {
                WAlertMessage.Success("Cierre de caja registrado.");
                // Resetear estado para permitir nueva apertura o recargar
                this.state.corteActual = null;
                this.setView('apertura');
                if (this.Config?.action) this.Config.action(corte);
            } else {
                WAlertMessage.Danger(response.message || "Error al cerrar caja");
            }
        } catch (error) {
            WAlertMessage.Danger("Error de conexión al cerrar caja.");
        }
    }
}

const WCashRegisterStyle = css`
    :host {
        display: block;
        font-family: 'Inter', system-ui, sans-serif;
        color: #1e293b;
        --primary: #4f46e5;
        --primary-hover: #4338ca;
        --success: #16a34a;
        --danger: #dc2626;
        --warning: #d97706;
        --bg-body: #f8fafc;
        --bg-card: #ffffff;
        --border: #e2e8f0;
        --text-muted: #64748b;
    }

    .crc-main {
        background-color: var(--bg-body);
        min-height: 100%;
        padding: 20px;
        box-sizing: border-box;
        border-radius: 10px;
    }

    .crc-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 200px;
        font-size: 1.2rem;
        color: var(--text-muted);
    }

    .crc-container {
        max-width: 1400px;
        margin: 0 auto;
    }

    .crc-card {
        background: var(--bg-card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 24px;
        margin-bottom: 20px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .crc-header-section { margin-bottom: 24px; }
    .crc-title { font-size: 1.5rem; font-weight: 700; margin: 0 0 8px 0; color: #0f172a; }
    .crc-subtitle { color: var(--text-muted); margin: 0; font-size: 0.9rem; }
    .crc-section-title { font-size: 1.1rem; font-weight: 600; margin: 0 0 16px 0; }

    /* Status Banner */
    .crc-status-banner {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px;
        border-radius: 12px;
        margin-bottom: 20px;
        border: 1px solid;
    }
    .crc-status-open { background: #f0fdf4; border-color: #bbf7d0; color: #166534; }
    .crc-status-icon {
        width: 40px; height: 40px;
        background: #dcfce7; color: var(--success);
        border-radius: 50%; display: flex; align-items: center; justify-content: center;
        font-weight: bold; font-size: 1.2rem;
    }
    .crc-status-banner h3 { margin: 0; font-size: 1.1rem; }
    .crc-status-banner p { margin: 0; font-size: 0.85rem; opacity: 0.8; }

    /* Stats Grid */
    .crc-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 20px; }
    .crc-stat-card { background: white; padding: 20px; border-radius: 12px; border: 1px solid var(--border); }
    .crc-stat-label { font-size: 0.85rem; color: var(--text-muted); margin: 0 0 8px 0; }
    .crc-stat-value { font-size: 1.5rem; font-weight: 700; margin: 0; }
    .crc-text-usd { color: var(--success); }
    .crc-text-nio { color: #2563eb; }

    /* Currency Sections */
    .crc-currency-section { margin-bottom: 24px; }
    .crc-currency-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .crc-currency-header h4 { margin: 0; font-size: 1rem; font-weight: 600; }
    .crc-badge { padding: 4px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; color: white; }
    .crc-badge-usd { background: var(--success); }
    .crc-badge-nio { background: #2563eb; }
    .crc-total { font-size: 1.1rem; font-weight: 700; color: #0f172a; }

    /* Grid & Denom Cards */
    .crc-grid { display: grid; gap: 12px; }
    .crc-grid-usd { grid-template-columns: repeat(6, minmax(200px, 1fr)); }
    .crc-grid-nio { grid-template-columns: repeat(6, minmax(200px, 1fr)); }

    .crc-denom-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 12px;
        display: grid;
        grid-template-columns: 65px calc(100% - 70px);
        align-items: center;
        transition: all 0.2s;
        gap: 5px;
        .tp-denom-subtotal {
            grid-column: span 2;
        }
    }
    .crc-denom-card:hover { border-color: #cbd5e1; }
    .crc-denom-value { font-size: 1.1rem; font-weight: 700; margin-bottom: 8px; color: #334155; }
    
    .crc-denom-controls { display: flex; align-items: center; gap: 8px; width: 100%; justify-content: center; }
    .crc-btn-icon {
        width: 28px; height: 28px;
        border: 1px solid #cbd5e1; background: white;
        border-radius: 6px; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        font-weight: bold; color: #475569;
        transition: all 0.2s;
    }
    .crc-btn-icon:hover { background: #f1f5f9; }
    .crc-btn-icon-primary { background: var(--primary); color: white; border-color: var(--primary); }
    .crc-btn-icon-primary:hover { background: var(--primary-hover); }
    
    .crc-input-count {
        width: 40px; text-align: center;
        border: none; background: transparent;
        font-weight: 600; font-size: 1rem;
        -moz-appearance: textfield;
    }
    .crc-input-count::-webkit-outer-spin-button,
    .crc-input-count::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

    .crc-denom-subtotal { font-size: 0.8rem; color: var(--text-muted); margin-top: 8px; font-weight: 500; }

    /* Comparison Cards (Cierre) */
    .crc-comparison-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 20px; }
    .crc-comparison-card h4 { margin-top: 0; border-bottom: 1px solid var(--border); padding-bottom: 8px; }
    .crc-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.95rem; }
    .crc-diff-row { margin-top: 12px; padding-top: 12px; border-top: 1px dashed var(--border); font-weight: 600; }
    
    .crc-badge-diff { padding: 4px 8px; border-radius: 20px; font-size: 0.8rem; border: 1px solid; }
    .crc-diff-neutral { background: #f0fdf4; color: var(--success); border-color: #bbf7d0; }
    .crc-diff-surplus { background: #fffbeb; color: var(--warning); border-color: #fde68a; }
    .crc-diff-missing { background: #fef2f2; color: var(--danger); border-color: #fecaca; }

    /* Forms & Actions */
    .crc-textarea {
        width: 100%; min-height: 80px;
        padding: 12px; border: 1px solid var(--border);
        border-radius: 8px; font-family: inherit;
        resize: vertical; box-sizing: border-box;
    }
    .crc-textarea:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2); }

    .crc-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
    .crc-actions-end { justify-content: flex-end; }
    .crc-actions-split { justify-content: space-between; }

    .crc-btn {
        padding: 10px 20px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        border: 1px solid transparent;
        transition: all 0.2s;
        font-size: 0.95rem;
    }
    .crc-btn-primary { background: var(--primary); color: white; }
    .crc-btn-primary:hover { background: var(--primary-hover); }
    .crc-btn-secondary { background: white; border-color: var(--border); color: #334155; }
    .crc-btn-secondary:hover { background: #f8fafc; }
    .crc-btn-dark { background: #0f172a; color: white; }
    .crc-btn-dark:hover { background: #1e293b; }

    /* Info Card */
    .crc-info-card p { margin: 4px 0; font-size: 0.9rem; color: var(--text-muted); }
    .crc-info-card strong { color: #0f172a; }
`;

customElements.define("w-cash-register-control", WCashRegisterControl);
export { WCashRegisterControl };
