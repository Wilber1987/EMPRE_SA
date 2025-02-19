//@ts-check

import { DateTime } from "../../../WDevCore/WModules/Types/DateTime.js";
import { html, WRender } from "../../../WDevCore/WModules/WComponentsTools.js";
import { WOrtograficValidation } from "../../../WDevCore/WModules/WOrtograficValidation.js";
import { Detalle_Compra } from "../../FrontModel/Detalle_Compra.js";
import { Detalle_Factura } from "../../FrontModel/Detalle_Factura.js";
import { DocumentsData } from "../../FrontModel/DocumentsData.js";
import { Tbl_Compra } from "../../FrontModel/Tbl_Compra.js";
import { Tbl_Factura } from "../../FrontModel/Tbl_Factura.js";

export class FacturasBuilder {
    /**
     * @param { Tbl_Factura } factura
     * @param {DocumentsData} documentsData
     * @returns {HTMLElement}
     */
    static BuildFactura(factura, documentsData) {
        return FacturasBuilder.BuildFacturaVenta(documentsData, factura);
    }
    /**
     * @param {{factura: Tbl_Factura, Contract: String}} response
     * @param {DocumentsData} documentsData
     * @returns {HTMLElement}
     */
    static BuildFacturaRecibo(response, documentsData) {
        if (response.factura.Tipo == "APARTADO_MENSUAL" || response.factura.Tipo == "APARTADO_QUINCENAL") {
            return FacturasBuilder.BuildFacturaApartado(documentsData, response);
        }
        return FacturasBuilder.BuildFacturaVenta(documentsData, response.factura);
    }
    static BuildFacturaApartado(documentsData, response) {
        return html`<div style="font-family: Arial, sans-serif;  padding: 2px 5px; width: 210mm;">
            <style> 
                .factura-container {
                    border: 1px solid #ccc;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 20px;
                }
                * {
                    font-size: 11px;
                    & .header-table {
                        font-size: 16px !important;
                    }                    
                }
                td {
                    color: #149bf5;
                }
            </style>
            <div style="margin-top: 5px; display: flex; gap: 30px; height: 100px">
                ${documentsData.Header}
                <div style="text-align: center; margin-bottom: 5px; width: 300px">
                    <p>RUC: ${localStorage.getItem("RUC")}</p>
                    <p style="width:100%; display: flex">
                        <label style="border: 1px solid #ccc; flex: 1"> Recibo No.</label> 
                        <label style="border: 1px solid #ccc; flex: 1">${response.factura.Id_Factura}</label>
                    </p>
                    <p>${response.factura.Codigo_venta}</p>
                </div>
            </div>
            <h1 style="text-align: center; color: #2f71ff; font-size: 20px">SISTEMA DE APARTADO</h1>
            <div style="margin-top: 5px; display: flex; gap: 10px">
                <div style="flex:2">
                    <p><strong>Nombre:</strong> ${response.factura.Datos.Nombre_Cliente}</p>
                    <p><strong>Dirección:</strong> ${response.factura.Datos.Direccion_Cliente}</p>                
                    <p><strong>Recibí de:</strong> ${response.factura.Datos.Nombre_Vendedor}</p>                    
                </div>
                <div style="flex:1">
                    <table style="width: 100%; border-collapse: collapse; margin-top: 5px;">
                        <tr>
                            <td style="border: 1px solid #ccc; padding: 2px 5px;">Día</td>
                            <td style="border: 1px solid #ccc; padding: 2px 5px;">Mes</td>
                            <td style="border: 1px solid #ccc; padding: 2px 5px;">Año</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #ccc; padding: 2px 5px;">${new DateTime(response.factura.Fecha).getDay() + 1}</td>
                            <td style="border: 1px solid #ccc; padding: 2px 5px;">${new DateTime(response.factura.Fecha).getMonth() + 1}</td>
                            <td style="border: 1px solid #ccc; padding: 2px 5px;">${new DateTime(response.factura.Fecha).getFullYear()}</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #ccc; padding: 2px 5px;">Hora:</td>
                            <td style="border: 1px solid #ccc; padding: 2px 5px;  text-align: right;" colspan="2">${new DateTime(response.factura.Fecha).GetFullHour() + 1}</td>
                        </tr>
                    </table>
                    <p style="border: 1px solid #ccc; padding: 2px 5px;"> <strong>Teléfono cliente:</strong> ${response.factura.Datos.Direccion_Cliente}</p>
                </div>
            </div>
            <div style="margin-top: 5px;">
                <strong>Observaciones:</strong> 
                <p>${response.factura.Observaciones || 'Ninguna'}</p>
            </div>
            </table>
           
            <div style="margin-top: 5px; display: flex; gap: 10px; justify-content: space-between;">   
                <div style="margin-top: 5px; display: flex; gap: 10px">
                    <div style="margin: 5px; border: #ccc solid 1px; flex:1; text-align: center">
                        <div style="height: 30px;"></div>
                        <hr/>
                        <p>Autorizado por Administración y/o vendedor</p>
                    </div>
                    <div style="margin: 5px; border: #ccc solid 1px; flex:1; text-align: center">
                        <div style="height: 30px;"></div>
                        <hr/>
                        <p>Recibi Conforme: <br/> por Administración y/o vendedor</p>
                    </div>
                </div>
                <div style="text-align: right; margin-top: 5px;">
                    <p><strong>Sub Total:</strong> ${WOrtograficValidation.es(response.factura.Moneda ?? "DOLARES")} ${response.factura.Sub_Total.toFixed(2)}</p>
                   
                    <p><strong>Total a pagar:</strong> ${WOrtograficValidation.es(response.factura.Moneda ?? "DOLARES")} ${response.factura.Total.toFixed(2)}</p>
                    <p><strong>Total a pagar:</strong> ${WOrtograficValidation.es(response.factura.Moneda ?? "DOLARES")} ${response.factura.Total.toFixed(2)}</p>
                </div>
            </div>
            <p style="text-align: center; margin-top: 32px; font-size: 12px;">Nota: Este recibo es válido unicamente con las firmas autorizadas y sello de EMPRESA.</p>
        </div>`;
    }

    static BuildFacturaVenta(documentsData, factura) {
        return html`<div style="font-family: Arial, sans-serif;  padding: 2px 5px; width: 210mm;">
            <style> 
                .factura-container {
                    border: 1px solid #ccc;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 20px;
                }
                * {
                    font-size: 11px;
                    & .header-table {
                        font-size: 16px !important;
                    }                    
                }
                td {
                    color: #149bf5;
                }
            </style>
            <div style="margin-top: 5px; display: flex; gap: 30px; height: 100px">
                ${documentsData.Header}
                <div style="text-align: center; margin-bottom: 5px; width: 300px">
                    <p>RUC: ${localStorage.getItem("RUC")}</p>
                    <p style="width:100%; display: flex">
                        <label style="border: 1px solid #ccc; flex: 1"> Factura No.</label> 
                        <label style="border: 1px solid #ccc; flex: 1">${factura.Id_Factura}</label>
                    </p>
                    <p>${factura.Codigo_venta}</p>
                </div>
            </div>
            <h1 style="text-align: center; color: #2f71ff; font-size: 20px">FACTURA</h1>
            <div style="margin-top: 5px; display: flex; gap: 10px">
                <div style="flex:2">
                    <p><strong>Nombre:</strong> ${factura.Datos.Nombre_Cliente}</p>
                    <p><strong>Dirección:</strong> ${factura.Datos.Direccion_Cliente}</p>                
                    <p><strong>Vendedor:</strong> ${factura.Datos.Nombre_Vendedor}</p>                    
                </div>
                <div style="flex:1">
                    <table style="width: 100%; border-collapse: collapse; margin-top: 5px;">
                        <tr>
                            <td style="border: 1px solid #ccc; padding: 2px 5px;">Día</td>
                            <td style="border: 1px solid #ccc; padding: 2px 5px;">Mes</td>
                            <td style="border: 1px solid #ccc; padding: 2px 5px;">Año</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #ccc; padding: 2px 5px;">${new DateTime(factura.Fecha).getDay() + 1}</td>
                            <td style="border: 1px solid #ccc; padding: 2px 5px;">${new DateTime(factura.Fecha).getMonth() + 1}</td>
                            <td style="border: 1px solid #ccc; padding: 2px 5px;">${new DateTime(factura.Fecha).getFullYear()}</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #ccc; padding: 2px 5px;">Hora:</td>
                            <td style="border: 1px solid #ccc; padding: 2px 5px;  text-align: right;" colspan="2">${new DateTime(factura.Fecha).GetFullHour() + 1}</td>
                        </tr>
                    </table>
                    <p style="border: 1px solid #ccc; padding: 2px 5px;"> <strong>Teléfono cliente:</strong> ${factura.Datos.Direccion_Cliente}</p>
                </div>
            </div>
            <div style="margin-top: 5px;">
                <strong>Observaciones:</strong> 
                <p>${factura.Observaciones || 'Ninguna'}</p>
            </div>
            </table>
            ${this.CreateTableDetail(factura)}
            <div style="margin-top: 5px; display: flex; gap: 10px; justify-content: space-between;">   
                <div style="margin-top: 5px; display: flex; gap: 10px">
                    <div style="margin: 5px; border: #ccc solid 1px; flex:1; text-align: center">
                        <div style="height: 30px;"></div>
                        <hr/>
                        <p>Autorizado por Administración y/o vendedor</p>
                    </div>
                    <div style="margin: 5px; border: #ccc solid 1px; flex:1; text-align: center">
                        <div style="height: 30px;"></div>
                        <hr/>
                        <p>Recibi Conforme: <br/> por Administración y/o vendedor</p>
                    </div>
                </div>
                <div style="text-align: right; margin-top: 5px;">
                    <p><strong>Sub Total:</strong> ${WOrtograficValidation.es(factura.Moneda ?? "DOLARES")} ${factura.Sub_Total.toFixed(2)}</p>
                    <!-- <p><strong>IVA:</strong> ${WOrtograficValidation.es(factura.Moneda ?? "DOLARES")} ${factura.Iva.toFixed(2)}</p> -->
                    <p><strong>Total a pagar:</strong> ${WOrtograficValidation.es(factura.Moneda ?? "DOLARES")} ${factura.Total.toFixed(2)}</p>
                    <p><strong>Total a pagar:</strong> ${WOrtograficValidation.es(factura.Moneda ?? "DOLARES")} ${factura.Total.toFixed(2)}</p>
                </div>
            </div>
            <p style="text-align: center; margin-top: 32px; font-size: 14px;">NO SE ACEPTAN DEVOLUCIONES.</p>
            <p style="text-align: center; margin-top: 32px; font-size: 12px;">Nota: Este recibo es válido unicamente con las firmas autorizadas y sello de EMPRESA.</p>
        </div>`;
    }

    /**
     * @param {DocumentsData} documentsData
     * @param {Tbl_Compra} factura
     * @returns {HTMLElement}
     */
    static BuildFacturaCompra(documentsData, factura) {
        return html`<div style="font-family: Arial, sans-serif;  padding: 2px 5px; width: 210mm;">
            <style> 
                .factura-container {
                    border: 1px solid #ccc;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 20px;
                }
                * {
                    font-size: 11px;
                    & .header-table {
                        font-size: 16px !important;
                    }                    
                }
                td {
                    color: #149bf5;
                }
                .total-container p, .marcogris {
                    background-color: #eee;
                    border: solid 1px #cfcdcd;
                    margin: 0;
                    padding: 10px 5px;
                }
                .marco {
                    border: solid 1px #cfcdcd;
                    margin: 0;
                    padding: 10px 5px;
                }
            </style>
            <div style="margin-top: 5px; display: flex; gap: 30px; height: 100px">
                ${documentsData.Header}
                <div style="text-align: center; margin-bottom: 5px; width: 300px">
                    <p>RUC: ${localStorage.getItem("RUC")}</p>
                    <p style="width:100%; display: flex">
                        <label style="border: 1px solid #ccc; flex: 1"> Compraventa No.</label> 
                        <label style="border: 1px solid #ccc; flex: 1">${factura.Id_Compra}</label>
                    </p>
                </div>
            </div>
            <h1 style="text-align: center; color: #2f71ff; font-size: 20px">COMPRAVENTA</h1>
            <div style="display: flex; gap: 10px" class="marco">
                <div style="flex:2">
                    <p><strong>Nombre:</strong> ${factura.Cat_Proveedor.Nombre}</p>
                    <p><strong>Cédula:</strong> ${factura.Cat_Proveedor.Identificacion}</p>
                    <p><strong>Comprador:</strong> ${factura.Datos_Compra.Nombre_Comprador}</p>                    
                </div>
                <div style="flex:1">
                    <table style="width: 100%; border-collapse: collapse; margin-top: 5px;">
                        <tr>
                            <td style="border: 1px solid #ccc; padding: 2px 5px;">Hora:</td>
                            <td style="border: 1px solid #ccc; padding: 2px 5px;  text-align: right;" colspan="2">${new DateTime(factura.Fecha).GetFullHour() + 1}</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #ccc; padding: 2px 5px;">Día</td>
                            <td style="border: 1px solid #ccc; padding: 2px 5px;">Mes</td>
                            <td style="border: 1px solid #ccc; padding: 2px 5px;">Año</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #ccc; padding: 2px 5px;">${new DateTime(factura.Fecha).getDay() + 1}</td>
                            <td style="border: 1px solid #ccc; padding: 2px 5px;">${new DateTime(factura.Fecha).getMonth() + 1}</td>
                            <td style="border: 1px solid #ccc; padding: 2px 5px;">${new DateTime(factura.Fecha).getFullYear()}</td>
                        </tr>                       
                    </table>                   
                </div>
            </div>                
            ${this.CreateTableDetailCompra(factura)}
            <div class="marcogris">
                <strong>Observaciones:</strong> 
                <p>${factura.Observaciones || 'Ninguna'}</p>
            </div>     
            <div class="marco" style="display: flex; gap: 10px; justify-content: space-between;">   
                
                <div style="margin-top: 5px; display: flex; gap: 10px; flex-direction:column; flex: 3">
                    <div style="margin-top: 5px; display: flex; gap: 10px">
                        <p>Sirva mi firma en este documento como declaración de dominio y dueño titular de los bienes aqui descritos, por no tener
                            factura, pero por poseción en mis manos me declaró dueño absoluto, como indica la ley 936 en su articulo 11.
                        </p>
                    </div>
                    <div style="margin-top: 5px; display: flex; gap: 10px">
                        <div style="margin: 5px; border: #ccc solid 1px; flex:1; text-align: center">
                            <div style="height: 30px;"></div>
                            <hr/>
                            <p>Autorizado por Administración y/o comprador</p>
                        </div>
                        <div style="margin: 5px; border: #ccc solid 1px; flex:1; text-align: center">
                            <div style="height: 30px;"></div>
                            <hr/>
                            <p>Entregué Conforme por vendedor</p>
                        </div>
                    </div>                    
                </div>
                <div style="text-align: right; margin-top: 5px; flex: 1" class="total-container">               
                    <p><strong>Total C$:</strong> ${(factura.Total * factura.Tasa_Cambio).toFixed(2)}</p>
                    <p><strong>Total $:</strong> ${factura.Total.toFixed(2)}</p>
                </div>
            </div>
            <p style="text-align: center; font-size: 14px;">NO SE ACEPTAN DEVOLUCIONES.</p>
            <p style="text-align: center; font-size: 12px;">Nota: Este recibo es válido unicamente con las firmas autorizadas y sello de EMPRESA.</p>
        </div>`;
    }


    static CreateTableDetail(factura) {
        return WRender.Create({
            tagName: "table", style: "width: 100%; border-collapse: collapse; margin-top: 5px;", children: [
                WRender.Create({
                    tagName: "thead", children: [
                        { tagName: "th", style: "border: 1px solid #ccc; padding: 8px;", innerHTML: "Descripción" },
                        { tagName: "th", style: "border: 1px solid #ccc; padding: 8px;", innerHTML: "Marca" },
                        { tagName: "th", style: "border: 1px solid #ccc; padding: 8px;", innerHTML: "Model" },
                        { tagName: "th", style: "border: 1px solid #ccc; padding: 8px;", innerHTML: "Serie" },
                        { tagName: "th", style: "border: 1px solid #ccc; padding: 8px; text-align: right;", innerHTML: `Sub Total ${WOrtograficValidation.es(factura.Moneda ?? "DOLARES")}` },
                    ]
                }),
                { tagName: "tbody", children: this.BuildFacturaDetail(factura) }
            ]
        });
    }

    static BuildFacturaDetail(factura) {
        return factura.Detalle_Factura.map((/**@type {Detalle_Factura} */ detalle) => WRender.Create({
            tagName: "tr", children: [
                WRender.Create({
                    tagName: "td", style: "border: 1px solid #ccc; padding: 8px;",
                    innerText: `${detalle.Lote?.Datos_Producto?.Descripcion || 'N/A'}`
                }),
                WRender.Create({
                    tagName: "td", style: "border: 1px solid #ccc; padding: 8px;",
                    innerText: `${detalle.Lote?.Datos_Producto?.Marca  ?? "-"}`
                }),
                WRender.Create({
                    tagName: "td", style: "border: 1px solid #ccc; padding: 8px;",
                    innerText: `${detalle.Lote?.Datos_Producto?.Modelo ?? "-"}`
                }),
                WRender.Create({
                    tagName: "td", style: "border: 1px solid #ccc; padding: 8px;",
                    innerText: `${detalle.Lote?.Datos_Producto?.Serie  ?? "-"}`
                }),
                WRender.Create({
                    tagName: "td", style: "border: 1px solid #ccc; padding: 8px;",
                    innerText: `${WOrtograficValidation.es(factura.Moneda ?? "DOLARES")} ${detalle.Total.toFixed(2)}`
                })
            ]
        }));
    }
    static CreateTableDetailCompra(factura) {
        return WRender.Create({
            tagName: "table", style: "width: 100%; border-collapse: collapse;", children: [
                WRender.Create({
                    tagName: "thead", children: [
                        { tagName: "th", style: "border: 1px solid #ccc; padding: 8px;", innerHTML: "Descripción" },
                        { tagName: "th", style: "border: 1px solid #ccc; padding: 8px;", innerHTML: "Marca" },
                        { tagName: "th", style: "border: 1px solid #ccc; padding: 8px;", innerHTML: "Model" },
                        { tagName: "th", style: "border: 1px solid #ccc; padding: 8px;", innerHTML: "Serie" },
                        { tagName: "th", style: "border: 1px solid #ccc; padding: 8px; text-align: right;", innerHTML: `Sub Total ${WOrtograficValidation.es(factura.Moneda ?? "DOLARES")}` },
                    ]
                }),
                { tagName: "tbody", children: this.BuildFacturaDetailCompra(factura) }
            ]
        });
    }

    static BuildFacturaDetailCompra(/**@type {Tbl_Compra} */ factura) {
        return factura.Detalle_Compra.map((/**@type {Detalle_Compra} */ detalle) => WRender.Create({
            tagName: "tr", children: [
                WRender.Create({
                    tagName: "td", style: "border: 1px solid #ccc; padding: 8px;",
                    innerText: `${detalle?.Cat_Producto.Descripcion || 'N/A'}`
                }),
                WRender.Create({
                    tagName: "td", style: "border: 1px solid #ccc; padding: 8px;",
                    innerText: `${detalle?.Cat_Producto?.Cat_Marca?.Descripcion ?? "-"}`
                }),
                WRender.Create({
                    tagName: "td", style: "border: 1px solid #ccc; padding: 8px;",
                    innerText: `${detalle?.Datos_Producto_Lote?.Modelo ?? "-" }`
                }),
                WRender.Create({
                    tagName: "td", style: "border: 1px solid #ccc; padding: 8px;",
                    innerText: `${detalle?.Datos_Producto_Lote?.Serie ?? "-"}`
                }),
                WRender.Create({
                    tagName: "td", style: "border: 1px solid #ccc; padding: 8px;",
                    innerText: `${WOrtograficValidation.es(factura.Moneda ?? "DOLARES")} ${detalle.Total.toFixed(2)}`
                })
            ]
        }));
    }
}