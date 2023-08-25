//@ts-check
import { Cuota, ValoracionesContrato } from "../FrontModel/Model.js";
import { WArrayF } from "../WDevCore/WModules/WComponentsTools.js";


class AmoritizationModule {
    /**
     * @param {ValoracionesContrato} contrato
     * @returns {ValoracionesContrato}
     */
    static calculoAmortizacion = (contrato) => {
        if (contrato.Catalogo_Clientes == undefined || contrato.Detail_Prendas == undefined) {
            return new ValoracionesContrato();
        }
        //console.log(contrato.Detail_Prendas);

        contrato.valoracion_compra_cordobas = AmoritizationModule.round(WArrayF.SumValAtt(contrato.Detail_Prendas.map(p => p.Transactional_Valoracion), "valoracion_compra_cordobas"));
        contrato.valoracion_compra_dolares = AmoritizationModule.round(WArrayF.SumValAtt(contrato.Detail_Prendas.map(p => p.Transactional_Valoracion), "valoracion_compra_dolares"));
        contrato.valoracion_empeño_cordobas = AmoritizationModule.round(WArrayF.SumValAtt(contrato.Detail_Prendas.map(p => p.Transactional_Valoracion), "valoracion_empeño_cordobas"));
        contrato.valoracion_empeño_dolares = AmoritizationModule.round(WArrayF.SumValAtt(contrato.Detail_Prendas.map(p => p.Transactional_Valoracion), "valoracion_empeño_dolares"));
        contrato.taza_interes_cargos = contrato.taza_interes_cargos ?? 0.9
        contrato.tasas_interes = (parseFloat(contrato.Catalogo_Clientes.Catalogo_Clasificacion_Interes.porcentaje) + contrato.taza_interes_cargos) / 100;
        contrato.plazo = contrato.plazo ?? 1;
        contrato.fecha = new Date();
        contrato.Transaction_Facturas = new Array();
        contrato.Detail_Prendas = contrato.Detail_Prendas;
        contrato.gestion_crediticia = contrato.Catalogo_Clientes.Catalogo_Clasificacion_Interes.porcentaje ?? 6;

        AmoritizationModule.crearCuotas(contrato);

        contrato.total_pagar_cordobas = (WArrayF.SumValAtt(contrato.Transaction_Facturas, "total"));
        contrato.total_pagar_dolares = (WArrayF.SumValAtt(contrato.Transaction_Facturas, "total") / contrato.taza_cambio);

        contrato.interes = (WArrayF.SumValAtt(contrato.Transaction_Facturas, "interes"));
        contrato.interes_dolares = (WArrayF.SumValAtt(contrato.Transaction_Facturas, "interes") / contrato.taza_cambio);
        return contrato;
    }

    static getPago = (contrato) => {
        const monto = contrato.valoracion_empeño_cordobas;
        console.log(monto);
        const cuotas = contrato.plazo;
        const tasa = contrato.tasas_interes;
        const payment = ((tasa * Math.pow(1 + tasa, cuotas)) * monto) / (Math.pow(1 + tasa, cuotas) - 1);
        return payment;
    }
    static getPagoValoracion = (valoracion) => {
        const monto = valoracion.valoracion_empeño_cordobas;
        const cuotas = valoracion.Plazo ?? 0;
        const tasa = (valoracion.Tasa_interes ?? 0) / 100;
        //console.log(monto, cuotas, tasa);
        const payment = ((tasa * Math.pow(1 + tasa, cuotas)) * monto) / (Math.pow(1 + tasa, cuotas) - 1);
        return payment.toString() == "NaN" ? 0 : payment;
    }

    static crearCuotas(contrato) {
        contrato.cuotafija = this.getPago(contrato);
        contrato.cuotafija_dolares = contrato.cuotafija / contrato.taza_cambio;
        let capital = (parseFloat(contrato.valoracion_empeño_dolares));
        for (let index = 0; index < contrato.plazo; index++) {
            const abono_capital = (parseFloat(contrato.cuotafija_dolares) - (capital * contrato.tasas_interes));
            //console.log(abono_capital);
            const cuota = new Cuota({
                // @ts-ignore
                fecha: contrato.fecha.modifyMonth(index + 1),
                // @ts-ignore
                total: contrato.cuotafija_dolares.toFixed(2),
                // @ts-ignore
                interes: (capital * contrato.tasas_interes).toFixed(2),
                // @ts-ignore
                abono_capital: abono_capital.toFixed(2),
                // @ts-ignore
                capital_restante: ((capital - abono_capital) < 0 ? 0 : (capital - abono_capital)).toFixed(2),
                // @ts-ignore
                tasa_cambio: contrato.taza_cambio
            });
            capital = parseFloat((capital - abono_capital).toFixed(2));
            contrato.Transaction_Facturas.push(cuota);
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
}
export { AmoritizationModule }