
using APPCORE;
using CAPA_NEGOCIO.Util;
using Business;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Transactions;
namespace DataBaseModel
{

	public class Detail_Valores : EntityClass
	{
		[PrimaryKey(Identity = false)]
		public int? id_valoracion { get; set; }
		public decimal? Valoracion_1 { get; set; }
		public decimal? Valoracion_2 { get; set; }
		public decimal? Valoracion_3 { get; set; }
		public decimal? dolares_1 { get; set; }
		public decimal? dolares_2 { get; set; }
		public decimal? dolares_3 { get; set; }
	}
	public class Transactional_Valoracion : EntityClass
	{
		[PrimaryKey(Identity = true)]
		public int? id_valoracion { get; set; }
		public string? Descripcion { get; set; }
		public string? Marca { get; set; }
		public string? Serie { get; set; }
		public string? Modelo { get; set; }
		public decimal? Tasa_interes { get; set; }
		public int? Plazo { get; set; }
		public DateTime? Fecha { get; set; }
		public decimal? Tasa_de_cambio { get; set; }
		public int? id_estado { get; set; }
		public int? id_categoria { get; set; }
		public decimal? Valoracion_compra_cordobas { get; set; }
		public decimal? Valoracion_compra_dolares { get; set; }
		public decimal? Valoracion_empeño_cordobas { get; set; }
		public decimal? Valoracion_empeño_dolares { get; set; }

		public decimal? Precio_venta_empeño_cordobas { get; set; }
		public decimal? Precio_venta_empeño_dolares { get; set; }


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
					if (valoracion?.id_valoracion == null)
					{
						valoracion.Fecha = DateTime.Now;
						valoracion?.Save();
					}
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


		public class DesgloseIntereses
	{
		//porcentajes de intereses
		public decimal? GASTOS_ADMINISTRATIVOS { get; set; }
		public decimal? COMISIONES { get; set; }
		public decimal? MANTENIMIENTO_VALOR { get; set; }
		public decimal? GASTOS_LEGALES { get; set; }
		public decimal? INTERES_NETO_CORRIENTE { get; set; }
		public decimal? GESTION_CREDITICIA { get; set; }
		//fin porcentajes de intereses

		public decimal GetPorcentageInteresesSGC(bool aplicaGastosAdministrativos)
		{
			return (aplicaGastosAdministrativos ? GASTOS_ADMINISTRATIVOS.GetValueOrDefault() : 0) +
					COMISIONES.GetValueOrDefault() +
					MANTENIMIENTO_VALOR.GetValueOrDefault() +
					GASTOS_LEGALES.GetValueOrDefault() +
					INTERES_NETO_CORRIENTE.GetValueOrDefault();
		}
		public decimal GetPorcentageIntereses(bool aplicaGastosAdministrativos)
		{
			return GetPorcentageInteresesSGC(aplicaGastosAdministrativos) + GESTION_CREDITICIA.GetValueOrDefault();
		}
	}

	public enum Contratos_State
	{
		ACTIVO, 
		/* Cuando esta en saldo 0 pasa a estado cancelado*/
		CANCELADO, 
		ANULADO,
        CAPITAL_CANCELADO,
        VENCIDO
    }
	public enum Contratos_Type
	{
		EMPENO, PRESTAMO, EMPENO_VEHICULO, APARTADO_QUINCENAL, APARTADO_MENSUAL
	}
	public class Detail_Prendas : EntityClass
	{
		[PrimaryKey(Identity = true)]
		public int? numero_prenda { get; set; }
		public int? numero_contrato_OLD { get; set; }
		public string? Descripcion { get; set; }
		public decimal? monto_aprobado_cordobas { get; set; }
		public decimal? monto_aprobado_dolares { get; set; }
		public string? Tipo { get; set; }
		public string? marca { get; set; }
		public string? serie { get; set; }
		public string? modelo { get; set; }
		public string? iva { get; set; }
		public string? margen { get; set; }
		public string? estado { get; set; }
		public decimal? interesl { get; set; }
		public decimal? moral { get; set; }
		public DateTime? fliquidacion { get; set; }
		public decimal? precio_venta { get; set; }
		public EnManosDe? en_manos_de { get; set; }
		public string? color { get; set; }
		public string? factura { get; set; }
		public string? tipo_movimiento { get; set; }
		public decimal? v_porcentage_etiqueta { get; set; }
		public int? id_categoria { get; set; }
		public int? id_valoracion { get; set; }
		public int? numero_contrato { get; set; }
		// [ManyToOne(TableName = "Transaction_Contratos", KeyColumn = "numero_contrato", ForeignKeyColumn = "numero_contrato")]
		// public Transaction_Contratos? Transaction_Contratos { get; set; }
		[OneToOne(TableName = "Detail_Prendas_Vehiculos", KeyColumn = "numero_prenda", ForeignKeyColumn = "numero_prenda")]
		public Detail_Prendas_Vehiculos? Detail_Prendas_Vehiculos { get; set; }
		[ManyToOne(TableName = "Catalogo_Categoria", KeyColumn = "id_categoria", ForeignKeyColumn = "id_categoria")]
		public Catalogo_Categoria? Catalogo_Categoria { get; set; }
		[ManyToOne(TableName = "Transactional_Valoracion", KeyColumn = "id_valoracion", ForeignKeyColumn = "id_valoracion")]
		public Transactional_Valoracion? Transactional_Valoracion { get; set; }

	}
	public enum EnManosDe
	{
		ACREEDOR, DEUDOR,
        CLIENTE
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
		public decimal? porcentage_descuento_maximo { get; set; }
		public string? uso { get; set; }
		public string? servicio { get; set; }
		public DateTime? fecha_seguro { get; set; }
		public string? combustible { get; set; }
		// [OneToOne(TableName = "Detail_Prendas", KeyColumn = "numero_prenda", ForeignKeyColumn = "numero_prenda")]
		// public Detail_Prendas? Detail_Prendas { get; set; }
	}
	public class Transaction_Contratos_Inversionistas : EntityClass
	{
		[PrimaryKey(Identity = true)]
		public int? numero_cont { get; set; }
		public DateTime? fecha { get; set; }
		public decimal? taza { get; set; }
		public decimal? monto_inicial { get; set; }
		public string? nombre_sustituto { get; set; }
		public string? identificacion_sustituto { get; set; }
		public string? direccion_sustituto { get; set; }
		public string? departamento_sus { get; set; }
		public string? municipio_sustituto { get; set; }
		public int? id_inversor { get; set; }
		public DateTime? fecha_pago { get; set; }
		public DateTime? fecha_ultimo_pago { get; set; }
		public decimal? saldo { get; set; }
		public decimal? montointeres { get; set; }
		public decimal? interes { get; set; }
		public DateTime? fecha_restructura { get; set; }
		public int? Id_User { get; set; }
		[ManyToOne(TableName = "Catalogo_Inversores", KeyColumn = "id_inversor", ForeignKeyColumn = "id_inversor")]
		public Catalogo_Inversores? Catalogo_Inversores { get; set; }
		[ManyToOne(TableName = "Security_Users", KeyColumn = "Id_User", ForeignKeyColumn = "Id_User")]
		public Security_Users? Security_Users { get; set; }
	}
	
	public class Transaction_Movimiento : EntityClass
	{
		[PrimaryKey(Identity = true)]
		public int? id_movimiento { get; set; }
		public string? descripcion { get; set; }
		public string? concepto { get; set; }
		public int? id_usuario_crea { get; set; }
		public DateTime? fecha { get; set; }
		public string? tipo { get; set; }
		public string? moneda { get; set; }
		public decimal? tasa_cambio { get; set; }
		public bool? correo_enviado { get; set; }
		public decimal? tasa_cambio_compra { get; set; }
		public bool? is_transaction { get; set; }
		public int? id_sucursal { get; set; } 
		public int? Id_cuenta_origen { get; set; }
		public int? Id_cuenta_destino { get; set; }
		public TipoMovimiento? Tipo_Movimiento { get; set; }

		[OneToMany(TableName = "Detail_Movimiento", KeyColumn = "id_movimiento", ForeignKeyColumn = "id_movimiento")]
		public List<Detail_Movimiento>? Detail_Movimiento { get; set; }
	}
	public class Detail_Movimiento : EntityClass
	{
		[PrimaryKey(Identity = true)]
		public int? id_detalle { get; set; }
		public int? id_movimiento { get; set; }
		public decimal? debito { get; set; }
		public decimal? debito_dolares { get; set; }
		public decimal? credito { get; set; }
		public decimal? credito_dolares { get; set; }
		public decimal? tasa_cambio { get; set; }
		public decimal? tasa_cambio_compra { get; set; }
		public string? moneda { get; set; }

		public decimal? monto_inicial { get; set; }
		public decimal? monto_final { get; set; }
		public decimal? monto_inicial_dolares { get; set; }
		public decimal? monto_final_dolares { get; set; }
		public DateTime? fecha { get; set; }
		[ManyToOne(TableName = "Transaction_Movimiento", KeyColumn = "id_movimiento", ForeignKeyColumn = "id_movimiento")]
		public Transaction_Movimiento? Transaction_Movimiento { get; set; }
		public int? id_cuenta { get; set; }
		[ManyToOne(TableName = "Catalogo_Cuentas", KeyColumn = "id_cuentas", ForeignKeyColumn = "id_cuenta")]
		public Catalogo_Cuentas? catalogo_Cuentas { get; set; }
	}




	public class Catalogo_Producto : EntityClass
	{
		[PrimaryKey(Identity = true)]
		public int? id_producto { get; set; }
		public string descripcion { get; set; }
		public int? id_categoria { get; set; }
		public int? id_marca { get; set; }
	}

	public class Catalogo_Marca : EntityClass
	{
		[PrimaryKey(Identity = true)]
		public int? id_marca { get; set; }
		public string nombre { get; set; }
		public string descripcion { get; set; }
		public string estado { get; set; }

		[OneToMany(TableName = "Catalogo_Producto", KeyColumn = "id_marca", ForeignKeyColumn = "id_marca")]
		public List<Catalogo_Producto>? Detalle_Factura { get; set; }
	}


	public class Catalogo_Categorias : EntityClass
	{
		[PrimaryKey(Identity = true)]
		public int? id_categoria { get; set; }
		public string descripcion { get; set; }
		public string estado { get; set; }
	}

	public class Transaction_Lotes : EntityClass
	{
		[PrimaryKey(Identity = true)]
		public int? id_transaccion { get; set; }
		public string descripcion { get; set; }
		public DateTime? fecha { get; set; }
		public int? id_usuario { get; set; }
		public int? id_tipo_transaccion { get; set; }
		public string estado { get; set; }
	}


	public class Transaction_Detalle_Lotes : EntityClass
	{
		[PrimaryKey(Identity = true)]
		public int? id_detalle_transaccion { get; set; }
		public int? id_lote { get; set; }
		public double? cantidad_afectada { get; set; }
		public int? id_transaccion { get; set; }
		public int? id_detalle_factura { get; set; }
	}


}
