using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Catalogo_Inversores : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? id_inversor { get; set; }
       public string? nombre { get; set; }
       public string? direccion { get; set; }
       public int? id_municipio { get; set; }
       public string? estado_civil { get; set; }
       public string? identificacion { get; set; }
       public string? telefono { get; set; }
       public int? id_nacionalidad { get; set; }
       [ManyToOne(TableName = "Catalogo_Municipio", KeyColumn = "id_municipio", ForeignKeyColumn = "id_municipio")]
       public Catalogo_Municipio? Catalogo_Municipio { get; set; }
       [ManyToOne(TableName = "Catalogo_Nacionalidad", KeyColumn = "id_nacionalidad", ForeignKeyColumn = "id_nacionalidad")]
       public Catalogo_Nacionalidad? Catalogo_Nacionalidad { get; set; }
       [OneToMany(TableName = "Transaction_Contratos_Inversionistas", KeyColumn = "id_inversor", ForeignKeyColumn = "id_inversor")]
       public List<Transaction_Contratos_Inversionistas>? Transaction_Contratos_Inversionistas { get; set; }
   }
}
