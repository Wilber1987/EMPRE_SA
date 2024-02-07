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

        internal object? UpdateConfig(string? identity)
        {
            if (!AuthNetCore.HavePermission(CAPA_DATOS.Security.PermissionsEnum.ADMIN_ACCESS.ToString(), identity))
            {
                throw new Exception("no tienes permisos para configurar la aplicación");
            }
            if (Nombre.Equals(GeneralDataEnum.FIRMA_DIGITAL_APODERADO.ToString()))
            {
                var pic = (ModelFiles)FileService.upload("profiles\\", new ModelFiles
                {
                    Value = Valor,
                    Type = "png",
                    Name = "profile"
                }).body;
                //Valor = pic.Value.Replace("wwwroot", "");
            }
            return this.Update();
        }
    }

    public enum ConfiguracionesTypeEnum
    {
        INTERESES, BENEFICIOS, THEME, INTERESES_MORA,
        GENERAL_DATA
    }

    public enum ConfiguracionesThemeEnum
    {
        TITULO, SUB_TITULO, NOMBRE_EMPRESA, LOGO_PRINCIPAL
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
        GESTIONES_CREDITICIAS
    }

    public enum GeneralDataEnum
    {
        APODERADO, FIRMA_DIGITAL_APODERADO,  DATOS_APODERADO
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
            ///SqlADOConexion.IniciarConexion("sa", "zaxscd", ".", "EMPRE_SA");
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
        public string MEDIA_IMG_PATH = "/Media/img/";
        public List<Transactional_Configuraciones> configuraciones = new List<Transactional_Configuraciones>();
    }
}
