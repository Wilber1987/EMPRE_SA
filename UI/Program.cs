using CAPA_DATOS;
using BackgroundJob.Cron.Jobs;
using CAPA_DATOS.Cron.Jobs;
using Model;

SqlADOConexion.IniciarConexion("sa", "zaxscd", ".", "EMPRE_SA");
//SqlADOConexion.IniciarConexion("empresa", "Wmatus09%", "tcp:empresa-sa.database.windows.net", "EMPRE_SA");

 //var test = new test{ Parameters = new List<object> {1 , 2}}.Get<test>(true);
 //var testfilter = (from t in test where t.val1 == "1"  select t).ToList();

var builder = WebApplication.CreateBuilder(args);
//AppGenerate.Program.Main(); //generador de codigo

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddRazorPages();
builder.Services.AddControllers().AddJsonOptions(JsonOptions =>
		JsonOptions.JsonSerializerOptions.PropertyNamingPolicy = null);
builder.Services.AddControllersWithViews();
builder.Services.AddSession(options =>
{
	options.IdleTimeout = TimeSpan.FromMinutes(40);
});
// builder.Services.AddCronJob<CreateAutomaticsCaseSchedulerJob>(options => 
// {
//     // Corre cada minuto
//     options.CronExpression = "* * * * *";
//     options.TimeZone = TimeZoneInfo.Local;
// });

builder.Services.AddCronJob<SendMovimientoCuentaMailNotificationsSchedulerJob>(options => 
{
	// Corre cada minuto
	options.CronExpression = "* * * * *";
	options.TimeZone = TimeZoneInfo.Local;
});

builder.Services.AddCronJob<CalculateMoraCuotasSchedulerJob>(options => 
{
	// Corre cada minuto
	//options.CronExpression = "0 0 13 1/1 * ? *";//ejecucion diaria a las 1 de la mañana
	options.CronExpression = "0 12 * * *";
	options.TimeZone = TimeZoneInfo.Local;
});

var app = builder.Build();
// builder.Services.AddSession(options =>
// {
//     options.Cookie.Name = ".AdventureWorks.Session";
//     options.IdleTimeout = TimeSpan.FromSeconds(10);
//     options.Cookie.IsEssential = true;
// });

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
	app.UseExceptionHandler("/Error");
	// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
	app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseDefaultFiles();

app.UseRouting();

app.UseAuthorization();
app.UseSession();

app.MapRazorPages();
app.UseEndpoints(endpoints =>
	{
		endpoints.MapControllers();
		endpoints.MapRazorPages();
		endpoints.MapControllerRoute(
		   name: "default",
		   pattern: "{controller=Home}/{action=Login}/{id?}");
	});

app.Run();
