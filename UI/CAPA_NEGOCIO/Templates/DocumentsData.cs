using API.Controllers;
using CAPA_DATOS;
using CAPA_NEGOCIO.Utility;
using DataBaseModel;
using Microsoft.Extensions.Configuration;

namespace CAPA_NEGOCIO.Templates
{
	public class DocumentsData
	{
		public string? Header { get; set; }
		public string? WatherMark { get; set; }
		public string? Body { get; set; }
		public string? Footer { get; set; }

		private readonly SshTunnelService _sshTunnelService;

		public DocumentsData()
		{
			_sshTunnelService = new SshTunnelService(LoadConfiguration());
		}

		private IConfigurationRoot LoadConfiguration()
		{
			return new ConfigurationBuilder()
				.SetBasePath(Directory.GetCurrentDirectory())
				.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
				.Build();
		}
		public DocumentsData GetDataFragments(String Identity)
		{
			var User = AuthNetCore.User(Identity);
			var dbUser = new Security_Users { Id_User = User.UserId }.Find<Security_Users>();
			var sucursal = new Catalogo_Sucursales() { Id_Sucursal = dbUser?.Id_Sucursal }.Find<Catalogo_Sucursales>();
			var theme = new PageConfig();
			Header = HtmlContentGetter.ReadHtmlFile("header.html", "Resources/BoletinFragments");
			WatherMark = HtmlContentGetter.ReadHtmlFile("wathermark.html", "Resources/BoletinFragments");
			Footer = HtmlContentGetter.ReadHtmlFile("footer.html", "Resources/BoletinFragments");
			//build header
			Header = Header.Replace("{{ logo }}", theme.MEDIA_IMG_PATH + theme.LOGO_PRINCIPAL)
				.Replace("{{ titulo }}", theme.TITULO)
				.Replace("{{ sub-titulo }}", theme.SUB_TITULO)
				.Replace("{{ email }}", theme.EMAIL)
				.Replace("{{ tel }}", theme.INFO_TEL)
				.Replace("{{ sucursal }}", sucursal?.Descripcion);

			return this;
		}

	

	}
}