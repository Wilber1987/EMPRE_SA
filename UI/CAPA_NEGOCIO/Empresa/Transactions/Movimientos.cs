using API.Controllers;
using CAPA_DATOS;
using DataBaseModel;

namespace Transactions
{
    public class Movimientos_Cuentas : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? id_movimiento { get; set; }
        public string? descripcion { get; set; }
        public string? concepto { get; set; }
        public double? monto { get; set; }
        public double? tasa_cambio { get; set; }
        public double? tasa_cambio_compra { get; set; }
        public string? moneda { get; set; }
        public int? id_usuario_crea { get; set; }
        public DateTime? fecha { get; set; }
        public bool? is_transaction { get; set; }
        //public bool? is_anulacion { get; set; }

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
                BeginGlobalTransaction();
                if (this.is_transaction == true)
                {
                    return new ResponseService()
                    {
                        status = 400,
                        message = "No se permite anular un movimiento asociado a una transacción"
                    };
                }
                ResponseService response = SaveMovimiento(token);
                if (response.status == 200)
                {
                    CommitGlobalTransaction();
                }
                else
                {
                    RollBackGlobalTransaction();
                }

                return response;
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
            return new Transaction_Movimiento(){
                filterData = this.filterData
            }.Get<Transaction_Movimiento>().Select(z =>
            {
                var constOrigen = z.Detail_Movimiento?.Find(x => x.credito == 0);
                var constDestino = z.Detail_Movimiento?.Find(x => x.debito == 0);
                return new Movimientos_Cuentas()
                {
                    id_movimiento = z.id_movimiento,
                    descripcion = z.descripcion,
                    concepto = z.concepto,
                    monto = constDestino.moneda?.ToUpper().Equals("DOLARES") == true ? constDestino?.credito_dolares : constDestino?.credito,
                    tasa_cambio = constDestino?.tasa_cambio,
                    tasa_cambio_compra = constDestino?.tasa_cambio_compra,
                    moneda = constDestino.moneda,
                    id_usuario_crea = z.id_usuario_crea,
                    fecha = z.fecha,
                    Catalogo_Cuentas_Origen = constOrigen?.catalogo_Cuentas,
                    Catalogo_Cuentas_Destino = constDestino?.catalogo_Cuentas,
                    id_cuenta_origen = constOrigen?.id_cuenta,
                    id_cuenta_destino = constDestino?.id_cuenta,
                    is_transaction = z.is_transaction
                };
            }
            ).ToList();
        }

        internal ResponseService SaveMovimiento(string token)
        {
            var user = AuthNetCore.User(token);

            var cuentaDestino = new Catalogo_Cuentas()
            {
                id_cuentas = this.Catalogo_Cuentas_Destino?.id_cuentas
            }.Find<Catalogo_Cuentas>();

            var cuentaOrigen = new Catalogo_Cuentas()
            {
                id_cuentas = this.Catalogo_Cuentas_Origen?.id_cuentas
            }.Find<Catalogo_Cuentas>();

            var permiso_cuenta_origen = new Permisos_Cuentas(){
                id_categoria_cuenta_destino = cuentaOrigen.Categoria_Cuentas.id_categoria
            }.Find<Permisos_Cuentas>();

            var permiso_cuenta_destino = new Permisos_Cuentas(){
                id_categoria_cuenta_destino = cuentaDestino.Categoria_Cuentas.id_categoria
            }.Find<Permisos_Cuentas>();

            if (permiso_cuenta_origen!= null && (bool)!permiso_cuenta_origen.permite_debito)
            {
                return new ResponseService()
                {
                    status = 400,
                    message = cuentaOrigen.nombre+" no permite débitos hacia la cuenta: "+cuentaDestino.nombre
                };
            }

            if (permiso_cuenta_destino !=null && (bool)!permiso_cuenta_destino.permite_credito)
            {
                return new ResponseService()
                {
                    status = 400,
                    message = cuentaDestino.nombre+" no permite créditos desde la cuenta: "+cuentaOrigen.nombre
                };
            }
            
            if (cuentaOrigen != null && cuentaDestino != null)
            {
                cuentaOrigen.saldo = cuentaOrigen?.saldo ?? 0;
                cuentaOrigen.saldo_dolares = cuentaOrigen?.saldo_dolares ?? 0;
                cuentaDestino.saldo = cuentaDestino?.saldo ?? 0;
                cuentaDestino.saldo_dolares = cuentaDestino?.saldo_dolares ?? 0;
                if (cuentaOrigen?.tipo_cuenta == Tipo_Cuenta.PROPIA.ToString())
                {
                    var response = new ResponseService()
                    {
                        status = 403,
                        message = $"{this.Catalogo_Cuentas_Origen?.nombre} no cuenta con saldo suficiente"
                    };
                    if (moneda == "DOLARES" && cuentaOrigen.saldo_dolares < monto)
                    {
                        return response;
                    }
                    else if (moneda == "CORDOBAS" && cuentaOrigen.saldo < monto)
                    {
                        return response;
                    }
                }
                if (this.Catalogo_Cuentas_Origen?.id_cuentas == this.Catalogo_Cuentas_Destino?.id_cuentas)
                {
                    return new ResponseService()
                    {
                        status = 403,
                        message = "La cuenta de origen debe ser distinta a la cuenta de destino"
                    };
                }
                if (this.Catalogo_Cuentas_Destino?.permite_dolares == false && this.moneda?.ToUpper() == "DOLARES")
                {
                    return new ResponseService()
                    {
                        status = 403,
                        message = "La cuenta de destino no permite dolares"
                    };
                }
                if (this.Catalogo_Cuentas_Destino?.permite_cordobas == false && this.moneda?.ToUpper() == "CORDOBAS")
                {
                    return new ResponseService()
                    {
                        status = 403,
                        message = "La cuenta de destino no permite cordobas"
                    };
                }
                var encabezado = new Transaction_Movimiento()
                {
                    descripcion = this.descripcion,
                    concepto = this.concepto,
                    id_usuario_crea = user.UserId,
                    tipo = "pendiente",
                    moneda = this.moneda?.ToUpper(),
                    tasa_cambio = this.tasa_cambio,
                    //tasa_cambio_compra = this.tasa_cambio_compra,
                    correo_enviado = false,
                    is_transaction = this.is_transaction,
                    Detail_Movimiento = new List<Detail_Movimiento>(){
                            new Detail_Movimiento(){
                                id_cuenta = this.Catalogo_Cuentas_Origen?.id_cuentas,
                                debito = this.moneda?.ToUpper() == "CORDOBAS" ? this.monto : 0,
                                debito_dolares = this.moneda?.ToUpper() == "DOLARES" ? this.monto : 0,
                                credito = 0,
                                credito_dolares = 0,
                                monto_inicial = cuentaOrigen?.saldo,
                                monto_inicial_dolares = cuentaOrigen?.saldo_dolares,
                                monto_final = cuentaOrigen?.saldo - (this.moneda?.ToUpper() == "CORDOBAS" ? this.monto : 0),
                                monto_final_dolares = cuentaOrigen?.saldo_dolares - (this.moneda?.ToUpper() == "DOLARES" ? this.monto : 0),
                                tasa_cambio = this.tasa_cambio,
                                tasa_cambio_compra = this.tasa_cambio_compra,
                                moneda = this.moneda?.ToUpper()
                            },new Detail_Movimiento(){
                                id_cuenta = this.Catalogo_Cuentas_Destino?.id_cuentas,
                                debito = 0,
                                debito_dolares = 0,
                                credito =  this.moneda?.ToUpper() == "CORDOBAS" ? this.monto : 0,
                                credito_dolares = this.moneda?.ToUpper() == "DOLARES" ? this.monto : 0,
                                monto_inicial = cuentaDestino?.saldo,
                                monto_inicial_dolares = cuentaDestino?.saldo_dolares,
                                monto_final = cuentaDestino?.saldo + (this.moneda?.ToUpper() == "CORDOBAS" ? this.monto : 0),
                                monto_final_dolares = cuentaDestino?.saldo_dolares + (this.moneda?.ToUpper() == "DOLARES" ? this.monto : 0),
                                tasa_cambio = this.tasa_cambio,
                                tasa_cambio_compra = this.tasa_cambio_compra,
                                moneda = this.moneda?.ToUpper()
                            }
                        }
                };
                cuentaOrigen.saldo = cuentaOrigen.saldo - (this.moneda?.ToUpper() == "CORDOBAS" ? this.monto : 0);
                cuentaOrigen.saldo_dolares = cuentaOrigen.saldo_dolares - (this.moneda?.ToUpper() == "DOLARES" ? this.monto : 0);
                cuentaDestino.saldo = cuentaDestino.saldo + (this.moneda?.ToUpper() == "CORDOBAS" ? this.monto : 0);
                cuentaDestino.saldo_dolares = cuentaDestino.saldo_dolares + (this.moneda?.ToUpper() == "DOLARES" ? this.monto : 0);

                cuentaDestino.Update();
                cuentaOrigen.Update();
                var result = encabezado.Save();
                return new ResponseService()
                {
                    status = 200,
                    message = "Movimiento registrado correctamente",
                    body = result
                };
            }
            return new ResponseService()
            {
                status = 400,
                message = "Cuentas invalidas"
            };
        }
    }
}