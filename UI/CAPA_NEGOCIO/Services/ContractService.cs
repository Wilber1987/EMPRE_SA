using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Mail;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using DataBaseModel;
using iText.IO.Source;
using iText.Kernel.Geom;
using iText.Kernel.Pdf;

namespace CAPA_NEGOCIO.Services
{
    public class ContractService
    {
        public static String SendContract()
        {
            
            Transaction_Contratos test = new Transaction_Contratos();

            String dir = Directory.GetDirectoryRoot("/UI/");

            //var baseUrl = System.IO.Path.GetFullPath("../UI/Contracts");
            //var projectDirectory = Directory.GetParent(Environment.CurrentDirectory).Parent.Parent.FullName;
            var carajo =  File.ReadAllText(System.IO.Path.GetFullPath("../UI/Pages/Contracts/contrato_empeno.cshtml"));


            return carajo;

            

            
        }
    }

    
}