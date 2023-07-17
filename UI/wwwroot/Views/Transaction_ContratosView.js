//@ts-check
// @ts-ignore
import { WRender, ComponentsManager, WAjaxTools, html } from "../WDevCore/WModules/WComponentsTools.js";
import { StylesControlsV2, StylesControlsV3, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
// @ts-ignore
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { Catalogo_Clientes, Detail_PrendasModel, Transaction_ContratosModel } from "../FrontModel/DBODataBaseModel.js"
// @ts-ignore
import { WFilterOptions } from "../WDevCore/WComponents/WFilterControls.js";
import { Detail_Prendas, Transaction_Contratos, ValoracionesContrato } from "../FrontModel/Model.js";
import { css } from "../WDevCore/WModules/WStyledRender.js";
import { ValoracionesSearch, clientSearcher } from "../modules/SerchersModules.js";
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
        //models
        this.entity = testData //props?.Entity ?? new ValoracionesContrato();
        this.componentsModel = new Transaction_ContratosModel();
        this.OptionContainer = WRender.Create({ className: "OptionContainer" });
        this.TabContainer = WRender.Create({ className: "TabContainer", id: 'TabContainer' });
        this.Manager = new ComponentsManager({ MainContainer: this.TabContainer, SPAManage: false });
        this.valoracionesContainer = WRender.Create({ className: "valoraciones-container" });
        this.append(this.CustomStyle);
        this.Cliente = {}
        this.valoracionesDataset = [];
        this.selectedClientDetail = WRender.Create({ tagName: "label", className: "selected-client" });
        this.selectCliente(this.entity.Catalogo_Clientes)
        this.amortizacionResumen = WRender.Create({ tagName: "label", innerText: this.valoracionResumen(this.entity) });
        this.contratosForm = WRender.Create({ className: "contratos-form", children: [this.selectedClientDetail, this.amortizacionResumen] });




        this.SetOption();
        this.append(
            StylesControlsV2.cloneNode(true),
            StyleScrolls.cloneNode(true),
            StylesControlsV3.cloneNode(true),
            this.OptionContainer,
            this.TabContainer
        );
        this.Draw();
    }
    /**
     * 
     * @param {ValoracionesContrato} entity 
     * @returns 
     */
    valoracionResumen(entity) {
        // @ts-ignore
        return `Compra C$: ${entity.valoracion_compra_cordobas?.toFixed(2)} - Compra $: ${entity.valoracion_compra_dolares?.toFixed(2)}
         Empeño C$: ${entity.valoracion_empeño_cordobas?.toFixed(2)} - Empeño $: ${entity.valoracion_empeño_dolares?.toFixed(2)}`;

    }
    Draw = async () => {
        //const dataset = await this.model.Get();
        console.log(this.entity.Detail_Prendas);
        this.prendasTable = new WTableComponent({
            Dataset: this.entity.Detail_Prendas,
            ModelObject: new Detail_PrendasModel({})
        })
        this.contratosForm.append(this.prendasTable);
        this.Manager.NavigateFunction("valoraciones", this.contratosForm)

    }
    SetOption() {
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Primary', innerText: 'Nueva valoración',
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
                //this.append(ModalMessege("Valoraciones guardadas correctamente"));
            }
        }))
    }
    selectCliente = (/**@type {Catalogo_Clientes} */ selectCliente) => {
        this.Cliente = selectCliente;
        this.selectedClientDetail = WRender.CreateStringNode(`<div class="detail-cliente">
            <label class="name"> Cliente seleccionado: ${selectCliente.primer_nombre} ${selectCliente.segundo_nombre ?? ''} 
            ${selectCliente.primer_apellido} ${selectCliente.segundo_apellidio ?? ''}</label>
            <label>Tipo de indentificación: ${selectCliente.Catalogo_Tipo_Identificacion.Descripcion}</label>
            <label>Número de documento: ${selectCliente.identificacion}</label>
            <label>Teléfono: ${selectCliente.telefono}</label>
        </div>`);
        //this.Manager.NavigateFunction("valoraciones");
    }
    // @ts-ignore
    selectValoracion = (valoracion) => {
        this.Manager.NavigateFunction("valoraciones");
    }
    CustomStyle = css`
        .valoraciones-container{
            padding: 20px;
            display: grid;
            grid-template-columns: 400px calc(100% - 430px);
            gap: 20px 30px;
        }
        #valoracionesForm, 
        #valoracionesTable,
        #cuotasTable,
        .TabContainerTables,
        .nav-header,
        .selected-client{
            grid-column: span 2;
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
customElements.define('w-transaction_contratos', Transaction_ContratosView);
// @ts-ignore
window.addEventListener('load', async () => { MainBody.append(new Transaction_ContratosView({})) })
/**@type {ValoracionesContrato} */
const testData = new ValoracionesContrato({
    "valoracion_compra_cordobas": 10400,
    "valoracion_compra_dolares": 289.7,
    "valoracion_empeño_cordobas": 8000,
    "valoracion_empeño_dolares": 222.84,
    "tasas_interes": 0.11, "plazo": "6",
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
            "valor_cliente": "MP", "operadora_celular": "Claro", "valor_interes": 0.02, "solo_acreedor": "No ", "promedio": null,
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