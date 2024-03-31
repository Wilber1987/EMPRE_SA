using DataBaseModel;
using Security;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
namespace API.Controllers {
   [Route("api/[controller]/[action]")]
   [ApiController]
   public class  ApiEntityDboController : ControllerBase {
       //Transaction_Ingresos
       [HttpPost]
       [AuthController]
       public List<Transaction_Ingresos> getTransaction_Ingresos(Transaction_Ingresos Inst) {
           return Inst.Get<Transaction_Ingresos>();
       }
       [HttpPost]
       [AuthController]
       public Transaction_Ingresos findTransaction_Ingresos(Transaction_Ingresos Inst) {
           return Inst.Find<Transaction_Ingresos>();
       }
       [HttpPost]
       [AuthController]
       public object saveTransaction_Ingresos(Transaction_Ingresos inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateTransaction_Ingresos(Transaction_Ingresos inst) {
           return inst.Update();
       }
       //Transaction_Ingresos_Egresos
       [HttpPost]
       [AuthController]
       public List<Transaction_Ingresos_Egresos> getTransaction_Ingresos_Egresos(Transaction_Ingresos_Egresos Inst) {
           return Inst.Get<Transaction_Ingresos_Egresos>();
       }
       [HttpPost]
       [AuthController]
       public Transaction_Ingresos_Egresos findTransaction_Ingresos_Egresos(Transaction_Ingresos_Egresos Inst) {
           return Inst.Find<Transaction_Ingresos_Egresos>();
       }
       [HttpPost]
       [AuthController]
       public object saveTransaction_Ingresos_Egresos(Transaction_Ingresos_Egresos inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateTransaction_Ingresos_Egresos(Transaction_Ingresos_Egresos inst) {
           return inst.Update();
       }
       //Transaction_Movimiento
       [HttpPost]
       [AuthController]
       public List<Transaction_Movimiento> getTransaction_Movimiento(Transaction_Movimiento Inst) {
           return Inst.Get<Transaction_Movimiento>();
       }
       [HttpPost]
       [AuthController]
       public Transaction_Movimiento findTransaction_Movimiento(Transaction_Movimiento Inst) {
           return Inst.Find<Transaction_Movimiento>();
       }
       [HttpPost]
       [AuthController]
       public object saveTransaction_Movimiento(Transaction_Movimiento inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateTransaction_Movimiento(Transaction_Movimiento inst) {
           return inst.Update();
       }
       //Transactional_Valoracion
       [HttpPost]
       [AuthController]
       public List<Transactional_Valoracion> getTransactional_Valoracion(Transactional_Valoracion Inst) {
           return Inst.Get<Transactional_Valoracion>();
       }
       [HttpPost]
       [AuthController]
       public Transactional_Valoracion findTransactional_Valoracion(Transactional_Valoracion Inst) {
           return Inst.Find<Transactional_Valoracion>();
       }
       [HttpPost]
       [AuthController]
       public object saveTransactional_Valoracion(Transactional_Valoracion inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateTransactional_Valoracion(Transactional_Valoracion inst) {
           return inst.Update();
       }
       //Catalogo_Agentes
       [HttpPost]
       [AuthController]
       public List<Catalogo_Agentes> getCatalogo_Agentes(Catalogo_Agentes Inst) {
           return Inst.Get<Catalogo_Agentes>();
       }
       [HttpPost]
       [AuthController]
       public Catalogo_Agentes findCatalogo_Agentes(Catalogo_Agentes Inst) {
           return Inst.Find<Catalogo_Agentes>();
       }
       [HttpPost]
       [AuthController]
       public object saveCatalogo_Agentes(Catalogo_Agentes inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateCatalogo_Agentes(Catalogo_Agentes inst) {
           return inst.Update();
       }
       //Recibos
       [HttpPost]
       [AuthController]
       public List<Recibos> getRecibos(Recibos Inst) {
           return Inst.Get<Recibos>();
       }
       [HttpPost]
       [AuthController]
       public Recibos findRecibos(Recibos Inst) {
           return Inst.Find<Recibos>();
       }
       [HttpPost]
       [AuthController]
       public object saveRecibos(Recibos inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateRecibos(Recibos inst) {
           return inst.Update();
       }
       //Catalogo_Cambio_Divisa
       [HttpPost]
       [AuthController]
       public List<Catalogo_Cambio_Divisa> getCatalogo_Cambio_Divisa(Catalogo_Cambio_Divisa Inst) {
           return Inst.Get<Catalogo_Cambio_Divisa>();
       }
       [HttpPost]
       [AuthController]
       public Catalogo_Cambio_Divisa findCatalogo_Cambio_Divisa(Catalogo_Cambio_Divisa Inst) {
           return Inst.Find<Catalogo_Cambio_Divisa>();
       }
       [HttpPost]
       [AuthController]
       public object saveCatalogo_Cambio_Divisa(Catalogo_Cambio_Divisa inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateCatalogo_Cambio_Divisa(Catalogo_Cambio_Divisa inst) {
           return inst.Update();
       }
       //Catalogo_Categoria
       [HttpPost]
       [AuthController]
       public List<Catalogo_Categoria> getCatalogo_Categoria(Catalogo_Categoria Inst) {
           return Inst.Get<Catalogo_Categoria>();
       }
       [HttpPost]
       [AuthController]
       public Catalogo_Categoria findCatalogo_Categoria(Catalogo_Categoria Inst) {
           return Inst.Find<Catalogo_Categoria>();
       }
       [HttpPost]
       [AuthController]
       public object saveCatalogo_Categoria(Catalogo_Categoria inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateCatalogo_Categoria(Catalogo_Categoria inst) {
           return inst.Update();
       }
       //Tbl_Cuotas
       [HttpPost]
       [AuthController]
       public List<Tbl_Cuotas> getTbl_Cuotas(Tbl_Cuotas Inst) {
           return Inst.Get<Tbl_Cuotas>();
       }
       [HttpPost]
       [AuthController]
       public Tbl_Cuotas findTbl_Cuotas(Tbl_Cuotas Inst) {
           return Inst.Find<Tbl_Cuotas>();
       }
       [HttpPost]
       [AuthController]
       public object saveTbl_Cuotas(Tbl_Cuotas inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateTbl_Cuotas(Tbl_Cuotas inst) {
           return inst.Update();
       }
       //Catalogo_Clasificacion_Cliente
       [HttpPost]
       [AuthController]
       public List<Catalogo_Clasificacion_Cliente> getCatalogo_Clasificacion_Cliente(Catalogo_Clasificacion_Cliente Inst) {
           return Inst.Get<Catalogo_Clasificacion_Cliente>();
       }
       [HttpPost]
       [AuthController]
       public Catalogo_Clasificacion_Cliente findCatalogo_Clasificacion_Cliente(Catalogo_Clasificacion_Cliente Inst) {
           return Inst.Find<Catalogo_Clasificacion_Cliente>();
       }
       [HttpPost]
       [AuthController]
       public object saveCatalogo_Clasificacion_Cliente(Catalogo_Clasificacion_Cliente inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateCatalogo_Clasificacion_Cliente(Catalogo_Clasificacion_Cliente inst) {
           return inst.Update();
       }
       //Transaction_Contratos
       [HttpPost]
       [AuthController]
       public List<Transaction_Contratos> getTransaction_Contratos(Transaction_Contratos Inst) {
           return Inst.Get<Transaction_Contratos>();
       }
       [HttpPost]
       [AuthController]
       public Transaction_Contratos findTransaction_Contratos(Transaction_Contratos Inst) {
           return Inst.Find<Transaction_Contratos>();
       }
       [HttpPost]
       [AuthController]
       public object saveTransaction_Contratos(Transaction_Contratos inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateTransaction_Contratos(Transaction_Contratos inst) {
           return inst.Update();
       }
       //Catalogo_Clasificacion_Interes
       [HttpPost]
       [AuthController]
       public List<Catalogo_Clasificacion_Interes> getCatalogo_Clasificacion_Interes(Catalogo_Clasificacion_Interes Inst) {
           return Inst.Get<Catalogo_Clasificacion_Interes>();
       }
       [HttpPost]
       [AuthController]
       public Catalogo_Clasificacion_Interes findCatalogo_Clasificacion_Interes(Catalogo_Clasificacion_Interes Inst) {
           return Inst.Find<Catalogo_Clasificacion_Interes>();
       }
       [HttpPost]
       [AuthController]
       public object saveCatalogo_Clasificacion_Interes(Catalogo_Clasificacion_Interes inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateCatalogo_Clasificacion_Interes(Catalogo_Clasificacion_Interes inst) {
           return inst.Update();
       }
       //Catalogo_Clientes
       [HttpPost]
       [AuthController]
       public List<Catalogo_Clientes> getCatalogo_Clientes(Catalogo_Clientes Inst) {
           return Inst.Get<Catalogo_Clientes>();
       }
       [HttpPost]
       [AuthController]
       public Catalogo_Clientes findCatalogo_Clientes(Catalogo_Clientes Inst) {
           return Inst.Find<Catalogo_Clientes>();
       }
       [HttpPost]
       [AuthController]
       public object saveCatalogo_Clientes(Catalogo_Clientes inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateCatalogo_Clientes(Catalogo_Clientes inst) {
           return inst.Update();
       }
       //Catalogo_Cuentas
       [HttpPost]
       [AuthController]
       public List<Catalogo_Cuentas> getCatalogo_Cuentas(Catalogo_Cuentas Inst) {
           return Inst.Get<Catalogo_Cuentas>();
       }
       [HttpPost]
       [AuthController]
       public Catalogo_Cuentas findCatalogo_Cuentas(Catalogo_Cuentas Inst) {
           return Inst.Find<Catalogo_Cuentas>();
       }
       [HttpPost]
       [AuthController]
       public object saveCatalogo_Cuentas(Catalogo_Cuentas inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateCatalogo_Cuentas(Catalogo_Cuentas inst) {
           return inst.Update();
       }
       //Catalogo_Departamento
       [HttpPost]
       [AuthController]
       public List<Catalogo_Departamento> getCatalogo_Departamento(Catalogo_Departamento Inst) {
           return Inst.Get<Catalogo_Departamento>();
       }
       [HttpPost]
       [AuthController]
       public Catalogo_Departamento findCatalogo_Departamento(Catalogo_Departamento Inst) {
           return Inst.Find<Catalogo_Departamento>();
       }
       [HttpPost]
       [AuthController]
       public object saveCatalogo_Departamento(Catalogo_Departamento inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateCatalogo_Departamento(Catalogo_Departamento inst) {
           return inst.Update();
       }
       //Catalogo_Estados_Articulos
       [HttpPost]
       [AuthController]
       public List<Catalogo_Estados_Articulos> getCatalogo_Estados_Articulos(Catalogo_Estados_Articulos Inst) {
           return Inst.Get<Catalogo_Estados_Articulos>();
       }
       [HttpPost]
       [AuthController]
       public Catalogo_Estados_Articulos findCatalogo_Estados_Articulos(Catalogo_Estados_Articulos Inst) {
           return Inst.Find<Catalogo_Estados_Articulos>();
       }
       [HttpPost]
       [AuthController]
       public object saveCatalogo_Estados_Articulos(Catalogo_Estados_Articulos inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateCatalogo_Estados_Articulos(Catalogo_Estados_Articulos inst) {
           return inst.Update();
       }
       //Catalogo_Inversores
       [HttpPost]
       [AuthController]
       public List<Catalogo_Inversores> getCatalogo_Inversores(Catalogo_Inversores Inst) {
           return Inst.Get<Catalogo_Inversores>();
       }
       [HttpPost]
       [AuthController]
       public Catalogo_Inversores findCatalogo_Inversores(Catalogo_Inversores Inst) {
           return Inst.Find<Catalogo_Inversores>();
       }
       [HttpPost]
       [AuthController]
       public object saveCatalogo_Inversores(Catalogo_Inversores inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateCatalogo_Inversores(Catalogo_Inversores inst) {
           return inst.Update();
       }
       //Catalogo_Municipio
       [HttpPost]
       [AuthController]
       public List<Catalogo_Municipio> getCatalogo_Municipio(Catalogo_Municipio Inst) {
           return Inst.Get<Catalogo_Municipio>();
       }
       [HttpPost]
       [AuthController]
       public Catalogo_Municipio findCatalogo_Municipio(Catalogo_Municipio Inst) {
           return Inst.Find<Catalogo_Municipio>();
       }
       [HttpPost]
       [AuthController]
       public object saveCatalogo_Municipio(Catalogo_Municipio inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateCatalogo_Municipio(Catalogo_Municipio inst) {
           return inst.Update();
       }
       //Catalogo_Nacionalidad
       [HttpPost]
       [AuthController]
       public List<Catalogo_Nacionalidad> getCatalogo_Nacionalidad(Catalogo_Nacionalidad Inst) {
           return Inst.Get<Catalogo_Nacionalidad>();
       }
       [HttpPost]
       [AuthController]
       public Catalogo_Nacionalidad findCatalogo_Nacionalidad(Catalogo_Nacionalidad Inst) {
           return Inst.Find<Catalogo_Nacionalidad>();
       }
       [HttpPost]
       [AuthController]
       public object saveCatalogo_Nacionalidad(Catalogo_Nacionalidad inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateCatalogo_Nacionalidad(Catalogo_Nacionalidad inst) {
           return inst.Update();
       }
       //Catalogo_Profesiones
       [HttpPost]
       [AuthController]
       public List<Catalogo_Profesiones> getCatalogo_Profesiones(Catalogo_Profesiones Inst) {
           return Inst.Get<Catalogo_Profesiones>();
       }
       [HttpPost]
       [AuthController]
       public Catalogo_Profesiones findCatalogo_Profesiones(Catalogo_Profesiones Inst) {
           return Inst.Find<Catalogo_Profesiones>();
       }
       [HttpPost]
       [AuthController]
       public object saveCatalogo_Profesiones(Catalogo_Profesiones inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateCatalogo_Profesiones(Catalogo_Profesiones inst) {
           return inst.Update();
       }
       //Catalogo_Sucursales
       [HttpPost]
       [AuthController]
       public List<Catalogo_Sucursales> getCatalogo_Sucursales(Catalogo_Sucursales Inst) {
           return Inst.Get<Catalogo_Sucursales>();
       }
       [HttpPost]
       [AuthController]
       public Catalogo_Sucursales findCatalogo_Sucursales(Catalogo_Sucursales Inst) {
           return Inst.Find<Catalogo_Sucursales>();
       }
       [HttpPost]
       [AuthController]
       public object saveCatalogo_Sucursales(Catalogo_Sucursales inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateCatalogo_Sucursales(Catalogo_Sucursales inst) {
           return inst.Update();
       }
       //Detalle_Factura_Recibo
       [HttpPost]
       [AuthController]
       public List<Detalle_Factura_Recibo> getDetalle_Factura_Recibo(Detalle_Factura_Recibo Inst) {
           return Inst.Get<Detalle_Factura_Recibo>();
       }
       [HttpPost]
       [AuthController]
       public Detalle_Factura_Recibo findDetalle_Factura_Recibo(Detalle_Factura_Recibo Inst) {
           return Inst.Find<Detalle_Factura_Recibo>();
       }
       [HttpPost]
       [AuthController]
       public object saveDetalle_Factura_Recibo(Detalle_Factura_Recibo inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateDetalle_Factura_Recibo(Detalle_Factura_Recibo inst) {
           return inst.Update();
       }
       //Catalogo_Tipo_Agente
       [HttpPost]
       [AuthController]
       public List<Catalogo_Tipo_Agente> getCatalogo_Tipo_Agente(Catalogo_Tipo_Agente Inst) {
           return Inst.Get<Catalogo_Tipo_Agente>();
       }
       [HttpPost]
       [AuthController]
       public Catalogo_Tipo_Agente findCatalogo_Tipo_Agente(Catalogo_Tipo_Agente Inst) {
           return Inst.Find<Catalogo_Tipo_Agente>();
       }
       [HttpPost]
       [AuthController]
       public object saveCatalogo_Tipo_Agente(Catalogo_Tipo_Agente inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateCatalogo_Tipo_Agente(Catalogo_Tipo_Agente inst) {
           return inst.Update();
       }
       //Catalogo_Tipo_Identificacion
       [HttpPost]
       [AuthController]
       public List<Catalogo_Tipo_Identificacion> getCatalogo_Tipo_Identificacion(Catalogo_Tipo_Identificacion Inst) {
           return Inst.Get<Catalogo_Tipo_Identificacion>();
       }
       [HttpPost]
       [AuthController]
       public Catalogo_Tipo_Identificacion findCatalogo_Tipo_Identificacion(Catalogo_Tipo_Identificacion Inst) {
           return Inst.Find<Catalogo_Tipo_Identificacion>();
       }
       [HttpPost]
       [AuthController]
       public object saveCatalogo_Tipo_Identificacion(Catalogo_Tipo_Identificacion inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateCatalogo_Tipo_Identificacion(Catalogo_Tipo_Identificacion inst) {
           return inst.Update();
       }
       //Catalogo_Tipo_Transaccion
       [HttpPost]
       [AuthController]
       public List<Catalogo_Tipo_Transaccion> getCatalogo_Tipo_Transaccion(Catalogo_Tipo_Transaccion Inst) {
           return Inst.Get<Catalogo_Tipo_Transaccion>();
       }
       [HttpPost]
       [AuthController]
       public Catalogo_Tipo_Transaccion findCatalogo_Tipo_Transaccion(Catalogo_Tipo_Transaccion Inst) {
           return Inst.Find<Catalogo_Tipo_Transaccion>();
       }
       [HttpPost]
       [AuthController]
       public object saveCatalogo_Tipo_Transaccion(Catalogo_Tipo_Transaccion inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateCatalogo_Tipo_Transaccion(Catalogo_Tipo_Transaccion inst) {
           return inst.Update();
       }
       //Categoria_Cuentas
       [HttpPost]
       [AuthController]
       public List<Categoria_Cuentas> getCategoria_Cuentas(Categoria_Cuentas Inst) {
           return Inst.Get<Categoria_Cuentas>();
       }
       [HttpPost]
       [AuthController]
       public Categoria_Cuentas findCategoria_Cuentas(Categoria_Cuentas Inst) {
           return Inst.Find<Categoria_Cuentas>();
       }
       [HttpPost]
       [AuthController]
       public object saveCategoria_Cuentas(Categoria_Cuentas inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateCategoria_Cuentas(Categoria_Cuentas inst) {
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
       public Condicion_Laboral_Cliente findCondicion_Laboral_Cliente(Condicion_Laboral_Cliente Inst) {
           return Inst.Find<Condicion_Laboral_Cliente>();
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
       //Datos_Configuracion
       [HttpPost]
       [AuthController]
       public List<Datos_Configuracion> getDatos_Configuracion(Datos_Configuracion Inst) {
           return Inst.Get<Datos_Configuracion>();
       }
       [HttpPost]
       [AuthController]
       public Datos_Configuracion findDatos_Configuracion(Datos_Configuracion Inst) {
           return Inst.Find<Datos_Configuracion>();
       }
       [HttpPost]
       [AuthController]
       public object saveDatos_Configuracion(Datos_Configuracion inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateDatos_Configuracion(Datos_Configuracion inst) {
           return inst.Update();
       }
       //Detail_Movimiento
       [HttpPost]
       [AuthController]
       public List<Detail_Movimiento> getDetail_Movimiento(Detail_Movimiento Inst) {
           return Inst.Get<Detail_Movimiento>();
       }
       [HttpPost]
       [AuthController]
       public Detail_Movimiento findDetail_Movimiento(Detail_Movimiento Inst) {
           return Inst.Find<Detail_Movimiento>();
       }
       [HttpPost]
       [AuthController]
       public object saveDetail_Movimiento(Detail_Movimiento inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateDetail_Movimiento(Detail_Movimiento inst) {
           return inst.Update();
       }
       //Detail_Prendas
       [HttpPost]
       [AuthController]
       public List<Detail_Prendas> getDetail_Prendas(Detail_Prendas Inst) {
           return Inst.Get<Detail_Prendas>();
       }
       [HttpPost]
       [AuthController]
       public Detail_Prendas findDetail_Prendas(Detail_Prendas Inst) {
           return Inst.Find<Detail_Prendas>();
       }
       [HttpPost]
       [AuthController]
       public object saveDetail_Prendas(Detail_Prendas inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateDetail_Prendas(Detail_Prendas inst) {
           return inst.Update();
       }
       //Detail_Prendas_Vehiculos
       [HttpPost]
       [AuthController]
       public List<Detail_Prendas_Vehiculos> getDetail_Prendas_Vehiculos(Detail_Prendas_Vehiculos Inst) {
           return Inst.Get<Detail_Prendas_Vehiculos>();
       }
       [HttpPost]
       [AuthController]
       public Detail_Prendas_Vehiculos findDetail_Prendas_Vehiculos(Detail_Prendas_Vehiculos Inst) {
           return Inst.Find<Detail_Prendas_Vehiculos>();
       }
       [HttpPost]
       [AuthController]
       public object saveDetail_Prendas_Vehiculos(Detail_Prendas_Vehiculos inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateDetail_Prendas_Vehiculos(Detail_Prendas_Vehiculos inst) {
           return inst.Update();
       }
       //Detail_Valores
       [HttpPost]
       [AuthController]
       public List<Detail_Valores> getDetail_Valores(Detail_Valores Inst) {
           return Inst.Get<Detail_Valores>();
       }
       [HttpPost]
       [AuthController]
       public Detail_Valores findDetail_Valores(Detail_Valores Inst) {
           return Inst.Find<Detail_Valores>();
       }
       [HttpPost]
       [AuthController]
       public object saveDetail_Valores(Detail_Valores inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateDetail_Valores(Detail_Valores inst) {
           return inst.Update();
       }
       //Permisos_Cuentas
       [HttpPost]
       [AuthController]
       public List<Permisos_Cuentas> getPermisos_Cuentas(Permisos_Cuentas Inst) {
           return Inst.Get<Permisos_Cuentas>();
       }
       [HttpPost]
       [AuthController]
       public Permisos_Cuentas findPermisos_Cuentas(Permisos_Cuentas Inst) {
           return Inst.Find<Permisos_Cuentas>();
       }
       [HttpPost]
       [AuthController]
       public object savePermisos_Cuentas(Permisos_Cuentas inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updatePermisos_Cuentas(Permisos_Cuentas inst) {
           return inst.Update();
       }
       //Transaction_Contratos_old
       [HttpPost]
       [AuthController]
       public List<Transaction_Contratos_old> getTransaction_Contratos_old(Transaction_Contratos_old Inst) {
           return Inst.Get<Transaction_Contratos_old>();
       }
       [HttpPost]
       [AuthController]
       public Transaction_Contratos_old findTransaction_Contratos_old(Transaction_Contratos_old Inst) {
           return Inst.Find<Transaction_Contratos_old>();
       }
       [HttpPost]
       [AuthController]
       public object saveTransaction_Contratos_old(Transaction_Contratos_old inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateTransaction_Contratos_old(Transaction_Contratos_old inst) {
           return inst.Update();
       }
       //Transaction_Contratos_Inversionistas
       [HttpPost]
       [AuthController]
       public List<Transaction_Contratos_Inversionistas> getTransaction_Contratos_Inversionistas(Transaction_Contratos_Inversionistas Inst) {
           return Inst.Get<Transaction_Contratos_Inversionistas>();
       }
       [HttpPost]
       [AuthController]
       public Transaction_Contratos_Inversionistas findTransaction_Contratos_Inversionistas(Transaction_Contratos_Inversionistas Inst) {
           return Inst.Find<Transaction_Contratos_Inversionistas>();
       }
       [HttpPost]
       [AuthController]
       public object saveTransaction_Contratos_Inversionistas(Transaction_Contratos_Inversionistas inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateTransaction_Contratos_Inversionistas(Transaction_Contratos_Inversionistas inst) {
           return inst.Update();
       }
       //Transaction_Egresos
       [HttpPost]
       [AuthController]
       public List<Transaction_Egresos> getTransaction_Egresos(Transaction_Egresos Inst) {
           return Inst.Get<Transaction_Egresos>();
       }
       [HttpPost]
       [AuthController]
       public Transaction_Egresos findTransaction_Egresos(Transaction_Egresos Inst) {
           return Inst.Find<Transaction_Egresos>();
       }
       [HttpPost]
       [AuthController]
       public object saveTransaction_Egresos(Transaction_Egresos inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateTransaction_Egresos(Transaction_Egresos inst) {
           return inst.Update();
       }
       //Transaction_Facturas
       [HttpPost]
       [AuthController]
       public List<Transaction_Facturas> getTransaction_Facturas(Transaction_Facturas Inst) {
           return Inst.Get<Transaction_Facturas>();
       }
       [HttpPost]
       [AuthController]
       public Transaction_Facturas findTransaction_Facturas(Transaction_Facturas Inst) {
           return Inst.Find<Transaction_Facturas>();
       }
       [HttpPost]
       [AuthController]
       public object saveTransaction_Facturas(Transaction_Facturas inst) {
           return inst.Save();
       }
       [HttpPost]
       [AuthController]
       public object updateTransaction_Facturas(Transaction_Facturas inst) {
           return inst.Update();
       }
   }
}
