using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Catalogo_Municipio : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? id_municipio { get; set; }
       public string? nombre { get; set; }
       public int? id_departamento { get; set; }
       [ManyToOne(TableName = "Catalogo_Departamento", KeyColumn = "id_departamento", ForeignKeyColumn = "id_departamento")]
       public Catalogo_Departamento? Catalogo_Departamento { get; set; }
       [OneToMany(TableName = "Catalogo_Clientes", KeyColumn = "id_municipio", ForeignKeyColumn = "id_municipio")]
       public List<Catalogo_Clientes>? Catalogo_Clientes { get; set; }
       [OneToMany(TableName = "Catalogo_Inversores", KeyColumn = "id_municipio", ForeignKeyColumn = "id_municipio")]
       public List<Catalogo_Inversores>? Catalogo_Inversores { get; set; }
       [OneToMany(TableName = "Condicion_Laboral_Cliente", KeyColumn = "id_municipio", ForeignKeyColumn = "id_municipio")]
       public List<Condicion_Laboral_Cliente>? Condicion_Laboral_Cliente { get; set; }
   }
}
