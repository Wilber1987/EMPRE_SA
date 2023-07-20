using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Mail;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Text;

namespace CAPA_NEGOCIO.Services
{
    public class ContractService
    {
        public static String SendContract()
        {
            String dir = Directory.GetDirectoryRoot("/UI/");
            return dir;
             //String HtmlContent = File.ReadAllText("Test2.html");
        }
    }
}