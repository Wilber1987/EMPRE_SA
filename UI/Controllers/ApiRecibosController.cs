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
        [AuthController]
        public List<Recibos> Get(Recibos Inst)
        {
            return Inst.Get();// Inst.Get<Recibos>();
        }
        [HttpPost]
        [AuthController]
        public object saveRecibos(Recibos inst)
        {            
            return inst.SaveRecibos(HttpContext.Session.GetString("seassonKey"));
        }
        [HttpPost]
        [AuthController]
        public object updateRecibos(Recibos inst)
        {
            return true;
            //return inst.Update();
        }
    }
}