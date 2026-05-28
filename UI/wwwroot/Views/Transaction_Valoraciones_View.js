//@ts-check
// @ts-ignore
import { StylesControlsV2, StylesControlsV3, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js";
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js";
import { ComponentsManager, ConvertToMoneyString, html, WRender } from "../WDevCore/WModules/WComponentsTools.js";

import { Catalogo_Cambio_Divisa_ModelComponent, Catalogo_Categoria_ModelComponent, Catalogo_Estados_Articulos_ModelComponent } from "../FrontModel/DBODataBaseModel.js";
import { WForm } from "../WDevCore/WComponents/WForm.js";
import { Transactional_Configuraciones } from "../Admin/ADMINISTRATIVE_ACCESSDataBaseModel.js";
import { Cat_Categorias } from "../Facturacion/FrontModel/Cat_Categorias.js";
import { Cat_Marca } from "../Facturacion/FrontModel/Cat_Marca.js";
import { Cat_Producto } from "../Facturacion/FrontModel/Cat_Producto.js";
import { Cat_Proveedor } from "../Facturacion/FrontModel/Cat_Proveedor.js";
import { Detalle_Compra } from "../Facturacion/FrontModel/Detalle_Compra.js";
import { Datos_Compra, Tbl_Compra } from "../Facturacion/FrontModel/Tbl_Compra.js";
import { ComprasComponent } from "../Facturacion/Views/CompraComponent.js";
import { ValoracionesTransaction } from "../FrontModel/Model.js";
import { Tbl_Cuotas_ModelComponent } from "../FrontModel/Tbl_Cuotas_ModelComponent.js";
import { FinancialModule } from "../modules/FinancialModule.js";
import { clientSearcher, ValoracionesSearch } from "../modules/SerchersModules.js";
import { Permissions, WSecurity } from "../WDevCore/Security/WSecurity.js";
import { WAppNavigator } from "../WDevCore/WComponents/WAppNavigator.js";
import { WModalForm } from "../WDevCore/WComponents/WModalForm.js";
import { css } from "../WDevCore/WModules/WStyledRender.js";
import { WArrayF } from "../WDevCore/WModules/WArrayF.js";
import { FacturasBuilder } from "../Facturacion/Views/Builders/FacturasBuilder.js";
import { DocumentsData } from "../Facturacion/FrontModel/DocumentsData.js";
import { Catalogo_Cambio_Divisa } from "../FrontModel/Catalogo_Cambio_Divisa.js";
import { WPrintExportToolBar } from "../WDevCore/WComponents/WPrintExportToolBar.mjs";
import { ModalMessage } from "../WDevCore/WComponents/ModalMessage.js";
import { WAlertMessage } from "../WDevCore/WComponents/WAlertMessage.js";
import { WCard } from "../WDevCore/WComponents/WCard.js";
import { SystemConfigs } from "../Services/SystemConfigs.js";
import { Catalogo_Clientes_ModelComponent } from "../Facturacion/FrontModel/Catalogo_Clientes.js";
import { FilterData } from "../WDevCore/WModules/CommonModel.js";
import { Transactional_Valoracion, Transactional_Valoracion_ModelComponent } from "../FrontModel/Transaction_Valoracion.js";
import { Transaction_Contratos } from "../FrontModel/Transaction_Contratos.js";
import { Catalogo_Clientes } from "../FrontModel/ClientesModel.js";
import { Detail_Valores } from "../Facturacion/FrontModel/Tbl_Lotes.js";
import { WSimpleModal } from "../WDevCore/WComponents/WSimpleModal.js";
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
		/**
		 * @type {never[]}
		 */
		this.valoracionesDataset = [];
		this.selectedClientDetail = WRender.Create({ tagName: "div", className: "selected-client" });
		this.amortizacionResumen = WRender.Create({ tagName: "div", children: [this.valoracionResumen(0, 0, 0, 0)] });
		this.Draw();
	}
	Draw = async () => {
		/** @type {Array<Catalogo_Cambio_Divisa>} */
		this.tasasCambio = await new Catalogo_Cambio_Divisa_ModelComponent().Get();
		let estadosArticulos = await new Catalogo_Estados_Articulos_ModelComponent().Where(
			FilterData.IsNull("id_categoria")
		);
		this.estadosArticulos = estadosArticulos.sort(((a, b) => a.id_estado_articulo - b.id_estado_articulo));
		this.Categorias = await new Catalogo_Categoria_ModelComponent().Get()
		this.Intereses = await new Transactional_Configuraciones().getConfiguraciones_Intereses();
		this.Beneficios = await new Transactional_Configuraciones().getConfiguraciones_Beneficios();
		this.InteresBase = WArrayF.SumValAtt(this.Intereses, "Valor");

		this.buildValoresModel(this.tasasCambio);

		this.multiSelectEstadosArticulos = new WTableComponent({
			Dataset: estadosArticulos,
			ModelObject: this.BuildEstadosArticulosModel(),
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
			// @ts-ignore
			id: "valoracionesForm",
			// @ts-ignore
			SaveFunction: (/**@type {Transactional_Valoracion_ModelComponent} */ valoracion) => {
			}, CustomStyle: css`
				.divForm {
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
				}`,
		});

		this.valoracionesTable = new WTableComponent({
			Dataset: this.valoracionesDataset,
			ModelObject: new Transactional_Valoracion_ModelComponent({}),
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

			ModelObject: new Tbl_Cuotas_ModelComponent({ Estado: undefined }),
			paginate: false,
			AddItemsFromApi: false,
			AutoSave: false,
			id: "cuotasTable",
			Options: {

			}
		});

		this.ValoracionesResumenData = WRender.Create({ className: "valoracion-resumen-data" });
		this.beneficiosDetailUpdate();
		this.valoresObject = this.valoresObject ?? {
			Valoracion_1: 0, dolares_1: 0,
			Valoracion_2: 0, dolares_2: 0,
			Valoracion_3: 0, dolares_3: 0,
		}

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
					display: grid !important;
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
			NavStyle: "tab",
			Inicialize: true,
			Elements: [{
				name: "Amortización de deuda", action: () => {
					return this.CuotasTable;
				}
			}, {
				name: "Valoraciones", action: () => {
					return this.valoracionesTable;
				}
			}]
		})
		this.valoracionesContainer.append(
			this.selectedClientDetail,
			this.amortizacionResumen,
			this.ValoracionesResumenData,
			this.valoracionesForm,
			this.valoresForm,
			this.multiSelectEstadosArticulos,
			this.TableNavigator,
			this.TabContainerTables
		);
		if (!this.clientSercher) {
			this.clientSercher = clientSearcher([{
				name: "Seleccionar", action: (/** @type {any} */ cliente) => {
					this.selectCliente(cliente)
				}
			}]);
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

	BuildEstadosArticulosModel() {
		return new Catalogo_Estados_Articulos_ModelComponent({
			porcentaje_compra: { type: 'number', hidden: true },
			porcentaje_empeno: { type: 'number', hidden: true },
			Porcentaje_venta_compra: { type: 'number', hidden: true },
			Porcentaje_venta_empeno: { type: 'number', hidden: true },
			Categoria: { hidden: true },
			valor_compra_cordobas: {
				type: "operation", action: (/** @type {{ porcentaje_compra: any; }} */ element) => {
					return ConvertToMoneyString(this.calculoCordobas(element.porcentaje_compra));
				}
			}, valor_compra_dolares: {
				type: "operation", action: (/** @type {{ porcentaje_compra: any; }} */ element) => {
					// @ts-ignore
					return ConvertToMoneyString(this.calculoDolares(element.porcentaje_compra));
				}
			},
			valor_empeño_cordobas: {
				type: "operation", action: (/** @type {{ porcentaje_empeno: any; }} */ element) => {
					return ConvertToMoneyString(this.calculoCordobas(element.porcentaje_empeno));
				}
			}, valor_empeño_dolares: {
				type: "operation", action: (/** @type {{ porcentaje_empeno: any; }} */ element) => {
					// @ts-ignore
					return ConvertToMoneyString(this.calculoDolares(element.porcentaje_empeno));
				}
			}, porcentaje_venta_compra: null, porcentaje_venta_empeno: null
		});
	}

	/**
	 * 
	 * @param {Number} Valoracion_compra_cordobas 
	 * @param {Number} Valoracion_compra_dolares 
	 * @param {Number} Valoracion_empeño_cordobas 
	 * @param {Number} Valoracion_empeño_dolares 
	 * @returns {HTMLElement}
	 */
	valoracionResumen(Valoracion_compra_cordobas, Valoracion_compra_dolares, Valoracion_empeño_cordobas, Valoracion_empeño_dolares) {
		if (this.amortizacionResumen) {
			this.amortizacionResumen.innerHTML = ""
		}
		return html`<div class="resumen-container">
			<span>Compra C$:</span>
			<span class="money">${ConvertToMoneyString(Valoracion_compra_cordobas)} </span>
			<span>Compra $:</span>
			<span class="money">${ConvertToMoneyString(Valoracion_compra_dolares)}</span>
			<span>Empeño C$:</span>
			<span class="money">${ConvertToMoneyString(Valoracion_empeño_cordobas)}</span>
			<span>Empeño $:</span>
			<span class="money">${ConvertToMoneyString(Valoracion_empeño_dolares)}</span>
		</div>`;
	}
	/**
	 * @param {{ Valor_de_venta: number; }[]} tasasCambio
	 */
	buildValoresModel(tasasCambio) {
		this.valoresModel = {
			Valoracion_1: {
				type: "number", label: "Valoración 1 - C$:", action: () => {
					this.valoresObject.dolares_1 = this.Round(this.valoresObject.Valoracion_1 / tasasCambio[0].Valor_de_venta);
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
					this.valoresObject.Valoracion_1 = this.Round(this.valoresObject.dolares_1 * tasasCambio[0].Valor_de_venta);
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
					this.valoresObject.dolares_2 = this.Round(this.valoresObject.Valoracion_2 / tasasCambio[0].Valor_de_venta);
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
					this.valoresObject.Valoracion_2 = this.Round(this.valoresObject.dolares_2 * tasasCambio[0].Valor_de_venta);
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
					this.valoresObject.dolares_3 = this.Round(this.valoresObject.Valoracion_3 / tasasCambio[0].Valor_de_venta);
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
					this.valoresObject.Valoracion_3 = this.Round(this.valoresObject.dolares_3 * tasasCambio[0].Valor_de_venta);
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
				type: "number", label: "Total - C$", disabled: true, action: (/** @type {any} */ data) => {
					//return this.promediarValoresCordobas(data)
				}
			}, total_dolares: {
				type: "number", label: "$:", disabled: true, action: (/** @type {any} */ data) => {
					//return this.promediarValoresDolares(data)
				}
			}
		};
	}
	/**
	* @param {Number} arg 
	* @returns {Number}
	*/
	Round(arg) {
		return Number(arg.toFixed(3));
	}
	/**
	 * @param {{ Valoracion_1?: number; dolares_1: any; Valoracion_2?: number; dolares_2: any; Valoracion_3?: number; dolares_3: any; total_dolares?: any; }} data
	 */
	promediarValoresDolares(data) {
		//console.log(data);
		data.total_dolares = ((parseFloat(data.dolares_1) + parseFloat(data.dolares_2) + parseFloat(data.dolares_3)) / 3).toFixed(3);
		const control = this.valoresForm?.shadowRoot?.querySelector(".total_dolares");
		if (control != undefined || control != null) {
			// @ts-ignore
			control.value = data.total_dolares.toString();
		}
		return data.total_dolares;
	}

	/**
	 * @param {{ Valoracion_1: any; dolares_1?: number; Valoracion_2: any; dolares_2?: number; Valoracion_3: any; dolares_3?: number; total_cordobas?: any; }} data
	 */
	promediarValoresCordobas(data) {
		data.total_cordobas = ((parseFloat(data.Valoracion_1) + parseFloat(data.Valoracion_2) + parseFloat(data.Valoracion_3)) / 3).toFixed(3);
		const control = this.valoresForm?.shadowRoot?.querySelector(".total_cordobas");
		if (control != undefined || control != null) {
			// @ts-ignore
			control.value = data.total_cordobas.toString();
		}
		return data.total_cordobas;
	}

	/**
	 * @param {{ Valor_de_venta: any; }[]} tasasCambio
	 * @param {WTableComponent} multiSelectEstadosArticulos
	 */
	valoracionesModel(tasasCambio, multiSelectEstadosArticulos) {
		const model = new Transactional_Valoracion_ModelComponent({
			Fecha: { type: 'date', disabled: true },
			Tasa_de_cambio: { type: 'number', disabled: true, defaultValue: tasasCambio[0].Valor_de_venta },
			// @ts-ignore
			Tasa_interes: { type: 'number', disabled: true, defaultValue: this.InteresBase + 6 },
			Plazo: {
				// @ts-ignore
				type: "number", action: () => this.calculoAmortizacion(), min: 1, max: this.Categorias[0].plazo_limite, defaultValue: 1
			}, Catalogo_Estados_Articulos: { type: 'WSELECT', hidden: true },
			Valoracion_compra_cordobas: {
				// @ts-ignore
				type: 'operation', action: (/**@type {Transactional_Valoracion_ModelComponent} */ valoracion) => {
					return this.calculoCordobas(multiSelectEstadosArticulos.selectedItems[0].porcentaje_compra);
				}, hidden: true
			}, Valoracion_empeño_cordobas: {
				// @ts-ignore
				type: 'operation', action: (/**@type {Transactional_Valoracion_ModelComponent} */ valoracion) => {
					return this.calculoCordobas(multiSelectEstadosArticulos.selectedItems[0].porcentaje_empeno);
				}, hidden: true
			}, Valoracion_compra_dolares: {
				// @ts-ignore
				type: 'operation', action: (/**@type {Transactional_Valoracion_ModelComponent} */ valoracion) => {
					return this.calculoDolares(multiSelectEstadosArticulos.selectedItems[0].porcentaje_compra);
				}, hidden: true
			}, Valoracion_empeño_dolares: {
				// @ts-ignore
				type: 'operation', action: (/**@type {Transactional_Valoracion_ModelComponent} */ valoracion) => {
					return this.calculoDolares(multiSelectEstadosArticulos.selectedItems[0].porcentaje_empeno);
				}, hidden: true
			},
		});
		model.Catalogo_Categoria.action = (/**@type {Transactional_Valoracion} */ categoria) => {
			this.UpdateEstadosArticulos(categoria);
		}
		return model;
	}
	/** @return {Number} */
	calculoCordobas = (/** @type {number} */ porcentaje) => {
		// @ts-ignore
		/**@type {Number} */ const tasa_cambio = this.tasasCambio[0]?.Valor_de_compra;
		// @ts-ignore
		return (this.calculoDolares(porcentaje) * tasa_cambio).toFixed(3);
	}
	/** @return {Number} */
	calculoDolares = (/** @type {number} */ porcentaje) => {
		// @ts-ignore
		return Math.round((this.avgValores().toFixed(0) * (porcentaje / 100))).toFixed(3);
	}

	/**
	 * @param {Transactional_Valoracion} [valoracion]
	 */
	UpdateEstadosArticulos(valoracion) {
		if (this.multiSelectEstadosArticulos && this.estadosArticulos && valoracion) {
			if (Array.isArray(valoracion.Catalogo_Categoria?.Catalogo_Estados_Articulos)) {
				this.multiSelectEstadosArticulos.Config.Dataset = valoracion.Catalogo_Categoria.Catalogo_Estados_Articulos;
				this.multiSelectEstadosArticulos.Dataset = valoracion.Catalogo_Categoria.Catalogo_Estados_Articulos;
				this.multiSelectEstadosArticulos.selectedItems = [valoracion.Catalogo_Categoria.Catalogo_Estados_Articulos[0]];
			} else {
				this.multiSelectEstadosArticulos.Config.Dataset = this.estadosArticulos;
				this.multiSelectEstadosArticulos.Dataset = this.estadosArticulos;
				this.multiSelectEstadosArticulos.selectedItems = [this.estadosArticulos[0]];
			}
			valoracion.Catalogo_Categoria
			if (this.valoracionesForm) {
				this.valoracionesForm.ModelObject.Plazo.max = valoracion?.Catalogo_Categoria?.plazo_limite ?? 6;
				if (valoracion.Plazo && valoracion.Plazo > this.valoracionesForm.ModelObject.Plazo.max) {
					valoracion.Plazo = this.valoracionesForm.ModelObject.Plazo.max
				}
				this.multiSelectEstadosArticulos?.DrawTable();
			}

		}
		this.calculoAmortizacion();

	}

	avgValores() {
		return ((parseFloat(this.valoresObject.dolares_1.toString()) +
			parseFloat(this.valoresObject.dolares_2.toString()) +
			parseFloat(this.valoresObject.dolares_3.toString())) / 3);
	}
	SetOption() {
		this.OptionContainer.innerHTML = "";
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
			tagName: 'button', className: 'Block-Fourth', innerText: 'Añadir / Guardar',
			onclick: async () => {
				if (!this.valoracionesForm?.Validate()) {
					return;
				}
				if (this.valoresObject.Valoracion_1 <= 0 ||
					this.valoresObject.Valoracion_3 <= 0 ||
					this.valoresObject.Valoracion_3 <= 0) {
					WAlertMessage.Warning("Llene el formulario de valoraciones con montos mayores a 0");
					return;
				}
				const existVehiculo = this.valoracionesTable?.Dataset.find(p => p.Catalogo_Categoria.IsForVehiculo == true);
				if (existVehiculo != undefined && this.valoracionesForm?.FormObject.Catalogo_Categoria.IsForVehiculo != true) {
					WAlertMessage.Warning("Anteriormente valoro un vehículo por lo tanto no puede agregar valoraciones de diferente categoría");
					return;
				}

				const notExistVehiculo = this.valoracionesTable?.Dataset.every(p => p.Catalogo_Categoria.id_categoria.IsForVehiculo != true);
				if (notExistVehiculo && this.valoracionesForm?.FormObject.Catalogo_Categoria.IsForVehiculo == true) {
					WAlertMessage.Warning("Anteriormente valoro un artículo distinto de vehículo por lo tanto no puede agregar valoraciones de esta categoría");
					return;
				}
				/**@type {Transactional_Valoracion} */
				const newValoracion = new Transactional_Valoracion();
				for (const prop in this.valoracionesForm?.FormObject) {
					// @ts-ignore
					newValoracion[prop] = this.valoracionesForm?.FormObject[prop];
				}

				const newValores = new Detail_Valores();
				for (const prop in this.valoresObject) {
					// @ts-ignore
					newValores[prop] = this.valoresObject[prop];
				}
				newValoracion.Detail_Valores = newValores;
				newValoracion.Catalogo_Estados_Articulos = this.multiSelectEstadosArticulos?.selectedItems[0];
				newValoracion.id_estado = this.multiSelectEstadosArticulos?.selectedItems[0].id_estado_articulo;
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
				//guardar

				for (const element of this.valoracionesTable?.Dataset ?? []) {
					if (element.requireReValoracion(parseFloat((await SystemConfigs.FindByName("VENCIMIENTO_VALORACION"))?.Valor ?? "40"))) {
						element.id_valoracion = null;
						element.Fecha = new Date();
					}
				}
				this.valoracionModel?.GuardarValoraciones(this.valoracionesTable?.Dataset);
			}
		}))
		if (WSecurity.HavePermission(Permissions.GESTION_EMPEÑOS)) {
			this.OptionContainer.append(WRender.Create({
				tagName: 'button', className: 'Block-Success', innerText: 'Generar Contrato',
				onclick: async () => {
					if (this.valoracionesTable?.Dataset.length == 0) {
						WAlertMessage.Connect({ Message: "Agregue valoraciones para poder continuar", Type: "warning" });
						return;
					}
					if (this.Cliente?.codigo_cliente == undefined) {
						WAlertMessage.Connect({ Message: "Seleccione un cliente para continuar", Type: "warning" });
						return;
					}
					const response = await this.calculoAmortizacion().SaveDataContract();
					if (response) {
						window.location.href = "/PagesViews/Transaction_ContratosView";
					}
				}
			}))
		}

		if (WSecurity.HavePermission(Permissions.GESTION_COMPRAS)) {
			this.OptionContainer.append(WRender.Create({
				tagName: 'button', className: 'Block-Success', innerText: 'Facturar',
				onclick: async () => {
					const Compra = this.GenerateCompra();
				}
			}))
		}

	}
	GenerateCompra() {
		if (this.Cliente.codigo_cliente == undefined) {
			this.append(ModalMessage("Seleccione o cree un cliente nuevo para continuar"));
			this.append(this.NuevoClienteProveedor())
			return;
		}
		if (this.valoracionesTable?.Dataset.length == 0) {
			this.append(ModalMessage("Agregue valoraciones para poder continuar"));
			return;
		}
		const nuevaCompra = new Tbl_Compra();
		// @ts-ignore
		nuevaCompra.Tasa_Cambio = this.tasasCambio[0]?.Valor_de_compra;

		nuevaCompra.Cat_Proveedor = new Cat_Proveedor({
			stado: "ACTIVO",
			Identificacion: this.Cliente.identificacion,
			Nombre: `${this.Cliente.primer_nombre} ${this.Cliente.segundo_nombre ?? ""} ${this.Cliente.primer_apellido ?? ""} ${this.Cliente.segundo_apellidio ?? ""}`,
			Datos_Proveedor: this.Cliente
		});
		nuevaCompra.Datos_Compra = new Datos_Compra();
		nuevaCompra.Datos_Compra.RUC = this.Cliente.identificacion
		nuevaCompra.Moneda = "DOLARES";
		const IvaPercent = 0;
		nuevaCompra.Detalle_Compra = this.valoracionesTable?.Dataset.map((/**@type {Transactional_Valoracion_ModelComponent} */ element) => {
			const detalleCompra = new Detalle_Compra();
			detalleCompra.Cantidad = 1;
			const beneficioVentaC = this.Beneficios?.find(b => b.Nombre == "BENEFICIO_VENTA_ARTICULO_COMPRADO")

			// @ts-ignore
			detalleCompra.Precio_Unitario = element.Valoracion_compra_dolares;
			// @ts-ignore
			detalleCompra.Precio_Venta = ((element.Valoracion_compra_dolares) * (beneficioVentaC.Valor / 100 + 1));
			detalleCompra.SubTotal = detalleCompra.Precio_Unitario * detalleCompra.Cantidad;
			detalleCompra.Aplica_Iva = false;
			detalleCompra.Iva = detalleCompra.Precio_Unitario * IvaPercent;
			detalleCompra.Total = detalleCompra.SubTotal + detalleCompra.Iva;
			detalleCompra.Datos_Producto_Lote = element;
			detalleCompra.Presentacion = "UND";
			detalleCompra.Cat_Producto = new Cat_Producto({
				Descripcion: element.Descripcion,
				Cat_Marca: new Cat_Marca({
					Nombre: element.Marca,
					Descripcion: element.Marca,
					Estado: "ACTIVO"
				}),
				Cat_Categorias: new Cat_Categorias({
					// @ts-ignore
					Descripcion: element.Catalogo_Categoria.descripcion,
					Estado: "ACTIVO"
				})
			});
			return detalleCompra;
		}) ?? [];
		const modal = new WModalForm({
			title: "REGISTRAR COMPRA",
			// @ts-ignore
			FullScreen: true,
			ObjectModal: new ComprasComponent({
				Entity: nuevaCompra,
				TasaCambio: nuevaCompra.Tasa_Cambio,
				IvaPercent: IvaPercent,
				WithTemplate: true,
				action: async (/** @type {any} */ object, /** @type {{ body: Tbl_Compra; }} */ response) => {
					//this.append(ModalMessage(response.message));
					/**@type {DocumentsData} */
					const documentsData = await new DocumentsData().GetDataFragments();
					documentsData.Header.style.width = "100%";
					// console.log(FacturasBuilder.BuildFacturaCompra(documentsData, response.body));
					const facturaR = FacturasBuilder.BuildFacturaCompra(documentsData, response.body);
					const div = html`<div class="contract-response">
						${new WPrintExportToolBar({
						PrintAction: (toolBar) => {
							toolBar.Print(html`<div>${facturaR.cloneNode(true)}</div>`)
						}
					})}
						${facturaR}        
					</div>`;
					document.body.append(new WModalForm({
						ShadowRoot: false,
						ObjectModal: div,
						ObjectOptions: {
							SaveFunction: () => {
								location.href = "/Facturacion/ComprasManager"
							}
						}
					}))
					modal.close();
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
					this.amortizacionResumen = WRender.Create({ tagName: "label", children: [this.valoracionResumen(0, 0, 0, 0)] });
					this.Draw();
				}
			})
		})
		this.append(modal);
	}
	NuevoClienteProveedor() {
		return new WModalForm({
			ModelObject: new Catalogo_Clientes_ModelComponent(),
			EditObject: { codigo_cliente: -1 },
			AutoSave: false,
			ObjectOptions: {
				SaveFunction: (/** @type {Catalogo_Clientes} */ cliente) => {
					this.Cliente = cliente;
					this.GenerateCompra();
				}
			}
		});
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
		this.selectedClientDetail.innerHTML = "";
		this.selectedClientDetail.append(new WCard(selectCliente, {
			Nombre_completo: { type: 'text', lable: "Nombre" },
			identificacion: { type: 'text' }
		}))
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
	selectValoracion = async (/**@type {Transactional_Valoracion}*/ valoracion) => {
		this.valoracionSeleccionada = valoracion
		if (valoracion.id_valoracion != undefined || valoracion.id_valoracion != null) {
			const valoracionAgregada = this.valoracionesTable?.Dataset.find(d => d.id_valoracion == valoracion.id_valoracion);
			if (valoracionAgregada != null) {
				this.append(ModalMessage("Valoración ya esta agregada"));
				return;
			}
		}
		// @ts-ignore
		valoracion.Tasa_de_cambio = this.tasasCambio[0]?.Valor_de_venta
		if (this.valoracionesForm != undefined) {
			for (const prop in this.valoracionesForm?.FormObject) {
				if (prop == "Detail_Valores") continue;
				if (prop == "Tasa_interes") continue;
				if (prop == "Serie") continue;
				// @ts-ignore
				if (prop == "id_valoracion" && valoracion.requireReValoracion(parseFloat((await SystemConfigs.FindByName("VENCIMIENTO_VALORACION"))?.Valor ?? "40"))) continue;
				this.valoracionesForm.FormObject[prop] = valoracion[prop]
			}
			this.valoracionesForm.Config.ModelObject?.Catalogo_Categoria?.action(this.valoracionesForm.FormObject, this.valoracionesForm);
			this.valoracionesForm.DrawComponent();
			if (this.valoresForm != undefined) {
				// @ts-ignore
				if (!valoracion.requireReValoracion(parseFloat((await SystemConfigs.FindByName("VENCIMIENTO_VALORACION"))?.Valor ?? "40"))) {
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
	beneficiosDetailUpdate() {
		// @ts-ignore
		this.ValoracionesResumenData.innerHTML = "";
		/**@type {Transactional_Valoracion} */
		const detail = this.valoracionesForm?.FormObject;
		const estado_seleccionado = detail.Catalogo_Estados_Articulos;

		let beneficioVentaC = parseFloat(this.Beneficios?.find(b => b.Nombre == "BENEFICIO_VENTA_ARTICULO_COMPRADO"));
		let beneficioVentaE = parseFloat(this.Beneficios?.find(b => b.Nombre == "BENEFICIO_VENTA_ARTICULO_EMPENO"));
		if (estado_seleccionado?.Porcentaje_venta_compra) {
			beneficioVentaC = estado_seleccionado?.Porcentaje_venta_compra;
		}
		if (estado_seleccionado?.Porcentaje_venta_empeno) {
			beneficioVentaE = estado_seleccionado?.Porcentaje_venta_empeno;
		}

		const mora = detail.Tasa_interes * 2 / 100;
		const precio_venta_empeño = ((parseFloat(detail.Valoracion_empeño_dolares) * (mora + 1)) * (beneficioVentaE.Valor / 100 + 1));
		//console.log(precio_venta_empeño);
		// @ts-ignore
		this.valoracionesForm.FormObject.Precio_venta_empeño_cordobas = (precio_venta_empeño);
		// @ts-ignore
		this.valoracionesForm.FormObject.Precio_venta_empeño_dolares = (precio_venta_empeño / this.tasasCambio[0].Valor_de_venta)
		// @ts-ignore
		//const moraDolares =  mora / this.tasasCambio[0].Valor_de_venta;    
		this.ValoracionesResumenData?.append(html`<button class="Block-Secundary btnBeneficio" onclick="${() => {
			const beneficios = html`<div>
					<div class= "column-venta" >
						<h3>VENTA DE COMPRA</h3>
						<span>C$ ${((detail.Valoracion_compra_cordobas) * (beneficioVentaC.Valor / 100 + 1)).toFixed(3)}</span>
						<span>$ ${((detail.Valoracion_compra_dolares) * (beneficioVentaC.Valor / 100 + 1)).toFixed(3)}</span>
					</div >
					<div class="column-venta">
						<h3>VENTA DE EMPEÑO</h3>
						<span>C$ ${precio_venta_empeño.toString() == "NaN" ? "0.00"
					: (precio_venta_empeño *
						// @ts-ignore
						this.tasasCambio[0].Valor_de_venta).toFixed(3)}</span>
						<span>$ ${precio_venta_empeño.toString() == "NaN" ? "0.00"
					: precio_venta_empeño.toFixed(3)}</span>
					</div>
				</div>`;
			document.body.append(new WModalForm({
				ObjectModal: beneficios
			}))
		}}">Beneficio</button>`);
		this.ValoracionesResumenData?.append(html`<button class="Block-Secundary" onclick="${() => {
			this.printDocument('/documents/formatoInspeccionAutos.html');
		}}">F/Autos</button>`)
		this.ValoracionesResumenData?.append(html`<button class="Block-Secundary" onclick="${() => {
			this.printDocument('/documents/formatoInspeccionMotos.html');
		}}">F/Motos</button>`)
		this.multiSelectEstadosArticulos?.SetOperationValues();
		this.UpdateEstadosArticulos(this.valoracionSeleccionada)
	}
	printDocument = (/** @type {string | URL | undefined} */ url) => {
		const printWindow = window.open(url, '_blank');

		if (!printWindow) return;

		printWindow.onload = () => {
			printWindow.focus();
			printWindow.print();

			// opcional: cerrar después
			printWindow.onafterprint = () => {
				printWindow.close();
			};
		};
	};
	/**
	 * 
	 * @returns {ValoracionesTransaction}
	 */
	calculoAmortizacion = () => {
		if (this.valoracionesTable?.Dataset.length == 0) {
			this.amortizacionResumen.innerHTML = "";
			this.amortizacionResumen.append(this.valoracionResumen(0, 0, 0, 0));
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
			taza_cambio: this.tasasCambio[0].Valor_de_venta,
			// @ts-ignore
			taza_cambio_compra: this.tasasCambio[0].Valor_de_compra,
			taza_interes_cargos: this.InteresBase,
			Catalogo_Clientes: this.Cliente.codigo_cliente != undefined ? this.Cliente : this.GenerateClient(),
			gestion_crediticia: this.Cliente.Catalogo_Clasificacion_Interes?.porcentaje ?? 6,
		});
		FinancialModule.calculoAmortizacion(contrato);
		//console.log(FinancialModule.calculoAmortizacion(contrato));

		if (this.CuotasTable != undefined) {
			this.CuotasTable.Dataset = contrato.Transaction_Contratos.Tbl_Cuotas;
			this.CuotasTable?.Draw();
		}
		this.amortizacionResumen.append(this.valoracionResumen(
			contrato.Transaction_Contratos.Valoracion_compra_cordobas,
			contrato.Transaction_Contratos.Valoracion_compra_dolares,
			contrato.Transaction_Contratos.Valoracion_empeño_cordobas,
			contrato.Transaction_Contratos.Valoracion_empeño_dolares));
		return contrato;
	}
	/**
	* @returns {Catalogo_Clientes}
	*/
	GenerateClient() {
		return new Catalogo_Clientes({
			Catalogo_Clasificacion_Interes: {
				id_clasificacion_interes: 6,
				Descripcion: "RANGO 6",
				Estado: "ACTIVO",
				porcentaje: 6,
				Catalogo_Clientes: null,
				filterData: null
			},
			Catalogo_Clasificacion_Cliente: {
				id_clasificacion: 6,
				Descripcion: "NO DEFINIDO",
				Estado: "ACTIVO",
				porcentaje: null,
				Catalogo_Clientes: null,
				filterData: null
			}
		})
	}
	CustomStyle = css`
		.valoraciones-container{
			padding: 20px;
			display: grid;
			grid-template-columns: 400px calc(100% - 730px) 300px;
			gap: 20px 30px;
			@media (max-width: 800px) {
				grid-template-columns: 100%;
			}
		}
		#valoracionesForm {
			grid-column: span 3;
			@media (max-width: 800px) {
				grid-column: span 1;
			}
		}
		.multiSelectEstadosArticulos {
			grid-column: span 2;
			@media (max-width: 800px) {
				grid-column: span 1;
			}
		}
		.beneficios-detail h4 {
			margin: 0px 10px 5px 10px;
		}
		.beneficios-detail, .resumen-container {
			padding: 10px;
			border-radius: 10px;
			border: solid 1px #bcbdbd;;
			overflow: hidden;
			max-height:15px;
			transition: all 0.7s;
			cursor: pointer;
		}

		.resumen-container {
			display: grid;
			grid-template-columns: repeat(4, 1fr);
			gap: 10px 15px;
			max-height: unset;
			font-size: 0.8rem;
			@media(max-width: 600px) {
				grid-template-columns: repeat(2, 1fr);
			}
		}

		.money {
			font-weight: bold;
			text-align: right;
		}
		w-app-navigator {
			grid-column: span 3;
		}
		.beneficios-detail:hover {
			max-height:1500px;
		}
		.column-venta{
			display: grid;
			grid-template-columns: 47% 47%;
			gap: 5px;
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
		.nav-header{
			grid-column: span 3;
			@media (max-width: 800px) {
				grid-column: span 1;
			}
		}
		.nav-header {
			display: flex;
			width: 100%;
			justify-content: space-between;
			font-size: 14px;
			font-weight: bold;
			color: var(--font-secundary-color)
		}   
		.contract-response {
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 0px  30px;
			background-color: #d7d7d7;
		}    
		.OptionContainer{
			display: flex;
		} w-filter-option {
			grid-column: span 2;
		}    
		.selected-client {
			display: block;
			border-radius: 10px;
			border:  solid 1px #bcbdbd;;
			padding: 10px 30px 10px 10px;
		}   
		.valoracion-resumen-data {
			display: grid;
			grid-template-columns: repeat(2, 1fr);
			gap: 5px;
		} 
		.btnBeneficio {
			grid-column: span 2;
			max-width: unset !important;
		}
	`
}
customElements.define('w-valoraciones-view', Transaction_Valoraciones_View);
export { Transaction_Valoraciones_View };
// @ts-ignore
window.addEventListener('load', async () => { MainBody.append(new Transaction_Valoraciones_View()) })

