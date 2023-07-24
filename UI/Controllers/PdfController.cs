using CAPA_NEGOCIO.Services;
using Microsoft.AspNetCore.Mvc;

namespace UI.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PdfController : ControllerBase
    {
        [HttpPost]
        public String GeneratePdfContract()
        {
            ContractService.generaPDF("contrato_empeno.cshtml");
            //PdfGenerator.generaPDF();
            return "ruta del archivo";
        }
    }
}
