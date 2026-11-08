/**
 * Polyfills necesarios para ejecutar los componentes de WDevCore en jsdom.
 *
 * jsdom no implementa `HTMLElement.innerText`, pero WDevCore lo usa para
 * etiquetas, opciones de select y mensajes. Se aproxima a `textContent`
 * (que es suficiente para las pruebas) para que el DOM generado se comporte
 * como en un navegador real.
 */
const descriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "innerText");

if (!descriptor?.get || !descriptor?.set) {
	Object.defineProperty(HTMLElement.prototype, "innerText", {
		configurable: true,
		get() {
			return this.textContent;
		},
		set(value) {
			this.textContent = value;
		},
	});
}
