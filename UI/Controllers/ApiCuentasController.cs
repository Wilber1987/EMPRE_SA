using Microsoft.AspNetCore.Mvc;
using DataBaseModel;
using Transactions;

namespace API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ApiCuentasController : ControllerBase
    {
        //Movimientos cuentas
        [HttpPost]
        [AuthController]
        public List<Detail_Movimiento> getDetail_Movimiento(Detail_Movimiento Inst)
        {
            return Inst.Get<Detail_Movimiento>();
        }        
        [HttpPost]
        [AuthController]
        public List<Transaction_Movimiento> getTransaction_Movimiento(Transaction_Movimiento Inst)
        {
            return Inst.Get<Transaction_Movimiento>();
        }

        //Movimientos_Cuentas
        [HttpPost]
        [AuthController]
        public List<Movimientos_Cuentas> getMovimientos_Cuentas(Movimientos_Cuentas Inst)
        {
            return Inst.Get();
        }        
        [HttpPost]
        [AuthController]
        public object? saveMovimientos_Cuentas(Movimientos_Cuentas inst)
        {            
            return inst.Save(HttpContext.Session.GetString("seassonKey"));
        }  
    }
}
