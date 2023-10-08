using CAPA_NEGOCIO.Services;
using DataBaseModel;
using Microsoft.AspNetCore.Mvc;
using CAPA_DATOS;

namespace UI.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PdfController : ControllerBase
    {
        [HttpPost]
        public ResponseService GeneratePdfContract(Transaction_Contratos Inst)
        {
            var model = Inst.Find<Transaction_Contratos>();
            ContractService.generaPDF(model);
            return new ResponseService()
            {
                message = "success",
                value = "../Contracts/output.pdf"
            };
        }
    }
}
