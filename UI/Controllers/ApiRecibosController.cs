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
        public List<Recibos> GetRecibos(Recibos Inst)
        {
            return Inst.Get<Recibos>();
        }
        [HttpPost]
        [AuthController(Permissions.GESTION_RECIBOS)]
        public object saveRecibos(Recibos inst)
        {            
            return inst.SaveRecibos(HttpContext.Session.GetString("seassonKey"));
        }
        [HttpPost]
        [AuthController(Permissions.GESTION_RECIBOS)]
        public object? updateRecibos(Recibos inst)
        {
            return true;
            //return inst.Update();
        }
        [HttpPost]
        [AuthController(Permissions.GESTION_RECIBOS)]
        public object? anularRecibo(Recibos inst)
        {            
            return inst.AnularFactura(HttpContext.Session.GetString("seassonKey"));
        }

        [HttpPost]
        [AuthController(Permissions.GESTION_RECIBOS)]
        public Object? printRecibo(Recibos inst)
        {            
            return inst.PrintRecibo(HttpContext.Session.GetString("seassonKey"));
        }
    }
}