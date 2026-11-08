// @ts-check
/**
 * Pruebas de integracion de ModelPropertyFormBuilder.
 *
 * A diferencia de las pruebas unitarias, aqui se construyen los controles
 * reales en el DOM y se verifica la interaccion entre el builder, los
 * componentes de WDevCore y un WForm completo.
 *
 * Ejecutar con: npm run test:integration
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ModelPropertyFormBuilder as Builder } from "../../../../UI/wwwroot/WDevCore/ComponentsBuilders/ModelPropertyFormBuilder.js";
import { WForm } from "../../../../UI/wwwroot/WDevCore/WComponents/WForm.js";
import { MultiSelect } from "../../../../UI/wwwroot/WDevCore/WComponents/WMultiSelect.js";
import { FileComponent } from "../../../../UI/wwwroot/WDevCore/WComponents/FormComponents/FileComponent.js";
import { WRichText } from "../../../../UI/wwwroot/WDevCore/WComponents/FormComponents/WRichText.js";
import { WCalendarComponent } from "../../../../UI/wwwroot/WDevCore/WComponents/FormComponents/WCalendarComponent.js";

/**
 * Crea una definicion de propiedad (ModelProperty) para las pruebas.
 * @param {string} type
 * @param {Record<string, any>} [extra]
 */
const modelProp = (type, extra = {}) => ({ type, ...extra });

/** Crea un contenedor y lo agrega al documento. */
const createWrapper = () => {
	const wrapper = document.createElement("div");
	document.body.append(wrapper);
	return wrapper;
};

/** Simula el evento change de un control. */
const fireChange = (control) => {
	control.dispatchEvent(new Event("change", { bubbles: true }));
};

beforeEach(() => {
	document.body.innerHTML = "";
});

afterEach(() => {
	document.body.innerHTML = "";
	vi.restoreAllMocks();
});

describe("CreateInput en el DOM", () => {
	it("crea un input configurado y notifica los cambios", async () => {
		const wrapper = createWrapper();
		const EditingObject = {};
		const onChange = vi.fn();
		const ModelProperty = modelProp("EMAIL");

		const input = await Builder.CreateInput(ModelProperty, EditingObject, "Correo", onChange);
		wrapper.append(input);

		expect(input.id).toBe("ControlValueCorreo");
		expect(input.className).toBe("Correo");
		expect(input.type).toBe("email");
		expect(input.placeholder).toBe("Ejem.: user@example.com");
		expect(input.require).toBe(true);
		expect(ModelProperty.require).toBe(true);
		expect(EditingObject.Correo).toBe("");

		input.value = "ana@empresa.com";
		fireChange(input);

		expect(onChange).toHaveBeenCalledOnce();
	});

	it("actualiza el objeto en edicion al integrarse con OnChange", async () => {
		const wrapper = createWrapper();
		const EditingObject = {};
		const ModelProperty = modelProp("NUMBER", { min: 1, max: 100 });
		const Model = { Cantidad: ModelProperty };
		const onChange = (ev) => Builder.OnChange(ev.target, ev.currentTarget, EditingObject, "Cantidad", Model);

		const input = await Builder.CreateInput(ModelProperty, EditingObject, "Cantidad", onChange);
		wrapper.append(input);

		expect(input.type).toBe("number");
		expect(input.min).toBe("1");
		expect(input.max).toBe("100");
		expect(EditingObject.Cantidad).toBe(1);

		input.value = "50";
		fireChange(input);
		await vi.waitFor(() => expect(EditingObject.Cantidad).toBe("50"));

		input.value = "0";
		fireChange(input);
		await vi.waitFor(() => expect(wrapper.querySelector(".ToolTip")).toBeTruthy());
		expect(wrapper.querySelector(".ToolTip")?.innerHTML).toBe("El valor mínimo permitido es: 1");
	});

	it("deshabilita el control y anula el evento cuando disabled es verdadero", async () => {
		const EditingObject = {};
		const onChange = vi.fn();

		const input = await Builder.CreateInput(modelProp("TEXT", { disabled: true }), EditingObject, "Nombre", onChange);

		expect(input.disabled).toBe(true);
		expect(input.onchange).toBeFalsy();
	});

	it("evalua require y disabled dinamicos con el objeto en edicion", async () => {
		const EditingObject = { tipo: "empresa", bloqueado: true };
		const ModelProperty = modelProp("TEXT", {
			require: (obj) => obj.tipo === "empresa",
			disabled: (obj) => obj.bloqueado
		});

		const input = await Builder.CreateInput(ModelProperty, EditingObject, "Nombre", vi.fn());

		expect(input.require).toBe(true);
		expect(input.disabled).toBe(true);
	});

	it("crea un input datetime-local para DATETIME", async () => {
		const EditingObject = { Fecha: "2024-05-10T14:30" };
		const ModelProperty = modelProp("DATETIME");

		const input = await Builder.CreateInput(ModelProperty, EditingObject, "Fecha", vi.fn());

		expect(input.type).toBe("datetime-local");
		expect(input.value).toBe("2024-05-10T14:30");
		expect(input.min).toBe("0001-01-01T00:00");
		expect(input.max).toBe("3000-01-01T23:59");
	});
});

describe("CreateSelect en el DOM", () => {
	it("crea las opciones desde un dataset de valores simples", async () => {
		const wrapper = createWrapper();
		const EditingObject = { Estado: "B" };
		const ModelProperty = modelProp("SELECT", { Dataset: ["A", "B", "C"] });

		const select = await Builder.CreateSelect(ModelProperty, EditingObject, "Estado", vi.fn());
		wrapper.append(select);

		expect(select.tagName).toBe("SELECT");
		expect(select.id).toBe("ControlValueEstado");
		expect(select.options).toHaveLength(3);
		expect(select.value).toBe("B");
		expect(Array.from(select.options).map(o => o.textContent)).toEqual(["A", "B", "C"]);
	});

	it("crea las opciones desde un dataset de objetos usando id y desc", async () => {
		const EditingObject = { Ciudad: 1 };
		const ModelProperty = modelProp("SELECT", {
			Dataset: [{ id: 1, desc: "San Salvador" }, { id: 2, desc: "Santa Ana" }]
		});

		const select = await Builder.CreateSelect(ModelProperty, EditingObject, "Ciudad", vi.fn());

		expect(select.options).toHaveLength(2);
		expect(select.value).toBe("1");
		expect(select.options[0].textContent).toBe("San Salvador");
	});

	it("agrega la opcion Seleccionar cuando el campo no es requerido", async () => {
		const EditingObject = {};
		const ModelProperty = modelProp("SELECT", { require: false, Dataset: ["A", "B"] });

		const select = await Builder.CreateSelect(ModelProperty, EditingObject, "Estado", vi.fn());

		expect(select.options).toHaveLength(3);
		expect(select.options[0].textContent).toBe("Seleccionar");
		expect(select.options[0].selected).toBe(true);
	});

	it("selecciona el primer elemento del dataset cuando el campo es requerido", async () => {
		const EditingObject = {};
		const ModelProperty = modelProp("SELECT", { Dataset: [{ id: 10, desc: "Diez" }] });

		const select = await Builder.CreateSelect(ModelProperty, EditingObject, "Ciudad", vi.fn());

		expect(select.options).toHaveLength(1);
		expect(select.value).toBe("10");
		expect(String(EditingObject.Ciudad)).toBe("10");
	});

	it("actualiza el objeto en edicion al cambiar la opcion", async () => {
		const EditingObject = { Estado: "A" };
		const ModelProperty = modelProp("SELECT", { Dataset: ["A", "B"] });
		const Model = { Estado: ModelProperty };
		const onChange = (ev) => Builder.OnChange(ev.target, ev.currentTarget, EditingObject, "Estado", Model);

		const select = await Builder.CreateSelect(ModelProperty, EditingObject, "Estado", onChange);
		select.value = "B";
		fireChange(select);

		await vi.waitFor(() => expect(EditingObject.Estado).toBe("B"));
	});
});

describe("CreateTextArea, CreateCheckBox y CreateRadioGroups en el DOM", () => {
	it("crea un textarea con el valor por defecto del modelo", async () => {
		const EditingObject = {};
		const onChange = vi.fn();
		const ModelProperty = modelProp("TEXTAREA", { defaultValue: "Comentario inicial" });

		const textarea = await Builder.CreateTextArea(ModelProperty, EditingObject, "Comentario", onChange);

		expect(textarea.tagName).toBe("TEXTAREA");
		expect(textarea.className).toBe("Comentario");
		expect(textarea.value).toBe("Comentario inicial");
		expect(EditingObject.Comentario).toBe("Comentario inicial");
		expect(textarea.style.height).toBe("38px");
	});

	it("crea un checkbox manteniendo el valor booleano", async () => {
		const EditingObject = { Acepto: true };
		const ModelProperty = modelProp("CHECKBOX");

		const checkbox = await Builder.CreateCheckBox(ModelProperty, EditingObject, "Acepto", vi.fn());

		expect(checkbox.id).toBe("ControlValueAcepto");
		expect(checkbox.type).toBe("checkbox");
		expect(checkbox.checked).toBe(true);
		expect(EditingObject.Acepto).toBe(true);
	});

	it("convierte a false los valores no booleanos de un checkbox", async () => {
		const EditingObject = { Acepto: "si" };
		const ModelProperty = modelProp("CHECKBOX");

		const checkbox = await Builder.CreateCheckBox(ModelProperty, EditingObject, "Acepto", vi.fn());

		expect(checkbox.checked).toBe(false);
		expect(EditingObject.Acepto).toBe(false);
	});

	it("crea un grupo de radios requerido y selecciona el primero", async () => {
		const EditingObject = {};
		const ModelProperty = modelProp("RADIO", {
			Dataset: [{ id: 1, desc: "Uno" }, { id: 2, desc: "Dos" }]
		});

		const group = await Builder.CreateRadioGroups(ModelProperty, EditingObject, "Estado", vi.fn());
		const radios = group.querySelectorAll("input");

		expect(group.id).toBe("ControlValueEstado");
		expect(group.className).toBe("radio-group-container");
		expect(radios).toHaveLength(2);
		expect(radios[0].name).toBe("Estado");
		expect(radios[0].type).toBe("radio");
		expect(radios[0].checked).toBe(true);
		expect(EditingObject.Estado).toBe(1);
	});

	it("agrega la opcion Ninguno cuando el grupo no es requerido", async () => {
		const EditingObject = {};
		const ModelProperty = modelProp("RADIO", {
			require: false,
			Dataset: [{ id: 1, desc: "Uno" }]
		});

		const group = await Builder.CreateRadioGroups(ModelProperty, EditingObject, "Estado", vi.fn());
		const radios = group.querySelectorAll("input");

		expect(radios).toHaveLength(2);
		expect(group.querySelector("label")?.textContent).toBe("Ninguno");
		expect(radios[0].checked).toBe(true);
	});

	it("actualiza el objeto en edicion al seleccionar un radio", async () => {
		const EditingObject = {};
		const ModelProperty = modelProp("RADIO", {
			Dataset: [{ id: 1, desc: "Uno" }, { id: 2, desc: "Dos" }]
		});
		const Model = { Estado: ModelProperty };
		const onChange = (ev) => Builder.OnChange(ev.target, ev.currentTarget, EditingObject, "Estado", Model);

		const group = await Builder.CreateRadioGroups(ModelProperty, EditingObject, "Estado", onChange);
		const secondRadio = group.querySelectorAll("input")[1];
		secondRadio.checked = true;
		fireChange(secondRadio);

		await vi.waitFor(() => expect(EditingObject.Estado).toBe("2"));
	});
});

describe("CreatePassword en el DOM", () => {
	it("crea los dos campos de contrasena con el valor actual", async () => {
		const EditingObject = { Clave: "secreta" };
		const ModelProperty = modelProp("PASSWORD");

		const container = await Builder.CreatePassword(ModelProperty, EditingObject, "Clave", vi.fn());

		const pass1 = container.querySelector("#ControlPass1Clave");
		const pass2 = container.querySelector("#ControlPass2Clave");
		expect(container.className).toBe("password-container");
		expect(pass1?.value).toBe("secreta");
		expect(pass2?.value).toBe("secreta");
	});

	it("avisa cuando las contrasenas no coinciden", async () => {
		const EditingObject = {};
		const alertToolTip = vi.fn();
		const ModelProperty = modelProp("PASSWORD");

		const container = await Builder.CreatePassword(ModelProperty, EditingObject, "Clave", vi.fn(), alertToolTip);
		const pass1 = container.querySelector("#ControlPass1Clave");
		const pass2 = container.querySelector("#ControlPass2Clave");

		pass1.value = "abc";
		pass2.value = "xyz";
		fireChange(pass2);

		expect(alertToolTip).toHaveBeenCalledWith(pass2, "contraseñas no coinciden");
	});

	it("no avisa cuando las contrasenas coinciden", async () => {
		const EditingObject = {};
		const alertToolTip = vi.fn();
		const ModelProperty = modelProp("PASSWORD");

		const container = await Builder.CreatePassword(ModelProperty, EditingObject, "Clave", vi.fn(), alertToolTip);
		const pass1 = container.querySelector("#ControlPass1Clave");
		const pass2 = container.querySelector("#ControlPass2Clave");

		pass1.value = "abc";
		pass2.value = "abc";
		fireChange(pass2);

		expect(alertToolTip).not.toHaveBeenCalled();
	});
});

describe("Componentes complejos en el DOM", () => {
	it("crea un WSelect simple reutilizando el dataset del modelo", async () => {
		const EditingObject = { Ciudad: 2 };
		const ModelProperty = modelProp("WSELECT", {
			Dataset: [{ id: 1, nombre: "San Salvador" }, { id: 2, nombre: "Santa Ana" }]
		});

		const control = await Builder.CreateWSelect(ModelProperty, EditingObject, "Ciudad", vi.fn());

		expect(control).toBeInstanceOf(MultiSelect);
		expect(control.id).toBe("ControlValueCiudad");
		expect(control.MultiSelect).toBe(false);
		expect(control.selectedItems).toEqual([2]);
		expect(EditingObject.Ciudad).toBe(2);
	});

	it("crea un multiselect con los elementos seleccionados", async () => {
		const EditingObject = { Etiquetas: [{ id: 1 }, { id: 2 }] };
		const ModelProperty = modelProp("MULTISELECT", {
			Dataset: [{ id: 1 }, { id: 2 }, { id: 3 }]
		});

		const control = await Builder.CreateWSelect(ModelProperty, EditingObject, "Etiquetas", vi.fn());

		expect(control.MultiSelect).toBe(true);
		expect(control.selectedItems).toEqual([{ id: 1 }, { id: 2 }]);
		expect(EditingObject.Etiquetas).toEqual(control.selectedItems);
	});

	it("deshabilita el WSelect bloqueando los eventos de puntero", async () => {
		const EditingObject = { Ciudad: 1 };
		const ModelProperty = modelProp("WSELECT", {
			disabled: true,
			Dataset: [{ id: 1, nombre: "San Salvador" }]
		});

		const control = await Builder.CreateWSelect(ModelProperty, EditingObject, "Ciudad", vi.fn());

		expect(control.style.pointerEvents).toBe("none");
	});

	it("crea un cargador de imagenes multiple y lo renderiza", async () => {
		const wrapper = createWrapper();
		const EditingObject = {};
		const ModelProperty = modelProp("IMAGES");

		const control = await Builder.CreateFileInput(ModelProperty, EditingObject, "Fotos", vi.fn());
		wrapper.append(control);
		await vi.waitFor(() => expect(control.shadowRoot?.querySelector("input[type=file]")).toBeTruthy());

		const fileInput = control.shadowRoot.querySelector("input[type=file]");
		expect(control).toBeInstanceOf(FileComponent);
		expect(control.id).toBe("ControlValueFotos");
		expect(control._multiple).toBe(true);
		expect(control._types).toEqual(["image/*"]);
		expect(fileInput.multiple).toBe(true);
		expect(fileInput.accept).toBe("image/*");
	});

	it("normaliza a arreglo un archivo unico existente", async () => {
		const EditingObject = { Foto: "data:image/png;base64,AAA" };
		const ModelProperty = modelProp("IMAGE");

		const control = await Builder.CreateFileInput(ModelProperty, EditingObject, "Foto", vi.fn());

		expect(control.Config.Files).toEqual(["data:image/png;base64,AAA"]);
		expect(control._multiple).toBe(false);
	});

	it("crea un editor de texto enriquecido y propaga su valor", async () => {
		const EditingObject = { Html: "<p>Hola</p>" };
		const onChange = vi.fn();
		const ModelProperty = modelProp("RICHTEXT");

		const control = await Builder.CreateRichText(ModelProperty, EditingObject, "Html", onChange);

		expect(control).toBeInstanceOf(WRichText);
		expect(control.id).toBe("ControlValueHtml");
		expect(control.value).toBe("<p>Hola</p>");

		control.Config.action("<p>Nuevo contenido</p>");

		expect(EditingObject.Html).toBe("<p>Nuevo contenido</p>");
		expect(onChange).toHaveBeenCalledOnce();
	});

	it("crea un calendario con los bloques seleccionados del objeto", async () => {
		const EditingObject = {};
		const CalendarFunction = vi.fn();
		const ModelProperty = modelProp("CALENDAR", { CalendarFunction });

		const control = await Builder.CreateCalendar(ModelProperty, EditingObject, "Agenda", vi.fn());

		expect(control).toBeInstanceOf(WCalendarComponent);
		expect(control.Config.SelectedBlocks).toEqual([]);
		expect(control.Config.CalendarFunction).toBe(CalendarFunction);
		expect(EditingObject.Agenda).toEqual([]);
	});

	it("crea un calendario deshabilitado", async () => {
		const EditingObject = { Agenda: [] };
		const ModelProperty = modelProp("CALENDAR", { disabled: true });

		const control = await Builder.CreateCalendar(ModelProperty, EditingObject, "Agenda", vi.fn());

		expect(control.style.pointerEvents).toBe("none");
	});

	it("crea un formulario anidado para propiedades MODEL", async () => {
		const EditingObject = { Direccion: {} };
		const ModelProperty = modelProp("MODEL", {
			ModelObject: {
				Calle: { type: "TEXT" },
				Numero: { type: "NUMBER" }
			}
		});
		const fatherForm = { limit: 2, DivColumns: "repeat(2, 1fr)" };

		const form = await Builder.CreateModel(ModelProperty, EditingObject, "Direccion", fatherForm);

		expect(form).toBeInstanceOf(WForm);
		expect(form.limit).toBe(2);
		expect(form.DivColumns).toBe("repeat(2, 1fr)");
		expect(form.FormObject).toBe(EditingObject.Direccion);
	});

	it("deshabilita el formulario anidado cuando el modelo lo indica", async () => {
		const EditingObject = { Direccion: {}, bloquear: true };
		const ModelProperty = modelProp("MODEL", {
			disabled: (obj) => obj.bloquear,
			ModelObject: { Calle: { type: "TEXT" } }
		});
		const fatherForm = { limit: 1, DivColumns: "1fr" };

		const form = await Builder.CreateModel(ModelProperty, EditingObject, "Direccion", fatherForm);

		expect(form.style.pointerEvents).toBe("none");
	});
});

describe("Integracion con WForm", () => {
	/**
	 * Crea un formulario WForm con los tipos de control mas usados por el builder.
	 * @returns {Promise<WForm>}
	 */
	const createForm = async () => {
		const form = new WForm({
			ModelObject: {
				Nombre: { type: "TEXT", placeholder: "Nombre completo" },
				Correo: { type: "EMAIL" },
				Ciudad: {
					type: "SELECT",
					Dataset: [{ id: 1, desc: "San Salvador" }, { id: 2, desc: "Santa Ana" }]
				},
				Comentario: { type: "TEXTAREA", defaultValue: "Sin comentarios" },
				Acepto: { type: "CHECKBOX" }
			},
			EditObject: {},
			Title: "Cliente",
			Options: false
		});
		document.body.append(form);
		await vi.waitFor(() => {
			expect(form.shadowRoot.querySelector("#ControlValueNombre")).toBeTruthy();
			expect(form.Controls.Comentario).toBeTruthy();
		});
		return form;
	};

	it("construye los controles de todos los tipos y aplica los valores por defecto", async () => {
		const form = await createForm();
		const shadowRoot = /** @type {ShadowRoot} */ (form.shadowRoot);

		const nombre = /** @type {HTMLInputElement} */ (shadowRoot.querySelector("#ControlValueNombre"));
		const correo = /** @type {HTMLInputElement} */ (shadowRoot.querySelector("#ControlValueCorreo"));
		const ciudad = /** @type {HTMLSelectElement} */ (shadowRoot.querySelector("#ControlValueCiudad"));
		const comentario = form.Controls.Comentario;
		const acepto = /** @type {HTMLInputElement} */ (shadowRoot.querySelector("#ControlValueAcepto"));

		expect(nombre.type).toBe("text");
		expect(nombre.placeholder).toBe("Nombre completo");
		expect(correo.type).toBe("email");
		expect(correo.pattern).toContain("@");

		expect(ciudad.tagName).toBe("SELECT");
		expect(ciudad.options).toHaveLength(2);
		expect(form.FormObject.Ciudad).toBe("1");

		expect(comentario.value).toBe("Sin comentarios");
		expect(form.FormObject.Comentario).toBe("Sin comentarios");

		expect(acepto.type).toBe("checkbox");
		expect(form.FormObject.Acepto).toBe(false);

		expect(shadowRoot.querySelector("label.label_Nombre")?.textContent).toContain("Nombre");
	});

	it("propaga los cambios del DOM al objeto del formulario", async () => {
		const form = await createForm();
		const shadowRoot = /** @type {ShadowRoot} */ (form.shadowRoot);
		const nombre = /** @type {HTMLInputElement} */ (shadowRoot.querySelector("#ControlValueNombre"));
		const acepto = /** @type {HTMLInputElement} */ (shadowRoot.querySelector("#ControlValueAcepto"));

		nombre.value = "Ana Perez";
		fireChange(nombre);
		await vi.waitFor(() => expect(form.FormObject.Nombre).toBe("Ana Perez"));

		acepto.checked = true;
		fireChange(acepto);
		await vi.waitFor(() => expect(form.FormObject.Acepto).toBe(true));
	});

	it("valida el formato del correo dentro del formulario", async () => {
		const form = await createForm();
		const shadowRoot = /** @type {ShadowRoot} */ (form.shadowRoot);
		const correo = /** @type {HTMLInputElement} */ (shadowRoot.querySelector("#ControlValueCorreo"));

		correo.value = "correo-invalido";
		fireChange(correo);
		await vi.waitFor(() => expect(shadowRoot.querySelector(".ToolTip")).toBeTruthy());
		expect(shadowRoot.querySelector(".ToolTip")?.innerHTML).toBe("Ingresar formato correcto: Ejem.: user@example.com");

		correo.value = "ana@empresa.com";
		fireChange(correo);
		await vi.waitFor(() => expect(shadowRoot.querySelector(".ToolTip")).toBeNull());
		expect(form.FormObject.Correo).toBe("ana@empresa.com");
	});
});
