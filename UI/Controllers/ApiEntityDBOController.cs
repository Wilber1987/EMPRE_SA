using DataBaseModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
namespace API.Controllers {
   [Route("api/[controller]/[action]")]
   [ApiController]
   public class  ApiEntityDBOController : ControllerBase {
       //Catalogo_Sucursales
       [HttpPost]
       [AuthController]
       public List<Catalogo_Sucursales> getCatalogo_Sucursales(Catalogo_Sucursales Inst) {
           return Inst.Get<Catalogo_Sucursales>();
       }
       [HttpPost]
       [AuthController]
       public object saveCatalogo_Sucursales(Catalogo_Sucursales inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateCatalogo_Sucursales(Catalogo_Sucursales inst) {
           return inst.Update();
       }
       //Datos_Configuracion
       [HttpPost]
       [AuthController]
       public List<Datos_Configuracion> getDatos_Configuracion(Datos_Configuracion Inst) {
           return Inst.Get<Datos_Configuracion>();
       }
       [HttpPost]
       [AuthController]
       public object saveDatos_Configuracion(Datos_Configuracion inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateDatos_Configuracion(Datos_Configuracion inst) {
           return inst.Update();
       }
   }
}
