using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
    public class Tbl_Factura : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? Id_Factura { get; set; }
        public string? Tipo { get; set; }
        public string? Concepto { get; set; }
        public string? Serie { get; set; }
        public string? Forma_Pago { get; set; }
        public string? Direccion_Envio { get; set; }
        public int? Id_Cliente { get; set; }
        public int? Id_Sucursal { get; set; }
        public int? Id_User { get; set; }
        public DateTime? Fecha { get; set; }
        public DateTime? Fecha_Vencimiento { get; set; }
        public string? Observaciones { get; set; }
        public int? Id_Usuario { get; set; }
        public string? Estado { get; set; }
        public Double? Sub_Total { get; set; }
        public Double? Iva { get; set; }
        public Double? Tasa_Cambio { get; set; }
        public Double? Total { get; set; }
        [OneToMany(TableName = "Detalle_Factura", KeyColumn = "Id_Factura", ForeignKeyColumn = "Id_Factura")]
        public List<Detalle_Factura>? Detalle_Factura { get; set; }
    }

}
