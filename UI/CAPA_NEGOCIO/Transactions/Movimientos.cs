using API.Controllers;
using CAPA_DATOS;
using DataBaseModel;

namespace Transactions {
     public class Movimientos_Cuentas
    {
        [PrimaryKey(Identity = true)]
        public int? id_movimiento { get; set; }
        public string? descripcion { get; set; }
        public string? concepto { get; set; }
        //public int id_cuenta_origen { get; set; }
        //public int id_cuenta_destino { get; set; }
        public double? monto { get; set; }
        public double? tasa_cambio { get; set; }
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
                var cuenta = new Catalogo_Cuentas()
                {
                    id_cuentas = this.Catalogo_Cuentas_Origen?.id_cuentas
                }.Find<Catalogo_Cuentas>();

                if (cuenta?.tipo_cuenta != Tipo_Cuenta.PROPIA.ToString() && cuenta?.saldo < this.monto)
                {
                    return new ResponseService()
                    {
                        status = 403,
                        message = "La cuenta " + this.Catalogo_Cuentas_Origen?.nombre + " no cuenta con saldo suficiente"
                    };
                }
                var encabezado = new Transaction_Movimiento()
                {
                    descripcion = this.descripcion,
                    concepto = this.concepto,
                    id_usuario_crea = user.UserId,
                    tipo = "pendiente",
                    Detail_Movimiento = new List<Detail_Movimiento>(){
                        new Detail_Movimiento(){
                            id_cuenta = this.Catalogo_Cuentas_Origen?.id_cuentas,
                            debito = this.monto,
                            credito = 0,
                            tasa_cambio = this.tasa_cambio
                        },new Detail_Movimiento(){
                            id_cuenta = this.Catalogo_Cuentas_Destino?.id_cuentas,
                            debito = 0,
                            credito = this.monto,
                            tasa_cambio = this.tasa_cambio
                        }
                    }
                };
                var result = encabezado.Save();
                return new ResponseService()
                {
                    status = 200,
                    message = "Movimiento registrado correctamente"
                };
            }
            catch (System.Exception ex)
            {
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
                    total = constDestino?.credito/constDestino?.tasa_cambio,
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