using Microsoft.AspNetCore.Mvc;
using CAPA_NEGOCIO.Security;
using DataBaseModel;

namespace API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ApiCuentasController : ControllerBase
    {
        //Movimientos cuentas
        [HttpPost]
        [AuthController]
        public List<Detail_Movimiento> getDetail_Movimientos(Detail_Movimiento Inst)
        {
            return Inst.Get<Detail_Movimiento>();
        }        
        [HttpPost]
        [AuthController]
        public List<Transaction_Movimiento> getTransaction_Movimiento(Transaction_Movimiento Inst)
        {
            return Inst.Get<Transaction_Movimiento>();
        }
    }
}
