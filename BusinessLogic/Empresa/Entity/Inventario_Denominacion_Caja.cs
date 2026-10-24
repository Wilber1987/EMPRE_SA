using System;
using APPCORE;
using DataBaseModel;

namespace Transactions
{
    public class Inventario_Denominacion_Caja : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? id_inventario { get; set; }
        public int? id_cuenta { get; set; }
        public int? id_denominacion { get; set; }
        public int? cantidad_actual { get; set; }
        public DateTime? ultima_actualizacion { get; set; }
        
        //[ManyToOne(TableName = "Catalogo_Cuentas", KeyColumn = "id_cuentas", ForeignKeyColumn = "id_cuenta")]
        //public Catalogo_Cuentas? Catalogo_Cuentas { get; set; }
        
        [ManyToOne(TableName = "Denominacion_Catalogo", KeyColumn = "id_denominacion", ForeignKeyColumn = "id_denominacion")]
        public Denominacion_Catalogo? Denominacion_Catalogo { get; set; }
    }
}