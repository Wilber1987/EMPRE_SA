using DataBaseModel;
using Security;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
namespace API.Controllers {
   [Route("api/[controller]/[action]")]
   [ApiController]
   public class  ApiEntitySecurityController : ControllerBase {
       //Security_Permissions
       [HttpPost]
       [AuthController]
       public List<Security_Permissions> getSecurity_Permissions(Security_Permissions Inst) {
           return Inst.Get<Security_Permissions>();
       }
       [HttpPost]
       [AuthController]
       public object saveSecurity_Permissions(Security_Permissions inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateSecurity_Permissions(Security_Permissions inst) {
           return inst.Update();
       }
       //Security_Permissions_Roles
       [HttpPost]
       [AuthController]
       public List<Security_Permissions_Roles> getSecurity_Permissions_Roles(Security_Permissions_Roles Inst) {
           return Inst.Get<Security_Permissions_Roles>();
       }
       [HttpPost]
       [AuthController]
       public object saveSecurity_Permissions_Roles(Security_Permissions_Roles inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateSecurity_Permissions_Roles(Security_Permissions_Roles inst) {
           return inst.Update();
       }
       //Security_Roles
       [HttpPost]
       [AuthController]
       public List<Security_Roles> getSecurity_Roles(Security_Roles Inst) {
           return Inst.Get<Security_Roles>();
       }
       [HttpPost]
       [AuthController]
       public object saveSecurity_Roles(Security_Roles inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateSecurity_Roles(Security_Roles inst) {
           return inst.Update();
       }
       //Security_Users
       [HttpPost]
       [AuthController]
       public List<Security_Users> getSecurity_Users(Security_Users Inst) {
           return Inst.Get<Security_Users>();
       }
       [HttpPost]
       [AuthController]
       public object saveSecurity_Users(Security_Users inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateSecurity_Users(Security_Users inst) {
           return inst.Update();
       }
       //Security_Users_Roles
       [HttpPost]
       [AuthController]
       public List<Security_Users_Roles> getSecurity_Users_Roles(Security_Users_Roles Inst) {
           return Inst.Get<Security_Users_Roles>();
       }
       [HttpPost]
       [AuthController]
       public object saveSecurity_Users_Roles(Security_Users_Roles inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateSecurity_Users_Roles(Security_Users_Roles inst) {
           return inst.Update();
       }
   }
}
