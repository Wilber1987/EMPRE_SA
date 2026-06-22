//@ts-check

// @ts-ignore
import { ModelProperty } from "../../WDevCore/WModules/CommonModel.js";
import { DateTime } from "../../WDevCore/WModules/Types/DateTime.js";
import { Money } from "../../WDevCore/WModules/Types/Money.js";


export class Order_ModelComponent {
    /**
    * @param {Partial<Order_ModelComponent>} props 
    */
    constructor(props) {
        Object.assign(this, props);
    }
    /**@type {ModelProperty} */
    Code = {
        type: "text",
        label: "Código de Orden",
        require: true,
        disabled: true
    };
    /**@type {ModelProperty} */
    type = {
        type: "text",
        label: "Tipo de Orden",
        require: true,
        Dataset: ["EMPEÑO", "COMPRA", "VENTA", "SERVICIO"]
    };
    /**@type {ModelProperty} */
    direction = {
        type: "text",
        label: "Dirección",
        require: true,
        Dataset: ["DESEMBOLSO", "INGRESO"]
    };
    /**@type {ModelProperty} */
    amountUSD = {
        type: "MONEY",
        label: "Monto en USD",
        require: true,
        min: 0
    };
    /**@type {ModelProperty} */
    client = {
        type: "text",
        label: "Cliente",
        require: true
    };
    /**@type {ModelProperty} */
    status = {
        type: "text",
        label: "Estado",
        defaultValue: "PENDIENTE",
        Dataset: ["PENDIENTE", "PROCESADA", "CANCELADA"]
    };
    /**@type {ModelProperty} */
    liquidationMode = {
        type: "text",
        label: "Modo de Liquidación",
        Dataset: ["USD", "NIO", "MIXED"]
    };
    /**@type {ModelProperty} */
    liquidationUsd = {
        type: "MONEY",
        label: "Monto Liquidado USD",
        defaultValue: 0
    };
    /**@type {ModelProperty} */
    liquidationNio = {
        type: "MONEY",
        label: "Monto Liquidado NIO",
        defaultValue: 0
    };
    /**@type {ModelProperty} */
    denominationsUSD = {
        type: "text",
        label: "Denominaciones USD",
        defaultValue: "{}"
    };
    /**@type {ModelProperty} */
    denominationsNIO = {
        type: "text",
        label: "Denominaciones NIO",
        defaultValue: "{}"
    };
    /**@type {ModelProperty} */
    createdAt = {
        type: "DATETIME",
        label: "Fecha de Creación"
    };
    /**@type {ModelProperty} */
    processedAt = {
        type: "DATETIME",
        label: "Fecha de Procesamiento"
    };

    static fromObject(data) {
        const order = new Order();
        Object.assign(order, data);
        return order;
    }
}


export class Order {
    /**
     * @param {Partial<Order>} [props] 
     */
    constructor(props) {
        /**
         * @type {Order[]}
         */
        this.orders = [];
        this.exchangeRate = 36.50;
        Object.assign(this, props);
    }

    /**@type {String?} */ Code = null;
    /**@type {String?} */ type = null;
    /**@type {String?} */ direction = null;
    /**@type {Money?} */ amountUSD = null;
    /**@type {String?} */ client = null;
    /**@type {String?} */ status = null;
    /**@type {DateTime?} */ createdAt = null;
    /**@type {DateTime?} */  processedAt = null;

    /**@type {String?} */ liquidationMode = null;
    /**@type {Number?} */ liquidationUsd = null;
    /**@type {Number?} */ liquidationNio = null;
    /**@type {String?} */ denominationsUSD = null;
    /**@type {String?} */ denominationsNIO = null;

    /**
     * Obtiene todas las órdenes pendientes
     * @returns {Promise<Array<Order>>}
     */
    async GetPending() {
        // Simulación - En producción vendría de API
        return this.orders.filter(o => o.status === "PENDIENTE");
    }

    /**
     * Obtiene todas las órdenes
     * @returns {Promise<Array<Order>>}
     */
    async Get() {
        return this.orders;
    }

    /**
     * Busca una orden por ID
     * @param {String} id
     * @returns {Promise<Order|null>}
     */
    async GetById(id) {
        return this.orders.find(o => o.Code === id) || null;
    }

    /**
     * Guarda o actualiza una orden
     * @param {Order} order
     * @returns {Promise<boolean>}
     */
    async Save(order) {
        const index = this.orders.findIndex(o => o.Code === order.Code);
        if (index >= 0) {
            this.orders[index] = order;
        } else {
            this.orders.push(order);
        }
        return true;
    }

    /**
     * Procesa una orden
     * @param {Order} order
     * @returns {Promise<boolean>}
     */
    async Process(order) {
        order.status = "PROCESADA";
        order.processedAt = new DateTime();
        return await this.Save(order);
    }

    /**
     * Carga datos de prueba
     */
    LoadMockData() {
        this.orders = [
            new Order({
                Code: 'EMP-2026-001',
                type: 'EMPEÑO',
                direction: 'DESEMBOLSO',
                amountUSD: new Money(100.00),
                client: 'Juan Pérez',
                status: 'PENDIENTE',
                createdAt: new DateTime()
            }),
            new Order({
                Code: 'COMP-2026-002',
                type: 'COMPRA',
                direction: 'DESEMBOLSO',
                amountUSD: new Money(250.00),
                client: 'María López',
                status: 'PENDIENTE',
                createdAt: new DateTime()
            }),
            new Order({
                Code: 'VTA-2026-003',
                type: 'VENTA',
                direction: 'INGRESO',
                amountUSD: new Money(50.00),
                client: 'Carlos Ruiz',
                status: 'PENDIENTE',
                createdAt: new DateTime()
            }),
            new Order({
                Code: 'SER-2026-004',
                type: 'SERVICIO',
                direction: 'INGRESO',
                amountUSD: new Money(15.00),
                client: 'Ana García',
                status: 'PENDIENTE',
                createdAt: new DateTime()
            })
        ];
    }

    /**
     * @returns {number}
     */
    GetExchangeRate() {
        return this.exchangeRate;
    }
}