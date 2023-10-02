//@ts-check
import { Tbl_Cuotas, Transaction_Contratos, ValoracionesTransaction } from "../FrontModel/Model.js";
import { WArrayF } from "../WDevCore/WModules/WComponentsTools.js";


class AmoritizationModule {
    /**
     * @param {ValoracionesTransaction} contrato
     * @returns {ValoracionesTransaction}
     */
    static calculoAmortizacion = (contrato) => {
        if (contrato.Catalogo_Clientes == undefined || contrato.Detail_Prendas == undefined) {
            return new ValoracionesTransaction();
        }
        //console.log(contrato.Detail_Prendas);
        contrato.Transaction_Contratos = new Transaction_Contratos();

        contrato.Transaction_Contratos.valoracion_compra_cordobas = AmoritizationModule.round(WArrayF.SumValAtt(contrato.Detail_Prendas.map(p => p.Transactional_Valoracion), "valoracion_compra_cordobas"));
        contrato.Transaction_Contratos.valoracion_compra_dolares = AmoritizationModule.round(WArrayF.SumValAtt(contrato.Detail_Prendas.map(p => p.Transactional_Valoracion), "valoracion_compra_dolares"));
        contrato.Transaction_Contratos.valoracion_empeño_cordobas = AmoritizationModule.round(WArrayF.SumValAtt(contrato.Detail_Prendas.map(p => p.Transactional_Valoracion), "valoracion_empeño_cordobas"));
        contrato.Transaction_Contratos.valoracion_empeño_dolares = AmoritizationModule.round(WArrayF.SumValAtt(contrato.Detail_Prendas.map(p => p.Transactional_Valoracion), "valoracion_empeño_dolares"));
        contrato.Transaction_Contratos.taza_interes_cargos = contrato.taza_interes_cargos ?? 0.9
        contrato.Transaction_Contratos.tasas_interes = (parseFloat(contrato.Catalogo_Clientes.Catalogo_Clasificacion_Interes.porcentaje) + contrato.taza_interes_cargos) / 100;
        contrato.Transaction_Contratos.plazo = contrato.plazo ?? 1;
        contrato.Transaction_Contratos.fecha = new Date(contrato.fecha);
        contrato.Transaction_Contratos.Catalogo_Clientes = contrato.Catalogo_Clientes;
        contrato.fecha = new Date(contrato.fecha)

        contrato.Transaction_Facturas = new Array();
        contrato.Transaction_Contratos.Detail_Prendas = contrato.Detail_Prendas;
        contrato.Transaction_Contratos.gestion_crediticia = contrato.Catalogo_Clientes.Catalogo_Clasificacion_Interes.porcentaje ?? 6;

        AmoritizationModule.crearCuotas(contrato);

        contrato.Transaction_Contratos.total_pagar_cordobas = (WArrayF.SumValAtt(contrato.Transaction_Contratos.Tbl_Cuotas, "total"));
        contrato.Transaction_Contratos.total_pagar_dolares = (WArrayF.SumValAtt(contrato.Transaction_Contratos.Tbl_Cuotas, "total") / contrato.taza_cambio);

        contrato.Transaction_Contratos.interes = (WArrayF.SumValAtt(contrato.Transaction_Facturas, "interes"));
        contrato.Transaction_Contratos.interes_dolares = (WArrayF.SumValAtt(contrato.Transaction_Facturas, "interes") / contrato.taza_cambio);
        return contrato;
    }

    static getPago = (contrato) => {
        const monto = contrato.valoracion_empeño_dolares;
        console.log(monto);
        const cuotas = contrato.plazo;
        const tasa = contrato.tasas_interes;
        const payment = ((tasa * Math.pow(1 + tasa, cuotas)) * monto) / (Math.pow(1 + tasa, cuotas) - 1);
        return payment;
    }
    static getPagoValoracion = (valoracion) => {
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
    static crearCuotas(contrato) {
        contrato.cuotafija_dolares = this.getPago(contrato);
        contrato.cuotafija = contrato.cuotafija_dolares * contrato.taza_cambio;
        contrato.Transaction_Contratos.cuotafija_dolares = this.getPago(contrato);
        contrato.Transaction_Contratos.cuotafija = contrato.cuotafija_dolares * contrato.taza_cambio;
        // @ts-ignore
        let capital = (parseFloat(contrato.valoracion_empeño_dolares));
        for (let index = 0; index < contrato.plazo; index++) {
            // @ts-ignore
            const abono_capital = (parseFloat(contrato.cuotafija_dolares) - (capital * contrato.tasas_interes));
            //console.log(abono_capital);
            const cuota = new Tbl_Cuotas({
                // @ts-ignore
                fecha: contrato.fecha.modifyMonth(index + 1),
                // @ts-ignore
                total: contrato.cuotafija_dolares.toFixed(3),
                // @ts-ignore
                interes: (capital * contrato.tasas_interes).toFixed(3),
                // @ts-ignore
                abono_capital: abono_capital.toFixed(3),
                // @ts-ignore
                capital_restante: ((capital - abono_capital) < 0 ? 0 : (capital - abono_capital)).toFixed(3),
                // @ts-ignore
                tasa_cambio: contrato.taza_cambio
            });
            capital = parseFloat((capital - abono_capital).toFixed(3));
            contrato.Transaction_Facturas.push(cuota);
        }
        contrato.Transaction_Contratos.Tbl_Cuotas = contrato.Transaction_Facturas
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