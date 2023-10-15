//@ts-check
import { WRender, ComponentsManager, WAjaxTools } from "../WDevCore/WModules/WComponentsTools.js";
import { StylesControlsV2, StylesControlsV3, StyleScrolls } from "../WDevCore/StyleModules/WStyleComponents.js"
import { WTableComponent } from "../WDevCore/WComponents/WTableComponent.js"
import { WFilterOptions } from "../WDevCore/WComponents/WFilterControls.js";
import { WModalForm } from "../WDevCore/WComponents/WModalForm.js";
import { ModalMessege, WForm } from "../WDevCore/WComponents/WForm.js";
import { Catalogo_Cambio_Dolar } from "../FrontModel/DBODataBaseModel.js";
import { WOrtograficValidation } from "../WDevCore/WModules/WOrtograficValidation.js";
import { css } from "../WDevCore/WModules/WStyledRender.js";
import { WAppNavigator } from "../WDevCore/WComponents/WAppNavigator.js";
import { Movimientos_Cuentas } from "../FrontModel/MovimientosCuentas.js";
class Gestion_movimientos_CuentasView extends HTMLElement {
    constructor(props) {
        super();
        this.Draw();
    }
    Draw = async () => {
        const model = new Movimientos_Cuentas();
        const dataset = await model.Get();

        const tasa = await new Catalogo_Cambio_Dolar().Get();
        model.tasa_cambio.defaultValue = tasa[0].valor_de_compra;
        model.tasa_cambio_compra.defaultValue = tasa[0].valor_de_venta;

        //model.tasa_cambio = await new Catalogo_Cambio_Dolar().Get();

        this.OptionContainer = WRender.Create({ className: "OptionContainer" });
        this.TabContainer = WRender.Create({ className: "TabContainer", id: 'TabContainer' });

        this.Manager = new ComponentsManager({ MainContainer: this.TabContainer, SPAManage: false });
        this.TableComponent = new WTableComponent({
            ModelObject: model, Dataset: dataset, Options: {
                //Add: true, UrlAdd: "guardarMovimiento",
                //Edit: true, UrlUpdate: "editarMovimiento",
                Search: true, //UrlSearch: "../application/controllers/Vehiculos_Controller.php/get" + Model.constructor.name,
                UserActions: [
                    {
                        name: "Anular movimiento", action: (movimiento) => {
                            const modelContrapartida = new Movimientos_Cuentas();
                            modelContrapartida.Catalogo_Cuentas_Destino.Dataset = [movimiento.Catalogo_Cuentas_Origen];
                            modelContrapartida.Catalogo_Cuentas_Origen.Dataset = [movimiento.Catalogo_Cuentas_Destino];
                            const MovimientoContrapartida = {
                                Catalogo_Cuentas_Origen: movimiento.Catalogo_Cuentas_Destino,
                                Catalogo_Cuentas_Destino: movimiento.Catalogo_Cuentas_Origen,
                                monto: movimiento.monto.toFixed(2).toString(),
                                tasa_cambio: movimiento.tasa_cambio.toFixed(2).toString(),
                                tasa_cambio_compra: movimiento.tasa_cambio_compra.toFixed(2).toString(),
                                total: movimiento.total.toFixed(2).toString(),
                                descripcion: movimiento.descripcion,
                                concepto: "Anulación de movimiento",
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
                                        console.log(param)
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

        this.FilterOptions = new WFilterOptions({
            Dataset: dataset,
            ModelObject: model,
            Display: true,
            FilterFunction: (DFilt) => {
                this.TableComponent?.DrawTable(DFilt);
            }
        });
        const ObjectOptions = {
            SaveFunction: (param, response) => {
                console.log(response)
                this.append(ModalMessege(response.message))
            }
        }


        this.MainComponent = WRender.Create({ className: "main-container", children: [/*this.FilterOptions*/, this.TableComponent] })

        //this.MainComponent.shadowRoot?.prepend(this.FilterOptions);

        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Secundary', innerText: 'Registrar Movimiento',
            onclick: () => {
                const modelExterno = new Movimientos_Cuentas();
                modelExterno.Catalogo_Cuentas_Destino.Dataset = model.Catalogo_Cuentas_Destino.Dataset.filter(x => x.tipo_cuenta == "PROPIA");
                modelExterno.Catalogo_Cuentas_Origen.Dataset = model.Catalogo_Cuentas_Origen.Dataset.filter(x => x.tipo_cuenta == "PROPIA");
                modelExterno.tasa_cambio = model.tasa_cambio;
                modelExterno.tasa_cambio_compra = model.tasa_cambio_compra;
                this.append(new WModalForm({ title: "Movimiento a cuenta", ModelObject: modelExterno, AutoSave: true, ObjectOptions: ObjectOptions }))
            }
        }))


        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Primary', innerText: 'Ingreso',
            onclick: () => {
                const modelExterno = new Movimientos_Cuentas();
                modelExterno.Catalogo_Cuentas_Origen.Dataset = model.Catalogo_Cuentas_Origen.Dataset.filter(x => x.tipo_cuenta != "PROPIA");
                modelExterno.Catalogo_Cuentas_Destino.Dataset = model.Catalogo_Cuentas_Destino.Dataset.filter(x => x.tipo_cuenta == "PROPIA");
                modelExterno.tasa_cambio = model.tasa_cambio;
                modelExterno.tasa_cambio_compra = model.tasa_cambio_compra;
                this.append(new WModalForm({ title: "Ingreso", ModelObject: modelExterno, AutoSave: true, ObjectOptions: this.ObjectOptionsModal  }))
            }
        }))

        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Tertiary', innerText: 'Egreso',
            onclick: () => {
                const modelExterno = new Movimientos_Cuentas();
                modelExterno.Catalogo_Cuentas_Origen.Dataset = model.Catalogo_Cuentas_Origen.Dataset.filter(x => x.tipo_cuenta == "PROPIA");
                modelExterno.Catalogo_Cuentas_Destino.Dataset = model.Catalogo_Cuentas_Destino.Dataset.filter(x => x.tipo_cuenta != "PROPIA");

                modelExterno.tasa_cambio = model.tasa_cambio;
                modelExterno.tasa_cambio_compra = model.tasa_cambio_compra;
                this.append(new WModalForm({ title: "Egreso", ModelObject: modelExterno, AutoSave: true, ObjectOptions: this.ObjectOptionsModal  }))
            }
        }))

        this.OptionContainer.append(WRender.Create({
            tagName: 'button', className: 'Block-Fourth', innerText: 'Realizar Pago',
            onclick: () => {
                const modelExterno = new Movimientos_Cuentas();
                modelExterno.Catalogo_Cuentas_Origen.Dataset = model.Catalogo_Cuentas_Origen.Dataset.filter(x => x.tipo_cuenta == "PROPIA");
                modelExterno.Catalogo_Cuentas_Destino.Dataset = model.Catalogo_Cuentas_Destino.Dataset.filter(x => x.tipo_cuenta == "PAGO");

                modelExterno.tasa_cambio = model.tasa_cambio;
                modelExterno.tasa_cambio_compra = model.tasa_cambio_compra;
                this.append(new WModalForm({ title: "Egreso", ModelObject: modelExterno, AutoSave: true, ObjectOptions: this.ObjectOptionsModal  }))
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
    /*Gestion_CuentasForm = new Gestion_CuentasForm();
    NewTransaction(Model) {
        this.Manager?.NavigateFunction("Gestion_CuentasForm", this.Gestion_CuentasForm)
    }*/

}
customElements.define('w-gestion_movimientos_cuentas', Gestion_movimientos_CuentasView);
// @ts-ignore
window.addEventListener('load', async () => { MainBody.append(new Gestion_movimientos_CuentasView()) })
