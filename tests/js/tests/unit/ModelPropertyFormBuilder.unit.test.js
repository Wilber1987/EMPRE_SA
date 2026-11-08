// @ts-check
/**
 * Pruebas unitarias de la clase ModelPropertyFormBuilder.
 *
 * Cubren la logica pura de la clase: utilidades de configuracion de tipos,
 * calculo de atributos, interpretacion de funciones `require`/`disabled`,
 * construccion de datasets, opciones de tabla y el manejador OnChange.
 *
 * Ejecutar con: npm run test:unit
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { ModelPropertyFormBuilder as Builder } from "../../../../UI/wwwroot/WDevCore/ComponentsBuilders/ModelPropertyFormBuilder.js";

/**
 * Crea una definicion de propiedad (ModelProperty) para las pruebas.
 * @param {string} type
 * @param {Record<string, any>} [extra]
 */
const modelProp = (type, extra = {}) => ({ type, ...extra });

/**
 * Crea un contenedor en el DOM para probar componentes que requieren un padre.
 */
const createWrapper = () => {
	const wrapper = document.createElement("div");
	document.body.append(wrapper);
	return wrapper;
};

/**
 * Crea un input dentro de un contenedor, simulando lo que hace un formulario.
 * @param {Partial<HTMLInputElement>} [props]
 */
const createInputControl = (props = {}) => {
	const wrapper = createWrapper();
	const control = document.createElement("input");
	Object.assign(control, props);
	wrapper.append(control);
	return { control, wrapper };
};

beforeEach(() => {
	document.body.innerHTML = "";
});

afterEach(() => {
	vi.restoreAllMocks();
});

describe("GetInputType", () => {
	it("convierte DATETIME a datetime-local sin importar mayusculas", () => {
		expect(Builder.GetInputType(modelProp("DATETIME"))).toBe("datetime-local");
		expect(Builder.GetInputType(modelProp("datetime"))).toBe("datetime-local");
	});

	it("convierte MONEY y PERCENTAGE a number", () => {
		expect(Builder.GetInputType(modelProp("MONEY"))).toBe("number");
		expect(Builder.GetInputType(modelProp("PERCENTAGE"))).toBe("number");
	});

	it("devuelve el tipo original para los demas tipos", () => {
		expect(Builder.GetInputType(modelProp("TEXT"))).toBe("TEXT");
		expect(Builder.GetInputType(modelProp("email"))).toBe("email");
		expect(Builder.GetInputType(modelProp("DATE"))).toBe("DATE");
	});
});

describe("PrepareVisualization", () => {
	it("formatea MONEY con tres decimales", () => {
		expect(Builder.PrepareVisualization(1234.5, "MONEY")).toBe("1234.500");
		expect(Builder.PrepareVisualization("42", "MONEY")).toBe("42.000");
	});

	it("formatea PERCENTAGE con dos decimales", () => {
		expect(Builder.PrepareVisualization("12.346", "PERCENTAGE")).toBe("12.35");
	});

	it("convierte DATE a formato ISO (YYYY-MM-DD)", () => {
		expect(Builder.PrepareVisualization("2024-05-10T12:00", "DATE")).toBe("2024-05-10");
	});

	it("convierte DATETIME a formato YYYY-MM-DDTHH:mm", () => {
		expect(Builder.PrepareVisualization("2024-05-10T14:30", "DATETIME")).toBe("2024-05-10T14:30");
	});

	it("devuelve el valor sin cambios para tipos simples", () => {
		expect(Builder.PrepareVisualization("Hola mundo", "TEXT")).toBe("Hola mundo");
		expect(Builder.PrepareVisualization("a@b.com", "EMAIL")).toBe("a@b.com");
	});
});

describe("DefinePatternAndPlaceholder", () => {
	it("define patron y placeholder para EMAIL", () => {
		const { pattern, calculatePlaceholder } = Builder.DefinePatternAndPlaceholder(modelProp("EMAIL"));
		expect(pattern).toBe("[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}");
		expect(calculatePlaceholder).toBe("Ejem.: user@example.com");
	});

	it("define patron y placeholder para TEL", () => {
		const { pattern, calculatePlaceholder } = Builder.DefinePatternAndPlaceholder(modelProp("tel"));
		expect(pattern).toBe("^(\\+\\d{1,4})?\\d{7,8}$");
		expect(calculatePlaceholder).toBe("Ejem.: +1234567890");
	});

	it("define patron y placeholder para URL", () => {
		const { pattern, calculatePlaceholder } = Builder.DefinePatternAndPlaceholder(modelProp("URL"));
		expect(pattern).toBe("https?://.+");
		expect(calculatePlaceholder).toBe("Ejem.: https://site.com");
	});

	it("respeta un patron personalizado del modelo", () => {
		const { pattern } = Builder.DefinePatternAndPlaceholder(modelProp("EMAIL", { pattern: "[a-z]+" }));
		expect(pattern).toBe("[a-z]+");
	});

	it("devuelve patron vacio cuando no aplica", () => {
		const { pattern, calculatePlaceholder } = Builder.DefinePatternAndPlaceholder(modelProp("TEXT"));
		expect(pattern).toBe("");
		expect(calculatePlaceholder).toBeUndefined();
	});
});

describe("DefineMaxAndMinDefault", () => {
	it("respeta el minimo y el valor por defecto explicitos de TIME", () => {
		const result = Builder.DefineMaxAndMinDefault(modelProp("TIME", { min: "08:00", defaultValue: "09:00" }));
		expect(result.min).toBe("08:00");
		expect(result.defaultValue).toBe("09:00");
	});

	it("ignora el maximo explicito de TIME (comportamiento actual)", () => {
		// La implementacion hace `max = min ?? "20:00"`, por lo que el maximo
		// siempre se recalcula a partir del minimo y descarta el maximo del modelo.
		const result = Builder.DefineMaxAndMinDefault(modelProp("TIME", { min: "08:00", max: "18:00" }));
		expect(result.max).toBe("08:00");
	});

	it("asigna valores por defecto para TIME", () => {
		const result = Builder.DefineMaxAndMinDefault(modelProp("TIME"));
		expect(result.min).toBe("06:00");
		expect(result.defaultValue).toBe("06:00");
		// Mismo comportamiento anterior: el maximo por defecto tambien queda en 06:00.
		expect(result.max).toBe("06:00");
	});

	it("asigna valores por defecto para DATE", () => {
		const result = Builder.DefineMaxAndMinDefault(modelProp("date"));
		expect(result.max).toBe("3000-01-01");
		expect(result.min).toBe("0001-01-01");
		expect(result.defaultValue).toMatch(/^\d{4}-\d{2}-\d{2}$/);
	});

	it("asigna valores por defecto para DATETIME", () => {
		const result = Builder.DefineMaxAndMinDefault(modelProp("DATETIME"));
		expect(result.max).toBe("3000-01-01T23:59");
		expect(result.min).toBe("0001-01-01T00:00");
		expect(result.defaultValue).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
	});

	it("no asigna valores para tipos sin configuracion especial", () => {
		const result = Builder.DefineMaxAndMinDefault(modelProp("TEXT"));
		expect(result).toEqual({ max: undefined, min: undefined, defaultValue: undefined });
	});
});

describe("DefineFileConfig", () => {
	it("configura IMG e IMAGE como un solo archivo de imagen", () => {
		expect(Builder.DefineFileConfig(modelProp("IMG"))).toEqual({ multiple: false, filesType: ["image/*"] });
		expect(Builder.DefineFileConfig(modelProp("image"))).toEqual({ multiple: false, filesType: ["image/*"] });
	});

	it("configura IMAGES como multiples imagenes", () => {
		expect(Builder.DefineFileConfig(modelProp("IMAGES"))).toEqual({ multiple: true, filesType: ["image/*"] });
	});

	it("configura FILE y FILES como archivos genericos", () => {
		expect(Builder.DefineFileConfig(modelProp("FILE"))).toEqual({ multiple: false, filesType: [] });
		expect(Builder.DefineFileConfig(modelProp("FILES"))).toEqual({ multiple: true, filesType: [] });
	});

	it("respeta el fileType personalizado del modelo", () => {
		expect(Builder.DefineFileConfig(modelProp("FILES", { fileType: [".pdf"] })))
			.toEqual({ multiple: true, filesType: [".pdf"] });
		expect(Builder.DefineFileConfig(modelProp("IMG", { fileType: [".png"] })))
			.toEqual({ multiple: false, filesType: [".png"] });
	});

	it("devuelve la configuracion base para tipos desconocidos", () => {
		expect(Builder.DefineFileConfig(modelProp("TEXT"))).toEqual({ multiple: false, filesType: [] });
	});
});

describe("DefineMultiSelectConfig", () => {
	it("WRADIO no es multiple y usa SELECT_BOX", () => {
		expect(Builder.DefineMultiSelectConfig(modelProp("WRADIO"))).toEqual({ multiple: false, modType: "SELECT_BOX" });
	});

	it("WCHECKBOX es multiple y usa SELECT_BOX", () => {
		expect(Builder.DefineMultiSelectConfig(modelProp("WCHECKBOX"))).toEqual({ multiple: true, modType: "SELECT_BOX" });
	});

	it("WSELECT no es multiple y usa SELECT", () => {
		expect(Builder.DefineMultiSelectConfig(modelProp("WSELECT"))).toEqual({ multiple: false, modType: "SELECT" });
	});

	it("MULTISELECT y tipos desconocidos son multiples con SELECT", () => {
		expect(Builder.DefineMultiSelectConfig(modelProp("MULTISELECT"))).toEqual({ multiple: true, modType: "SELECT" });
		expect(Builder.DefineMultiSelectConfig(modelProp("OTRO"))).toEqual({ multiple: true, modType: "SELECT" });
	});
});

describe("DefineRequireAndDisable", () => {
	it("usa require true y disabled false por defecto", async () => {
		await expect(Builder.DefineRequireAndDisable(modelProp("TEXT"), {})).resolves.toEqual({ require: true, disabled: false });
	});

	it("respeta los valores booleanos", async () => {
		await expect(Builder.DefineRequireAndDisable(modelProp("TEXT", { require: false, disabled: true }), {}))
			.resolves.toEqual({ require: false, disabled: true });
	});

	it("evalua una funcion sincrona de require", async () => {
		const editingObject = { activo: true };
		const requireFn = vi.fn(() => false);
		const result = await Builder.DefineRequireAndDisable(modelProp("TEXT", { require: requireFn }), editingObject);
		expect(result.require).toBe(false);
		expect(requireFn).toHaveBeenCalledWith(editingObject, Builder);
	});

	it("evalua una funcion asincrona de require", async () => {
		const requireFn = vi.fn(async (obj) => obj.activo === true);
		await expect(Builder.DefineRequireAndDisable(modelProp("TEXT", { require: requireFn }), { activo: true }))
			.resolves.toEqual({ require: true, disabled: false });
		await expect(Builder.DefineRequireAndDisable(modelProp("TEXT", { require: requireFn }), { activo: false }))
			.resolves.toEqual({ require: false, disabled: false });
	});

	it("usa true/false cuando las funciones sincronas no devuelven valor", async () => {
		await expect(Builder.DefineRequireAndDisable(modelProp("TEXT", { require: () => undefined, disabled: () => undefined }), {}))
			.resolves.toEqual({ require: true, disabled: false });
	});

	it("devuelve undefined si una funcion asincrona no retorna valor (comportamiento actual)", async () => {
		// El operador `??` se aplica sobre la promesa (siempre truthy) y no sobre
		// su resultado, por lo que los valores por defecto no se aplican aqui.
		await expect(Builder.DefineRequireAndDisable(
			modelProp("TEXT", { require: async () => undefined, disabled: async () => undefined }), {})
		).resolves.toEqual({ require: undefined, disabled: undefined });
	});

	it("evalua una funcion de disabled con el objeto en edicion", async () => {
		const disabledFn = vi.fn((obj) => obj.bloqueado);
		const result = await Builder.DefineRequireAndDisable(modelProp("TEXT", { disabled: disabledFn }), { bloqueado: true });
		expect(result.disabled).toBe(true);
		expect(disabledFn).toHaveBeenCalledOnce();
	});
});

describe("findKey", () => {
	it("encuentra la clave que contiene id_", () => {
		expect(Builder.findKey({ id_Cliente: 5, nombre: "Ana" })).toBe("id_Cliente");
	});

	it("devuelve cadena vacia si no existe una clave id_ valida", () => {
		expect(Builder.findKey({ nombre: "Ana" })).toBe("");
		expect(Builder.findKey({ id_Objeto: { a: 1 } })).toBe("");
	});

	it("devuelve cadena vacia para valores que no son objetos", () => {
		expect(Builder.findKey(null)).toBe("");
		expect(Builder.findKey("id_Cliente")).toBe("");
	});
});

describe("CreateDatasetForMultiSelect", () => {
	it("devuelve el Dataset del modelo cuando el valor esta vacio", () => {
		const Dataset = [{ id: 1, nombre: "Uno" }];
		const model = modelProp("WSELECT", { Dataset });
		expect(Builder.CreateDatasetForMultiSelect(model, null)).toBe(Dataset);
		expect(Builder.CreateDatasetForMultiSelect(model, undefined)).toBe(Dataset);
		expect(Builder.CreateDatasetForMultiSelect(model, {})).toBe(Dataset);
	});

	it("devuelve un arreglo vacio cuando no hay Dataset ni valor", () => {
		expect(Builder.CreateDatasetForMultiSelect(modelProp("WSELECT"), {})).toEqual([]);
	});

	it("elimina propiedades nulas de los elementos del Dataset", () => {
		const Dataset = [{ id: 1, nombre: "Uno", extra: null }, { id: 2, nombre: "Dos", extra: undefined }];
		const result = Builder.CreateDatasetForMultiSelect(modelProp("WSELECT", { Dataset }), { id: 1, nombre: "Uno" });
		expect(result).toEqual([{ id: 1, nombre: "Uno" }, { id: 2, nombre: "Dos" }]);
	});

	it("no duplica un valor que ya existe en el Dataset", () => {
		const Dataset = [{ id: 1, nombre: "Uno" }, { id: 2, nombre: "Dos" }];
		const result = Builder.CreateDatasetForMultiSelect(modelProp("WSELECT", { Dataset }), { id: 1, nombre: "Uno" });
		expect(result).toHaveLength(2);
	});

	it("agrega un objeto que no existe en el Dataset", () => {
		const Dataset = [{ id: 1, nombre: "Uno" }];
		const nuevo = { id: 3, nombre: "Tres" };
		const result = Builder.CreateDatasetForMultiSelect(modelProp("WSELECT", { Dataset }), nuevo);
		expect(result).toHaveLength(2);
		expect(result[1]).toEqual(nuevo);
	});

	it("no agrega valores que no son objetos planos (comportamiento actual)", () => {
		const Dataset = [{ id: 1, nombre: "Uno" }];
		const result = Builder.CreateDatasetForMultiSelect(modelProp("MULTISELECT", { Dataset }), [{ id: 9 }]);
		expect(result).toHaveLength(1);
	});
});

describe("BuildTableOptions", () => {
	it("configura opciones de seleccion para WSELECT", () => {
		const action = vi.fn();
		const options = Builder.BuildTableOptions(modelProp("WSELECT"), action);
		expect(options).toEqual({
			Search: true,
			Select: true,
			MultiSelect: false,
			SelectAction: action
		});
	});

	it("configura opciones de multiseleccion para MULTISELECT", () => {
		const action = vi.fn();
		const options = Builder.BuildTableOptions(modelProp("MULTISELECT"), action);
		expect(options.Select).toBe(false);
		expect(options.MultiSelect).toBe(true);
		expect(options.SelectAction).toBe(action);
	});

	it("crea opciones CRUD por defecto y asigna las acciones", () => {
		const action = vi.fn();
		const model = modelProp("MASTERDETAIL");
		const options = Builder.BuildTableOptions(model, action);
		expect(options.Add).toBe(true);
		expect(options.Edit).toBe(true);
		expect(options.Delete).toBe(true);
		expect(options.AddAction).toBe(action);
		expect(options.EditAction).toBe(action);
		expect(options.DeleteAction).toBe(action);
		expect(options.SelectAction).toBe(action);
		expect(model.Options).toBe(options);
	});

	it("conserva las opciones previas del modelo", () => {
		const action = vi.fn();
		const model = modelProp("MASTERDETAIL", { Options: { Add: false } });
		const options = Builder.BuildTableOptions(model, action);
		expect(options).toBe(model.Options);
		expect(options.Add).toBe(false);
		expect(options.EditAction).toBe(action);
	});
});

describe("FindObjectMultiselect", () => {
	it("agrega los elementos encontrados por objeto, id e id_", () => {
		const control = {
			Dataset: [{ id: 1, nombre: "Uno" }, { id_2: 2, nombre: "Dos" }, { id_3: 5, nombre: "Tres" }],
			selectedItems: []
		};
		Builder.FindObjectMultiselect([1, { id_2: 2, nombre: "Dos" }, 5], control);
		expect(control.selectedItems).toHaveLength(3);
		expect(control.selectedItems[0]).toEqual({ id: 1, nombre: "Uno" });
		expect(control.selectedItems[2]).toEqual({ id_3: 5, nombre: "Tres" });
	});

	it("acepta un valor primitivo suelto", () => {
		const control = { Dataset: [{ id: 7 }], selectedItems: [] };
		Builder.FindObjectMultiselect(7, control);
		expect(control.selectedItems).toEqual([{ id: 7 }]);
	});

	it("ignora valores que no existen en el dataset", () => {
		const control = { Dataset: [{ id: 1 }], selectedItems: [] };
		Builder.FindObjectMultiselect([99, "no-existe"], control);
		expect(control.selectedItems).toEqual([]);
	});

	it("no falla si el control o el valor no son validos", () => {
		expect(() => Builder.FindObjectMultiselect(null, null)).not.toThrow();
		expect(() => Builder.FindObjectMultiselect(1, { selectedItems: [] })).not.toThrow();
	});
});

describe("CreateInfoToolTip", () => {
	it("agrega un ToolTip al contenedor del control", () => {
		const { control, wrapper } = createInputControl();
		Builder.CreateInfoToolTip(control, "Mensaje de prueba");
		const toolTip = wrapper.querySelector(".ToolTip");
		expect(toolTip).toBeTruthy();
		expect(toolTip?.className).toContain("ToolInfo");
		expect(toolTip?.innerHTML).toBe("Mensaje de prueba");
		expect(control.style.boxShadow).not.toBe("");
	});

	it("no duplica el ToolTip si ya existe uno", () => {
		const { control, wrapper } = createInputControl();
		Builder.CreateInfoToolTip(control, "Primero");
		Builder.CreateInfoToolTip(control, "Segundo");
		expect(wrapper.querySelectorAll(".ToolTip")).toHaveLength(1);
		expect(wrapper.querySelector(".ToolTip")?.innerHTML).toBe("Primero");
	});

	it("enfoca el control para llamar la atencion del usuario", () => {
		const { control } = createInputControl();
		const focusSpy = vi.spyOn(control, "focus");
		Builder.CreateInfoToolTip(control, "Mensaje");
		expect(focusSpy).toHaveBeenCalled();
	});
});

describe("OnChange", () => {
	it("no actualiza el objeto y muestra alerta cuando validateFunction falla", async () => {
		const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => { });
		const { control } = createInputControl({ value: "valor" });
		const validateFunction = vi.fn(() => ({ success: false, message: "Valor no permitido" }));
		const Model = { codigo: modelProp("TEXT", { validateFunction }) };
		const ObjectF = { codigo: "anterior" };

		await Builder.OnChange(control, control, ObjectF, "codigo", Model);

		expect(validateFunction).toHaveBeenCalledWith(ObjectF, "valor");
		expect(alertSpy).toHaveBeenCalledWith("Valor no permitido");
		expect(ObjectF.codigo).toBe("anterior");
	});

	it("actualiza el objeto cuando validateFunction es exitosa", async () => {
		const { control } = createInputControl({ value: "ok" });
		const Model = { codigo: modelProp("TEXT", { validateFunction: () => ({ success: true }) }) };
		const ObjectF = {};

		await Builder.OnChange(control, control, ObjectF, "codigo", Model);

		expect(ObjectF.codigo).toBe("ok");
	});

	it("actualiza el objeto con el estado checked de un checkbox", async () => {
		const { control } = createInputControl({ type: "checkbox", checked: true });
		const Model = { activo: modelProp("CHECKBOX") };
		const ObjectF = {};

		await Builder.OnChange(control, control, ObjectF, "activo", Model);

		expect(ObjectF.activo).toBe(true);
	});

	it("actualiza el objeto con el valor de un radio", async () => {
		const { control } = createInputControl({ type: "radio", value: "2" });
		const Model = { estado: modelProp("RADIO") };
		const ObjectF = {};

		await Builder.OnChange(control, control, ObjectF, "estado", Model);

		expect(ObjectF.estado).toBe("2");
	});

	it("actualiza el objeto con el valor de un input de texto", async () => {
		const { control } = createInputControl({ type: "text", value: "Ana" });
		const Model = { nombre: modelProp("TEXT") };
		const ObjectF = {};

		await Builder.OnChange(control, control, ObjectF, "nombre", Model);

		expect(ObjectF.nombre).toBe("Ana");
	});

	it("muestra un ToolTip cuando el valor es menor al minimo", async () => {
		const { control, wrapper } = createInputControl({ type: "number", value: "0", min: "1", max: "10" });
		const Model = { cantidad: modelProp("NUMBER") };
		const ObjectF = {};

		await Builder.OnChange(control, control, ObjectF, "cantidad", Model);

		expect(wrapper.querySelector(".ToolTip")?.innerHTML).toBe("El valor mínimo permitido es: 1");
		expect(ObjectF.cantidad).toBe("0");
	});

	it("muestra un ToolTip cuando el valor supera el maximo", async () => {
		const { control, wrapper } = createInputControl({ type: "number", value: "50", min: "1", max: "10" });
		const Model = { cantidad: modelProp("NUMBER") };
		const ObjectF = {};

		await Builder.OnChange(control, control, ObjectF, "cantidad", Model);

		expect(wrapper.querySelector(".ToolTip")?.innerHTML).toBe("El valor máximo permitido es: 10");
		expect(ObjectF.cantidad).toBe("50");
	});

	it("marca el control sin sombra cuando el patron es correcto", async () => {
		const { control, wrapper } = createInputControl({ type: "text", value: "12345", pattern: "[0-9]+" });
		const Model = { codigo: modelProp("TEXT") };
		const ObjectF = {};

		await Builder.OnChange(control, control, ObjectF, "codigo", Model);

		expect(control.style.boxShadow).toBe("none");
		expect(wrapper.querySelector(".ToolTip")).toBeNull();
		expect(ObjectF.codigo).toBe("12345");
	});

	it("muestra un ToolTip cuando el patron no se cumple", async () => {
		const { control, wrapper } = createInputControl({
			type: "text", value: "abc", pattern: "[0-9]+", placeholder: "Solo números"
		});
		const Model = { codigo: modelProp("TEXT") };
		const ObjectF = {};

		await Builder.OnChange(control, control, ObjectF, "codigo", Model);

		const toolTip = wrapper.querySelector(".ToolTip");
		expect(toolTip?.innerHTML).toBe("Ingresar formato correcto: Solo números");
		expect(control.style.boxShadow).not.toBe("");
		expect(ObjectF.codigo).toBe("abc");
	});

	it("elimina un ToolTip previo antes de validar de nuevo", async () => {
		const { control, wrapper } = createInputControl({ type: "text", value: "abc" });
		const previous = document.createElement("span");
		previous.className = "ToolTip";
		wrapper.append(previous);
		const Model = { codigo: modelProp("TEXT") };

		await Builder.OnChange(control, control, {}, "codigo", Model);

		expect(wrapper.querySelector(".ToolTip")).toBeNull();
	});

	it("no actualiza el objeto para tipos de archivo", async () => {
		const { control } = createInputControl({ type: "file" });
		const Model = { foto: modelProp("IMG") };
		const ObjectF = { foto: "anterior.jpg" };

		await Builder.OnChange(control, control, ObjectF, "foto", Model);

		expect(ObjectF.foto).toBe("anterior.jpg");
	});

	it("no actualiza el objeto cuando el control es un calendario", async () => {
		const target = document.createElement("input");
		const calendar = document.createElement("w-calendar-component");
		const Model = { fecha: modelProp("CALENDAR") };
		const ObjectF = { fecha: "2024-01-01" };

		await Builder.OnChange(target, calendar, ObjectF, "fecha", Model);

		expect(ObjectF.fecha).toBe("2024-01-01");
	});
});
