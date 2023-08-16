using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Mail;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Text;

namespace CAPA_NEGOCIO.Services
{
    public class MailServices
    {
        public static String SendMail(List<String> toMails, String from, String subject, String path)
        {
            try
            {
                var templatePage = Path.Combine(System.IO.Path.GetFullPath("../UI/Pages/Mails"), path);

                /*******modelo de prueba *****/
                var model = new
                {
                    numero_contrato = 123,
                    monto = 1000,
                    observaciones = "Ejemplo de observaciones",
                    // Otras propiedades...
                };


                MailMessage correo = new MailMessage();
                correo.From = new MailAddress("reply@noreply.com", "EMPRE S.A NOTIFICACIÓN", System.Text.Encoding.UTF8);//Correo de salida

                foreach (String toMail in toMails)
                {
                    correo.To.Add(toMail); //Correos de destino
                }
                correo.Subject = subject; //Asunto
                correo.Body = ContractService.RenderTemplate(templatePage, model);
                correo.IsBodyHtml = true;
                correo.Priority = MailPriority.Normal;
                SmtpClient smtp = new SmtpClient();
                smtp.UseDefaultCredentials = false;
                smtp.Host = "smtp.gmail.com";

                smtp.Port = 587; //Puerto de salida                                 

                smtp.Credentials = new System.Net.NetworkCredential("alderhernandez@gmail.com", "nbixjsqrnhkblxag");//Cuenta de correo
                ServicePointManager.ServerCertificateValidationCallback = delegate (object s,X509Certificate certificate,X509Chain chain, SslPolicyErrors sslPolicyErrors){ return true; };

                smtp.EnableSsl = true;//True si el servidor de correo permite ssl
                smtp.Send(correo);
                return "true";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }

        }
    }
}
