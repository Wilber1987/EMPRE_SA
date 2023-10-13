using RazorLight;
using System;
using System.IO;
using iTextSharp.text;
using iTextSharp.text.pdf;
using iTextSharp.text.html.simpleparser;
using UI.Controllers;
using iTextSharp.tool.xml;
using DataBaseModel;
using System.Text;
using System.Reflection;
using Model;
using CAPA_DATOS.Services;

namespace CAPA_NEGOCIO.Services
{
    public class ContractService
    {
        public class MyModel
        {
            public string Title { get; set; }
            public string Content { get; set; }
        }

        public static async Task<byte[]> GeneratePdfFromRazorTemplateAsync<TModel>(string razorTemplate, TModel model)
        {
            var engine = new RazorLightEngineBuilder()
                .UseFileSystemProject(System.IO.Path.GetFullPath("./Pages/Contracts"))
                .UseMemoryCachingProvider()
                .Build();

            string renderedHtml = await engine.CompileRenderAsync(razorTemplate, model);

            // Generar el PDF a partir del HTML renderizado
            var pdfFilePath = Path.Combine(System.IO.Path.GetFullPath("./Pages/Contracts"), "output.pdf");
            GeneratePdfFromHtml(renderedHtml, pdfFilePath);

            // Leer el contenido del archivo PDF generado y devolverlo como un arreglo de bytes
            return File.ReadAllBytes(pdfFilePath);
        }


        public static void generaPDF(Transaction_Contratos model)
        {
            string rutaArchivo = "contrato_empeno.cshtml";
            if (model.tipo.Equals(Contratos_Type.EMPENO_VEHICULO.ToString()))
            {
                rutaArchivo = "contrato_empeno_vehiculo.cshtml";
            } else if (model.tipo.Equals(Contratos_Type.PRESTAMO.ToString()))
            {
                rutaArchivo = "contrato_prestamo.cshtml";
            }
            var templatePath = Path.Combine(System.IO.Path.GetFullPath("./Pages/Contracts"), rutaArchivo);
            var templateContent = File.ReadAllText(templatePath);

             templateContent = templateContent.Replace("{{cuotafija}}", Math.Round((decimal)model.cuotafija, 2).ToString())
                .Replace("{{cuotafija_label}}", NumberUtility.NumeroALetras(model.cuotafija))
                .Replace("{{cuotafija_dolares}}", Math.Round((decimal)model.cuotafija_dolares, 2).ToString())
                .Replace("{{cuotafija_dolares_label}}", NumberUtility.NumeroALetras(model.cuotafija_dolares))
                .Replace("{{valoracion_empeño_cordobas}}", Math.Round((decimal)model.valoracion_empeño_cordobas, 2).ToString())
                .Replace("{{valoracion_empeño_cordobas_label}}", NumberUtility.NumeroALetras(model.valoracion_empeño_cordobas))
                .Replace("{{valoracion_empeño_dolares}}", Math.Round((decimal)model.valoracion_compra_dolares, 2).ToString())
                .Replace("{{valoracion_empeño_dolares_label}}", NumberUtility.NumeroALetras(model.valoracion_compra_dolares));

            var renderedHtml = RenderTemplate(templateContent, model);

            var configuraciones = new Transactional_Configuraciones().GetIntereses();
            //var interes = configuraciones.Select(i => Convert.ToInt32(i.Valor)).ToArray().Sum();

            renderedHtml = RenderTemplate(renderedHtml, model.Catalogo_Clientes)
                .Replace("{{municipio}}", model.Catalogo_Clientes.Catalogo_Municipio?.nombre)
                .Replace("{{departamento}}", model.Catalogo_Clientes.Catalogo_Departamento?.nombre)
                .Replace("{{tabla_articulos}}", GenerateTableHtml(model.Detail_Prendas))

                /*INTERESES*/
                .Replace("{{interes_inicial}}", model.Catalogo_Clientes.Catalogo_Clasificacion_Interes?.porcentaje.ToString() ?? "6")
                .Replace("{{interes_inicial_label}}", NumberUtility.NumeroALetras(
                    Convert.ToDecimal(model.Catalogo_Clientes.Catalogo_Clasificacion_Interes?.porcentaje.ToString() ?? "6")))

                .Replace("{{interes_gastos_administrativos}}",
                    configuraciones.Find(c => c.Nombre.Equals(InteresesPrestamosEnum.GASTOS_ADMINISTRATIVOS.ToString()))?.Valor)
                .Replace("{{interes_gastos_administrativos_label}}",
                    NumberUtility.NumeroALetras(Convert.ToDecimal(configuraciones.Find(c =>
                    c.Nombre.Equals(InteresesPrestamosEnum.GASTOS_ADMINISTRATIVOS.ToString()))?.Valor)))

                .Replace("{{interes_gastos_legales}}",
                    configuraciones.Find(c => c.Nombre.Equals(InteresesPrestamosEnum.GASTOS_ADMINISTRATIVOS.ToString()))?.Valor)
                .Replace("{{interes_gastos_legales_label}}", NumberUtility.NumeroALetras(Convert.ToDecimal(configuraciones.Find(c =>
                    c.Nombre.Equals(InteresesPrestamosEnum.GASTOS_ADMINISTRATIVOS.ToString()))?.Valor)))

                .Replace("{{interes_comisiones_label}}", NumberUtility.NumeroALetras(Convert.ToDecimal(configuraciones.Find(c =>
                    c.Nombre.Equals(InteresesPrestamosEnum.COMISIONES.ToString()))?.Valor)))
                .Replace("{{interes_comisiones}}",
                    configuraciones.Find(c => c.Nombre.Equals(InteresesPrestamosEnum.COMISIONES.ToString()))?.Valor)

                .Replace("{{interes_mantenimiento_valor_label}}", NumberUtility.NumeroALetras(Convert.ToDecimal(configuraciones.Find(c =>
                    c.Nombre.Equals(InteresesPrestamosEnum.MANTENIMIENTO_VALOR.ToString()))?.Valor)))
                .Replace("{{interes_mantenimiento_valor}}",
                    configuraciones.Find(c => c.Nombre.Equals(InteresesPrestamosEnum.MANTENIMIENTO_VALOR.ToString()))?.Valor)

                .Replace("{{interes_demas_cargos_label}}", NumberUtility.NumeroALetras(Convert.ToDecimal(configuraciones.Find(c =>
                    c.Nombre.Equals(InteresesPrestamosEnum.GESTIONES_CREDITICIAS.ToString()))?.Valor)))
                .Replace("{{interes_demas_cargos}}",
                    configuraciones.Find(c => c.Nombre.Equals(InteresesPrestamosEnum.GESTIONES_CREDITICIAS.ToString()))?.Valor)

                .Replace("{{dias}}", DateTime.Now.Day.ToString())
                .Replace("{{mes}}", DateTime.Now.Month.ToString())
                .Replace("{{anio}}", DateTime.Now.Year.ToString())
                .Replace("{{tbody_amortizacion}}", GenerateTableHtml(model.Tbl_Cuotas));
            // Generar el PDF
            var pdfFilePath = Path.Combine(System.IO.Path.GetFullPath("./wwwroot/Contracts"), "output.pdf");
            GeneratePdfFromHtml(renderedHtml, pdfFilePath);

        }

        public static string RenderTemplate(string templateContent, object model)
        {
            PropertyInfo[] properties = model.GetType().GetProperties();
            string renderedTemplate = templateContent;
            foreach (PropertyInfo property in properties)
            {
                string propertyName = property.Name;
                object propertyValue = property.GetValue(model, null);
                string placeholder = $"{{{{{propertyName}}}}}";
                if (propertyValue != null)
                {
                    renderedTemplate = renderedTemplate.Replace(placeholder, propertyValue.ToString());
                }
                else
                {
                    renderedTemplate = renderedTemplate.Replace(placeholder, "");
                }
            }
            return renderedTemplate;
        }

        static void GeneratePdfFromHtml(string html, string outputPath)
        {
            using (var stream = new FileStream(outputPath, FileMode.Create))
            {
                using (var document = new Document(PageSize.A4))
                {
                    using (var writer = PdfWriter.GetInstance(document, stream))
                    {
                        document.Open();

                        using (var sr = new StringReader(html))
                        {
                            // Use XMLWorkerHelper to parse the HTML with CSS support
                            XMLWorkerHelper.GetInstance().ParseXHtml(writer, document, sr);
                        }

                        document.Close();
                    }
                }
            }
        }

        static string GenerateTableHtml(List<Detail_Prendas> listaDatos)
        {
            StringBuilder htmlBuilder = new StringBuilder();
            // Abrir la etiqueta de la tabla con atributos de estilo para bordes y ancho 100%
            htmlBuilder.Append("<table style=\"font-size:9px;border-collapse: collapse; width: 100%;\">");
            // Encabezados de la tabla (opcional)
            htmlBuilder.Append("<tr>");
            htmlBuilder.Append("<th style=\"font-size:9px; text-align: center; padding: 4px; border: 1px solid black;\">Bienes</th>");
            htmlBuilder.Append("<th style=\"font-size:9px; text-align: center; padding: 4px; border: 1px solid black;\">Color</th>");
            htmlBuilder.Append("<th style=\"font-size:9px; text-align: center; padding: 4px; border: 1px solid black;\">Marca</th>");
            htmlBuilder.Append("<th style=\"font-size:9px; text-align: center; padding: 4px; border: 1px solid black;\">Serie</th>");
            htmlBuilder.Append("<th style=\"font-size:9px; text-align: center; padding: 4px; border: 1px solid black;\">Modelo</th>");
            // Agregar más encabezados según tus necesidades
            htmlBuilder.Append("</tr>");
            // Contenido de la tabla
            foreach (var dato in listaDatos)
            {
                htmlBuilder.Append("<tr>");
                htmlBuilder.Append($"<td style=\"font-size:9px; padding: 4px; border: 1px solid black;\">{dato.Descripcion}</td>");
                htmlBuilder.Append($"<td style=\"font-size:9px; padding: 4px; border: 1px solid black;\">{dato.color}</td>");
                htmlBuilder.Append($"<td style=\"font-size:9px; padding: 4px; border: 1px solid black;\">{dato.marca}</td>");
                htmlBuilder.Append($"<td style=\"font-size:9px; padding: 4px; border: 1px solid black;\">{dato.serie}</td>");
                htmlBuilder.Append($"<td style=\"font-size:9px; padding: 4px; border: 1px solid black;\">{dato.modelo}</td>");
                // Agregar más columnas según las propiedades de tu objeto DatosTabla
                htmlBuilder.Append("</tr>");
            }

            // Cerrar la etiqueta de la tabla
            htmlBuilder.Append("</table>");
            return htmlBuilder.ToString();
        }
        static string GenerateTableHtml(List<Tbl_Cuotas> listaDatos)
        {
            List<Tbl_Cuotas> objListOrder = listaDatos.OrderBy(order => order.fecha).ToList();
            StringBuilder htmlBuilder = new StringBuilder();
            // Abrir la etiqueta de la tabla con atributos de estilo para bordes y ancho 100%
            htmlBuilder.Append("<tbody>");
            // Contenido de la tabla
            foreach (var dato in objListOrder)
            {
                htmlBuilder.Append("<tr>");
                htmlBuilder.Append($"<td class=\"desc\" colspan=\"2\">{Convert.ToDateTime(dato.fecha.ToString()).ToString("dd-MM-yyyy")}</td>");
                htmlBuilder.Append($"<td class=\"val\"></td>");
                htmlBuilder.Append($"<td class=\"val\"></td>");
                htmlBuilder.Append($"<td class=\"val\"></td>");
                htmlBuilder.Append($"<td class=\"val\"></td>");
                htmlBuilder.Append($"<td class=\"val\">{Math.Round((decimal)(dato.interes * dato.tasa_cambio), 2)}</td>");
                htmlBuilder.Append($"<td class=\"val\">{Math.Round((decimal)dato.interes, 2)}</td>");
                htmlBuilder.Append($"<td class=\"val\">{Math.Round((decimal)(dato.abono_capital * dato.tasa_cambio), 2)}</td>");
                htmlBuilder.Append($"<td class=\"val\">{Math.Round((decimal)dato.abono_capital, 2)}</td>");
                htmlBuilder.Append($"<td class=\"val\">{Math.Round((decimal)(dato.total * dato.tasa_cambio), 2)}</td>");
                htmlBuilder.Append($"<td class=\"val\">{Math.Round((decimal)dato.total, 2)}</td>");
                htmlBuilder.Append($"<td class=\"val\">{Math.Round((decimal)(dato.capital_restante * dato.tasa_cambio), 2)}</td>");
                htmlBuilder.Append($"<td class=\"val\">{Math.Round((decimal)dato.capital_restante, 2)}</td>");


                // Agregar más columnas según las propiedades de tu objeto DatosTabla
                htmlBuilder.Append("</tr>");
            }

            // Cerrar la etiqueta de la tabla
            htmlBuilder.Append("</tbody>");
            return htmlBuilder.ToString();
        }
    }


}