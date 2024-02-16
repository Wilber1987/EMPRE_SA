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
       public Security_Permissions findSecurity_Permissions(Security_Permissions Inst) {
           return Inst.Find<Security_Permissions>();
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
       public Security_Permissions_Roles findSecurity_Permissions_Roles(Security_Permissions_Roles Inst) {
           return Inst.Find<Security_Permissions_Roles>();
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
       public Security_Roles findSecurity_Roles(Security_Roles Inst) {
           return Inst.Find<Security_Roles>();
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
       public Security_Users findSecurity_Users(Security_Users Inst) {
           return Inst.Find<Security_Users>();
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
       public Security_Users_Roles findSecurity_Users_Roles(Security_Users_Roles Inst) {
           return Inst.Find<Security_Users_Roles>();
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
       //Cat_Paises
       [HttpPost]
       [AuthController]
       public List<Cat_Paises> getCat_Paises(Cat_Paises Inst) {
           return Inst.Get<Cat_Paises>();
       }
       [HttpPost]
       [AuthController]
       public Cat_Paises findCat_Paises(Cat_Paises Inst) {
           return Inst.Find<Cat_Paises>();
       }
       [HttpPost]
       [AuthController]
       public object saveCat_Paises(Cat_Paises inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateCat_Paises(Cat_Paises inst) {
           return inst.Update();
       }
       //Tbl_Profile
       [HttpPost]
       [AuthController]
       public List<Tbl_Profile> getTbl_Profile(Tbl_Profile Inst) {
           return Inst.Get<Tbl_Profile>();
       }
       [HttpPost]
       [AuthController]
       public Tbl_Profile findTbl_Profile(Tbl_Profile Inst) {
           return Inst.Find<Tbl_Profile>();
       }
       [HttpPost]
       [AuthController]
       public object saveTbl_Profile(Tbl_Profile inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateTbl_Profile(Tbl_Profile inst) {
           return inst.Update();
       }
   }
}
