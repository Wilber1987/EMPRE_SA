using DataBaseModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using CAPA_NEGOCIO.Services;
using iText.IO.Source;
using iText.Kernel.Pdf;
using iText.Html2pdf;
using iText.Kernel.Geom;
using System.Text;
using iText.Layout;

namespace API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class RecibosController : ControllerBase
    {
        //Recibos
        [HttpPost]
        [AuthController]
        public List<Recibos> getRecibos(Recibos Inst)
        {
            return Inst.Get<Recibos>();
        }
        [HttpPost]
        [AuthController]
        public object saveRecibos(Recibos inst)
        {
            return inst.Save();
        }
        [HttpPost]
        [AuthController]
        public object updateRecibos(Recibos inst)
        {
            return inst.Update();
        }
    }
}