using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DataBaseModel;

namespace BusinessLogic.Empresa.Services.Recibos
{
    public class CuentasRecibosServices
    {
        public static object FindCuentas(string? Identify)
        {
            var (User, dbUser) = Business.Security_Users.GetUserData(Identify);
            var cuentaOrigen = Catalogo_Cuentas.GetCuentaEgresoRecibos(dbUser);
            var cuentaDestino = Catalogo_Cuentas.GetCuentaIngresoRecibos(dbUser);
            return new
            {
                Id_cuenta_origen = cuentaOrigen?.id_cuentas,
                Id_cuenta_destino = cuentaDestino?.id_cuentas
            };
        }

        public static object FindCuentasAnulacion(string? Identify)
        {
            var (User, dbUser) = Business.Security_Users.GetUserData(Identify);
            var cuentaOrigen = Catalogo_Cuentas.GetCuentaIngresoRecibos(dbUser);
            var cuentaDestino = Catalogo_Cuentas.GetCuentaEgresoRecibos(dbUser);
            return new
            {
                Id_cuenta_origen = cuentaOrigen?.id_cuentas,
                Id_cuenta_destino = cuentaDestino?.id_cuentas
            };
        }
    }
}