//@ts-check
import { WRender, ComponentsManager, html } from "../WDevCore/WModules/WComponentsTools.js";
import { StylesControlsV2, StylesControlsV3, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { Transaccion_Recibos_ModelComponent, Catalogo_Cambio_Divisa_ModelComponent } from "../FrontModel/DBODataBaseModel.js"
import { WModalForm } from "../WDevCore/WComponents/WModalForm.js";
import { css } from "../WDevCore/WModules/WStyledRender.js";
import { WAjaxTools } from "../WDevCore/WModules/WAjaxTools.js";
import { ModalMessage } from "../WDevCore/WComponents/ModalMessage.js";
import { ModalVericateAction } from "../WDevCore/WComponents/ModalVericateAction.js";
import { WPrintExportToolBar } from "../WDevCore/WComponents/WPrintExportToolBar.mjs";
import { Transaccion_Recibos } from "../FrontModel/Recibos.js";
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
										if (recibo.estado == "ANULADO") {
											this.append(ModalMessage("Recibo ya esta anulado"));
											return;
										}
										this.append(ModalVericateAction(async () => {
											const response =
												await WAjaxTools.PostRequest("../api/ApiRecibos/anularRecibo",
													{
														id_recibo: recibo.id_factura,
														tasa_cambio: tasa[0].Valor_de_venta,
														tasa_cambio_compra: tasa[0].Valor_de_compra,
														Motivo_Anulacion: recibo.Motivo_Anulacion
													});

											this.append(ModalMessage(response.message, undefined, true));
											modal.close();
										}, "Esta seguro que desea anular este contrato"))
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
