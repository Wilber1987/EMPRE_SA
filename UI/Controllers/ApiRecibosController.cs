using APPCORE.Security;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using Transactions;
using UI.CAPA_NEGOCIO.Empresa.Services.Recibos;

namespace API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ApiRecibosController : ControllerBase
    {
        //Recibos
        [HttpPost]
        [AuthController(Permissions.GESTION_RECIBOS)]
        public List<RecibosServices> GetRecibos(RecibosServices Inst)
        {
            return Inst.Get<RecibosServices>();
        }
        [HttpPost]
        [AuthController(Permissions.GESTION_RECIBOS)]
        public object saveRecibos(RecibosServices inst)
        {            
            return inst.SaveRecibos(HttpContext.Session.GetString("sessionKey"));
        }
        [HttpPost]
        [AuthController(Permissions.GESTION_RECIBOS)]
        public object? updateRecibos(RecibosServices inst)
        {
            return true;
            //return inst.Update();
        }
        [HttpPost]
        [AuthController(Permissions.GESTION_RECIBOS)]
        public object? anularRecibo(RecibosServices inst)
        {            
            return inst.AnularFactura(HttpContext.Session.GetString("sessionKey"));
        }

        [HttpPost]
        [AuthController(Permissions.GESTION_RECIBOS)]
        public Object? printRecibo(RecibosTemplateServices inst)
        {            
            return inst.PrintRecibo(HttpContext.Session.GetString("sessionKey"));
        }
    }
}