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
        public object SaveDataContract(ValoracionesTransaction Inst)
        {           
            return Inst.SaveDataContract();           
        }
    }
}