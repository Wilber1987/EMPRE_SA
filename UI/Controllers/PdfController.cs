using CAPA_NEGOCIO.Services;
using DataBaseModel;
using Microsoft.AspNetCore.Mvc;

namespace UI.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PdfController : ControllerBase
    {
        [HttpPost]
        public String GeneratePdfContract(Transaction_Contratos model)
        {
            ContractService.generaPDF(model,"contrato_empeno.cshtml");            
            return "ruta del archivo";
        }
    }
}
