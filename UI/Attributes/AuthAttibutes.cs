using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using CAPA_NEGOCIO.Security;

namespace API.Controllers
{
    public class AuthControllerAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (!AuthNetCore.Authenticate( filterContext.HttpContext.Session.GetString("seassonKey")))
            {
                Authenticate Aut = new Authenticate();
                Aut.AuthVal = AuthNetCore.Authenticate(filterContext.HttpContext.Session.GetString("seassonKey"));
                filterContext.Result = new ObjectResult(Aut);
            }
        }
    }

    public class AdminAuthAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (!AuthNetCore.HavePermission(PermissionsEnum.ADMIN_ACCESS.ToString(), filterContext.HttpContext.Session.GetString("seassonKey")))
            {
                Authenticate Aut = new Authenticate();
                Aut.AuthVal = false;
                Aut.Message = "Inaccessible resource";
                filterContext.Result = new ObjectResult(Aut);
            }
        }
    }
    public class AnonymousAuthAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            AuthNetCore.AnonymousAuthenticate();
        }
    }
    class Authenticate
    {
        public bool AuthVal { get; set; }
        public string? Message { get; set; }
    }
}
