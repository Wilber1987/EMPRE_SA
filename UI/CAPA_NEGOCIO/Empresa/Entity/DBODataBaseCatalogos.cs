using API.Controllers;
using CAPA_DATOS;
using ClientDataBaseModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel
{
    public class Catalogo_Estados_Articulos : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? id_estado_articulo { get; set; }
        public string? nombre { get; set; }
        public string? descripcion { get; set; }
        public Double? porcentaje_compra { get; set; }
        public Double? porcentaje_empeno { get; set; }
        // [OneToMany(TableName = "Transactional_Valoracion", KeyColumn = "id_estado_articulo", ForeignKeyColumn = "id_estado")]
        // public List<Transactional_Valoracion>? Transactional_Valoracion { get; set; }
    }


    public class Catalogo_Agentes : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? id_agente { get; set; }
        public string? identificacion { get; set; }
        public string? nombre { get; set; }
        public string? telefono { get; set; }
        public string? direccion { get; set; }
        public DateTime? fecha { get; set; }
        public int? Id_Tipo_Agente { get; set; }
        public string? Estado { get; set; }
        [ManyToOne(TableName = "Catalogo_Tipo_Agente", KeyColumn = "Id_Tipo_Agente", ForeignKeyColumn = "Id_Tipo_Agente")]
        public Catalogo_Tipo_Agente? Catalogo_Tipo_Agente { get; set; }
        //[OneToMany(TableName = "Transaction_Contratos", KeyColumn = "id_agente", ForeignKeyColumn = "id_agente")]
        public List<Transaction_Contratos>? Transaction_Contratos { get; set; }
    }
    public class Catalogo_Clasificacion_Cliente : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? id_clasificacion { get; set; }
        public string? Descripcion { get; set; }
        public string? Estado { get; set; }
        public Double? porcentaje { get; set; }

        //[OneToMany(TableName = "Catalogo_Clientes", KeyColumn = "id_clasificacion", ForeignKeyColumn = "id_clasificacion")]
        public List<Catalogo_Clientes>? Catalogo_Clientes { get; set; }
    }

    public class Catalogo_Clasificacion_Interes : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? id_clasificacion_interes { get; set; }
        public string? Descripcion { get; set; }
        public string? Estado { get; set; }
        public Double? porcentaje { get; set; }

        //[OneToMany(TableName = "Catalogo_Clientes", KeyColumn = "id_clasificacion", ForeignKeyColumn = "id_clasificacion")]
        public List<Catalogo_Clientes>? Catalogo_Clientes { get; set; }
    }
    public class Catalogo_Tipo_Agente : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? Id_Tipo_Agente { get; set; }
        public string? Descripcion { get; set; }
        public string? Estado { get; set; }
    }
    public class Catalogo_Tipo_Identificacion : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? id_tipo_identificacion { get; set; }
        public string? Descripcion { get; set; }
        public string? Estado { get; set; }
    }

    
    public class Catalogo_Cuentas : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? id_cuentas { get; set; }
        public string? nombre { get; set; }
        public string? tipo_cuenta { get; set; }
        public double? saldo { get; set; }
        public double? saldo_dolares { get; set; }
        public bool? permite_cordobas { get; set; }
        public bool? permite_dolares { get; set; }
        public int? id_sucursal { get; set; }
        [ManyToOne(TableName = "Catalogo_Sucursales", KeyColumn = "Id_Sucursal", ForeignKeyColumn = "id_sucursal")]
        public Catalogo_Sucursales? Catalogo_Sucursales { get; set; }
        public int? id_categoria { get; set; }
        [ManyToOne(TableName = "Categoria_Cuentas", KeyColumn = "id_categoria", ForeignKeyColumn = "id_categoria")]
        public Categoria_Cuentas? Categoria_Cuentas { get; set; }
    }
    public class Categoria_Cuentas : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? id_categoria { get; set; }
        public string? descripcion { get; set; }
    }

    public class Permisos_Cuentas : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? id_permiso { get; set; }
        public int? id_categoria_cuenta_origen { get; set; }
        [ManyToOne(TableName = "Categoria_Cuentas", KeyColumn = "id_categoria", ForeignKeyColumn = "id_categoria_cuenta_origen")]
        public Categoria_Cuentas? Categoria_Cuentas_Origen { get; set; }
        public int? id_categoria_cuenta_destino { get; set; }
        [ManyToOne(TableName = "Categoria_Cuentas", KeyColumn = "id_categoria", ForeignKeyColumn = "id_categoria_cuenta_destino")]
        public Categoria_Cuentas? Categoria_Cuentas_Destino { get; set; }
        public bool? permite_debito { get; set; }
        public bool? permite_credito { get; set; }
    }

    public enum Tipo_Cuenta
    {
        PROPIA, EXTERNA, PAGO
    }
    public class Catalogo_Categoria : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? id_categoria { get; set; }
        public string? tipo { get; set; }
        public string? descripcion { get; set; }
        public int? plazo_limite { get; set; }
        public int? prioridad { get; set; }
        public bool? isEditable { get; set; }
    }

    
    public class Catalogo_Inversores : EntityClass
    {
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
        // [OneToMany(TableName = "Transaction_Contratos_Inversionistas", KeyColumn = "id_inversor", ForeignKeyColumn = "id_inversor")]
        // public List<Transaction_Contratos_Inversionistas>? Transaction_Contratos_Inversionistas { get; set; }
    }
  
    public class Catalogo_Profesiones : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? id_profesion { get; set; }
        public string? nombre { get; set; }
        //[OneToMany(TableName = "Catalogo_Clientes", KeyColumn = "id_profesion", ForeignKeyColumn = "id_profesion")]
        //public List<Catalogo_Clientes>? Catalogo_Clientes { get; set; }
    }
    public class Catalogo_Tipo_Transaccion : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? id_tipo_transaccion { get; set; }
        public string? descripcion { get; set; }
        // [OneToMany(TableName = "Transaction_Ingresos_Egresos", KeyColumn = "id_tipo_transaccion", ForeignKeyColumn = "id_tipo_transaccion")]
        // public List<Transaction_Ingresos_Egresos>? Transaction_Ingresos_Egresos { get; set; }
    }

    public class Catalogo_Sucursales : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? Id_Sucursal { get; set; }
        public int? id_municipio { get; set; }
        public string? Nombre { get; set; }
        public string? Descripcion { get; set; }
        public string? Direccion { get; set; }
        [OneToOne(TableName = "Datos_Configuracion", KeyColumn = "Id_Sucursal", ForeignKeyColumn = "Id_Sucursal")]
        public Datos_Configuracion? Datos_Configuracion { get; set; }
        [ManyToOne(TableName = "Catalogo_Municipio", KeyColumn = "id_municipio", ForeignKeyColumn = "id_municipio")]
        public Catalogo_Municipio? Catalogo_Municipio { get; set; }
        // [OneToMany(TableName = "Security_Users", KeyColumn = "Id_Sucursal", ForeignKeyColumn = "Id_Sucursal")]
        // public List<Security_Users>? Security_Users { get; set; }
    }

}