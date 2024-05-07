using System.Transactions;
using API.Controllers;
using CAPA_DATOS;
using CAPA_DATOS.Services;
using DataBaseModel;
using Transactions;
namespace Model
{
    public class ContractServices : TransactionalClass
    {

        public Transaction_Contratos? Transaction_Contratos { get; set; }
        public List<Transactional_Valoracion>? valoraciones { get; set; }
        public string? Moneda { get; set; }
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
                BeginGlobalTransaction();
                var User = AuthNetCore.User(seasonKey);
                var dbUser = new Security_Users { Id_User = User.UserId }.Find<Security_Users>();
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

                Transaction_Contratos.monto = Transaction_Contratos.Valoracion_empeño_dolares;
                Transaction_Contratos.saldo = Transaction_Contratos.Valoracion_empeño_dolares;
                Transaction_Contratos.mora = Convert.ToDouble(configuraciones.Valor);
                Transaction_Contratos.estado = Contratos_State.ACTIVO.ToString();
                Transaction_Contratos.Id_User = dbUser?.Id_User;
                Transaction_Contratos.Tbl_Cuotas?.ForEach(c =>
                {
                    c.pago_contado = 0;
                    c.Estado = "PENDIENTE";
                });
                var Intereses = new Transactional_Configuraciones().GetIntereses();
                Transaction_Contratos.DesgloseIntereses = new DesgloseIntereses
                {
                    GASTOS_ADMINISTRATIVOS = Convert.ToDouble(Intereses.Find(c => c.Nombre.Equals(InteresesPrestamosEnum.GASTOS_ADMINISTRATIVOS.ToString()))?.Valor),
                    COMISIONES = Convert.ToDouble(Intereses.Find(c => c.Nombre.Equals(InteresesPrestamosEnum.COMISIONES.ToString()))?.Valor),
                    MANTENIMIENTO_VALOR = Convert.ToDouble(Intereses.Find(c => c.Nombre.Equals(InteresesPrestamosEnum.MANTENIMIENTO_VALOR.ToString()))?.Valor),
                    GASTOS_LEGALES = Convert.ToDouble(Intereses.Find(c => c.Nombre.Equals(InteresesPrestamosEnum.GASTOS_LEGALES.ToString()))?.Valor),
                    INTERES_NETO_CORRIENTE = Convert.ToDouble(Intereses.Find(c => c.Nombre.Equals(InteresesPrestamosEnum.INTERES_NETO_CORRIENTE.ToString()))?.Valor),
                    GESTION_CREDITICIA = Transaction_Contratos.gestion_crediticia,
                };
                Transaction_Contratos.Save();

                var cuentaOrigen = Catalogo_Cuentas.GetCuentaEgresoContratos(dbUser);

                var cuentaDestino = Catalogo_Cuentas.GetCuentaRegistoContratos(dbUser);

                if (cuentaDestino == null || cuentaOrigen == null)
                {
                    return new ResponseService()
                    {
                        status = 400,
                        message = "Cuentas no configuradas correctamente"
                    };
                }
                ResponseService response = new Movimientos_Cuentas
                {
                    Catalogo_Cuentas_Destino = cuentaDestino,
                    Catalogo_Cuentas_Origen = cuentaOrigen,
                    concepto = "Desembolso de monto para, contrato No: " + Transaction_Contratos.numero_contrato,
                    descripcion = "Desembolso de monto para, contrato No: " + Transaction_Contratos.numero_contrato,
                    moneda = Moneda ?? "DOLARES",
                    monto = Moneda == "CORDOBAS" ? Transaction_Contratos.Valoracion_empeño_cordobas : Transaction_Contratos.monto,
                    tasa_cambio = Transaction_Contratos.taza_cambio,
                    tasa_cambio_compra = Transaction_Contratos.taza_cambio_compra,
                    is_transaction = true
                }.SaveMovimiento(seasonKey);
                if (response.status != 200)
                {
                    RollBackGlobalTransaction();
                    return response;
                }
                CommitGlobalTransaction();
                return new ResponseService()
                {
                    status = 200,
                    message = "Contrato guardado correctamente",
                    body = Transaction_Contratos
                };
            }
            catch (System.Exception ex)
            {
                RollBackGlobalTransaction();
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
}