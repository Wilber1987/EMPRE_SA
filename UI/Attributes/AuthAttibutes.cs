using CAPA_DATOS.Security;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Controllers
{
	public class AuthControllerAttribute : ActionFilterAttribute
	{
		public List<Permissions> PermissionsList { get; set; }
		public AuthControllerAttribute(){
			PermissionsList = new List<Permissions>();
		}
		public AuthControllerAttribute(params Permissions[] permissionsList){
			PermissionsList = permissionsList.ToList() ?? new List<Permissions>();
		}
		//TODO IMPLEMENTAR PERMISOS
		public override void OnActionExecuting(ActionExecutingContext filterContext)
		{			
			//PERMISOS
			if (!AuthNetCore.Authenticate(filterContext.HttpContext.Session.GetString("seassonKey")))
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
			if (!AuthNetCore.HavePermission(Permissions.ADMIN_ACCESS.ToString(), filterContext.HttpContext.Session.GetString("seassonKey")))
			{
				Authenticate Aut = new Authenticate();
				Aut.AuthVal = false;
				Aut.Message = "Inaccessible resource";
				filterContext.Result = new ObjectResult(Aut);
			}
		}
	}
	public class LicenceAttribute : ActionFilterAttribute
	{
		public override void OnActionExecuting(ActionExecutingContext filterContext)
		{
			if (DateTime.Now < new DateTime(2024,05,01))
			{
				Authenticate Aut = new Authenticate();
				Aut.AuthVal = false;
				Aut.Message = "Licence expired";
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
