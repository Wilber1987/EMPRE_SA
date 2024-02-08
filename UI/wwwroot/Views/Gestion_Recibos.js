//@ts-check
import { Catalogo_Cambio_Dolar, Recibos } from "../FrontModel/DBODataBaseModel.js"; //todo eliminar notulizados
import { Transaction_Contratos } from "../FrontModel/Model.js";
import { StyleScrolls, StylesControlsV2, StylesControlsV3 } from "../WDevCore/StyleModules/WStyleComponents.js";
import { ModalMessege, ModalVericateAction, WForm } from "../WDevCore/WComponents/WForm.js";
import { ComponentsManager, html, WRender } from "../WDevCore/WModules/WComponentsTools.js";
import { css } from "../WDevCore/WModules/WStyledRender.js";
import { contratosSearcher } from "../modules/SerchersModules.js";
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

        this.Draw();
    }
    Draw = async () => {
        this.valoracionesContainer.innerHTML = "";
        this.tasasCambio = await new Catalogo_Cambio_Dolar().Get();
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
    generateRecibo() {
        this.reciboModel = new Recibos({
            paga_cordobas: {
                type: 'number', action: (ObjectF, form) => {
                    ObjectF.paga_dolares = (ObjectF.paga_cordobas / ObjectF.tasa_cambio).toFixed(3);
                    if (ObjectF.paga_dolares < this.Contrato.saldo) {
                        ObjectF.cancelar = false;
                    }

                    this.reciboForm?.DrawComponent();
                }
            },
            paga_dolares: {
                type: 'number', action: (ObjectF, form) => {
                    ObjectF.paga_cordobas = (ObjectF.paga_dolares * ObjectF.tasa_cambio).toFixed(3);
                    if (ObjectF.paga_dolares < this.Contrato.saldo) {
                        ObjectF.cancelar = false;
                    }
                    this.reciboForm?.DrawComponent();
                }
            }
        });
        this.reciboModel.cancelar.action = (ObjectF) => {
            if (this.reciboForm != null) {
                this.reciboForm.FormObject.paga_dolares = this.Contrato.saldo;
                this.reciboForm.ModelObject.paga_dolares.action(this.reciboForm.FormObject);
            }
        };
        const reestructure = this.ReestructurateData(this.Contrato);
        if (reestructure.canReestructure) {
            this.reciboModel.reestructurar.hidden = false;
            this.reciboModel.reestructurar_value.max = reestructure.max;
        }
        this.SetOption();
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
                        location.href = "/PagesViews/Ver_Recibos";
                        //location.href = "/PagesViews/Print_Recibo?id_Recibo=" + response.body.id_recibo;
                    }, response.message));
                } else if (response.status == 400) {
                    this.append(ModalVericateAction(() => {
                        location.href = "/PagesViews/Gestion_Recibos";
                    }, response.message));
                }
            }, CustomStyle: css`
                .divForm{
                    display: grid;
                    grid-template-columns: repeat(3, calc(33% - 15px));
                    grid-template-rows: repeat(3, auto);
                    grid-auto-flow: column;
                }.ModalElement:nth-child(n + 1):nth-child(-n + 7) {
                    grid-column: 1/2 !important;
                } .ModalElement:nth-child(n + 8):nth-child(-n + 13) {                    
                    grid-column: 2/3 !important;
                } .ModalElement:nth-child(n + 14):nth-child(-n + 30) {
                    grid-column: 3/4 !important;
                }  .ModalElement.titleContainer:nth-child(1){
                    grid-column: 1/3 !important;
                }  .ModalElement label {
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
    }

    /**
     * @param {Transaction_Contratos} Contrato
     */
    ReestructurateData(Contrato) {
        console.log(Contrato);
        const categoria = Contrato.Detail_Prendas[0].Catalogo_Categoria;
        const plazo = Contrato.plazo;
        const fecha = Contrato.fecha_cancelar;
        let canReestructure = false;
        // @ts-ignore
        if (categoria.descripcion != "vehiculos" && categoria.plazo_limite > plazo && fecha >= Date.now()) {
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
     * @param {Number} valoracion_compra_cordobas 
     * @param {Number} valoracion_compra_dolares 
     * @param {Number} valoracion_empeño_cordobas 
     * @param {Number} valoracion_empeño_dolares 
     * @returns {string}
     */
    valoracionResumen(valoracion_compra_cordobas, valoracion_compra_dolares, valoracion_empeño_cordobas, valoracion_empeño_dolares) {
        return `Compra C$: ${valoracion_compra_cordobas} - Compra $: ${valoracion_compra_dolares} - Empeño C$: ${valoracion_empeño_cordobas} - Empeño $: ${valoracion_empeño_dolares}`;
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
        const reciboModel = new Recibos({});
        reciboModel.fecha.hidden = false;
        reciboModel.fecha.action = (recibo, form, InputControl) => {
            //console.log(InputControl.value, this.Contrato?.mora);
            //console.log(recibo.fecha_original);
            // @ts-ignore
            const fechaInicio = new Date(recibo.fecha_original).toStartDate().getTime();
            const fechaFin = new Date(InputControl.value).getTime();
            const diasMora = (fechaFin - fechaInicio) / (1000 * 60 * 60 * 24);
            //console.log("dias:", diasMora);
            const montoMora = recibo.total_dolares * (this.Contrato?.mora ?? 0.005) * diasMora;
            //console.log("monto:", montoMora);
            recibo.mora_dolares = (parseFloat(recibo.mora_dolares) + montoMora).toFixed(3);
            recibo.mora_cordobas = recibo.tasa_cambio * recibo.mora_dolares
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
                }.ModalElement:nth-child(n + 1):nth-child(-n + 7) {
                    grid-column: 1/2 !important;
                } .ModalElement:nth-child(n + 8):nth-child(-n + 13) {                    
                    grid-column: 2/3 !important;
                } .ModalElement:nth-child(n + 14):nth-child(-n + 30) {
                    grid-column: 3/4 !important;
                }  .ModalElement.titleContainer:nth-child(1){
                    grid-column: 1/3 !important;
                }  .ModalElement label {
                    display: block;
                    width: 100%;
                    margin: 0px;
                } `
        });
        this.calculoRecibo(this.Contrato, this.tasasCambio, proyeccionData.FormObject);
        this.proyeccion.appendChild(proyeccionData);

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
        this.generateRecibo();
        this.calculoRecibo(selectContrato, this.tasasCambio);
        this.selectedClientDetail.innerHTML = "";
        this.selectedClientDetail.append(html`<div>           
                <div class="column-venta">
                    <div class="DataContainer">
                        <span>Nombre:</span>
                        <label>${selectContrato.Catalogo_Clientes.primer_nombre + ' ' + selectContrato.Catalogo_Clientes.segundo_nombre + ' ' +  selectContrato.Catalogo_Clientes.primer_apellido + ' ' + selectContrato.Catalogo_Clientes.segundo_apellidio}</label>
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
                        <label>${// @ts-ignore
                            selectContrato.fecha?.toDateFormatEs() ?? "-"}</label>                       
                    </div>  
                    <div class="DataContainer">
                        <span>F/Último pago:</span>
                        <label>${// @ts-ignore
                            this.ultimaCuota?.fecha_pago?.toDateFormatEs() ?? "-"}</label>                       
                    </div>   
                    <div class="DataContainer">
                        <span>F/Próximo pago:</span>
                        <label>${// @ts-ignore
                            this.proximaCuota?.fecha?.toDateFormatEs()}</label>                       
                    </div>  
                    <div class="DataContainer">
                        <span>Fecha de cancelación:</span>
                        <label>${selectContrato.fecha_cancelar?.toDateFormatEs()}</label>                       
                    </div>     
                    <div class="DataContainer">
                        <span>Saldo actual C$:</span>                        
                        <label>${ // @ts-ignore
                            selectContrato.saldo * this.tasasCambio[0].valor_de_venta}</label>                       
                    </div>   
                    <div class="DataContainer">
                        <span>Saldo actual $:</span>                        
                        <label>${selectContrato.saldo}</label>                       
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
                        <label>${// @ts-ignore
                        this.tasasCambio[0].valor_de_venta}</label>                       
                    </div>
                    
                    <div class="DataContainer">
                        <span>Tasa de cambio compra:</span>
                        <label>${// @ts-ignore
                        this.tasasCambio[0].valor_de_compra}</label>                       
                    </div>                                  
                </div>
                <div>
                    <h4 style="text-align:center;">DATOS DEL RECIBO OFICIAL DE CAJA</h4>
            </div></div>`);       

        this.Manager.NavigateFunction("valoraciones", this.valoracionesContainer);
        //this.contratoDetailUpdate();
    }

    /**
     * 
     * @param {Transaction_Contratos} contrato
     * @param {Array<Catalogo_Cambio_Dolar>} contrato
     * @param {Recibos} contrato
     */
    calculoRecibo = (contrato, tasasCambio, formObject = this.reciboForm.FormObject) => {
        if (this.reciboForm != undefined) {
            for (const prop in this.reciboForm?.FormObject) {
                if (prop == "Detail_Valores") continue;
                if (prop == "Tasa_interes") continue;
                this.reciboForm.FormObject[prop] = contrato[prop]
            }

            contrato.Tbl_Cuotas.sort((a, b) => a.id_cuota - b.id_cuota);

            let primeraCuotaConCapitalMayorACero = 0;
            let interes_cargos = 0;
            let interes_demas_cargos_pagar_cordobas = 0;
            let abono_capital_cordobas = 0;
            let mora_interes = 0;
            let cuota_total = 0;
            let fecha = new Date();
            let totalRestante = 0;
            let mora_interes_cordobas = 0;

            let index = 0      
            for (const cuota of contrato.Tbl_Cuotas) {               
                if (cuota.pago_contado < cuota.total || contrato.Tbl_Cuotas.length == 1) {
                    fecha = cuota.fecha;
                    primeraCuotaConCapitalMayorACero = cuota.total;
                    interes_cargos = cuota.interes;
                    interes_demas_cargos_pagar_cordobas = cuota.interes * tasasCambio[0].valor_de_venta;
                    abono_capital_cordobas = cuota.abono_capital;
                    mora_interes = cuota.mora == null ? 0 : cuota.mora; // no permite el cero, preguntar a wilber sobre problema
                    mora_interes_cordobas = mora_interes * tasasCambio[0].valor_de_venta
                   
                    cuota_total = cuota.total;
                    this.cuota = cuota;
                    this.cuota
                    this.proximaCuota =  contrato.Tbl_Cuotas[index + 1]
                    this.ultimaCuota =  contrato.Tbl_Cuotas[index - 1]
                    break;
                }
                index ++;                
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


            formObject["tasa_cambio"] = tasasCambio[0].valor_de_venta;
            formObject["tasa_cambio_compra"] = tasasCambio[0].valor_de_compra;


            formObject["monto"] = contrato["monto"].toFixed(3);
            formObject["saldo_actual_cordobas"] = (contrato["saldo"] * tasasCambio[0].valor_de_venta).toFixed(3);
            formObject["saldo_actual_dolares"] = contrato["saldo"].toFixed(3);
            formObject["interes_cargos"] = interes_cargos.toFixed(3);
            
            formObject["interes_demas_cargos_pagar_cordobas"] = interes_demas_cargos_pagar_cordobas.toFixed(3);
            formObject["interes_demas_cargos_pagar_dolares"] = interes_cargos.toFixed(3);
           
            formObject["abono_capital_cordobas"] = (abono_capital_cordobas * tasasCambio[0].valor_de_venta).toFixed(3);
            formObject["abono_capital_dolares"] = abono_capital_cordobas.toFixed(3);;
            
            formObject["cuota_pagar_cordobas"] = (primeraCuotaConCapitalMayorACero * tasasCambio[0].valor_de_venta).toFixed(3);
            formObject["cuota_pagar_dolares"] = primeraCuotaConCapitalMayorACero;
            
            formObject["mora_cordobas"] = (mora_interes_cordobas).toFixed(3);
            formObject["mora_dolares"] = mora_interes?.toFixed(3);
            
            formObject["mora_interes_cordobas"] = (mora_interes_cordobas + interes_demas_cargos_pagar_cordobas).toFixed(3);
            formObject["mora_interes_dolares"] = (mora_interes + interes_cargos).toFixed(3);
            
            formObject["total_cordobas"] = (cuota_total * tasasCambio[0].valor_de_venta + mora_interes_cordobas).toFixed(3);
            formObject["total_dolares"] = (cuota_total + mora_interes).toFixed(3);
            
            
            formObject["total_parciales"] = 1;//TODO todo preguntar
            formObject["fecha_roc"] = new Date();
            formObject["paga_cordobas"] = (primeraCuotaConCapitalMayorACero * tasasCambio[0].valor_de_venta).toFixed(3);
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
    `
}

customElements.define('w-valoraciones-view', Gestion_RecibosView);
export { Gestion_RecibosView };
// @ts-ignore
window.addEventListener('load', async () => { MainBody.append(new Gestion_RecibosView()) })