using API.Controllers;
using CAPA_DATOS;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Transactions;
namespace DataBaseModel
{
    public class Tbl_Lotes : EntityClass
    {
        [PrimaryKey(Identity = true)]
        public int? Id_Lote { get; set; }
        public int? Id_Producto { get; set; }
        public Double? Precio_Venta { get; set; }
        public Double? Precio_Compra { get; set; }
        public Double? Cantidad_Inicial { get; set; }
        public Double? Cantidad_Existente { get; set; }
        public int? Id_Sucursal { get; set; }
        public int? Id_User { get; set; }
        public DateTime? Fecha_Ingreso { get; set; }
        public int? Id_Almacen { get; set; }
        public string? Lote { get; set; }
        public int? Id_Detalle_Compra { get; set; }
        public string? Detalles { get; set; }
        [JsonProp]
        public object? Datos_Producto { get; set; }

        [ManyToOne(TableName = "Cat_Almacenes", KeyColumn = "Id_Almacen", ForeignKeyColumn = "Id_Almacen")]
        public Cat_Almacenes? Cat_Almacenes { get; set; }
        [ManyToOne(TableName = "Detalle_Compra", KeyColumn = "Id_Detalle_Compra", ForeignKeyColumn = "Id_Detalle_Compra")]
        public Detalle_Compra? Detalle_Compra { get; set; }
        [ManyToOne(TableName = "Cat_Producto", KeyColumn = "Id_Producto", ForeignKeyColumn = "Id_Producto")]
        public Cat_Producto? Cat_Producto { get; set; }

        [OneToMany(TableName = "Tbl_Transaccion", KeyColumn = "Id_Lote", ForeignKeyColumn = "Id_Lote")]
        public List<Tbl_Transaccion>? lotes { get; set; }

        public static string GenerarLote()
        {
            string fechaLote = DateTime.Now.ToString("yyyyMMddHHmmss");
            string caracteresPermitidos = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            Random random = new Random();
            string parteAleatoria = new string(Enumerable.Repeat(caracteresPermitidos, 3)
                                            .Select(s => s[random.Next(s.Length)]).ToArray());
            string codigoLote = fechaLote + parteAleatoria;
            return codigoLote;
        }

        internal object? DarDeBaja(string identify, Tbl_Transaccion transaccion)
        {
            try
            {
                if (transaccion.Id_Lote == null || transaccion.Cantidad == null  || transaccion.Descripcion == null)
                {
                    return new ResponseService()
                    {
                        status = 403,
                        message = "Lote, Canitidad y Descripcion son requeridos"
                    };
                }
                Tbl_Lotes? loteOriginal = new Tbl_Lotes { Id_Lote = transaccion.Id_Lote }.Find<Tbl_Lotes>();
                var User = AuthNetCore.User(identify);
                var dbUser = new Security_Users { Id_User = User.UserId }.Find<Security_Users>();
                if (loteOriginal == null || loteOriginal.Cantidad_Existente > transaccion.Cantidad)
                {
                    return new ResponseService()
                    {
                        status = 403,
                        message = "Existencia no existe"
                    };
                }
                loteOriginal.Cantidad_Existente -= transaccion.Cantidad;
                transaccion.Id_User = User.UserId;
                transaccion.Tipo = TransactionsType.BAJA_DE_EXISTENCIA.ToString();

                BeginGlobalTransaction();
                loteOriginal.Update();
                transaccion.Save();
                CommitGlobalTransaction();
                return new ResponseService()
                {
                    status = 200,
                    message = "Baja exitosa"
                };
            }
            catch (System.Exception ex)
            {
                RollBackGlobalTransaction();
                LoggerServices.AddMessageError("Error en dar de baja", ex);
                return new ResponseService()
                {
                    status = 500,
                    message = "Error en dar de baja",
                    body = ex
                };
            }

        }
    }

    internal enum TransactionsType
    {
        BAJA_DE_EXISTENCIA
    }
}
