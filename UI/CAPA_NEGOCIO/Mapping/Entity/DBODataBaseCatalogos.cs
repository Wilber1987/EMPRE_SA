using API.Controllers;
using CAPA_DATOS;
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

    public class Catalogo_Clientes : EntityClass
    {
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
        //public Double? valor_interes { get; set; }
        public string? solo_acreedor { get; set; }
        public Double? promedio { get; set; }
        public int? id_clasificacion { get; set; }
        public int? id_clasificacion_interes { get; set; }
        [ManyToOne(TableName = "Catalogo_Clasificacion_Cliente", KeyColumn = "id_clasificacion", ForeignKeyColumn = "id_clasificacion")]
        public Catalogo_Clasificacion_Cliente? Catalogo_Clasificacion_Cliente { get; set; }
        [ManyToOne(TableName = "Catalogo_Clasificacion_Interes", KeyColumn = "id_clasificacion_interes", ForeignKeyColumn = "id_clasificacion_interes")]
        public Catalogo_Clasificacion_Interes? Catalogo_Clasificacion_Interes { get; set; }
        [ManyToOne(TableName = "Catalogo_Tipo_Identificacion", KeyColumn = "id_tipo_identificacion", ForeignKeyColumn = "id_tipo_identificacion")]
        public Catalogo_Tipo_Identificacion? Catalogo_Tipo_Identificacion { get; set; }
        [ManyToOne(TableName = "Catalogo_Profesiones", KeyColumn = "id_profesion", ForeignKeyColumn = "id_profesion")]
        public Catalogo_Profesiones? Catalogo_Profesiones { get; set; }
        /*[OneToMany(TableName = "Transaction_Contratos", KeyColumn = "codigo_cliente", ForeignKeyColumn = "codigo_cliente")]*/
        public List<Transaction_Contratos>? Transaction_Contratos { get; set; }
        [OneToMany(TableName = "Condicion_Laboral_Cliente", KeyColumn = "codigo_cliente", ForeignKeyColumn = "codigo_cliente")]
        public List<Condicion_Laboral_Cliente>? Condicion_Laboral_Cliente { get; set; }

        [ManyToOne(TableName = "Catalogo_Municipio", KeyColumn = "id_municipio", ForeignKeyColumn = "id_municipio")]
        public Catalogo_Municipio? Catalogo_Municipio { get; set; }
        [ManyToOne(TableName = "Catalogo_Departamento", KeyColumn = "id_departamento", ForeignKeyColumn = "id_departamento")]
        public Catalogo_Departamento? Catalogo_Departamento { get; set; }
    }


    public class Catalogo_Tipo_Agente : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? Id_Tipo_Agente { get; set; }
        public string? Descripcion { get; set; }
        public string? Estado { get; set; }
        //    [OneToMany(TableName = "Catalogo_Agentes", KeyColumn = "Id_Tipo_Agente", ForeignKeyColumn = "Id_Tipo_Agente")]
        //    public List<Catalogo_Agentes>? Catalogo_Agentes { get; set; }
    }
    public class Catalogo_Tipo_Identificacion : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? id_tipo_identificacion { get; set; }
        public string? Descripcion { get; set; }
        public string? Estado { get; set; }
        //    [OneToMany(TableName = "Catalogo_Clientes", KeyColumn = "id_tipo_identificacion", ForeignKeyColumn = "id_tipo_identificacion")]
        //    public List<Catalogo_Clientes>? Catalogo_Clientes { get; set; }
    }

    public class Catalogo_Cambio_Dolar : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? id_cambio { get; set; }
        public DateTime? fecha { get; set; }
        public Double? valor_de_compra { get; set; }
        public Double? valor_de_venta { get; set; }
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

        /*[ManyToOne(TableName = "Catalogo_Tipo_Transaccion", KeyColumn = "id_tipo_transaccion", ForeignKeyColumn = "id_tipo_transaccion")]
        public Catalogo_Tipo_Transaccion? Catalogo_Tipo_Transaccion { get; set; }*/

        // [OneToMany(TableName = "Transaction_Ingresos_Egresos", KeyColumn = "id_cuentas", ForeignKeyColumn = "id_cuenta")]
        // public List<Transaction_Ingresos_Egresos>? Transaction_Ingresos_Egresos { get; set; }
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
        /*public int? id_categoria { get; set; }
        [ManyToOne(TableName = "Categoria_Cuentas", KeyColumn = "id_categoria", ForeignKeyColumn = "id_categoria")]
        public Categoria_Cuentas? Categoria_Cuentas { get; set; }*/
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
        //TODO relaciones
    }

    public class Catalogo_Departamento : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? id_departamento { get; set; }
        public string? nombre { get; set; }
        public int? id_nacionalidad { get; set; }
        public int? ponderacion { get; set; }
        public int? puntaje { get; set; }
        public string? clasificacion { get; set; }
       // [ManyToOne(TableName = "Catalogo_Nacionalidad", KeyColumn = "id_nacionalidad", ForeignKeyColumn = "id_nacionalidad")]
        public Catalogo_Nacionalidad? Catalogo_Nacionalidad { get; set; }
        //[OneToMany(TableName = "Catalogo_Municipio", KeyColumn = "id_departamento", ForeignKeyColumn = "id_departamento")]
        public List<Catalogo_Municipio>? Catalogo_Municipio { get; set; }
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
    public class Catalogo_Municipio : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? id_municipio { get; set; }
        public string? nombre { get; set; }
        public int? id_departamento { get; set; }
        [ManyToOne(TableName = "Catalogo_Departamento", KeyColumn = "id_departamento", ForeignKeyColumn = "id_departamento")]
        public Catalogo_Departamento? Catalogo_Departamento { get; set; }
        //[OneToMany(TableName = "Catalogo_Inversores", KeyColumn = "id_municipio", ForeignKeyColumn = "id_municipio")]
        // public List<Catalogo_Inversores>? Catalogo_Inversores { get; set; }
    }
    public class Catalogo_Nacionalidad : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? id_nacionalidad { get; set; }
        public string? nombre { get; set; }
        public string? nacionalidad { get; set; }
        public int? ponderacion { get; set; }
        public int? puntaje { get; set; }
        public string? clasificacion { get; set; }
        //[OneToMany(TableName = "Catalogo_Departamento", KeyColumn = "id_nacionalidad", ForeignKeyColumn = "id_nacionalidad")]
        //public List<Catalogo_Departamento>? Catalogo_Departamento { get; set; }
        //[OneToMany(TableName = "Catalogo_Inversores", KeyColumn = "id_nacionalidad", ForeignKeyColumn = "id_nacionalidad")]
        // public List<Catalogo_Inversores>? Catalogo_Inversores { get; set; }
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
