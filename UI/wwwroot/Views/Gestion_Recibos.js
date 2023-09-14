//@ts-check
import { WRender, ComponentsManager, WAjaxTools } from "../WDevCore/WModules/WComponentsTools.js";
import { StylesControlsV2, StylesControlsV3, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { WFilterOptions } from "../WDevCore/WComponents/WFilterControls.js";
import { WModalForm } from "../WDevCore/WComponents/WModalForm.js";
import { ModalMessege, WForm } from "../WDevCore/WComponents/WForm.js";
import { Recibos, Transaction_ContratosModel, Catalogo_Clientes, Catalogo_Cambio_Dolar } from "../FrontModel/DBODataBaseModel.js";//todo eliminar notulizados
import { WOrtograficValidation } from "../WDevCore/WModules/WOrtograficValidation.js";
import { clientSearcher, contratosSearcher , ValoracionesSearch } from "../modules/SerchersModules.js";
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
            Valoracion_1: 0, dolares_1: 0,
            Valoracion_2: 0, dolares_2: 0,
            Valoracion_3: 0, dolares_3: 0,
        }
        this.valoracionesDataset = [];
        this.selectedClientDetail = WRender.Create({ tagName: "label", className: "selected-client" });
        this.amortizacionResumen = WRender.Create({ tagName: "label", innerText: this.valoracionResumen(0, 0, 0, 0) });
        this.Draw();
    }
    Draw = async () => {
        this.valoracionesContainer.innerHTML = "";
        this.tasasCambio = await new Catalogo_Cambio_Dolar().Get();        
        //this.Categorias = await new Catalogo_Categoria().Get();
        //this.Intereses = await new Transactional_Configuraciones().getTransactional_Configuraciones_Intereses();
        //this.Beneficios = await new Transactional_Configuraciones().getTransactional_Configuraciones_Beneficios();
        //this.InteresBase = WArrayF.SumValAtt(this.Intereses, "Valor");

        //this.buildValoresModel(this.tasasCambio);

        
        
        //this.valoracionModel = this.valoracionesModel(this.tasasCambio,this.multiSelectEstadosArticulos);

        this.valoracionModel = new Recibos();

        this.SetOption();

        this.valoracionesForm = new WForm({
            ModelObject: new Recibos(),// this.valoracionModel,
            AutoSave: false,
            Options: false,
            id: "valoracionesForm",
            // @ts-ignore
            SaveFunction: (/**@type {Transactional_Valoracion} */ valoracion) => {
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
            this.valoracionesForm,
            this.contratoDetail,
            //this.valoresForm,
            //this.multiSelectEstadosArticulos,
            //WRender.Create({ className: "nav-header", children: [this.TableNavigator, this.amortizacionResumen] }),
            this.TabContainerTables
        );
        if (!this.contratosSearcher) {
            this.contratosSearcher = contratosSearcher(this.selectContrato);
        }
        this.Manager.NavigateFunction("buscar-cliente", this.contratosSearcher);
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
    // buildValoresModel(tasasCambio) {
    //     this.valoresModel = {
    //         Valoracion_1: {
    //             type: "number", label: "Valoración 1 - C$:", action: () => {
    //                 this.valoresObject.dolares_1 = this.valoresObject.Valoracion_1 / tasasCambio[0].valor_de_compra;
    //                 /** @type {HTMLInputElement|undefined|null} */
    //                 const control = this.valoresForm?.shadowRoot?.querySelector(".dolares_1");
    //                 if (control != undefined || control != null) {
    //                     control.value = this.valoresObject.dolares_1.toString();
    //                 }
    //                 this.multiSelectEstadosArticulos?.SetOperationValues()
    //                 this.contratoDetailUpdate();
    //             }
    //         },
    //         dolares_1: {
    //             type: "number", label: "$:", action: () => {
    //                 this.valoresObject.Valoracion_1 = this.valoresObject.dolares_1 * tasasCambio[0].valor_de_compra;
    //                 /** @type {HTMLInputElement|undefined|null} */
    //                 const control = this.valoresForm?.shadowRoot?.querySelector(".Valoracion_1");
    //                 if (control != undefined || control != null) {
    //                     control.value = this.valoresObject.Valoracion_1.toString();
    //                 }
    //                 this.multiSelectEstadosArticulos?.SetOperationValues()
    //                 this.contratoDetailUpdate();
    //             }
    //         },
    //         Valoracion_2: {
    //             type: "number", label: "Valoración 2 - C$:", action: () => {
    //                 this.valoresObject.dolares_2 = this.valoresObject.Valoracion_2 / tasasCambio[0].valor_de_compra;
    //                 /** @type {HTMLInputElement|undefined|null} */
    //                 const control = this.valoresForm?.shadowRoot?.querySelector(".dolares_2");
    //                 if (control != undefined || control != null) {
    //                     control.value = this.valoresObject.dolares_2.toString();
    //                 }
    //                 this.multiSelectEstadosArticulos?.SetOperationValues()
    //                 this.contratoDetailUpdate();
    //             }
    //         },
    //         dolares_2: {
    //             type: "number", label: "$:", action: () => {
    //                 this.valoresObject.Valoracion_2 = this.valoresObject.dolares_2 * tasasCambio[0].valor_de_compra;
    //                 /** @type {HTMLInputElement|undefined|null} */
    //                 const control = this.valoresForm?.shadowRoot?.querySelector(".Valoracion_2");
    //                 if (control != undefined || control != null) {
    //                     control.value = this.valoresObject.Valoracion_2.toString();
    //                 }
    //                 this.multiSelectEstadosArticulos?.SetOperationValues()
    //                 this.contratoDetailUpdate();
    //             }
    //         },
    //         Valoracion_3: {
    //             type: "number", label: "Valoración 3 - C$:", action: () => {
    //                 this.valoresObject.dolares_3 = this.valoresObject.Valoracion_3 / tasasCambio[0].valor_de_compra;
    //                 /** @type {HTMLInputElement|undefined|null} */
    //                 const control = this.valoresForm?.shadowRoot?.querySelector(".dolares_3");
    //                 if (control != undefined || control != null) {
    //                     control.value = this.valoresObject.dolares_3.toString();
    //                 }
    //                 this.multiSelectEstadosArticulos?.SetOperationValues()
    //                 this.contratoDetailUpdate();
    //             }
    //         },
    //         dolares_3: {
    //             type: "number", label: "$:", action: () => {
    //                 this.valoresObject.Valoracion_3 = this.valoresObject.dolares_3 * tasasCambio[0].valor_de_compra;
    //                 /** @type {HTMLInputElement|undefined|null} */
    //                 const control = this.valoresForm?.shadowRoot?.querySelector(".Valoracion_3");
    //                 if (control != undefined || control != null) {
    //                     control.value = this.valoresObject.Valoracion_3.toString();
    //                 }
    //                 this.multiSelectEstadosArticulos?.SetOperationValues()
    //                 //this.contratoDetailUpdate();
    //             }
    //         }, total_cordobas: {
    //             type: "operation", label: "Total - C$", disabled: true, action: (data) => {
    //                 return ((parseFloat(data.Valoracion_1) + parseFloat(data.Valoracion_2) + parseFloat(data.Valoracion_3)) / 3).toFixed(2)
    //             }
    //         }, total_dolares: {
    //             type: "operation", label: "$:", disabled: true, action: (data) => {
    //                 return ((parseFloat(data.dolares_1) + parseFloat(data.dolares_2) + parseFloat(data.dolares_3)) / 3).toFixed(2)
    //             }
    //         }
    //     };
    // }

    calculoCordobas = (porcentaje) => {
        return (this.avgValores() * (porcentaje / 100)).toFixed(2);
    }
    calculoDolares = (porcentaje, tasa_cambio) => {
        return Math.round((this.avgValores() * (porcentaje / 100)) / tasa_cambio).toFixed(2);
    }
    avgValores() {
        return ((parseFloat(this.valoresObject.Valoracion_1.toString()) +
            parseFloat(this.valoresObject.Valoracion_2.toString()) +
            parseFloat(this.valoresObject.Valoracion_3.toString())) / 3);
    }
    SetOption() {
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Secundary', innerText: 'Buscar Contrato',
            onclick: () => {
                this.Manager.NavigateFunction("buscar-cliente", this.contratosSearcher)
            }
        }))
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Primary', innerText: 'Valoración',
            onclick: () => this.Manager.NavigateFunction("valoraciones", this.valoracionesContainer)
        }))

        /*this.OptionContainer.append(WRender.Create({//todo
            tagName: 'button', className: 'Block-Tertiary', innerText: 'Buscar valoraciones',
            onclick: () => this.Manager.NavigateFunction("Searcher", new ValoracionesSearch(this.selectValoracion))
        }))*/


        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Fifth', innerText: 'Guardar Recibo',
            onclick: async () => {
                if (false) {
                    this.append(ModalMessege("Agregue datos para poder continuar"));
                    return;
                }
                const valoracionesGuardadas = await this.valoracionModel?.Save() // this.valoracionModel?.GuardarValoraciones(this.valoracionesTable?.Dataset);
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
                //const valoracionesGuardadas = await this.valoracionModel?.GuardarValoraciones(this.valoracionesTable?.Dataset);
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
        console.log(selectContrato);
        this.Cliente = selectContrato;
        if (this.valoracionesForm != undefined) {
            //this.valoracionesForm.FormObject.Tasa_interes = this.getTasaInteres();
            this.valoracionesForm.DrawComponent();
        }
        //this.calculoAmortizacion();//ocupar metodo
        this.selectedClientDetail.innerHTML = 
                    `<div>
                    <h4>CONTRATO #: ${selectContrato.numero_contrato}</h4>
                    <div class="column-venta">
                        <label>VENTA DE COMPRA</label>
                        <span>Nombre: ${selectContrato.numero_contrato}</span>
                        <span>Dirección: ${selectContrato.Catalogo_Clientes.identificacion}</span>
                        <span>Identificación: ${selectContrato.numero_contrato}</span>
                    </div>                     
                </div>`;
        `
            Cliente seleccionado: ${selectContrato.numero_contrato} ${selectContrato.numero_contrato ?? ''} ${selectContrato.numero_contrato} ${selectContrato.numero_contrato ?? ''}
        `;
        this.Manager.NavigateFunction("valoraciones", this.valoracionesContainer);
        //this.contratoDetailUpdate();
    }
    /*getTasaInteres = () => {
        if (this.Cliente.Catalogo_Clasificacion_Interes) {
            return parseFloat(this.Cliente.Catalogo_Clasificacion_Interes.porcentaje)
                // @ts-ignore
                + this.InteresBase;
        } else {
            // @ts-ignore
            return 6 + this.InteresBase;
        }
    }*/
  
    contratoDetailUpdate() {
        // @ts-ignore
        this.contratoDetail.innerHTML = "";
        const detail = this.valoracionesForm?.FormObject;
        const beneficioVentaC = this.Beneficios?.find(b => b.Nombre == "BENEFICIO_VENTA_ARTICULO_COMPRADO");
        const beneficioVentaE = this.Beneficios?.find(b => b.Nombre == "BENEFICIO_VENTA_ARTICULO_EMPENO");
        const mora = detail.Tasa_interes * 2 / 100;
        const precio_venta_empeño = ((parseFloat(detail.valoracion_empeño_cordobas) * (mora + 1)) * (beneficioVentaE.Valor / 100 + 1));


        // @ts-ignore
        this.valoracionesForm.FormObject.precio_venta_empeño_cordobas = (precio_venta_empeño);

        // @ts-ignore
        this.valoracionesForm.FormObject.precio_venta_empeño_dolares = (precio_venta_empeño / this.tasasCambio[0].valor_de_compra)
        // @ts-ignore
        //const moraDolares =  mora / this.tasasCambio[0].valor_de_compra;    
        this.contratoDetail?.append(WRender.CreateStringNode(`<div>
            <h4>BENEFICIOS:</h4>
            <div class="column-venta">
                <label>VENTA DE COMPRA</label>
                <span>C$ ${((detail.valoracion_compra_cordobas) * (beneficioVentaC.Valor / 100 + 1)).toFixed(2)}</span>
                <span>$ ${((detail.valoracion_compra_dolares) * (beneficioVentaC.Valor / 100 + 1)).toFixed(2)}</span>
            </div> 
            <div class="column-venta">
                <label>VENTA DE EMPEÑO</label>
                <span>C$ ${precio_venta_empeño.toString() == "NaN" ? "0.00"
                : precio_venta_empeño.toFixed(2)}</span>
                <span>$ ${precio_venta_empeño.toString() == "NaN" ? "0.00"
                : (precio_venta_empeño /
                    // @ts-ignore
                    this.tasasCambio[0].valor_de_compra).toFixed(2)}</span>
            </div> 
        </div>`));
    }

    CustomStyle = css`
        .valoraciones-container{
            padding: 20px;
            display: grid;
            grid-template-columns: 400px calc(100% - 730px) 300px;
            gap: 20px 30px;
        }
        #valoracionesForm, .multiSelectEstadosArticulos {
            grid-column: span 2;
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