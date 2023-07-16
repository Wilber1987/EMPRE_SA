//@ts-check
import { ValoracionesContrato } from "../FrontModel/Model";


class AmoritizationModule {
    /**
     * 
     * @returns {ValoracionesContrato}
     */
    static calculoAmortizacion = () => {
        if (this.valoracionesTable?.Dataset.length == 0) {
            this.amortizacionResumen.innerText = this.valoracionResumen(0, 0, 0, 0);
            return new ValoracionesContrato();
        }
        // const total = this.valoracionesTable?.Dataset.reduce((sum, value) => (typeof value.Edad == "number" ? sum + value.Edad : sum), 0);
        const constrato = new ValoracionesContrato({
            valoracion_compra_cordobas: WArrayF.SumValAtt(this.valoracionesTable?.Dataset, "valoracion_compra_cordobas"),
            valoracion_compra_dolares: WArrayF.SumValAtt(this.valoracionesTable?.Dataset, "valoracion_compra_dolares"),
            valoracion_empeño_cordobas: WArrayF.SumValAtt(this.valoracionesTable?.Dataset, "valoracion_empeño_cordobas"),
            valoracion_empeño_dolares: WArrayF.SumValAtt(this.valoracionesTable?.Dataset, "valoracion_empeño_dolares"),
            tasas_interes: this.getTasaInteres() / 100,
            plazo: this.valoracionesForm?.FormObject.Plazo ?? 1,
            fecha: new Date(),
            Transaction_Facturas: new Array(),
            Detail_Prendas: this.valoracionesTable?.Dataset.map(
                // @ts-ignore
                /**@type {Transactional_Valoracion}*/valoracion => new Detail_Prendas({
                Descripcion: valoracion.descripcion,
                modelo: valoracion.model,
                marca: valoracion.marca,
                serie: valoracion.serie,
                Catalogo_Categoria: valoracion.Catalogo_Categoria,
                Transactional_Valoracion: valoracion
            })
            ),
            Catalogo_Clientes: this.Cliente
        })
        const cuotaFija = this.getPago(constrato);
        let capital = constrato.valoracion_empeño_cordobas;
        for (let index = 0; index < constrato.plazo; index++) {
            const abono_capital = cuotaFija - (capital * constrato.tasas_interes);
            const cuota = new Cuota({
                // @ts-ignore
                fecha: constrato.fecha.modifyMonth(index + 1),
                // @ts-ignore
                total: cuotaFija.toFixed(2),
                // @ts-ignore
                interes: (capital * constrato.tasas_interes).toFixed(2),
                // @ts-ignore
                abono_capital: abono_capital.toFixed(2),
                // @ts-ignore
                capital_restante: (capital - abono_capital).toFixed(2)
            })
            capital = capital - abono_capital;
            constrato.Transaction_Facturas.push(cuota)
        }
        //console.log(constrato);
        if (this.CuotasTable != undefined) {
            this.CuotasTable.Dataset = constrato.Transaction_Facturas;
            this.CuotasTable?.Draw();
        }
        this.amortizacionResumen.innerText = this.valoracionResumen(
            constrato.valoracion_compra_cordobas,
            constrato.valoracion_compra_dolares,
            constrato.valoracion_empeño_cordobas,
            constrato.valoracion_empeño_dolares);
        return constrato;
    }
}
export { AmoritizationModule}