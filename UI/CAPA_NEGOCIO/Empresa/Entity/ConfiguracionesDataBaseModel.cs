using API.Controllers;
using CAPA_DATOS;
using CAPA_DATOS.Services;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel
{
	public class Transactional_Configuraciones : EntityClass
	{
		[PrimaryKey(Identity = true)]
		public int? Id_Configuracion { get; set; }
		public string? Nombre { get; set; }
		public string? Descripcion { get; set; }
		public string? Valor { get; set; }
		public string? Tipo_Configuracion { get; set; }
		internal Transactional_Configuraciones GetConfig(String prop)
		{			
			Nombre = prop;
			return Find<Transactional_Configuraciones>();
		}

		internal List<Transactional_Configuraciones> GetIntereses()
		{
			return Get<Transactional_Configuraciones>()
				.Where(x => x.Tipo_Configuracion.Equals(ConfiguracionesTypeEnum.INTERESES.ToString())).ToList();
		}
		internal List<Transactional_Configuraciones> GetTheme()
		{
			return Get<Transactional_Configuraciones>()
				.Where(x => x.Tipo_Configuracion.Equals(ConfiguracionesTypeEnum.THEME.ToString())).ToList();
		}
		internal List<Transactional_Configuraciones> GetTypeNumbers()
		{
			return Get<Transactional_Configuraciones>()
				.Where(x => x.Tipo_Configuracion.Equals(ConfiguracionesTypeEnum.NUMBER.ToString())).ToList();
		}
		internal List<Transactional_Configuraciones> GetBeneficios()
		{
			return Get<Transactional_Configuraciones>()
				.Where(x => x.Tipo_Configuracion.Equals(ConfiguracionesTypeEnum.BENEFICIOS.ToString())).ToList();
		}

		internal List<Transactional_Configuraciones>  GetGeneralData()
		{
			return Get<Transactional_Configuraciones>()
			   .Where(x => x.Tipo_Configuracion.Equals(ConfiguracionesTypeEnum.GENERAL_DATA.ToString())).ToList();
		}
		
		static internal int GetBeneficioVentaArticulo()
		{
			return Convert.ToInt32(GetParam(ConfiguracionesThemeEnum.BENEFICIO_VENTA_ARTICULO_COMPRADO, "45", ConfiguracionesTypeEnum.BENEFICIOS).Valor);
		}
		static internal int GetPorcentajesApartado()
		{
			return Convert.ToInt32(GetParam(ConfiguracionesThemeEnum.PORCENTAGE_APARTADO, "60", ConfiguracionesTypeEnum.BENEFICIOS).Valor);
		}

		internal object? UpdateConfig(string? identity)
		{
			if (!AuthNetCore.HavePermission(CAPA_DATOS.Security.Permissions.ADMIN_ACCESS.ToString(), identity))
			{
				throw new Exception("no tienes permisos para configurar la aplicación");
			}
			/*if (Nombre!.Equals(GeneralDataEnum.FIRMA_DIGITAL_APODERADO.ToString()))
			{
				ModelFiles? pic = (ModelFiles?)FileService.upload("profiles\\", new ModelFiles
				{
					Value = Valor,
					Type = "png",
					Name = "profile"
				}).body;
				Valor = pic?.Value?.Replace("wwwroot", "");
			}*/
			return this.Update();
		}			
		
		public static Transactional_Configuraciones GetParam(ConfiguracionesThemeEnum prop, string defaultValor = "", ConfiguracionesTypeEnum TYPE = ConfiguracionesTypeEnum.THEME)
		{

			var find = new Transactional_Configuraciones
			{
				Nombre = prop.ToString(),
			}.Find<Transactional_Configuraciones>();
			if (find == null)
			{
				find = new Transactional_Configuraciones
				{
					Valor = defaultValor,
					Descripcion = prop.ToString(),
					Nombre = prop.ToString(),
					Tipo_Configuracion = TYPE.ToString()
				};
				find.Save();
			}
			return find;
		}        
        internal static int GetNumeroCuotasQuincenales(double? value)
        {
            if (value >= 61) 
            {
				return 4;
            } else if (value >= 31)
			{
				return 3;
			} else 
			{
				return 2;
			}
        }

        internal static double GetPorcentageMinimoPagoApartadoMensual()
        {
            return Convert.ToInt32(GetParam(ConfiguracionesThemeEnum.PORCENTAGE_MINIMO_DE_PAGO_APARTADO_MENSUAL, "35", ConfiguracionesTypeEnum.BENEFICIOS).Valor);
        }
    }

	public enum ConfiguracionesTypeEnum
	{
		INTERESES, BENEFICIOS, THEME, INTERESES_MORA,
		GENERAL_DATA, NUMBER
	}

	public enum ConfiguracionesThemeEnum
	{
		TITULO, SUB_TITULO, NOMBRE_EMPRESA, LOGO_PRINCIPAL,
		LOGO,
		INFO_TEL, 
		BENEFICIO_VENTA_ARTICULO_COMPRADO,
        PORCENTAGE_APARTADO,
        PORCENTAGE_MINIMO_DE_PAGO_APARTADO_MENSUAL
    }

	public enum ConfiguracionesInteresesEnum
	{
		MORA_CONTRATOS_EMP
	}

	public enum InteresesPrestamosEnum
	{
		GASTOS_ADMINISTRATIVOS,
		COMISIONES,
		MANTENIMIENTO_VALOR,
		GASTOS_LEGALES,
		INTERES_NETO_CORRIENTE
	}

	public enum GeneralDataEnum
	{
		APODERADO, FIRMA_DIGITAL_APODERADO,  DATOS_APODERADO,
		APODERADO_VICEPRESIDENTE,
		DATOS_APODERADO_VICEPRESIDENTE,
		FIRMA_DIGITAL_APODERADO_VICEPRESIDENTE,
		CEDULA_APODERADO,
		CEDULA_APODERADO_VICEPRESIDENTE, RUC,
		EMAIL,
		INFO_TEL
	}



	public enum ConfiguracionesBeneficiosEnum
	{
		BENEFICIO_VENTA_ARTICULO_COMPRADO, BENEFICIO_VENTA_ARTICULO_EMPENO
	}
	public enum ConfiguracionesVencimientos
	{
		VENCIMINETO_VALORACION, VENCIMIENTO_CONTRATO
	}

	public class Config
	{
		public static PageConfig pageConfig()
		{
			return new PageConfig();
		}
	}

	public class PageConfig
	{
		public PageConfig()
		{
			configuraciones = new Transactional_Configuraciones().Get<Transactional_Configuraciones>();
			RUC = configuraciones.Find(c => c.Nombre.Equals(GeneralDataEnum.RUC.ToString()))?.Valor ?? RUC;
			EMAIL = configuraciones.Find(c => c.Nombre.Equals(GeneralDataEnum.EMAIL.ToString()))?.Valor ?? EMAIL;
			INFO_TEL = configuraciones.Find(c => c.Nombre.Equals(GeneralDataEnum.INFO_TEL.ToString()))?.Valor ?? INFO_TEL;
			TITULO = configuraciones.Find(c => c.Nombre.Equals(ConfiguracionesThemeEnum.TITULO.ToString()))?.Valor ?? TITULO;
			SUB_TITULO = configuraciones.Find(c => c.Nombre.Equals(ConfiguracionesThemeEnum.SUB_TITULO.ToString()))?.Valor ?? SUB_TITULO;
			NOMBRE_EMPRESA = configuraciones.Find(c => c.Nombre.Equals(ConfiguracionesThemeEnum.NOMBRE_EMPRESA.ToString()))?.Valor ?? NOMBRE_EMPRESA;
			LOGO_PRINCIPAL = configuraciones.Find(c => c.Nombre.Equals(ConfiguracionesThemeEnum.LOGO_PRINCIPAL.ToString()))?.Valor ?? LOGO_PRINCIPAL;
			
			GetPorcentageMinimoPagoApartadoMensual = Transactional_Configuraciones.GetPorcentageMinimoPagoApartadoMensual();
			GetBeneficioVentaArticulo = Transactional_Configuraciones.GetBeneficioVentaArticulo();
			GetPorcentajesApartado = Transactional_Configuraciones.GetPorcentajesApartado();

		}
		public string TITULO = "EMPRE S.A.";
		public string RUC = "EMPRE-0001";
		public string SUB_TITULO = "Prestamos, empeños y más";
		public string NOMBRE_EMPRESA = "EMPRE S.A.";
		public string LOGO_PRINCIPAL = "logo1.png";
		public string MEDIA_IMG_PATH = "/Media/img/";
		public List<Transactional_Configuraciones> configuraciones = new List<Transactional_Configuraciones>();

		public string EMAIL = "correo@correo.net";
		public string INFO_TEL = "000000000";
		public int GetNumeroCuotasQuincenales { get; set; }
		public int GetBeneficioVentaArticulo { get;set; }
		public int GetPorcentajesApartado { get;set; }
		public double GetPorcentageMinimoPagoApartadoMensual { get;set; }
	}
}
