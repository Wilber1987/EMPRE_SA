using API.Controllers;
using APPCORE.Util;
using Business;
using DataBaseModel;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.Extensions.Configuration;

namespace CAPA_NEGOCIO.SystemConfig
{
	public class DocumentsData
	{
		public string? Header { get; set; }
		public string? WatherMark { get; set; }
		public string? Body { get; set; }
		public string? Footer { get; set; }


		public DocumentsData GetDataFragments(String Identity)
		{
			var User = AuthNetCore.User(Identity);
			var dbUser = new Business.Security_Users { Id_User = User.UserId }.Find<Security_Users>();
			var sucursal = new Catalogo_Sucursales() { Id_Sucursal = dbUser?.Id_Sucursal }.Find<Catalogo_Sucursales>();
			var theme = new SystemConfig();
			Header = HtmlContentGetter.ReadHtmlFile("header.html", "Resources/Fragments");
			Footer = HtmlContentGetter.ReadHtmlFile("footer.html", "Resources/Fragments");
			//build header
			Header = Header.Replace("{{ logo }}", theme.MEDIA_IMG_PATH + theme.LOGO_PRINCIPAL)
				.Replace("{{ titulo }}", theme.TITULO)
				.Replace("{{ sub-titulo }}", theme.SUB_TITULO)
				.Replace("{{ email }}", theme.EMAIL)
				.Replace("{{ tel }}", theme.INFO_TEL)
				.Replace("{{ ruc }}", theme.RUC)
				.Replace("{{ sucursal }}", sucursal?.Descripcion);

			return this;
		}

		public static string GetReciboTemplate()
		{
			//var User = AuthNetCore.User(Identity);
			//var dbUser = new Business.Security_Users { Id_User = User.UserId }.Find<Security_Users>();
			//var sucursal = new Catalogo_Sucursales() { Id_Sucursal = dbUser?.Id_Sucursal }.Find<Catalogo_Sucursales>();
			//var theme = new SystemConfig();

			var theme = new SystemConfig();
			return HtmlContentGetter.ReadHtmlFile("reciboTemplate.html", "Resources/Recibos").Replace("{{ logo }}", theme.MEDIA_IMG_PATH + theme.LOGO_PRINCIPAL)
				.Replace("{{ titulo }}", theme.TITULO)
				.Replace("{{ ruc }}", theme.RUC)
				.Replace("{{ sub-titulo }}", theme.SUB_TITULO)
				.Replace("{{ email }}", theme.EMAIL)
				.Replace("{{ ruc }}", theme.RUC)
				.Replace("{{ info_tel }}", theme.INFO_TEL);

		}



		public static string GetReciboTemplateApartado()
		{
			//var User = AuthNetCore.User(Identity);
			//var dbUser = new Business.Security_Users { Id_User = User.UserId }.Find<Security_Users>();
			//var sucursal = new Catalogo_Sucursales() { Id_Sucursal = dbUser?.Id_Sucursal }.Find<Catalogo_Sucursales>();
			var theme = new SystemConfig();
			string TEMPLATE = HtmlContentGetter.ReadHtmlFile("reciboApartadoTemplate.html", "Resources/Recibos")
				.Replace("{{ logo }}", theme.MEDIA_IMG_PATH + theme.LOGO_PRINCIPAL)
				.Replace("{{ titulo }}", theme.TITULO)
				.Replace("{{ ruc }}", theme.RUC)
				.Replace("{{ sub-titulo }}", theme.SUB_TITULO)
				.Replace("{{ email }}", theme.EMAIL)
				.Replace("{{ info_tel }}", theme.INFO_TEL);
			return TEMPLATE;
		}

		public static string GetContratosEmpenoDataFragments()
		{
			//var User = AuthNetCore.User(Identity);
			//var dbUser = new Business.Security_Users { Id_User = User.UserId }.Find<Security_Users>();
			//var sucursal = new Catalogo_Sucursales() { Id_Sucursal = dbUser?.Id_Sucursal }.Find<Catalogo_Sucursales>();
			var theme = new SystemConfig();
			var Body = HtmlContentGetter.ReadHtmlFile("ContratoDeudor.html", "Resources/Contracts");
			var Header = HtmlContentGetter.ReadHtmlFile("contractHeader.html", "Resources/Contracts/ContractFragments");
			var Footer = HtmlContentGetter.ReadHtmlFile("contractFooter.html", "Resources/Contracts/ContractFragments");
			var style = HtmlContentGetter.ReadHtmlFile("style.html", "Resources/Contracts/ContractFragments");
			var tableBody = HtmlContentGetter.ReadHtmlFile("tableCuotas.html", "Resources/Contracts/ContractFragments");
			//build header
			var templateBody = Body
				/*.Replace("{{ logo }}", theme.MEDIA_IMG_PATH + theme.LOGO_PRINCIPAL)
				.Replace("{{ titulo }}", theme.TITULO)
				.Replace("{{ sub-titulo }}", theme.SUB_TITULO)
				.Replace("{{ email }}", theme.EMAIL)
				.Replace("{{ tel }}", theme.INFO_TEL)*/

				//partes del contrato
				.Replace("{{ style }}", style)
				.Replace("{{ header }}", Header)
				.Replace("{{ contract-title }}", "CONTRATO DE MUTUO Y PRÉSTAMO GARANTIZADO CON PRENDA COMERCIAL")
				//.Replace("{tableArticulos}", sucursal?.Descripcion)
				.Replace("{{ tableCuotas }}", tableBody)
				.Replace("{{ footer }}", Footer);

			return templateBody;
		}
	}
}