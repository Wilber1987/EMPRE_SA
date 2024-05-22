//@ts-check
import { Catalogo_Cambio_Divisa } from "../FrontModel/Catalogo_Cambio_Divisa.js";
import { Catalogo_Cambio_Divisa_ModelComponent, Catalogo_Cuentas } from "../FrontModel/DBODataBaseModel.js";
import { Movimientos_Cuentas } from "../FrontModel/MovimientosCuentas.js";
import { StylesControlsV2, StylesControlsV3, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js";
import { ModalMessege } from "../WDevCore/WComponents/WForm.js";
import { WModalForm } from "../WDevCore/WComponents/WModalForm.js";
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js";
import { ComponentsManager, WRender } from "../WDevCore/WModules/WComponentsTools.js";
class Gestion_movimientos_CuentasView extends HTMLElement {
    constructor(props) {
        super();
        this.Draw();
    }
    Draw = async () => {
        const model = new Movimientos_Cuentas();
        const dataset = await model.Get();

        const tasa = await new Catalogo_Cambio_Divisa_ModelComponent().Get();
        model.tasa_cambio.defaultValue = tasa[0].Valor_de_compra;
        /**@type {Catalogo_Cambio_Divisa} */
        const tasaActual = tasa[0];
        this.Cuentas = await new Catalogo_Cuentas().Get();
        this.OptionContainer = WRender.Create({ className: "OptionContainer" });
        this.TabContainer = WRender.Create({ className: "TabContainer", id: 'TabContainer' });

        this.Manager = new ComponentsManager({ MainContainer: this.TabContainer, SPAManage: false });
        this.TableComponent = new WTableComponent({
            ModelObject: model, Dataset: dataset, WSelectAddObject: false, Options: {
                Filter: true,

                //Add: true, UrlAdd: "guardarMovimiento",
                //Edit: true, UrlUpdate: "editarMovimiento",
                //Search: true, //UrlSearch: "../application/controllers/Vehiculos_Controller.php/get" + Model.constructor.name,
                UserActions: [
                    {
                        name: "Anular movimiento", rendered: (/** @type {Movimientos_Cuentas} */ movimiento) => {
                            //console.log(movimiento.is_transaction, movimiento.is_transaction == true);
                            // @ts-ignore
                            return movimiento.is_transaction == true;
                        },
                        action: (movimiento) => {
                            /*if (movimiento.is_transaction) {
                                return false;
                            }*/
                            const modelContrapartida = new Movimientos_Cuentas();
                            modelContrapartida.Catalogo_Cuentas_Destino.Dataset = [movimiento.Catalogo_Cuentas_Origen];
                            modelContrapartida.Catalogo_Cuentas_Origen.Dataset = [movimiento.Catalogo_Cuentas_Destino];
                            const MovimientoContrapartida = {
                                Catalogo_Cuentas_Origen: movimiento.Catalogo_Cuentas_Destino,
                                Catalogo_Cuentas_Destino: movimiento.Catalogo_Cuentas_Origen,
                                monto: movimiento.monto.toFixed(2).toString(),
                                tasa_cambio: movimiento.tasa_cambio.toFixed(2).toString(),
                                tasa_cambio_compra: movimiento.tasa_cambio_compra.toFixed(2).toString(),
                                total: movimiento.total?.toFixed(2).toString(),
                                descripcion: movimiento.descripcion,
                                concepto: "Anulación de movimiento",
                                is_transaction: movimiento.is_transaction
                            };
                            // @ts-ignore
                            modelContrapartida.Catalogo_Cuentas_Destino.ModelObject = undefined;
                            // @ts-ignore
                            modelContrapartida.Catalogo_Cuentas_Origen.ModelObject = undefined;
                            modelContrapartida.monto.disabled = true;
                            //modelContrapartida.total.disabled = true;
                            this.append(new WModalForm({
                                EditObject: MovimientoContrapartida,
                                ObjectOptions: {
                                    Url: "/Api/ApiEntityDBO/saveMovimientos_Cuentas", SaveFunction: (param) => {
                                        this.TableComponent.Dataset.push(param);
                                        this.TableComponent.DrawTable();
                                    }
                                },
                                title: "Anulación movimiento", ModelObject: modelContrapartida, AutoSave: true
                            }))
                        }
                    }
                ]
            }
        })
        const ObjectOptions = {
            SaveFunction: (param, response) => {
                console.log(response)
                this.append(ModalMessege(response.message))
            }
        }


        this.MainComponent = WRender.Create({ className: "main-container", children: [this.TableComponent] })

        //this.MainComponent.shadowRoot?.prepend(this.FilterOptions);

        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Secundary', innerText: 'Registrar movimiento interno',
            onclick: () => {
                const modelExterno = new Movimientos_Cuentas();
                modelExterno.tasa_cambio.defaultValue = tasa[0].Valor_de_venta;
                modelExterno.Catalogo_Cuentas_Origen.Dataset = this.Cuentas?.filter(x => x.tipo_cuenta == "PROPIA");
                modelExterno.Catalogo_Cuentas_Origen.action = (entity, form) => {
                    modelExterno.Catalogo_Cuentas_Destino.Dataset = this.Cuentas?.filter(x => x.tipo_cuenta == "PROPIA"
                        && x.id_cuentas != entity.Catalogo_Cuentas_Origen.id_cuentas);
                    entity.Fecha = new Date();
                    form.DrawComponent();
                }
                const cuentaPrimaria = this.Cuentas?.find(x => x.tipo_cuenta == "PROPIA"
                    && x.id_cuentas);

                modelExterno.Catalogo_Cuentas_Destino.Dataset = this.Cuentas?.filter(x => x.tipo_cuenta == "PROPIA"
                    && x.id_cuentas != cuentaPrimaria.id_cuentas);
                //modelExterno.tasa_cambio_compra = model.tasa_cambio_compra;
                this.append(new WModalForm({ title: "Movimiento a cuenta", ModelObject: modelExterno, AutoSave: true, ObjectOptions: ObjectOptions }))
            }
        }))


        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Primary', innerText: 'Registrar nuevo ingreso',
            onclick: () => {
                const modelExterno = new Movimientos_Cuentas();
                modelExterno.tasa_cambio.defaultValue = tasa[0].Valor_de_venta;
                console.log(modelExterno);
                modelExterno.Catalogo_Cuentas_Origen.Dataset = this.Cuentas?.filter(x => x.tipo_cuenta != "PROPIA");
                modelExterno.Catalogo_Cuentas_Destino.Dataset = this.Cuentas?.filter(x => x.tipo_cuenta == "PROPIA");
                
                //modelExterno.tasa_cambio_compra = model.tasa_cambio_compra;
                this.append(new WModalForm({ title: "Ingreso", ModelObject: modelExterno, AutoSave: true, ObjectOptions: this.ObjectOptionsModal }))
            }
        }))

        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Tertiary', innerText: 'Registrar nuevo egreso',
            onclick: () => {
                const modelExterno = new Movimientos_Cuentas();
                modelExterno.tasa_cambio.defaultValue = tasa[0].Valor_de_compra;
                modelExterno.Catalogo_Cuentas_Origen.Dataset = this.Cuentas?.filter(x => x.tipo_cuenta == "PROPIA");
                modelExterno.Catalogo_Cuentas_Destino.Dataset = this.Cuentas?.filter(x => x.tipo_cuenta != "PROPIA");

                // @ts-ignore
                //modelExterno.tasa_cambio = tasaActual.Valor_de_compra;
                this.append(new WModalForm({ title: "Egreso", ModelObject: modelExterno, AutoSave: true, ObjectOptions: this.ObjectOptionsModal }))
            }
        }))

        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Fourth', innerText: 'Realizar Pago',
            onclick: () => {
                const modelExterno = new Movimientos_Cuentas();
                modelExterno.tasa_cambio.defaultValue = tasa[0].Valor_de_compra;
                modelExterno.Catalogo_Cuentas_Origen.Dataset = this.Cuentas?.filter(x => x.tipo_cuenta == "PROPIA");
                modelExterno.Catalogo_Cuentas_Destino.Dataset = this.Cuentas?.filter(x => x.tipo_cuenta == "PAGO");
                // @ts-ignore
                modelExterno.tasa_cambio = tasaActual.Valor_de_venta;
                this.append(new WModalForm({ title: "Egreso", ModelObject: modelExterno, AutoSave: true, ObjectOptions: this.ObjectOptionsModal }))
            }
        }))
        this.Manager?.NavigateFunction("tabla", this.MainComponent)
        this.append(
            StylesControlsV2.cloneNode(true),
            StyleScrolls.cloneNode(true),
            StylesControlsV3.cloneNode(true),
            this.OptionContainer,
            this.TabContainer
        );
    }
    ObjectOptionsModal = {
        SaveFunction: async (profile, response) => {
            this.append(ModalMessege(response.message))
            if (response.status == 200) {
                const dataset = await new Movimientos_Cuentas().Get();
                this.TableComponent.Dataset = dataset;
                this.TableComponent.DrawTable();
            }
        }
    }

}
customElements.define('w-gestion_movimientos_cuentas', Gestion_movimientos_CuentasView);
// @ts-ignore
window.addEventListener('load', async () => { MainBody.append(new Gestion_movimientos_CuentasView()) })
