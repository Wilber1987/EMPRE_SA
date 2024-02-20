//@ts-check
// @ts-ignore
import { WRender, ComponentsManager, WAjaxTools, WArrayF } from "../WDevCore/WModules/WComponentsTools.js";
import { StylesControlsV2, StylesControlsV3, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
// @ts-ignore
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import {  Catalogo_Cambio_Dolar, Catalogo_Clientes,  Detail_Prendas_Vehiculos_ModelComponent, Transaction_Contratos_ModelComponent } from "../FrontModel/DBODataBaseModel.js"
import {  Detalle_Factura, Tbl_Factura, Detail_Factura_ModelComponent  } from "../FrontModel/FacturacionModel.js"
// @ts-ignore
import { WFilterOptions } from "../WDevCore/WComponents/WFilterControls.js";
import { Detail_Prendas, Detail_Prendas_Vehiculos, Transaction_Contratos, ValoracionesTransaction } from "../FrontModel/Model.js";
import { css } from "../WDevCore/WModules/WStyledRender.js";
import { ValoracionesSearch, clientSearcher, contratosSearcher } from "../modules/SerchersModules.js";
//import { FacturasSearcher } from "../modules/FacturasSearcher.js.js";
import { ModalMessege, ModalVericateAction } from "../WDevCore/WComponents/WForm.js";
import { AmoritizationModule } from "../modules/AmortizacionModule.js";
import { WAppNavigator } from "../WDevCore/WComponents/WAppNavigator.js";
import { WModalForm } from "../WDevCore/WComponents/WModalForm.js";
import { Transactional_Configuraciones } from "../FrontModel/ADMINISTRATIVE_ACCESSDataBaseModel.js";

/**
 * @typedef {Object} facturaconfig
 * * @property {Tbl_Factura} [Entity]
 */
class Gestion_FacturacionView extends HTMLElement {

    /**
     * 
     * @param {facturaconfig} props 
     */
    constructor(props) {
        super();
        this.attachShadow({ mode: 'open' });
        //models
        this.entity = new Tbl_Factura(props?.Entity) ?? new Tbl_Factura();
        this.entity.Detalle_Factura = this.entity.Detalle_Factura ?? {}
        //this.entity = testData        
        this.componentsModel = new Transaction_Contratos_ModelComponent();
        this.OptionContainer = WRender.Create({ className: "OptionContainer" });
        this.TabContainer = WRender.Create({ className: "TabContainer", id: 'TabContainer' });
        this.Manager = new ComponentsManager({ MainContainer: this.TabContainer, SPAManage: false });
        this.facturasContainer = WRender.Create({ className: "facturas-container" });
        this.shadowRoot?.append(this.CustomStyle);
        this.Cliente = {}
        this.facturasDataset = [];
        this.selectedClientDetail = WRender.Create({ tagName: "div", className: "client-container" });
        this.amortizacionResumen = WRender.Create({ tagName: "div", className: "resumen-container" });
        this.contratosForm = WRender.Create({
            className: "contratos-form",
            children: [this.selectedClientDetail, this.amortizacionResumen]
        });
        this.SetOption();
        this.shadowRoot?.append(
            StylesControlsV2.cloneNode(true),
            StyleScrolls.cloneNode(true),
            StylesControlsV3.cloneNode(true),
            this.OptionContainer,
            this.TabContainer
        );
        this.Draw();
    }

    Draw = async () => {
        this.tasasCambio = await new Catalogo_Cambio_Dolar().Get();
        //this.InteresBase = WArrayF.SumValAtt(this.Intereses, "Valor");
        //this.entity.Transaction_Contratos.taza_interes_cargos = this.InteresBase;
        //AmoritizationModule.calculoAmortizacion(this.entity);        
        /**@type  {Catalogo_Cambio_Dolar}*/
        this.tasaActual = this.tasasCambio[0];       
        
        const modelPrendas = new Detalle_Factura({
            Detail_Prendas_Vehiculos: {
                type: 'Model',
                ModelObject: () => new Detail_Factura_ModelComponent(),
                hidden: false
            }
        });
       
        this.DetallesTable = new WTableComponent({
            Dataset: this.entity.Detalle_Factura ?? [],
            EntityModel: new Detail_Prendas({}),
            ModelObject: modelPrendas,
            AddItemsFromApi: false,
            AutoSave: false,
            id: "detalleTable",
            Options: {
                Delete: true,
                Edit: true,
                Search: true,
                DeleteAction: () => this.deleteItem(),
            }
        });
               
        this.inputObservacion = WRender.Create({
            tagName: 'textarea', placeholder: "observaciones...", className: "input-observacion", onchange: (ev) => {
                this.entity.Observaciones = ev.target.value;
            }
        });    
        this.contratosForm.append(this.DetallesTable);
        this.Manager.NavigateFunction("facturas", this.contratosForm);
        this.selectCliente(this.entity.Catalogo_Clientes.Catalogo_Clientes ?? {})
        this.valoracionResumen(this.entity);
    }

    SetOption() {
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Primary', innerText: 'Datos factura',
            onclick: () => this.Manager.NavigateFunction("facturas")
        }))
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Secundary', innerText: 'Buscar cliente',
            onclick: () => {
                if (!this.clientSercher) {
                    this.clientSercher = clientSearcher(this.selectCliente);
                }
                this.Manager.NavigateFunction("buscar-cliente", this.clientSercher)
            }
        }))
     
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Fifth', innerText: 'Guardar factura',
            onclick: async () => {
                if (this.entity.Detalle_Factura.length == 0) {
                    this.shadowRoot?.append(ModalMessege("Debe ingresar items para realizar la factura!"));
                    return;
                }                

                const response = await this.entity.Save();//todo metodo save en controller
                if (response.status == 200) {
                    this.shadowRoot?.append(ModalVericateAction(() => {
                        location.href = "/PagesViews/Transaction_ContratosViewDetail?numero_contrato=" + response.body.numero_contrato;
                    }, response.message));
                } else {
                    this.shadowRoot?.append(ModalMessege(response.message));
                }
            }
        }))
    }




    valoracionResumen(entity) {
        this.amortizacionResumen.innerHTML = "";
        if (entity.Transaction_Contratos.total_pagar_cordobas == undefined) {
            this.amortizacionResumen.innerHTML = `<div class="detail-container">Agregue prendas</div>`;
            return;
        }
        //.console.log(entity.Transaction_Contratos);
        this.amortizacionResumen.append(WRender.CreateStringNode(`<div class="detail-container"> 
            <div>
                <label class="value-container">
                    Sub Total: 
                    <span>${entity.Sub_Total?.toFixed(3)} %</span>
                </label>
                <label class="value-container">
                    Iva: 
                    <span>${entity.Iva?.toFixed(3)} %</span>
                </label>
                
                <label class="value-container">
                    Total: 
                    <span>$ ${entity.Total?.toFixed(3)}}</span>
                </label>
                <label class="value-container">
                    CAMBIO DE CÓRDOBAS A DÓLAR: 
                    <span>$ ${this.tasaActual?.valor_de_venta}</span>
                </label>
            </div>
            <div>
                <label class="value-container">
                     Forma Pago: 
                     <span>${entity.Forma_Pago}</span>
                </label>
                <label class="value-container">
                     Serie: 
                     <span>${entity.serie}</span>
                </label>
                <label class="value-container">
                     Concepto: 
                     <span>${entity.concepto}</span>
                </label>
                <label class="value-container">
                     Total a pagar C$: 
                     <span>${entity.Forma_Pago}</span>
                </label>
            </div>
            <div>
                <label class="value-container">
                     Observaciones: 
                     <span>${entity.Observaciones}</span>
                </label>                
            </div>
        </div>`));
        this.Manager.NavigateFunction("facturas");
    }

    selectCliente = (/**@type {Catalogo_Clientes} */ selectCliente) => {
        this.entity.Catalogo_Clientes = selectCliente;
        this.update();
        this.Manager.NavigateFunction("facturas");
    }

    deleteItem() {
        // @ts-ignore
        //this.inputPlazo.max = this.prioridadEnElPlazo();        
        // @ts-ignore
        this.entity.Detalle_Factura = this.prendasTable?.Dataset;
        // @ts-ignore
        //this.DetallesTable.Dataset = undefined;
        // @ts-ignore
        this.entity.Detalle_Factura = this.entity.Detalle_Factura.map(p => p.Transactional_Valoracion);
        this.update();
       
    }
    update() {
        
        //AmoritizationModule.calculoAmortizacion(this.entity);
        if (this.DetallesTable != undefined && this.entity.Detalle_Factura != undefined) {
            /*this.entity.Detalle_Factura.forEach(detalle => { //TODO ??
                detalle.monto_aprobado_dolares = detalle.Transactional_Valoracion.valoracion_empeño_dolares
            })
            this.DetallesTable.Dataset = this.entity.Transaction_Contratos.Detail_Prendas;*/
            this.DetallesTable?.DrawTable();
        }

        this.clientResumen(this.entity.Catalogo_Clientes);
        // @ts-ignore
        //this.inputPlazo.max = this.prioridadEnElPlazo();
        
        /*if (this.DetallesTable != undefined) {
            this.DetallesTable.Dataset = this.entity?.Transaction_Contratos?.Tbl_Cuotas ?? [];
            this.DetallesTable?.DrawTable();
        }*/
        this.valoracionResumen(this.entity);
    }
    clientResumen(/**@type {Catalogo_Clientes} */ selectCliente) {
        if (selectCliente == undefined) {
            this.selectedClientDetail.innerHTML = `<div class="detail-container">Seleccionar Cliente</div>`;
            return;
        }
        this.selectedClientDetail.innerHTML = "";
        this.selectedClientDetail.append(WRender.CreateStringNode(`<div class="detail-container">
            <label class="name"> Cliente seleccionado: ${selectCliente.primer_nombre ?? ""} ${selectCliente.segundo_nombre ?? ''} 
            ${selectCliente.primer_apellido ?? ''} ${selectCliente.segundo_apellidio ?? ''}</label>
            <label>Tipo de indentificación: ${selectCliente.Catalogo_Tipo_Identificacion?.Descripcion ?? ""}</label>
            <label>Número de documento: ${selectCliente.identificacion ?? ""}</label>
            <label>Teléfono: ${selectCliente.telefono ?? ""}</label>
        </div>`));
    }
    CustomStyle = css`
    .detail-container{
        padding: 20px;
        display: grid;
        grid-template-columns:  repeat(4, auto);
        gap: 20px 30px;
        border: solid 1px #b1b1b1;
        border-radius: 20px;
        font-size: 12px;
        margin: 10px 20px;
    }    
    .value-container {
        display: flex;
        justify-content: space-between;
    }
    .detail-container div {
        display: flex;
        flex-direction: column;
    } 
    .OptionContainer{
        display: flex;
        align-items: center;            
        gap: 15px;
        margin: 10px 20px ;
    } 
    .OptionContainer.form{
        border: solid 1px #b1b1b1;
        border-radius: 20px;
        font-size: 12px;
        padding: 20px;
        flex-wrap: wrap;
    } 
    input.input-plazo {
        width: 100px !important;
        text-align: right;
    }
    .input-observacion {
        border-radius: 5px;
    }
    w-filter-option {
        grid-column: span 2;
    }
`
}