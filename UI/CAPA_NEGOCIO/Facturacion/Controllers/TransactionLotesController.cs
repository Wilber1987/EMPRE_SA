using CAPA_DATOS.Security;
using DataBaseModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
namespace API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class TransactionLotesController : ControllerBase
    {
        //Tbl_Lotes
        [HttpPost]
        [AuthController(Permissions.GESTION_LOTES)]
        public object? DarDeBaja(Tbl_Transaccion Inst)
        {
            return new Tbl_Lotes().DarDeBaja(HttpContext.Session.GetString("seassonKey"), Inst);
        }
       
    }
}
