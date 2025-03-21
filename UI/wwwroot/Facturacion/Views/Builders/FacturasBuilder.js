//@ts-check

import { Transaction_Contratos } from "../../../FrontModel/Model.js";
import { DateTime } from "../../../WDevCore/WModules/Types/DateTime.js";
import { html, WRender } from "../../../WDevCore/WModules/WComponentsTools.js";
import { WOrtograficValidation } from "../../../WDevCore/WModules/WOrtograficValidation.js";
import { css } from "../../../WDevCore/WModules/WStyledRender.js";
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
     * @param {{factura: Tbl_Factura, Contract: String,  Recibo: String, Contrato: Transaction_Contratos}} response
     * @param {DocumentsData} documentsData
     * @returns {HTMLElement}
     */
    static BuildFacturaRecibo(response, documentsData) {
        if (response.factura.Tipo == "APARTADO_MENSUAL" || response.factura.Tipo == "APARTADO_QUINCENAL") {
            return FacturasBuilder.BuildFacturaApartado(documentsData, response);
        }
        return FacturasBuilder.BuildFacturaVenta(documentsData, response.factura);
    }
    /**
     * @param {{factura: Tbl_Factura, Contract: String, Recibo: String, Contrato: Transaction_Contratos}} response
     * @param {DocumentsData} documentsData
     * @returns {HTMLElement}
     */
    static BuildFacturaApartado(documentsData, response) {
        return html`<div style="font-family: Arial, sans-serif;" class="recibo">
            ${this.style.cloneNode(true)}
            ${response.Recibo}
        </div>`
        /*return html`<div style="font-family: Arial, sans-serif;" class="recibo">
            ${this.style.cloneNode(true)}
            <h2>${localStorage.getItem("NOMBRE_EMPRESA")}</h2>
            <p class="center">${localStorage.getItem("SUB_TITLE")}</p>
            <p class="center bold">${localStorage.getItem("RUC")}</p>
            <p class="center">${localStorage.getItem("INFO_TEL")}</p>            
            <h3>SISTEMA DE APARTADO</h3>
            <h4 class="center">${response.Contrato.estado == "CANCELADO" ? "Recibo De Cancelación" : ""}</h4>            
            <div class="content">
                <p><span class="bold">RECIBO N°:</span> ${response.factura.Id_Factura.toString().padStart(9, '0')}</p>
                <p><span class="bold">CONTRATO:</span> ${response.Contrato.numero_contrato.toString().padStart(9, '0')}</p>
                <p><span class="bold">Cuotas ${response.factura.Datos_Financiamiento?.Pago_Cuota}</span> 
                    a Pagar en C$ ${(response.factura.Total * response.factura.Tasa_Cambio).toFixed(2)}
                </p>
                <p>Equivalente a: $ ${response.factura.Total.toFixed(2)}</p>
                <p><span class="bold">Saldo Anterior C$</span> -</p>
                <p>Equivalente a: $ -</p>
            </div>

            <div class="content">
                <p><span class="bold">Recibí de:</span> ${response.factura.Datos.Nombre_Cliente}</p>
                <p><span class="bold">La cantidad de:</span> C$ ${(response.factura.Total * response.factura.Tasa_Cambio).toFixed(2)}</p>
                <p>Equivalente a: $ ${response.factura.Total.toFixed(2)}</p>
                <p>En letras: Trece Dólares con 81/100</p>
                <p>En concepto de: Pago por el(los) Artículo(s) en Sistema de Apartado</p>
                <p><span class="bold">Próxima Fecha de Pago:</span> Cancelado</p>
            </div>

            <div class="content">
                <p><span class="bold">Saldo Actual:</span> C$ 0.00</p>
                <p>Equivalente a: $ 0.00</p>
            </div>

            <div class="footer">
            <p>Sábado, 1 de Abril de 2023</p>
        </div>

        </div>`*/
        return html`<div style="font-family: Arial, sans-serif;" class="recibo">
            ${this.style.cloneNode(true)}
            <div style="margin-top: 5px; display: flex; height: 100px">
                ${documentsData.Header}
                <div style="text-align: center; margin-bottom: 5px; width: 300px">
                    <p>RUC: ${localStorage.getItem("RUC")}</p>
                    <p style="width:100%; display: flex">
                        <label style="flex: 1"> Recibo No.</label> 
                        <label style="flex: 1">${response.factura.Id_Factura}</label>
                    </p>
                    <p>${response.factura.Codigo_venta}</p>
                </div>
            </div>
            <h1 style="text-align: center; font-size: 20px">SISTEMA DE APARTADO</h1>
            <div style="margin-top: 5px; display: flex;">
                <div style="flex:2">
                    <p><strong>Nombre:</strong> ${response.factura.Datos.Nombre_Cliente}</p>
                    <p><strong>Dirección:</strong> ${response.factura.Datos.Direccion_Cliente}</p>                
                    <p><strong>Recibí de:</strong> ${response.factura.Datos.Nombre_Vendedor}</p>                    
                </div>
                <div style="flex:1">
                    <table style="width: 100%; border-collapse: collapse; margin-top: 5px;">
                        <tr>
                            <td style="padding: 2px 5px;">Día</td>
                            <td style="padding: 2px 5px;">Mes</td>
                            <td style="padding: 2px 5px;">Año</td>
                        </tr>
                        <tr>
                            <td style="padding: 2px 5px;">${new DateTime(response.factura.Fecha).getDay() + 1}</td>
                            <td style="padding: 2px 5px;">${new DateTime(response.factura.Fecha).getMonth() + 1}</td>
                            <td style="padding: 2px 5px;">${new DateTime(response.factura.Fecha).getFullYear()}</td>
                        </tr>
                        <tr>
                            <td style="padding: 2px 5px;">Hora:</td>
                            <td style="padding: 2px 5px;  text-align: right;" colspan="2">${new DateTime(response.factura.Fecha).GetFullHour() + 1}</td>
                        </tr>
                    </table>
                    <p style="padding: 2px 5px;"> <strong>Teléfono cliente:</strong> ${response.factura.Datos.Direccion_Cliente}</p>
                </div>
            </div>
            <div style="margin-top: 5px;">
                <strong>Observaciones:</strong> 
                <p>${response.factura.Observaciones || 'Ninguna'}</p>
            </div>
            </table>
           
            <div style="margin-top: 5px; display: flex;; justify-content: space-between;">   
                <div style="margin-top: 5px; display: flex;">
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

    /**
    * @param {DocumentsData}  documentsData
    * @param {Tbl_Factura}  factura
    * @returns {any}
    */
    static BuildFacturaVenta(documentsData, factura) {
        return html`<div style="font-family: Arial, sans-serif;" class="recibo">
           ${this.style.cloneNode(true)}
            <div style="margin-top: 5px; display: flex; height: 90px">
                ${documentsData.Header}
                <div style="text-align: center; margin-bottom: 5px; width: 300px">
                    <p>RUC: ${localStorage.getItem("RUC")}</p>
                    <p style="width:100%; display: flex">
                        <label style="flex: 1"> Factura No.</label> 
                        <label style="flex: 1">${factura.Id_Factura}</label>
                    </p>
                    <p>${factura.Codigo_venta}</p>
                    <table class="marco" style="width: 100%; border-collapse: collapse; margin-top: 5px;">
                        <tr>
                            <td style="padding: 2px 5px;">Día</td>
                            <td style="padding: 2px 5px;">Mes</td>
                            <td style="padding: 2px 5px;">Año</td>
                        </tr>
                        <tr>
                            <td style="padding: 2px 5px;">${new DateTime(factura.Fecha).getDay() + 1}</td>
                            <td style="padding: 2px 5px;">${new DateTime(factura.Fecha).getMonth() + 1}</td>
                            <td style="padding: 2px 5px;">${new DateTime(factura.Fecha).getFullYear()}</td>
                        </tr>
                        <tr>
                            <td style="padding: 2px 5px;">Hora:</td>
                            <td style="padding: 2px 5px;  text-align: right;" colspan="2">${new DateTime(factura.Fecha).GetFullHour() + 1}</td>
                        </tr>
                    </table>
                </div>
            </div>
            <h1 style="text-align: center; font-size: 20px">FACTURA</h1>
            <div style="margin-top: 5px; display: flex;">
                <table style="flex:2" class="">
                    <tr><td class="marcogris">Nombre:</td> <td class="underline">${factura.Datos.Nombre_Cliente}</td></tr>
                    <tr><td class="marcogris">Dirección:</td> <td class="underline">${factura.Datos.Direccion_Cliente}</td></tr>
                    <tr><td class="marcogris">Vendedor:</td> <td class="underline">${factura.Datos.Nombre_Vendedor} </td></tr>
                </table> 
                <table style="padding: 2px 5px;"> 
                    <tr>
                        <td class="marcogris">Teléfono/cli:</td> 
                        <td class="underline" style="width: 80px">${factura.Datos.Direccion_Cliente}</td>
                    </tr>
                </table>
            </div>
            <div style="margin-top: 5px;" class="marco">
                <strong>Observaciones:</strong> 
                <p>${factura.Observaciones || 'Ninguna'}</p>
            </div>
            </table>
            ${this.CreateTableDetail(factura)}
            <div style="margin-top: 5px; display: flex; justify-content: space-between;">   
                <div style="margin-top: 5px; display: flex;">
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
                    <p><strong>Total a pagar $:</strong> ${factura.Total.toFixed(2)}</p>
                    <!-- <p><strong>IVA:</strong> ${WOrtograficValidation.es(factura.Moneda ?? "DOLARES")} ${factura.Iva.toFixed(2)}</p> -->
                    <p><strong>Tasa de cambio:</strong> ${factura.Tasa_Cambio.toFixed(2)}</p>
                    <p><strong>Total a pagar C$:</strong> ${(factura.Total * factura.Tasa_Cambio).toFixed(2)}</p>
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
        //documentsData.Header.appendChild(html`<h1>RUC: ${localStorage.getItem("RUC")}</h1>`)
        return html`<div style="font-family: Arial, sans-serif;" class="recibo">
            ${this.style.cloneNode(true)}
            <div style="margin-top: 5px; display: flex; height: 90px">
                ${documentsData.Header}
                <div style="text-align: center; margin-bottom: 5px; width: 300px">  
                    <table class="marco" style="width: 100%; border-collapse: collapse; margin-top: 5px;">
                         <tr>
                            <td style="padding: 2px 5px;">Compraventa No.:</td>
                            <td style="padding: 2px 5px;  text-align: right;" colspan="2">${factura.Id_Compra?.toString()?.padStart(9, '0')}</td>
                        </tr>
                        <tr>
                            <td style="padding: 2px 5px;">Hora:</td>
                            <td style="padding: 2px 5px;  text-align: right;" colspan="2">${new DateTime(factura.Fecha).GetFullHour() + 1}</td>
                        </tr>
                        <tr>
                            <td style="padding: 2px 5px;">Día</td>
                            <td style="padding: 2px 5px;">Mes</td>
                            <td style="padding: 2px 5px;">Año</td>
                        </tr>
                        <tr>
                            <td style="padding: 2px 5px;">${new DateTime(factura.Fecha).getDay() + 1}</td>
                            <td style="padding: 2px 5px;">${new DateTime(factura.Fecha).getMonth() + 1}</td>
                            <td style="padding: 2px 5px;">${new DateTime(factura.Fecha).getFullYear()}</td>
                        </tr>                       
                    </table>   
                </div>
            </div>
            <h1 style="text-align: center; font-size: 20px">COMPRAVENTA</h1> 
            <div style="margin-top: 5px; display: flex; height: 80px">
                <table style="flex:2" class="">
                    <tr><td class="marcogris">Nombre:</td> <td class="underline">${factura.Cat_Proveedor.Nombre}</td></tr>
                    <tr><td class="marcogris">Cédula:</td> <td class="underline">${factura.Cat_Proveedor.Identificacion}</td></tr>
                    <tr><td class="marcogris">Comprador:</td> <td class="underline">${factura.Datos_Compra.Nombre_Comprador} </td></tr>
                </table>         
                <table style="padding: 2px 5px;"> 
                    <tr><td class="marcogris">Teléfono/cli:</td> <td class="underline" style="width: 80px">${factura.Cat_Proveedor.Datos_Proveedor.telefono}</td></tr>
                    <tr class="marco"><td>TC:</td><td>${factura.Tasa_Cambio.toFixed(2)}</td></tr>               
                </table>  
            </div>              
            ${this.CreateTableDetailCompra(factura)}
            <div class="marcogris">
                <strong>Observaciones:</strong> 
                <p>${factura.Observaciones || 'Ninguna'}</p>
            </div>     
            <div class="marco" style="display: flex;; justify-content: space-between;">                  
                <div style="margin-top: 5px; display: flex;; flex-direction:column; flex: 3">
                    <div style="margin-top: 5px; display: flex;">
                        <p>Sirva mi firma en este documento como declaración de dominio y dueño titular de los bienes aqui descritos, por no tener
                            factura, pero por poseción en mis manos me declaró dueño absoluto, como indica la ley 936 en su articulo 11.
                        </p>
                    </div>
                    <div style="margin-top: 5px; display: flex;">
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
            tagName: "table", class: "marco", style: "width: 100%; border-collapse: collapse; margin-top: 5px;", children: [
                WRender.Create({
                    tagName: "thead", children: [
                        { tagName: "th", style: "padding: 8px;", innerHTML: "Descripción" },
                        { tagName: "th", style: "padding: 8px;", innerHTML: "Marca" },
                        { tagName: "th", style: "padding: 8px;", innerHTML: "Model" },
                        { tagName: "th", style: "padding: 8px;", innerHTML: "Serie" },
                        { tagName: "th", style: "padding: 8px; text-align: right;", innerHTML: `Sub Total ${WOrtograficValidation.es(factura.Moneda ?? "DOLARES")}` },
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
                    tagName: "td", style: "padding: 8px;",
                    innerText: `${detalle.Lote?.Datos_Producto?.Descripcion || 'N/A'}`
                }),
                WRender.Create({
                    tagName: "td", style: "padding: 8px;",
                    innerText: `${detalle.Lote?.Datos_Producto?.Marca ?? "-"}`
                }),
                WRender.Create({
                    tagName: "td", style: "padding: 8px;",
                    innerText: `${detalle.Lote?.Datos_Producto?.Modelo ?? "-"}`
                }),
                WRender.Create({
                    tagName: "td", style: "padding: 8px;",
                    innerText: `${detalle.Lote?.Datos_Producto?.Serie ?? "-"}`
                }),
                WRender.Create({
                    tagName: "td", style: "padding: 8px;",
                    innerText: `${WOrtograficValidation.es(factura.Moneda ?? "DOLARES")} ${detalle.Total.toFixed(2)}`
                })
            ]
        }));
    }
    static CreateTableDetailCompra(factura) {
        return WRender.Create({
            tagName: "table", class: "marco", style: "width: 100%; border-collapse: collapse;", children: [
                WRender.Create({
                    tagName: "thead", children: [
                        { tagName: "th", style: "padding: 8px;", innerHTML: "Descripción" },
                        { tagName: "th", style: "padding: 8px;", innerHTML: "Marca" },
                        { tagName: "th", style: "padding: 8px;", innerHTML: "Model" },
                        { tagName: "th", style: "padding: 8px;", innerHTML: "Serie" },
                        { tagName: "th", style: "padding: 8px; text-align: right;", innerHTML: `Sub Total ${WOrtograficValidation.es(factura.Moneda ?? "DOLARES")}` },
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
                    tagName: "td", style: "padding: 8px;",
                    innerText: `${detalle?.Cat_Producto.Descripcion || 'N/A'}`
                }),
                WRender.Create({
                    tagName: "td", style: "padding: 8px;",
                    innerText: `${detalle?.Cat_Producto?.Cat_Marca?.Descripcion ?? "-"}`
                }),
                WRender.Create({
                    tagName: "td", style: "padding: 8px;",
                    innerText: `${detalle?.Datos_Producto_Lote?.Modelo ?? "-"}`
                }),
                WRender.Create({
                    tagName: "td", style: "padding: 8px;",
                    innerText: `${detalle?.Datos_Producto_Lote?.Serie ?? "-"}`
                }),
                WRender.Create({
                    tagName: "td", style: "padding: 8px;",
                    innerText: `${WOrtograficValidation.es(factura.Moneda ?? "DOLARES")} ${detalle.Total.toFixed(2)}`
                })
            ]
        }));
    }
    static style = css`

        .header-table td div {
            /* margin-bottom: 10px; */
            /* width: 100%; */
            font-size: 16px;
            color: #0001af;
        }
        table {
            border-collapse: collapse;
        }
        .underline {
            border-bottom: solid 1px #505050;
            min-width: calc(100% - 50px);
            padding: 0 5px;
        }

        .factura-container {
            border: 1px solid #505050;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
        }              
        .total-container p, .marcogris {
            background-color: #eee;
            border: solid 1px #505050;
            margin: 0;
            padding: 5px;
        }
        .marco {
            border: solid 1px #505050;
            margin: 5px 0px;
            padding: 5px;
        }
        .recibo, .contract {
            width: 210mm; /* A4 width */            
            background-color: white;
            margin: 10px 0;
            padding: 20px;
             
        }
        .recibo *{
            font-size: 12px;
            color: #000;
        }
        .recibo p {
            margin: 0px;
            padding: 3px;
        }

        .recibo {
            overflow: hidden;
            height: 140mm; /* A4 height */
            /* page-break-after: always; Ensure each .page-container starts on a new page*/
        } 
        .marco td, .marco th {
            border: solid 1px #505050;
        }
        .marco th {
            background-color: #eee;
            border: solid 1px #505050;
            color: #0001af;
        }
        .recibo h1 {
            color: #0001af;    
        }
        .contract {
            page-break-after: always;        
        }
        @media print {
            * {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;                
            }
            .recibo, .contract {           
                background-color: white;
                margin: 0px 0;
                padding: 0px;
                
            }
        }
    `
}