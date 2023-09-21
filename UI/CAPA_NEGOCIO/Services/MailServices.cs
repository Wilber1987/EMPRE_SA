using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Mail;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using CAPA_DATOS.Services;
using iText.Forms.Xfdf;

namespace CAPA_NEGOCIO.Services
{
    public class MailServices
    {
        static MailConfig config = new MailConfig()
        {
            HOST = "smtp.gmail.com",
            PASSWORD = "nbixjsqrnhkblxag",
            USERNAME = "alderhernandez@gmail.com"
        };        
        public static string SendMailContract<T>(List<string> toMails, string from, string subject, string path, T model)
        {
            try
            {
                var templatePage = Path.Combine(System.IO.Path.GetFullPath("../UI/Pages/Mails"), path);
                /*******modelo de prueba *****/
               
                SMTPMailServices.SendMail(
                    "reply@noreply.com",
                    toMails,
                    subject,
                    ContractService.RenderTemplate(templatePage, model), null,
                    config
                );
                return "true";
               
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
    }
}
