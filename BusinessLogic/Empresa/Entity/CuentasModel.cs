using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using APPCORE;
using Business;
using BusinessLogic.Facturacion.Mapping;
using Transactions;

namespace DataBaseModel
{
    public enum Categoria_CuentasEnum
	{
		CAJA_1,
		CAJA_2,
		CAJA_CHICA,
		CAJA_GENERAL,
		BANCO,
		FACTURAS_CONTRATOS,
		FACTURAS_VENTAS,
		OBLIGACIONES,
		EMPEÑOS,
		PRESTAMOS,
		DESEMBOLSO_CONTRATOS,
		INGRESOS_EMPENOS,
		PAGOS_FACTURAS_CLIENTES,
		PAGOS_FACTURAS_PROVEEDORES,
		INGRESO_COMPRA_DOLARES,
		INGRESO_BENEFICIO_COMPRA_DOLARES
	}

	public class Catalogo_Cuentas : EntityClass
	{
		[PrimaryKey(Identity = true)]
		public int? id_cuentas { get; set; }
		public string? nombre { get; set; }
		public Tipo_CuentaEnum? tipo_cuenta { get; set; }
		public decimal? saldo { get; set; }
		public decimal? saldo_dolares { get; set; }
		public bool? permite_cordobas { get; set; }
		public bool? permite_dolares { get; set; }
		public int? id_sucursal { get; set; }
		public string? Categoria
		{
			get
			{
				return this.Categoria_Cuentas?.descripcion;
			}
		}
		[ManyToOne(TableName = "Catalogo_Sucursales", KeyColumn = "Id_Sucursal", ForeignKeyColumn = "id_sucursal")]
		public Catalogo_Sucursales? Catalogo_Sucursales { get; set; }
		public int? id_categoria { get; set; }
		[ManyToOne(TableName = "Categoria_Cuentas", KeyColumn = "id_categoria", ForeignKeyColumn = "id_categoria")]
		public Categoria_Cuentas? Categoria_Cuentas { get; set; }
		//externa, propia, pago
		[JsonProp]
		public List<Transaccion_Permitida>? Transacciones_Permitidas { get; set; }
		
		
		[OneToMany(TableName = "Inventario_Denominacion_Caja", KeyColumn = "id_cuentas", ForeignKeyColumn = "id_cuenta")]
		public List<Inventario_Denominacion_Caja>?  Inventario_Denominacion  { get; set; } = [];



		private static Catalogo_Cuentas? GetCuenta(Security_Users dbUser, Categoria_CuentasEnum categoria,
		Tipo_CuentaEnum type, Transaccion_Permitida_Enum? transaccion_Permitida)
		{
			int? idCategoria = GetId_categoria(categoria);
			Catalogo_Cuentas? cuenta = null;
			if (idCategoria != null)
			{
				List<FilterData> filters = [FilterData.Equal("id_categoria", idCategoria)];
				if (transaccion_Permitida != null)
				{
					filters.Add(FilterData.JsonPropEqual("Transacciones_Permitidas", "Descripcion", transaccion_Permitida));
				}
				cuenta = new Catalogo_Cuentas
				{
					id_sucursal = dbUser.Id_Sucursal
				}.Find<Catalogo_Cuentas>(
                    [.. filters]
                );
			}
			cuenta = CrearCuentaSiNoExiste(dbUser, idCategoria, cuenta, categoria, type);
			return cuenta;
		}

		/*LA CUENTA QUE DEBE TOMAR ES LA CUENTA DE DONDE LA EMPRESA SACA EL DINERO DESEMBOLSA PARA PAGAR LOS CONTRATOS, PROPIA*/
		public static Catalogo_Cuentas? GetCuentaEgresoContratos(Security_Users dbUser)
		{
			return GetCuenta(dbUser, Categoria_CuentasEnum.CAJA_GENERAL, Tipo_CuentaEnum.PROPIA, Transaccion_Permitida_Enum.EGRESO_CONTRATO);
		}
		/*LA CUENTA QUE DEBE TOMAR ES LA CUENTA A DONDE LA EMPRESA PAGA EL DESEMBOLSA PARA PAGAR LOS CONTRATOS, NORMALMENTE LOS CLIENTES, EXTERNA*/
		public static Catalogo_Cuentas? GetCuentaRegistoContratos(Security_Users dbUser)
		{
			return GetCuenta(dbUser, Categoria_CuentasEnum.DESEMBOLSO_CONTRATOS, Tipo_CuentaEnum.EXTERNA, null);
		}

		/*LA CUENTA QUE DEBE TOMAR ES LA CUENTA A DONDE LA EMPRESA REGISTRA QUE VIENE EL DINERO DE LOS RESIVOS, NORMALMENTE LOS CLIENTES, EXTERNA
			* SI UN CLIENTE HACE UN PAGO QUE DEBE SER ANULADO EL DINERO DEBE REGRESAR A EL
		*/
		public static Catalogo_Cuentas? GetCuentaEgresoRecibos(Security_Users dbUser)
		{
			return GetCuenta(dbUser, Categoria_CuentasEnum.INGRESOS_EMPENOS, Tipo_CuentaEnum.EXTERNA, null);
		}
		/*LA CUENTA QUE DEBE TOMAR ES LA CUENTA A DONDE LA EMPRESA REGISTRA EL DINERO QUE INGRESA DE LOS RECIBIOS
			* SI UN CLIENTE HACE UN PAGO EL DINERO QUE PAGA SE REGISTRARA EN ESTA CUENTA
		*/
		public static Catalogo_Cuentas? GetCuentaIngresoRecibos(Security_Users dbUser)
		{
			return GetCuenta(dbUser, Categoria_CuentasEnum.CAJA_GENERAL, Tipo_CuentaEnum.PROPIA, Transaccion_Permitida_Enum.INGRESO_RECIBO);
		}

		/*
			* LA CUENTA QUE DEBE TOMAR ES LA CUENTA A DONDE LA EMPRESA REGISTRA QUE VIENE EL DINERO DE LAS FACTURAS,
			 NORMALMENTE LOS CLIENTES, EXTERNA
			* SI UN CLIENTE HACE UN PAGO QUE DEBE SER ANULADO EL DINERO DEBE REGRESAR A EL
		*/
		public static Catalogo_Cuentas? GetCuentaEgresoFacturas(Security_Users dbUser)
		{
			return GetCuenta(dbUser, Categoria_CuentasEnum.PAGOS_FACTURAS_CLIENTES, Tipo_CuentaEnum.EXTERNA, null);
		}
		/*LA CUENTA QUE DEBE TOMAR ES LA CUENTA A DONDE LA EMPRESA REGISTRA EL DINERO QUE INGRESA DE LOS RECIBIOS
			* SI UN CLIENTE HACE UN PAGO EL DINERO QUE PAGA SE REGISTRARA EN ESTA CUENTA
		*/
		public static Catalogo_Cuentas? GetCuentaIngresoFacturas(Security_Users dbUser)
		{
			return GetCuenta(dbUser, Categoria_CuentasEnum.CAJA_GENERAL, Tipo_CuentaEnum.PROPIA,
			 Transaccion_Permitida_Enum.INGRESO_FACTURA);
		}

		/*
		* LA CUENTA QUE DEBE TOMAR ES LA CUENTA A DONDE LA EMPRESA REGISTRA QUE VIENE 
			EL DINERO DE LAS FACTURAS QUE SE PAGAN A LOS PROVEEDORES, NORMALMENTE LOS CLIENTES, PROPIA
		* SI UN PROVEEDOR SE LE HACE UNA FACTURA QUE DEBE SER ANULADO EL DINERO DEBE REGRESAR A ESTA CUENTA
	*/
		public static Catalogo_Cuentas? GetCuentaEgresoFacturasProveedor(Security_Users dbUser)
		{
			return GetCuenta(dbUser, Categoria_CuentasEnum.CAJA_GENERAL, Tipo_CuentaEnum.PROPIA, 
			Transaccion_Permitida_Enum.EGRESO_COMPRA);
		}
		/*LA CUENTA QUE DEBE TOMAR ES LA CUENTA A DONDE LA EMPRESA REGISTRA EL DINERO QUE SE LE PAGA
			A LOS PROVEEDORES
			* SI UN PROVEEDORE VENDE UN PRODUCTO EL DINERO QUE SE LE PAGA SE REGISTRARA EN ESTA CUENTA
		*/
		public static Catalogo_Cuentas? GetCuentaIngresoFacturasProveedor(Security_Users dbUser)
		{
			return GetCuenta(dbUser, Categoria_CuentasEnum.PAGOS_FACTURAS_PROVEEDORES, Tipo_CuentaEnum.EXTERNA, null);
		}


		internal static Catalogo_Cuentas? GetCuentaCajaDolares(Security_Users dbUser)
		{
			return GetCuenta(dbUser, Categoria_CuentasEnum.CAJA_GENERAL, Tipo_CuentaEnum.PROPIA, null);
		}

		internal static Catalogo_Cuentas? GetCuentaCajaCordobas(Security_Users dbUser)
		{
			return GetCuenta(dbUser, Categoria_CuentasEnum.CAJA_GENERAL, Tipo_CuentaEnum.PROPIA, null);
		}


		private static Catalogo_Cuentas? CrearCuentaSiNoExiste(Security_Users dbUser, int? idCategoria,
		 Catalogo_Cuentas? cuenta,
		  Categoria_CuentasEnum categoria_CuentasEnum, Tipo_CuentaEnum tipo_cuenta)
		{
			if (idCategoria == null)
			{
				Categoria_Cuentas? categoria_Cuentas = (Categoria_Cuentas?)new Categoria_Cuentas
				{
					descripcion = categoria_CuentasEnum.ToString()
				}.Save();
				idCategoria = categoria_Cuentas?.id_categoria;
			}
			if (cuenta == null)
			{
				cuenta = (Catalogo_Cuentas?)new Catalogo_Cuentas
				{
					id_sucursal = dbUser.Id_Sucursal,
					permite_dolares = true,
					permite_cordobas = true,
					saldo = 0,
					saldo_dolares = 0,
					id_categoria = idCategoria,
					nombre = categoria_CuentasEnum.ToString(),
					tipo_cuenta = tipo_cuenta
				}.Save();
			}
			return cuenta;
		}

		private static int? GetId_categoria(Categoria_CuentasEnum categoria_CuentasEnum)
		{
			return new Categoria_Cuentas { descripcion = categoria_CuentasEnum.ToString() }.Find<Categoria_Cuentas>()?.id_categoria;
		}

		internal static Catalogo_Cuentas? GetCuentaIngresoCompraDolares(Security_Users dbUser)
		{
			return GetCuenta(dbUser, Categoria_CuentasEnum.INGRESO_COMPRA_DOLARES, Tipo_CuentaEnum.EXTERNA, null);
		}

		internal static Catalogo_Cuentas? GetCuentaIngresoBeneficios(Security_Users dbUser)
		{
			return GetCuenta(dbUser, Categoria_CuentasEnum.CAJA_GENERAL, Tipo_CuentaEnum.PROPIA, Transaccion_Permitida_Enum.CAMBIO_MONEDA);
		}

        internal static Catalogo_Cuentas? GetCuentaCajaGeneral(Security_Users? dbUser)
        {
            return GetCuenta(dbUser, Categoria_CuentasEnum.CAJA_GENERAL, Tipo_CuentaEnum.PROPIA, null);
        }
    }

	public class Transaccion_Permitida
	{
		public Transaccion_Permitida_Enum? Descripcion { get; set; }

	}

	public enum Transaccion_Permitida_Enum
	{
		EGRESO_FACTURA, INGRESO_FACTURA, INGRESO_RECIBO, EGRESO_RECIBO, EGRESO_CONTRATO, CAMBIO_MONEDA, EGRESO_COMPRA, INGRESO_COMPRA
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

	public enum Tipo_CuentaEnum
	{
		PROPIA, EXTERNA, PAGO
	}
}