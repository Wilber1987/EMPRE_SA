using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using APPCORE;

namespace CatalogDataBaseModel
{
    public class Catalogo_Cambio_Divisa : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? Id_cambio { get; set; }
        public DateTime? Fecha { get; set; }
        public double? Valor_de_compra { get; set; }
        public double? Valor_de_venta { get; set; }
        public string? Moneda { get; set; }
       // public new string? Moneda { get { return "DOLAR"; } set { } }
    }
}