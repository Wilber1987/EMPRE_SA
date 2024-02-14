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
import { Detail_Prendas, Transaction_Contratos, ValoracionesTransaction } from "../FrontModel/Model.js";
import { Tbl_Cuotas_ModelComponent } from "../FrontModel/ModelComponents.js";
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
        /**
         * @type {Catalogo_Clientes}
         */
        // @ts-ignore
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
        /** @type {Array<Catalogo_Cambio_Dolar>} */
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
                        return this.calculoDolares(element.porcentaje_compra);
                    }
                },
                valor_empeño_cordobas: {
                    type: "operation", action: (element) => {
                        return this.calculoCordobas(element.porcentaje_empeno);
                    }
                }, valor_empeño_dolares: {
                    type: "operation", action: (element) => {
                        // @ts-ignore
                        return this.calculoDolares(element.porcentaje_empeno);
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
            ModelObject: new Tbl_Cuotas_ModelComponent(),
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
                    this.valoresObject.dolares_1 = this.valoresObject.Valoracion_1 / tasasCambio[0].valor_de_venta;
                    /** @type {HTMLInputElement|undefined|null} */
                    const control = this.valoresForm?.shadowRoot?.querySelector(".dolares_1");
                    if (control != undefined || control != null) {
                        control.value = this.valoresObject.dolares_1.toString();
                    }
                    this.promediarValoresDolares(this.valoresObject);
                    this.promediarValoresCordobas(this.valoresObject);
                    this.beneficiosDetailUpdate();
                    this.multiSelectEstadosArticulos?.SetOperationValues()
                }
            },
            dolares_1: {
                type: "number", label: "$:", action: () => {
                    this.valoresObject.Valoracion_1 = this.valoresObject.dolares_1 * tasasCambio[0].valor_de_venta;
                    /** @type {HTMLInputElement|undefined|null} */
                    const control = this.valoresForm?.shadowRoot?.querySelector(".Valoracion_1");
                    if (control != undefined || control != null) {
                        control.value = this.valoresObject.Valoracion_1.toString();
                    }
                    this.promediarValoresDolares(this.valoresObject);
                    this.promediarValoresCordobas(this.valoresObject);
                    this.beneficiosDetailUpdate();
                    this.multiSelectEstadosArticulos?.SetOperationValues()
                }
            },
            Valoracion_2: {
                type: "number", label: "Valoración 2 - C$:", action: () => {
                    this.valoresObject.dolares_2 = this.valoresObject.Valoracion_2 / tasasCambio[0].valor_de_venta;
                    /** @type {HTMLInputElement|undefined|null} */
                    const control = this.valoresForm?.shadowRoot?.querySelector(".dolares_2");
                    if (control != undefined || control != null) {
                        control.value = this.valoresObject.dolares_2.toString();
                    }
                    this.promediarValoresDolares(this.valoresObject);
                    this.promediarValoresCordobas(this.valoresObject);
                    this.beneficiosDetailUpdate();
                    this.multiSelectEstadosArticulos?.SetOperationValues()
                }
            },
            dolares_2: {
                type: "number", label: "$:", action: () => {
                    this.valoresObject.Valoracion_2 = this.valoresObject.dolares_2 * tasasCambio[0].valor_de_venta;
                    /** @type {HTMLInputElement|undefined|null} */
                    const control = this.valoresForm?.shadowRoot?.querySelector(".Valoracion_2");
                    if (control != undefined || control != null) {
                        control.value = this.valoresObject.Valoracion_2.toString();
                    }
                    this.promediarValoresDolares(this.valoresObject);
                    this.promediarValoresCordobas(this.valoresObject);
                    this.beneficiosDetailUpdate();
                    this.multiSelectEstadosArticulos?.SetOperationValues()
                }
            },
            Valoracion_3: {
                type: "number", label: "Valoración 3 - C$:", action: () => {
                    this.valoresObject.dolares_3 = this.valoresObject.Valoracion_3 / tasasCambio[0].valor_de_venta;
                    /** @type {HTMLInputElement|undefined|null} */
                    const control = this.valoresForm?.shadowRoot?.querySelector(".dolares_3");
                    if (control != undefined || control != null) {
                        control.value = this.valoresObject.dolares_3.toString();
                    }
                    this.promediarValoresDolares(this.valoresObject);
                    this.promediarValoresCordobas(this.valoresObject);
                    this.beneficiosDetailUpdate();
                    this.multiSelectEstadosArticulos?.SetOperationValues()
                }
            },
            dolares_3: {
                type: "number", label: "$:", action: () => {
                    this.valoresObject.Valoracion_3 = this.valoresObject.dolares_3 * tasasCambio[0].valor_de_venta;
                    /** @type {HTMLInputElement|undefined|null} */
                    const control = this.valoresForm?.shadowRoot?.querySelector(".Valoracion_3");
                    if (control != undefined || control != null) {
                        control.value = this.valoresObject.Valoracion_3.toString();
                    }
                    this.promediarValoresDolares(this.valoresObject);
                    this.promediarValoresCordobas(this.valoresObject);
                    this.beneficiosDetailUpdate();
                    this.multiSelectEstadosArticulos?.SetOperationValues()
                }
            }, total_cordobas: {
                type: "text", label: "Total - C$", disabled: true, action: (data) => {
                    //return this.promediarValoresCordobas(data)
                }
            }, total_dolares: {
                type: "text", label: "$:", disabled: true, action: (data) => {
                    //return this.promediarValoresDolares(data)
                }
            }
        };
    }
    promediarValoresDolares(data) {
        console.log(data);
        data.total_dolares = ((parseFloat(data.dolares_1) + parseFloat(data.dolares_2) + parseFloat(data.dolares_3)) / 3).toFixed(3);
        const control = this.valoresForm?.shadowRoot?.querySelector(".total_dolares");
        if (control != undefined || control != null) {
            // @ts-ignore
            control.value = data.total_dolares.toString();
        }
        return data.total_dolares;
    }

    promediarValoresCordobas(data) {
        data.total_cordobas = ((parseFloat(data.Valoracion_1) + parseFloat(data.Valoracion_2) + parseFloat(data.Valoracion_3)) / 3).toFixed(3);
        const control = this.valoresForm?.shadowRoot?.querySelector(".total_cordobas");
        if (control != undefined || control != null) {
            // @ts-ignore
            control.value = data.total_cordobas.toString();
        }
        return data.total_cordobas;
    }

    valoracionesModel(tasasCambio, multiSelectEstadosArticulos) {
        return new Transactional_Valoracion({
            Fecha: { type: 'date', disabled: true },
            Tasa_de_cambio: { type: 'number', disabled: true, defaultValue: tasasCambio[0].valor_de_venta },
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
                    return this.calculoDolares(multiSelectEstadosArticulos.selectedItems[0].porcentaje_compra);
                }, hidden: true
            }, valoracion_empeño_dolares: {
                // @ts-ignore
                type: 'operation', action: (/**@type {Transactional_Valoracion} */ valoracion) => {
                    return this.calculoDolares(multiSelectEstadosArticulos.selectedItems[0].porcentaje_empeno);
                }, hidden: true
            },
        });
    }
    /** @return {Number} */ 
    calculoCordobas = (porcentaje) => {
        // @ts-ignore
        /**@type {Number} */ const tasa_cambio = this.tasasCambio[0]?.valor_de_compra;
         // @ts-ignore
        return (this.calculoDolares(porcentaje) * tasa_cambio).toFixed(3);
    }
    /** @return {Number} */ 
    calculoDolares = (porcentaje) => {
        // @ts-ignore
        return Math.round((this.avgValores().toFixed(0) * (porcentaje / 100))).toFixed(3);
    }
    avgValores() {
        return ((parseFloat(this.valoresObject.dolares_1.toString()) +
            parseFloat(this.valoresObject.dolares_2.toString()) +
            parseFloat(this.valoresObject.dolares_3.toString())) / 3);
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
            onclick: () => this.Manager.NavigateFunction("Searcher", new ValoracionesSearch(this.selectValoracion,this.facturartValoracion))
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
                this.resetValoresForm();
                for (const prop in this.valoracionesForm?.FormObject) {
                    if (prop == "Detail_Valores") continue;
                    if (prop == "Tasa_interes") continue;
                    if (prop == "Plazo") continue;
                    this.valoracionesForm.FormObject[prop] = undefined;
                }
                this.valoracionesForm.DrawComponent();
            }
        }))
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Fifth', innerText: 'Guardar valoraciones',
            onclick: async () => {
                if (this.valoracionesTable?.Dataset.length == 0) {
                    this.append(ModalMessege("Agregue valoraciones para poder continuar"));
                    return;
                }
                this.valoracionesTable?.Dataset.forEach(element => {
                    element.id_valoracion = null;
                    element.Fecha = new Date();
                });
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
        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Success', innerText: 'Facturar',
            onclick: async () => {
                if (this.valoracionesTable?.Dataset.length == 0) {
                    this.append(ModalMessege("Agregue valoraciones para poder continuar"));
                    return;
                }                                
                const response = await this.calculoAmortizacion().SaveDataContract();
                if (response) {
                    // @ts-ignore
                    window.location = "/PagesViews/Transaction_ContratosView";
                }
            }
        }))
    }
    selectCliente = (/**@type {Catalogo_Clientes} */ selectCliente) => {
        console.log(selectCliente);
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
    selectValoracion = (/**@type {Transactional_Valoracion}*/valoracion) => {
        if (valoracion.id_valoracion != undefined || valoracion.id_valoracion != null) {
            const valoracionAgregada = this.valoracionesTable?.Dataset.find(d => d.id_valoracion == valoracion.id_valoracion);
            if (valoracionAgregada != null) {
                this.append(ModalMessege("Valoración ya esta agregada"));
                return;
            }
        }
        // @ts-ignore
        valoracion.Tasa_de_cambio = this.tasasCambio[0]?.valor_de_venta
        if (this.valoracionesForm != undefined) {
            for (const prop in this.valoracionesForm?.FormObject) {
                if (prop == "Detail_Valores") continue;
                if (prop == "Tasa_interes") continue;
                this.valoracionesForm.FormObject[prop] = valoracion[prop]
            }
            this.valoracionesForm.Config.ModelObject?.Catalogo_Categoria?.action(this.valoracionesForm.FormObject, this.valoracionesForm);
            if (this.valoresForm != undefined) {
                // @ts-ignore
                if (new Date().subtractDays(40) < new Date(valoracion.Fecha)) {
                    this.valoresObject.Valoracion_1 = valoracion.Detail_Valores?.Valoracion_1 ?? 0;
                    this.valoresObject.dolares_1 = valoracion.Detail_Valores?.dolares_1 ?? 0;
                    this.valoresObject.Valoracion_2 = valoracion.Detail_Valores?.Valoracion_2 ?? 0;
                    this.valoresObject.dolares_2 = valoracion.Detail_Valores?.dolares_2 ?? 0;
                    this.valoresObject.Valoracion_3 = valoracion.Detail_Valores?.Valoracion_3 ?? 0;
                    this.valoresObject.dolares_3 = valoracion.Detail_Valores?.dolares_3 ?? 0;
                    this.promediarValoresDolares(this.valoresObject);
                    this.promediarValoresCordobas(this.valoresObject);
                    this.valoresForm.DrawComponent();
                } else {
                    this.resetValoresForm();
                }
            }
        }
        this.beneficiosDetailUpdate();

        this.Manager.NavigateFunction("valoraciones", this.valoracionesContainer);
    }
    resetValoresForm() {
        this.valoresObject.Valoracion_1 = 0;
        this.valoresObject.dolares_1 = 0;
        this.valoresObject.Valoracion_2 = 0;
        this.valoresObject.dolares_2 = 0;
        this.valoresObject.Valoracion_3 = 0;
        this.valoresObject.dolares_3 = 0;
        this.valoresForm?.DrawComponent();
    }

    facturartValoracion = (/**@type {Transactional_Valoracion}*/valoracion) =>{
        console.log(valoracion);
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
        this.valoracionesForm.FormObject.precio_venta_empeño_dolares = (precio_venta_empeño / this.tasasCambio[0].valor_de_venta)
        // @ts-ignore
        //const moraDolares =  mora / this.tasasCambio[0].valor_de_venta;    
        this.BeneficioDetail?.append(WRender.CreateStringNode(`<div>
            <h4>BENEFICIOS:</h4>
            <div class="column-venta">
                <label>VENTA DE COMPRA</label>
                <span>C$ ${((detail.valoracion_compra_cordobas) * (beneficioVentaC.Valor / 100 + 1)).toFixed(3)}</span>
                <span>$ ${((detail.valoracion_compra_dolares) * (beneficioVentaC.Valor / 100 + 1)).toFixed(3)}</span>
            </div> 
            <div class="column-venta">
                <label>VENTA DE EMPEÑO</label>
                <span>C$ ${precio_venta_empeño.toString() == "NaN" ? "0.00"
                : precio_venta_empeño.toFixed(3)}</span>
                <span>$ ${precio_venta_empeño.toString() == "NaN" ? "0.00"
                : (precio_venta_empeño /
                    // @ts-ignore
                    this.tasasCambio[0].valor_de_venta).toFixed(3)}</span>
            </div> 
        </div>`));
        this.multiSelectEstadosArticulos?.SetOperationValues();
        this.multiSelectEstadosArticulos?.DrawTable();
    }
    /**
     * 
     * @returns {ValoracionesTransaction}
     */
    calculoAmortizacion = () => {
        if (this.valoracionesTable?.Dataset.length == 0) {
            this.amortizacionResumen.innerText = this.valoracionResumen(0, 0, 0, 0);
            return new ValoracionesTransaction();
        }
        const total = this.valoracionesTable?.Dataset.reduce((sum, value) => (typeof value.Edad == "number" ? sum + value.Edad : sum), 0);
        const contrato = new ValoracionesTransaction();
        // @ts-ignore
        contrato.valoraciones = this.valoracionesTable?.Dataset;
        contrato.Transaction_Contratos = new Transaction_Contratos({
            tasas_interes: this.getTasaInteres() / 100,
            fecha: new Date(),
            plazo: this.valoracionesForm?.FormObject.Plazo ?? 1,
            // @ts-ignore
            taza_cambio: this.tasasCambio[0].valor_de_venta,
            // @ts-ignore
            taza_cambio_compra: this.tasasCambio[0].valor_de_compra,
            taza_interes_cargos: this.InteresBase,
            Catalogo_Clientes: this.Cliente.codigo_cliente != undefined ? this.Cliente : this.GenerateClient(),
            gestion_crediticia: this.Cliente.Catalogo_Clasificacion_Interes?.porcentaje ?? 6,
        });
        AmoritizationModule.calculoAmortizacion(contrato);
        //console.log(AmoritizationModule.calculoAmortizacion(contrato));

        if (this.CuotasTable != undefined) {
            this.CuotasTable.Dataset = contrato.Transaction_Contratos.Tbl_Cuotas;
            this.CuotasTable?.Draw();
        }
        this.amortizacionResumen.innerText = this.valoracionResumen(
            contrato.Transaction_Contratos.valoracion_compra_cordobas,
            contrato.Transaction_Contratos.valoracion_compra_dolares,
            contrato.Transaction_Contratos.valoracion_empeño_cordobas,
            contrato.Transaction_Contratos.valoracion_empeño_dolares);
        return contrato;
    }
    GenerateClient() {
        return {
            "Catalogo_Clasificacion_Interes": {
                "id_clasificacion_interes": 6,
                "Descripcion": "RANGO 6",
                "Estado": "ACTIVO",
                "porcentaje": 6,
                "Catalogo_Clientes": null,
                "filterData": null
            },
            "Catalogo_Clasificacion_Cliente": {
                "id_clasificacion": 6,
                "Descripcion": "NO DEFINIDO",
                "Estado": "ACTIVO",
                "porcentaje": null,
                "Catalogo_Clientes": null,
                "filterData": null
            }
        }
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

