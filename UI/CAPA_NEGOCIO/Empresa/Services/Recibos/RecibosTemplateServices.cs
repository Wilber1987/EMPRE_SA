using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CAPA_DATOS;
using CAPA_DATOS.Services;
using CAPA_NEGOCIO.Services;
using DataBaseModel;

namespace UI.CAPA_NEGOCIO.Empresa.Services.Recibos
{

	public class RecibosTemplateServices
	{
		public int? id_recibo { get; set; }

		public object? PrintRecibo(string token)
		{
			try
			{
				Transaccion_Factura? factura = new Transaccion_Factura() { id_factura = this.id_recibo }.Find<Transaccion_Factura>();
				if (factura?.estado == EstadoEnum.ANULADO.ToString())
				{
					return new ResponseService()
					{
						status = 200,
						message = "RECIBO ANULADO",
						body = new
						{
							isRecibo = false,
							isReestrutured = factura?.Factura_contrato?.reestructuracion != 0,
							isCancelledWithLostDocument = factura?.Factura_contrato?.cancel_with_perdida

						}
					};
				}

				bool isRecibo = (factura?.Factura_contrato?.reestructuracion == 0)
				&& (factura?.Factura_contrato?.perdida_de_documento == 0);
				//templateContent.Add(GenerateReciboHtmlTemplate(factura));
				List<object> templateContent = [ new
				{
					type= DocType.RECIBO.ToString(),
					body= GenerateReciboHtmlTemplate(factura)
				}];
				if (factura?.Factura_contrato?.reestructuracion != 0)
				{
					templateContent.Add(new
					{
						type = DocType.REESTRUCTURE_TABLE.ToString(),
						body = GenerateReestructureTable(factura)
					});
				}



				return new ResponseService()
				{
					status = 200,
					message = "Success",
					body = new
					{
						isRecibo = isRecibo,
						isReestrutured = factura?.Factura_contrato?.reestructuracion != 0,
						isCancelledWithLostDocument = factura?.Factura_contrato?.cancel_with_perdida,
						documents = templateContent
					}
				};
			}
			catch (System.Exception ex)
			{
				return new ResponseService()
				{
					status = 500,
					message = "Error, intentelo nuevamente " + ex.Message
				};
			}
		}

		public string? GenerateReestructureTable(Transaccion_Factura? factura)
		{
			string templateContent = RecibosTemplates.ReestructureTable;
			Transaction_Contratos? model = new Transaction_Contratos() { numero_contrato = factura?.Factura_contrato?.numero_contrato }.Find<Transaction_Contratos>();
			List<Transactional_Configuraciones> configuraciones_theme = new Transactional_Configuraciones().GetTheme();
			var configuraciones_generales = new Transactional_Configuraciones().GetGeneralData();
			Catalogo_Clientes? cliente = model?.Catalogo_Clientes?.Find<Catalogo_Clientes>();
			double valorInteres = model?.DesgloseIntereses?.GetPorcentageInteresesSGC() ?? 0;

			Datos_Reestructuracion? datos_Reestructuracion = factura?.Factura_contrato?.Datos_Reestructuracion;

			templateContent = templateContent
				.Replace("{{cuotafija}}", NumberUtility.ConvertToMoneyString(model?.cuotafija))
				.Replace("{{numero_contrato}}", model?.numero_contrato?.ToString("D9"))
				.Replace("{{logo}}", "data:image/png;base64," + configuraciones_theme.Find(c => c.Nombre == ConfiguracionesThemeEnum.LOGO.ToString())?.Valor)

				.Replace("{{Valoracion_empeño_cordobas}}", NumberUtility.ConvertToMoneyString(datos_Reestructuracion?.Nuevo_Monto_Cordobas))
				.Replace("{{Valoracion_empeño_dolares}}", NumberUtility.ConvertToMoneyString(datos_Reestructuracion?.Nuevo_Monto))
				.Replace("{{cuotafija}}", NumberUtility.ConvertToMoneyString(datos_Reestructuracion?.Nueva_Cuota_Cordobas))
				.Replace("{{cuotafija_dolares}}", NumberUtility.ConvertToMoneyString(datos_Reestructuracion?.Nuevo_Cuota))
				.Replace("{{plazo}}", NumberUtility.ConvertToMoneyString(datos_Reestructuracion?.Nuevo_Plazo))

				.Replace("{{interes_inicial}}", model?.DesgloseIntereses?.INTERES_NETO_CORRIENTE.ToString())
				.Replace("{{sum_intereses}}", (valorInteres + Convert.ToDouble(cliente?.Catalogo_Clasificacion_Interes?.porcentaje - 1)).ToString())

				.Replace("{{datos_apoderado_vicepresidente}}", configuraciones_generales.Find(c => c.Nombre == GeneralDataEnum.APODERADO_VICEPRESIDENTE.ToString())?.Valor)
				.Replace("{{resumen_datos_apoderado_vicepresidente}}", configuraciones_generales.Find(c => c.Nombre == GeneralDataEnum.DATOS_APODERADO_VICEPRESIDENTE.ToString())?.Valor)
				.Replace("{{firma_vicepresidente}}", configuraciones_generales.Find(c => c.Nombre == GeneralDataEnum.FIRMA_DIGITAL_APODERADO_VICEPRESIDENTE.ToString())?.Valor)
				.Replace("{{cedula_apoderado_vicepresidente}}", configuraciones_generales.Find(c => c.Nombre == GeneralDataEnum.CEDULA_APODERADO_VICEPRESIDENTE.ToString())?.Valor)

				.Replace("{{datos_apoderado}}", configuraciones_generales.Find(c => c.Nombre == GeneralDataEnum.APODERADO.ToString())?.Valor)
				.Replace("{{resumen_datos_apoderado}}", configuraciones_generales.Find(c => c.Nombre == GeneralDataEnum.DATOS_APODERADO.ToString())?.Valor)
				.Replace("{{firma}}", configuraciones_generales.Find(c => c.Nombre == GeneralDataEnum.FIRMA_DIGITAL_APODERADO.ToString())?.Valor)
				.Replace("{{cedula_apoderado}}", configuraciones_generales.Find(c => c.Nombre == GeneralDataEnum.CEDULA_APODERADO.ToString())?.Valor)

				.Replace("{{fecha_restructuracion}}", factura?.fecha?.ToString("dddd, d \"del\" \"mes\" \"de\" MMMM \"del\" \"año\" yyyy"))
				.Replace("{{tabla_articulos}}", ContractTemplateService.GeneratePrendasTableHtml(model?.Detail_Prendas,
					model?.tipo?.Equals(Contratos_Type.EMPENO_VEHICULO.ToString()) == true))
				.Replace("{{tbody_amortizacion}}", ContractTemplateService.GenerateCuotesTableHtml(factura?.Factura_contrato?.Datos_Reestructuracion?.Cuotas_reestructuradas,
					cliente, model));

			return ContractTemplateService.RenderTemplate(templateContent, cliente);
		}

		public string GenerateReciboHtmlTemplate(Transaccion_Factura? factura)
		{
			var contrato = new Transaction_Contratos() { numero_contrato = factura?.Factura_contrato?.numero_contrato }.Find<Transaction_Contratos>();

			var dbUser = new Security_Users { Id_User = factura?.id_usuario }.Find<Security_Users>();

			var sucursal = new Catalogo_Sucursales() { Id_Sucursal = dbUser?.Id_Sucursal }.Find<Catalogo_Sucursales>();

			var cliente = contrato?.Catalogo_Clientes?.Find<Catalogo_Clientes>();

			string templateContent = RecibosTemplates.recibo;

			var ultimoDetalle = factura?.Detalle_Factura_Recibo?.OrderByDescending(d => d.id).FirstOrDefault();
			var detalleIds = factura?.Detalle_Factura_Recibo?.Select(d => d.id_cuota.ToString()).ToArray();

			List<Tbl_Cuotas?>? cuotas = factura?.Detalle_Factura_Recibo?.Select(r => r.Tbl_Cuotas).ToList();

			var cuotasPendiente = new Tbl_Cuotas { numero_contrato = factura?.Factura_contrato?.numero_contrato }
				.Where<Tbl_Cuotas>(FilterData.NotIn("id_cuota", detalleIds)).OrderBy(c => c.id_cuota).ToList();

			var configuraciones_theme = new Transactional_Configuraciones().GetTheme();

			templateContent = templateContent.Replace("{{recibo_num}}", factura?.Consecutivo)
			.Replace("{{logo}}", "data:image/png;base64," + configuraciones_theme.Find(c => c.Nombre == ConfiguracionesThemeEnum.LOGO.ToString())?.Valor)
			.Replace("{{cambio}}", NumberUtility.ConvertToMoneyString(factura?.tasa_cambio))
			.Replace("{{fecha}}", factura?.fecha?.ToString("dddd, d \"del\" \"mes\" \"de\" MMMM \"del\" \"año\" yyyy \"a las\" h:mm tt"))
			.Replace("{{tipo}}", getTipo(factura.concepto))
			.Replace("{{sucursal}}", sucursal?.Nombre)
			.Replace("{{cajero}}", dbUser?.Nombres)
			.Replace("{{cliente}}", contrato?.Catalogo_Clientes?.primer_nombre + " " + contrato?.Catalogo_Clientes?.primer_apellido + " " + contrato?.Catalogo_Clientes?.segundo_apellidio)
			.Replace("{{clasificacion}}", cliente?.Catalogo_Clasificacion_Interes?.porcentaje.ToString() ?? "")
			.Replace("{{categoria}}", GetTipoArticulo(contrato?.Detail_Prendas))
			.Replace("{{cuotas}}", contrato.plazo.ToString())
			.Replace("{{cuotas_pendientes}}", cuotasPendiente.Count.ToString())
			.Replace("{{saldo_anterior}}", NumberUtility.ConvertToMoneyString(factura?.Factura_contrato?.saldo_anterior))

			.Replace("{{saldo_anterior_cordobas}}", NumberUtility.ConvertToMoneyString(factura?.Factura_contrato?.saldo_anterior * factura?.tasa_cambio))
			.Replace("{{total_pagado}}", NumberUtility.ConvertToMoneyString(factura?.total * factura?.tasa_cambio))
			.Replace("{{total_pagado_dolares}}", NumberUtility.ConvertToMoneyString(factura?.total))
			.Replace("{{reestructuracion}}", NumberUtility.ConvertToMoneyString((factura?.Factura_contrato?.reestructuracion ?? 0) * factura?.tasa_cambio))
			.Replace("{{reestructuracion_dolares}}", NumberUtility.ConvertToMoneyString(factura?.Factura_contrato?.reestructuracion ?? 0))
			.Replace("{{perdida_doc}}", NumberUtility.ConvertToMoneyString((factura?.Factura_contrato?.perdida_de_documento ?? 0) * factura?.tasa_cambio))
			.Replace("{{perdida_doc_dolares}}", NumberUtility.ConvertToMoneyString(factura?.Factura_contrato?.perdida_de_documento ?? 0))
			.Replace("{{mora}}", NumberUtility.ConvertToMoneyString(factura?.Factura_contrato?.mora_pagado * factura?.tasa_cambio))
			.Replace("{{mora_dolares}}", NumberUtility.ConvertToMoneyString(factura?.Factura_contrato?.mora_pagado))
			.Replace("{{idcp}}", NumberUtility.ConvertToMoneyString(factura?.Factura_contrato?.interes_pagado * factura?.tasa_cambio))
			.Replace("{{idcp_dolares}}", NumberUtility.ConvertToMoneyString(factura?.Factura_contrato?.interes_pagado))
			.Replace("{{abono_capital}}", NumberUtility.ConvertToMoneyString(factura?.Factura_contrato?.abono_capital * factura?.tasa_cambio))
			.Replace("{{abono_capital_dolares}}", NumberUtility.ConvertToMoneyString(factura?.Factura_contrato?.abono_capital))
			.Replace("{{saldo_actual_cordobas}}", NumberUtility.ConvertToMoneyString(factura?.Factura_contrato?.saldo_actual * factura?.tasa_cambio))
			.Replace("{{saldo_actual_dolares}}", NumberUtility.ConvertToMoneyString(factura?.Factura_contrato?.saldo_actual))
			.Replace("{{proximo_pago}}", cuotasPendiente.Count != 0 ? cuotasPendiente.First()?.fecha?.ToString("dd/MM/yyyy") : "-");
			return templateContent;
		}

		private string getTipo(string? concepto)
		{
			if (concepto?.ToLower().Contains("reestructuración") == true)
			{
				return "REESTRUCTURACIÓN";
			} else if (concepto?.ToLower().Contains("interés + mora") == true)
			{
				return "INTERES + MORA";
			} else if (concepto?.ToLower().Contains("abono al capital") == true)
			{
				return "ABONO AL CAPITAL";
			} else if (concepto?.ToLower().Contains("cancelación") == true)
			{
				return "CANCELACIÓN";
			} else if (concepto?.ToLower().Contains("pago de cuota") == true)
			{
				return "PAGO CUOTA";
			} else if (concepto?.ToLower().Contains("parcial") == true)
			{
				return "PARCIAL";
			} else 
			{
				return "";
			}
		}

		public string? GetTipoArticulo(List<Detail_Prendas> Detail_Prendas)
		{
			var isVehiculo = Detail_Prendas.Find(p => p.Catalogo_Categoria?.descripcion == "vehiculos");
			if (isVehiculo != null) return isVehiculo?.Catalogo_Categoria?.descripcion;

			var isElectronico = Detail_Prendas.Find(p => p.Catalogo_Categoria?.descripcion == "electronico");
			if (isElectronico != null) return isElectronico?.Catalogo_Categoria?.descripcion;

			return Detail_Prendas[0].Catalogo_Categoria?.descripcion;
		}

		private enum DocType
		{
			RECIBO,
			REESTRUCTURE_TABLE
		}
	}

}