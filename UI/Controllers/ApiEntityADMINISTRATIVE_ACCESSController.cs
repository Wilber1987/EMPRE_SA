using DataBaseModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
namespace API.Controllers {
   [Route("api/[controller]/[action]")]
   [ApiController]
   public class  ApiEntityADMINISTRATIVE_ACCESSController : ControllerBase {
       //Transactional_Configuraciones
       [HttpPost]
       [AuthController]
       public List<Transactional_Configuraciones> getTransactional_Configuraciones(Transactional_Configuraciones Inst) {
           return Inst.Get<Transactional_Configuraciones>();
       }
       [HttpPost]
       [AuthController]
       public object saveTransactional_Configuraciones(Transactional_Configuraciones inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateTransactional_Configuraciones(Transactional_Configuraciones inst) {
           return inst.Update();
       }
   }
}