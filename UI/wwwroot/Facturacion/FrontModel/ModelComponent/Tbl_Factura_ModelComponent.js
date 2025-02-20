//@ts-check
import { EntityClass } from "../../../WDevCore/WModules/EntityClass.js";
// @ts-ignore
import { ModelProperty } from "../../../WDevCore/WModules/CommonModel.js";
import { Detalle_Factura_ModelComponent } from './Detalle_Factura_ModelComponent.js'
import { Catalogo_Clientes } from "../../../ClientModule/FrontModel/Catalogo_Clientes.js";
import { Datos_Financiamiento, Tbl_Factura } from "../Tbl_Factura.js";
import { WForm } from "../../../WDevCore/WComponents/WForm.js";
import { Detalle_Factura } from "../Detalle_Factura.js";
import { WArrayF } from "../../../WDevCore/WModules/WArrayF.js";
import { FinancialModule } from "../../../modules/FinancialModule.js";
import { Detail_Prendas, Transaction_Contratos, ValoracionesTransaction } from "../../../FrontModel/Model.js";
import { Catalogo_Cambio_Divisa } from "../../../FrontModel/Catalogo_Cambio_Divisa.js";
import { ModalMessage } from "../../../WDevCore/WComponents/ModalMessage.js";



class Tbl_Factura_ModelComponent extends EntityClass {
	constructor(props) {
		super(props, 'EntityFacturacion');
		for (const prop in props) {
			this[prop] = props[prop];
		};
	}
	/**@type {ModelProperty}*/ Id_Factura = { type: 'number', primary: true };
	/**@type {ModelProperty}*/ Cliente = { type: 'wselect', ModelObject: () => new Catalogo_Clientes(), defaultValue: null };
	/**@type {ModelProperty}*/ Tipo = {
		type: 'select', Dataset: ["VENTA", "APARTADO_MENSUAL", "APARTADO_QUINCENAL"],
		action: (/**@type {Tbl_Factura}*/ ObjectF, form) => {
			this.TypeAction(ObjectF, form);
		}
	};
	//**@type {ModelProperty}*/ Concepto = { type: 'textarea' };
	//**@type {ModelProperty}*/ Serie = { type: 'text', hidden: true  };
	/**@type {ModelProperty}*/ Forma_Pago = { type: 'select', Dataset: ["CONTADO"] };
	//**@type {ModelProperty}*/ Direccion_Envio = { type: 'text', hidden: true  };
	/**@type {ModelProperty}*/ Id_Cliente = { type: 'number', hidden: true };
	/**@type {ModelProperty}*/ Id_Sucursal = { type: 'number', hidden: true };
	/**@type {ModelProperty}*/ Fecha = { type: 'date', disabled: true };
	/**@type {ModelProperty}*/ Moneda = {
		type: "radio", Dataset: ["DOLARES", "CORDOBAS"],
		action: (/**@type {Tbl_Factura}*/ ObjectF, form) => {
			if (ObjectF.Moneda == "DOLARES") {
				form.ModelObject.Monto_dolares.hidden = false;
				form.ModelObject.Monto_cordobas.hidden = true;

				form.ModelObject.is_cambio_cordobas.hidden = false;
				ObjectF.is_cambio_cordobas = false;
				form?.DrawComponent();
			} else {
				form.ModelObject.Monto_dolares.hidden = true;
				form.ModelObject.Monto_cordobas.hidden = false;

				form.ModelObject.is_cambio_cordobas.hidden = true;
				ObjectF.is_cambio_cordobas = false;
				form?.DrawComponent();
			}
		}
	}
	/**@type {ModelProperty}*/ Fecha_Vencimiento = { type: 'date', hidden: true };
	/**@type {ModelProperty}*/ Observaciones = { type: 'textarea', require: false };
	/**@type {ModelProperty}*/ Id_Usuario = { type: 'number', hidden: true };
	/**@type {ModelProperty}*/ Estado = { type: 'SELECT', hidden: true, Dataset: ["ACTIVA", "ANULADO"] };
	/**@type {ModelProperty}*/ Sub_Total = { type: 'number', hidden: true };
	/**@type {ModelProperty}*/ Iva = { type: 'number', hidden: true };
	/**@type {ModelProperty}*/ Tasa_Cambio = { type: 'number', hidden: true };
	/**@type {ModelProperty}*/ Total = { type: 'number', hidden: true };
	/**@type {ModelProperty}*/ Detalle_Factura = { type: 'MasterDetail', ModelObject: () => new Detalle_Factura_ModelComponent(), action: (/**@type {Tbl_Factura}*/ ObjectF, form) => this.CalculeTotal(ObjectF, form) };
	
	/**@type {ModelProperty}*/Datos_Financiamiento = {
		type: 'MODEL',
		hiddenFilter: true,
		hidden: true,
		ModelObject: new Datos_Financiamiento_ModelComponent(),
		action: (/**@type {Tbl_Factura}*/ ObjectF, form) => {
			//return ConvertToMoneyString(ObjectF.cambio_cordobas = ObjectF.Monto_cordobas - (ObjectF.Total * ObjectF.Tasa_Cambio));
		}
	};
	
	
	/**@type {ModelProperty}*/ Datos_de_pago = { type: 'title', label: "Datos de pago", hiddenFilter: true, hiddenInTable: true };
	
	/**@type {ModelProperty}*/ Monto_dolares = {
		type: 'MONEY', defaultValue: 0, hiddenFilter: true, hiddenInTable: true, action: (/**@type {Tbl_Factura}*/ ObjectF, form) => {
			
			this.CalculeTotal(ObjectF, form);
		}
	};
	/**@type {ModelProperty}*/Monto_cordobas = {
		type: 'MONEY', defaultValue: 0, hiddenFilter: true, hiddenInTable: true, hidden: true, action: (/**@type {Tbl_Factura}*/ ObjectF, form) => {
			//console.log(ObjectF. Monto_dolares, ObjectF.Total);
		   
			this.CalculeTotal(ObjectF, form);
		}
	};
	/**@type {ModelProperty}*/cambio_dolares = {
		type: 'MONEY', disabled: true, require: false, defaultValue: 0, hiddenFilter: true, hiddenInTable: true, action: (/**@type {Tbl_Factura}*/ ObjectF, form) => {
			//console.log(ObjectF. Monto_dolares);
			//return ConvertToMoneyString(ObjectF.cambio_dolares = ObjectF. Monto_dolares - ObjectF.paga_dolares);
		}
	};
	/**@type {ModelProperty}*/cambio_cordobas = {
		type: 'MONEY', disabled: true, require: false, defaultValue: 0, hiddenFilter: true, hiddenInTable: true, action: (/**@type {Tbl_Factura}*/ ObjectF, form) => {
			//return ConvertToMoneyString(ObjectF.cambio_cordobas = ObjectF.Monto_cordobas - (ObjectF.Total * ObjectF.Tasa_Cambio));
		}
	};
	/**@type {ModelProperty} */ is_cambio_cordobas = { type: "checkbox", require: false, hiddenFilter: true, hiddenInTable: true, label: "dar cambio en córdobas", hidden: false };


	

	/**
	 * @param {Tbl_Factura} ObjectF
	 * @param {WForm} form
	 */
	TypeAction(ObjectF, form) {
		switch (ObjectF.Tipo) {
			case "APARTADO_MENSUAL":
				ObjectF.Datos_Financiamiento = new Datos_Financiamiento();
				this.PrepareApartadoMensual(ObjectF, form);

				this.cambio_cordobas.hidden = true;
				this.cambio_dolares.hidden = true;
				this.is_cambio_cordobas.hidden = true;
				break;
			case "APARTADO_QUINCENAL":
				ObjectF.Datos_Financiamiento = new Datos_Financiamiento();
				this.PrepareApartadoQuincenal(ObjectF, form);
				
				this.cambio_cordobas.hidden = true;
				this.cambio_dolares.hidden = true;
				this.is_cambio_cordobas.hidden = true;
				break;
			default:
				this.Datos_Financiamiento.hidden = true;
				ObjectF.Datos_Financiamiento = null;               

				this.cambio_cordobas.hidden = false;
				this.cambio_dolares.hidden = false;
				this.is_cambio_cordobas.hidden = false;

				break;
		}
		//this.CalculeTotal(ObjectF, form);
	}
	PrepareApartadoQuincenal(ObjectF, form) {
		//const categorias = ObjectF.Detalle_Factura.flatMap(detalle => detalle.Lote.Datos_Producto.Catalogo_Categoria);

		this.Datos_Financiamiento.hidden = false;
		//console.log(categorias);

		let PlazoMaximo = 4;
		this.Datos_Financiamiento.ModelObject.Plazo.max = PlazoMaximo;

		//console.log(this.Datos_Financiamiento);

		const contrato = new ValoracionesTransaction();
		const interes = 0;
		/**@type {Catalogo_Cambio_Divisa} */
		const tasa = this.GetTasa();        
		
		this.CreateContrato(contrato, ObjectF, interes, tasa);

	   
	}

	/**
	 * @param {Tbl_Factura} ObjectF
	 * @param {WForm} form
	 */
	PrepareApartadoMensual(ObjectF, form) {

		const categorias = ObjectF.Detalle_Factura.flatMap(detalle => detalle.Lote.Datos_Producto.Catalogo_Categoria);

		this.Datos_Financiamiento.hidden = false;

		let PlazoMaximo = WArrayF.MinValue(categorias, "plazo_limite");
		this.Datos_Financiamiento.ModelObject.Plazo.max = PlazoMaximo;
		this.Datos_Financiamiento.ModelObject.Plazo.action = (Datos_Financiamiento, Datos_FinanciamientoForm) => {
			this.CalculeTotal(ObjectF, form);
		}
		
		//console.log(this.Datos_Financiamiento);
		const contrato = new ValoracionesTransaction();
		const interes = WArrayF.SumValAtt(JSON.parse(sessionStorage.getItem("Intereses") ?? "[]").filter(i => i.Nombre != "GASTOS_ADMINISTRATIVOS"), "Valor");
		
		/**@type {Catalogo_Cambio_Divisa} */
		const tasa = this.GetTasa();
		
		this.CreateContrato(contrato, ObjectF, interes, tasa);
	}
	CreateContrato(contrato, ObjectF, interes, tasa) {
		
		contrato.valoraciones = ObjectF.Detalle_Factura.map(detalle => detalle.Lote.Datos_Producto);
		contrato.Transaction_Contratos = new Transaction_Contratos({
			tasas_interes: interes / 100,
			fecha: new Date(),
			plazo: ObjectF.Datos_Financiamiento?.Plazo ?? 1,
			taza_cambio: tasa.Valor_de_venta,
			taza_cambio_compra: tasa.Valor_de_compra,
			taza_interes_cargos: interes,
			Catalogo_Clientes: ObjectF.Cliente,
			gestion_crediticia: 0,
			Valoracion_empeño_dolares: (ObjectF.Total ?? 0) - (ObjectF.Monto_dolares ?? 0),
			Valoracion_empeño_cordobas: ((ObjectF.Total ?? 0) * ObjectF.Tasa_Cambio) - (ObjectF.Monto_cordobas ?? 0),
			Detail_Prendas: ObjectF.Detalle_Factura?.map(detalle => {
				const valoracion = detalle.Lote?.Datos_Producto;
				return new Detail_Prendas({
					Descripcion: valoracion?.Descripcion,
					modelo: valoracion?.Modelo,
					marca: valoracion?.Marca,
					serie: valoracion?.Serie,
					monto_aprobado_cordobas: valoracion?.Valoracion_empeño_cordobas,
					monto_aprobado_dolares: valoracion?.Valoracion_empeño_dolares,
					color: "-",
					en_manos_de: "ACREEDOR",
					precio_venta: valoracion?.Precio_venta_empeño_dolares,
					Catalogo_Categoria: valoracion?.Catalogo_Categoria,
					Transactional_Valoracion_ModelComponent: valoracion
				});
			})
		});
		FinancialModule.calculoAmortizacion(contrato, false);
		ObjectF.Datos_Financiamiento.Total_Financiado = contrato.Transaction_Contratos.Valoracion_empeño_dolares;
		ObjectF.Datos_Financiamiento.Total_Financiado_Cordobas = contrato.Transaction_Contratos.Valoracion_empeño_cordobas;
		ObjectF.Datos_Financiamiento.Cuota_Fija_Dolares = contrato.Transaction_Contratos.cuotafija_dolares;
		ObjectF.Datos_Financiamiento.Cuota_Fija_Cordobas = contrato.Transaction_Contratos.cuotafija_dolares * tasa.Valor_de_venta;
	}

	/**
	* @returns {Catalogo_Cambio_Divisa}
	*/
	GetTasa() {
		return JSON.parse(sessionStorage.getItem("TasasCambio") ?? "{}");
	}

	/**
	 * @param {Tbl_Factura} ObjectF
	 * @param {WForm} form
	 */
	CalculeCambioCordobas(ObjectF, form) {
		ObjectF.Monto_dolares = parseFloat((ObjectF.Monto_cordobas / ObjectF.Tasa_Cambio).toFixed(3));
		ObjectF.cambio_dolares = parseFloat((ObjectF.Monto_dolares - ObjectF.Total).toFixed(3));
		ObjectF.cambio_cordobas = parseFloat((ObjectF.Monto_cordobas - (ObjectF.Total * ObjectF.Tasa_Cambio)).toFixed(3));
		if (ObjectF.Moneda == "DOLARES") {
			ObjectF.cambio_cordobas = parseFloat(((ObjectF.Monto_dolares - ObjectF.Total) * ObjectF.Tasa_Cambio).toFixed(3));
		}
		//form?.DrawComponent();
	}

	/**
	 * @param {Tbl_Factura} ObjectF
	 * @param {WForm} form
	 */
	CalculeCambioDolares(ObjectF, form) {
		ObjectF.Monto_cordobas = parseFloat((ObjectF.Monto_dolares * ObjectF.Tasa_Cambio).toFixed(3));
		ObjectF.cambio_dolares = parseFloat((ObjectF.Monto_dolares - ObjectF.Total).toFixed(3));
		ObjectF.cambio_cordobas = parseFloat((ObjectF.Monto_cordobas - ObjectF.Total).toFixed(3));
		if (ObjectF.Moneda == "DOLARES") {
			ObjectF.cambio_cordobas = parseFloat(((ObjectF.Monto_dolares - ObjectF.Total) * ObjectF.Tasa_Cambio_Venta).toFixed(3));
		}
		//form?.DrawComponent();
	}

	/**
	 * @param {Tbl_Factura} EditObject
	 * @param {WForm} form
	 * ♠@returns {Tbl_Factura}
	 */
	CalculeTotal(EditObject, form) {
		EditObject.Tasa_Cambio_Venta = this.GetTasa().Valor_de_venta;
		EditObject.Tasa_Cambio = this.GetTasa().Valor_de_compra;

		if (!EditObject.Detalle_Factura || !Array.isArray(EditObject.Detalle_Factura)) {
			throw new Error("Detalle_Factura no está definido o no es un array.");
		}
		// Crear un mapa para agrupar detalles por id_lote
		/**@type {Array<Detalle_Factura>} */
		const lotesMap = [];

		for (const detalle of EditObject.Detalle_Factura) {
			form.ModelObject.Detalle_Factura.ModelObject.UpdateDetalle(EditObject, detalle, undefined, false);
			
			const loteFusionado = lotesMap.find(det => det.Lote.Id_Lote == detalle.Lote.Id_Lote)
			if (loteFusionado) {
				continue;
			}
			const detalles = EditObject.Detalle_Factura.filter(det => det.Lote.Id_Lote == detalle.Lote.Id_Lote);
			let cantidadTotal = WArrayF.SumValAtt(detalles, "Cantidad");
			if (cantidadTotal > detalle.Lote.Cantidad_Existente) {
				cantidadTotal = detalle.Lote.Cantidad_Existente;
				form.shadowRoot?.append(ModalMessage("El lote seleccionado, supera la cantidad existente"))
				//throw new Error("Cantidad insuficiente");
				//return false;
			}
			if (!loteFusionado) {
				const subtotal = detalle.Precio_Venta * cantidadTotal;
				const totalDescuento = subtotal * detalle.Descuento;
				const totalIva = (subtotal - totalDescuento) * 0;
				lotesMap.push(new Detalle_Factura({
					Lote: detalle.Lote,
					Cantidad: cantidadTotal,
					Sub_Total: subtotal,
					Descuento: detalle.Descuento,
					Monto_Descuento: totalDescuento,
					Iva: totalIva,
					Total: subtotal - totalDescuento + totalIva
				}))
			}
		}
		EditObject.Detalle_Factura.length = 0;
		EditObject.Detalle_Factura.push(...lotesMap);
		// Calcular los totales actualizados
		const subtotal = WArrayF.SumValAtt(EditObject.Detalle_Factura, "Sub_Total");
		const descuento = WArrayF.SumValAtt(EditObject.Detalle_Factura, "Monto_Descuento");
		const iva = WArrayF.SumValAtt(EditObject.Detalle_Factura, "Iva");
		const total = WArrayF.SumValAtt(EditObject.Detalle_Factura, "Total");
		EditObject.Sub_Total = subtotal;
		EditObject.Descuento = descuento;
		EditObject.Iva = iva;
		EditObject.Total = total;
		this.UpdatePagoMinimo(EditObject, form)
		switch (EditObject.Tipo) {
			case "APARTADO_MENSUAL":                
				this.PrepareApartadoMensual(EditObject, form);
				break;
			case "APARTADO_QUINCENAL":
				this.PrepareApartadoQuincenal(EditObject, form);
				break;
			default:     
				break;
		}
		this.CalculeCambioDolares(EditObject, form);
		this.CalculeCambioCordobas(EditObject, form);
		form?.DrawComponent();
		return true;
	}

	/**
	 * @param {Tbl_Factura} EditObject
	 * @param {WForm} form
	 */
	UpdatePagoMinimo(EditObject, form) {
		if (EditObject.Detalle_Factura?.length == 0) {
			return;
			// Add your condition logic here
		}
		const Tasa_Cambio = EditObject.Detalle_Factura[0].Lote?.EtiquetaLote?.TasaCambio?.Valor_de_venta;
		switch (EditObject.Tipo) {
			case "VENTA":
				this.Monto_cordobas.min = (EditObject.Total * Tasa_Cambio).toFixed(2);
				this.Monto_dolares.min = (EditObject.Total).toFixed(2);
				break;
			case "APARTADO_MENSUAL":
				this.Monto_cordobas.min = ((EditObject.Total * Tasa_Cambio) * 0.35).toFixed(2);
				this.Monto_dolares.min = ((EditObject.Total) * 0.35).toFixed(2);
				break;
			case "APARTADO_QUINCENAL":
				this.Monto_cordobas.min = ((EditObject.Total * Tasa_Cambio) * 0.25).toFixed(2);
				this.Monto_dolares.min = ((EditObject.Total) * 0.25).toFixed(2);
				break;
			default:
				break;
		}
	}


}
export { Tbl_Factura_ModelComponent }

export class Datos_Financiamiento_ModelComponent {
	//**@type {ModelProperty} */ Numero_Contrato = { type: 'number', hidden: true };
	/**@type {ModelProperty} */ Plazo = {
		type: 'number', defaultValue: 1, min: 1,
		pattern: '^[0-9]+$',
		action: (/**@type {Datos_Financiamiento}*/ ObjectF, /**@type {WForm}*/ form) => {            
			form.Config.ParentModel.DrawComponent();
		}
	};
	/**@type {ModelProperty} */ Total_Financiado = { type: 'Money', disabled: true };
	/**@type {ModelProperty} */ Total_Financiado_Cordobas = { type: 'Money', disabled: true };
	/**@type {ModelProperty} */ Cuota_Fija_Dolares = { type: 'Money', disabled: true };
	/**@type {ModelProperty} */ Cuota_Fija_Cordobas = { type: 'Money', disabled: true };
}
