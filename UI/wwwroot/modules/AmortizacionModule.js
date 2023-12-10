//@ts-check
import { Detail_Prendas, Tbl_Cuotas, Transaction_Contratos, ValoracionesTransaction } from "../FrontModel/Model.js";
import { WArrayF } from "../WDevCore/WModules/WComponentsTools.js";


class AmoritizationModule {
    /**
     * @param {ValoracionesTransaction} contrato 
     * @param {boolean} [withValoraciones]
     * @returns {ValoracionesTransaction}
     */
    static calculoAmortizacion = (contrato, withValoraciones = true) => {
        if (contrato.Transaction_Contratos.Catalogo_Clientes == undefined
            || contrato.valoraciones == undefined) {
            return new ValoracionesTransaction();
        }
        contrato.Transaction_Contratos = contrato.Transaction_Contratos ?? new Transaction_Contratos();
        if (withValoraciones) {
            contrato.Transaction_Contratos.Detail_Prendas = contrato.valoraciones.map(
            // @ts-ignore
            /**@type {Transactional_Valoracion}*/valoracion => new Detail_Prendas({
                Descripcion: valoracion.Descripcion,
                modelo: valoracion.Modelo,
                marca: valoracion.Marca,
                serie: valoracion.Serie,
                pprenda: valoracion.valoracion_empeño_cordobas,
                color: "#000",
                en_manos_de: undefined,
                precio_venta: valoracion.precio_venta_empeño_dolares,
                Catalogo_Categoria: valoracion.Catalogo_Categoria,
                Transactional_Valoracion: valoracion
            }));
        }

        contrato.Transaction_Contratos.valoracion_compra_cordobas = AmoritizationModule.round(WArrayF.SumValAtt(contrato.Transaction_Contratos.Detail_Prendas.map(p => p.Transactional_Valoracion), "valoracion_compra_cordobas"));
        contrato.Transaction_Contratos.valoracion_compra_dolares = AmoritizationModule.round(WArrayF.SumValAtt(contrato.Transaction_Contratos.Detail_Prendas.map(p => p.Transactional_Valoracion), "valoracion_compra_dolares"));
        contrato.Transaction_Contratos.valoracion_empeño_cordobas = AmoritizationModule.round(WArrayF.SumValAtt(contrato.Transaction_Contratos.Detail_Prendas.map(p => p.Transactional_Valoracion), "valoracion_empeño_cordobas"));
        contrato.Transaction_Contratos.valoracion_empeño_dolares = AmoritizationModule.round(WArrayF.SumValAtt(contrato.Transaction_Contratos.Detail_Prendas.map(p => p.Transactional_Valoracion), "valoracion_empeño_dolares"));
        //contrato.Transaction_Contratos.taza_interes_cargos = contrato.Transaction_Contratos.taza_interes_cargos ?? 0.09
        contrato.Transaction_Contratos.tasas_interes =
            (parseFloat(contrato.Transaction_Contratos?.Catalogo_Clientes?.Catalogo_Clasificacion_Interes?.porcentaje)
                + contrato.Transaction_Contratos?.taza_interes_cargos) / 100;
        contrato.Transaction_Contratos.plazo = contrato.Transaction_Contratos.plazo ?? 1;
        contrato.Transaction_Contratos.fecha = new Date(contrato.Transaction_Contratos.fecha);
        contrato.Transaction_Contratos.Catalogo_Clientes = contrato.Transaction_Contratos.Catalogo_Clientes;
        //contrato.fecha = new Date(contrato.Transaction_Contratos.fecha)

        contrato.Transaction_Contratos.Tbl_Cuotas = new Array();
        contrato.Transaction_Contratos.gestion_crediticia = contrato.Transaction_Contratos.Catalogo_Clientes?.Catalogo_Clasificacion_Interes?.porcentaje ?? 6;

        AmoritizationModule.crearCuotas(contrato);

        contrato.Transaction_Contratos.total_pagar_cordobas = (WArrayF.SumValAtt(contrato.Transaction_Contratos.Tbl_Cuotas, "total") * contrato.Transaction_Contratos.taza_cambio);
        contrato.Transaction_Contratos.total_pagar_dolares = (WArrayF.SumValAtt(contrato.Transaction_Contratos.Tbl_Cuotas, "total"));
        //console.log(contrato.Transaction_Contratos.total_pagar_cordobas, contrato.Transaction_Contratos.total_pagar_dolares);

        contrato.Transaction_Contratos.interes = (WArrayF.SumValAtt(contrato.Transaction_Contratos.Tbl_Cuotas, "interes"));
        contrato.Transaction_Contratos.interes_dolares = (WArrayF.SumValAtt(contrato.Transaction_Contratos.Tbl_Cuotas, "interes") / contrato.Transaction_Contratos.taza_cambio);
        return contrato;
    }

    static getPago = (contrato) => {
        const monto = contrato.Transaction_Contratos.valoracion_empeño_dolares;
        //console.log(monto);
        const cuotas = contrato.Transaction_Contratos.plazo;
        const tasa = contrato.Transaction_Contratos.tasas_interes;
        const payment = ((tasa * Math.pow(1 + tasa, cuotas)) * monto) / (Math.pow(1 + tasa, cuotas) - 1);
        //console.log(monto, cuotas, tasa, payment);
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
        contrato.Transaction_Contratos.cuotafija_dolares = this.getPago(contrato);
        contrato.Transaction_Contratos.cuotafija = contrato.Transaction_Contratos.cuotafija_dolares * contrato.Transaction_Contratos.taza_cambio;
        contrato.Transaction_Contratos.cuotafija_dolares = this.getPago(contrato);
        contrato.Transaction_Contratos.cuotafija = contrato.Transaction_Contratos.cuotafija_dolares * contrato.Transaction_Contratos.taza_cambio;
        // @ts-ignore
        let capital = (parseFloat(contrato.Transaction_Contratos.valoracion_empeño_dolares));
        for (let index = 0; index < contrato.Transaction_Contratos.plazo; index++) {
            // @ts-ignore
            const abono_capital = (parseFloat(contrato.Transaction_Contratos.cuotafija_dolares)
                - (capital * contrato.Transaction_Contratos.tasas_interes));
            //console.log(abono_capital);
            const cuota = new Tbl_Cuotas({
                // @ts-ignore
                fecha: contrato.Transaction_Contratos.fecha.modifyMonth(index + 1),
                // @ts-ignore
                total: contrato.Transaction_Contratos.cuotafija_dolares.toFixed(3),
                // @ts-ignore
                interes: (capital * contrato.Transaction_Contratos.tasas_interes).toFixed(3),
                // @ts-ignore
                abono_capital: abono_capital.toFixed(3),
                // @ts-ignore
                capital_restante: ((capital - abono_capital) < 0 ? 0 : (capital - abono_capital)).toFixed(3),
                // @ts-ignore
                tasa_cambio: contrato.Transaction_Contratos.taza_cambio
            });
            capital = parseFloat((capital - abono_capital).toFixed(3));
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
}
export { AmoritizationModule }