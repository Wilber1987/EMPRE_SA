//@ts-check
// @ts-ignore
import { ComponentsManager, html, WRender } from "../../WDevCore/WModules/WComponentsTools.js";
// @ts-ignore
import { WTableComponent } from "../../WDevCore/WComponents/WTableComponent.js";
// @ts-ignore
import { WAppNavigator } from "../../WDevCore/WComponents/WAppNavigator.js";
import { css } from "../../WDevCore/WModules/WStyledRender.js";
import { Tbl_Lotes_ModelComponent } from "../FrontModel/ModelComponent/Tbl_Lotes_ModelComponent.js";
import { Tbl_Lotes } from "../FrontModel/Tbl_Lotes.js";
import { WModalForm } from "../../WDevCore/WComponents/WModalForm.js";
import { Tbl_Transaccion } from "../FrontModel/Tbl_Transaction.js";
import { Tbl_Transaccion_ModelComponent } from "../FrontModel/ModelComponent/Tbl_Transaction_ModelComponent.js";
import { WPrintExportToolBar } from "../../WDevCore/WComponents/WPrintExportToolBar.mjs";
import { WArrayF } from "../../WDevCore/WModules/WArrayF.js";
import { DateTime } from "../../WDevCore/WModules/Types/DateTime.js";
import { ModalMessage } from "../../WDevCore/WComponents/ModalMessage.js";
import { ModalVericateAction } from "../../WDevCore/WComponents/ModalVericateAction.js";
import { WFilterOptions } from "../../WDevCore/WComponents/WFilterControls.js";
import { DivisasServicesUtil } from "../../Services/DivisasServicesUtil.js";
import { SystemConfigs } from "../../Services/SystemConfigs.js";
import { WAlertMessage } from "../../WDevCore/WComponents/WAlertMessage.js";
import { Tbl_Bajas_Almacen, Tbl_Bajas_Almacen_ModelComponent } from "../FrontModel/Tbl_Bajas_Almacen.js";
import { Tbl_Movimientos_Almacen, Tbl_Movimientos_Almacen_ModelComponent } from "../FrontModel/Tbl_Movimientos_Almacen.js";
import { Tbl_Acta_Entrega, Tbl_Acta_Entrega_ModelComponent } from "../FrontModel/Tbl_Acta_Entrega.js";
import { VentasComponent } from "./VentasComponent.js";
import { Tbl_Factura } from "../FrontModel/Tbl_Factura.js";
import { Transaction_Contratos } from "../../FrontModel/Model.js";
import { Detalle_Factura } from "../FrontModel/Detalle_Factura.js";
import { FilterData } from "../../WDevCore/WModules/CommonModel.js";
import { Detalle_Factura_ModelComponent } from "../FrontModel/ModelComponent/Detalle_Factura_ModelComponent.js";
import { ReturnTransaction } from "../FrontModel/ReturnTransaction.js";

/**
 * @typedef {Object} LotesConfig
 * * @property {Tbl_Lotes} [Entity]
 * * @property {Tbl_Lotes} [TasaCambio]
 */
class ActasEntregasView extends HTMLElement {
	constructor(LotesConfig) {
		super();
		this.LotesConfig = LotesConfig;
		this.OptionContainer = WRender.Create({ className: "OptionContainer" });
		this.TabContainer = WRender.Create({ className: "TabContainer", id: 'TabContainer' });
		this.navigator = new WAppNavigator({ Elements: this.ElementsNav })
		this.Manager = new ComponentsManager({ MainContainer: this.TabContainer, SPAManage: true, WNavigator: this.navigator });

		this.indexFactura = 0;
		this.valoresObject = {
			subtotal: 0,
			iva: 0,
		}
		this.Draw();
	}
	ElementsNav = [{
		name: "Actas de entrega", id: "ActasView", action: () => {
			this.Manager.NavigateFunction("ActasView", this.ActasView())
		},
	}]

	Draw = async () => {
		this.TasaCambio = await DivisasServicesUtil.TasaCambio();
		this.Porcentaje = await SystemConfigs.FindByName("PORCENTAGE_MINIMO_DE_PAGO_APARTADO_MENSUAL");
		this.append(this.CustomStyle, this.OptionContainer, this.navigator, this.TabContainer);
	}//end draw

	BuildLoteModel = () => {
		this.LotesModel = new Tbl_Lotes_ModelComponent();
	}

	ActasView() {
		return new WTableComponent({
			ModelObject: new Tbl_Acta_Entrega_ModelComponent(),
			EntityModel: new Tbl_Acta_Entrega(),
			AutoSave: true,
			Options: {
				Search: false,
				Filter: true,
				Add: true,
				Edit: false,
				FilterDisplay: true,
				AutoSetDate: false,
				UserActions: [{
					name: "Anular acta",
					rendered: (/**@type {Tbl_Acta_Entrega}*/ mov) => mov.IsAnulable,
					action: async (/**@type {Tbl_Acta_Entrega}*/ acta) => {
						await this.ActasAnulacionView(acta)
						//const modal = new E
						//this.Manager.NavigateFunction("ActasAnulacionView" + acta.Id_Acta_Entrega, await this.ActasAnulacionView(acta));
					}
				}]
			}
		});
	}
	/**
	 * @param {Tbl_Acta_Entrega} acta
	 */
	async ActasAnulacionView(acta) {
		/**@type {Tbl_Factura} */
		const facturaBuscada = await new Tbl_Factura().Find(new FilterData({
			JsonPropName: "Numero_Contrato",
			PropName: "Datos_Financiamiento",
			FilterType: "JSONPROP_EQUAL",
			PropSQLType: "int",
			Values: [acta.Numero_Contrato.toString()],
		}));

		facturaBuscada.Tasa_Cambio = this.TasaCambio?.Valor_de_compra ?? 1;
		facturaBuscada.Tasa_Cambio_Venta = this.TasaCambio?.Valor_de_venta ?? 1;

		/**@type {Transaction_Contratos} */
		const contratoBuscado = await new Transaction_Contratos({ numero_contrato: acta.Numero_Contrato }).Find();
		const contratoTotalPagado = WArrayF.SumValue(
			contratoBuscado.Tbl_Cuotas.filter(cuota => cuota.Estado == "CANCELADO"), "total"
		);

		const multiSelectTable = new WTableComponent({
			Dataset: facturaBuscada.Detalle_Factura,
			ModelObject: new Detalle_Factura_ModelComponent(),
			UseEntityMethods: false,
			Options: { MultiSelect: true }
		})
		const MotivoInput = html`<textarea class="motivo-input"></textarea>`

		const modal = new WModalForm({
			//EditObject: Transaction,
			title: "SELECCIONAR ARTÍCULOS",
			ObjectModal: html`<div class="container">
				<hr/>
				<p>Seleccione articulos para anular.</p>
				${MotivoInput}
				<hr/>
				${multiSelectTable}
				<div class="options">
					<button class="Btn" onclick="${() => {
					this.append(ModalVericateAction(async () => {
						const response = await this.GoToAnularActaView(facturaBuscada, multiSelectTable, contratoTotalPagado, acta, MotivoInput);
						if (response) {
							modal.close();
						}
						//return newVentasComponent;
					}, "Esta seguro que desea dar de baja esta existencia?"));
				}}">Aceptar</button>
				</div>
				<style>
					.options { 
						display: flex;
 						justify-content: center;
						padding: 10px;
					}
				</style>
			</div>`
		});
		this.append(modal);



	}
	/**
	 * @param {Tbl_Factura} facturaBuscada
	 * @param {WTableComponent} multiSelectTable
	 * @param {number} contratoTotalPagado
	 * @param {Tbl_Acta_Entrega} acta
	 * @param {HTMLElement | HTMLInputElement} MotivoInput
	 */
	async GoToAnularActaView(facturaBuscada, multiSelectTable, contratoTotalPagado, acta, MotivoInput) {
		if (multiSelectTable.selectedItems.length == 0) {
			WAlertMessage.Info("Debe seleccionar almenos un artículo")
			return false;
		}
		// @ts-ignore
		if (MotivoInput.value.length < 3) {
			WAlertMessage.Info("Debe seleccionar escribir el motivo de anulacion")
			return false;
		}
		const nuevaVenta = new Tbl_Factura(facturaBuscada);
		const nuevosDetalles = [];
		let IsAllArticulosRemplazados = false;
		const montoTotal = contratoTotalPagado + (facturaBuscada.Total - (facturaBuscada?.Datos_Financiamiento?.Total_Financiado ?? 0));
		nuevaVenta.Id_Factura = null;
		nuevaVenta.Detalle_Factura = nuevosDetalles;
		nuevaVenta.Tipo = "VENTA";
		nuevaVenta.Monto_dolares = montoTotal;
		nuevaVenta.Monto_cordobas = montoTotal * nuevaVenta.Tasa_Cambio;

		let montoDisponible = 0;

		for (const item of multiSelectTable.selectedItems) {
			/** @type {Detalle_Factura} */
			const detail = item;
			const porcentajePorArticulo = detail.Total / facturaBuscada.Total;
			montoDisponible += (montoTotal * porcentajePorArticulo)
			/**@type {Tbl_Lotes} */
			const lote = await new Tbl_Lotes().Find(
				FilterData.JsonPropEqual("Datos_Producto", "Marca", detail.Lote.Datos_Producto.Marca, "varchar"),
				FilterData.JsonPropEqual("Datos_Producto", "Modelo", detail.Lote.Datos_Producto.Modelo, "varchar"),
				FilterData.GreaterEqual("Cantidad_Existente", detail.Cantidad)
			);
			if (lote) {
				IsAllArticulosRemplazados = true;
				nuevosDetalles.push(new Detalle_Factura({
					Lote: lote,
					Cantidad: detail.Cantidad,
					Precio_Venta: lote.EtiquetaLote.Precio_venta_Contado_dolares,
					Total:  lote.EtiquetaLote.Precio_venta_Contado_dolares *  detail.Cantidad,
					isRemovable: false,
					isEditable: false
				}));
			} else {
				IsAllArticulosRemplazados = false;
				//nuevosDetalles.push(new Detalle_Factura(detail))
			}
		}



		const newVentasComponent = new VentasComponent({
			Entity: nuevaVenta,
			IsReturn: true,
			IsActiveCredit: false,
			ReturnData: {
				IsDevolucion: true,
				IsAllArticulosRemplazados: IsAllArticulosRemplazados,
				MaxAmount: montoDisponible,
				MinAmount: montoDisponible,
				ArticulosRemplazados: multiSelectTable.selectedItems
			}, saveAction: async (/**@type {Tbl_Factura} */ factura) => {
				new ReturnTransaction({
					// @ts-ignore
					Observaciones: MotivoInput.value,
					MinAmount: montoDisponible,
					ArticulosRemplazados: multiSelectTable.selectedItems,
					NuevaFactura: factura,
					Numero_Contrato: facturaBuscada.Datos_Financiamiento?.Numero_Contrato
				}).Save();
			}
		});
		//console.log(newVentasComponent);
		this.Manager.NavigateFunction("ActasAnulacionView" + acta.Id_Acta_Entrega, newVentasComponent);
		return true;
	}

	/**
	* @param {Tbl_Acta_Entrega} Acta
	*/
	PepareAnulacionActa(Acta, Articulos) {
		const modal = new WModalForm({
			//EditObject: Transaction,
			title: "SELECCIONAR ARTICULOS",
			EditObject: {
				Articulos: undefined,
			},
			ObjectOptions: {
				SaveFunction: async (/**@type {Tbl_Transaccion}*/ editObject) => {
					//editObject.Id_Transaccion = Acta.Id_Transaccion;
					this.append(ModalVericateAction(async () => {

					}, "Esta seguro que desea dar de baja esta existencia?"));
				}
			}
		});
		this.append(modal);
	}

	/**
	 * @param {Tbl_Acta_Entrega} Acta
	 */
	AnularActa(Acta) {
		const modal = new WModalForm({
			//EditObject: Transaction,
			title: "BAJA DE EXISTENCIA",
			ObjectOptions: {
				SaveFunction: async (/**@type {Tbl_Transaccion}*/ editObject) => {
					//editObject.Id_Transaccion = Acta.Id_Transaccion;
					this.append(ModalVericateAction(async () => {

					}, "Esta seguro que desea dar de baja esta existencia?"));
				}
			}
		});
		this.append(modal);
	}



	CustomStyle = css`       
		.OptionContainer{
			justify-content: space-between;
			align-items: center;
			& .search-box {
				width: 400px;
			}
		}
		.motivo-input {
			display: block;
			width: 100%;
			height: 60px;
		}
		
	`
}
customElements.define('w-main-actas-entregas-manager', ActasEntregasView);
export { ActasEntregasView };



