using CAPA_DATOS;
using CAPA_NEGOCIO.Security;
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

    public class Detail_Valores : EntityClass
    {
        [PrimaryKey(Identity = false)]
        public int? id_valoracion { get; set; }
        public Double? Valoracion_1 { get; set; }
        public Double? Valoracion_2 { get; set; }
        public Double? Valoracion_3 { get; set; }
        public Double? dolares_1 { get; set; }
        public Double? dolares_2 { get; set; }
        public Double? dolares_3 { get; set; }
    }
    public class Transactional_Valoracion : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? id_valoracion { get; set; }
        public string? Descripcion { get; set; }
        public string? Marca { get; set; }
        public string? Serie { get; set; }
        public string? Modelo { get; set; }
        public Double? Tasa_interes { get; set; }
        public int? Plazo { get; set; }
        public DateTime? Fecha { get; set; }
        public Double? Tasa_de_cambio { get; set; }
        public int? id_estado { get; set; }
        public int? id_categoria { get; set; }
        public Double? valoracion_compra_cordobas { get; set; }
        public Double? valoracion_compra_dolares { get; set; }
        public Double? valoracion_empeño_cordobas { get; set; }
        public Double? valoracion_empeño_dolares { get; set; }

        [ManyToOne(TableName = "Catalogo_Estados_Articulos", KeyColumn = "id_estado_articulo", ForeignKeyColumn = "id_estado")]
        public Catalogo_Estados_Articulos? Catalogo_Estados_Articulos { get; set; }
        [ManyToOne(TableName = "Catalogo_Categoria", KeyColumn = "id_categoria", ForeignKeyColumn = "id_categoria")]
        public Catalogo_Categoria? Catalogo_Categoria { get; set; }
        [OneToOne(TableName = "Detail_Valores", KeyColumn = "id_valoracion", ForeignKeyColumn = "id_valoracion")]
        public Detail_Valores? Detail_Valores { get; set; }

        public List<Transactional_Valoracion> GuardarValoraciones(List<Transactional_Valoracion> valoraciones)
        {
            try
            {
                this.BeginGlobalTransaction();
                foreach (Transactional_Valoracion valoracion in valoraciones)
                {
                    valoracion.Save();
                }
                this.CommitGlobalTransaction();
                return valoraciones;
            }
            catch (System.Exception)
            {
                this.RollBackGlobalTransaction();
                throw;
            }
        }
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
        public Double? valor_interes { get; set; }
        public string? solo_acreedor { get; set; }
        public Double? promedio { get; set; }
        public int? id_clasificacion { get; set; }
        [ManyToOne(TableName = "Catalogo_Clasificacion_Cliente", KeyColumn = "id_clasificacion", ForeignKeyColumn = "id_clasificacion")]
        public Catalogo_Clasificacion_Cliente? Catalogo_Clasificacion_Cliente { get; set; }
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

    public class Condicion_Laboral_Cliente : EntityClass {
       [PrimaryKey(Identity = true)]
       public int? id { get; set; }
       public int? codigo_cliente { get; set; }
       public DateTime? fecha_ingreso { get; set; }
       public string? ocupacion_cargo { get; set; }
       public Double? ingresos_mensuales { get; set; }
       public string? direccion { get; set; }
       public int? id_municipio { get; set; }
       public int? id_departamento { get; set; }
       /*[ManyToOne(TableName = "Catalogo_Clientes", KeyColumn = "codigo_cliente", ForeignKeyColumn = "id_cliente")]*/
       public Catalogo_Clientes? Catalogo_Clientes { get; set; }
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
    public class Transaction_Contratos : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? numero_contrato { get; set; }
        public DateTime? fecha_contrato { get; set; }
        public DateTime? fecha_cancelar { get; set; }
        public Double? monto { get; set; }
        public Double? interes { get; set; }
        public Double? mora { get; set; }
        public string? estado { get; set; }
        public DateTime? fecha_vencimiento { get; set; }
        public int? codigo_cliente { get; set; }
        public Double? saldo { get; set; }
        public int? dias_mora { get; set; }
        public Double? saldo_mora { get; set; }
        public DateTime? fecha_baja { get; set; }
        public Double? abonos { get; set; }
        public DateTime? ultima_visita { get; set; }
        public int? tipo { get; set; }
        public string? entregado { get; set; }
        public Double? interes_actual { get; set; }
        public string? observaciones { get; set; }
        public Double? iva { get; set; }
        public Double? margen { get; set; }
        public Double? interesl { get; set; }
        public Double? moral { get; set; }
        public Double? descuento { get; set; }
        public Double? util { get; set; }
        public Double? taza_interes_cargos { get; set; }
        public Double? taza_mora { get; set; }
        public DateTime? fecha_mora { get; set; }
        public DateTime? fecha_interes { get; set; }
        public Double? taza_gestion_crediticia { get; set; }
        public int? Id_User_OLD { get; set; }
        public Double? taza_cambio { get; set; }
        public int? id_agente { get; set; }
        public Double? dkm { get; set; }
        public Double? gasolinamonto { get; set; }
        public Double? valorcad { get; set; }
        public int? plazo { get; set; }
        public Double? cuotafija { get; set; }
        public Double? montocuotaatrazadas { get; set; }
        public DateTime? mes_pagado { get; set; }
        public Double? tasa_hoy { get; set; }
        public int? numero_protocolo { get; set; }
        public Double? valor_dolar { get; set; }
        public Double? parciales { get; set; }
        public Double? mora_parcial { get; set; }
        public Double? interes_parcial { get; set; }
        public string? motivo_anulacion { get; set; }
        public int? idcatemp { get; set; }
        public Double? cuota_fija_inicial { get; set; }
        public DateTime? fecha_cancelar_inicial { get; set; }
        public int? plazo_inicial { get; set; }
        public int? dias_para_baja { get; set; }
        public int? Id_User { get; set; }
        [ManyToOne(TableName = "Catalogo_Agentes", KeyColumn = "id_agente", ForeignKeyColumn = "id_agente")]
        public Catalogo_Agentes? Catalogo_Agentes { get; set; }
        [ManyToOne(TableName = "Catalogo_Clientes", KeyColumn = "codigo_cliente", ForeignKeyColumn = "codigo_cliente")]
        public Catalogo_Clientes? Catalogo_Clientes { get; set; }
        [ManyToOne(TableName = "Security_Users", KeyColumn = "Id_User", ForeignKeyColumn = "Id_User")]
        public Security_Users? Security_Users { get; set; }
        [OneToMany(TableName = "Detail_Prendas", KeyColumn = "numero_contrato", ForeignKeyColumn = "numero_contrato")]
        public List<Detail_Prendas>? Detail_Prendas { get; set; }
        [OneToMany(TableName = "Transaction_Facturas", KeyColumn = "numero_contrato", ForeignKeyColumn = "numero_contrato")]
        public List<Transaction_Facturas>? Transaction_Facturas { get; set; }
    }
    public class Detail_Prendas : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? numero_prenda { get; set; }
        public int? numero_contrato_OLD { get; set; }
        public string? Descripcion { get; set; }
        public Double? pprenda { get; set; }
        public string? Tipo { get; set; }
        public string? marca { get; set; }
        public string? serie { get; set; }
        public string? modelo { get; set; }
        public string? iva { get; set; }
        public string? margen { get; set; }
        public string? estado { get; set; }
        public Double? interesl { get; set; }
        public Double? moral { get; set; }
        public DateTime? fliquidacion { get; set; }
        public Double? precio_venta { get; set; }
        public string? en_manos_de { get; set; }
        public string? color { get; set; }
        public string? factura { get; set; }
        public string? tipo_movimiento { get; set; }
        public string? uso { get; set; }
        public string? servicio { get; set; }
        public Double? v_porcentage_etiqueta { get; set; }
        public int? numero_contrato { get; set; }
        // [ManyToOne(TableName = "Transaction_Contratos", KeyColumn = "numero_contrato", ForeignKeyColumn = "numero_contrato")]
        // public Transaction_Contratos? Transaction_Contratos { get; set; }
        [OneToOne(TableName = "Detail_Prendas_Vehiculos", KeyColumn = "numero_prenda", ForeignKeyColumn = "numero_prenda")]
        public Detail_Prendas_Vehiculos? Detail_Prendas_Vehiculos { get; set; }
    }
    public class Detail_Prendas_Vehiculos : EntityClass
    {
        [PrimaryKey(Identity = false)]
        public int? numero_prenda { get; set; }
        public string? capacidad_cilindros { get; set; }
        public string? cantidad_cilindros { get; set; }
        public string? cantidad_pasajeros { get; set; }
        public int? year_vehiculo { get; set; }
        public string? montor { get; set; }
        public string? chasis { get; set; }
        public string? placa { get; set; }
        public string? circuacion { get; set; }
        public string? defectuoso { get; set; }
        public DateTime? fecha_aut_descuento { get; set; }
        public string? defecto { get; set; }
        public Double? porcentage_descuento_maximo { get; set; }
        public DateTime? fecha_seguro { get; set; }
        public string? combustible { get; set; }
        // [OneToOne(TableName = "Detail_Prendas", KeyColumn = "numero_prenda", ForeignKeyColumn = "numero_prenda")]
        // public Detail_Prendas? Detail_Prendas { get; set; }
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
        public int? id_sucursal { get; set; }
        [ManyToOne(TableName = "Catalogo_Sucursales", KeyColumn = "Id_Sucursal", ForeignKeyColumn = "id_sucursal")]
        public Catalogo_Sucursales? Catalogo_Sucursales { get; set; }

        /*[ManyToOne(TableName = "Catalogo_Tipo_Transaccion", KeyColumn = "id_tipo_transaccion", ForeignKeyColumn = "id_tipo_transaccion")]
        public Catalogo_Tipo_Transaccion? Catalogo_Tipo_Transaccion { get; set; }*/
        
        // [OneToMany(TableName = "Transaction_Ingresos_Egresos", KeyColumn = "id_cuentas", ForeignKeyColumn = "id_cuenta")]
        // public List<Transaction_Ingresos_Egresos>? Transaction_Ingresos_Egresos { get; set; }
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
        [ManyToOne(TableName = "Catalogo_Nacionalidad", KeyColumn = "id_nacionalidad", ForeignKeyColumn = "id_nacionalidad")]
        public Catalogo_Nacionalidad? Catalogo_Nacionalidad { get; set; }
        [OneToMany(TableName = "Catalogo_Municipio", KeyColumn = "id_departamento", ForeignKeyColumn = "id_departamento")]
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
        [OneToMany(TableName = "Catalogo_Inversores", KeyColumn = "id_municipio", ForeignKeyColumn = "id_municipio")]
        public List<Catalogo_Inversores>? Catalogo_Inversores { get; set; }
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
        [OneToMany(TableName = "Catalogo_Departamento", KeyColumn = "id_nacionalidad", ForeignKeyColumn = "id_nacionalidad")]
        public List<Catalogo_Departamento>? Catalogo_Departamento { get; set; }
        [OneToMany(TableName = "Catalogo_Inversores", KeyColumn = "id_nacionalidad", ForeignKeyColumn = "id_nacionalidad")]
        public List<Catalogo_Inversores>? Catalogo_Inversores { get; set; }
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
    public class Transaction_Contratos_Inversionistas : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? numero_cont { get; set; }
        public DateTime? fecha { get; set; }
        public Double? taza { get; set; }
        public Double? monto_inicial { get; set; }
        public string? nombre_sustituto { get; set; }
        public string? identificacion_sustituto { get; set; }
        public string? direccion_sustituto { get; set; }
        public string? departamento_sus { get; set; }
        public string? municipio_sustituto { get; set; }
        public int? id_inversor { get; set; }
        public DateTime? fecha_pago { get; set; }
        public DateTime? fecha_ultimo_pago { get; set; }
        public Double? saldo { get; set; }
        public Double? montointeres { get; set; }
        public Double? interes { get; set; }
        public DateTime? fecha_restructura { get; set; }
        public int? Id_User { get; set; }
        [ManyToOne(TableName = "Catalogo_Inversores", KeyColumn = "id_inversor", ForeignKeyColumn = "id_inversor")]
        public Catalogo_Inversores? Catalogo_Inversores { get; set; }
        [ManyToOne(TableName = "Security_Users", KeyColumn = "Id_User", ForeignKeyColumn = "Id_User")]
        public Security_Users? Security_Users { get; set; }
    }
    public class Transaction_Egresos : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? numero_egreso { get; set; }
        public Double? monto { get; set; }
        public DateTime? fecha { get; set; }
        public string? descripcion { get; set; }
        public string? nombre { get; set; }
        public string? banco { get; set; }
        public string? anulado { get; set; }
        public string? observaciones { get; set; }
        public Double? tc { get; set; }
        public Double? dolar { get; set; }
        public DateTime? fanulado { get; set; }
    }
    public class Transaction_Facturas : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? numero_factura { get; set; }
        public Double? abono_de_cuota { get; set; }
        public Double? mora { get; set; }
        public Double? interes { get; set; }
        public Double? total { get; set; }
        public int? numero_contrato { get; set; }
        public DateTime? fecha { get; set; }
        public DateTime? fecha_pago { get; set; }
        public Double? inte { get; set; }
        public Double? mor { get; set; }
        public int? dm { get; set; }
        public string? es { get; set; }
        public Double? tot { get; set; }
        public string? an { get; set; }
        public Double? pago_contado { get; set; }
        public Double? saldo_monto { get; set; }
        public Double? ABONO { get; set; }
        public Double? descuento { get; set; }
        public DateTime? fecha_mora { get; set; }
        public DateTime? fecha_interes { get; set; }
        public Double? taza_cambio { get; set; }
        public Double? interes_actual { get; set; }
        public int? Id_User_OLD { get; set; }
        public DateTime? fecha_grabado { get; set; }
        public DateTime? mes_pagado { get; set; }
        public DateTime? ultima_visita { get; set; }
        public Double? dmpagadas { get; set; }
        public string? tipo { get; set; }
        public Double? morac { get; set; }
        public Double? interesc { get; set; }
        public Double? abonoc { get; set; }
        public Double? totalc { get; set; }
        public Double? parciales { get; set; }
        public Double? moraparcial { get; set; }
        public Double? interesparcial { get; set; }
        public string? motivo_anulacion { get; set; }
        public Double? reestructuraciond { get; set; }
        public Double? reestructuracionc { get; set; }
        public int? numero_reestructuracion { get; set; }
        public DateTime? fecha_cancelacion { get; set; }
        public Double? docnoentregadod { get; set; }
        public Double? docnoentregadoc { get; set; }
        public int? Id_User { get; set; }
        // [ManyToOne(TableName = "Transaction_Contratos", KeyColumn = "numero_contrato", ForeignKeyColumn = "numero_contrato")]
        // public Transaction_Contratos? Transaction_Contratos { get; set; }
        [ManyToOne(TableName = "Security_Users", KeyColumn = "Id_User", ForeignKeyColumn = "Id_User")]
        public Security_Users? Security_Users { get; set; }
    }
    public class Transaction_Ingresos : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? numero_ingreso { get; set; }
        public Double? monto { get; set; }
        public DateTime? fecha { get; set; }
        public string? descripcion { get; set; }
        public string? nombre { get; set; }
        public int? que { get; set; }
        public string? anulado { get; set; }
        public string? observaciones { get; set; }
        public Double? tzcambio { get; set; }
        public Double? total { get; set; }
        public DateTime? fanulado { get; set; }
    }
    public class Transaction_Ingresos_Egresos : EntityClass
    {
        [PrimaryKey(Identity = false)]
        public int? id_transaccion { get; set; }
        public int? id_tipo_transaccion { get; set; }
        public Double? monto_dolares { get; set; }
        public Double? tasa_cambio { get; set; }
        public Double? monto_total { get; set; }
        public string? descripcion { get; set; }
        public string? nombre { get; set; }
        public int? id_cuenta { get; set; }
        public int? que { get; set; }
        public DateTime? fecha_anulado { get; set; }
        public string? banco { get; set; }
        public string? estado { get; set; }
        public int? numero_original { get; set; }
        public DateTime? fecha { get; set; }
        [ManyToOne(TableName = "Catalogo_Cuentas", KeyColumn = "id_cuentas", ForeignKeyColumn = "id_cuenta")]
        public Catalogo_Cuentas? Catalogo_Cuentas { get; set; }
        [ManyToOne(TableName = "Catalogo_Tipo_Transaccion", KeyColumn = "id_tipo_transaccion", ForeignKeyColumn = "id_tipo_transaccion")]
        public Catalogo_Tipo_Transaccion? Catalogo_Tipo_Transaccion { get; set; }
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
    public class Datos_Configuracion : EntityClass
    {
        [PrimaryKey(Identity = false)]
        public int? Id_Sucursal { get; set; }
        public string? Encabezado { get; set; }
        public bool? AutoDebito { get; set; }
        [OneToOne(TableName = "Catalogo_Sucursales", KeyColumn = "Id_Sucursal", ForeignKeyColumn = "Id_Sucursal")]
        public Catalogo_Sucursales? Catalogo_Sucursales { get; set; }
    }
}
