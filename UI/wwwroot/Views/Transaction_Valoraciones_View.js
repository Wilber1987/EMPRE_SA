//@ts-check
// @ts-ignore
import { StylesControlsV2, StylesControlsV3, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js";
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js";
import { ComponentsManager, WArrayF, WRender } from "../WDevCore/WModules/WComponentsTools.js";
// @ts-ignore
import { Catalogo_Cambio_Dolar, Catalogo_Categoria, Catalogo_Clientes, Catalogo_Estados_Articulos, Transactional_Valoracion } from "../FrontModel/DBODataBaseModel.js";
import { ModalMessege, WForm } from "../WDevCore/WComponents/WForm.js";
// @ts-ignore
import { Transactional_Configuraciones } from "../FrontModel/ADMINISTRATIVE_ACCESSDataBaseModel.js";
import { Detail_Prendas, ValoracionesContrato } from "../FrontModel/Model.js";
import { CuotaComponent } from "../FrontModel/ModelComponents.js";
import { AmoritizationModule } from "../modules/AmortizacionModule.js";
import { clientSearcher, ValoracionesSearch } from "../modules/SerchersModules.js";
import { WAppNavigator } from "../WDevCore/WComponents/WAppNavigator.js";
import { css } from "../WDevCore/WModules/WStyledRender.js";
class Transaction_Valoraciones_View extends HTMLElement {
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
        const estadosArticulos = await new Catalogo_Estados_Articulos().Get();
        this.Categorias = await new Catalogo_Categoria().Get();
        this.Intereses = await new Transactional_Configuraciones().getTransactional_Configuraciones_Intereses();
        this.Beneficios = await new Transactional_Configuraciones().getTransactional_Configuraciones_Beneficios();
        this.InteresBase = WArrayF.SumValAtt(this.Intereses, "Valor");

        this.buildValoresModel(this.tasasCambio);

        this.multiSelectEstadosArticulos = new WTableComponent({
            Dataset: estadosArticulos,
            ModelObject: new Catalogo_Estados_Articulos({
                porcentaje_compra: { type: 'number', hidden: true },
                porcentaje_empeno: { type: 'number', hidden: true },
                valor_compra_cordobas: {
                    type: "operation", action: (element) => {
                        return this.calculoCordobas(element.porcentaje_compra);
                    }
                }, valor_compra_dolares: {
                    type: "operation", action: (element) => {
                        // @ts-ignore
                        return this.calculoDolares(element.porcentaje_compra, this.tasasCambio[0].valor_de_compra);
                    }
                },
                valor_empeño_cordobas: {
                    type: "operation", action: (element) => {
                        return this.calculoCordobas(element.porcentaje_empeno);
                    }
                }, valor_empeño_dolares: {
                    type: "operation", action: (element) => {
                        // @ts-ignore
                        return this.calculoDolares(element.porcentaje_empeno, this.tasasCambio[0].valor_de_compra);
                    }
                }
            }),
            selectedItems: [estadosArticulos[0]],
            paginate: false,
            Options: {
                Select: true, MultiSelect: false, SelectAction: () => {
                    this.valoracionesForm?.DrawComponent();
                    this.calculoAmortizacion();
                    this.beneficiosDetailUpdate();
                }
            }
        });
        this.multiSelectEstadosArticulos.className = "multiSelectEstadosArticulos";
        this.valoracionModel = this.valoracionesModel(this.tasasCambio,
            this.multiSelectEstadosArticulos);

        this.SetOption();

        this.valoracionesForm = new WForm({
            ModelObject: this.valoracionModel,
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

        this.valoracionesTable = new WTableComponent({
            Dataset: this.valoracionesDataset,
            ModelObject: new Transactional_Valoracion({}),
            paginate: true,
            AutoSave: false,
            id: "valoracionesTable",
            AddItemsFromApi: false,
            Options: {
                //Select: true,
                Delete: true,
                DeleteAction: () => this.calculoAmortizacion(),
            }
        });

        this.CuotasTable = new WTableComponent({
            Dataset: [],
            ModelObject: new CuotaComponent(),
            paginate: false,
            AddItemsFromApi: false,
            AutoSave: false,
            id: "cuotasTable",
            Options: {

            }
        });

        this.BeneficioDetail = WRender.Create({ className: "beneficios-detail" });
        this.beneficiosDetailUpdate();

        this.valoresForm = new WForm({
            EditObject: this.valoresObject,
            ModelObject: this.valoresModel,
            Options: false,
            DivColumns: "calc(100% - 160px) 150px",
            // @ts-ignore
            ProxyAction: (/**@type {WForm} */ valoracion) => {
                this.valoracionesForm?.SetOperationValues();
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

        this.TabContainerTables = WRender.Create({ className: "TabContainerTables", id: 'TabContainerTables' });
        this.ManagerTables = new ComponentsManager({ MainContainer: this.TabContainerTables });
        this.TableNavigator = new WAppNavigator({
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
        })

        this.valoracionesContainer.append(
            this.selectedClientDetail,
            this.valoracionesForm,
            this.BeneficioDetail,
            this.valoresForm,
            this.multiSelectEstadosArticulos,
            WRender.Create({ className: "nav-header", children: [this.TableNavigator, this.amortizacionResumen] }),
            this.TabContainerTables
        );
        if (!this.clientSercher) {
            this.clientSercher = clientSearcher(this.selectCliente);
        }
        this.Manager.NavigateFunction("buscar-cliente", this.clientSercher);
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
            Valoracion_1: {
                type: "number", label: "Valoración 1 - C$:", action: () => {
                    this.valoresObject.dolares_1 = this.valoresObject.Valoracion_1 / tasasCambio[0].valor_de_compra;
                    /** @type {HTMLInputElement|undefined|null} */
                    const control = this.valoresForm?.shadowRoot?.querySelector(".dolares_1");
                    if (control != undefined || control != null) {
                        control.value = this.valoresObject.dolares_1.toString();
                    }
                    this.multiSelectEstadosArticulos?.SetOperationValues()
                    this.beneficiosDetailUpdate();
                }
            },
            dolares_1: {
                type: "number", label: "$:", action: () => {
                    this.valoresObject.Valoracion_1 = this.valoresObject.dolares_1 * tasasCambio[0].valor_de_compra;
                    /** @type {HTMLInputElement|undefined|null} */
                    const control = this.valoresForm?.shadowRoot?.querySelector(".Valoracion_1");
                    if (control != undefined || control != null) {
                        control.value = this.valoresObject.Valoracion_1.toString();
                    }
                    this.multiSelectEstadosArticulos?.SetOperationValues()
                    this.beneficiosDetailUpdate();
                }
            },
            Valoracion_2: {
                type: "number", label: "Valoración 2 - C$:", action: () => {
                    this.valoresObject.dolares_2 = this.valoresObject.Valoracion_2 / tasasCambio[0].valor_de_compra;
                    /** @type {HTMLInputElement|undefined|null} */
                    const control = this.valoresForm?.shadowRoot?.querySelector(".dolares_2");
                    if (control != undefined || control != null) {
                        control.value = this.valoresObject.dolares_2.toString();
                    }
                    this.multiSelectEstadosArticulos?.SetOperationValues()
                    this.beneficiosDetailUpdate();
                }
            },
            dolares_2: {
                type: "number", label: "$:", action: () => {
                    this.valoresObject.Valoracion_2 = this.valoresObject.dolares_2 * tasasCambio[0].valor_de_compra;
                    /** @type {HTMLInputElement|undefined|null} */
                    const control = this.valoresForm?.shadowRoot?.querySelector(".Valoracion_2");
                    if (control != undefined || control != null) {
                        control.value = this.valoresObject.Valoracion_2.toString();
                    }
                    this.multiSelectEstadosArticulos?.SetOperationValues()
                    this.beneficiosDetailUpdate();
                }
            },
            Valoracion_3: {
                type: "number", label: "Valoración 3 - C$:", action: () => {
                    this.valoresObject.dolares_3 = this.valoresObject.Valoracion_3 / tasasCambio[0].valor_de_compra;
                    /** @type {HTMLInputElement|undefined|null} */
                    const control = this.valoresForm?.shadowRoot?.querySelector(".dolares_3");
                    if (control != undefined || control != null) {
                        control.value = this.valoresObject.dolares_3.toString();
                    }
                    this.multiSelectEstadosArticulos?.SetOperationValues()
                    this.beneficiosDetailUpdate();
                }
            },
            dolares_3: {
                type: "number", label: "$:", action: () => {
                    this.valoresObject.Valoracion_3 = this.valoresObject.dolares_3 * tasasCambio[0].valor_de_compra;
                    /** @type {HTMLInputElement|undefined|null} */
                    const control = this.valoresForm?.shadowRoot?.querySelector(".Valoracion_3");
                    if (control != undefined || control != null) {
                        control.value = this.valoresObject.Valoracion_3.toString();
                    }
                    this.multiSelectEstadosArticulos?.SetOperationValues()
                    this.beneficiosDetailUpdate();
                }
            }, total_cordobas: {
                type: "operation", label: "Total - C$", disabled: true, action: (data) => {
                    return ((parseFloat(data.Valoracion_1) + parseFloat(data.Valoracion_2) + parseFloat(data.Valoracion_3)) / 3).toFixed(2)
                }
            }, total_dolares: {
                type: "operation", label: "$:", disabled: true, action: (data) => {
                    return ((parseFloat(data.dolares_1) + parseFloat(data.dolares_2) + parseFloat(data.dolares_3)) / 3).toFixed(2)
                }
            }
        };
    }
    valoracionesModel(tasasCambio, multiSelectEstadosArticulos) {
        return new Transactional_Valoracion({
            Fecha: { type: 'date', disabled: true },
            Tasa_de_cambio: { type: 'number', disabled: true, defaultValue: tasasCambio[0].valor_de_compra },
            // @ts-ignore
            Tasa_interes: { type: 'number', disabled: true, defaultValue: this.InteresBase + 6 },
            Plazo: {
                // @ts-ignore
                type: "number", action: () => this.calculoAmortizacion(), min: 1, max: this.Categorias[0].plazo_limite, defaultValue: 1
            }, Catalogo_Estados_Articulos: { type: 'WSELECT', hidden: true },
            valoracion_compra_cordobas: {
                // @ts-ignore
                type: 'operation', action: (/**@type {Transactional_Valoracion} */ valoracion) => {
                    return this.calculoCordobas(multiSelectEstadosArticulos.selectedItems[0].porcentaje_compra);
                }, hidden: true
            }, valoracion_empeño_cordobas: {
                // @ts-ignore
                type: 'operation', action: (/**@type {Transactional_Valoracion} */ valoracion) => {
                    return this.calculoCordobas(multiSelectEstadosArticulos.selectedItems[0].porcentaje_empeno);
                }, hidden: true
            }, valoracion_compra_dolares: {
                // @ts-ignore
                type: 'operation', action: (/**@type {Transactional_Valoracion} */ valoracion) => {
                    return this.calculoDolares(multiSelectEstadosArticulos.selectedItems[0].porcentaje_compra, tasasCambio[0].valor_de_compra);
                }, hidden: true
            }, valoracion_empeño_dolares: {
                // @ts-ignore
                type: 'operation', action: (/**@type {Transactional_Valoracion} */ valoracion) => {
                    return this.calculoDolares(multiSelectEstadosArticulos.selectedItems[0].porcentaje_empeno, tasasCambio[0].valor_de_compra);
                }, hidden: true
            },
        });
    }
    calculoCordobas = (porcentaje) => {
        return AmoritizationModule.round(this.avgValores() * (porcentaje / 100)).toFixed(2);
    }
    calculoDolares = (porcentaje, tasa_cambio) => {
        return AmoritizationModule.round((this.avgValores() * (porcentaje / 100)) / tasa_cambio).toFixed(2);
    }
    avgValores() {
        return AmoritizationModule.round((parseFloat(this.valoresObject.Valoracion_1.toString()) +
            parseFloat(this.valoresObject.Valoracion_2.toString()) +
            parseFloat(this.valoresObject.Valoracion_3.toString())) / 3);
    }
    SetOption() {
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Secundary', innerText: 'Buscar cliente',
            onclick: () => {
                this.Manager.NavigateFunction("buscar-cliente", this.clientSercher)
            }
        }))
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Primary', innerText: 'Valoración',
            onclick: () => this.Manager.NavigateFunction("valoraciones", this.valoracionesContainer)
        }))

        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Tertiary', innerText: 'Buscar valoraciones',
            onclick: () => this.Manager.NavigateFunction("Searcher", new ValoracionesSearch(this.selectValoracion))
        }))
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Fourth', innerText: 'Añadir',
            onclick: () => {
                if (!this.valoracionesForm?.Validate()) {
                    return;
                }
                if (this.valoresObject.Valoracion_1 <= 0 ||
                    this.valoresObject.Valoracion_3 <= 0 ||
                    this.valoresObject.Valoracion_3 <= 0) {
                    this.append(ModalMessege("Llene el formulario de valoraciones con montos mayores a 0"))
                    return;
                }
                const existVehiculo = this.valoracionesTable?.Dataset.find(p => p.Catalogo_Categoria.id_categoria == 2);
                if (existVehiculo != undefined && this.valoracionesForm?.FormObject.Catalogo_Categoria.id_categoria != 2) {
                    this.append(ModalMessege("Anteriormente valoro un vehículo por lo tanto no puede agregar valoraciones de diferente categoría"));
                    return;
                }

                const notExistVehiculo = this.valoracionesTable?.Dataset.find(p => p.Catalogo_Categoria.id_categoria != 2);
                if (notExistVehiculo != undefined && this.valoracionesForm?.FormObject.Catalogo_Categoria.id_categoria == 2) {
                    this.append(ModalMessege("Anteriormente valoro un artículo distinto de vehículo por lo tanto no puede agregar valoraciones de esta categoría"));
                    return;
                }


                const newValoracion = {};
                for (const prop in this.valoracionesForm?.FormObject) {
                    newValoracion[prop] = this.valoracionesForm?.FormObject[prop];
                }
                const newValores = {};
                for (const prop in this.valoresObject) {
                    newValores[prop] = this.valoresObject[prop];
                }
                newValoracion.Detail_Valores = newValores;
                // @ts-ignore
                const serch = this.valoracionesTable?.Dataset.find(f => WArrayF.compareObj(f, newValoracion));
                this.valoracionesTable?.Dataset.push(newValoracion);
                this.valoracionesTable?.DrawTable();
                this.calculoAmortizacion();
            }
        }))
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Fifth', innerText: 'Guardar valoraciones',
            onclick: async () => {
                if (this.valoracionesTable?.Dataset.length == 0) {
                    this.append(ModalMessege("Agregue valoraciones para poder continuar"));
                    return;
                }
                const valoracionesGuardadas = await this.valoracionModel?.GuardarValoraciones(this.valoracionesTable?.Dataset);
                if (valoracionesGuardadas?.length > 0) {
                    this.append(ModalMessege("Valoraciones guardadas correctamente"));
                }
            }
        }))
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Success', innerText: 'Generar Contrato',
            onclick: async () => {
                if (this.valoracionesTable?.Dataset.length == 0) {
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
    selectCliente = (/**@type {Catalogo_Clientes} */ selectCliente) => {
        this.Cliente = selectCliente;
        if (this.valoracionesForm != undefined) {
            this.valoracionesForm.FormObject.Tasa_interes = this.getTasaInteres();
            this.valoracionesForm.DrawComponent();
        }
        this.calculoAmortizacion();
        this.selectedClientDetail.innerText = `
            Cliente seleccionado: ${selectCliente.primer_nombre} ${selectCliente.segundo_nombre ?? ''} ${selectCliente.primer_apellido} ${selectCliente.segundo_apellidio ?? ''}
        `;
        this.Manager.NavigateFunction("valoraciones", this.valoracionesContainer);
        this.beneficiosDetailUpdate();
    }
    getTasaInteres = () => {
        if (this.Cliente.Catalogo_Clasificacion_Interes) {
            return parseFloat(this.Cliente.Catalogo_Clasificacion_Interes.porcentaje)
                // @ts-ignore
                + this.InteresBase;
        } else {
            // @ts-ignore
            return 6 + this.InteresBase;
        }
    }
    selectValoracion = (valoracion) => {
        if (this.valoracionesForm != undefined) {
            for (const prop in this.valoracionesForm?.FormObject) {
                if (prop == "Detail_Valores") continue;
                if (prop == "Tasa_interes") continue;
                this.valoracionesForm.FormObject[prop] = valoracion[prop]
            }
            this.valoracionesForm.DrawComponent();
            if (this.valoresForm != undefined) {
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
            }
        }
        this.beneficiosDetailUpdate();
        this.Manager.NavigateFunction("valoraciones", this.valoracionesContainer);
    }
    beneficiosDetailUpdate() {
        // @ts-ignore
        this.BeneficioDetail.innerHTML = "";
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
        this.BeneficioDetail?.append(WRender.CreateStringNode(`<div>
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
    /**
     * 
     * @returns {ValoracionesContrato}
     */
    calculoAmortizacion = () => {
        if (this.valoracionesTable?.Dataset.length == 0) {
            this.amortizacionResumen.innerText = this.valoracionResumen(0, 0, 0, 0);
            return new ValoracionesContrato();
        }
        // const total = this.valoracionesTable?.Dataset.reduce((sum, value) => (typeof value.Edad == "number" ? sum + value.Edad : sum), 0);
        const contrato = new ValoracionesContrato({
            // @ts-ignore
            valoracion_compra_cordobas: AmoritizationModule.round(WArrayF.SumValAtt(this.valoracionesTable?.Dataset, "valoracion_compra_cordobas")),
            // @ts-ignore
            valoracion_compra_dolares: AmoritizationModule.round(WArrayF.SumValAtt(this.valoracionesTable?.Dataset, "valoracion_compra_dolares")),
            // @ts-ignore
            valoracion_empeño_cordobas: AmoritizationModule.round(WArrayF.SumValAtt(this.valoracionesTable?.Dataset, "valoracion_empeño_cordobas")),
            // @ts-ignore
            valoracion_empeño_dolares: AmoritizationModule.round(WArrayF.SumValAtt(this.valoracionesTable?.Dataset, "valoracion_empeño_dolares")),
            tasas_interes: this.getTasaInteres() / 100,
            plazo: this.valoracionesForm?.FormObject.Plazo ?? 1,
            fecha: new Date(),
            Transaction_Facturas: new Array(),
            // @ts-ignore
            taza_cambio: this.tasasCambio[0].valor_de_compra,
            taza_interes_cargos: this.InteresBase,
            gestion_crediticia: this.Cliente.Catalogo_Clasificacion_Interes?.porcentaje ?? 6,
            Detail_Prendas: this.valoracionesTable?.Dataset.map(
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
            })),
            Catalogo_Clientes: this.Cliente,
            valoraciones: this.valoracionesTable?.Dataset
        })
        // const cuotaFija = AmoritizationModule.getPago(contrato);
        // contrato.cuotafija = cuotaFija;
        // contrato.cuotafija_dolares = contrato.cuotafija / contrato.taza_cambio;
        // let capital = contrato.valoracion_empeño_dolares;
        // for (let index = 0; index < contrato.plazo; index++) {
        //     const abono_capital = contrato.cuotafija_dolares - (capital * contrato.tasas_interes);
        //     const cuota = new Cuota({
        //         // @ts-ignore
        //         fecha: contrato.fecha.modifyMonth(index + 1),
        //         // @ts-ignore
        //         total: contrato.cuotafija_dolares,
        //         // @ts-ignore
        //         interes: (capital * contrato.tasas_interes),
        //         // @ts-ignoreº
        //         abono_capital: abono_capital,
        //         // @ts-ignore
        //         capital_restante: (capital - abono_capital)
        //     })
        //     capital = capital - abono_capital;
        //     contrato.Transaction_Facturas.push(cuota)
        // }
        AmoritizationModule.crearCuotas(contrato);
        //console.log(contrato);
        if (this.CuotasTable != undefined) {
            this.CuotasTable.Dataset = contrato.Transaction_Facturas;
            this.CuotasTable?.Draw();
        }
        this.amortizacionResumen.innerText = this.valoracionResumen(
            contrato.valoracion_compra_cordobas,
            contrato.valoracion_compra_dolares,
            contrato.valoracion_empeño_cordobas,
            contrato.valoracion_empeño_dolares);
        return contrato;
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
        .beneficios-detail h4 {
            margin: 0px 10px 10px 10px;
        }
        .beneficios-detail {
            padding: 15px;
            border-radius: 10px;
            border: solid 1px #999;
            overflow: hidden;
            max-height:15px;
            transition: all 0.7s;
            cursor: pointer;
        }
        .beneficios-detail:hover {
            max-height:1500px;
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
customElements.define('w-valoraciones-view', Transaction_Valoraciones_View);
export { Transaction_Valoraciones_View };
// @ts-ignore
window.addEventListener('load', async () => { MainBody.append(new Transaction_Valoraciones_View()) })

