using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel {
   public class Catalogo_Clientes : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? codigo_cliente { get; set; }
       public string? primer_nombre { get; set; }
       public string? segundo_nombre { get; set; }
       public string? primer_apellido { get; set; }
       public string? segundo_apellidio { get; set; }
       public int? id_tipo_identificacion { get; set; }
       public string? identificacion { get; set; }
       public string? sexo { get; set; }
       public DateTime? fecha_nacimiento { get; set; }
       public int? id_profesion { get; set; }
       public int? id_departamento { get; set; }
       public int? id_municipio { get; set; }
       public string? correo { get; set; }
       public string? telefono { get; set; }
       public string? direccion { get; set; }
       public string? hora { get; set; }
       public DateTime? fecha { get; set; }
       public string? observaciones { get; set; }
       public string? estado_civil { get; set; }
       public int? tipoc { get; set; }
       public string? tipo_firma { get; set; }
       public string? valor_cliente { get; set; }
       public string? operadora_celular { get; set; }
       public Double? valor_interes { get; set; }
       public string? solo_acreedor { get; set; }
       public Double? promedio { get; set; }
       public int? id_clasificacion { get; set; }
       public int? id_clasificacion_interes { get; set; }
       [ManyToOne(TableName = "Catalogo_Clasificacion_Cliente", KeyColumn = "id_clasificacion", ForeignKeyColumn = "id_clasificacion")]
       public Catalogo_Clasificacion_Cliente? Catalogo_Clasificacion_Cliente { get; set; }
       [ManyToOne(TableName = "Catalogo_Clasificacion_Interes", KeyColumn = "id_clasificacion_interes", ForeignKeyColumn = "id_clasificacion_interes")]
       public Catalogo_Clasificacion_Interes? Catalogo_Clasificacion_Interes { get; set; }
       [ManyToOne(TableName = "Catalogo_Departamento", KeyColumn = "id_departamento", ForeignKeyColumn = "id_departamento")]
       public Catalogo_Departamento? Catalogo_Departamento { get; set; }
       [ManyToOne(TableName = "Catalogo_Municipio", KeyColumn = "id_municipio", ForeignKeyColumn = "id_municipio")]
       public Catalogo_Municipio? Catalogo_Municipio { get; set; }
       [ManyToOne(TableName = "Catalogo_Profesiones", KeyColumn = "id_profesion", ForeignKeyColumn = "id_profesion")]
       public Catalogo_Profesiones? Catalogo_Profesiones { get; set; }
       [ManyToOne(TableName = "Catalogo_Tipo_Identificacion", KeyColumn = "id_tipo_identificacion", ForeignKeyColumn = "id_tipo_identificacion")]
       public Catalogo_Tipo_Identificacion? Catalogo_Tipo_Identificacion { get; set; }
       [OneToMany(TableName = "Condicion_Laboral_Cliente", KeyColumn = "codigo_cliente", ForeignKeyColumn = "id_cliente")]
       public List<Condicion_Laboral_Cliente>? Condicion_Laboral_Cliente { get; set; }
       [OneToMany(TableName = "Transaction_Contratos", KeyColumn = "codigo_cliente", ForeignKeyColumn = "codigo_cliente")]
       public List<Transaction_Contratos>? Transaction_Contratos { get; set; }
   }
}
