//@ts-check
import { WRender, ComponentsManager, WAjaxTools } from "../WDevCore/WModules/WComponentsTools.js";
import { StylesControlsV2, StylesControlsV3, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { WFilterOptions } from "../WDevCore/WComponents/WFilterControls.js";
import { WModalForm } from "../WDevCore/WComponents/WModalForm.js";
import { ModalMessege, WForm } from "../WDevCore/WComponents/WForm.js";
import { Recibos, Transaction_ContratosModel, Catalogo_Clientes, Catalogo_Cambio_Dolar } from "../FrontModel/DBODataBaseModel.js";//todo eliminar notulizados
import { WOrtograficValidation } from "../WDevCore/WModules/WOrtograficValidation.js";
import { clientSearcher, contratosSearcher, ValoracionesSearch } from "../modules/SerchersModules.js";
import { css } from "../WDevCore/WModules/WStyledRender.js";
import { WAppNavigator } from "../WDevCore/WComponents/WAppNavigator.js";
class Gestion_RecibosView extends HTMLElement {
    // @ts-ignore
    constructor(props) {
        super();
        this.OptionContainer = WRender.Create({ className: "OptionContainer" });
        this.TabContainer = WRender.Create({ className: "TabContainer", id: 'TabContainer' });
        this.Manager = new ComponentsManager({ MainContainer: this.TabContainer, SPAManage: false });
        this.valoracionesContainer = WRender.Create({ className: "valoraciones-container" });
        this.append(this.CustomStyle);
        this.Cliente = {}
        this.valoresObject = {
            
        }

        this.pagosObject = {
            pago_cordobas: 0, pago_dolares: 0
        }

        this.valoracionesDataset = [];
        this.selectedClientDetail = WRender.Create({ tagName: "label", className: "selected-client" });
        
        this.Draw();
    }
    Draw = async () => {
        this.valoracionesContainer.innerHTML = "";
        this.tasasCambio = await new Catalogo_Cambio_Dolar().Get();
        //this.Categorias = await new Catalogo_Categoria().Get();        
        //this.InteresBase = WArrayF.SumValAtt(this.Intereses, "Valor");

        this.buildValoresModel(this.tasasCambio);


        //this.reciboModel = this.valoracionesModel(this.tasasCambio,this.multiSelectEstadosArticulos);

        this.reciboModel = new Recibos({
            paga_cordobas: { type: 'number',  action: (ObjectF, form) => {                    
                    console.log(form)
                    
                    this.reciboModel.paga_dolares.val = 77;
                    //this.reciboModel.FormObject.paga_dolares = 77;
                    form.DrawComponent();
                }
            },
            paga_dolares:{ type: 'number',  action: (ObjectF, form) => {
                    this.reciboModel.FormObject.paga_cordobas = 77;
                    form.DrawComponent();
                }
            }
        });
        // new Recibos();

        this.SetOption();

        this.reciboForm = new WForm({
            ModelObject: this.reciboModel,
            AutoSave: false,
            Options: false,
            id: "reciboForm",
            // @ts-ignore
            SaveFunction: (/**@type {Recibos} */ recibo) => {
            }, CustomStyle: css`
                .divForm{
                    display: "grid";
                    grid-template-columns: repeat(5, calc(20% - 15px));
                    grid-template-rows: repeat(3, auto)
                } .textAreaContainer{
                    grid-row: span 1 !important;
                    padding-bottom: 0px !important;
                }  .ModalElement label {
                    display: block;
                    width: 100%;
                    margin: 0px;
                } `
        });

        this.valoresForm = new WForm({
            EditObject: this.valoresObject,
            ModelObject: this.valoresModel,
            Options: false,
            DivColumns: "calc(100% - 160px) 150px",
            // @ts-ignore
            ProxyAction: (/**@type {WForm} */ valoracion) => {
                //this.reciboForm?.SetOperationValues();
            }, CustomStyle: css`
                .ModalElement {
                    display: grid;
                    grid-template-columns: auto 120px;
                    align-items: center;
                } .ModalElement label {
                    display: block;
                    width: 100%;
                    margin: 0px;
                } input {
                    min-width: 120px;
                }`
        });


        this.contratoDetail = WRender.Create({ className: "info-header-contrato" });



        this.TabContainerTables = WRender.Create({ className: "TabContainerTables", id: 'TabContainerTables' });
        this.ManagerTables = new ComponentsManager({ MainContainer: this.TabContainerTables });
        /*this.TableNavigator = new WAppNavigator({//para navegar en las tablas de la valoracion parte inferior
            NavStyle: "Tab",
            Inicialize: true,
            Elements: [{
                name: "Amortización de deuda", action: () => {
                    this.ManagerTables?.NavigateFunction("cuotas", this.CuotasTable)
                }
            }, {
                name: "Valoraciones", action: () => {
                    this.ManagerTables?.NavigateFunction("valoraciones", this.valoracionesTable)
                }
            }]
        })*/

        this.valoracionesContainer.append(
            this.selectedClientDetail,
            this.reciboForm,
            this.contratoDetail,
            this.valoresForm,
            //this.multiSelectEstadosArticulos,
            //WRender.Create({ className: "nav-header", children: [this.TableNavigator, this.amortizacionResumen] }),
            this.TabContainerTables
        );
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
    buildValoresModel(tasasCambio) {
        this.valoresModel = {
            pago_cordobas: {
                type: "number", label: "Paga C$:", action: (element) => {
                    this.valoresObject.pago_dolares = (this.valoresObject.pago_cordobas / tasasCambio[0].valor_de_compra).toFixed(2);
                    this.reciboForm.FormObject.monto = this.valoresObject.pago_dolares 
                    //console.log(this.reciboForm.FormObject.monto);

                    //const control = this.valoresForm?.shadowRoot?.querySelector(".pago_cordobas");

                    this.reciboForm?.DrawComponent();
                   
                }
            },
            pago_dolares: {
                type: "number", label: "$:", action: () => {
                    this.valoresObject.pago_cordobas = (this.valoresObject.pago_dolares * tasasCambio[0].valor_de_compra).toFixed(2);
                  
                }
            }, cancela: {
                type: "radio", label: "Cancela", Dataset : ["Cancela", "Solo Abono"], action: (value) => {
                    //console.log(value.cancela);
                    this.valoresObject.pago_cordobas = this.valoresObject.pago_dolares * tasasCambio[0].valor_de_compra;
                    /** @type {HTMLInputElement|undefined|null} */
                    const control = this.valoresForm?.shadowRoot?.querySelector(".pago_cordobas");
                    if (control != undefined || control != null) {
                        control.value = this.valoresObject.pago_cordobas.toString();
                    }
                }
            }             
        };
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
            onclick: () => this.Manager.NavigateFunction("valoraciones", this.valoracionesContainer)
        }))
     
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Fifth', innerText: 'Guardar Recibo',
            onclick: async () => {
                console.log(this.reciboForm?.FormObject);
                if (!this.reciboForm?.Validate()) {
                    this.append(ModalMessege("Agregue datos para poder continuar"));
                    return;
                }
                const valoracionesGuardadas = await new Recibos(this.reciboForm?.FormObject).Save() //this.reciboModel?.Save() // this.reciboModel?.GuardarValoraciones(this.valoracionesTable?.Dataset);
                if (valoracionesGuardadas?.length > 0) {
                    this.append(ModalMessege("Valoraciones guardadas correctamente"));
                }
                
            }
        }))

        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Success', innerText: 'Generar Contrato',
            onclick: async () => {
                if (false) {
                    this.append(ModalMessege("Agregue valoraciones para poder continuar"));
                    return;
                }
                if (this.Cliente?.codigo_cliente == undefined) {
                    this.append(ModalMessege("Seleccione un cliente para continuar"));
                    return;
                }
                // @ts-ignore
                //const valoracionesGuardadas = await this.reciboModel?.GuardarValoraciones(this.valoracionesTable?.Dataset);
                // const contract = this.calculoAmortizacion();
                //console.log(JSON.stringify(WArrayF.replacer(contract)));
                // console.log(contract);
                const response = await this.calculoAmortizacion().SaveDataContract();
                if (response) {
                    // @ts-ignore
                    window.location = "/PagesViews/Transaction_ContratosView";
                }
            }
        }))
    }
    selectContrato = (/**@type {Transaction_ContratosModel} */ selectContrato) => {
        //console.log(selectContrato);
        this.Cliente = selectContrato;
        if (this.reciboForm != undefined) {
            //this.reciboForm.FormObject.Tasa_interes = this.getTasaInteres();
            this.reciboForm.DrawComponent();
        }
        //this.calculoAmortizacion();//ocupar metodo
        this.selectedClientDetail.innerHTML =
            `<div>           
                    <div class="column-venta">
                        <div class="campo">
                            <span>Nombre:</span>
                            <input type="text" value="${selectContrato.Catalogo_Clientes.primer_nombre+' '+selectContrato.Catalogo_Clientes.segundo_nombre+' '+selectContrato.Catalogo_Clientes.primer_apellido+' '+selectContrato.Catalogo_Clientes.segundo_apellido}" disabled>
                            <span>Dirección:</span>
                            <input type="text" value="${selectContrato.Catalogo_Clientes.direccion}" disabled>
                        </div>                        
                        <div class="campo">
                            <span>Identificación:</span>
                            <input type="text" value="${selectContrato.Catalogo_Clientes.identificacion}" disabled>
                            <span>contrato #:</span>
                            <input type="text" value="${selectContrato.numero_contrato}" disabled>
                        </div>
                    </div>                  
                </div>
                <div>
                    <h4 style="text-align:center;">DATOS DEL RECIBO OFICIAL DE CAJA</h4>
                </div>`;
        this.calculoRecibo(selectContrato, this.tasasCambio);

        this.Manager.NavigateFunction("valoraciones", this.valoracionesContainer);
        //this.contratoDetailUpdate();
    }

    /**
     * 
     * @returns {Recibos}
     */
    calculoRecibo = (contrato, tasasCambio) => {
        if (this.reciboForm != undefined) {
            for (const prop in this.reciboForm?.FormObject) {
                if (prop == "Detail_Valores") continue;
                if (prop == "Tasa_interes") continue;
                this.reciboForm.FormObject[prop] = contrato[prop]
                //this.reciboForm.FormObject["consecutivo"] = 5;
                //this.reciboForm.FormObject["numero_contrato"] = 4;

            }
            
            
            contrato.Tbl_Cuotas.sort((a, b) => a.id_cuota - b.id_cuota);
            let primeraCuotaConCapitalMayorACero = 0;

            for (const cuota of contrato.Tbl_Cuotas) {
                if (cuota.capital_restante > 0) {
                    primeraCuotaConCapitalMayorACero = cuota.capital_restante;
                    break; 
                }
            }

            this.reciboForm.FormObject["saldo_actual"] = contrato["saldo_actual"];
            
            this.reciboForm.FormObject["tasa_cambio"] = tasasCambio[0].valor_de_compra;
            this.reciboForm.FormObject["tasa_cambio_compra"] = tasasCambio[0].valor_de_compra;
            this.reciboForm.FormObject["tasa_cambio_centa"] = tasasCambio[0].valor_de_venta;

            this.reciboForm.FormObject["monto"] = contrato["monto"];

            this.reciboForm.FormObject["saldo_actual_cordobas"] = contrato["saldo"];
            this.reciboForm.FormObject["saldo_actual_dolares"] = (contrato["saldo"] / contrato["taza_cambio"]).toFixed(2);
            this.reciboForm.FormObject["interes_cargos"] = contrato["saldo"]; //todo
            
            this.reciboForm.FormObject["interes_demas_cargos_pagar_cordobas"] = contrato["saldo"]; //todo
            this.reciboForm.FormObject["interes_demas_cargos_pagar_dolares"] = contrato["saldo"]; //todo
            this.reciboForm.FormObject["abono_capital_cordobas"] = contrato["saldo"]; //todo
            this.reciboForm.FormObject["abono_capital_dolares"] = contrato["saldo"]; //todo
            this.reciboForm.FormObject["cuota_pagar_cordobas"] = contrato["saldo"]; //todo
            this.reciboForm.FormObject["cuota_pagar_dolares"] = contrato["saldo"]; //todo
            this.reciboForm.FormObject["mora_cordobas"] = contrato["mora"]?.toFixed(2);//todo
            this.reciboForm.FormObject["mora_dolares"] = (contrato["mora"] / tasasCambio[0].valor_de_compra).toFixed(2);//todo
            this.reciboForm.FormObject["mora_interes_cordobas"] = primeraCuotaConCapitalMayorACero; //todo contrato[""];
            this.reciboForm.FormObject["mora_interes_dolares"] = (primeraCuotaConCapitalMayorACero / tasasCambio[0].valor_de_venta).toFixed(2); //todo contrato[""];
            this.reciboForm.FormObject["total_cordobas"] = contrato["saldo"]; //todo
            this.reciboForm.FormObject["total_dolares"] = contrato["saldo"]; //todo
            this.reciboForm.FormObject["total_parciales"] = contrato["saldo"]; //todo
            this.reciboForm.FormObject["fecha_roc"] = new Date();
            this.reciboForm.FormObject["paga_cordobas"] = contrato["saldo"]; //todo
            this.reciboForm.FormObject["paga_dolares"] = contrato["saldo"]; //todo
            this.reciboForm.FormObject["solo_abono"] = true;
            this.reciboForm.FormObject["cancelar"] = false;


            //console.log(contrato)
            //console.log("----")
            //console.log(this.reciboForm.FormObject)
            //this.reciboForm.DrawComponent();
            /*if (this.valoresForm != undefined) {
                // @ts-ignore
                if (new Date().subtractDays(40) < new Date(valoracion.Fecha)) {
                    this.valoresObject.Valoracion_1 = valoracion.Detail_Valores?.Valoracion_1 ?? 0;
                    this.valoresObject.dolares_1 = valoracion.Detail_Valores?.dolares_1 ?? 0;
                    this.valoresObject.Valoracion_2 = valoracion.Detail_Valores?.Valoracion_2 ?? 0;
                    this.valoresObject.dolares_2 = valoracion.Detail_Valores?.dolares_2 ?? 0;
                    this.valoresObject.Valoracion_3 = valoracion.Detail_Valores?.Valoracion_3 ?? 0;
                    this.valoresObject.dolares_3 = valoracion.Detail_Valores?.dolares_3 ?? 0;
                    this.valoresForm.DrawComponent();
                } else {
                    this.valoresObject.Valoracion_1 = 0;
                    this.valoresObject.dolares_1 = 0;
                    this.valoresObject.Valoracion_2 = 0;
                    this.valoresObject.dolares_2 = 0;
                    this.valoresObject.Valoracion_3 = 0;
                    this.valoresObject.dolares_3 = 0;
                    this.valoresForm.DrawComponent();
                }
            }*/
        }
        //this.beneficiosDetailUpdate();
        //this.Manager.NavigateFunction("valoraciones", this.valoracionesContainer);
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
            grid-template-columns: 47% 47%;
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
    `
}

customElements.define('w-valoraciones-view', Gestion_RecibosView);
export { Gestion_RecibosView };
// @ts-ignore
window.addEventListener('load', async () => { MainBody.append(new Gestion_RecibosView()) })