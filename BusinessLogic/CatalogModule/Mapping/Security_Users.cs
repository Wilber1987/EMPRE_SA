using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CatalogDataBaseModel
{
    public class Security_Users : APPCORE.Security.Security_Users
    {
        public int? Id_Sucursal { get; set; }
    }
}