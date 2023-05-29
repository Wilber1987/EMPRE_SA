using DataBaseModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
namespace API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class Transactional_ValoracionController : ControllerBase
    {
        [HttpPost]
        [AuthController]
        public List<Transactional_Valoracion> GuardarValoraciones(ValoracionesTransaction Inst)
        {
            return new Transactional_Valoracion().GuardarValoraciones(Inst.valoraciones);
        }
    }

    public class ValoracionesTransaction
    {
        public List<Transactional_Valoracion> valoraciones { get; set; }
    }
}
