import { WRender, ComponentsManager, WAjaxTools } from "../WDevCore/WModules/WComponentsTools.js";
import { StylesControlsV2, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { Recibos, Transaccion_Factura, Catalogo_Cambio_Dolar} from "../FrontModel/DBODataBaseModel.js"
import { ModalMessege, ModalVericateAction } from "../WDevCore/WComponents/WForm.js";
class Ver_RecibosView extends HTMLElement {    
    constructor(props) {
        super();
        this.Draw();        
    }


    Draw = async () => {
        const tasa = await new Catalogo_Cambio_Dolar().Get();
        this.TabContainer = WRender.createElement({ type: 'div', props: { class: 'TabContainer', id: 'TabContainer' } })
        this.MainComponent = new WTableComponent({
            EntityModel: new Transaccion_Factura({ Factura_contrato: {}}),
            ModelObject: new Transaccion_Factura(), Dataset: [],
            Options: {                
                Show: true,
                Search: true,
                UserActions: [
                    {
                        name: "Anular", action: (factura) => {
                            this.append(ModalVericateAction(async () => {
                                const response =
                                    await WAjaxTools.PostRequest("../api/ApiRecibos/anularRecibo", {id_recibo : factura.id_factura, tasa_cambio: tasa[0].valor_de_compra});
                                
                                    this.append(ModalMessege(response.message));                              
                                
                                modal.close();
                            }, "¿Esta seguro que desea anular este recibo?"))
                        }, name: "Imprimir", action: (factura) => {
                            this.append(ModalVericateAction(async () => {
                                const response = await WAjaxTools.PostRequest("../api/ApiRecibos/printRecibo", {id_recibo : factura.id_factura, tasa_cambio: tasa[0].valor_de_compra});
                                
                                //this.append(ModalMessege(response.message));                                
                                const nuevaVentana = window.open();
                                nuevaVentana.document.write(response.message);

                                nuevaVentana.addEventListener('afterprint', function() {
                                    nuevaVentana.close();
                                });
                                
                                nuevaVentana.print();

                                
                            }, "¿Esta seguro que desea imprimir este recibo?"))
                        }
                    }
                ]               
            }
        })
        this.TabContainer.append(this.MainComponent)
        this.append(
            StylesControlsV2.cloneNode(true),
            StyleScrolls.cloneNode(true),
            this.TabContainer
        );
    }
    
}
customElements.define('w-datos_configuracion', Ver_RecibosView);
window.addEventListener('load', async () => { MainBody.append(new Ver_RecibosView()) })
