﻿using CAPA_NEGOCIO.Services;
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
        public ResponseService GeneratePdfContract(Transaction_Contratos model)
        {
            ContractService.generaPDF(model, "contrato_empeno.cshtml");
            return new ResponseService()
            {
                message = "success",
                value = "../Contracts/output.pdf"
            };
        }
    }
}