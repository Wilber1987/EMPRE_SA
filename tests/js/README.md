# Pruebas JS — ModelPropertyFormBuilder

Pruebas automatizadas (unitarias y de integración) para la clase
`ModelPropertyFormBuilder` de WDevCore:

```
UI/wwwroot/WDevCore/ComponentsBuilders/ModelPropertyFormBuilder.js
```

El código bajo prueba pertenece al submódulo `UI/wwwroot/WDevCore`, por lo que
las pruebas viven fuera de él (en `tests/js`) y lo importan por ruta relativa.
No se modifica el submódulo.

## Requisitos

- Node.js 20 o superior (probado con Node 24).
- Submódulo `UI/wwwroot/WDevCore` inicializado (`git submodule update --init`).
- Dependencias instaladas:

```bash
cd tests/js
npm install
```

## Ejecutar las pruebas

```bash
cd tests/js

npm test                  # todas las pruebas
npm run test:unit         # solo unitarias
npm run test:integration  # solo integración
npm run test:watch        # modo interactivo
npm run coverage          # cobertura (HTML en tests/js/coverage)
```

## Estructura

```
tests/js
├─ package.json
├─ vitest.config.js            # entorno jsdom + cobertura + setup
└─ tests
   ├─ setup
   │  └─ jsdom-polyfills.js    # polyfill de HTMLElement.innerText
   ├─ unit
   │  └─ ModelPropertyFormBuilder.unit.test.js
   └─ integration
      └─ ModelPropertyFormBuilder.integration.test.js
```

### Pruebas unitarias (67)

Verifican la lógica pura de la clase, sin depender de un formulario completo:

- `GetInputType` y `PrepareVisualization` (tipos HTML, MONEY, PERCENTAGE, DATE, DATETIME).
- `DefinePatternAndPlaceholder` (EMAIL, TEL, URL y patrones personalizados).
- `DefineMaxAndMinDefault` y `DefineFileConfig`.
- `DefineMultiSelectConfig` y `DefineRequireAndDisable` (funciones síncronas/asíncronas).
- `CreateDatasetForMultiSelect`, `BuildTableOptions`, `FindObjectMultiselect` y `findKey`.
- `CreateInfoToolTip` y `OnChange` (checkbox, radio, mínimo/máximo, patrón, validación, archivos y calendario).

### Pruebas de integración (32)

Construyen los controles reales en el DOM y comprueban la interacción entre el
builder, los componentes de WDevCore y un `WForm` completo:

- `CreateInput` (EMAIL, NUMBER, DATETIME), `require`/`disabled` dinámicos y flujo con `OnChange`.
- `CreateSelect` con datasets de valores y de objetos.
- `CreateTextArea`, `CreateCheckBox` y `CreateRadioGroups`.
- `CreatePassword` (coincidencia de contraseñas).
- `CreateWSelect`/`MULTISELECT`, `CreateFileInput`, `CreateRichText`, `CreateCalendar` y `CreateModel`.
- `WForm` de extremo a extremo: construcción de todos los controles, valores por
  defecto, propagación de cambios al `FormObject` y validación de formato con `ToolTip`.

## Notas

- `jsdom` no implementa `HTMLElement.innerText`. El setup lo aproxima a
  `textContent` para que las etiquetas y opciones generadas por WDevCore se
  puedan verificar como en un navegador real.
- Algunas pruebas documentan **comportamientos actuales** de la clase que
  parecen errores y que conviene revisar antes de cambiarlos:
  - En `DefineMaxAndMinDefault`, para `TIME` el máximo se calcula como
    `max = min ?? "20:00"`, por lo que se descarta el máximo configurado.
  - En `DefineRequireAndDisable`, si una función `async` no retorna valor, el
    operador `??` actúa sobre la promesa y el resultado queda en `undefined`.
