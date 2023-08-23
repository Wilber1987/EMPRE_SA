//@ts-check
// @ts-ignore
import { WRender, ComponentsManager, WAjaxTools, WArrayF } from "../WDevCore/WModules/WComponentsTools.js";
import { StylesControlsV2, StylesControlsV3, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
// @ts-ignore
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { Catalogo_Cambio_Dolar, Catalogo_Clientes, Detail_PrendasModel, Detail_Prendas_VehiculosModel, Transaction_ContratosModel } from "../FrontModel/DBODataBaseModel.js"
// @ts-ignore
import { WFilterOptions } from "../WDevCore/WComponents/WFilterControls.js";
import { Detail_Prendas, Detail_Prendas_Vehiculos, Transaction_Contratos, ValoracionesContrato } from "../FrontModel/Model.js";
import { css } from "../WDevCore/WModules/WStyledRender.js";
import { ValoracionesSearch, clientSearcher, contratosSearcher } from "../modules/SerchersModules.js";
import { ModalMessege } from "../WDevCore/WComponents/WForm.js";
import { AmoritizationModule } from "../modules/AmortizacionModule.js";
import { WAppNavigator } from "../WDevCore/WComponents/WAppNavigator.js";
import { WModalForm } from "../WDevCore/WComponents/WModalForm.js";

/**
 * @typedef {Object} ContratosConfig
 * * @property {ValoracionesContrato} [Entity]
 */
class Transaction_ContratosView extends HTMLElement {
    /**
     * 
     * @param {ContratosConfig} props 
     */
    constructor(props) {
        super();
        this.attachShadow({ mode: 'open' });
        //models
        this.entity = new ValoracionesContrato(props?.Entity) ?? new ValoracionesContrato();
        //this.entity = testData
        AmoritizationModule.calculoAmortizacion(this.entity);
        this.componentsModel = new Transaction_ContratosModel();
        this.OptionContainer = WRender.Create({ className: "OptionContainer" });
        this.TabContainer = WRender.Create({ className: "TabContainer", id: 'TabContainer' });
        this.Manager = new ComponentsManager({ MainContainer: this.TabContainer, SPAManage: false });
        this.valoracionesContainer = WRender.Create({ className: "valoraciones-container" });
        this.shadowRoot?.append(this.CustomStyle);
        this.Cliente = {}
        this.valoracionesDataset = [];
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
        /**@type  {Catalogo_Cambio_Dolar}*/
        this.tasaActual = this.tasasCambio[0];
        // @ts-ignore
        const isVehiculo = this.entity.Detail_Prendas?.find(p => p.Catalogo_Categoria.id_categoria == 2);
        const modelPrendas = new Detail_PrendasModel({
            Detail_Prendas_Vehiculos: {
                type: 'Model',
                ModelObject: () => new Detail_Prendas_VehiculosModel(),
                EntityModel: () => new Detail_Prendas_Vehiculos(),
                hidden: isVehiculo == undefined ? true : false
            }
        });
        this.prendasTable = new WTableComponent({
            Dataset: this.entity.Detail_Prendas,
            EntityModel: new Detail_Prendas({}),
            ModelObject: modelPrendas,
            AddItemsFromApi: false
        })

        this.inputPlazo = WRender.Create({
            tagName: 'input', type: 'number', className: "input-plazo", onchange: (ev) => {
                this.entity.plazo = ev.target.value;
                this.update();
            }, value: 1, min: 1, max: this.prioridadEnElPlazo()
        });
        this.inputObservacion = WRender.Create({
            tagName: 'textarea', placeholder: "observaciones...", className: "input-observacion", onchange: (ev) => {
                this.entity.observaciones = ev.target.value;
            }
        });
        const optionContainer = WRender.Create({
            className: "OptionContainer form",
            children: [
                "Plazo:", this.inputPlazo,
                "Fecha de cancelación:",
                this.fechaCancelacion(), this.inputObservacion,
            ]
        });
        this.contratosForm.append(optionContainer, this.prendasTable);
        this.Manager.NavigateFunction("valoraciones", this.contratosForm);
        this.selectCliente(this.entity.Catalogo_Clientes)
        this.valoracionResumen(this.entity)

    }
    /**
     * 
     * @returns {Number}
     */
    prioridadEnElPlazo() {
        const prioridad = this.entity.Detail_Prendas?.find(p =>
            p.Transactional_Valoracion.Catalogo_Categoria.prioridad ==
            WArrayF.MinValue(this.entity.Detail_Prendas.map(
                sp => sp.Transactional_Valoracion.Catalogo_Categoria), "prioridad"));
        // @ts-ignore
        return prioridad?.Catalogo_Categoria?.plazo_limite ?? 1

    }
    /**
    * 
    * @returns {String}
    */
    fechaCancelacion() {
        if (this.entity.Transaction_Facturas == undefined) {
            // @ts-ignore
            return new Date().toString().toDateFormatEs();
        }
        const prioridad = WArrayF.MaxDateValue(this.entity.Transaction_Facturas, "fecha");
        // @ts-ignore
        return prioridad.toString().toDateFormatEs();

    }


    SetOption() {
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Primary', innerText: 'Datos contrato',
            onclick: () => this.Manager.NavigateFunction("valoraciones")
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
            tagName: 'button', className: 'Block-Tertiary', innerText: 'Buscar valoraciones',
            onclick: () => this.Manager.NavigateFunction("Searcher",
                new ValoracionesSearch(this.selectValoracion))
        }))
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Fifth', innerText: 'Guardar contrato',
            onclick: async () => {
                const contract = await this.entity.VerContrato();
                this.shadowRoot?.append(new WModalForm({
                    ObjectModal: WRender.Create({
                        tagName: "iframe", src: contract.value, style: {
                            width: "100%",
                            minHeight: "700px"
                        }
                    })
                }))

                //this.append(ModalMessege("Valoraciones guardadas correctamente"));
            }
        }))
    }
    selectCliente = (/**@type {Catalogo_Clientes} */ selectCliente) => {
        this.entity.Catalogo_Clientes = selectCliente;
        this.update();
        this.Manager.NavigateFunction("valoraciones");
    }
    /**
     * 
     * @param {ValoracionesContrato} entity 
     * @returns 
     */
    valoracionResumen(entity) {
        this.amortizacionResumen.innerHTML = "";
        if (entity.taza_interes_cargos == undefined) {
            this.amortizacionResumen.innerHTML = `<div class="detail-container">Agregue prendas</div>`;
            return;
        }
        this.amortizacionResumen.append(WRender.CreateStringNode(`<div class="detail-container"> 
            <div>
                <label class="value-container">
                    CARGOS A PAGAR: 
                    <span>${entity.taza_interes_cargos} %</span>
                </label>
                <label class="value-container">
                    GESTIÓN CREDITICIA: 
                    <span>${entity.gestion_crediticia} %</span>
                </label>
                
                <label class="value-container">
                    CAMBIO DE DÓLAR A CÓRDOBAS: 
                    <span>$ ${this.tasaActual?.valor_de_venta}</span>
                </label>
                <label class="value-container">
                    CAMBIO DE CÓRDOBAS A DÓLAR: 
                    <span>$ ${this.tasaActual?.valor_de_compra}</span>
                </label>
            </div>
            <div>
                <label class="value-container">
                     Valor Capital C$: 
                     <span>${entity.valoracion_empeño_cordobas?.toFixed(2)}</span>
                </label>
                <label class="value-container">
                     Int. y demas cargo $: 
                     <span>${entity.interes?.toFixed(2)}</span>
                </label>
                <label class="value-container">
                     Cuota fija C$: 
                     <span>${entity.cuotafija?.toFixed(2)}</span>
                </label>
                <label class="value-container">
                     Total a pagar C$: 
                     <span>${entity.total_pagar_cordobas?.toFixed(2)}</span>
                </label>
            </div>
            <div>
                <label class="value-container">
                     Valor Capital $: 
                     <span>${entity.valoracion_empeño_dolares?.toFixed(2)}</span>
                </label>
                <label class="value-container">
                     Int. y demas cargos $: 
                     <span>${entity.interes_dolares?.toFixed(2)}</span>
                </label>
                <label class="value-container">
                     Cuota fija $: 
                     <span>${entity.cuotafija_dolares?.toFixed(2)}</span>
                </label>
                <label class="value-container">
                     Total a pagar  $: 
                     <span>${entity.total_pagar_dolares?.toFixed(2)}</span>
                </label>
            </div>
        </div>`));
        this.Manager.NavigateFunction("valoraciones");
    }
    clientResumen(/**@type {Catalogo_Clientes} */ selectCliente) {
        if (selectCliente == undefined) {
            this.selectedClientDetail.innerHTML = `<div class="detail-container">Seleccionar Cliente</div>`;
            return;
        }
        this.selectedClientDetail.innerHTML = "";
        this.selectedClientDetail.append(WRender.CreateStringNode(`<div class="detail-container">
            <label class="name"> Cliente seleccionado: ${selectCliente.primer_nombre} ${selectCliente.segundo_nombre ?? ''} 
            ${selectCliente.primer_apellido} ${selectCliente.segundo_apellidio ?? ''}</label>
            <label>Tipo de indentificación: ${selectCliente.Catalogo_Tipo_Identificacion.Descripcion}</label>
            <label>Número de documento: ${selectCliente.identificacion}</label>
            <label>Teléfono: ${selectCliente.telefono}</label>
        </div>`));
    }
    // @ts-ignore
    selectValoracion = (valoracion) => {
        // @ts-ignore
        const existVehiculo = this.entity.Detail_Prendas?.find(p => p.Catalogo_Categoria.id_categoria == 2);
        if (existVehiculo != undefined && valoracion.Catalogo_Categoria.id_categoria != 2) {
            this.append(ModalMessege("Anteriormente valoro un vehículo por lo tanto no puede agregar valoraciones de diferente categoría"));
            return;
        }
        // @ts-ignore
        const notExistVehiculo = this.entity.Detail_Prendas?.find(p => p.Catalogo_Categoria.id_categoria != 2);
        if (notExistVehiculo != undefined && valoracion.Catalogo_Categoria.id_categoria == 2) {
            this.append(ModalMessege("Anteriormente valoro un artículo distinto de vehículo por lo tanto no puede agregar valoraciones de esta categoría"));
            return;
        }
        this.entity.Detail_Prendas = this.entity.Detail_Prendas ?? [];
        this.entity.Detail_Prendas?.push(new Detail_Prendas({
            Descripcion: valoracion.Descripcion,
            modelo: valoracion.Modelo,
            mara: valoracion.Marca,
            serie: valoracion.Serie,
            pprenda: valoracion.valoracion_empeño_cordobas,
            en_manos_de: undefined,
            Catalogo_Categoria: valoracion.Catalogo_Categoria,
            Transactional_Valoracion: valoracion
        }))
        this.update();
        this.Manager.NavigateFunction("valoraciones");
    }
    update() {
        AmoritizationModule.calculoAmortizacion(this.entity);
        if (this.prendasTable != undefined && this.entity.Detail_Prendas != undefined) {
            console.log(this.entity.Detail_Prendas);
            this.prendasTable.Dataset = this.entity.Detail_Prendas;
            this.prendasTable?.DrawTable();
        }

        this.clientResumen(this.entity.Catalogo_Clientes);
        // @ts-ignore
        this.inputPlazo.max = this.prioridadEnElPlazo();
        this.valoracionResumen(this.entity);
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
customElements.define('w-transaction_contratos', Transaction_ContratosView);
export { Transaction_ContratosView }

class MainContract extends HTMLElement {
    constructor(contrato) {
        super();
        if (contrato.Detail_Prendas != null) {
            this.ElementsNav.unshift({
                name: "Contrato valorado", action: () => this.Manager.NavigateFunction("contrato-valorado", new Transaction_ContratosView({ Entity: contrato }))
            });
        }
        this.componentsModel = new Transaction_ContratosModel();
        this.OptionContainer = WRender.Create({ className: "OptionContainer" });
        this.TabContainer = WRender.Create({ className: "TabContainer", id: 'TabContainer' });
        this.Manager = new ComponentsManager({ MainContainer: this.TabContainer, SPAManage: false });
        this.valoracionesContainer = WRender.Create({ className: "valoraciones-container" });
        this.navigator = new WAppNavigator({ Inicialize: true, Elements: this.ElementsNav })
        this.append(this.CustomStyle, this.OptionContainer, this.navigator, this.TabContainer);
        this.indexContract = 0;
        this.DrawComponent();
    }
    ElementsNav = [
        {
            name: "Contratos", action: () => {
                this.Manager.NavigateFunction("contratos", contratosSearcher())
            }
        }, {
            name: "Nuevo Contrato", action: () => {
                const date = new Date();
                const index = this.indexContract
                // @ts-ignore
                const element = this.navigator.Elements.find(n => n.name == "Contratos en proceso");
                // @ts-ignore
                if (element != undefined) {
                    // @ts-ignore
                    element.SubNav.Elements.push({
                        // @ts-ignore
                        name: "contrato  -  " + (this.indexContract + 1),
                        deleteOption: true,
                        action: () => {
                            this.Manager.NavigateFunction("contrato-" + index, new Transaction_ContratosView({}));
                        }
                    })
                } else {
                    // @ts-ignore
                    this.navigator.Elements.push({
                        name: "Contratos en proceso", SubNav: {
                            Elements: [{
                                // @ts-ignore
                                name: "contrato  -  " + (this.indexContract + 1),
                                deleteOption: true,
                                action: () => {
                                    this.Manager.NavigateFunction("contrato-" + index, new Transaction_ContratosView({}));
                                }
                            }]
                        }
                    })
                }
                this.navigator.DrawAppNavigator();
                this.Manager.NavigateFunction("contrato-" + this.indexContract, new Transaction_ContratosView({}))
                this.indexContract++;
            }
        }
    ]
    connectedCallback() { }
    DrawComponent = async () => {

    }
    CustomStyle = css``
}
customElements.define('w-main-contract', MainContract);
export { MainContract }

window.addEventListener('load', async () => {
    const contrato = await new ValoracionesContrato().GetValoracionContrato();
    // @ts-ignore
    //
    MainBody.append(new MainContract(contrato))
    //MainBody.append(new MainContract(testData))
})
/**@type {ValoracionesContrato} */
const testData = new ValoracionesContrato({
    "valoracion_compra_cordobas": 10400,
    "valoracion_compra_dolares": 289.7,
    "valoracion_empeño_cordobas": 8000,
    "valoracion_empeño_dolares": 222.84,
    "tasas_interes": 11,
    taza_interes_cargos: 9,
    gestion_crediticia: 1,
    cuotafija: 100,
    interes: 100,
    "plazo": "6",
    taza_cambio: 36.2,
    "fecha": "2023-07-16T20:21:50.052Z",
    "Transaction_Facturas": [{
        "fecha": "2023-08-16T20:21:50.000Z", "total": "1891.01", "interes": "880.00", "abono_capital": "1011.01", "capital_restante": "6988.99"
    },
    {
        "fecha": "2023-09-16T20:21:50.000Z", "total": "1891.01", "interes": "768.79", "abono_capital": "1122.22", "capital_restante": "5866.76"
    }, {
        "fecha": "2023-10-16T20:21:50.000Z", "total": "1891.01", "interes": "645.34", "abono_capital": "1245.67", "capital_restante": "4621.10"
    },
    {
        "fecha": "2023-11-16T20:21:50.000Z", "total": "1891.01", "interes": "508.32", "abono_capital": "1382.69", "capital_restante": "3238.40"
    },
    {
        "fecha": "2023-12-16T20:21:50.000Z", "total": "1891.01", "interes": "356.22", "abono_capital": "1534.79", "capital_restante": "1703.61"
    }, {
        "fecha": "2024-01-16T20:21:50.000Z",
        "total": "1891.01", "interes": "187.40", "abono_capital": "1703.61",
        "capital_restante": "0.00"
    }], "Detail_Prendas":
        [{
            Descripcion: "Descripcion",
            modelo: "Modelo",
            marca: "Marca",
            serie: "Serie",
            pprenda: 4000.00,
            en_manos_de: "acreedor",
            "Catalogo_Categoria": {
                "id_categoria": 3, "tipo": "Otros", "descripcion": "otros", "plazo_limite": 6, "prioridad": 3, "filterData": null
            }, "Transactional_Valoracion": {
                "id_valoracion": 10, "valoracion_compra_cordobas": "5200.00", "valoracion_compra_dolares": "144.85",
                "valoracion_empeño_cordobas": "4000.00", "valoracion_empeño_dolares": "111.42", "Descripcion": "TEST", "Serie": "TEST", "Marca": "TEST", "Modelo": "TEST", "Catalogo_Categoria": {
                    "id_categoria": 3, "tipo": "Otros", "descripcion": "otros", "plazo_limite": 6, "prioridad": 3, "filterData": null
                }, "Plazo": "6", "Tasa_interes": 234, "Fecha": "2023-05-28", "Tasa_de_cambio": 35.9,
                "Detail_Valores": { "Valoracion_1": "10000", "dolares_1": 278.5515320334262, "Valoracion_2": "10000", "dolares_2": 278.5515320334262, "Valoracion_3": "10000", "dolares_3": 278.5515320334262 }
            }
        }, {
            Descripcion: "Descripcion",
            modelo: "Modelo",
            marca: "Marca",
            serie: "Serie",
            pprenda: 4000.00,
            en_manos_de: "acreedor",
            "Catalogo_Categoria": {
                "id_categoria": 3, "tipo": "Otros", "descripcion": "otros", "plazo_limite": 6, "prioridad": 3, "filterData": null
            }, "Transactional_Valoracion": {
                "id_valoracion": 10, "valoracion_compra_cordobas": "5200.00", "valoracion_compra_dolares": "144.85",
                "valoracion_empeño_cordobas": "4000.00", "valoracion_empeño_dolares": "111.42", "Descripcion": "TEST 2", "Serie": "TEST 2", "Marca": "TEST 2", "Modelo": "TEST", "Catalogo_Categoria": {
                    "id_categoria": 3, "tipo": "Otros", "descripcion": "otros", "plazo_limite": 6, "prioridad": 3, "filterData": null
                },
                "Plazo": "6", "Tasa_interes": 234, "Fecha": "2023-05-28", "Tasa_de_cambio": 35.9,
                "Detail_Valores": { "Valoracion_1": "10000", "dolares_1": 278.5515320334262, "Valoracion_2": "10000", "dolares_2": 278.5515320334262, "Valoracion_3": "10000", "dolares_3": 278.5515320334262 }
            }
        }],
    "Catalogo_Clientes": {
        "codigo_cliente": 3193, "primer_nombre": "WILFREDO",
        "segundo_nombre": "",
        "primer_apellido": "ALEMAN",
        "segundo_apellidio": "PAVON",
        "identificacion": "043-180962-0000J",
        "sexo": "Femenino  ",
        "fecha_nacimiento": "1962-09-18T00:00:00",
        "id_departamento": 6, "id_municipio": 10,
        "id_tipo_identificacion": 1,
        "correo": null, "telefono": "86087647  ", "direccion": "rpt guillermo salazar", "hora": "08:44:43",
        "fecha": "2022-06-15T00:00:00", "observaciones": null, "estado_civil": "Casado (a). ", "tipo_firma": "Ilegible",
        "valor_cliente": "Más prestamos", "operadora_celular": "Claro", /*"valor_interes": 0.02,*/ "solo_acreedor": "No ", "promedio": null,
        "Catalogo_Clasificacion_Cliente": { "id_clasificacion": 2, "Descripcion": "MUY BUENO", "Estado": "ACTIVO", "porcentaje": null, "Catalogo_Clientes": null, "filterData": null },
        "Catalogo_Clasificacion_Interes": { "id_clasificacion_interes": 2, "Descripcion": "RANGO 2", "Estado": "ACTIVO", "porcentaje": 2, "Catalogo_Clientes": null, "filterData": null },
        "Catalogo_Tipo_Identificacion": { "id_tipo_identificacion": 1, "Descripcion": "CÉDULA", "Estado": "ACTIVO", "filterData": null },
        "Catalogo_Profesiones": { "id_profesion": 49, "nombre": "Albañil", "filterData": null }, "Condicion_Laboral_Cliente": null,
        "Catalogo_Municipio": { "id_municipio": 10, "nombre": "San Marcos", "id_departamento": 6, "Catalogo_Departamento": null, "Catalogo_Inversores": null, "filterData": null },
        "Catalogo_Departamento": {
            "id_departamento": 6, "nombre": "Carazo", "id_nacionalidad": 1, "ponderacion": 20, "puntaje": 2, "clasificacion": "MEDIO",
            "Catalogo_Nacionalidad": null, "Catalogo_Municipio": null, "filterData": null
        }, "id_profesion": 49, "tipoc": 1, "id_clasificacion": 2, "id_clasificacion_interes": 2, "Transaction_Contratos": null, "filterData": null
    }
})