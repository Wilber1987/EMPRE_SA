using CAPA_DATOS;
using CAPA_NEGOCIO.Security;
using DataBaseModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace Model
{
    public class ValoracionesTransaction
    {

        public Transaction_Contratos contrato;
        public List<Transactional_Valoracion> valoraciones { get; set; }
        /**@type {Number} */       

        public ResponseService SaveDataContract()
        {
            try
            {
                
                new Transactional_Valoracion().GuardarValoraciones(this.valoraciones);
                return new ResponseService()
                {
                    status = 200
                };
            }
            catch (System.Exception ex)
            {

                return new ResponseService()
                {
                    status = 200
                };
            }
        }
    }
}