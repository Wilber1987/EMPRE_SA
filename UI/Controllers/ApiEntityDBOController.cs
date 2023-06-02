using DataBaseModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
namespace API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ApiEntityDBOController : ControllerBase
    {
        [HttpPost]
        [AuthController]
        public List<Catalogo_Estados_Articulos> getCatalogo_Estados_Articulos(Catalogo_Estados_Articulos Inst)
        {
            return Inst.Get<Catalogo_Estados_Articulos>();
        }
        [HttpPost]
        [AuthController]
        public object saveCatalogo_Estados_Articulos(Catalogo_Estados_Articulos inst)
        {
            return inst.Save();
        }
        [HttpPost]
        [AuthController]
        public object updateCatalogo_Estados_Articulos(Catalogo_Estados_Articulos inst)
        {
            return inst.Update();
        }
        //Transactional_Valoracion
        [HttpPost]
        [AuthController]
        public List<Transactional_Valoracion> getTransactional_Valoracion(Transactional_Valoracion Inst)
        {
            return Inst.Get<Transactional_Valoracion>();
        }
        [HttpPost]
        [AuthController]
        public object saveTransactional_Valoracion(Transactional_Valoracion inst)
        {
            return inst.Save();
        }
        [HttpPost]
        [AuthController]
        public object updateTransactional_Valoracion(Transactional_Valoracion inst)
        {
            return inst.Update();
        }
        //Catalogo_Agentes
        [HttpPost]
        [AuthController]
        public List<Catalogo_Agentes> getCatalogo_Agentes(Catalogo_Agentes Inst)
        {
            return Inst.Get<Catalogo_Agentes>();
        }
        [HttpPost]
        [AuthController]
        public object saveCatalogo_Agentes(Catalogo_Agentes inst)
        {
            return inst.Save();
        }
        [HttpPost]
        [AuthController]
        public object updateCatalogo_Agentes(Catalogo_Agentes inst)
        {
            return inst.Update();
        }
        //Catalogo_Clasificacion_Cliente
        [HttpPost]
        [AuthController]
        public List<Catalogo_Clasificacion_Cliente> getCatalogo_Clasificacion_Cliente(Catalogo_Clasificacion_Cliente Inst)
        {
            return Inst.Get<Catalogo_Clasificacion_Cliente>();
        }
        [HttpPost]
        [AuthController]
        public object saveCatalogo_Clasificacion_Cliente(Catalogo_Clasificacion_Cliente inst)
        {
            return inst.Save();
        }
        [HttpPost]
        [AuthController]
        public object updateCatalogo_Clasificacion_Cliente(Catalogo_Clasificacion_Cliente inst)
        {
            return inst.Update();
        }
        //Catalogo_Clientes
        [HttpPost]
        [AuthController]
        public List<Catalogo_Clientes> getCatalogo_Clientes(Catalogo_Clientes Inst)
        {
            return Inst.Get<Catalogo_Clientes>();
        }
        [HttpPost]
        [AuthController]
        public object saveCatalogo_Clientes(Catalogo_Clientes inst)
        {
            return inst.Save();
        }
        [HttpPost]
        [AuthController]
        public object updateCatalogo_Clientes(Catalogo_Clientes inst)
        {
            return inst.Update();
        }
        //Condicion_Laboral_Cliente
        [HttpPost]
        [AuthController]
        public List<Condicion_Laboral_Cliente> getCondicion_Laboral_Cliente(Condicion_Laboral_Cliente Inst) {
            return Inst.Get<Condicion_Laboral_Cliente>();
        }
        [HttpPost]
        [AuthController]
        public object saveCondicion_Laboral_Cliente(Condicion_Laboral_Cliente inst) {
            return inst.Save();
        }
        [HttpPost]
        [AuthController]
        public object updateCondicion_Laboral_Cliente(Condicion_Laboral_Cliente inst) {
            return inst.Update();
        }
        //Catalogo_Tipo_Agente
        [HttpPost]
        [AuthController]
        public List<Catalogo_Tipo_Agente> getCatalogo_Tipo_Agente(Catalogo_Tipo_Agente Inst)
        {
            return Inst.Get<Catalogo_Tipo_Agente>();
        }
        [HttpPost]
        [AuthController]
        public object saveCatalogo_Tipo_Agente(Catalogo_Tipo_Agente inst)
        {
            return inst.Save();
        }
        [HttpPost]
        [AuthController]
        public object updateCatalogo_Tipo_Agente(Catalogo_Tipo_Agente inst)
        {
            return inst.Update();
        }
        //Catalogo_Tipo_Identificacion
        [HttpPost]
        [AuthController]
        public List<Catalogo_Tipo_Identificacion> getCatalogo_Tipo_Identificacion(Catalogo_Tipo_Identificacion Inst)
        {
            return Inst.Get<Catalogo_Tipo_Identificacion>();
        }
        [HttpPost]
        [AuthController]
        public object saveCatalogo_Tipo_Identificacion(Catalogo_Tipo_Identificacion inst)
        {
            return inst.Save();
        }
        [HttpPost]
        [AuthController]
        public object updateCatalogo_Tipo_Identificacion(Catalogo_Tipo_Identificacion inst)
        {
            return inst.Update();
        }
        //Transaction_Contratos
        [HttpPost]
        [AuthController]
        public List<Transaction_Contratos> getTransaction_Contratos(Transaction_Contratos Inst)
        {
            return Inst.Get<Transaction_Contratos>();
        }
        [HttpPost]
        [AuthController]
        public object saveTransaction_Contratos(Transaction_Contratos inst)
        {
            return inst.Save();
        }
        [HttpPost]
        [AuthController]
        public object updateTransaction_Contratos(Transaction_Contratos inst)
        {
            return inst.Update();
        }
        //Detail_Prendas
        [HttpPost]
        [AuthController]
        public List<Detail_Prendas> getDetail_Prendas(Detail_Prendas Inst)
        {
            return Inst.Get<Detail_Prendas>();
        }
        [HttpPost]
        [AuthController]
        public object saveDetail_Prendas(Detail_Prendas inst)
        {
            return inst.Save();
        }
        [HttpPost]
        [AuthController]
        public object updateDetail_Prendas(Detail_Prendas inst)
        {
            return inst.Update();
        }
        //Detail_Prendas_Vehiculos
        [HttpPost]
        [AuthController]
        public List<Detail_Prendas_Vehiculos> getDetail_Prendas_Vehiculos(Detail_Prendas_Vehiculos Inst)
        {
            return Inst.Get<Detail_Prendas_Vehiculos>();
        }
        [HttpPost]
        [AuthController]
        public object saveDetail_Prendas_Vehiculos(Detail_Prendas_Vehiculos inst)
        {
            return inst.Save();
        }
        [HttpPost]
        [AuthController]
        public object updateDetail_Prendas_Vehiculos(Detail_Prendas_Vehiculos inst)
        {
            return inst.Update();
        }
        //Catalogo_Cambio_Dolar
        [HttpPost]
        [AuthController]
        public List<Catalogo_Cambio_Dolar> getCatalogo_Cambio_Dolar(Catalogo_Cambio_Dolar Inst)
        {
            return Inst.Get<Catalogo_Cambio_Dolar>();
        }
        [HttpPost]
        [AuthController]
        public object saveCatalogo_Cambio_Dolar(Catalogo_Cambio_Dolar inst)
        {
            return inst.Save();
        }
        [HttpPost]
        [AuthController]
        public object updateCatalogo_Cambio_Dolar(Catalogo_Cambio_Dolar inst)
        {
            return inst.Update();
        }
        //Catalogo_Cuentas
        [HttpPost]
        [AuthController]
        public List<Catalogo_Cuentas> getCatalogo_Cuentas(Catalogo_Cuentas Inst)
        {
            return Inst.Get<Catalogo_Cuentas>();
        }
        [HttpPost]
        [AuthController]
        public object saveCatalogo_Cuentas(Catalogo_Cuentas inst)
        {
            return inst.Save();
        }
        [HttpPost]
        [AuthController]
        public object updateCatalogo_Cuentas(Catalogo_Cuentas inst)
        {
            return inst.Update();
        }
        //Catalogo_Departamento
        [HttpPost]
        [AuthController]
        public List<Catalogo_Departamento> getCatalogo_Departamento(Catalogo_Departamento Inst)
        {
            return Inst.Get<Catalogo_Departamento>();
        }
        [HttpPost]
        [AuthController]
        public object saveCatalogo_Departamento(Catalogo_Departamento inst)
        {
            return inst.Save();
        }
        [HttpPost]
        [AuthController]
        public object updateCatalogo_Departamento(Catalogo_Departamento inst)
        {
            return inst.Update();
        }
        //Catalogo_Inversores
        [HttpPost]
        [AuthController]
        public List<Catalogo_Inversores> getCatalogo_Inversores(Catalogo_Inversores Inst)
        {
            return Inst.Get<Catalogo_Inversores>();
        }
        [HttpPost]
        [AuthController]
        public object saveCatalogo_Inversores(Catalogo_Inversores inst)
        {
            return inst.Save();
        }
        [HttpPost]
        [AuthController]
        public object updateCatalogo_Inversores(Catalogo_Inversores inst)
        {
            return inst.Update();
        }
        //Catalogo_Municipio
        [HttpPost]
        [AuthController]
        public List<Catalogo_Municipio> getCatalogo_Municipio(Catalogo_Municipio Inst)
        {
            return Inst.Get<Catalogo_Municipio>();
        }
        [HttpPost]
        [AuthController]
        public object saveCatalogo_Municipio(Catalogo_Municipio inst)
        {
            return inst.Save();
        }
        [HttpPost]
        [AuthController]
        public object updateCatalogo_Municipio(Catalogo_Municipio inst)
        {
            return inst.Update();
        }
        //Catalogo_Nacionalidad
        [HttpPost]
        [AuthController]
        public List<Catalogo_Nacionalidad> getCatalogo_Nacionalidad(Catalogo_Nacionalidad Inst)
        {
            return Inst.Get<Catalogo_Nacionalidad>();
        }
        [HttpPost]
        [AuthController]
        public object saveCatalogo_Nacionalidad(Catalogo_Nacionalidad inst)
        {
            return inst.Save();
        }
        [HttpPost]
        [AuthController]
        public object updateCatalogo_Nacionalidad(Catalogo_Nacionalidad inst)
        {
            return inst.Update();
        }
        //Catalogo_Profesiones
        [HttpPost]
        [AuthController]
        public List<Catalogo_Profesiones> getCatalogo_Profesiones(Catalogo_Profesiones Inst)
        {
            return Inst.Get<Catalogo_Profesiones>();
        }
        [HttpPost]
        [AuthController]
        public object saveCatalogo_Profesiones(Catalogo_Profesiones inst)
        {
            return inst.Save();
        }
        [HttpPost]
        [AuthController]
        public object updateCatalogo_Profesiones(Catalogo_Profesiones inst)
        {
            return inst.Update();
        }
        //Catalogo_Tipo_Transaccion
        [HttpPost]
        [AuthController]
        public List<Catalogo_Tipo_Transaccion> getCatalogo_Tipo_Transaccion(Catalogo_Tipo_Transaccion Inst)
        {
            return Inst.Get<Catalogo_Tipo_Transaccion>();
        }
        [HttpPost]
        [AuthController]
        public object saveCatalogo_Tipo_Transaccion(Catalogo_Tipo_Transaccion inst)
        {
            return inst.Save();
        }
        [HttpPost]
        [AuthController]
        public object updateCatalogo_Tipo_Transaccion(Catalogo_Tipo_Transaccion inst)
        {
            return inst.Update();
        }
        //Transaction_Contratos_Inversionistas
        [HttpPost]
        [AuthController]
        public List<Transaction_Contratos_Inversionistas> getTransaction_Contratos_Inversionistas(Transaction_Contratos_Inversionistas Inst)
        {
            return Inst.Get<Transaction_Contratos_Inversionistas>();
        }
        [HttpPost]
        [AuthController]
        public object saveTransaction_Contratos_Inversionistas(Transaction_Contratos_Inversionistas inst)
        {
            return inst.Save();
        }
        [HttpPost]
        [AuthController]
        public object updateTransaction_Contratos_Inversionistas(Transaction_Contratos_Inversionistas inst)
        {
            return inst.Update();
        }
        //Transaction_Egresos
        [HttpPost]
        [AuthController]
        public List<Transaction_Egresos> getTransaction_Egresos(Transaction_Egresos Inst)
        {
            return Inst.Get<Transaction_Egresos>();
        }
        [HttpPost]
        [AuthController]
        public object saveTransaction_Egresos(Transaction_Egresos inst)
        {
            return inst.Save();
        }
        [HttpPost]
        [AuthController]
        public object updateTransaction_Egresos(Transaction_Egresos inst)
        {
            return inst.Update();
        }
        //Transaction_Facturas
        [HttpPost]
        [AuthController]
        public List<Transaction_Facturas> getTransaction_Facturas(Transaction_Facturas Inst)
        {
            return Inst.Get<Transaction_Facturas>();
        }
        [HttpPost]
        [AuthController]
        public object saveTransaction_Facturas(Transaction_Facturas inst)
        {
            return inst.Save();
        }
        [HttpPost]
        [AuthController]
        public object updateTransaction_Facturas(Transaction_Facturas inst)
        {
            return inst.Update();
        }
        //Transaction_Ingresos
        [HttpPost]
        [AuthController]
        public List<Transaction_Ingresos> getTransaction_Ingresos(Transaction_Ingresos Inst)
        {
            return Inst.Get<Transaction_Ingresos>();
        }
        [HttpPost]
        [AuthController]
        public object saveTransaction_Ingresos(Transaction_Ingresos inst)
        {
            return inst.Save();
        }
        [HttpPost]
        [AuthController]
        public object updateTransaction_Ingresos(Transaction_Ingresos inst)
        {
            return inst.Update();
        }
        //Transaction_Ingresos_Egresos
        [HttpPost]
        [AuthController]
        public List<Transaction_Ingresos_Egresos> getTransaction_Ingresos_Egresos(Transaction_Ingresos_Egresos Inst)
        {
            return Inst.Get<Transaction_Ingresos_Egresos>();
        }
        [HttpPost]
        [AuthController]
        public object saveTransaction_Ingresos_Egresos(Transaction_Ingresos_Egresos inst)
        {
            return inst.Save();
        }
        [HttpPost]
        [AuthController]
        public object updateTransaction_Ingresos_Egresos(Transaction_Ingresos_Egresos inst)
        {
            return inst.Update();
        }
        //Catalogo_Sucursales
        [HttpPost]
        [AuthController]
        public List<Catalogo_Sucursales> getCatalogo_Sucursales(Catalogo_Sucursales Inst)
        {
            return Inst.Get<Catalogo_Sucursales>();
        }
        [HttpPost]
        [AuthController]
        public object saveCatalogo_Sucursales(Catalogo_Sucursales inst)
        {
            return inst.Save();
        }
        [HttpPost]
        [AuthController]
        public object updateCatalogo_Sucursales(Catalogo_Sucursales inst)
        {
            return inst.Update();
        }
        //Datos_Configuracion
        [HttpPost]
        [AuthController]
        public List<Datos_Configuracion> getDatos_Configuracion(Datos_Configuracion Inst)
        {
            return Inst.Get<Datos_Configuracion>();
        }
        [HttpPost]
        [AuthController]
        public object saveDatos_Configuracion(Datos_Configuracion inst)
        {
            return inst.Save();
        }
        [HttpPost]
        [AuthController]
        public object updateDatos_Configuracion(Datos_Configuracion inst)
        {
            return inst.Update();
        }
    }
}
