//@ts-check
import { Catalogo_Cambio_Divisa_ModelComponent } from "../FrontModel/DBODataBaseModel.js"; //todo eliminar notulizados
import { Detail_Prendas, Transaction_Contratos } from "../FrontModel/Model.js";
import { StyleScrolls, StylesControlsV2, StylesControlsV3 } from "../WDevCore/StyleModules/WStyleComponents.js";
import { ModalMessege, ModalVericateAction, WForm } from "../WDevCore/WComponents/WForm.js";
import { ComponentsManager, ConvertToMoneyString, html, WArrayF, WRender } from "../WDevCore/WModules/WComponentsTools.js";
import { css } from "../WDevCore/WModules/WStyledRender.js";
import { contratosSearcher } from "../modules/SerchersModules.js";
import { Catalogo_Cambio_Divisa } from "../FrontModel/Catalogo_Cambio_Divisa.js";
import { Recibos_ModelComponent } from "../FrontModel/ModelComponents/Recibos_ModelComponent.js";
import { Recibos } from "../FrontModel/Recibos.js";
import { WOrtograficValidation } from "../WDevCore/WModules/WOrtograficValidation.js";
import { WModalForm } from "../WDevCore/WComponents/WModalForm.js";
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
        this.proyeccionDetail = WRender.Create({
            className: "info-proyeccion-contrato",
            children: [{ tagName: 'label', innerText: "SELECCIONE FECHA", className: "proyeccion-container-detail" }]
        });
        /**@type {Array<Catalogo_Cambio_Divisa>} */
        this.tasasCambio = []
        this.ContractData = {
            canReestructure: false,
            canSoloAbono: true,
            soloInteresMora: true,
            min: 0,
            max: 0
        }
        this.diasMora = 0;
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
        this.SelectedContrato = selectContrato;
        // console.log( this.Contrato); 
        this.DefineMaxAndMin(selectContrato);
        this.ContractData = this.BuildContractData(this.Contrato);
        this.reciboModel = this.BuildRecibosModel();

        //console.log(ContractData);
        if (this.ContractData.canReestructure) {
            this.reciboModel.reestructurar.hidden = false;
            this.reciboModel.reestructurar_value.max = this.ContractData.max;
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
                    if (response.message == "Factura temporal") {
                        this.printRecibo(response.body)
                        return;
                    }
                    this.append(ModalVericateAction(() => {
                        location.href = "/PagesViews/Ver_Recibos?id_Recibo=" + response.body.id_factura;
                        //location.href = "/PagesViews/Print_Recibo?id_Recibo=" + response.body.id_recibo;
                    }, response.message, false));
                } else if (response.status == 400) {
                    this.append(ModalVericateAction(() => {
                        location.href = "/PagesViews/Gestion_Recibos";
                    }, response.message, false));
                }
            }, CustomStyle: this.CustomFormStyle()
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
        // @ts-ignore
        this.calculoRecibo(selectContrato, this.tasasCambio);
    }
    printRecibo(body) {

        const objFra = WRender.Create({
            tagName: "iframe",
            style: { minHeight: "700px" },
            // @ts-ignore
            srcdoc: body
        })
        const print = function () {
            // @ts-ignore
            objFra.contentWindow.focus(); // Set focus.
            // @ts-ignore
            objFra.contentWindow.print(); // Print it  
        };
        const btn = html`<img class="print" src="../WDevCore/Media/print.png"/>`
        btn.onclick = print
        this.append(new WModalForm({
            ObjectModal: WRender.Create({
                class: "print-container", children: [this.PrintIconStyle(), [btn],

                WRender.Create({ className: "print-container-iframe", children: [objFra] })]
            })
        }))
        objFra.onload = print
    }
    PrintIconStyle() {
        return css`
           .print {
            width: 30px;
            height: 30px;
            padding: 5px;
            border: solid 1px #bdbcbc; 
            border-radius: 5px;
            cursor: pointer;        
        } .print-container {
            width: 98%;   
            margin: auto;          
        } .print-container div{
            width: 100%; 
           display: flex;
           justify-content: flex-end;
           padding: 5px;
           border-radius: 5px;
           border: solid 1px #bdbcbc; 
           margin-bottom: 5px;
        } .print-container-iframe {
            overflow-y: auto;  
            max-height: 650px;
            background-color: #bdbcbc;  
        }  .print-container iframe { 
            width: 320px;
            max-width: 320px;
            margin: 10px auto;
            display: block;
            background-color: #fff;
            border: none;
        }
         `;
    }


    DefineMaxAndMin(selectContrato) {
        //TODO BORRAR CICLO DE MORA FORZADA 

        this.Contrato.Tbl_Cuotas?.filter(cuota => cuota.Estado == "PENDIENTE")?.forEach(cuota => {
            cuota.mora = this.forceMora(cuota, selectContrato);
            // @ts-ignore
            const fechaInicio = new Date(cuota.fecha).toStartDate().getTime();
            const fechaFin = new Date().getTime();
            const diasMora = (fechaFin - fechaInicio) / (1000 * 60 * 60 * 24);
            if (diasMora > 0) {
                this.diasMora = diasMora;
            }
        });
        const cuotasPendientes = this.Contrato.Tbl_Cuotas.sort((a, b) => a.id_cuota - b.id_cuota).filter(c => c.Estado?.toUpperCase() == "PENDIENTE");
        const CuotaActual = cuotasPendientes[0];
        const mora = WArrayF.SumValAtt(cuotasPendientes, "mora");
        const saldo_pendiente = selectContrato.saldo;
        const interesCuota = CuotaActual.interes;
        const perdida_de_documento = this.reciboForm?.FormObject?.perdida_de_documento_monto ?? 0;
        const reestructuracion = this.reciboForm?.FormObject?.reestructurar_monto ?? 0;
        const total_capital_restante = mora + saldo_pendiente + interesCuota + perdida_de_documento + reestructuracion;
        console.log(mora, saldo_pendiente, interesCuota, perdida_de_documento, reestructuracion);
        if (this.reciboForm?.FormObject?.cancelar == true) {
            this.pagoMinimoDolares = total_capital_restante;
            this.pagoMaximoDolares = total_capital_restante;
            this.pagoActual = total_capital_restante;
        } else if (this.reciboForm?.FormObject?.reestructurar == true) {
            this.pagoMinimoDolares = interesCuota + mora + reestructuracion + perdida_de_documento;
            this.pagoMaximoDolares = total_capital_restante;
            this.pagoActual = interesCuota + mora + reestructuracion + perdida_de_documento;
        } else if (this.reciboForm?.FormObject?.solo_interes_mora == true) {
            this.pagoMinimoDolares = interesCuota + mora + perdida_de_documento;
            this.pagoMaximoDolares = interesCuota + mora + perdida_de_documento;
            this.pagoActual = this.pagoMinimoDolares;
        } else if (this.reciboForm?.FormObject?.solo_abono == true) {
            this.pagoMinimoDolares = 1 + perdida_de_documento;
            this.pagoMaximoDolares = total_capital_restante;
            this.pagoActual = this.pagoMinimoDolares;
        } else {
            this.pagoMinimoDolares = CuotaActual.interes;
            this.pagoMaximoDolares = total_capital_restante;
            this.pagoActual = CuotaActual.total + mora + reestructuracion + perdida_de_documento;
        }
        if (this.pagoActual > this.pagoMaximoDolares) {
            this.pagoMaximoDolares = this.pagoActual
        }
        this.pagoMinimoCordobas = this.pagoMinimoDolares * this.tasasCambio[0].Valor_de_venta;
        this.pagoMaximoCordobas = this.pagoMaximoDolares * this.tasasCambio[0].Valor_de_venta;
        this.pagoActualCordobas = this.pagoActual * this.tasasCambio[0].Valor_de_venta;
    }

    BuildRecibosModel() {
        console.log(this.pagoMaximoCordobas);
        return new Recibos_ModelComponent({
            perdida_de_documento: {
                type: "checkbox", hiddenInTable: true, require: false, action: (recibo, form) => {
                    if (recibo.perdida_de_documento == true) {
                        recibo.perdida_de_documento_monto = 1;
                    } else {
                        recibo.perdida_de_documento_monto = 0;
                    }
                    this.DefineMaxAndMinInForm(form);
                }
            }, cancelar: {
                type: "checkbox", hiddenInTable: true, require: false, action: (recibo, form) => {
                    recibo.solo = false;
                    recibo.reestructurar = false;
                    recibo.reestructurar_monto = 0;
                    recibo.solo_interes_mora = false;
                    recibo.solo_abono = false;
                    if (recibo.cancelar == true) {
                        form.ModelObject.paga_dolares.disabled = true;
                        form.ModelObject.reestructurar.disabled = true;
                        form.ModelObject.paga_cordobas.disabled = true;
                    } else {
                        form.ModelObject.paga_dolares.disabled = false;
                        form.ModelObject.paga_cordobas.disabled = false;
                        form.ModelObject.reestructurar.disabled = false;
                    }
                    this.DefineMaxAndMinInForm(form);
                }
            }, solo_abono: {
                type: "checkbox", require: false, hidden: !this.ContractData.canSoloAbono,
                action: (recibo, form) => {
                    recibo.cancelar = false;
                    recibo.solo_interes_mora = false;
                    this.DefineMaxAndMinInForm(form);
                }
            }, reestructurar: {
                type: "checkbox", hidden: !this.ContractData.canReestructure, require: false,
                action: (recibo, form) => {
                    if (recibo.reestructurar == true) {
                        form.ModelObject.reestructurar_value.hidden = false;
                        //this.reestructurar_monto.hidden = false;  
                        recibo.reestructurar_monto = 1;
                    } else {
                        form.ModelObject.reestructurar_value.hidden = true;
                        //this.reestructurar_monto.hidden = true; 
                        recibo.reestructurar_monto = 0;
                    }
                    this.DefineMaxAndMinInForm(form);
                }
            }, /**@type {ModelProperty} */ solo_interes_mora: {
                type: "checkbox", require: false, hidden: !this.ContractData.soloInteresMora,
                action: (recibo, form) => {
                    recibo.cancelar = false;
                    recibo.solo_abono = false;
                    if (recibo.solo_interes_mora == true) {
                        form.ModelObject.paga_dolares.disabled = true;
                        form.ModelObject.paga_cordobas.disabled = true;
                    } else {
                        form.ModelObject.paga_dolares.disabled = false;
                        form.ModelObject.paga_cordobas.disabled = false;
                    }
                    this.DefineMaxAndMinInForm(form);
                }
            }, paga_cordobas: {
                type: 'MONEY', max: this.pagoMaximoCordobas?.toFixed(3), default: this.pagoActualCordobas,  disabled: true, 
                min: this.pagoMinimoCordobas?.toFixed(3), action: (/**@type {Recibos}*/ ObjectF, form, control) => {
                    if (parseFloat(control.value) == parseFloat(control.max)) {
                        //control.value =  parseFloat(control.max).toFixed(3);
                        ObjectF.solo_abono = false;
                        ObjectF.cancelar = true;
                        //ObjectF.paga_cordobas = parseFloat(control.max);
                    }
                    if (parseFloat(control.value) == parseFloat(control.min)) {
                        //control.value = parseFloat(control.max).toFixed(3);
                        ObjectF.solo_abono = true;
                        ObjectF.cancelar = false;
                        //ObjectF.paga_dolares = parseFloat(control.min);
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
                type: 'MONEY', max: this.pagoMaximoDolares?.toFixed(3), default: this.pagoActual,
                min: this.pagoMinimoDolares?.toFixed(3), action: (/**@type {Recibos}*/ ObjectF, form, control) => {
                    if (parseFloat(control.value) == parseFloat(control.max)) {
                        //control.value =  parseFloat(control.max).toFixed(3);
                        ObjectF.solo_abono = false;
                        ObjectF.cancelar = true;
                        //ObjectF.paga_cordobas = parseFloat(control.max);
                    }
                    if (parseFloat(control.value) == parseFloat(control.min)) {
                        //control.value = parseFloat(control.max).toFixed(3);
                        ObjectF.solo_abono = true;
                        ObjectF.cancelar = false;
                        //ObjectF.paga_dolares = parseFloat(control.min);
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
                    ObjectF.monto_cordobas = (ObjectF.monto_dolares * ObjectF.tasa_cambio).toFixed(3);
                    ObjectF.cambio_dolares = (ObjectF.monto_dolares - ObjectF.paga_dolares).toFixed(3);
                    ObjectF.cambio_cordobas = (ObjectF.monto_cordobas - ObjectF.paga_cordobas).toFixed(3);
                    if (ObjectF.moneda == "DOLARES") {
                        ObjectF.cambio_cordobas = ((ObjectF.monto_dolares - ObjectF.paga_dolares) * this.tasasCambio[0].Valor_de_compra).toFixed(3);
                    }
                    this.reciboForm?.DrawComponent();
                }
            }, monto_cordobas: {
                type: 'MONEY', defaultValue: 0, action: (/**@type {Recibos}*/ ObjectF, form) => {
                    ObjectF.monto_dolares = (ObjectF.monto_cordobas * ObjectF.tasa_cambio).toFixed(3);
                    ObjectF.cambio_dolares = (ObjectF.monto_dolares - ObjectF.paga_dolares).toFixed(3);
                    ObjectF.cambio_cordobas = (ObjectF.monto_cordobas - ObjectF.paga_cordobas).toFixed(3);
                    if (ObjectF.moneda == "DOLARES") {
                        ObjectF.cambio_cordobas = ((ObjectF.monto_dolares - ObjectF.paga_dolares) * this.tasasCambio[0].Valor_de_compra).toFixed(3);
                    }
                    this.reciboForm?.DrawComponent();
                }
            }, cambio_dolares: {
                type: 'MONEY', disabled: true, require: false, defaultValue: 0, action: (/**@type {Recibos}*/ ObjectF, form) => {
                    //console.log(ObjectF.monto_dolares);
                    //return ConvertToMoneyString(ObjectF.cambio_dolares = ObjectF.monto_dolares - ObjectF.paga_dolares);
                }
            }, cambio_cordobas: {
                type: 'MONEY', disabled: true, require: false, defaultValue: 0, action: (/**@type {Recibos}*/ ObjectF, form) => {
                    //return ConvertToMoneyString(ObjectF.cambio_cordobas = ObjectF.monto_cordobas - ObjectF.paga_cordobas);
                }
            }, moneda : { type: "radio", Dataset: ["DOLARES","CORDOBAS"], action: (/**@type {Recibos}*/ ObjectF, form) => {
                if (ObjectF.moneda == "DOLARES") {
                    form.ModelObject.monto_dolares.hidden = false;
                    form.ModelObject.monto_cordobas.hidden = true;

                    form.ModelObject.paga_cordobas.disabled = true;
                    form.ModelObject.paga_dolares.disabled = false;

                    form.ModelObject.is_cambio_cordobas.hidden = false;
                    ObjectF.is_cambio_cordobas = false;
                    ObjectF.cambio_cordobas = ((ObjectF.monto_dolares - ObjectF.paga_dolares) * this.tasasCambio[0].Valor_de_compra).toFixed(3);
                    this.reciboForm?.DrawComponent();
                } else {
                    form.ModelObject.monto_dolares.hidden = true;
                    form.ModelObject.monto_cordobas.hidden = false;

                    form.ModelObject.paga_cordobas.disabled = false;
                    form.ModelObject.paga_dolares.disabled = true;
                    
                    form.ModelObject.is_cambio_cordobas.hidden = true;
                    ObjectF.is_cambio_cordobas = false;
                    ObjectF.cambio_cordobas = (ObjectF.monto_cordobas - ObjectF.paga_cordobas).toFixed(3);
                    this.reciboForm?.DrawComponent();
                }
            }}
        });
    }

    DefineMaxAndMinInForm(form) {
        this.DefineMaxAndMin(this.SelectedContrato);
        this.reciboForm.FormObject.paga_dolares = this.pagoActual?.toFixed(3);
        this.reciboForm.FormObject.total_apagar_dolares = this.pagoActual?.toFixed(3);
        this.reciboForm.FormObject.paga_cordobas = this.pagoActualCordobas?.toFixed(3);
        this.reciboForm.FormObject.monto_dolares = this.pagoActual?.toFixed(3);
        this.reciboForm.FormObject.monto_cordobas = this.pagoActualCordobas?.toFixed(3);
        this.reciboForm.ModelObject.paga_dolares.max = this.pagoMaximoDolares?.toFixed(3);
        this.reciboForm.ModelObject.paga_dolares.min = this.pagoMinimoDolares?.toFixed(3);
        this.reciboForm.ModelObject.paga_cordobas.max = this.pagoMaximoCordobas?.toFixed(3);
        this.reciboForm.ModelObject.paga_cordobas.min = this.pagoMinimoCordobas?.toFixed(3);
        form.DrawComponent();
    }

    /**
     * @param {Transaction_Contratos} Contrato
     */
    BuildContractData(Contrato) {
        //console.log(Contrato);
        const categoria = Contrato.Detail_Prendas[0].Catalogo_Categoria
        const plazo = Contrato.plazo;
        const fecha = new Date(Contrato.fecha_cancelar);
        let canReestructure = false;


        //TODO REPARAR FECHA        
        // @ts-ignore
        if (categoria.descripcion != "vehiculos" && categoria.plazo_limite > plazo && fecha <= new Date().addDays(32)) {//TODO REPARAR FECHA QUITAR ESOS 31 DIAS
            canReestructure = true;
        }
        //console.log(Contrato.Tbl_Cuotas);
        const existeMora = Contrato.Tbl_Cuotas?.filter(c => c.mora != null && c.mora > 0).length > 0;
        return {
            canReestructure: canReestructure,
            min: 1,
            // @ts-ignore
            max: categoria.plazo_limite - plazo,
            canSoloAbono: !existeMora,
            soloInteresMora: !canReestructure
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
            tagName: 'button', className: 'Block-Secundary', innerText: 'Ver Recibos',
            onclick: () => {
                window.location.href = "/PagesViews/Ver_Recibos";
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
        //TODO CREAR CONFIGURACION DE MORA
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
            if (diasMora > 20) {
                this.proyeccionDetail.appendChild(html`<div class="proyeccion-container-detail">
    <label class="value-container">NO ES POSIBLE PROYECTAR A MAS DE 20 DÍAS</label></div>`)
            } else {
                this.proyeccionDetail.appendChild(html`<div class="proyeccion-container-detail">
    <label class="value-container">
        DÍAS DE MORA:
        <span>${diasMora}</span>
    </label>
    <label class="value-container">
        MORA C$:
        <span>${ConvertToMoneyString(recibo.mora_cordobas)}</span>
    </label>
    <label class="value-container">
        MORA $:
        <span>${ConvertToMoneyString(recibo.mora_dolares)}</span>
    </label>
</div>`)
            }
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

        // @ts-ignore
        this.calculoRecibo(this.Contrato, this.tasasCambio, proyeccionData);

        this.proyeccion.append(this.selectContratosDetail(this.Contrato), this.proyeccionDetail, proyeccionData);
    }
    selectContrato = (/**@type {Transaction_Contratos} */ selectContrato) => {
        //console.log(selectContrato);
        //let cuotasFiltradas = selectContrato.Tbl_Cuotas.filter(cuota => cuota.Estado == "PENDIENTE");
        //console.log(selectContrato.Tbl_Cuotas);
        //console.log(cuotasFiltradas);
        if (selectContrato.estado != "ACTIVO") {
            this.append(ModalMessege("Este contrato se encuentra " + selectContrato.estado))
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
            let mora_interes_cordobas = 0;

            let index = 0
            const cuota = contrato.Tbl_Cuotas.find(c => c.Estado == "PENDIENTE");
            console.log(contrato.Tbl_Cuotas, cuota);
            if (cuota != null) {
                fecha = cuota.fecha;
                primeraCuotaConCapitalMayorACero = cuota.total;
                interes_cargos = cuota.interes;
                // @ts-ignore
                interes_demas_cargos_pagar_cordobas = cuota.interes * tasasCambio[0].Valor_de_venta;
                abono_capital_cordobas = cuota.abono_capital;
                mora_interes = cuota.mora == null ? 0 : cuota.mora; // no permite el cero, preguntar a wilber sobre problema
                // @ts-ignore
                mora_interes_cordobas = mora_interes * tasasCambio[0].Valor_de_venta
                cuota_total = cuota.total;
                this.cuota = cuota;
                this.cuota
                this.proximaCuota = cuota
                this.ultimaCuota = contrato.Tbl_Cuotas[index - 1]
                //break;
            }
            formObject["fecha_original"] = fecha;
            formObject["fecha"] = fecha;
            formObject["numero_contrato"] = contrato["numero_contrato"];


            formObject["tasa_cambio"] = tasasCambio[0].Valor_de_venta;
            formObject["tasa_cambio_compra"] = tasasCambio[0].Valor_de_compra;


            formObject["monto"] = contrato["monto"].toFixed(3);
            // @ts-ignore
            formObject["saldo_actual_cordobas"] = (contrato["saldo"] * tasasCambio[0].Valor_de_venta).toFixed(3);
            formObject["saldo_actual_dolares"] = contrato["saldo"].toFixed(3);
            formObject["interes_cargos"] = interes_cargos.toFixed(3);

            formObject["interes_demas_cargos_pagar_cordobas"] = interes_demas_cargos_pagar_cordobas.toFixed(3);
            formObject["interes_demas_cargos_pagar_dolares"] = interes_cargos.toFixed(3);

            // @ts-ignore
            formObject["abono_capital_cordobas"] = (abono_capital_cordobas * tasasCambio[0].Valor_de_venta).toFixed(3);
            formObject["abono_capital_dolares"] = abono_capital_cordobas.toFixed(3);;

            // @ts-ignore
            formObject["cuota_pagar_cordobas"] = (primeraCuotaConCapitalMayorACero * tasasCambio[0].Valor_de_venta).toFixed(3);
            formObject["cuota_pagar_dolares"] = primeraCuotaConCapitalMayorACero;

            formObject["mora_cordobas"] = (mora_interes_cordobas).toFixed(3);
            formObject["mora_dolares"] = mora_interes?.toFixed(3);

            formObject["mora_interes_cordobas"] = (mora_interes_cordobas + interes_demas_cargos_pagar_cordobas).toFixed(3);
            formObject["mora_interes_dolares"] = (mora_interes + interes_cargos).toFixed(3);

            // @ts-ignore
            formObject["total_cordobas"] = (cuota_total * tasasCambio[0].Valor_de_venta + mora_interes_cordobas).toFixed(3);
            formObject["total_dolares"] = (cuota_total + mora_interes).toFixed(3);


            formObject["total_parciales"] = 1;//TODO todo preguntar
            formObject["fecha_roc"] = new Date();
            // @ts-ignore
            formObject["paga_cordobas"] = this.pagoActualCordobas.toFixed(3);
            formObject["paga_dolares"] = this.pagoActual.toFixed(3);
            formObject["monto_cordobas"] = formObject["paga_cordobas"]
            formObject["monto_dolares"] = formObject["paga_dolares"]
            formObject["solo_abono"] = false;
            formObject["cancelar"] = false;
            formObject["total_apagar_dolares"] = this.pagoActual.toFixed(3);;
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
            grid-template-columns: repeat(6, 16%);
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
            border-left: 8px solid #d9d9d9;
            border-radius: 8px;
            transition: all .5s;
        }
        .DataContainer:hover {           
            border-left: 8px solid #575757;
        }
        .diasMora {
            color: red;
        }
        .proyeccion-container-detail {
            padding: 20px;
            display: flex;
            justify-content: left;
            color: red;
        }
        .proyeccion-container-detail .value-container {
            font-weight: bold;
            font-size: 16px;
            margin-left: 10px;
            color: red;
        }
        .proyeccion-container-detail .value-container span {
            font-weight: bold;
            color: red;
        }
    `

    forceMora(cuota, contrato) {
        const fechaOriginal = new Date(cuota.fecha);
        // @ts-ignore
        const fechaActual = new Date().addDays(33);
        fechaOriginal.setHours(0, 0, 0, 0);
        fechaActual.setHours(0, 0, 0, 0);
        // @ts-ignore
        const diferencia = fechaActual - fechaOriginal;
        const diasDeDiferencia = (diferencia / (1000 * 60 * 60 * 24)) >= 0 ? (diferencia / (1000 * 60 * 60 * 24)) : 0;
        //console.log(diasDeDiferencia, (diferencia / (1000 * 60 * 60 * 24)) < 0);
        const montoMora = cuota.total * ((contrato?.mora / 100) ?? 0.005) * diasDeDiferencia;
        this.diasMora = diasDeDiferencia
        console.log(this.diasMora, fechaActual, fechaOriginal);
        console.log(diasDeDiferencia);
        return montoMora;
    }

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
            ConvertToMoneyString(selectContrato.saldo * this.tasasCambio[0].Valor_de_venta)}</label>
        </div>
        <div class="DataContainer">
            <span>Saldo actual $:</span>
            <label>${ConvertToMoneyString(selectContrato.saldo)}</label>
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
        <div class="DataContainer ${this.diasMora > 0 ? "diasMora" : ""}">
            <span>Días en mora:</span>
            <label class="">${this.diasMora ?? 0}</label>
        </div>
    </div>
    <div>
        <h4 style="text-align:center;">DATOS DEL RECIBO OFICIAL DE CAJA</h4>
    </div>
</div>`;
    }
    CustomFormStyle() {
        return css`
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
                } `;
    }
}

customElements.define('w-valoraciones-view', Gestion_RecibosView);
export { Gestion_RecibosView };
// @ts-ignore
window.addEventListener('load', async () => { MainBody.append(new Gestion_RecibosView()) })