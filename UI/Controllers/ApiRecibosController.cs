using CAPA_DATOS.Security;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using Transactions;

namespace API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ApiRecibosController : ControllerBase
    {
        //Recibos
        [HttpPost]
        [AuthController(Permissions.GESTION_RECIBOS)]
        public List<Recibos_Transactions> GetRecibos(Recibos_Transactions Inst)
        {
            return Inst.Get<Recibos_Transactions>();
        }
        [HttpPost]
        [AuthController(Permissions.GESTION_RECIBOS)]
        public object saveRecibos(Recibos_Transactions inst)
        {            
            return inst.SaveRecibos(HttpContext.Session.GetString("seassonKey"));
        }
        [HttpPost]
        [AuthController(Permissions.GESTION_RECIBOS)]
        public object? updateRecibos(Recibos_Transactions inst)
        {
            return true;
            //return inst.Update();
        }
        [HttpPost]
        [AuthController(Permissions.GESTION_RECIBOS)]
        public object? anularRecibo(Recibos_Transactions inst)
        {            
            return inst.AnularFactura(HttpContext.Session.GetString("seassonKey"));
        }

        [HttpPost]
        [AuthController(Permissions.GESTION_RECIBOS)]
        public Object? printRecibo(Recibos_Transactions inst)
        {            
            return inst.PrintRecibo(HttpContext.Session.GetString("seassonKey"));
        }
    }
}