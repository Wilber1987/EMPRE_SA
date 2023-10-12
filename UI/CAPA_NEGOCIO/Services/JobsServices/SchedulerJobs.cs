using CAPA_DATOS.Cron.Jobs;
using CAPA_NEGOCIO.Services;
using DataBaseModel;
using Model;
using Transactions;

namespace BackgroundJob.Cron.Jobs
{
       public class CalculateMoraCuotasSchedulerJob : CronBackgroundJob
    {
        private readonly ILogger<CalculateMoraCuotasSchedulerJob> _log;

        public CalculateMoraCuotasSchedulerJob(CronSettings<CalculateMoraCuotasSchedulerJob> settings, ILogger<CalculateMoraCuotasSchedulerJob> log)
            : base(settings.CronExpression, settings.TimeZone)
        {
            _log = log;
        }

        protected override Task DoWork(CancellationToken stoppingToken)
        {
            _log.LogInformation(":::::::::::Running...  CalculateMoraCuotasSchedulerJob at {0}", DateTime.UtcNow);
            try
            {

                var cuotas = new Tbl_Cuotas().Get<Tbl_Cuotas>()
                    .Where(cuota => (cuota.pago_contado == null || (cuota.total > cuota.pago_contado ||cuota.pago_contado == null)) && cuota.fecha < DateTime.Now)
                    .ToList();

                double sumaCapitalRestante = (double)cuotas.Sum(cuota => cuota.capital_restante);


                foreach (var cuota in cuotas)
                {
                    //por ejemplo si la cuota es $10 y tiene 5 días de mora el cálculo sería 
                    //((10*0.005)*5) = $0.25 seria el valor de la mora por los 5 días.
                   
                    DateTime fechaOriginal = (DateTime)cuota.fecha;
                    DateTime fechaActual = DateTime.Now;
                    TimeSpan diferencia = fechaActual - fechaOriginal;
                    int diasDeDiferencia = diferencia.Days;


                    var montoMora = /*cuota.total*/ sumaCapitalRestante * ((cuota.Transaction_Contratos?.mora/100) ?? 0.005) * 1;//como el cronjob es diario se va cargando mora cada dia
                    cuota.mora = cuota.mora + montoMora;
                    cuota.total += cuota.total + montoMora; 
                    
                    //cuota.Update();
                }

            }
            catch (System.Exception ex)
            {
                _log.LogInformation(":::::::::::ERROR... at {0}", ex);
            }

            return Task.CompletedTask;
        }

        private IEnumerable<object> Get<T>()
        {
            throw new NotImplementedException();
        }
    }
}

