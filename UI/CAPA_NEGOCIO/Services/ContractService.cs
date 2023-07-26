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
                .UseFileSystemProject(System.IO.Path.GetFullPath("../UI/Pages/Contracts"))
                .UseMemoryCachingProvider()
                .Build();

            string renderedHtml = await engine.CompileRenderAsync(razorTemplate, model);

            // Generar el PDF a partir del HTML renderizado
            var pdfFilePath = Path.Combine(System.IO.Path.GetFullPath("../UI/Pages/Contracts"), "output.pdf");
            GeneratePdfFromHtml(renderedHtml, pdfFilePath);

            // Leer el contenido del archivo PDF generado y devolverlo como un arreglo de bytes
            return File.ReadAllBytes(pdfFilePath);
        }


        public static void generaPDF(Transaction_Contratos model, String rutaArchivo)
        {
          

            var templatePath = Path.Combine(System.IO.Path.GetFullPath("../UI/Pages/Contracts"), rutaArchivo);
            var templateContent = File.ReadAllText(templatePath);

            var renderedHtml = RenderTemplate(templateContent, model);

            // Generar el PDF
            var pdfFilePath = Path.Combine(System.IO.Path.GetFullPath("../UI/Pages/Contracts"), "output.pdf");
            GeneratePdfFromHtml(renderedHtml, pdfFilePath);

        }
        static string RenderTemplate(string templateContent, Transaction_Contratos model)
        {
            return templateContent
               .Replace("{{numero_contrato}}", model.numero_contrato.ToString())
               .Replace("{{monto}}", model.monto.ToString())
               .Replace("{{observaciones}}", model.observaciones)
               .Replace("{{tasa_hoy}}", model.tasa_hoy.ToString())
               .Replace("{{taza_cambio}}", model.taza_cambio.ToString())
               .Replace("{{monto}}", model.monto.ToString())
               .Replace("{{valor_dolar}}", model.valor_dolar.ToString())
               .Replace("{{fecha}}", model.fecha.ToString())
               .Replace("{{deudor}}", model.Catalogo_Clientes.primer_nombre + " " + model.Catalogo_Clientes.segundo_nombre + " " + model.Catalogo_Clientes.primer_apellido + " " + model.Catalogo_Clientes.segundo_apellidio)
               .Replace("{{cedula}}", model.Catalogo_Clientes.identificacion)
               .Replace("{{telefono}}", model.Catalogo_Clientes.telefono.ToString())
               .Replace("{{fecha}}", model.fecha.ToString())
               .Replace("{{departamento}}", model.Catalogo_Clientes.Catalogo_Municipio.nombre.ToString())
               .Replace("{{municipio}}", model.Catalogo_Clientes.Catalogo_Departamento.nombre.ToString())
               .Replace("{{direccion}}", model.Catalogo_Clientes.direccion.ToString())
               .Replace("{{estado_civil}}", model.Catalogo_Clientes.estado_civil.ToString())
               .Replace("{{dias}}", DateTime.Now.Day.ToString())
               .Replace("{{mes}}", DateTime.Now.Month.ToString())
               .Replace("{{anio}}", DateTime.Now.Year.ToString())
               .Replace("{{tabla_articulos}}",GenerateTableHtml(model.Detail_Prendas));
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
            htmlBuilder.Append("<table style=\"font-size:10px; border-collapse: collapse; width: 100%;\">");

            // Encabezados de la tabla (opcional)
            htmlBuilder.Append("<tr>");
            htmlBuilder.Append("<th style=\"font-size:10px; text-align: center; border: 1px solid black;\">Bienes</th>");
            htmlBuilder.Append("<th style=\"font-size:10px; text-align: center; border: 1px solid black;\">Color</th>");
            htmlBuilder.Append("<th style=\"font-size:10px; text-align: center; border: 1px solid black;\">Marca</th>");
            htmlBuilder.Append("<th style=\"font-size:10px; text-align: center; border: 1px solid black;\">Serie</th>");
            htmlBuilder.Append("<th style=\"font-size:10px; text-align: center; border: 1px solid black;\">Modelo</th>");
            // Agregar más encabezados según tus necesidades
            htmlBuilder.Append("</tr>");

            // Contenido de la tabla
            foreach (var dato in listaDatos)
            {
                htmlBuilder.Append("<tr>");
                htmlBuilder.Append($"<td style=\"font-size:10px; border: 1px solid black;\">{dato.Descripcion}</td>");
                htmlBuilder.Append($"<td style=\"font-size:10px; border: 1px solid black;\">{dato.color}</td>");
                htmlBuilder.Append($"<td style=\"font-size:10px; border: 1px solid black;\">{dato.marca}</td>");
                htmlBuilder.Append($"<td style=\"font-size:10px; border: 1px solid black;\">{dato.serie}</td>");
                htmlBuilder.Append($"<td style=\"font-size:10px; border: 1px solid black;\">{dato.modelo}</td>");

                // Agregar más columnas según las propiedades de tu objeto DatosTabla
                htmlBuilder.Append("</tr>");
            }

            // Cerrar la etiqueta de la tabla
            htmlBuilder.Append("</table>");
            return htmlBuilder.ToString();
        }
    }


}