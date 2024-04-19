//@ts-check
import { Catalogo_Cambio_Divisa_ModelComponent } from "../FrontModel/DBODataBaseModel.js"; //todo eliminar notulizados
import { Detail_Prendas, Transaction_Contratos } from "../FrontModel/Model.js";
import { StyleScrolls, StylesControlsV2, StylesControlsV3 } from "../WDevCore/StyleModules/WStyleComponents.js";
import { ModalMessege, ModalVericateAction, WForm } from "../WDevCore/WComponents/WForm.js";
import { ComponentsManager, html, WArrayF, WRender } from "../WDevCore/WModules/WComponentsTools.js";
import { css } from "../WDevCore/WModules/WStyledRender.js";
import { contratosSearcher } from "../modules/SerchersModules.js";
import { Catalogo_Cambio_Divisa } from "../FrontModel/Catalogo_Cambio_Divisa.js";
import { Recibos_ModelComponent } from "../FrontModel/ModelComponents/Recibos_ModelComponent.js";
import { Recibos } from "../FrontModel/Recibos.js";
import { WOrtograficValidation } from "../WDevCore/WModules/WOrtograficValidation.js";
class Gestion_RecibosView extends HTMLElement {
    // @ts-ignore
    constructor(props) {
        super();
        this.OptionContainer = WRender.Create({ className: "OptionContainer" });
        this.TabContainer = WRender.Create({ className: "TabContainer", id: 'TabContainer' });
        this.Manager = new ComponentsManager({ MainContainer: this.TabContainer, SPAManage: false });
        this.valoracionesContainer = WRender.Create({ className: "valoraciones-container" });
        this.proyeccion = WRender.Create({ className: "proyeccion-container" });
        this.append(this.CustomStyle);
        this.Contrato = new Transaction_Contratos()
        this.valoracionesDataset = [];
        this.selectedClientDetail = WRender.Create({ tagName: "label", className: "selected-client" });
        this.proyeccionDetail = WRender.Create({ className: "info-proyeccion-contrato" });
        /**@type {Array<Catalogo_Cambio_Divisa>} */
        this.tasasCambio = []
        this.Draw();
    }
    Draw = async () => {
        this.valoracionesContainer.innerHTML = "";
        this.tasasCambio = await new Catalogo_Cambio_Divisa_ModelComponent().Get();
        this.SetOption();
        if (!this.contratosSearcher) {
            this.contratosSearcher = contratosSearcher(this.selectContrato);
        }
        this.Manager.NavigateFunction("buscar-contrato", this.contratosSearcher);
        this.append(
            StylesControlsV2.cloneNode(true),
            StyleScrolls.cloneNode(true),
            StylesControlsV3.cloneNode(true),
            this.OptionContainer,
            this.TabContainer
        );
    }
    /**
     * @param {Transaction_Contratos} selectContrato
     */
    generateRecibo(selectContrato) {
        // console.log( this.Contrato);       
        this.pagoMaximoDolares = WArrayF.SumValAtt(this.Contrato.Tbl_Cuotas, "total") + WArrayF.SumValAtt(this.Contrato.Tbl_Cuotas, "mora");
        this.pagoMaximoCordobas = this.pagoMaximoDolares * this.tasasCambio[0].Valor_de_venta;

        this.pagoMinimoDolares = WArrayF.MinValue(this.Contrato.Tbl_Cuotas, "total");
        this.pagoMinimoCordobass = this.pagoMinimoDolares * this.tasasCambio[0].Valor_de_venta;

        this.reciboModel = this.BuildRecibosModel();
        this.reciboModel.cancelar.action = (ObjectF) => {
            if (this.reciboForm != null) {
                this.reciboForm.FormObject.paga_dolares = this.pagoMaximoDolares?.toFixed(3);
                // @ts-ignore
                this.reciboForm.FormObject.paga_cordobas = this.pagoMaximoCordobas?.toFixed(3);
                this.reciboForm.DrawComponent()
            }
        };
        const reestructure = this.ReestructurateData(this.Contrato);
        //console.log(reestructure);
        if (reestructure.canReestructure) {
            this.reciboModel.reestructurar.hidden = false;
            this.reciboModel.reestructurar_value.max = reestructure.max;
        }
        this.reciboForm = new WForm({
            ModelObject: this.reciboModel,
            AutoSave: false,
            //Options: false,
            id: "reciboForm",
            // @ts-ignore
            SaveFunction: async (/**@type {Recibos} */ recibo) => {
                if (!this.reciboForm?.Validate()) {
                    this.append(ModalMessege("Agregue datos para poder continuar"));
                    return;
                }
                // @ts-ignore
                const response = await new Recibos(this.reciboForm?.FormObject).Save(); //this.reciboModel?.Save() // this.reciboModel?.GuardarValoraciones(this.valoracionesTable?.Dataset);
                if (response.status == 200) {
                    //location.href = "/PagesViews/Ver_Recibos";
                    this.append(ModalVericateAction(() => {
                        location.href = "/PagesViews/Ver_Recibos?id_Recibo=" + response.body.id_factura;
                        //location.href = "/PagesViews/Print_Recibo?id_Recibo=" + response.body.id_recibo;
                    }, response.message, false));
                } else if (response.status == 400) {
                    this.append(ModalVericateAction(() => {
                        location.href = "/PagesViews/Gestion_Recibos";
                    }, response.message, false));
                }
            }, CustomStyle: css`
                .divForm{
                    display: grid;
                    grid-template-columns: repeat(4, calc(24% - 15px));
                    grid-template-rows: repeat(3, auto);
                    grid-auto-flow: column;
                } .ModalElement:nth-child(n + 1):nth-child(-n + 8) {
                    grid-column: 1/2 !important;
                } .ModalElement:nth-child(n + 9):nth-child(-n + 15) {                    
                    grid-column: 2/3 !important;
                } .ModalElement:nth-child(n + 16):nth-child(-n + 23) {
                    grid-column: 3/4 !important;
                }.ModalElement:nth-child(n + 24):nth-child(-n + 32) {
                    grid-column: 4/5 !important;
                }  .ModalElement.titleContainer:nth-child(1) {
                    grid-column: 1/3 !important;
                } .ModalElement.titleContainer:nth-child(16){
                    grid-column: 3/5 !important;
                } .ModalElement label {
                    display: block;
                    width: 100%;
                    margin: 0px;
                } `
        });
        this.contratoDetail = WRender.Create({ className: "info-header-contrato" });
        this.TabContainerTables = WRender.Create({ className: "TabContainerTables", id: 'TabContainerTables' });
        this.ManagerTables = new ComponentsManager({ MainContainer: this.TabContainerTables });
        this.valoracionesContainer.innerHTML = "";

        this.valoracionesContainer.append(
            this.selectedClientDetail,
            this.reciboForm,
            this.contratoDetail,
            this.TabContainerTables
        );
        this.calculoRecibo(selectContrato, this.tasasCambio);
    }

    BuildRecibosModel() {
        return new Recibos_ModelComponent({
            perdida_de_documento: {
                type: "checkbox", hiddenInTable: true, require: false, action: (recibo, form) => {
                    if (recibo.perdida_de_documento == true) {
                        recibo.perdida_de_documento_monto = 1;
                        this.pagoMaximoDolares = this.pagoMaximoDolares + 1;
                        this.pagoMaximoCordobas = this.pagoMaximoCordobas + this.tasasCambio[0].Valor_de_venta;
                    } else {
                        recibo.perdida_de_documento_monto = 0;
                        this.pagoMaximoDolares = this.pagoMaximoDolares - 1;
                        this.pagoMaximoCordobas = this.pagoMaximoCordobas - this.tasasCambio[0].Valor_de_venta;
                    }
                    this.reciboForm.FormObject.paga_dolares = this.pagoMaximoDolares?.toFixed(3);
                    this.reciboForm.FormObject.paga_cordobas = this.pagoMaximoCordobas?.toFixed(3);
                    form.DrawComponent();
                }
            }, paga_cordobas: {
                type: 'MONEY', max: this.pagoMaximoCordobas, action: (/**@type {Recibos}*/ ObjectF, form, control) => {
                    if (parseFloat(control.value) > parseFloat(control.max)) {
                        //control.value =  parseFloat(control.max).toFixed(3);
                        ObjectF.paga_cordobas = parseFloat(control.max);
                    }
                    if (ObjectF.paga_dolares != (ObjectF.paga_cordobas / ObjectF.tasa_cambio)) {
                        ObjectF.paga_dolares = (ObjectF.paga_cordobas / ObjectF.tasa_cambio);

                        ObjectF.cambio_dolares = ObjectF.monto_dolares - ObjectF.paga_dolares;
                        ObjectF.cambio_cordobas = ObjectF.monto_cordobas - ObjectF.paga_cordobas;
                        if (ObjectF.paga_dolares < this.Contrato.saldo) {
                            ObjectF.cancelar = false;
                        }
                        this.reciboForm?.DrawComponent();
                    }
                }
            }, paga_dolares: {
                type: 'MONEY', max: this.pagoMaximoDolares, action: (/**@type {Recibos}*/ ObjectF, form, control) => {
                    if (parseFloat(control.value) > parseFloat(control.max)) {
                        //control.value = parseFloat(control.max).toFixed(3);
                        ObjectF.paga_dolares = parseFloat(control.max);
                    }
                    if (ObjectF.paga_cordobas != (ObjectF.paga_dolares * ObjectF.tasa_cambio)) {

                        ObjectF.paga_cordobas = (ObjectF.paga_dolares * ObjectF.tasa_cambio);

                        ObjectF.cambio_dolares = ObjectF.monto_dolares - ObjectF.paga_dolares;
                        ObjectF.cambio_cordobas = ObjectF.monto_cordobas - ObjectF.paga_cordobas;
                        if (ObjectF.paga_dolares < this.Contrato.saldo) {
                            ObjectF.cancelar = false;
                        }
                        this.reciboForm?.DrawComponent();
                    }
                }
            }, monto_dolares: {
                type: 'MONEY', defaultValue: 0, action: (/**@type {Recibos}*/ ObjectF, form) => {
                    ObjectF.monto_cordobas = (ObjectF.monto_dolares * ObjectF.tasa_cambio);
                    ObjectF.cambio_dolares = ObjectF.monto_dolares - ObjectF.paga_dolares;
                    ObjectF.cambio_cordobas = ObjectF.monto_cordobas - ObjectF.paga_cordobas;
                    this.reciboForm?.DrawComponent();
                }
            }, monto_cordobas: {
                type: 'MONEY', defaultValue: 0, action: (/**@type {Recibos}*/ ObjectF, form) => {
                    ObjectF.monto_dolares = (ObjectF.monto_cordobas * ObjectF.tasa_cambio);
                    ObjectF.cambio_dolares = ObjectF.monto_dolares - ObjectF.paga_dolares;
                    ObjectF.cambio_cordobas = ObjectF.monto_cordobas - ObjectF.paga_cordobas;
                    this.reciboForm?.DrawComponent();
                }
            }, cambio_dolares: {
                type: 'MONEY', disabled: true, defaultValue: 0, action: (/**@type {Recibos}*/ ObjectF, form) => {
                    return ObjectF.cambio_dolares = ObjectF.monto_dolares - ObjectF.paga_dolares;
                }
            }, cambio_cordobas: {
                type: 'MONEY', disabled: true, defaultValue: 0, action: (/**@type {Recibos}*/ ObjectF, form) => {
                    return ObjectF.cambio_cordobas = ObjectF.monto_cordobas - ObjectF.paga_cordobas;
                }
            }
        });
    }

    /**
     * @param {Transaction_Contratos} Contrato
     */
    ReestructurateData(Contrato) {
        //console.log(Contrato);
        const categoria = Contrato.Detail_Prendas[0].Catalogo_Categoria
        const plazo = Contrato.plazo;
        const fecha = new Date(Contrato.fecha_cancelar);
        // @ts-ignore
        //const fecha = new Date(Contrato.fecha_cancelar).subtractDays(31);
        let canReestructure = false;
        //console.log(categoria.descripcion != "vehiculos" , categoria.plazo_limite > plazo, fecha <= new Date());
        console.log(fecha, new Date().addDays(32), fecha <= new Date().addDays(32), categoria);
        //TODO REPARAR FECHA
        // @ts-ignore
        if (categoria.descripcion != "vehiculos" && categoria.plazo_limite > plazo && fecha <= new Date().addDays(32)) {//TODO REPARAR FECHA QUITAR ESOS 31 DIAS
            canReestructure = true;
        }
        return {
            canReestructure: canReestructure,
            min: 1,
            // @ts-ignore
            max: categoria.plazo_limite - plazo
        }
    }
    /**
     * 
     * @param {Array<Detail_Prendas>} Detail_Prendas 
     * @returns {String}
     */
    GetCategoriaContrato = (Detail_Prendas) => {
        const isVehiculo = Detail_Prendas.find(p => p.Catalogo_Categoria.descripcion == "vehiculos");
        if (isVehiculo) return isVehiculo?.Catalogo_Categoria.descripcion;

        const isElectronico = Detail_Prendas.find(p => p.Catalogo_Categoria.descripcion == "electronico");
        if (isElectronico) return isElectronico?.Catalogo_Categoria.descripcion;

        return Detail_Prendas[0].Catalogo_Categoria.descripcion;
    }
    /**
     * 
     * @param {Number} Valoracion_compra_cordobas 
     * @param {Number} Valoracion_compra_dolares 
     * @param {Number} Valoracion_empeño_cordobas 
     * @param {Number} Valoracion_empeño_dolares 
     * @returns {string}
     */
    valoracionResumen(Valoracion_compra_cordobas, Valoracion_compra_dolares, Valoracion_empeño_cordobas, Valoracion_empeño_dolares) {
        return `Compra C$: ${Valoracion_compra_cordobas} - Compra $: ${Valoracion_compra_dolares} - Empeño C$: ${Valoracion_empeño_cordobas} - Empeño $: ${Valoracion_empeño_dolares}`;
    }



    SetOption() {
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Secundary', innerText: 'Buscar Contrato',
            onclick: () => {
                this.Manager.NavigateFunction("buscar-contrato", this.contratosSearcher)
            }
        }))

        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Primary', innerText: 'Recibo',
            onclick: () => {
                if (this.Contrato.numero_contrato == undefined) {
                    this.append(ModalMessege("Seleccione un contrato"))
                    return;
                }
                this.Manager.NavigateFunction("valoraciones", this.valoracionesContainer)
            }
        }))
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Tertiary', innerText: 'Proyección de pago',
            onclick: () => {
                if (this.Contrato.numero_contrato == undefined) {
                    this.append(ModalMessege("Seleccione un contrato"))
                    return;
                }
                this.setProyeccion();
                this.Manager.NavigateFunction("proyeccion", this.proyeccion)
            }
        }))

    }
    setProyeccion() {
        const reciboModel = new Recibos_ModelComponent({});
        reciboModel.fecha.hidden = false;
        reciboModel.fecha.action = (recibo, form, InputControl) => {
            //console.log(InputControl.value, this.Contrato?.mora);
            //console.log(recibo.fecha_original);
            // @ts-ignore
            const fechaInicio = new Date(recibo.fecha_original).toStartDate().getTime();
            const fechaFin = new Date(InputControl.value).getTime();
            const diasMora = (fechaFin - fechaInicio) / (1000 * 60 * 60 * 24);
            //console.log("dias:", diasMora);
            const montoMora = recibo.total_dolares * ((this.Contrato?.mora / 100) ?? 0.005) * diasMora;
            //console.log("monto:", montoMora);
            recibo.mora_dolares = (parseFloat(recibo.mora_dolares) + montoMora).toFixed(3);
            recibo.mora_cordobas = (recibo.tasa_cambio * recibo.mora_dolares).toFixed(3);;

            this.proyeccionDetail.innerHTML = "";
            this.proyeccionDetail.appendChild(html`<div class="proyeccion-container-detail">
    <label class="value-container">
        DIAS DE MORA:
        <span>${diasMora}</span>
    </label>
    <label class="value-container">
        MORA C$:
        <span>${recibo.mora_cordobas}</span>
    </label>
    <label class="value-container">
        MORA $:
        <span>${recibo.mora_dolares}</span>
    </label>
</div>`)

        }
        reciboModel.temporal.hidden = true;
        reciboModel.cancelar.hidden = true;
        reciboModel.fecha_roc.hidden = true;
        reciboModel.paga_cordobas.disabled = true;
        reciboModel.paga_dolares.disabled = true;
        reciboModel.total_apagar_dolares.disabled = true;
        this.proyeccion.innerHTML = "";

        const proyeccionData = new WForm({
            ModelObject: reciboModel,
            AutoSave: false,
            Options: false,
            id: "reciboForm",
            // @ts-ignore
            CustomStyle: css`
                .divForm{
                    display: grid;
                    grid-template-columns: repeat(3, calc(33% - 15px));
                    grid-template-rows: repeat(3, auto);
                    grid-auto-flow: column;
                }.ModalElement:nth-child(n + 1):nth-child(-n + 9) {
                    grid-column: 1/2 !important;
                } .ModalElement:nth-child(n + 10):nth-child(-n + 16) {                    
                    grid-column: 2/3 !important;
                } .ModalElement:nth-child(n + 17):nth-child(-n + 32) {
                    grid-column: 3/4 !important;
                }  .ModalElement.titleContainer:nth-child(1){
                    grid-column: 1/3 !important;
                }  .ModalElement label {
                    display: block;
                    width: 100%;
                    margin: 0px;
                } `
        });
        this.calculoRecibo(this.Contrato, this.tasasCambio, proyeccionData);

        this.proyeccion.append(this.selectContratosDetail(this.Contrato), proyeccionData, this.proyeccionDetail);
    }
    selectContrato = (/**@type {Transaction_Contratos} */ selectContrato) => {
        //console.log(selectContrato);

        let cuotasFiltradas = selectContrato.Tbl_Cuotas.filter(cuota => cuota.pago_contado == null || cuota.total > cuota.pago_contado);

        //console.log(selectContrato.Tbl_Cuotas);
        //console.log(cuotasFiltradas);
        if (cuotasFiltradas.length == 0) {
            this.append(ModalMessege("Este contrato ya se encuentra cancelado"))
            return;
        }

        this.Contrato = selectContrato;
        if (this.reciboForm != undefined) {
            //this.reciboForm.FormObject.Tasa_interes = this.getTasaInteres();
            this.reciboForm.DrawComponent();
        }
        this.generateRecibo(selectContrato);

        this.selectedClientDetail.innerHTML = "";
        this.selectedClientDetail.append(this.selectContratosDetail(selectContrato));

        this.Manager.NavigateFunction("valoraciones", this.valoracionesContainer);
        //this.contratoDetailUpdate();
    }

    /**
     * 
     * @param {Transaction_Contratos} contrato
     * @param {Array<Catalogo_Cambio_Divisa_ModelComponent>} tasasCambio
     * @param {WForm} RecibosForm
     */
    calculoRecibo = (contrato, tasasCambio, RecibosForm = this.reciboForm) => {
        ///**@type {Recibos} */
        let formObject = RecibosForm.FormObject;
        if (RecibosForm != undefined) {
            for (const prop in RecibosForm?.FormObject) {
                if (prop == "Detail_Valores") continue;
                if (prop == "Tasa_interes") continue;
                RecibosForm.FormObject[prop] = contrato[prop]
            }
            contrato.Tbl_Cuotas.sort((a, b) => a.id_cuota - b.id_cuota);

            let primeraCuotaConCapitalMayorACero = 0;
            let interes_cargos = 0;
            let interes_demas_cargos_pagar_cordobas = 0;
            let abono_capital_cordobas = 0;
            let mora_interes = 0;
            let cuota_total = 0;
            let fecha = new Date();
            fecha = new Date().addDays(32);//TODO BORRAR LINEA
            let totalRestante = 0;
            let mora_interes_cordobas = 0;

            //const fecha2 = new Date(Contrato.fecha_cancelar).addDays(32);
            //var mora = model.mora / 100;

            let index = 0
            for (const cuota of contrato.Tbl_Cuotas) {
                if (cuota.pago_contado < cuota.total || contrato.Tbl_Cuotas.length == 1) {
                    //TODO BORRAR
                    const fechaOriginal = new Date(cuota.fecha);
                    const fechaActual = new Date().addDays(32);
                    fechaOriginal.setHours(0, 0, 0, 0);
                    fechaActual.setHours(0, 0, 0, 0);
                    const diferencia = fechaActual - fechaOriginal;
                    const diasDeDiferencia = (diferencia / (1000 * 60 * 60 * 24)) >= 0 ? (diferencia / (1000 * 60 * 60 * 24)) : 0;
                    //console.log(diasDeDiferencia, (diferencia / (1000 * 60 * 60 * 24)) < 0);
                    var montoMora = cuota.total * ((contrato?.mora / 100) ?? 0.005) * diasDeDiferencia;
                    console.log(diasDeDiferencia);
                    //TODO FINBORRAR

                    fecha = cuota.fecha;
                    primeraCuotaConCapitalMayorACero = cuota.total;
                    interes_cargos = cuota.interes;
                    interes_demas_cargos_pagar_cordobas = cuota.interes * tasasCambio[0].Valor_de_venta;
                    abono_capital_cordobas = cuota.abono_capital;
                    mora_interes = cuota.mora == null ? 0 : cuota.mora; // no permite el cero, preguntar a wilber sobre problema
                    mora_interes_cordobas = mora_interes * tasasCambio[0].Valor_de_venta


                    //TODO BORRAR
                    mora_interes = montoMora; // no permite el cero, preguntar a wilber sobre problema
                    mora_interes_cordobas = mora_interes * tasasCambio[0].Valor_de_venta
                    //TODO FINBORRAR


                    cuota_total = cuota.total;
                    this.cuota = cuota;
                    this.cuota
                    this.proximaCuota = contrato.Tbl_Cuotas[index]
                    this.ultimaCuota = contrato.Tbl_Cuotas[index - 1]
                    break;
                }
                index++;
            }
            // for (const cuota of contrato.Tbl_Cuotas) {
            //     if ((cuota.total - (cuota.pago_contado || 0)) > 0) {
            //         totalRestante += cuota.total - (cuota.pago_contado || 0);
            //         interes_cargos += cuota.interes || 0;
            //     }
            // }
            formObject["fecha_original"] = fecha;
            formObject["fecha"] = fecha;
            formObject["numero_contrato"] = contrato["numero_contrato"];
            //this.reciboForm.FormObject["saldo_actual"] = contrato["saldo_actual"];


            formObject["tasa_cambio"] = tasasCambio[0].Valor_de_venta;
            formObject["tasa_cambio_compra"] = tasasCambio[0].Valor_de_compra;


            formObject["monto"] = contrato["monto"].toFixed(3);
            formObject["saldo_actual_cordobas"] = (contrato["saldo"] * tasasCambio[0].Valor_de_venta).toFixed(3);
            formObject["saldo_actual_dolares"] = contrato["saldo"].toFixed(3);
            formObject["interes_cargos"] = interes_cargos.toFixed(3);

            formObject["interes_demas_cargos_pagar_cordobas"] = interes_demas_cargos_pagar_cordobas.toFixed(3);
            formObject["interes_demas_cargos_pagar_dolares"] = interes_cargos.toFixed(3);

            formObject["abono_capital_cordobas"] = (abono_capital_cordobas * tasasCambio[0].Valor_de_venta).toFixed(3);
            formObject["abono_capital_dolares"] = abono_capital_cordobas.toFixed(3);;

            formObject["cuota_pagar_cordobas"] = (primeraCuotaConCapitalMayorACero * tasasCambio[0].Valor_de_venta).toFixed(3);
            formObject["cuota_pagar_dolares"] = primeraCuotaConCapitalMayorACero;

            formObject["mora_cordobas"] = (mora_interes_cordobas).toFixed(3);
            formObject["mora_dolares"] = mora_interes?.toFixed(3);

            formObject["mora_interes_cordobas"] = (mora_interes_cordobas + interes_demas_cargos_pagar_cordobas).toFixed(3);
            formObject["mora_interes_dolares"] = (mora_interes + interes_cargos).toFixed(3);

            formObject["total_cordobas"] = (cuota_total * tasasCambio[0].Valor_de_venta + mora_interes_cordobas).toFixed(3);
            formObject["total_dolares"] = (cuota_total + mora_interes).toFixed(3);


            formObject["total_parciales"] = 1;//TODO todo preguntar
            formObject["fecha_roc"] = new Date();
            formObject["paga_cordobas"] = (primeraCuotaConCapitalMayorACero * tasasCambio[0].Valor_de_venta).toFixed(3);
            formObject["paga_dolares"] = primeraCuotaConCapitalMayorACero;
            formObject["solo_abono"] = true;
            formObject["cancelar"] = false;
            formObject["total_apagar_dolares"] = primeraCuotaConCapitalMayorACero;
        }

    }




    CustomStyle = css`
        .valoraciones-container{
            padding: 20px;
            display: grid;
            grid-template-columns: 400px calc(100% - 730px) 300px;
            gap: 20px 30px;
        }
        #reciboForm, .multiSelectEstadosArticulos {
            grid-column: span 3;
        }      
        .column-venta{
            display: grid;
            grid-template-columns: 20% 20% 20% 20% 20%;
            gap: 10px;
            margin-bottom: 5px;
            font-size: 12px;
        }
        .column-venta label{
           grid-column: span 2;
        }
        .column-venta span{
           text-align: right;
           font-weight: bold;
           border-bottom: solid 1px #d4d4d4;
        }
        #valoracionesTable,
        #cuotasTable,
        .TabContainerTables,
        .nav-header,
        .selected-client{
            grid-column: span 3;
        }
        .nav-header {
            display: flex;
            width: 100%;
            justify-content: space-between;
            font-size: 14px;
            font-weight: bold;
            color: #00238a
        }        
        .OptionContainer{
            display: flex;
        } w-filter-option {
            grid-column: span 2;
        }

        .DataContainer span {
            font-size:10px;
        }
        .DataContainer label{          
            width: 100%;
            margin-bottom: 5px;
            font-size:12px;
            font-weight: bold;
        }

        .DataContainer {
            display: flex;
            padding: 5px;
            text-align: left;
            justify-content: space-between;
            flex-wrap: wrap;    
            overflow: hidden;
            border-right: 8px solid #d9d9d9;
            border-radius: 8px;
            transition: all .5s;
        }
        .DataContainer:hover {           
            border-right: 8px solid #575757;
        }
        .proyeccion-container-detail {
            padding: 20px;
            display: flex;
            justify-content: right;
        }
        .proyeccion-container-detail .value-container {
            font-weight: bold;
            font-size: 16px;
            margin-left: 10px;
        }
        .proyeccion-container-detail .value-container span {
            font-weight: bold;
            color: #012344;
        }
    `

    selectContratosDetail(selectContrato) {
        return html`<div>
    <div class="column-venta">
        <div class="DataContainer">
            <span>Nombre:</span>
            <label>${selectContrato.Catalogo_Clientes.primer_nombre + ' ' +
                selectContrato.Catalogo_Clientes.segundo_nombre + ' ' + selectContrato.Catalogo_Clientes.primer_apellido
                + ' ' + selectContrato.Catalogo_Clientes.segundo_apellidio}</label>
        </div>
        <div class="DataContainer">
            <span>Dirección:</span>
            <label>${selectContrato.Catalogo_Clientes.direccion}</label>
        </div>
        <div class="DataContainer">
            <span>Identificación:</span>
            <label>${selectContrato.Catalogo_Clientes.identificacion}</label>
        </div>
        <div class="DataContainer">
            <span>contrato #:</span>
            <label>${selectContrato.numero_contrato}</label>
        </div>
        <div class="DataContainer">
            <span>Fecha de contrato:</span>
            <label>${ // @ts-ignore
                selectContrato.fecha?.toDateFormatEs() ?? "-"}</label>
        </div>
        <div class="DataContainer">
            <span>F/Último pago:</span>
            <label>${ // @ts-ignore
                this.ultimaCuota?.fecha_pago?.toDateFormatEs() ?? "-"}</label>
        </div>
        <div class="DataContainer">
            <span>F/Próximo pago:</span>
            <label>${ // @ts-ignore
                this.proximaCuota?.fecha?.toDateFormatEs() ?? "-"}</label>
        </div>
        <div class="DataContainer">
            <span>Fecha de cancelación:</span>
            <label>${selectContrato.fecha_cancelar?.toDateFormatEs()}</label>
        </div>
        <div class="DataContainer">
            <span>Saldo actual C$:</span>
            <label>${ // @ts-ignore
                (selectContrato.saldo * this.tasasCambio[0].Valor_de_venta).toFixed(3)}</label>
        </div>
        <div class="DataContainer">
            <span>Saldo actual $:</span>
            <label>${selectContrato.saldo.toFixed(3)}</label>
        </div>
        <div class="DataContainer">
            <span>Plazo:</span>
            <label>${selectContrato.plazo}</label>
        </div>
        <div class="DataContainer">
            <span>Intereses y demás cargos:</span>
            <label>${selectContrato.tasas_interes * 100} %</label>
        </div>

        <div class="DataContainer">
            <span>Tasa de cambio venta:</span>
            <label>${ // @ts-ignore
                this.tasasCambio[0].Valor_de_venta}</label>
        </div>

        <div class="DataContainer">
            <span>Tasa de cambio compra:</span>
            <label>${ // @ts-ignore
                this.tasasCambio[0].Valor_de_compra}</label>
        </div>
        <div class="DataContainer">
            <span>Tipo de articulo:</span>
            <label>${WOrtograficValidation.es(this.GetCategoriaContrato(this.Contrato.Detail_Prendas))}</label>
        </div>
    </div>
    <div>
        <h4 style="text-align:center;">DATOS DEL RECIBO OFICIAL DE CAJA</h4>
    </div>
</div>`;
    }
}

customElements.define('w-valoraciones-view', Gestion_RecibosView);
export { Gestion_RecibosView };
// @ts-ignore
window.addEventListener('load', async () => { MainBody.append(new Gestion_RecibosView()) })