using RazorLight;
using System;
using System.IO;
// using iTextSharp.text;
// using iTextSharp.text.pdf;
// using iTextSharp.text.html.simpleparser;
using UI.Controllers;
//using iTextSharp.tool.xml;
using DataBaseModel;
using System.Text;
using System.Reflection;
using Model;
using CAPA_DATOS.Services;
using CAPA_DATOS;
using iText.Kernel.Pdf;
using iText.Html2pdf;
using iText.Layout;
using iText.Layout.Element;
using System.Globalization;

namespace CAPA_NEGOCIO.Services
{
	public class ContractTemplateService
	{

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
			try
			{
				string templateContent = ContractsTemplates.ContractEmpeno;
				if (model.tipo.Equals(Contratos_Type.EMPENO_VEHICULO.ToString()))
				{
					templateContent = ContractsTemplates.ContractEmpenoVehiculo;
				}
				else if (model.tipo.Equals(Contratos_Type.PRESTAMO.ToString()))
				{
					templateContent = ContractsTemplates.ContractPrestamo;
				}
				DateTime? fechaPrimeraCuota = model.Tbl_Cuotas?.Select(c => c.fecha).ToList().Min();
				DateTime? fechaUltimaCuota = model.Tbl_Cuotas?.Select(c => c.fecha).ToList().Max();
				var configuraciones_theme = new Transactional_Configuraciones().GetTheme();
				var configuraciones_generales = new Transactional_Configuraciones().GetGeneralData();

				//var configuraciones = new Transactional_Configuraciones().GetIntereses();
				templateContent = templateContent.Replace("{{cuotafija}}", NumberUtility.ConvertToMoneyString(model.cuotafija))
					.Replace("{{numero_contrato}}", model.numero_contrato?.ToString("D9"))
					.Replace("{{datos_apoderado}}", configuraciones_generales.Find(c => c.Nombre.Equals(GeneralDataEnum.APODERADO.ToString()))?.Valor)
					.Replace("{{resumen_datos_apoderado}}", configuraciones_generales.Find(c => c.Nombre.Equals(GeneralDataEnum.DATOS_APODERADO.ToString()))?.Valor)
					.Replace("{{firma}}", configuraciones_generales.Find(c => c.Nombre.Equals(GeneralDataEnum.FIRMA_DIGITAL_APODERADO.ToString()))?.Valor)
					.Replace("{{logo}}", "data:image/png;base64," + configuraciones_theme.Find(c => c.Nombre.Equals(ConfiguracionesThemeEnum.LOGO.ToString()))?.Valor)
					.Replace("{{titulo}}", configuraciones_theme.Find(c => c.Nombre == ConfiguracionesThemeEnum.TITULO.ToString())?.Valor)
					.Replace("{{subtitulo}}", configuraciones_theme.Find(c => c.Nombre == ConfiguracionesThemeEnum.SUB_TITULO.ToString())?.Valor)
					.Replace("{{info_tel}}", configuraciones_theme.Find(c => c.Nombre == ConfiguracionesThemeEnum.INFO_TEL.ToString())?.Valor)
					.Replace("{{fecha_contrato_label}}", model.fecha_contrato?.ToString("dddd, d \"del\" \"mes\" \"de\" MMMM \"del\" \"año\" yyyy \"a las\" h:mm tt", new CultureInfo("es-ES")))
					.Replace("{{fecha_contrato_label_corta}}", model.fecha_contrato?.ToString("dddd, d \"del\" \"mes\" \"de\" MMMM \"del\" \"año\" yyyy", new CultureInfo("es-ES")))
					.Replace("{{fecha_primera_cuota}}", fechaPrimeraCuota?.ToString("dddd, d \"del\" \"mes\" \"de\" MMMM \"del\" \"año\" yyyy", new CultureInfo("es-ES")))
					.Replace("{{fecha_ultima_cuota}}", fechaUltimaCuota?.ToString("dddd, d \"del\" \"mes\" \"de\" MMMM \"del\" \"año\" yyyy", new CultureInfo("es-ES")))
					.Replace("{{cuotafija_label}}", NumberUtility.NumeroALetras(model.cuotafija, "córdobas"))
					.Replace("{{cuotafija_dolares}}", NumberUtility.ConvertToMoneyString(model.cuotafija_dolares))
					.Replace("{{cuotafija_dolares_label}}", NumberUtility.NumeroALetras(model.cuotafija_dolares, "dólares"))
					.Replace("{{Valoracion_empeño_cordobas}}", NumberUtility.ConvertToMoneyString(model.Valoracion_empeño_cordobas))
					.Replace("{{Valoracion_empeño_cordobas_label}}", NumberUtility.NumeroALetras(model.Valoracion_empeño_cordobas, "córdobas"))
					.Replace("{{Valoracion_empeño_dolares}}", NumberUtility.ConvertToMoneyString(model.Valoracion_empeño_dolares))
					.Replace("{{Valoracion_empeño_dolares_label}}", NumberUtility.NumeroALetras(model.Valoracion_empeño_dolares, "dólares"));

				var renderedHtml = RenderTemplate(templateContent, model);

				//LoggerServices.AddMessageInfo("FIN DE RENDER");

				//var interes = configuraciones.Select(i => Convert.ToInt32(i.Valor)).ToArray().Sum();
				//LoggerServices.AddMessageInfo("FIN DE GET INTERESE");
				Catalogo_Clientes? cliente = model.Catalogo_Clientes?.Find<Catalogo_Clientes>();
				double valorInteres = model.DesgloseIntereses.GetPorcentageInteresesSGC();


				//var montoMora = model.cuotafija * (model?.mora ?? 0.005) * 1;//como el cronjob es diario se va cargando mora cada dia
				var mora = model.mora / 100;

				renderedHtml = RenderTemplate(renderedHtml, cliente)
					.Replace("{{municipio}}", cliente.Catalogo_Municipio?.nombre)
					.Replace("{{departamento}}", cliente.Catalogo_Departamento?.nombre)
					.Replace("{{tabla_articulos}}", GeneratePrendasTableHtml(model.Detail_Prendas, model.tipo.Equals(Contratos_Type.EMPENO_VEHICULO.ToString())))
					//MORA                
					.Replace("{{valor_mora}}", "C$ " + NumberUtility.ConvertToMoneyString(model.cuotafija_dolares * mora * model.taza_cambio))
					.Replace("{{valor_mora_label}}", NumberUtility.NumeroALetras(model.cuotafija_dolares * mora * model.taza_cambio, "córdobas"))

					/*INTERESES*/
					.Replace("{{interes_demas_cargos}}", model.gestion_crediticia.ToString() ?? "6")
					.Replace("{{interes_demas_cargos_label}}", NumberUtility.NumeroALetras(
						Convert.ToDecimal(model.gestion_crediticia.ToString() ?? "")))

					.Replace("{{interes_gastos_administrativos}}",
						model.DesgloseIntereses.GASTOS_ADMINISTRATIVOS.ToString())
					.Replace("{{interes_gastos_administrativos_label}}", NumberUtility.NumeroALetras(
							Convert.ToDecimal(model.DesgloseIntereses.GASTOS_ADMINISTRATIVOS.ToString())))

					.Replace("{{interes_gastos_legales}}",
						model.DesgloseIntereses.GASTOS_LEGALES.ToString())
					.Replace("{{interes_gastos_legales_label}}", NumberUtility.NumeroALetras(
						Convert.ToDecimal(model.DesgloseIntereses.GASTOS_LEGALES.ToString())))

					.Replace("{{interes_comisiones_label}}", NumberUtility.NumeroALetras(
						Convert.ToDecimal(model.DesgloseIntereses.COMISIONES.ToString())))
					.Replace("{{interes_comisiones}}",
						model.DesgloseIntereses.COMISIONES.ToString())

					.Replace("{{interes_mantenimiento_valor_label}}", NumberUtility.NumeroALetras(
						Convert.ToDecimal(model.DesgloseIntereses.MANTENIMIENTO_VALOR.ToString())))
					.Replace("{{interes_mantenimiento_valor}}",
						model.DesgloseIntereses.MANTENIMIENTO_VALOR.ToString())

					.Replace("{{interes_inicial_label}}", NumberUtility.NumeroALetras(
						Convert.ToDecimal(model.DesgloseIntereses.INTERES_NETO_CORRIENTE.ToString())))
					.Replace("{{interes_inicial}}",
						model.DesgloseIntereses.INTERES_NETO_CORRIENTE.ToString())

					.Replace("{{sum_intereses}}", (valorInteres + Convert.ToDouble(cliente.Catalogo_Clasificacion_Interes?.porcentaje - 1)).ToString())
					.Replace("{{dias}}", DateTime.Now.Day.ToString())
					.Replace("{{mes}}", DateTime.Now.ToString("MMMM"))
					.Replace("{{anio}}", DateTime.Now.Year.ToString())
					.Replace("{{tbody_amortizacion}}", GenerateCuotesTableHtml(model.Tbl_Cuotas, cliente, model));
				LoggerServices.AddMessageInfo("FIN DE RENDER 2");
				// Generar el PDF
				var pdfFilePath = Path.Combine(System.IO.Path.GetFullPath("./wwwroot/Contracts"), "output.pdf");
				GeneratePdfFromHtml(renderedHtml, pdfFilePath);
				LoggerServices.AddMessageInfo("FIN DE GENERATE");
			}
			catch (System.Exception ex)
			{
				LoggerServices.AddMessageInfo("FIN DE GENERATE:" + ex);
				throw;
			}
			/*LoggerServices.AddMessageInfo("INICIO DE LECTURA");
			string rutaArchivo = "contrato_empeno.cshtml";
			if (model.tipo.Equals(Contratos_Type.EMPENO_VEHICULO.ToString()))
			{
				rutaArchivo = "contrato_empeno_vehiculo.cshtml";
			}
			else if (model.tipo.Equals(Contratos_Type.PRESTAMO.ToString()))
			{
				rutaArchivo = "contrato_prestamo.cshtml";
			}
			LoggerServices.AddMessageInfo("FIN SELECCION DE PATH");
			var templatePath = Path.Combine(System.IO.Path.GetFullPath("./Pages/Contracts"), rutaArchivo);
			LoggerServices.AddMessageInfo("COMBINACION DE PATH");
			 LoggerServices.AddMessageInfo($"FIN SELECCION DE PATH ::{templatePath}" );
			var templateContent = File.ReadAllText(templatePath);
			LoggerServices.AddMessageInfo("LECTURA DE PATH");
			LoggerServices.AddMessageInfo("FIN DE LECTURA");
			*/



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
			LoggerServices.AddMessageInfo("FIN DE RENDER PROPS");
			return renderedTemplate;
		}

		static void GeneratePdfFromHtml(string html, string outputPath)
		{
			// using (var stream = new FileStream(outputPath, FileMode.Create))
			// {
			// 	using (var document = new Document(PageSize.A4))
			// 	{
			// 		using (var writer = PdfWriter.GetInstance(document, stream))
			// 		{
			// 			document.Open();

			// 			using (var sr = new StringReader(html))
			// 			{
			// 				// Use XMLWorkerHelper to parse the HTML with CSS support
			// 				XMLWorkerHelper.GetInstance().ParseXHtml(writer, document, sr);
			// 			}

			// 			document.Close();
			// 		}
			// 	}
			// }
			//string html = "<html><body><img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAcklEQVR42mP8/wcAAwAB/AB+AAD/AAAA//8AAB+AAD/AAAA/wAAHgAAfQAABwAAAAAA////AAAA/wD5+fn/AIgB5eXl/AFBQUF9pAAAAAElFTkSuQmCC'></body></html>";

			// Ruta del archivo PDF de salida
			//string outputPath = "output.pdf";

			// Crear el documento PDF
			using (FileStream outputStream = new FileStream(outputPath, FileMode.Create))
			{
				using (var writer = new PdfWriter(outputStream))
				{
					using (var pdfDocument = new PdfDocument(writer))
					{
						// Crear el documento PDF a partir del HTML
						HtmlConverter.ConvertToPdf(html, pdfDocument, new ConverterProperties());

						Console.WriteLine("PDF generado con éxito en: " + outputPath);
					}
				}
			}
		}

		public static string GeneratePrendasTableHtml(List<Detail_Prendas> listaDatos, bool isVehiculo)
		{
			if (isVehiculo)
			{
				return VehiculosPrendasTable(listaDatos);
			}
			return BasicPrendasTable(listaDatos);
		}

		public static string VehiculosPrendasTable(List<Detail_Prendas> listaDatos)
		{
			StringBuilder htmlBuilder = new StringBuilder();
			// Abrir la etiqueta de la tabla con atributos de estilo para bordes y ancho 100%
			htmlBuilder.Append("<table style=\"font-size:9px;border-collapse: collapse; width: 100%; max-width: 100%;\">");
			// Encabezados de la tabla (opcional)
			htmlBuilder.Append("<tr>");
			htmlBuilder.Append("<th style=\"font-size:7px; text-align: center; padding: 4px; border: 1px solid black;\">VEHÍCULO</th>");
			htmlBuilder.Append("<th style=\"font-size:7px; text-align: center; padding: 4px; border: 1px solid black;\">COLOR</th>");
			htmlBuilder.Append("<th style=\"font-size:7px; text-align: center; padding: 4px; border: 1px solid black;\">CAP/CILINDRO</th>");
			htmlBuilder.Append("<th style=\"font-size:7px; text-align: center; padding: 4px; border: 1px solid black;\">CANT/CILINDRO</th>");
			htmlBuilder.Append("<th style=\"font-size:7px; text-align: center; padding: 4px; border: 1px solid black;\">CANT/PASAJEROS</th>");
			htmlBuilder.Append("<th style=\"font-size:7px; text-align: center; padding: 4px; border: 1px solid black;\">AÑO</th>");
			htmlBuilder.Append("<th style=\"font-size:7px; text-align: center; padding: 4px; border: 1px solid black;\">MARCA</th>");
			htmlBuilder.Append("<th style=\"font-size:7px; text-align: center; padding: 4px; border: 1px solid black;\">MODELO</th>");
			htmlBuilder.Append("<th style=\"font-size:7px; text-align: center; padding: 4px; border: 1px solid black;\">N° MOTOR</th>");
			htmlBuilder.Append("<th style=\"font-size:7px; text-align: center; padding: 4px; border: 1px solid black;\">CHASIS</th>");
			htmlBuilder.Append("<th style=\"font-size:7px; text-align: center; padding: 4px; border: 1px solid black;\">PLACA</th>");
			htmlBuilder.Append("<th style=\"font-size:7px; text-align: center; padding: 4px; border: 1px solid black;\">N° DE CIRCULACIÓN</th>");
			// Agregar más encabezados según tus necesidades
			htmlBuilder.Append("</tr>");
			// Contenido de la tabla
			foreach (var dato in listaDatos)
			{
				htmlBuilder.Append("<tr>");
				htmlBuilder.Append($"<td style=\"font-size:9px; min-width: 8%; word-break: break-all; padding: 4px; border: 1px solid black;\">{dato.Descripcion}</td>");
				htmlBuilder.Append($"<td style=\"font-size:9px; min-width: 8%; word-break: break-all; padding: 4px; border: 1px solid black;\">{dato.color}</td>");
				htmlBuilder.Append($"<td style=\"font-size:9px; min-width: 8%; word-break: break-all; padding: 4px; border: 1px solid black;\">{dato.Detail_Prendas_Vehiculos?.capacidad_cilindros}</td>");
				htmlBuilder.Append($"<td style=\"font-size:9px; min-width: 8%; word-break: break-all; padding: 4px; border: 1px solid black;\">{dato.Detail_Prendas_Vehiculos?.cantidad_cilindros}</td>");
				htmlBuilder.Append($"<td style=\"font-size:9px; min-width: 8%; word-break: break-all; padding: 4px; border: 1px solid black;\">{dato.Detail_Prendas_Vehiculos?.cantidad_pasajeros}</td>");
				htmlBuilder.Append($"<td style=\"font-size:9px; min-width: 8%; word-break: break-all; padding: 4px; border: 1px solid black;\">{dato.Detail_Prendas_Vehiculos?.year_vehiculo}</td>");
				htmlBuilder.Append($"<td style=\"font-size:9px; min-width: 8%; word-break: break-all; padding: 4px; border: 1px solid black;\">{dato.marca}</td>");
				htmlBuilder.Append($"<td style=\"font-size:9px; min-width: 8%; word-break: break-all; padding: 4px; border: 1px solid black;\">{dato.modelo}</td>");
				htmlBuilder.Append($"<td style=\"font-size:9px; min-width: 8%; word-break: break-all; padding: 4px; border: 1px solid black;\">{dato.Detail_Prendas_Vehiculos?.montor}</td>");
				htmlBuilder.Append($"<td style=\"font-size:9px; min-width: 8%; word-break: break-all; padding: 4px; border: 1px solid black;\">{dato.Detail_Prendas_Vehiculos?.chasis}</td>");
				htmlBuilder.Append($"<td style=\"font-size:9px; min-width: 8%; word-break: break-all; padding: 4px; border: 1px solid black;\">{dato.Detail_Prendas_Vehiculos?.placa}</td>");
				htmlBuilder.Append($"<td style=\"font-size:9px; min-width: 8%; word-break: break-all; padding: 4px; border: 1px solid black;\">{dato.Detail_Prendas_Vehiculos?.circuacion}</td>");
				// Agregar más columnas según las propiedades de tu objeto DatosTabla
				htmlBuilder.Append("</tr>");
			}

			// Cerrar la etiqueta de la tabla
			htmlBuilder.Append("</table>");
			return htmlBuilder.ToString();
		}

		public static string BasicPrendasTable(List<Detail_Prendas> listaDatos)
		{
			StringBuilder htmlBuilder = new StringBuilder();
			// Abrir la etiqueta de la tabla con atributos de estilo para bordes y ancho 100%
			htmlBuilder.Append("<table class='table' style=\"font-size:9px;border-collapse: collapse; width: 100%;\">");
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
				htmlBuilder.Append($"<td style=\"font-size:9px;word-break: break-all; padding: 4px; border: 1px solid black;\">{dato.Descripcion}</td>");
				htmlBuilder.Append($"<td style=\"font-size:9px;word-break: break-all; padding: 4px; border: 1px solid black;\">{dato.color}</td>");
				htmlBuilder.Append($"<td style=\"font-size:9px;word-break: break-all; padding: 4px; border: 1px solid black;\">{dato.marca}</td>");
				htmlBuilder.Append($"<td style=\"font-size:9px;word-break: break-all; padding: 4px; border: 1px solid black;\">{dato.serie}</td>");
				htmlBuilder.Append($"<td style=\"font-size:9px;word-break: break-all; padding: 4px; border: 1px solid black;\">{dato.modelo}</td>");
				// Agregar más columnas según las propiedades de tu objeto DatosTabla
				htmlBuilder.Append("</tr>");
			}

			// Cerrar la etiqueta de la tabla
			htmlBuilder.Append("</table>");
			return htmlBuilder.ToString();
		}

		public static string GenerateCuotesTableHtml(List<Tbl_Cuotas> listaDatos, Catalogo_Clientes cliente, Transaction_Contratos contrato)
		{
			List<Tbl_Cuotas>? objListOrder = listaDatos?.OrderBy(order => order.fecha).ToList();
			StringBuilder htmlBuilder = new StringBuilder();
			// Abrir la etiqueta de la tabla con atributos de estilo para bordes y ancho 100%
			htmlBuilder.Append("<tbody>");
			// Contenido de la tabla
			//double valorInteres = configuraciones.Select(c => Convert.ToDouble(c.Valor)).ToList().Sum() / 100;
			objListOrder?.ForEach(dato =>
			{
				htmlBuilder.Append("<tr>");
				htmlBuilder.Append($"<td class=\"desc\" colspan=\"2\">{dato.fecha?.ToString("dddd, d \"del\" \"mes\" \"de\" MMMM \"del\" \"año\" yyyy", new CultureInfo("es-ES"))}</td>");

				var interesNeto = dato.interes / contrato.tasas_interes * (contrato.DesgloseIntereses?.INTERES_NETO_CORRIENTE / 100);
				var demasCargos = dato.interes - interesNeto;

				htmlBuilder.Append($"<td class=\"val\">{NumberUtility.ConvertToMoneyString(interesNeto * dato.tasa_cambio)}</td>");
				htmlBuilder.Append($"<td class=\"val\">{NumberUtility.ConvertToMoneyString(interesNeto)}</td>");

				htmlBuilder.Append($"<td class=\"val\">{NumberUtility.ConvertToMoneyString(demasCargos * dato.tasa_cambio)}</td>");
				htmlBuilder.Append($"<td class=\"val\">{NumberUtility.ConvertToMoneyString(demasCargos)}</td>");


				htmlBuilder.Append($"<td class=\"val\">{NumberUtility.ConvertToMoneyString(dato.interes * dato.tasa_cambio)}</td>");
				htmlBuilder.Append($"<td class=\"val\">{NumberUtility.ConvertToMoneyString(dato.interes)}</td>");
				htmlBuilder.Append($"<td class=\"val\">{NumberUtility.ConvertToMoneyString(dato.abono_capital * dato.tasa_cambio)}</td>");
				htmlBuilder.Append($"<td class=\"val\">{NumberUtility.ConvertToMoneyString(dato.abono_capital)}</td>");
				htmlBuilder.Append($"<td class=\"val\">{NumberUtility.ConvertToMoneyString(dato.total * dato.tasa_cambio)}</td>");
				htmlBuilder.Append($"<td class=\"val\">{NumberUtility.ConvertToMoneyString(dato.total)}</td>");
				htmlBuilder.Append($"<td class=\"val\">{NumberUtility.ConvertToMoneyString(dato.capital_restante * dato.tasa_cambio)}</td>");
				htmlBuilder.Append($"<td class=\"val\">{NumberUtility.ConvertToMoneyString(dato.capital_restante)}</td>");


				// Agregar más columnas según las propiedades de tu objeto DatosTabla
				htmlBuilder.Append("</tr>");
			});

			// Cerrar la etiqueta de la tabla
			htmlBuilder.Append("</tbody>");
			return htmlBuilder.ToString();
		}
	}


}