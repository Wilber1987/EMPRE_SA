using CAPA_DATOS;
using CAPA_DATOS.Security;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace DataBaseModel
{

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
		public Double? Valoracion_compra_cordobas { get; set; }
		public Double? Valoracion_compra_dolares { get; set; }
		public Double? Valoracion_empeño_cordobas { get; set; }
		public Double? Valoracion_empeño_dolares { get; set; }

		public Double? Precio_venta_empeño_cordobas { get; set; }
		public Double? Precio_venta_empeño_dolares { get; set; }


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
		public Double? abonos { get; set; }
		public string? tipo { get; set; }
		public string? entregado { get; set; }
		public Double? interes_actual { get; set; }
		public string? observaciones { get; set; }
		public Double? iva { get; set; }
		public Double? descuento { get; set; }
		public Double? taza_cambio { get; set; }
		public Double? taza_cambio_compra { get; set; }
		public int? id_agente { get; set; }
		public int? plazo { get; set; }
		public Double? cuotafija { get; set; }
		public Double? tasa_hoy { get; set; }
		public string? motivo_anulacion { get; set; }
		public Double? Valoracion_compra_dolares { get; set; }
		public Double? Valoracion_compra_cordobas { get; set; }
		public Double? Valoracion_empeño_cordobas { get; set; }
		public Double? Valoracion_empeño_dolares { get; set; }
		public Double? tasas_interes { get; set; }
		public Double? gestion_crediticia { get; set; }
		public Double? cuotafija_dolares { get; set; }
		public DateTime? fecha { get; set; }
		public Double? total_pagar_cordobas { get; set; }
		public Double? total_pagar_dolares { get; set; }
		public Double? interes_dolares { get; set; }
		public int? Id_User { get; set; }
		public int? reestructurado { get; set; }

		[ManyToOne(TableName = "Catalogo_Clientes", KeyColumn = "codigo_cliente", ForeignKeyColumn = "codigo_cliente")]
		public Catalogo_Clientes? Catalogo_Clientes { get; set; }
		[ManyToOne(TableName = "Security_Users", KeyColumn = "Id_User", ForeignKeyColumn = "Id_User")]
		public Security_Users? Security_Users { get; set; }
		[OneToMany(TableName = "Detail_Prendas", KeyColumn = "numero_contrato", ForeignKeyColumn = "numero_contrato")]
		public List<Detail_Prendas>? Detail_Prendas { get; set; }
		[OneToMany(TableName = "Transaction_Facturas", KeyColumn = "numero_contrato", ForeignKeyColumn = "numero_contrato")]
		public List<Tbl_Cuotas>? Tbl_Cuotas { get; set; }

		public void Reestructurar(double? reestructuracion_value)
		{
			if (this.reestructurado == null)
			{
				this.reestructurado = 0;
			}
			this.plazo += Convert.ToInt32(reestructuracion_value);
			this.reestructurado += 1;
			this.Update();
			CrearCuotas(this.saldo, reestructuracion_value);
		}
		public void CrearCuotas(double? monto, double? plazo)
		{
			var tasasCambio = new Catalogo_Cambio_Divisa().Get<Catalogo_Cambio_Divisa>()[0].Valor_de_venta;
			this.cuotafija_dolares = this.GetPago(monto, plazo);
			this.cuotafija = this.cuotafija_dolares * this.taza_cambio;
			var capital = this.Valoracion_empeño_dolares;

			for (var index = 0; index < plazo; index++)
			{
				var abono_capital = this.cuotafija_dolares - (capital * this.tasas_interes);
				var cuota = new Tbl_Cuotas
				{
					fecha = this.fecha?.AddMonths(1),
					total = this.cuotafija_dolares,
					interes = capital * this.tasas_interes,
					abono_capital = abono_capital,
					capital_restante = (capital - abono_capital) < 0 ? 0 : (capital - abono_capital),
					tasa_cambio = tasasCambio,
					numero_contrato = this.numero_contrato
				};
				capital -= abono_capital;
				cuota.Save();
			}
		}
		private double? GetPago(double? monto, double? cuotas)
		{
			var tasa = this.tasas_interes;
			var payment = tasa * Math.Pow(Convert.ToDouble(1 + tasa), Convert.ToDouble(cuotas)) * monto
				/ (Math.Pow(Convert.ToDouble(1 + tasa), Convert.ToDouble(cuotas)) - 1);
			return payment;
		}
	}

	public enum Contratos_State
	{
		ACTIVO, CANCELADO, ANULADO
	}
	public enum Contratos_Type
	{
		EMPENO, PRESTAMO, EMPENO_VEHICULO
	}
	public class Detail_Prendas : EntityClass
	{
		[PrimaryKey(Identity = true)]
		public int? numero_prenda { get; set; }
		public int? numero_contrato_OLD { get; set; }
		public string? Descripcion { get; set; }
		public Double? monto_aprobado_cordobas { get; set; }
		public Double? monto_aprobado_dolares { get; set; }
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
		public Double? v_porcentage_etiqueta { get; set; }
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
		ACREEDOR, DEUDOR
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
		// public Double? inte { get; set; }
		// public Double? mor { get; set; }
		// public int? dm { get; set; }
		// public string? es { get; set; }
		// public Double? tot { get; set; }
		// public string? an { get; set; }
		public Double? pago_contado { get; set; }
		public Double? saldo_monto { get; set; }
		// public Double? ABONO { get; set; }
		// public Double? descuento { get; set; }
		public DateTime? fecha_mora { get; set; }
		public DateTime? fecha_interes { get; set; }
		public Double? taza_cambio { get; set; }
		//public Double? interes_actual { get; set; }
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
		// public Double? reestructuraciond { get; set; }
		// public Double? reestructuracionc { get; set; }
		// public int? numero_reestructuracion { get; set; }
		// public DateTime? fecha_cancelacion { get; set; }
		// public Double? docnoentregadod { get; set; }
		// public Double? docnoentregadoc { get; set; }
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

	public class Datos_Configuracion : EntityClass
	{
		[PrimaryKey(Identity = false)]
		public int? Id_Sucursal { get; set; }
		public string? Encabezado { get; set; }
		public bool? AutoDebito { get; set; }
		[OneToOne(TableName = "Catalogo_Sucursales", KeyColumn = "Id_Sucursal", ForeignKeyColumn = "Id_Sucursal")]
		public Catalogo_Sucursales? Catalogo_Sucursales { get; set; }
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
		public double? tasa_cambio { get; set; }
		public bool? correo_enviado { get; set; }
		public double? tasa_cambio_compra { get; set; }
		public bool? is_transaction { get; set; }

		[OneToMany(TableName = "Detail_Movimiento", KeyColumn = "id_movimiento", ForeignKeyColumn = "id_movimiento")]
		public List<Detail_Movimiento>? Detail_Movimiento { get; set; }
	}
	public class Detail_Movimiento : EntityClass
	{
		[PrimaryKey(Identity = true)]
		public int? id_detalle { get; set; }
		public int? id_movimiento { get; set; }
		public double? debito { get; set; }
		public double? debito_dolares { get; set; }
		public double? credito { get; set; }
		public double? credito_dolares { get; set; }
		public double? tasa_cambio { get; set; }
		public double? tasa_cambio_compra { get; set; }
		public string? moneda { get; set; }

		public double? monto_inicial { get; set; }
		public double? monto_final { get; set; }
		public double? monto_inicial_dolares { get; set; }
		public double? monto_final_dolares { get; set; }
		public DateTime? fecha { get; set; }
		[ManyToOne(TableName = "Transaction_Movimiento", KeyColumn = "id_movimiento", ForeignKeyColumn = "id_movimiento")]
		public Transaction_Movimiento? Transaction_Movimiento { get; set; }
		public int? id_cuenta { get; set; }
		[ManyToOne(TableName = "Catalogo_Cuentas", KeyColumn = "id_cuentas", ForeignKeyColumn = "id_cuenta")]
		public Catalogo_Cuentas? catalogo_Cuentas { get; set; }
	}

	public class Transaccion_Factura : EntityClass
	{       
		[PrimaryKey(Identity = true)]
		public int? id_factura { get; set; }
		public int? numero_contrato { get; set; }
		public string? tipo { get; set; }
		public string? concepto { get; set; }
		public double? tasa_cambio { get; set; }
		public double? total { get; set; }
		public int? id_cliente { get; set; }
		public int? id_sucursal { get; set; }
		public DateTime? fecha { get; set; }
		public int? id_usuario { get; set; }
		public string? estado { get; set; }
		public string? no_factura { get; set; }
		public double? subtotal { get; set; }
		public double? iva { get; set; }
		public double? total_cordobas { get;  set; }
		public string? Moneda { get;  set; }


		[JsonProp]
		public Factura_contrato Factura_contrato { get; set; }

		[OneToMany(TableName = "Detalle_Factura_Recibo", KeyColumn = "id_factura", ForeignKeyColumn = "id_factura")]
		public List<Detalle_Factura_Recibo>? Detalle_Factura_Recibo { get; set; }
		
	}

	public class Factura_contrato
	{
		public int? numero_contrato { get; set; }
		public int? cuotas_pactadas { get; set; }
		public int? cuotas_pendientes { get; set; }
		public double? saldo_anterior { get; set; }
		public double? saldo_actual { get; set; }
		public double? mora { get; set; }
		public double? interes_demas_cargos_pagar { get; set; }
		public DateTime? proximo_pago_pactado { get; set; }
		public double? total_parciales { get; set; }
		public string? tipo { get; set; }
		public string? tipo_cuenta { get; set; }
		public double? total { get; set; }
		public double? tasa_cambio { get; set; }
		public int? id_cliente { get; set; }
		public int? id_sucursal { get; set; }
		public double? reestructuracion { get; set; }
		public double? perdida_de_documento { get; set; }
		public double? total_pagado { get; set; }
	}


	public class Catalogo_Producto: EntityClass {
		[PrimaryKey(Identity = true)]
		public int? id_producto { get; set; }
		public string descripcion { get; set; }
		public int? id_categoria { get; set; }
		public int? id_marca { get; set; }
	}
 
	public class Catalogo_Marca: EntityClass {
		[PrimaryKey(Identity = true)]
		public int? id_marca { get; set; }
		public string nombre { get; set; }
		public string descripcion { get; set; }
		public string estado { get; set; }

		[OneToMany(TableName = "Catalogo_Producto", KeyColumn = "id_marca", ForeignKeyColumn = "id_marca")]
		public List<Catalogo_Producto>? Detalle_Factura { get; set; }
	}


	public class Catalogo_Categorias: EntityClass {
		[PrimaryKey(Identity = true)]
		public int? id_categoria { get; set; }
		public string descripcion { get; set; }
		public string estado { get; set; }
	}

	public class Transaction_Lotes: EntityClass {
		[PrimaryKey(Identity = true)]
		public int? id_transaccion { get; set; }
		public string descripcion { get; set; }
		public DateTime? fecha { get; set; }
		public int? id_usuario { get; set; }
		public int? id_tipo_transaccion { get; set; }
		public string estado { get; set; }
	}

	
	public class Transaction_Detalle_Lotes: EntityClass {
		[PrimaryKey(Identity = true)]
		public int? id_detalle_transaccion { get; set; }
		public int? id_lote { get; set; }
		public int? cantidad_afectada { get; set; }
		public int? id_transaccion { get; set; }
		public int? id_detalle_factura { get; set; }
	}

	public class Detalle_Factura_Recibo : EntityClass
	{
		[PrimaryKey(Identity = true)]
		public int? id { get; set; }

		public int? id_cuota { get; set; }
		public double? total_cuota { get; set; }
		public double? monto_pagado { get; set; }
		public double? capital_restante { get; set; }
		public string? concepto { get; set; }
		public double? tasa_cambio { get; set; }

		public int? id_factura { get; set; }

		//[ManyToOne(TableName = "Transaccion_Factura", KeyColumn = "id_factura", ForeignKeyColumn = "id_factura")]
		public Transaccion_Factura? Transaccion_Factura { get; set; }
		[OneToOne(TableName = "Tbl_Cuotas", KeyColumn = "id_cuota", ForeignKeyColumn = "id_cuota")]
		public Tbl_Cuotas? Tbl_Cuotas { get; set; }


	}
}