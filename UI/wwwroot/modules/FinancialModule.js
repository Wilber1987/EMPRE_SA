//@ts-check
import { Transactional_Configuraciones } from "../Admin/ADMINISTRATIVE_ACCESSDataBaseModel.js";
import { Catalogo_Cambio_Divisa } from "../FrontModel/Catalogo_Cambio_Divisa.js";
import {  ValoracionesTransaction } from "../FrontModel/Model.js";
import { ParcialesData } from "../FrontModel/ParcialData.js";
import { Recibos } from "../FrontModel/Recibos.js";
import { Money } from "../WDevCore/WModules/Types/Money.js";
import { WArrayF } from "../WDevCore/WModules/WArrayF.js";
import {Transactional_Valoracion} from "../FrontModel/Transaction_Valoracion.js";
import {Detail_Prendas} from "../FrontModel/Detail_Prendas.js";
import {Transaction_Contratos} from "../FrontModel/Transaction_Contratos.js";
import { Tbl_Cuotas } from "../FrontModel/Tbl_Cuotas_ModelComponent.js";

class FinancialModule {
    /**
     * @param {ValoracionesTransaction} contrato 
     * @param {boolean} [withValoraciones]
     * @param {String} [tipo_contrato]
     * @returns {ValoracionesTransaction}
     */
    static calculoAmortizacion = (contrato, withValoraciones = true, tipo_contrato = "EMPEÑO") => {
        if (contrato.Transaction_Contratos.Catalogo_Clientes == undefined
            || contrato.valoraciones == undefined) {
            return new ValoracionesTransaction();
        }

        contrato.Transaction_Contratos = contrato.Transaction_Contratos ?? new Transaction_Contratos();
        if (withValoraciones) {
            contrato.Transaction_Contratos.Detail_Prendas = contrato.valoraciones.map(
                (/**@type {Transactional_Valoracion}*/ valoracion) => new Detail_Prendas({
                    Descripcion: valoracion.Descripcion,
                    modelo: valoracion.Modelo,
                    marca: valoracion.Marca,
                    serie: valoracion.Serie,
                    monto_aprobado_cordobas: valoracion.Valoracion_empeño_cordobas,
                    monto_aprobado_dolares: valoracion.Valoracion_empeño_dolares,
                    color: "#000",
                    en_manos_de: tipo_contrato == "EMPEÑO" ? "ACREEDOR" : "DEUDOR",
                    precio_venta: valoracion.Precio_venta_empeño_dolares,
                    Catalogo_Categoria: valoracion.Catalogo_Categoria,
                    Transactional_Valoracion: valoracion
                }));
        }

        FinancialModule.CalculeTotales(contrato);
        FinancialModule.crearCuotas(contrato);

        const totalDolaresMoney = WArrayF.sumMoney(
            contrato.Transaction_Contratos.Tbl_Cuotas,
            "total",
            'USD'
        );

        const interesMoney = WArrayF.sumMoney(
            contrato.Transaction_Contratos.Tbl_Cuotas,
            "interes",
            'USD'
        );
        const tasaCambio = contrato.Transaction_Contratos.taza_cambio;

        const totalCordobasMoney = totalDolaresMoney.multiply(tasaCambio);

        contrato.Transaction_Contratos.total_pagar_dolares = totalDolaresMoney.toNumber();
        contrato.Transaction_Contratos.total_pagar_cordobas = totalCordobasMoney.toNumber();
        contrato.Transaction_Contratos.interes = interesMoney.toNumber();

        return contrato;
    }
    /**
     * @param {ValoracionesTransaction} contrato
     */
    static getPago(contrato) {
        const monto = new Money(
            contrato.Transaction_Contratos.Valoracion_empeño_dolares,
            'USD'
        );

        const cuotas = contrato.Transaction_Contratos.plazo;
        const tasa = contrato.Transaction_Contratos.tasas_interes;

        if (tasa === 0) {
            return monto.divide(cuotas).toNumber();
        }

        const factor = Math.pow(1 + tasa, cuotas);

        const payment =
            (tasa * factor * monto.toNumber()) /
            (factor - 1);

        return payment;
    }

    static getPagoValoracion = (/** @type {{ valor_compra_dolares: any; Plazo: number; Tasa_interes: any; }} */ valoracion) => {
        const monto = valoracion.valor_compra_dolares;
        const cuotas = valoracion.Plazo ?? 0;
        const tasa = (valoracion.Tasa_interes ?? 0) / 100;
        //console.log(monto, cuotas, tasa);
        const payment = ((tasa * Math.pow(1 + tasa, cuotas)) * monto) / (Math.pow(1 + tasa, cuotas) - 1);
        return payment.toString() == "NaN" ? 0 : payment;
    }

    /**
     * @param {ValoracionesTransaction} contrato
     */
    static CalculeTotales(contrato) {

        const prendas = contrato.Transaction_Contratos.Detail_Prendas
            .map((/** @type {{ Transactional_Valoracion: any; }} */ p) => p.Transactional_Valoracion);
        // 💰 SUMAS SEGURAS
        const compraCordobas = WArrayF.sumMoney(prendas, "Valoracion_compra_cordobas", 'NIO');
        const compraDolares = WArrayF.sumMoney(prendas, "Valoracion_compra_dolares", 'USD');
        const empenoCordobas = WArrayF.sumMoney(prendas, "Valoracion_empeño_cordobas", 'NIO');
        const empenoDolares = WArrayF.sumMoney(prendas, "Valoracion_empeño_dolares", 'USD');

        // 🔁 mantener compatibilidad (number)
        contrato.Transaction_Contratos.Valoracion_compra_cordobas =
            contrato.Transaction_Contratos.Valoracion_compra_cordobas ?? compraCordobas.toNumber();

        contrato.Transaction_Contratos.Valoracion_compra_dolares =
            contrato.Transaction_Contratos.Valoracion_compra_dolares ?? compraDolares.toNumber();

        contrato.Transaction_Contratos.Valoracion_empeño_cordobas =
            contrato.Transaction_Contratos.Valoracion_empeño_cordobas ?? empenoCordobas.toNumber();

        contrato.Transaction_Contratos.Valoracion_empeño_dolares =
            contrato.Transaction_Contratos.Valoracion_empeño_dolares ?? empenoDolares.toNumber();

        // 🧠 tasa (NO usar parseFloat)
        const porcentaje =
            contrato.Transaction_Contratos?.Catalogo_Clientes
                // @ts-ignore
                ?.Catalogo_Clasificacion_Interes?.porcentaje ?? 0;

        const cargos = contrato.Transaction_Contratos?.taza_interes_cargos ?? 0;

        contrato.Transaction_Contratos.tasas_interes =
            contrato.Transaction_Contratos.tasas_interes ??
            (Number(porcentaje) + Number(cargos)) / 100;

        // 🔧 defaults
        contrato.Transaction_Contratos.plazo =
            contrato.Transaction_Contratos.plazo ?? 1;

        contrato.Transaction_Contratos.fecha =
            new Date(contrato.Transaction_Contratos.fecha);

        contrato.Transaction_Contratos.Tbl_Cuotas = [];

        contrato.Transaction_Contratos.gestion_crediticia =
            contrato.Transaction_Contratos.gestion_crediticia ??
            porcentaje ?? 6;
    }

    /**
     * @param {ValoracionesTransaction} contrato
     */
    static crearCuotas(contrato) {
        const tasa = contrato.Transaction_Contratos.tasas_interes;
        const plazo = contrato.Transaction_Contratos.plazo;
        const tasaCambio = contrato.Transaction_Contratos.taza_cambio;
        // 💰 usar Money
        let capital = new Money(
            contrato.Transaction_Contratos.Valoracion_empeño_dolares,
            'USD'
        );
        const cuotaFija = new Money(this.getPago(contrato), 'USD');
        contrato.Transaction_Contratos.cuotafija_dolares = cuotaFija.toNumber();
        contrato.Transaction_Contratos.cuotafija = cuotaFija.multiply(tasaCambio).toNumber();
        for (let index = 0; index < plazo; index++) {
            let interes = capital.multiply(tasa);
            let abonoCapital;
            let cuotaTotal;
            if (index === plazo - 1) {
                // última cuota: mantener cuota fija
                abonoCapital = capital;

                // recalcular interés para que:
                // cuota fija = interés + capital
                interes = cuotaFija.subtract(abonoCapital);

                cuotaTotal = cuotaFija; // ✅ sigue fija
            } else {
                interes = capital.multiply(tasa);
                abonoCapital = cuotaFija.subtract(interes);
                cuotaTotal = cuotaFija;
            }

            const capitalRestante = capital.subtract(abonoCapital);
            // @ts-ignore
            const cuota = new Tbl_Cuotas({
                fecha: contrato.Transaction_Contratos.fecha.modifyMonth(index + 1),
                total: cuotaTotal.toNumber(),
                interes: interes.toNumber(),
                abono_capital: abonoCapital.toNumber(),
                capital_restante: capitalRestante.toNumber(),
                tasa_cambio: tasaCambio
            });
            capital = capitalRestante;
            contrato.Transaction_Contratos.Tbl_Cuotas.push(cuota);
        }
    }
    /**
     * 
     * @param {number} value 
     * @returns {number}
     */
    static round(value) {
        return value//Math.round(value);
    }
    //CALCULOS DE CONTRACTDATA
    /**
    * @param {Transaction_Contratos} selectContrato 
    * @param {ContractData} contractData
    */
    static UpdateContractData(selectContrato, contractData) {

        const tasaCambio = contractData.tasasCambio[0].Valor_de_venta;

        contractData.cuotasPendientes = selectContrato.Tbl_Cuotas
            .sort((a, b) => a.id_cuota - b.id_cuota)
            .filter(c => c.Estado?.toUpperCase() == "PENDIENTE");

        contractData.cuotasPagadas = selectContrato.Tbl_Cuotas
            .sort((a, b) => a.id_cuota - b.id_cuota)
            .filter(c => c.Estado?.toUpperCase() == "CANCELADO");

        contractData.countPagadas = contractData.cuotasPagadas.length;
        contractData.countPendientes = contractData.cuotasPendientes.length;

        // ---- MORA (igual lógica, no monetaria) ----
        selectContrato.Tbl_Cuotas
            ?.filter(c => c.Estado == "PENDIENTE")
            ?.forEach(cuota => {

                if (contractData.diasMora != null && contractData.diasMora > 0) return;

                const fechaPago = new Date(cuota.fecha);
                fechaPago.setHours(0, 0, 0, 0);

                const ahora = new Date();
                ahora.setHours(23, 59, 0, 0);

                // @ts-ignore
                const diferenciaDias = Math.floor((ahora - fechaPago) / (1000 * 60 * 60 * 24));
                const diasEnMoraFinal = Math.max(diferenciaDias, 0);

                if (diasEnMoraFinal > 0 && contractData.diasMora < diasEnMoraFinal) {
                    contractData.diasMora = diasEnMoraFinal;
                }
            });

        const CuotaActual = contractData.cuotasPendientes[0];

        // 💰 MONEY ZONE
        const mora = WArrayF.sumMoney(contractData.cuotasPendientes, "mora", 'USD');
        const saldo = new Money(selectContrato.saldo ?? 0, 'USD');
        const interesCorriente = new Money(
            FinancialModule.CalcInteresCorriente(CuotaActual, contractData) ?? 0,
            'USD'
        );

        const perdidaDocumento = new Money(
            contractData.Recibo.perdida_de_documento_monto ?? 0,
            'USD'
        );

        const reestructuracion = new Money(
            contractData.Recibo.reestructurar ?? 0,
            'USD'
        );

        // 💰 TOTAL
        const total = mora
            .add(saldo)
            .add(interesCorriente)
            .add(perdidaDocumento)
            .add(reestructuracion);

        // 🔁 backward compatibility
        contractData.MoraActual = mora.toNumber();
        contractData.InteresCorriente = interesCorriente.toNumber();

        contractData.InteresCorriente_Cordobas =
            interesCorriente.multiply(tasaCambio).toNumber();

        contractData.cancelacionValue = total.toNumber();
        contractData.cancelacionValueCordobas =
            total.multiply(tasaCambio).toNumber();

        // ---- LÓGICA DE PAGOS ----

        let pagoMin, pagoMax, pagoActual;

        if (contractData.Recibo.cancelar == true) {

            pagoMin = total;
            pagoMax = total;
            pagoActual = total;

        } else if (contractData.Recibo.reestructurar == true) {

            pagoMin = interesCorriente
                .add(mora)
                .add(reestructuracion)
                .add(perdidaDocumento);

            pagoMax = total;
            pagoActual = pagoMin;

        } else if (contractData.Recibo.solo_interes_mora == true) {

            pagoMin = interesCorriente
                .add(mora)
                .add(perdidaDocumento);

            pagoMax = pagoMin;
            pagoActual = pagoMin;

        } else if (
            contractData.Recibo.solo_abono == true ||
            contractData.Recibo.pago_parcial == true
        ) {

            pagoMin = new Money(1, 'USD').add(perdidaDocumento);
            pagoMax = total;
            pagoActual = pagoMin;

        } else {

            const abonoCapital = new Money(CuotaActual?.abono_capital ?? 0, 'USD');

            pagoMin = interesCorriente;
            pagoMax = total;

            pagoActual = abonoCapital
                .add(interesCorriente)
                .add(mora)
                .add(reestructuracion)
                .add(perdidaDocumento);
        }

        // clamp
        if (pagoActual.greaterThan(pagoMax)) {
            pagoMax = pagoActual;
        }

        // 🔁 salida compatible
        contractData.pagoMinimoDolares = pagoMin.toNumber();
        contractData.pagoMaximoDolares = pagoMax.toNumber();
        contractData.pagoActual = pagoActual.toNumber();

        contractData.pagoMinimoCordobas =
            pagoMin.multiply(tasaCambio).toNumber();

        contractData.pagoMaximoCordobas =
            pagoMax.multiply(tasaCambio).toNumber();

        contractData.pagoActualCordobas =
            pagoActual.multiply(tasaCambio).toNumber();

        console.log(contractData);
    }
    /**
   * @param {Tbl_Cuotas} cuota 
   * @param {ContractData} contractData 
   * @returns {Number}
   */
    static CalcInteresCorriente(cuota, contractData) {

        const saldo = new Money(contractData.Contrato.saldo ?? 0, 'USD');

        const fechaActual = new Date(contractData.Fecha);
        fechaActual.setHours(23, 59, 0, 0);

        const fechaPagoMayorFechaActual = new Date(cuota?.fecha) > fechaActual;

        const cancelarAntesDelPrimerMes =
            contractData.countPagadas == 0 &&
            fechaPagoMayorFechaActual &&
            (contractData.Recibo.cancelar == true || contractData.countPendientes == 1);

        if (
            cancelarAntesDelPrimerMes ||
            (
                contractData.countPendientes > 1 &&
                contractData.Recibo.cancelar != true &&
                contractData.Recibo.reestructurar != true
            ) ||
            (contractData.Recibo.reestructurar == true && fechaPagoMayorFechaActual)
        ) {
            return cuota.interes; // 🔁 compatibilidad
        }

        const fechaInicio = new Date(cuota?.fecha);
        fechaInicio.setHours(0, 0, 0, 0);

        if (fechaActual < fechaInicio) {
            return 0;
        }

        const diferenciaDias = Math.floor(
            // @ts-ignore
            (fechaActual - fechaInicio) / (1000 * 60 * 60 * 24)
        );

        const dias = Math.max(diferenciaDias, 0);

        const tasa = contractData.Contrato.tasas_interes ?? 0;

        // 💡 tasa diaria (sigue siendo number, correcto)
        const tasaDiaria = tasa / 30;

        // 💰 INTERÉS = saldo * tasa * días
        const interesGenerado = saldo
            .multiply(tasaDiaria)
            .multiply(dias);

        const interesBase = new Money(cuota?.interes ?? 0, 'USD');

        let totalInteres = interesGenerado.add(interesBase);

        const parcialesValue =
            contractData.parciales?.pagoParciales > 0
                ? contractData.parciales.pagoParciales
                : 0;

        if (parcialesValue > 0) {
            const parciales = new Money(parcialesValue, 'USD');
            totalInteres = totalInteres.subtract(parciales);
        }

        return totalInteres.toNumber(); // 🔁 salida compatible
    }
    /**
    * @param {ContractData} contractData
    * @param {Transactional_Configuraciones} [reestructureConfig]
    * @returns {ContractData}
    */
    static BuildContractData(contractData, reestructureConfig) {
        //console.log(Contrato);
        const categoria = contractData.Contrato.Detail_Prendas[0].Catalogo_Categoria;
        const plazo = contractData.Contrato.plazo;
        const fecha = new Date(contractData.Contrato.fecha_cancelar);
        let canReestructure = false;

        // @ts-ignore
        let fechaVencida = categoria.plazo_limite > plazo && new Date() >= fecha.subtractDays(parseInt(reestructureConfig?.Valor ?? 0));
        //console.log(fechaVencida, new Date(), fecha.subtractDays(parseInt(reestructureConfig?.Valor ?? 0)));
        if (categoria.descripcion != "vehiculos" && fechaVencida) { //TODO REPARAR FECHA QUITAR ESOS 32 DIAS
            canReestructure = true;
        }
        //console.log(Contrato.Tbl_Cuotas_ModelComponent);
        const existeMora = contractData.Contrato.Tbl_Cuotas?.filter(c => c.Estado == "PENDIENTE" && c.mora != null && c.mora > 0).length > 0;

        contractData.canReestructure = canReestructure
        contractData.canPagoParcial = fechaVencida
        contractData.min = 1
        // @ts-ignore
        contractData.max = categoria.plazo_limite - plazo
        contractData.canSoloAbono = !existeMora
        contractData.soloInteresMora = !canReestructure;

        return contractData;

    }

}
export { FinancialModule }
class PagosInfo {
    constructor() {

    }
}
export { PagosInfo }
class ContractData {
    constructor(transaction_Contratos = new Transaction_Contratos()) {
        this.canReestructure = false;
        this.canSoloAbono = true;
        this.soloInteresMora = true;
        this.min = 0;
        this.max = 0;
        this.InfoPagos = new PagosInfo();
        this.Contrato = transaction_Contratos;
        this.Recibo = new Recibos();
        this.parciales = new ParcialesData();
        this.countPagadas = 0;
        this.countPendientes = 0;
        this.diasMora = 0;
        this.cancelacionValue = 0;
        this.cancelacionValueCordobas = 0;
        this.pagoMinimoDolares = 0;
        this.pagoMaximoDolares = 0;
        this.pagoActual = 0;
        this.pagoMinimoCordobas = 0;
        this.pagoMaximoCordobas = 0;
        this.pagoActualCordobas = 0;
        this.countPagadas = 0;
        this.countPendientes = 0;
        this.MoraActual = 0;
        this.InteresCorriente = 0;
        /**@type {Array<Tbl_Cuotas>} */
        this.cuotasPendientes = [];
        /**@type {Array<Catalogo_Cambio_Divisa>} */
        this.tasasCambio = [];
        this.canPagoParcial = false;
        /**@type {Array<Tbl_Cuotas>} */
        this.cuotasPagadas = [];
        /**@type {Tbl_Cuotas} */
        this.proximaCuota = new Tbl_Cuotas();
        /**@type {Tbl_Cuotas} */
        this.ultimaCuota = new Tbl_Cuotas();
        this.Fecha = new Date();
        this.InteresCorriente_Cordobas = 0;
    }
}
export { ContractData }