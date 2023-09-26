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
        public List<Recibos_Transaction> Get(Recibos_Transaction Inst)
        {
            return Inst.Get();// Inst.Get<Recibos_Transaction>();
        }
        [HttpPost]
        [AuthController]
        public object saveRecibos(Recibos_Transaction inst)
        {            
            return inst.Save(HttpContext.Session.GetString("seassonKey"));
        }
        [HttpPost]
        [AuthController]
        public object updateRecibos(Recibos_Transaction inst)
        {
            return true;
            //return inst.Update();
        }
    }
}