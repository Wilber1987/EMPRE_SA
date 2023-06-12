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
    }

    public enum configuracionesEnum
    {
        TITULO, SUB_TITULO, NOMBRE_EMPRESA, LOGO_PRINCIPAL
    }

    public class Config
    {      
        public static PageConfig PageConfig = new PageConfig();
    }

    public class PageConfig{
         public PageConfig()
        {
            SqlADOConexion.IniciarConexionAnonima();
            configuraciones = new Transactional_Configuraciones().Get<Transactional_Configuraciones>();
            TITULO = configuraciones.Find(c => c.Nombre.Equals(configuracionesEnum.TITULO.ToString()))?.Valor ?? TITULO;
            SUB_TITULO = configuraciones.Find(c => c.Nombre.Equals(configuracionesEnum.SUB_TITULO.ToString()))?.Valor ?? SUB_TITULO;
            NOMBRE_EMPRESA = configuraciones.Find(c => c.Nombre.Equals(configuracionesEnum.NOMBRE_EMPRESA.ToString()))?.Valor ?? NOMBRE_EMPRESA;
            LOGO_PRINCIPAL = configuraciones.Find(c => c.Nombre.Equals(configuracionesEnum.LOGO_PRINCIPAL.ToString()))?.Valor ?? LOGO_PRINCIPAL;

        }
        public  string TITULO = "EMPRE S.A.";
        public  string SUB_TITULO = "Prestamos, empeños y más";
        public  string NOMBRE_EMPRESA = "EMPRE S.A.";
        public  string LOGO_PRINCIPAL = "logo1.png";
        public  string MEDIA_IMG_PATH = "/media/img/";
        public  List<Transactional_Configuraciones> configuraciones = new List<Transactional_Configuraciones>();
    }
}
