using CAPA_DATOS.Cron.Jobs;
using CAPA_NEGOCIO.Services;
using DataBaseModel;
using Model;
using Transactions;

namespace BackgroundJob.Cron.Jobs
{
    public class MySchedulerJob : CronBackgroundJob
    {
        private readonly ILogger<MySchedulerJob> _log;

        public MySchedulerJob(CronSettings<MySchedulerJob> settings, ILogger<MySchedulerJob> log)
            : base(settings.CronExpression, settings.TimeZone)
        {
            _log = log;
        }

        protected override Task DoWork(CancellationToken stoppingToken)
        {
            _log.LogInformation(":::::::::::Running... at {0}", DateTime.UtcNow);
            //CARGA AUTOMATICA DE CASOS
            try
            {
                //new IMAPCaseServices().chargeAutomaticCase();
            }
            catch (System.Exception ex)
            {
                _log.LogInformation(":::::::::::ERROR... at {0}", ex);
            }
            return Task.CompletedTask;
        }
    }

    public class CreateAutomaticsCaseSchedulerJob : CronBackgroundJob
    {
        private readonly ILogger<CreateAutomaticsCaseSchedulerJob> _log;

        public CreateAutomaticsCaseSchedulerJob(CronSettings<CreateAutomaticsCaseSchedulerJob> settings, ILogger<CreateAutomaticsCaseSchedulerJob> log)
            : base(settings.CronExpression, settings.TimeZone)
        {
            _log = log;
        }

        protected override Task DoWork(CancellationToken stoppingToken)
        {
            _log.LogInformation(":::::::::::Running... CreateAutomaticsCaseSchedulerJob at {0}", DateTime.UtcNow);
            //CARGA AUTOMATICA DE CASOS
            try
            {
                //new IMAPCaseServices().chargeAutomaticCase();
            }
            catch (System.Exception ex)
            {
                _log.LogInformation(":::::::::::ERROR... at {0}", ex);
            }

            return Task.CompletedTask;
        }
    }

    public class SendMailNotificationsSchedulerJob : CronBackgroundJob
    {
        private readonly ILogger<SendMailNotificationsSchedulerJob> _log;

        public SendMailNotificationsSchedulerJob(CronSettings<SendMailNotificationsSchedulerJob> settings, ILogger<SendMailNotificationsSchedulerJob> log)
            : base(settings.CronExpression, settings.TimeZone)
        {
            _log = log;
        }

        protected override Task DoWork(CancellationToken stoppingToken)
        {
            _log.LogInformation(":::::::::::Running...  SendMailNotificationsSchedulerJob at {0}", DateTime.UtcNow);
            //CARGA AUTOMATICA DE CASOS
            try
            {
                //new SMTPCaseServices().sendCaseMailNotifications();
            }
            catch (System.Exception ex)
            {
                _log.LogInformation(":::::::::::ERROR... at {0}", ex);
            }

            return Task.CompletedTask;
        }
    }

    public class SendMovimientoCuentaMailNotificationsSchedulerJob : CronBackgroundJob
    {
        private readonly ILogger<SendMovimientoCuentaMailNotificationsSchedulerJob> _log;

        public SendMovimientoCuentaMailNotificationsSchedulerJob(CronSettings<SendMovimientoCuentaMailNotificationsSchedulerJob> settings, ILogger<SendMovimientoCuentaMailNotificationsSchedulerJob> log)
            : base(settings.CronExpression, settings.TimeZone)
        {
            _log = log;
        }

        protected override Task DoWork(CancellationToken stoppingToken)
        {
            _log.LogInformation(":::::::::::Running...  SendMovimientoCuentaMailNotificationsSchedulerJob at {0}", DateTime.UtcNow);
            //Envio de mails cada vez que se realice un movimiento entre cuentas
            try
            {
                var movimientos = new Transaction_Movimiento()
                {
                    correo_enviado = false
                }.Get<Transaction_Movimiento>();


                foreach (var item in movimientos)
                {
                    var modelo = new
                    {
                        FechaMovimiento = item.fecha,
                        CuentaOrigen = "Cuenta origen",
                        CuentaDestino = "Cuenta destino",
                        TipoMoneda = item.moneda,
                        Monto = 100,
                        Concepto = item.concepto,
                        Usuario = "todo usuario"
                    };
                    //MailServices.SendMailContract(new List<String>() { "wilberj1987@gmail.com", "alderhernandez@gmail.com" }, "noreply@noreply", "Notificación de movimiento entre cuentas", "NotificacionMovimientoCuentas.cshtml", modelo);//todo definir correos a enviar
                    var update = new Transaction_Movimiento()
                    {
                        id_movimiento = item.id_movimiento
                    }.Find<Transaction_Movimiento>();
                    update.correo_enviado = true;
                    update.Update();
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

                foreach (var cuota in cuotas)
                {
                    //por ejemplo si la cuota es $10 y tiene 5 días de mora el cálculo sería 
                    //((10*0.005)*5) = $0.25 seria el valor de la mora por los 5 días.
                   
                    DateTime fechaOriginal = (DateTime)cuota.fecha;
                    DateTime fechaActual = DateTime.Now;
                    TimeSpan diferencia = fechaActual - fechaOriginal;
                    int diasDeDiferencia = diferencia.Days;


                    var montoMora = (cuota.total * 0.005) * 1;//como el cronjob es diario se va cargando mora cada dia
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

