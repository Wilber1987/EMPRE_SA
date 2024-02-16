using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Categoria_Cuentas : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? id_categoria { get; set; }
       public string? descripcion { get; set; }
       [OneToMany(TableName = "Catalogo_Cuentas", KeyColumn = "id_categoria", ForeignKeyColumn = "id_categoria")]
       public List<Catalogo_Cuentas>? Catalogo_Cuentas { get; set; }
       [OneToMany(TableName = "Permisos_Cuentas", KeyColumn = "id_categoria", ForeignKeyColumn = "id_categoria_cuenta_destino")]
       public List<Permisos_Cuentas>? Permisos_Cuentas_id_categoria_cuenta_destino { get; set; }
       [OneToMany(TableName = "Permisos_Cuentas", KeyColumn = "id_categoria", ForeignKeyColumn = "id_categoria_cuenta_origen")]
       public List<Permisos_Cuentas>? Permisos_Cuentas_id_categoria_cuenta_origen { get; set; }
   }
}
