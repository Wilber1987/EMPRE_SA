//@ts-check

import { css } from "../../WDevCore/WModules/WStyledRender.js";

export const WTransactionProcessorStyle = css`
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
        max-height: 600px;
    }

    .tp-order-card {
        padding: 10px;
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

    .tp-cliente-name {
        font-size: 12px;
        opacity: 0.8;
        padding: 0px;
        margin: 0px;
    }

    .tp-order-amount {
        font-weight: bold;
        font-size: 18px;
        padding:0px;
        margin: 10px 0 0 0;
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
        grid-template-columns: calc(100% - 680px) 670px;
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
        font-size: 9px;
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

    .tp-badge-direccion {
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

    .tp-cliente-info {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #64748b;
        font-size: 14px;
        margin-top: 4px;
    }

    .tp-cliente-info svg {
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
        font-size: 18px;
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
        padding-left: 35px !important;
        outline: none;
        margin-top: 24px;
        display: none;
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
        grid-template-columns: repeat(4, 1fr);
        gap: 0px;
    }

    .tp-denom-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        padding: 5px;
        display: grid;
        grid-template-columns: 40px calc(100% - 40px);
        align-items: center;
        transition: all 0.2s;
        gap: 1px;
        .tp-denom-subtotal {
            grid-column: span 2;
            display: none;
        }
    }

    .tp-denom-value {
        font-size: 12px;
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
        padding: 5px !important;
        font-size: 12px !important;
        min-height: unset !important;
        -webkit-appearance: none;
        margin: 0;
    }

    .tp-denom-count[type="number"]::-webkit-outer-spin-button,
    .tp-denom-count[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
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