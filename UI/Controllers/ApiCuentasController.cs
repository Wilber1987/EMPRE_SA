using Microsoft.AspNetCore.Mvc;
using DataBaseModel;
using Transactions;
using APPCORE.Security;
using APPCORE;
using BusinessLogic.Empresa.Transactions;
using BusinessLogic.Empresa.Services.Recibos;

namespace API.Controllers
{
	[Route("api/[controller]/[action]")]
	[ApiController]
	public class ApiCuentasController : ControllerBase
	{

		//Movimientos cuentas
		[HttpPost]
		[AuthController(Permissions.GESTION_MOVIMIENTOS)]
		public List<Detail_Movimiento> getDetail_Movimiento(Detail_Movimiento Inst)
		{
			return Inst.Get<Detail_Movimiento>().OrderBy(p => p.id_movimiento).ToList(); ;
		}
		[HttpPost]
		[AuthController(Permissions.GESTION_MOVIMIENTOS)]
		public List<Transaction_Movimiento> getTransaction_Movimiento(Transaction_Movimiento Inst)
		{
			return Inst.Get<Transaction_Movimiento>();
		}

		//Movimientos_Cuentas
		[HttpPost]
		[AuthController(Permissions.GESTION_MOVIMIENTOS)]
		public List<Movimientos_Cuentas> getMovimientos_Cuentas(Movimientos_Cuentas Inst)
		{
			return Inst.Get(HttpContext.Session.GetString("sessionKey"));
		}
		[HttpPost]
		[AuthController(Permissions.GESTION_MOVIMIENTOS)]
		public object? SaveMovimientos_Cuentas(Movimientos_Cuentas inst)
		{
			return inst.Save(HttpContext.Session.GetString("sessionKey"));
		}



		#region ÓRDENES DE MOVIMIENTO
		//ORDERS
		[HttpPost]
		[AuthController(Permissions.GESTION_MOVIMIENTOS)]
		public List<Orden_Movimiento> GetOrden_Movimiento(Orden_Movimiento Inst)
		{
			return OrdersOperations.GetOrder(HttpContext.Session.GetString("sessionKey"));
		}
		[HttpPost]
		[AuthController(Permissions.GESTION_MOVIMIENTOS)]
		public Orden_Movimiento FindOrden_Movimiento(Orden_Movimiento Inst)
		{
			return OrdersOperations.FindOrder(HttpContext.Session.GetString("sessionKey"), Inst);
		}
		[HttpPost]
		[AuthController(Permissions.GESTION_MOVIMIENTOS)]
		public object? SaveOrden_Movimiento(Orden_Movimiento inst)
		{
			return inst.SaveOrder(HttpContext.Session.GetString("sessionKey"));
		}
		[HttpPost]
		[AuthController(Permissions.GESTION_MOVIMIENTOS)]
		public ResponseService AprobarOrden(Orden_Movimiento Inst)
		{
			return new OrdersOperations().AprobarYEjecutar(HttpContext.Session.GetString("sessionKey"), Inst);
		}

		[HttpPost]
		[AuthController(Permissions.GESTION_MOVIMIENTOS)]
		public ResponseService RechazarOrden(Orden_Movimiento Inst)
		{
			return OrdersOperations.Rechazar(HttpContext.Session.GetString("sessionKey"), Inst);
		}

		#endregion
		[HttpPost]
		[AuthController(Permissions.GESTION_MOVIMIENTOS)]
		public ResponseService AbrirCaja(Corte_Caja inst)
		{
			return CajasOperation.AbrirCaja(inst, HttpContext.Session.GetString("sessionKey")); ;
		}
		[HttpPost]
		[AuthController(Permissions.GESTION_MOVIMIENTOS)]
		public ResponseService CerrarCaja(Corte_Caja inst)
		{
			return CajasOperation.CerrarCaja(inst, HttpContext.Session.GetString("sessionKey"));
		}
		[HttpPost]
		[AuthController(Permissions.GESTION_MOVIMIENTOS)]

		public List<Corte_Caja> GetCortesAbiertos(Corte_Caja inst)
		{
			return CajasOperation.GetCortesAbiertos(HttpContext.Session.GetString("sessionKey"));
		}

		[HttpPost]
		[AuthController(Permissions.GESTION_MOVIMIENTOS)]

		public Corte_Caja? GetCorteAbierto(Corte_Caja inst)
		{
			return CajasOperation.GetCorteAbierto(inst.id_cuenta, HttpContext.Session.GetString("sessionKey"));
		}

		[HttpPost]
		[AuthController(Permissions.GESTION_MOVIMIENTOS)]
		public List<Catalogo_Cuentas> GetOwCuentasCaja()
		{
			return CajasOperation.GetOwCuentasCaja(HttpContext.Session.GetString("sessionKey"));
		}


		//Catalogo_Categoria
		[HttpPost]
		[AuthController]
		public List<Denominacion_Catalogo> getDenominacion_Catalogo(Denominacion_Catalogo Inst, [FromQuery] SearchData? pageData)
		{
			return Inst.Where<Denominacion_Catalogo>(FilterData.Limit(30));
		}
		[HttpPost]
		[AuthController(Permissions.ADMIN_ACCESS)]
		public object? saveDenominacion_Catalogo(Denominacion_Catalogo inst)
		{
			return inst.Save();
		}
		[HttpPost]
		[AuthController(Permissions.ADMIN_ACCESS)]
		public object? updateDenominacion_Catalogo(Denominacion_Catalogo inst)
		{
			return inst.Update();
		}
		[HttpPost]
		[AuthController(Permissions.ADMIN_ACCESS)]
		public object? DeleteDenominacion_Catalogo(Denominacion_Catalogo inst)
		{
			return inst.Delete();
		}


		//Catalogo_Categoria
		[HttpPost]
		[AuthController(Permissions.GESTION_MOVIMIENTOS)]
		public List<Inventario_Denominacion_Caja> getInventario_Denominacion_Caja(Inventario_Denominacion_Caja Inst, [FromQuery] SearchData? pageData)
		{
			return Inst.Where<Inventario_Denominacion_Caja>(FilterData.Limit(30));
		}

		//Cuentas
		[HttpPost]
		[AuthController(Permissions.GESTION_MOVIMIENTOS)]
		public object FindCuentasCompras()
		{
			return CuentasRecibosServices.FindCuentas(
				HttpContext.Session.GetString("sessionKey"));
		}

		[HttpPost]
		[AuthController(Permissions.GESTION_MOVIMIENTOS)]
		public object FindCuentasAnularCompras()
		{
			return CuentasRecibosServices.FindCuentasAnulacion(
				HttpContext.Session.GetString("sessionKey"));
		}

	}
}
