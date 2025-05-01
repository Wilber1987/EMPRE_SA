
using BackgroundJob.Cron.Jobs;
using APPCORE.Cron.Jobs;
using Model;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.AspNetCore.ResponseCompression;
using BusinessLogic.Connection;

//SqlADOConexion.IniciarConexion("sa", "zaxscd", ".", "EMPRE_SA");


//CONEXIONES DE PRODUCCION
//SqlADOConexion.IniciarConexion("empresa", "Wmatus09%", "tcp:empresociedadanonima.database.windows.net", "EMPRE_SA");

//var test = new test{ Parameters = new List<object> {1 , 2}}.Get<test>(true);
//var testfilter = (from t in test where t.val1 == "1"  select t).ToList();


var builder = WebApplication.CreateBuilder(args);
//AppGenerate.Program.Main(); //generador de codigo

// Add services to the container.

builder.Services.AddRazorPages();

builder.Services.AddControllers()
	.AddJsonOptions(JsonOptions => JsonOptions.JsonSerializerOptions.PropertyNamingPolicy = null)// retorna los nombres reales de las propiedades
	.AddJsonOptions(options => options.JsonSerializerOptions.WriteIndented = false);// Desactiva la indentación


builder.Services.AddResponseCompression(options =>
{
	options.EnableForHttps = true; // Activa la compresión también para HTTPS
	options.Providers.Add<GzipCompressionProvider>(); // Usar Gzip
	options.Providers.Add<BrotliCompressionProvider>(); // Usar Brotli (más eficiente)
});
builder.Services.Configure<GzipCompressionProviderOptions>(options =>
{
	options.Level = System.IO.Compression.CompressionLevel.Fastest; // Puedes ajustar la compresión
});

builder.Services.Configure<BrotliCompressionProviderOptions>(options =>
{
	options.Level = System.IO.Compression.CompressionLevel.Fastest; // Nivel de compresión para Brotli
});


builder.Services.AddControllersWithViews();
builder.Services.AddSession(options =>
{
	options.IdleTimeout = TimeSpan.FromMinutes(40);
});
//TODO ACTIVAR CROMEJOB

builder.Services.AddCronJob<DailyCronJob>(options =>
{
	// Corre cada minuto
	//options.CronExpression = "0 0 13 1/1 * ? *";//ejecucion diaria a las 1 de la mañana
	options.CronExpression = "0 12 * * *";//12 md
	//options.CronExpression = "* * * * *";//cada minuto
	options.TimeZone = TimeZoneInfo.Local;
});

var app = builder.Build();
new BDConnection().IniciarMainConecction(app.Environment.IsDevelopment());
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
app.UseResponseCompression(); // Usa la compresión en la aplicación

app.UseRouting();

app.UseAuthorization();
app.UseSession();

app.MapRazorPages();
app.UseEndpoints(endpoints =>
	{
		endpoints.MapControllers();
		endpoints.MapRazorPages();
		//endpoints.MapFallbackToFile("/CAPA_NEGOCIO/Facturacion/Views/{**page}", "/CAPA_NEGOCIO/Facturacion/Views/{page}");
		endpoints.MapControllerRoute(
		   name: "default",
		   pattern: "{controller=Home}/{action=Login}/{id?}");
	});

app.Run();
