using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Permisos_Cuentas : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? id_permiso { get; set; }
       public int? id_categoria_cuenta_origen { get; set; }
       public int? id_categoria_cuenta_destino { get; set; }
       public bool? permite_debito { get; set; }
       public bool? permite_credito { get; set; }
       [ManyToOne(TableName = "Categoria_Cuentas", KeyColumn = "id_categoria", ForeignKeyColumn = "id_categoria_cuenta_origen")]
       public Categoria_Cuentas? Categoria_Cuentas_id_categoria_cuenta_origen { get; set; }
       [ManyToOne(TableName = "Categoria_Cuentas", KeyColumn = "id_categoria", ForeignKeyColumn = "id_categoria_cuenta_destino")]
       public Categoria_Cuentas? Categoria_Cuentas_id_categoria_cuenta_destino { get; set; }
   }
}
