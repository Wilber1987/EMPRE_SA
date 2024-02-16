using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Catalogo_Departamento : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? id_departamento { get; set; }
       public string? nombre { get; set; }
       public int? id_nacionalidad { get; set; }
       public int? ponderacion { get; set; }
       public int? puntaje { get; set; }
       public string? clasificacion { get; set; }
       [ManyToOne(TableName = "Catalogo_Nacionalidad", KeyColumn = "id_nacionalidad", ForeignKeyColumn = "id_nacionalidad")]
       public Catalogo_Nacionalidad? Catalogo_Nacionalidad { get; set; }
       [OneToMany(TableName = "Catalogo_Clientes", KeyColumn = "id_departamento", ForeignKeyColumn = "id_departamento")]
       public List<Catalogo_Clientes>? Catalogo_Clientes { get; set; }
       [OneToMany(TableName = "Catalogo_Municipio", KeyColumn = "id_departamento", ForeignKeyColumn = "id_departamento")]
       public List<Catalogo_Municipio>? Catalogo_Municipio { get; set; }
       [OneToMany(TableName = "Condicion_Laboral_Cliente", KeyColumn = "id_departamento", ForeignKeyColumn = "id_departamento")]
       public List<Condicion_Laboral_Cliente>? Condicion_Laboral_Cliente { get; set; }
   }
}
