using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CAPA_DATOS;

namespace DataBaseModel
{
    public class Catalogo_Cambio_Divisa : CatalogDataBaseModel.Catalogo_Cambio_Divisa
    {
        public new string? Moneda { get { return "DOLAR"; }  set {}}
        
    }
    public class Catalogo_Departamento : CatalogDataBaseModel.Catalogo_Departamento
    {
    }
    public class Catalogo_Nacionalidad : CatalogDataBaseModel.Catalogo_Nacionalidad
    {
    }
    public class Catalogo_Municipio : CatalogDataBaseModel.Catalogo_Municipio
    {
    }


}