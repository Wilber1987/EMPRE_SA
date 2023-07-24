using RazorLight;
using System;
using System.IO;
using iTextSharp.text;
using iTextSharp.text.pdf;
using iTextSharp.text.html.simpleparser;
using UI.Controllers;

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

            var renderedHtmlBytes = System.Text.Encoding.UTF8.GetBytes(renderedHtml);
            return renderedHtmlBytes;
        }

        public static void generaPDF(String rutaArchivo)
        {
            var model = new Person
            {
                Name = "John Doe",
                Age = 30
            };

            var templatePath = Path.Combine(System.IO.Path.GetFullPath("../UI/Pages/Contracts"), rutaArchivo);
            var templateContent = File.ReadAllText(templatePath);

            var renderedHtml = RenderTemplate(templateContent, model);

            // Generar el PDF
            var pdfFilePath = Path.Combine(System.IO.Path.GetFullPath("../UI/Pages/Contracts"), "output.pdf");
            GeneratePdfFromHtml(renderedHtml, pdfFilePath);

        }
        static string RenderTemplate(string templateContent, Person model)
        {
            return templateContent
               .Replace("{Name}", model.Name)
               .Replace("{Age}", model.Age.ToString());
        }

        static void GeneratePdfFromHtml(string html, string outputPath)
        {
            using var stream = new FileStream(outputPath, FileMode.Create);
            using var document = new Document(PageSize.A4);
            using var writer = PdfWriter.GetInstance(document, stream);

            document.Open();
            using var htmlWorker = new HTMLWorker(document);
            using var sr = new StringReader(html);
            htmlWorker.Parse(sr);
            document.Close();
        }
    }


}