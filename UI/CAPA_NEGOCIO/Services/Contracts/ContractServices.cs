using System.Transactions;
using API.Controllers;
using CAPA_DATOS;
using CAPA_DATOS.Services;
using DataBaseModel;
namespace Model
{
    public class ContractServices
    {

        public Transaction_Contratos? Transaction_Contratos { get; set; }
        public List<Transactional_Valoracion>? valoraciones { get; set; }
        /**@type {Number} */

        public ResponseService SaveDataContract(string seasonKey)
        {
            try
            {
                new Transactional_Valoracion().GuardarValoraciones(valoraciones);
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

        public ResponseService SaveContract(string seasonKey)
        {
            try
            {
                var configuraciones = new Transactional_Configuraciones().GetConfig(ConfiguracionesInteresesEnum.MORA_CONTRATOS_EMP.ToString());
                Transaction_Contratos.fecha_contrato = DateTime.Now;
                Transaction_Contratos.fecha_cancelar = Transaction_Contratos.Tbl_Cuotas.Select(c => c.fecha).ToList().Max();
                Transaction_Contratos.fecha_vencimiento = Transaction_Contratos.Tbl_Cuotas.Select(c => c.fecha).ToList().Max();//TODO PREGUNTAR
                var valoracion = Transaction_Contratos.Detail_Prendas[0];
                if (valoracion.en_manos_de == EnManosDe.ACREEDOR.ToString()
                && valoracion.Catalogo_Categoria.tipo.ToUpper() != "Vehículos".ToUpper())
                {
                    Transaction_Contratos.tipo = Contratos_Type.EMPENO.ToString();
                }
                else if (valoracion.en_manos_de == EnManosDe.ACREEDOR.ToString()
                 && valoracion.Catalogo_Categoria.tipo.ToUpper() == "Vehículos".ToUpper())
                {

                    Transaction_Contratos.tipo = Contratos_Type.EMPENO_VEHICULO.ToString();
                }
                else
                {
                    Transaction_Contratos.tipo = Contratos_Type.PRESTAMO.ToString();
                }

                Transaction_Contratos.monto = Transaction_Contratos.valoracion_empeño_dolares;
                Transaction_Contratos.saldo = Transaction_Contratos.valoracion_empeño_dolares;
                Transaction_Contratos.mora = Convert.ToDouble(configuraciones.Valor);
                Transaction_Contratos.estado = Contratos_State.ACTIVO.ToString();
                Transaction_Contratos.Id_User = AuthNetCore.User(seasonKey).UserId;

                Transaction_Contratos.Save();
                return new ResponseService()
                {
                    status = 200,
                    message = "Contrato guardado correctamente",
                    body = Transaction_Contratos
                };
            }
            catch (System.Exception ex)
            {

                return new ResponseService()
                {
                    status = 500,
                    body = ex
                };
            }
        }

        public ContractServices GetDataContract(string seasonKey)
        {
            ContractServices? valoracionesTransaction
             = SeasonServices.Get<ContractServices>("ValoracionesTransaction", seasonKey);
            return valoracionesTransaction ?? new ContractServices();
        }
    }

    public class Tbl_Cuotas : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? id_cuota { get; set; }
        /**@type {Date} */
        public DateTime? fecha { get; set; }
        /**@type {Number} Tbl_cuotas del abono*/
        public double? total { get; set; }
        /**@type {Number} valor del interes del capital*/
        public double? interes { get; set; }
        /**@type {Number} */
        public double? abono_capital { get; set; }
        /**@type {Number} capital restante*/
        public double? capital_restante { get; set; }
        /**@type {Number} capital mora*/
        public double? mora { get; set; }
        /**DATOS DE LA FATURA */
        /**@type {Date} */
        public DateTime? fecha_pago { get; set; }
        /**@type {Number} Tbl_cuotas del abono*/
        public double? pago_contado { get; set; }
        /**@type {Number} Tbl_cuotas del abono*/
        public double? descuento { get; set; }
        /**@type {Number} Tbl_cuotas del abono*/
        public double? tasa_cambio { get; set; }
        public int? numero_contrato { get; set; }

        [ManyToOne(TableName = "Transaction_Contratos", KeyColumn = "numero_contrato", ForeignKeyColumn = "numero_contrato")]
        public Transaction_Contratos? Transaction_Contratos { get; set; }

    }
}