using DataBaseModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Model;
using System.Collections.Generic;
namespace API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class Transactional_ContratoController : ControllerBase
    {
        [HttpPost]
        [AuthController]
        public object SaveDataContract(ContractServices Inst)
        {
            return Inst.SaveDataContract(HttpContext.Session.GetString("seassonKey"));
        }
        [HttpPost]
        [AuthController]
        public object SaveContract(ContractServices Inst)
        {
            return Inst.SaveContract(HttpContext.Session.GetString("seassonKey"));
        }

        [HttpPost]
        [AuthController]
        public object GetDataContract()
        {
            return new ContractServices().GetDataContract(HttpContext.Session.GetString("seassonKey"));
        }
    }
}
