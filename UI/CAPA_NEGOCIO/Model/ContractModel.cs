using CAPA_DATOS;
using CAPA_NEGOCIO.Services;
using DataBaseModel;
namespace Model
{
    public class ValoracionesTransaction
    {

        public Transaction_Contratos? Transaction_Contratos { get; set; }
        /**@type {Number} */
        public Double valoracion_compra_cordobas { get; set; }
        /**@type {Number} */
        public Double valoracion_compra_dolares { get; set; }
        /**@type {Number} */
        public Double valoracion_empeño_cordobas { get; set; }
        /**@type {Number} */
        public Double valoracion_empeño_dolares { get; set; }
        /**@type {Number} */
        public Double tasas_interes { get; set; }
        /**@type {Number} */
        public Double taza_interes_cargos { get; set; }
        /**@type {Number} */
        public Double cuotafija { get; set; }
        /**@type {Number} */
        public Double cuotafija_dolares { get; set; }
        /**@type {Number} */
        public Double gestion_crediticia { get; set; }
        /**@type {Number} */
        public Int32 plazo { get; set; }
        /**@type {Date} */
        public DateTime fecha { get; set; }
        /**@type {Catalogo_Clientes} */
        public Catalogo_Clientes? Catalogo_Clientes { get; set; }
        /**@type {Array<Cuota>} */
        public List<Tbl_Cuotas>? Transaction_Facturas { get; set; }
        /**@type {Array<Detail_Prendas>} */
        public List<Detail_Prendas>? Detail_Prendas { get; set; }
        /**@type {String} */
        public String? observaciones { get; set; }

        //?????????????????
        /**@type {Number} */
        public Double monto { get; set; }

        /**@type {Number} */
        public Double total_pagar_cordobas { get; set; }
        /**@type {Number} */
        public Double total_pagar_dolares { get; set; }
        /**@type {Number} */
        public Double interes { get; set; }
        /**@type {Number} */
        public Double interes_dolares { get; set; }
        /**@type {Number} cuota del abono*/
        public Double taza_cambio { get; set; }

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
                Transaction_Contratos.Save();
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