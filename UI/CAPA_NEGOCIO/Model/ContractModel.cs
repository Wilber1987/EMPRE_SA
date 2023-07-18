using CAPA_DATOS;
using CAPA_NEGOCIO.Services;
using DataBaseModel;
namespace Model
{
    public class ValoracionesTransaction
    {

        public Transaction_Contratos? contrato;
        public List<Transactional_Valoracion>? valoraciones { get; set; }
        /**@type {Number} */

        public ResponseService SaveDataContract(string seasonKey)
        {
            try
            {
                new Transactional_Valoracion().GuardarValoraciones(this.valoraciones);
                SeasonServices.Set("ValoracionesTransaction", this, seasonKey);
                return new ResponseService()
                {
                    status = 200
                };
            }
            catch (System.Exception)
            {

                return new ResponseService()
                {
                    status = 200
                };
            }
        }

        public ValoracionesTransaction GetDataContract(string seasonKey)
        {
            ValoracionesTransaction? valoracionesTransaction
             = SeasonServices.Get<ValoracionesTransaction>("ValoracionesTransaction", seasonKey);
            return valoracionesTransaction ?? new ValoracionesTransaction();

        }
    }
}