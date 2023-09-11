using API.Controllers;
using CAPA_DATOS;
using DataBaseModel;

namespace Transactions
{
    public class Movimientos_Cuentas : TransactionalClass
    {
        [PrimaryKey(Identity = true)]
        public int? id_movimiento { get; set; }
        public string? descripcion { get; set; }
        public string? concepto { get; set; }
        public double? monto { get; set; }
        public double? tasa_cambio { get; set; }
        public double? tasa_cambio_compra { get; set; }
        public double? total { get; set; }
        public int? id_usuario_crea { get; set; }
        public DateTime? fecha { get; set; }

        public int? id_cuenta_origen { get; set; }
        [ManyToOne(TableName = "Catalogo_Cuentas", KeyColumn = "id_cuentas", ForeignKeyColumn = "id_cuenta_origen")]
        public Catalogo_Cuentas? Catalogo_Cuentas_Origen { get; set; }
        public int? id_cuenta_destino { get; set; }
        [ManyToOne(TableName = "Catalogo_Cuentas", KeyColumn = "id_cuentas", ForeignKeyColumn = "id_cuenta_destino")]
        public Catalogo_Cuentas? Catalogo_Cuentas_Destino { get; set; }


        public object? Save(string token)
        {
            try
            {

                var user = AuthNetCore.User(token);
                var  cuentaDestino= new Catalogo_Cuentas()
                {
                    id_cuentas = this.Catalogo_Cuentas_Destino?.id_cuentas
                }.Find<Catalogo_Cuentas>();

                var  cuentaOrigen = new Catalogo_Cuentas()
                {
                    id_cuentas = this.Catalogo_Cuentas_Origen?.id_cuentas
                }.Find<Catalogo_Cuentas>();

                if (!(((bool)cuentaDestino.permite_cordobas && (bool)cuentaOrigen.permite_cordobas) || 
                    ((bool)cuentaDestino.permite_dolares && (bool)cuentaOrigen.permite_dolares)))
                {
                    return new ResponseService()
                    {
                        status = 403,
                        message = "La cuenta de destino no admite el tipo de moneda de la cuenta origen"
                    };
                }

                if (cuentaOrigen != null && cuentaDestino != null)
                {
                    cuentaOrigen.saldo = cuentaOrigen?.saldo ?? 0;
                    cuentaOrigen.saldo_dolares = cuentaOrigen?.saldo_dolares ?? 0;
                    cuentaDestino.saldo = cuentaDestino?.saldo ?? 0;
                    cuentaDestino.saldo_dolares = cuentaDestino?.saldo_dolares ?? 0;
                    if (cuentaOrigen?.tipo_cuenta == Tipo_Cuenta.PROPIA.ToString()
                        && cuentaOrigen?.saldo < this.monto)
                    {
                        return new ResponseService()
                        {
                            status = 403,
                            message = "La cuenta " + this.Catalogo_Cuentas_Origen?.nombre + " no cuenta con saldo suficiente"
                        };
                    }
                    if (this.Catalogo_Cuentas_Origen?.id_cuentas == this.Catalogo_Cuentas_Destino?.id_cuentas)
                    {
                        return new ResponseService()
                        {
                            status = 403,
                            message = "La cuenta de origen debe ser distinta a la cuenta de destino"
                        };
                    }
                    var encabezado = new Transaction_Movimiento()
                    {
                        descripcion = this.descripcion,
                        concepto = this.concepto,
                        id_usuario_crea = user.UserId,
                        tipo = "pendiente",
                        moneda = Catalogo_Cuentas_Destino?.permite_cordobas == true ? "C$" : "$",
                        tasa_cambio = this.tasa_cambio,
                        tasa_cambio_compra = this.tasa_cambio_compra,
                        correo_enviado = false,
                        Detail_Movimiento = new List<Detail_Movimiento>(){
                            new Detail_Movimiento(){
                                id_cuenta = this.Catalogo_Cuentas_Origen?.id_cuentas,
                                debito = this.monto,
                                debito_dolares = this.monto / this.tasa_cambio,
                                credito = 0,
                                credito_dolares = 0,
                                monto_inicial = cuentaOrigen?.saldo,
                                monto_inicial_dolares = cuentaOrigen?.saldo_dolares,
                                monto_final = cuentaOrigen?.saldo - this.monto,
                                monto_final_dolares = cuentaOrigen?.saldo_dolares - (this.monto / this.tasa_cambio),
                                tasa_cambio = this.tasa_cambio,
                                tasa_cambio_compra = this.tasa_cambio_compra,
                                moneda = Catalogo_Cuentas_Destino?.permite_cordobas == true ? "C$" : "$"
                            },new Detail_Movimiento(){
                                id_cuenta = this.Catalogo_Cuentas_Destino?.id_cuentas,
                                debito = 0,
                                debito_dolares = 0,
                                credito = this.monto,
                                credito_dolares = this.monto / tasa_cambio,
                                monto_inicial = cuentaDestino?.saldo,
                                monto_inicial_dolares = cuentaDestino?.saldo_dolares,
                                monto_final = cuentaDestino?.saldo + this.monto,
                                monto_final_dolares = cuentaDestino?.saldo_dolares + (this.monto / this.tasa_cambio),
                                tasa_cambio = this.tasa_cambio,
                                tasa_cambio_compra = this.tasa_cambio_compra,
                                moneda = Catalogo_Cuentas_Destino?.permite_cordobas == true ? "C$" : "$"
                            }
                        }
                    };
                    cuentaOrigen.saldo = cuentaOrigen.saldo - this.monto;
                    cuentaOrigen.saldo_dolares = cuentaOrigen.saldo_dolares - (this.monto / this.tasa_cambio);
                    cuentaDestino.saldo = cuentaDestino.saldo + this.monto;
                    cuentaDestino.saldo_dolares = cuentaDestino.saldo_dolares + (this.monto / this.tasa_cambio);
                    BeginGlobalTransaction();
                    cuentaDestino.Update();
                    cuentaOrigen.Update();
                    var result = encabezado.Save();                    
                    CommitGlobalTransaction();
                    return new ResponseService()
                    {
                        status = 200,
                        message = "Movimiento registrado correctamente"
                    };

                }
                return new ResponseService()
                {
                    status = 403,
                    message = "cuentas invalidas"
                };

            }
            catch (System.Exception ex)
            {
                RollBackGlobalTransaction();
                return new ResponseService()
                {
                    message = "Error:" + ex.ToString(),
                    status = 400
                };
            }

        }

        public List<Movimientos_Cuentas> Get()
        {
            return new Transaction_Movimiento().Get<Transaction_Movimiento>().Select(z =>
            {

                var constOrigen = z.Detail_Movimiento?.Find(x => x.credito == 0);
                var constDestino = z.Detail_Movimiento?.Find(x => x.debito == 0);
                return new Movimientos_Cuentas()
                {
                    id_movimiento = z.id_movimiento,
                    descripcion = z.descripcion,
                    concepto = z.concepto,
                    monto = constDestino?.credito,
                    tasa_cambio = constDestino?.tasa_cambio,
                    total = constDestino?.credito / constDestino?.tasa_cambio,
                    id_usuario_crea = z.id_usuario_crea,
                    fecha = z.fecha,
                    Catalogo_Cuentas_Origen = constOrigen?.catalogo_Cuentas,
                    Catalogo_Cuentas_Destino = constDestino?.catalogo_Cuentas,
                    id_cuenta_origen = constOrigen?.id_cuenta,
                    id_cuenta_destino = constDestino?.id_cuenta,
                };
            }
            ).ToList();
        }
    }


}