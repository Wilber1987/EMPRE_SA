//@ts-check
import { WRender, ComponentsManager, html } from "../WDevCore/WModules/WComponentsTools.js";
import { StylesControlsV2, StylesControlsV3, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { Catalogo_Cambio_Divisa_ModelComponent } from "../FrontModel/DBODataBaseModel.js"
import { WModalForm } from "../WDevCore/WComponents/WModalForm.js";
import { css } from "../WDevCore/WModules/WStyledRender.js";
import { WAjaxTools } from "../WDevCore/WModules/WAjaxTools.js";
import { ModalMessage } from "../WDevCore/WComponents/ModalMessage.js";
import { ModalVericateAction } from "../WDevCore/WComponents/ModalVericateAction.js";
import { WPrintExportToolBar } from "../WDevCore/WComponents/WPrintExportToolBar.mjs";
import { Transaccion_Recibos } from "../FrontModel/Recibos.js";
import { Transaccion_Recibos_ModelComponent } from "../FrontModel/Transaction_Recibos.js";
import { DirectionEnum, EstadoOrden, MonedaEnum, Orden_Movimiento, TipoMovimiento } from "../Caja/Model/Order_Movimiento.js";
import { FilterData, OrderData } from "../WDevCore/WModules/CommonModel.js";
import { Money } from "../WDevCore/WModules/Types/Money.js";
import { WOrderProcessorComponent } from "../Caja/WOrderProcessorComponent.js";
import { Denominacion_Catalogo } from "../Caja/Model/Denominacion_Catalogo.js";
import { CuentasAnularCompras, CuentasCompras } from "../FrontModel/CuentasCompras.js";


class RecibosManagerView extends HTMLElement {

	constructor() {
		super();
		this.Draw();
	}
	Draw = async () => {
		const tasa = await new Catalogo_Cambio_Divisa_ModelComponent().Get();
		this.OptionContainer = WRender.Create({ className: "OptionContainer" });
		this.TabContainer = html`<div id="TabContainer" class="TabContainer"></div>`;
		const id_Recibo = new URLSearchParams(window.location.search).get('id_Recibo');
		if (id_Recibo != null) {
			await this.printRecibo(id_Recibo, tasa);
		}
		this.MainComponent = new WTableComponent({
			EntityModel: new Transaccion_Recibos_ModelComponent({ Factura_contrato: {} }),
			ModelObject: new Transaccion_Recibos_ModelComponent(),
			Options: {
				Filter: true,
				FilterDisplay: true,
				UserActions: [
					{
						name: "Anular",
						rendered: (/** @type { Transaccion_Recibos } */ recibo) => {
							// @ts-ignore
							return recibo.estado != "ANULADO"
						},
						action: (/** @type { Transaccion_Recibos } */  recibo) => {
							recibo.Motivo_Anulacion = null
							const modal = new WModalForm({
								ModelObject: {
									motivo_anulacion: { type: "TEXTAREA" }
								}, EditObject: recibo,
								title: "ANULACIÓN",
								ObjectOptions: {
									SaveFunction: async () => {
										this.AnularRecibo(recibo, modal, tasa)
									}
								}
							});
							this.append(modal);
						}
					}, {
						name: "Imprimir", action: async (/** @type { Transaccion_Recibos } */  recibo) => {
							const id_factura = recibo.id_factura
							if (recibo.estado == "ANULADO") {
								alert("RECIBO ANULADO")
								return;
							}
							await this.printRecibo(id_factura, tasa, recibo);
						}
					}
				]
			}
		})
		this.TabContainer.append(this.MainComponent)
		this.SetOption();
		this.append(
			StylesControlsV2.cloneNode(true),
			StyleScrolls.cloneNode(true),
			StylesControlsV3.cloneNode(true),
			this.OptionContainer,
			this.TabContainer
		);
	}
	SetOption() {
		this.OptionContainer?.append(WRender.Create({
			tagName: 'button', className: 'Block-Secundary', innerText: 'Nuevo Recibo',
			onclick: () => {
				window.location.href = "/PagesViews/Gestion_Recibos";
			}
		}))
	}
	/**
	 * @param {Transaccion_Recibos} recibo
	 * @param {WModalForm} modal
	 * @param {any[]} tasa
	 */
	async AnularRecibo(recibo, modal, tasa) {
		if (recibo.estado == "ANULADO") {
			this.append(ModalMessage("Recibo ya esta anulado"));
			return;
		}
		const order = await new Orden_Movimiento().Find(
			FilterData.Equal("id_documento_origen", recibo?.id_factura),
			FilterData.Equal("tipo_documento_origen", "RECIBO"),
			FilterData.Equal("direccion", DirectionEnum.INGRESO),
			FilterData.Equal("estado", EstadoOrden.EJECUTADA)
		);
		console.log(order);


		const MONEDA_ENTRADA = recibo.Moneda;
		const Monto = recibo.Moneda == MonedaEnum.DOLARES ? new Money(recibo.total) : new Money(recibo.total_cordobas);

		/**@type {Array<Denominacion_Catalogo>} */
		const denoms = await new Denominacion_Catalogo({ OrderData: [OrderData.Desc("valor")] }).Get();

		const cuentasCompras = await new CuentasAnularCompras().Find();

		const newOrder = new Orden_Movimiento({
			descripcion: ``,
			direccion: DirectionEnum.EGRESO,
			concepto: "Pago de cuota del contrato #" + recibo.numero_contrato,
			monto: Monto.Round(),
			tasa_cambio: tasa[0].Valor_de_venta,
			tasa_cambio_compra: tasa[0].Valor_de_compra,
			moneda: MONEDA_ENTRADA,
			Tipo_Movimiento: TipoMovimiento.DESEMBOLSO_POR_ANULACION_DE_PAGO_DE_RECIBO,
			requiere_aprobacion: false,
			estado: EstadoOrden.PENDIENTE,
			tipo_documento_origen: "RECIBO",
			Id_cuenta_destino: cuentasCompras.Id_cuenta_destino,
			Id_cuenta_origen: cuentasCompras.Id_cuenta_origen
		})
		recibo.OrdenData = newOrder;

		const orderProcessor = new WOrderProcessorComponent({
			entity: newOrder,
			denominaciones: denoms ?? [],
			liquidationMode: newOrder.direccion ?? DirectionEnum.INGRESO,
			isFlexibleLiquidationModeActive: true,
			SaveFunction: () => {
				document.body.append(ModalVericateAction(() => {
					ModalVericateAction(async () => {
						// const response =
						// 	await WAjaxTools.PostRequest("../api/ApiRecibos/anularRecibo",
						// 		{
						// 			id_recibo: recibo.id_factura,
						// 			tasa_cambio: tasa[0].Valor_de_venta,
						// 			tasa_cambio_compra: tasa[0].Valor_de_compra,
						// 			Motivo_Anulacion: recibo.Motivo_Anulacion
						// 		});

						// this.append(ModalMessage(response.message, undefined, true));
						// modal.close();
					}, "Esta seguro que desea anular este contrato")
				}, "¿Desea guardar el recibo?"))
			}
		})
		const orderProcessorModal = new WModalForm({
			ObjectModal: orderProcessor,
			FullScreen: true
		})

		document.body.append(orderProcessorModal);
	}


	/**
	 * @param {string | number | null} id_factura
	 * @param {any[]} tasa
	 * @param {Transaccion_Recibos | undefined} [factura]
	 */
	async printRecibo(id_factura, tasa, factura) {
		const response = await WAjaxTools.PostRequest("../api/ApiRecibos/printRecibo",
			{ id_recibo: id_factura, tasa_cambio: tasa[0].Valor_de_compra });
		if (response.status == 200 && response.body.documents != null && response.body.documents != undefined) {
			/**
			 * @type {HTMLElement[]}
			 */
			const docs = [];
			response.body.documents.forEach((/** @type {{ body: any; type: string; }} */ element) => {
				const objFra = WRender.Create({
					// @ts-ignore
					tagName: "iframe", srcdoc: element.body,
					style: {
						minHeight: "700px",
						width: element.type == "REESTRUCTURE_TABLE" || element.type == "RECIBO_QUINCENAL" ? "95%" : "320px",
						maxWidth: element.type == "REESTRUCTURE_TABLE" || element.type == "RECIBO_QUINCENAL" ? "1100px" : "320px"
					}
				})
				docs.push(WRender.Create({
					className: "doc-container", children: [
						this.PrintIconStyle(),
						new WPrintExportToolBar({
							PrintAction: (toolBar) => {
								toolBar.Print(html`<div class="contract-response">
									<div class="recibo">${element.body}</div>
								</div>`)
							}
						}),
						// @ts-ignore
						WRender.Create({ className: "print-container-iframe", children: objFra })]
				}));
			});

			this.append(new WModalForm({
				ObjectModal: WRender.Create({
					class: "print-container", children: docs
				})
			}))
		} else if (response.status == 200 && response.message != null) {
			this.append(ModalMessage(response.message))
		}
	}


	PrintIconStyle() {
		return css`
		   .print {
			width: 30px;
			height: 30px;
			padding: 5px;
			border: solid 1px #bdbcbc; 
			border-radius: 5px;
			cursor: pointer;        
		} .print-container {
			width: 98%;   
			margin: auto;          
		} .print-container .doc-container{
			width: 100%; 
			display: flex;
			justify-content: flex-end;
			padding: 5px;
			border-radius: 5px;
			border: solid 1px #bdbcbc; 
			margin-bottom: 5px;
			flex-direction: column;
			box-sizing: border-box;
		}.print-container-iframe {
			background-color: #bdbcbc;  
		}  .print-container iframe {            
			margin: 10px auto;
			display: block;
			background-color: #fff;
			border: none;
		}
		 `;
	}
}
customElements.define('w-datos_configuracion', RecibosManagerView);
// @ts-ignore
window.addEventListener('load', async () => { MainBody.append(new RecibosManagerView()) })
