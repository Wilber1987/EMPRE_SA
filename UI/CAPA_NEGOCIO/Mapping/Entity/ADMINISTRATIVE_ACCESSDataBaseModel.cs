using CAPA_DATOS;
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
        internal List<Transactional_Configuraciones> GetBeneficios()
        {
            return Get<Transactional_Configuraciones>()
                .Where(x => x.Tipo_Configuracion.Equals(ConfiguracionesTypeEnum.BENEFICIOS.ToString())).ToList();
        }
    }

    public enum ConfiguracionesTypeEnum
    {
        INTERESES, BENEFICIOS, THEME
    }

    public enum ConfiguracionesThemeEnum
    {
        TITULO, SUB_TITULO, NOMBRE_EMPRESA, LOGO_PRINCIPAL
    }

    public enum ConfiguracionesInteresesEnum
    {
        INTERES_MORA
    }

    public enum ConfiguracionesBeneficiosEnum
    {
        BENEFICIO_VENTA_ARTICULO_COMPRADO, BENEFICIO_VENTA_ARTICULO_EMPENO
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
            SqlADOConexion.IniciarConexionAnonima();
            configuraciones = new Transactional_Configuraciones().Get<Transactional_Configuraciones>();
            TITULO = configuraciones.Find(c => c.Nombre.Equals(ConfiguracionesThemeEnum.TITULO.ToString()))?.Valor ?? TITULO;
            SUB_TITULO = configuraciones.Find(c => c.Nombre.Equals(ConfiguracionesThemeEnum.SUB_TITULO.ToString()))?.Valor ?? SUB_TITULO;
            NOMBRE_EMPRESA = configuraciones.Find(c => c.Nombre.Equals(ConfiguracionesThemeEnum.NOMBRE_EMPRESA.ToString()))?.Valor ?? NOMBRE_EMPRESA;
            LOGO_PRINCIPAL = configuraciones.Find(c => c.Nombre.Equals(ConfiguracionesThemeEnum.LOGO_PRINCIPAL.ToString()))?.Valor ?? LOGO_PRINCIPAL;

        }
        public string TITULO = "EMPRE S.A.";
        public string SUB_TITULO = "Prestamos, empeños y más";
        public string NOMBRE_EMPRESA = "EMPRE S.A.";
        public string LOGO_PRINCIPAL = "logo1.png";
        public string MEDIA_IMG_PATH = "/media/img/";
        public List<Transactional_Configuraciones> configuraciones = new List<Transactional_Configuraciones>();
    }
}
