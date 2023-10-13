namespace CAPA_NEGOCIO.Services;
public class ContractsTemplates
{
    public static string ContractPrestamo = @"
        <!DOCTYPE html>
            <html>

            <head>
            </head>

            <body>
                <p style='font-size:9.5px; margin-top:0px; margin-bottom:0px; text-align:center; padding-bottom:0px'>
                    EMPEÑOS Y PRÉSTAMOS S.A 'EMPRE SA'
                    Carazo - Nicaragua
                </p>
                <p style='font-size:9.5px; margin-top:0px; margin-bottom:0px; text-align:center; padding-bottom:0px'>“Tu
                    Prosperidad, Es Nuestro Éxito….”
                    {{fecha}}
                </p>

                <p style='font-size: 9.5px; margin-top: 0px; margin-bottom: 0px; text-align: left; padding-bottom: 0px;'>
                    No Contrato:
                    {{numero_contrato}}
                    RUC J0310000300895
                </p>

                <p style='font-size:9.5px; margin-top:0px; margin-bottom:0px; text-align:center; padding-bottom:0px'>Oficina Central
                    82572062 (Mov); 57199497 (Cl), 25353613 (Planta)</p>
                <p style='font-size:9.5px; margin-top:0px; margin-bottom:0px; text-align:center; padding-bottom:0px'>CONTRATO DE
                    MUTUO GARANTIZADO CON PRENDA COMERCIAL</p>
                <p style='text-align: justify; font-size:9.5px; margin-top:20px'>Nosotros: Juan José Villavicencio Navarro, mayor de
                    edad, casado, ingeniero Industrial, con cédula Nº 043-240688-0001M, Nicaragüense y de este domicilio de San
                    Marcos, actuando en calidad de apoderado generalísimo
                    de la sociedad Anónima denominada: ' EMPEÑOS Y PRESTAMOS S.A ' EMPRE S.A, Sociedad que es de este domicilio,
                    constituida, autorizada y existente de conformidad a las leyes de la República de Nicaragua, en escritura
                    pública
                    #51, Constitución de Sociedad Anónima y estatutos,
                    y bajo el asiento #10011, Pág. 229/245, Tomo 97, Libro segundo de sociedades del Registro público de Carazo, que
                    por brevedad en lo sucesivo del presente contrato se le podrá denominar el ACREEDOR; siendo el domicilio: Del
                    Instituto Juan XXIII, 20 varas al Oeste,
                    en el municipio de San Marcos, Departamento de Carazo, Dirección electrónica: empresociedadanonima@gmail.com; y
                    por otra parte el / la señor (a) :  {{primer_nombre}}  {{segundo_nombre}}  {{primer_apellido}}  {{segundo_apellidio}} mayor de edad,
                    con número de cédula: {{identificacion}}  con domicilio: {{direccion}} , Estado civil: {{estado_civil}} quien habita en
                    el
                    municipio de: {{municipio}}, Departamento de {{departamento}},
                    a quien en sucesivo se le denominará el 'DEUDOR', hemos convenido en celebrar el presente 'CONTRATO DE MUTUO
                    GARANTIZADO CON PRENDA COMERCIAL' , el cual se regirá conforme las cláusulas siguientes:
                </p>

                <p style='text-align: justify; font-size:9.5px;'><u>1. PRIMERA (MONTO DEL PRÉSTAMO):</u> El deudor confiesa tener
                    recibido de parte del acreedor, un préstamo en calidad de
                    mutuo, por la cantidad de: C$. {{monto}} , equivalente a moneda de los Estados Unidos de América: $
                    {{cuotafija_dolares}}, Según el valor de la
                    compra del dólar a la fecha de hoy de: C${{taza_cambio}} Suma de dinero que el deudor, se obliga a destinar,
                    única y
                    exclusivamente
                    al pago del préstamo otorgado. El deudor acepta estar conforme de recibir mensajes de texto en su teléfono
                    celular
                    de parte del acreedor en referencia a cobranza, promociones, felicitaciones e información general, además de
                    tomarse
                    una fotografía al momento de recibir el desembolso del préstamo como comprobante de lo contratado y al caer en
                    incumplimiento de pago y negación a acuerdos administrativos, el DEUDOR da el derecho pleno a EMPRE S.A de hacer
                    pública su deuda, haciendo uso de la fotografía de entrega del dinero en carteles de cobranzas que serán
                    publicados
                    en las diferentes redes sociales, asì como en los postes aledaños a su domicilio y centro de trabajo.
                </p>
                <p style='text-align: justify; font-size:9.5px;'><u>2. SEGUNDA (GARANTÍAS PRENDARIAS):</u> En garantía del pago a la
                    cantidad debida, daños y perjuicios, gastos y
                    honorarios sean estos judiciales o extrajudiciales, el deudor constituye a favor del acreedor prenda (s)
                    comercial
                    (es) sobre el/los siguiente (s) bien (es), todo de conformidad a lo establecido en la ley de prenda comercial de
                    Nicaragua (ley 146).
                </p>
                <p style='text-align: justify; font-size:9.5px;'>
                    <u> Observaciones:</u>
                    Adjunto a este contrato queda (n) el/los documento (s) original (es) que hace (n) constar que el deudor es el
                    único
                    dueño de la (s) prenda (s) comerciales(s) que queda (n) como garantía (Entiéndase documentos como facturas
                    membretadas o actas notariadas). La (s) garantía (s) queda(n) en manos del deudor, quien conservará a nombre del
                    acreedor la posesión de/del los objeto (s) pignorado (s) en calidad de depositario, este(os) viene (s)
                    pignorado(s)
                    estará(n) ubicado(s) en el domicilio del deudor (descrita al inicio de este contrato), pudiendo usar de el/ellos
                    sin
                    menoscabo de su valor, pero este no podrá venderla(s), ni empeñarla(s), ni cambiarla(s) de domicilio, mientras
                    este
                    (n) como garantía en este contrato. El acreedor podrá retirar la (s) garantía (s) en caso de fuerzas mayores. El
                    deudor acepta en su totalidad lo convenido referente a la prenda en relación con lo siguiente: A. De conformidad
                    con
                    el Arto. 2 de la Ley de Prenda Comercial, el deudor conservará a nombre del acreedor la posesión del/de los
                    viene
                    (s), estando obligado a realizar por su cuenta los trabajos y gastos necesarios de mantenimiento, cuido,
                    conservación y recolección, en su caso, y tendrá respecto a los mismos los deberes y responsabilidades de un
                    depositario sin perjuicio de las sanciones contempladas en la ley de Prenda Comercial, y en las demás Leyes de
                    La
                    Republica de Nicaragua. B. Informar por escrito por medio de carta o correo electrónico al acreedor cualquier
                    demérito, desmejora, perjuicio o daño que pudiese ocurrirle al/los bien (es) pignorado (s), debiendo hacerlo
                    dentro
                    de un plazo no mayor de setenta y dos (72) horas de ocurridos, para tal efecto, el domicilio del acreedor es:
                    Del
                    instituto Autónomo Juan XXIII, 20 vrs. Oeste, en el municipio de San Marcos, Departamento de Carazo, Dirección
                    electrónica: empresociedadanonima@gmail.com C. El deudor será responsable en asumir siempre su deuda, aunque se
                    presenten casos de pérdida, deterioro o destrucción de la (s) prenda (s) dada (s) en garantía, casos fortuitos o
                    fuerzas mayores (Terremotos, incendios, robos, asalto u otro hecho natural, social o delictivo que no le sea
                    imputable), siempre que estén bajo su poder. D. No celebrar otro contrato de prenda o cualquier tipo de
                    transacción,
                    cesión, venta o negociación sobre el/los bien (es) pignorado (s), sin previa autorización explícita y escrita
                    del
                    acreedor. E. Permitir la inspección de los bienes pignorados cuando el acreedor así lo requiera. Los bienes
                    como:
                    celulares, cámaras fotográficas, computadoras portátiles, Tablet, joyas de oro, plata y toda prenda pequeña que
                    sea
                    de fácil movimiento, no se tomaran como objeto de garantías, en donde el deudor acepta los siguientes términos:
                    A.
                    El acreedor no se responsabiliza por algún tipo de deterioro que se pueda(n) presentar durante el traslado de la
                    (s)
                    garantía (s) hasta su domicilio, en casos que se ejecute el resguardo de garantias. B. Cuando la (s) garantía
                    (s)
                    estén en manos del acreedor, este no se hará responsable por robos, terremotos, inundaciones, incendios,
                    derrumbes,
                    erupciones, y cualquier otro hecho social, natural o delictivo o fallas en el funcionamiento que atente contra
                    la
                    garantía durante el tiempo de almacenamiento de la(s) misma (s) en las instalaciones del acreedor. La prenda(s)
                    dada(s) en garantía(s) quedará libre hasta que el deudor haya pagado todo lo adeudado al acreedor.
                </p>
                <p style='text-align: justify; font-size:9.5px;'><u>3. TERCERA (PLAZO Y FORMA DE PAGO):</u> El deudor decide en
                    cuantas cuotas mensuales cancelar su préstamo,
                    pero no podrá exceder los veinticuatro meses, los pagos se realizarán en cuotas fijas de C$ {{cuotafija}} , que
                    serán
                    modificables al tipo de cambio del dólar, en la fecha que el cliente haga efectivo su pago. Los pagos se
                    realizarán en córdobas o el equivalente a $ {{cuotafija_dolares}}, Estadounidenses, Según tasa de cambio del
                    Banco Central de
                    Nicaragua, iniciando la primera cuota el día y la última el día . El deudor se obliga a pagar al acreedor; La
                    mora, el interés neto corriente, demás cargos a pagar en relación con lo pactado, y el capital prestado, en las
                    oficinas principales del acreedor o realizar el pago de su cuota en línea en cualquier sucursal o agente Banpro
                    en la cuenta en córdobas No 1001 3700 0011 66, o en la cuenta en dólares No 1001 3710 0012 05, a nombre de Juan
                    Jose Villavicencio Navarro Y/O Jose Adilio Aguirre Jarquin con previa notificación a la oficina donde se le
                    realizó el contrato, los pagos serán todos en cuotas fijas según tabla de amortización de deuda por garantía
                    prendaria aquí estipulada al final de este contrato, no esta permitido pagar únicamente intereses y demás cargos
                    sin realizar abonos que amorticen su capital prestado. En ningún momento el deudor podrá cancelar el monto total
                    de su capital prestado, sin antes haber pagado mora, interés neto corriente, más los demás cargos a pagar en
                    relación con lo pactado. En caso de que el Deudor falleciera, se procederá a ejecutar lo establecido en el art
                    22 de la ley de garantía prendaria (146).
                </p>
                <p style='text-align: justify; font-size:9.5px;'><u>4. CUARTA (INTERES CORRIENTE Y DEMAS CARGOS MENSUALES A PAGAR EN
                        RELACION CON LO PACTADO):</u> El préstamo
                    devengará una tasa de interés corriente inicial del {{interes_inicial_label}} por ciento
                    ({{interes_inicial}}%) sobre saldo, la cual será
                    verificable mensualmente de acuerdo con la tasa promedio ponderada que emita el Banco Central de Nicaragua, de
                    conformidad a
                    la ley 176. Los demás cargos a pagar en relación con lo pactado, a como lo menciona el artículo 74 numeral 4 de
                    la ley 842, bajo lo cual Empresa estipula lo siguiente:
                    {{interes_gastos_administrativos_label}} por ciento
                    ({{interes_gastos_administrativos}}%)
                    de Gastos administrativos, {{interes_gastos_legales_label}} por ciento ({{interes_gastos_legales}}%) de gastos
                    legales, {{interes_comisiones_label}} por ciento ({{interes_comisiones}}%) de Comisiones,
                    {{interes_mantenimiento_valor_label}} por
                    ciento ({{interes_mantenimiento_valor}}%) de mantenimiento al valor de la prenda,
                    {{interes_demas_cargos_label}} porciento ({{interes_demas_cargos}}%) de Gestiones crediticias; Todos estos
                    demás cargos son aplicados sobre el monto restante.
                </p>
                <p style='text-align: justify; font-size:9.5px;'><u>5. QUINTA ( MORA):</u> El deudor podrá realizar el pago de su
                    cuota anticipada a su fecha de pago de cuota,
                    con el fin de evitarse mora; En caso que el Deudor no pague en la fecha de pago de cada cuota mensual,
                    automáticamente quedará constituido en mora y por el sólo hecho de incumplimiento, sin necesidad de intimidación
                    o requerimiento alguno judicial o extrajudicial y desde esa fecha hasta el pago efectivo de su cuota, reconocerá
                    al acreedor un recargo moratorio de 0.005 que corresponde al 50%, del 1 % del interés corriente pactado (Ley
                    176_Arto4), aplicado a la cuota fija en mora, equivalente a C$ , La mora se calcula multiplicando el recargo
                    moratorio, multiplicado por la cuota fija en C$ en mora, y por los días que hayan trascurrido desde su fecha que
                    debió pagar, hasta el pago efectivo de su cuota.
                </p>
                <p style='text-align: justify; font-size:9.5px;'><u>6. SEXTA (VENCIMIENTO ANTICIPADO):</u> No obstante al plazo
                    prefijado y la forma de pago convenida, y sin
                    perjuicio de otras causales establecidas en este contrato, EL acreedor dará por vencido anticipadamente el
                    préstamo otorgado, resolviéndose este contrato de pleno derecho y EL acreedor hará exigible al deudor, el pago
                    inmediato de todo lo adeudado, sin necesidad de requerimiento judicial o extrajudicial, en los siguientes casos:
                    A. Si el deudor u otra persona con o sin sus instrucciones, impidiesen a cualquier representante de EMPRE S.A
                    inspeccionar los bienes constituidos en garantía a favor del acreedor. B. Si sobre los bienes constituidos en
                    garantía recayese anotación, embargo, demanda u otra medida ejecutiva precautoria. C. Si los bienes constituidos
                    en garantía sufriesen daños o desmejoras tales y por tanto disminuyese la garantía constituida en este
                    instrumento por cualquier causa aunque no sea imputable a El deudor de forma que su valor no cubriese el saldo
                    del Préstamo y el deudor no efectuase una amortización adecuada para que el saldo quede garantizado a juicio del
                    acreedor. D. Cuando por Caso Fortuito o Fuerza Mayor disminuyese la garantía, a menos que sea sustituida por
                    otra nueva y segura a decisión del acreedor. E. Si por cualquier causa no fueren inscritos los bienes
                    constituidos en garantía o fuesen inscritos con prelación o grado diferente del estipulado. F. En caso que el
                    deudor se presente, o declare insolvente, o simplemente admita o solicite su incapacidad para cumplir
                    oportunamente con el pago de sus obligaciones corrientes, o bien si el deudor incurriere en deterioro de su
                    situación económica que pusiere en peligro el cumplimiento de sus obligaciones crediticias, se procederá a tomar
                    los bienes (garantías) en calidad de pago. G. En caso de incumplimiento de cualquiera de las cláusulas
                    establecidas en este contrato. Las pruebas de estos hechos quedan sujeta a la simple afirmación del acreedor o
                    sus representantes.
                </p>
                <p style='text-align: justify; font-size:9.5px;'><u>7. SEPTIMA (RETIRO DE GARANTÍA DEL DOMICILIO DEL DEUDOR AL
                        DOMICILIO DEL ACREEDOR):</u> El deudor declara
                    compromiso puntual de pago, incluso en circunstancias adversas, como casos fortuitos o fuerza mayor, cuyos
                    riesgos asume, pero si el deudor no paga una de sus cuotas o llegue a la fecha prevista de cancelación y el
                    deudor no cancele y para ambos casos transcurran 14 días en mora, el deudor transfiere total derecho al acreedor
                    para retirar la (s) garantía (s) descritas en este contrato, desde el sitio en donde se encuentren, hasta el
                    domicilio del acreedor, bajo el común acuerdo de este contrato, sin negación alguna, esta cláusula aplicará
                    aunque faltare una cuota para saldar la obligación adquirida del deudor, los costos que generen el traslado de
                    la garantía serán cargados a la cuenta por pagar del deudor, en este caso el deudor dispone únicamente de 15
                    días posteriores al retiro de garantías, para cancelar toda su deuda, de lo contrario se procederá a vender
                    la(s) garantía(s).
                </p>
                <p style='text-align: justify; font-size:9.5px;'><u>8. OCTAVA (PAGOS DE CUOTAS O CANCELACIÓN ANTICIPADA):</u> En
                    caso que El Deudor, realice pagos de cuotas o
                    Cancelación anticipada a la (las) fecha (s) de vencimiento no habrá cobro de ningún tipo de penalidad. Sin
                    perjuicio de lo anterior, las partes acuerdan que en caso de cancelación total anticipada el Deudor reconocerá y
                    pagará únicamente el interese neto más demás cargos en relación con lo pactado devengados al día de la
                    cancelación total, y en su caso, se realizará liquidación de los demás cargos a pagar en relación con lo pactado
                    e interés en el presente contrato. En caso de pagos de cuotas anticipadas, de este pago, el abono se aplicarán
                    al principal de la deuda, con lo que no variará el plan de pagos del Préstamo en relación a la periodicidad y
                    fechas de las cuotas, sino en la proporción de principal e intereses de cada cuota, además, en dependencia del
                    monto del (los) pago (s) anticipado (s) es posible que se reduzca el plazo total del préstamo. Si el deudor
                    cancela su contrato antes de los primeros 30 días después de haber firmado este contrato, deberá pagar el
                    Interés neto corriente y todo lo demás cargos a pagar en relación con lo pactado correspondiente a un mes.
                </p>
                <p style='text-align: justify; font-size:9.5px;'><u>9. NOVENA (DERECHOS DEL DEUDOR):</u> El Deudor tiene los
                    siguientes derechos de conformidad con la Norma sobre
                    la transparencia de las operaciones: A. a ser informados de forma clara, completa, oportuna y adecuada de los
                    servicios del acreedor y adicionalmente de recibir información fiscal básica: B. recibir información previa
                    antes de la suscripción del contrato: El acreedor le pondrá a disposición a 'El Deudor el contrato, para que
                    este tenga en su poder una copia del mismo. C. información durante la vigencia de la obligación: A que de previo
                    a la firma del contrato, tiene el derecho de solicitar aclaraciones y que se le entregue la tabla de
                    amortización de garantía prendaria. D. Atención de El acreedor por medio de sus funcionarios u oficina de
                    atención al público: El Deudor tiene el derecho de ser atendido oportuna y diligentemente con un trato adecuado
                    por parte del acreedor y que se respete su privacidad siempre y cuando cumpla con las obligaciones aquí
                    contraídas. A que se le respondan sus reclamos, quejas y consultas, en los horarios de oficina (Lunes a viernes
                    de 8:30 am - 5:00 Pm y Sábados de 8:30 am - 11:00 Am)
                </p>
                <p style='text-align: justify; font-size:9.5px;'><u>10. DECIMA (OBLIGACIONES DEL DEUDOR):</u> El Deudor se obliga
                    expresamente a lo siguiente: A. Debe leer de
                    previo el contrato y solicitar aclaraciones al acreedor. B. A suministrar al acreedor toda la información que
                    éste le solicite sobre la garantía descrita en este contrato. C. Actualizar cualquier cambio de su información
                    brindada. D. El acreedor y El Deudor acuerdan que cualquier información o notificación que El acreedor deba
                    notificar a El Deudor, se reputará válidamente hecha por cualquiera de los siguientes canales de información:
                    D.1. Comunicaciones a la dirección de correspondencia, correo electrónico y/o domicilio señalado por El Deudor
                    al momento de la fecha de este contrato o en las actualizaciones que realizare. D.2. cualquier otro medio que El
                    acreedor ponga a disposición de El Deudor que facilite la adecuada comunicación. . C. A entregar la copia del
                    contrato al momento de la cancelación del mismo, en caso de pérdida debe de pagar la cantidad de C$ 30.00
                    (treinta córdobas) por perdida de documento.
                </p>
                <p style='text-align: justify; font-size:9.5px;'><u>11. DECIMAPRIMERA (REGIMEN LEGAL):</u> El presente contrato de
                    préstamo, y todos los derechos o actos que se
                    deriven o sean consecuencia del mismo, quedan sometidos a la Ley 842, ley 176, ley de prenda comercial 146 y en
                    su defecto al Código Civil y el Código de Comercio y demás leyes de la República de Nicaragua.
                </p>
                <p style='text-align: justify; font-size:9.5px;'><u>12. DECIMASEGUNDA ( LUGAR Y FECHA DEL CONTRATO):</u> Los
                    comparecientes declaran expresamente que aceptan el
                    presente contrato con los términos relacionados, Y leído el presente contrato por las partes lo encontramos
                    conforme, aprobamos, ratificamos, rubricamos y firmamos, en la ciudad de San Marcos a los .
                </p>
            <br></br>
                <style>
                td {
                    border: 1px black solid;
                    padding: 5px;
                    width: 7.14% !important;
                }

                td.col2 {
                    width: 14.28% !important;
                }

                td.col6 {
                    width: 42.85% !important;
                }

                td.val {
                    text-align: right;
                }
            </style>
            <table style='width: 100%;font-size:9px !important; border-collapse: collapse;'>
                <thead>
                    <tr>
                        <td colspan='2' class='col2'><span lang='ES-NI'>CAPITAL PRESTADO C$</span></td>
                        <td colspan='2' class='col2'> <span lang='ES-NI'>C$ {{valoracion_empeño_cordobas}}</span></td>
                        <td colspan='6' class='col6' rowspan='2'>
                        <span lang='ES-NI'>TABLA DE AMORTIZACION DE DEUDA POR GARANTIA PRENDARIA</span>
                        </td>
                        <td colspan='2' class='col2'><span lang='ES-NI'>CUOTA C$</span></td>
                        <td colspan='2' class='col2'> <span lang='ES-NI'>C$ {{cuotafija}}</span></td>
                    </tr>
                    <tr>
                        <td colspan='2' class='col2'> CAPITAL PRESTADO $</td>
                        <td colspan='2' class='col2'> $ {{valoracion_empeño_dolares}}</td>
                        <td colspan='2' class='col2'><span lang='ES-NI'>CUOTA FIJA<br>$</br></span> </td>
                        <td colspan='2' class='col2'>$ {{cuotafija_dolares}}</td>
                    </tr>
                    <tr>
                        <td colspan='2' class='col2'>
                        <span lang='ES-NI'>PLAZO PARA CANCELAR: {{plazo}} mes(es)</span>
                        </td>
                        <td colspan='2' class='col2'>
                        <p style='margin-bottom:0cm;text-align:center;line-height:normal'>
                            <span lang='ES-NI'>INTERÉS NETO CORRIENTE(a): 1%</span>
                        </p>
                        </td>
                        <td colspan='2' class='col2'>
                        <span lang='ES-NI'>Demás cargos a
                            pagar en relación con lo pactado (b)</span>
                        </td>
                        <td colspan='2' class='col2'>
                        <span lang='ES-NI'>Interés Neto
                            corriente más demás cargos a
                            pagar en relación con lo pactado</span>
                        </td>
                        <td colspan='2' class='col2'>
                        <span lang='ES-NI'>ABONO AL
                            CAPITAL</span>
                        </td>
                        <td colspan='2' class='col2'>
                        <span lang='ES-NI'>TOTAL A
                            PAGAR</span>
                        </td>
                        <td colspan='2' class='col2'>
                        <span lang='ES-NI'>MONTO
                            RESTANTE</span>
                        </td>
                    </tr>
                    <tr>
                        <td colspan='2' class='col2'><span lang='ES-NI'>FECHAS DE PAGO</span></td>
                        <td><span lang='ES-NI'>C$</span></td>
                        <td><span lang='ES-NI'>$</span></td>
                        <td><span lang='ES-NI'>C$</span></td>
                        <td><span lang='ES-NI'>$</span></td>
                        <td><span lang='ES-NI'>C$</span></td>
                        <td><span lang='ES-NI'>$</span></td>
                        <td><span lang='ES-NI'>C$</span></td>
                        <td><span lang='ES-NI'>$</span></td>
                        <td><span lang='ES-NI'>C$</span></td>
                        <td><span lang='ES-NI'>$</span></td>
                        <td><span lang='ES-NI'>C$</span></td>
                        <td><span lang='ES-NI'>$</span></td>
                    </tr>
                </thead>
                {{tbody_amortizacion}}

            </table>
                <p style='text-align:left; font-size:10px; margin-top:50px; padding-bottom:0px; margin-bottom:0px;'>
                    Deudor: {{primer_nombre}} {{segundo_nombre}} {{primer_apellido}} {{segundo_apellidio}}
                </p>
                <p style='text-align:left; font-size:10px; margin-top:0px; padding-bottom:0px; margin-bottom:0px;'>Cédula:
                    {{identificacion}}
                </p>
                <p style='text-align:left; font-size:10px; margin-top:0px; padding-bottom:0px; margin-bottom:0px;'>Cel:{{telefono}}
                </p>

            </body>

            </html>
    ";
    public static string ContractEmpenoVehiculo = @"
    <!DOCTYPE html>
        <html>

        <head>
        </head>

        <body>
            <p style='font-size:9.5px; margin-top:0px; margin-bottom:0px; text-align:center; padding-bottom:0px'>
                EMPEÑOS Y PRÉSTAMOS S.A 'EMPRE SA'
                Carazo - Nicaragua
            </p>
            <p style='font-size:9.5px; margin-top:0px; margin-bottom:0px; text-align:center; padding-bottom:0px'>“Tu
                Prosperidad, Es Nuestro Éxito….”
                {{fecha}}
            </p>

            <p style='font-size: 9.5px; margin-top: 0px; margin-bottom: 0px; text-align: left; padding-bottom: 0px;'>
                No Contrato:
                {{numero_contrato}}
                RUC J0310000300895
            </p>

            <p style='font-size:9.5px; margin-top:0px; margin-bottom:0px; text-align:center; padding-bottom:0px'>Oficina Central
                82572062 (Mov); 57199497 (Cl), 25353613 (Planta)</p>
            <p style='font-size:9.5px; margin-top:0px; margin-bottom:0px; text-align:center; padding-bottom:0px'>CONTRATO DE
                MUTUO GARANTIZADO CON PRENDA COMERCIAL</p>
            <p style='text-align: justify; font-size:9.5px; margin-top:20px'>Nosotros: Juan José Villavicencio Navarro, mayor de
                edad, casado, ingeniero Industrial, con cédula Nº 043-240688-0001M, Nicaragüense y de este domicilio de San
                Marcos, actuando en calidad de apoderado generalísimo
                de la sociedad Anónima denominada: ' EMPEÑOS Y PRESTAMOS S.A ' EMPRE S.A, Sociedad que es de este domicilio,
                constituida, autorizada y existente de conformidad a las leyes de la República de Nicaragua, en escritura
                pública
                #51, Constitución de Sociedad Anónima y estatutos,
                y bajo el asiento #10011, Pág. 229/245, Tomo 97, Libro segundo de sociedades del Registro público de Carazo, que
                por brevedad en lo sucesivo del presente contrato se le podrá denominar el ACREEDOR; siendo el domicilio: Del
                Instituto Juan XXIII, 20 varas al Oeste,
                en el municipio de San Marcos, Departamento de Carazo, Dirección electrónica: empresociedadanonima@gmail.com; y
                por otra parte el / la señor (a) : {{primer_nombre}}  {{segundo_nombre}}  {{primer_apellido}}  {{segundo_apellidio}} mayor de edad,
                con número de cédula:  {{identificacion}} con domicilio: {{direccion}} , Estado civil: {{estado_civil}} quien habita en
                el
                municipio de: {{municipio}}, Departamento de {{departamento}},
                a quien en sucesivo se le denominará el 'DEUDOR', hemos convenido en celebrar el presente 'CONTRATO DE MUTUO
                GARANTIZADO CON PRENDA COMERCIAL' , el cual se regirá conforme las cláusulas siguientes:
            </p>
            <p style='text-align: justify; font-size:9.5px;'>
                <u>1. PRIMERA (MONTO DE EMPEÑO):</u> El deudor confiesa tener recibido de parte del acreedor, la cantidad de: C$
            {{valoracion_empeño_cordobas}}, ({{valoracion_empeño_cordobas_label}} ) equivalente a moneda de los Estados Unidos
            de América: $
            {{valoracion_empeño_dolares}}, ( {{valoracion_empeño_dolares_label}}), Según el valor de
            la compra del dólar a la fecha de hoy de: {{taza_cambio}} C$
            </p>
            <p style='text-align: justify; font-size:9.5px;'>
                <u>2. SEGUNDA (DESCRIPCION DE LOS BIENES EMPEÑADOS):</u> En garantía del pago a la cantidad debida, el deudor
                constituye a favor del acreedor el siguiente vehículo:
            </p>
            <div style='font-size: 10px;'>
                {{tabla_articulos}}
            </div>
            <p style='text-align: justify; font-size:9.5px;'>
                <u>3. TERCERA (INSPECCIÓN DEL VEHÍCULO):</u> El deudor cede los derechos al acreedor para que este realice una
                inspección del estado físico del VEHÍCULO, la cual quedará evidenciada en los formatos de verificación del
                acreedor, así como en fotografías tomadas en diferentes ángulos. El deudor no debe dejar ninguna pertenencia
                ajena al VEHÍCULO, en caso de dejar alguna pertenencia, el acreedor no se hace responsable por la pérdida de
                estas.
            </p>
            <p style='text-align: justify; font-size:9.5px;'>
                <u>4. CUARTA (RESPONSABILIDAD LIMITADA DEL ACREEDOR):</u> El acreedor no se responsabiliza por deterioros del
                VEHÍCULO empeñado por consecuencias de terremotos, inundaciones, incendios, derrumbes, erupciones, hecho
                antisocial, natural o delictivo que atente contra la integridad física y funcional del VEHÍCULO durante el
                tiempo de almacenamiento en las instalaciones del acreedor, así mismo el acreedor no se responsabiliza por
                desperfectos mecánicos que se presenten por consecuencias de almacenamientos, no obstante el acreedor realizará
                calentamiento de motor 1 vez por semana, el acreedor no se responsabiliza por cualquier accidente que se
                presente durante el traslado del VEHÍCULO hacia el lugar donde quedará almacenado, toda lesiones físicas o
                mortales del conductor o terceros que se vean involucrados, incluyendo los daños físicos a tercero, el único
                responsable será el deudor, quien lo acepta con la firma de este contrato. En caso de que ocurra un accidente
                que este fuera del trayecto de las oficinas hacia la bodega de almacenamiento de VEHÍCULO será asumido por el
                acreedor.
            </p>
            <p style='text-align: justify; font-size:9.5px;'>
                <u>5. QUINTA (PLAZO Y FORMA DE PAGO):</u>El plazo del empeño lo decidirá el deudor, siendo un plazo máximo de 12
                meses. Los pagos se realizarán en cuotas fijas de C$ {{cuotafija}}, según el cambio del córdoba a dólar a la
                fecha de hoy de:
                C$ {{taza_cambio}}, que serán modificables al tipo de cambio del dólar, en la fecha que el cliente haga efectivo
                su pago. Los
                pagos se realizarán en córdobas o el equivalente a $ {{cuotafija_dolares}}, Estadounidenses, Según tasa de
                cambio del Banco Central de
                Nicaragua, iniciando la primera cuota el día y la última el día El deudor se obliga a pagar al acreedor; La mora
                ( en caso de incurrir), el interés neto corriente, demás cargos a pagar en relación con lo pactado y el monto de
                empeño en las oficinas del acreedor, los pagos serán todos en cuotas fijas según tabla de amortización de deuda
                aquí estipulada al final de este contrato. En ningún momento el deudor podrá cancelar el monto total de su monto
                de empeño, sin antes haber pagado mora (en caso de incurrir), interés neto corriente, más los demás cargos a
                pagar en relación con lo pactado. En caso de que sea imposible para el deudor cumplir con su abono pactado, este
                podrá pagar al acreedor la mora, el interés neto corriente y demás cargos a pagar en relación con lo pactado,
                sin realizar abonos a su monto de empeño, pero al cumplirse la fecha de cancelación que se muestra en la tabla
                de amortización de deuda, el monto de empeño otorgado tendrá que pagarse en su totalidad.

            </p>
            <p style='text-align: justify; font-size:9.5px;'>
                <u>6. SEXTA (PAGO ANTICIPADO):</u>En caso de que el deudor realice cancelación anticipada, las partes acuerdan
                que el Deudor reconocerá y pagará únicamente el interés neto y demás cargos en relación con lo pactado,
                devengados al día de la cancelación anticipada. En caso de abonos anticipados, estos se aplicarán al principal
                del monto de empeño, con lo que no variará el plan de pagos del monto en relación con la periodicidad y fechas
                de las cuotas, sino en la proporción del monto de empeño e intereses de cada cuota, además, en dependencia del
                monto del (los) pago (s) anticipado (s) es posible que se reduzca el plazo total del empeño. Si el deudor
                cancela su contrato antes de los primeros treinta días después de haber firmado este contrato, deberá pagar el
                Interés neto corriente y todo lo demás cargos a pagar en relación con lo pactado correspondiente a un mes, al
                cancelar después del primer mes pagará únicamente los recargos sobre los días transcurridos hasta la fecha de su
                cancelación.
            </p>
            <p style='text-align: justify; font-size:9.5px;'>
                <u>7. SÉPTIMA (INTERÉS CORRIENTE Y DEMÁS CARGOS MENSUALES A PAGAR EN RELACIÓN CON LO PACTADO):</u> El monto de
                empeño devengará una tasa de interés corriente inicial del {{interes_inicial_label}} por ciento
                ({{interes_inicial}}%) sobre saldo, la cual será
                verificable mensualmente de acuerdo con la tasa promedio ponderada que emita el Banco Central de Nicaragua. Los
                demás cargos que pagar en relación con lo pactado bajo lo cual EMPRE S. A estipula lo siguiente:
                {{interes_gastos_administrativos_label}} por ciento
                ({{interes_gastos_administrativos}}%)
                de Gastos administrativos, {{interes_gastos_legales_label}} por ciento ({{interes_gastos_legales}}%) de gastos
                legales, {{interes_comisiones_label}} por ciento ({{interes_comisiones}}%) de Comisiones,
                {{interes_mantenimiento_valor_label}} por
                ciento ({{interes_mantenimiento_valor}}%) de mantenimiento al valor de la prenda,
                {{interes_demas_cargos_label}} porciento ({{interes_demas_cargos}}%) de Gestiones crediticias; Todos estos
                demás cargos son aplicados sobre el monto restante.
            </p>
            <p style='text-align: justify; font-size:9.5px;'>
                <u>8. OCTAVA (MORA):</u> En caso de que el Deudor no pague en la fecha de cada cuota mensual, automáticamente
                quedará constituido en mora y por el sólo hecho de incumplimiento, y desde esa fecha hasta el pago efectivo
                de su cuota, reconocerá al acreedor un factor moratorio de aplicado a la cuota fija, equivalente en este
                caso a {{mora}}%, por cada día transcurrido hasta el pago efectivo de su cuota o cancelación.
            </p>
            <p style='text-align: justify; font-size:9.5px;'>
                <u>9. NOVENA (PÉRDIDA DEL VEHÍCULO):</u> El deudor declara compromiso puntual de pago, pero si llegase a 20 días
                en mora el deudor pierde total derecho sobre el VEHÍCULO bajo el común acuerdo de este contrato, sin negación
                alguna, para lo cual el ACREEDOR tendrá el total derecho de poner a la venta el VEHÍCULO descrito en este
                contrato.
            </p>
            <p style='text-align: justify; font-size:9.5px;'>
                <u>10. DECIMA (RE-EMPEÑO):</u> Una vez cancelado el contrato, el VEHÍCULO podrá ser empeñado nuevamente, siempre
                y cuando el seguro este vigente, en caso de no estar vigente el seguro el deudor deberá de presentar un nuevo
                seguro del VEHÍCULO que está bajo empeño.
            </p>
            <p style='text-align: justify; font-size:9.5px;'>
                <u>11. DECIMA PRIMERA (DERECHOS DEL DEUDOR):</u>El Deudor tiene los siguientes derechos de conformidad con la
                Norma
                sobre la transparencia de las operaciones: A. Ser informados de forma clara, completa, oportuna y adecuada
                de los servicios del acreedor y adicionalmente de recibir información fiscal básica: B. Recibir información
                previa antes de la suscripción del contrato: El acreedor le pondrá a disposición al Deudor un contrato, para
                que este tenga en su poder una copia de este. C. Información durante la vigencia de la obligación: A que, de
                previo a la firma del contrato, tiene el derecho de solicitar aclaraciones y que se le entregue la tabla de
                amortización de deuda. D. Atención de El acreedor por medio de sus funcionarios u oficina de atención al
                público: El Deudor tiene el derecho de ser atendido oportuna y diligentemente con un trato adecuado por
                parte del acreedor y que se respete su privacidad siempre y cuando cumpla con las obligaciones aquí
                contraídas. A que se le respondan sus reclamos, quejas y consultas, en los horarios de oficina (lunes a
                viernes de 8:00 am - 4:30 Pm y sábados de 8:30 am - 11:00 Am). E-la información es brindada únicamente al
                deudor.
            </p>
            <p style='text-align: justify; font-size:9.5px;'>
                <u>12. DECIMA SEGUNDA (OBLIGACIONES DEL DEUDOR):</u> El Deudor se obliga expresamente a lo siguiente: A. Debe
                leer
                de previo el contrato y solicitar aclaraciones al acreedor. B. Suministrar al acreedor toda la información
                que éste le solicite sobre el VEHÍCULO. C. Entregar la copia del contrato al momento de la cancelación de
                este, en caso de pérdida del contrato deberá pagar la cantidad de $ 1.00 (un dólar) o su equivalente en
                Córdoba por pérdida de documento. D. el deudor deberá de pagar $11.00 (once dólares) de deducción por
                desembolso.
            </p>
            <p style='text-align: justify; font-size:9.5px;'>
                <u>13. DECIMA TERCERA (ENTREGA DEL VEHÍCULO):</u> Antes de que el deudor cancele su contrato deberá preguntar en
                la
                caja sí el seguro del VEHÍCULO está vigente, en caso de que el seguro este expirado NO se entregará el
                VEHÍCULO hasta que el cliente traiga un nuevo seguro vigente, esto con el fin de evitar inconvenientes
                varios que puedan presentarse al trasladar el VEHÍCULO desde las bodegas de almacenamiento hasta las
                oficinas en donde se entregará. En caso de que el deudor no pueda retirar personalmente el VEHÍCULO una vez
                que este haya sido cancelado, podrá enviar a un tercero quién deberá presentar: su cédula original más
                cedula original del DEUDOR y el contrato privado, de faltar uno de estos tres documentos NO se entregará. En
                la entrega del VEHÍCULO, este no será probado funcionalmente, lo único que se verificará al cliente es su
                estructura física y los accesorios indicados en la descripción y observaciones plasmados en la cláusula dos
                de este contrato.
            </p>
            <p style='text-align: justify; font-size:9.5px;'>
                <u>14. DECIMA CUARTA (RÉGIMEN LEGAL):</u> El presente contrato, y todos los derechos o actos que se deriven o
                sean consecuencia de este, quedan sometidos a la Ley 842 y sus reformas, ley 176, Código Civil, Código de
                Comercio y demás leyes de la República de Nicaragua pertinentes al acto de mutuo.
            </p>
            <p style='text-align: justify; font-size:9.5px;'>
                <u>15. DECIMA QUINTA (ACEPTACIÓN): </u>Los comparecientes declaran expresamente que aceptan el presente contrato
                con los términos relacionados, Y leído el presente contrato por las partes lo encontramos conforme, aprobamos,
                ratificamos y firmamos, en la ciudad de San Marcos a los {{dias}} dias del mes {{mes}} del año {{anio}}.
            </p>
            <br></br>
            <style>
            td {
                border: 1px black solid;
                padding: 5px;
                width: 7.14% !important;
            }

            td.col2 {
                width: 14.28% !important;
            }

            td.col6 {
                width: 42.85% !important;
            }

            td.val {
                text-align: right;
            }
        </style>
        <table style='width: 100%;font-size:9px !important; border-collapse: collapse;'>
            <thead>
                <tr>
                    <td colspan='2' class='col2'><span lang='ES-NI'>CAPITAL PRESTADO C$</span></td>
                    <td colspan='2' class='col2'> <span lang='ES-NI'>C$ {{valoracion_empeño_cordobas}}</span></td>
                    <td colspan='6' class='col6' rowspan='2'>
                    <span lang='ES-NI'>TABLA DE AMORTIZACION DE DEUDA POR GARANTIA PRENDARIA</span>
                    </td>
                    <td colspan='2' class='col2'><span lang='ES-NI'>CUOTA C$</span></td>
                    <td colspan='2' class='col2'> <span lang='ES-NI'>C$ {{cuotafija}}</span></td>
                </tr>
                <tr>
                    <td colspan='2' class='col2'> CAPITAL PRESTADO $</td>
                    <td colspan='2' class='col2'> $ {{valoracion_empeño_dolares}}</td>
                    <td colspan='2' class='col2'><span lang='ES-NI'>CUOTA FIJA<br>$</br></span> </td>
                    <td colspan='2' class='col2'>$ {{cuotafija_dolares}}</td>
                </tr>
                <tr>
                    <td colspan='2' class='col2'>
                    <span lang='ES-NI'>PLAZO PARA CANCELAR: {{plazo}} mes(es)</span>
                    </td>
                    <td colspan='2' class='col2'>
                    <p style='margin-bottom:0cm;text-align:center;line-height:normal'>
                        <span lang='ES-NI'>INTERÉS NETO CORRIENTE(a): 1%</span>
                    </p>
                    </td>
                    <td colspan='2' class='col2'>
                    <span lang='ES-NI'>Demás cargos a
                        pagar en relación con lo pactado (b)</span>
                    </td>
                    <td colspan='2' class='col2'>
                    <span lang='ES-NI'>Interés Neto
                        corriente más demás cargos a
                        pagar en relación con lo pactado</span>
                    </td>
                    <td colspan='2' class='col2'>
                    <span lang='ES-NI'>ABONO AL
                        CAPITAL</span>
                    </td>
                    <td colspan='2' class='col2'>
                    <span lang='ES-NI'>TOTAL A
                        PAGAR</span>
                    </td>
                    <td colspan='2' class='col2'>
                    <span lang='ES-NI'>MONTO
                        RESTANTE</span>
                    </td>
                </tr>
                <tr>
                    <td colspan='2' class='col2'><span lang='ES-NI'>FECHAS DE PAGO</span></td>
                    <td><span lang='ES-NI'>C$</span></td>
                    <td><span lang='ES-NI'>$</span></td>
                    <td><span lang='ES-NI'>C$</span></td>
                    <td><span lang='ES-NI'>$</span></td>
                    <td><span lang='ES-NI'>C$</span></td>
                    <td><span lang='ES-NI'>$</span></td>
                    <td><span lang='ES-NI'>C$</span></td>
                    <td><span lang='ES-NI'>$</span></td>
                    <td><span lang='ES-NI'>C$</span></td>
                    <td><span lang='ES-NI'>$</span></td>
                    <td><span lang='ES-NI'>C$</span></td>
                    <td><span lang='ES-NI'>$</span></td>
                </tr>
            </thead>
            {{tbody_amortizacion}}

        </table>

            <p style='text-align:left; font-size:10px; margin-top:50px; padding-bottom:0px; margin-bottom:0px;'>
                Deudor:{{primer_nombre}}  {{segundo_nombre}}  {{primer_apellido}}  {{segundo_apellidio}}
            </p>
            <p style='text-align:left; font-size:10px; margin-top:0px; padding-bottom:0px; margin-bottom:0px;'>Cédula:
                {{identificacion}}
            </p>
            <p style='text-align:left; font-size:10px; margin-top:0px; padding-bottom:0px; margin-bottom:0px;'>Cel:{{telefono}}
            </p>
        </body>

        </html>
    ";
    public static string ContractEmpeno = @"
        <!DOCTYPE html>
        <html>

        <head>
        </head>

        <body>



        <p style='font-size:9.5px; margin-top:0px; margin-bottom:0px; text-align:center; padding-bottom:0px'>
            EMPEÑOS Y PRÉSTAMOS S.A 'EMPRE SA'
            RUC J0310000300895     
        </p>
        <p style='font-size:9.5px; margin-top:0px; margin-bottom:0px; text-align:center; padding-bottom:0px'>
            “Tu Prosperidad, Es Nuestro Éxito….”      
        </p>

        <p style='font-size: 9.5px; margin-top: 0px; margin-bottom: 0px; text-align: left; float: left; width: 40%'>
            No Contrato:
            {{numero_contrato}}      
        </p>
            <p style='font-size: 9.5px; margin-top: 0px; margin-bottom: 0px; text-align: right; float: right; width: 40%'>
            Carazo - Nicaragua
            {{fecha}}
        </p>

        <p style='font-size:9.5px; margin-top:0px; margin-bottom:0px; text-align:center; padding-bottom:0px'>Oficina Central
            82572062 (Mov); 57199497 (Cl), 25353613 (Planta)</p>
        <p style='font-size:9.5px; margin-top:0px; margin-bottom:0px; text-align:center; padding-bottom:0px'>CONTRATO DE
            MUTUO GARANTIZADO CON PRENDA COMERCIAL</p>



        <p style='text-align: justify; font-size:9.5px; margin-top:20px'>Nosotros: Juan José Villavicencio Navarro, mayor de
            edad, casado, ingeniero Industrial, con cédula Nº 043-240688-0001M, Nicaragüense y de este domicilio de San
            Marcos, actuando en calidad de apoderado generalísimo
            de la sociedad Anónima denominada: ' EMPEÑOS Y PRESTAMOS S.A ' EMPRE S.A, Sociedad que es de este domicilio,
            constituida, autorizada y existente de conformidad a las leyes de la República de Nicaragua, en escritura pública
            #51, Constitución de Sociedad Anónima y estatutos,
            y bajo el asiento #10011, Pág. 229/245, Tomo 97, Libro segundo de sociedades del Registro público de Carazo, que
            por brevedad en lo sucesivo del presente contrato se le podrá denominar el ACREEDOR; siendo el domicilio: Del
            Instituto Juan XXIII, 20 varas al Oeste,
            en el municipio de San Marcos, Departamento de Carazo, Dirección electrónica: empresociedadanonima@gmail.com; y
            por otra parte el / la señor (a) : {{primer_nombre}} {{segundo_nombre}} {{primer_apellido}} {{segundo_apellidio}}
            mayor de edad,
            con número de cédula: {{identificacion}} con domicilio: {{direccion}} , Estado civil: {{estado_civil}} quien
            habita en el
            municipio de: {{municipio}}, Departamento de {{departamento}},
            a quien en sucesivo se le denominará el 'DEUDOR', hemos convenido en celebrar el presente 'CONTRATO DE MUTUO
            GARANTIZADO CON PRENDA COMERCIAL' , el cual se regirá conforme las cláusulas siguientes:
        </p>
        <p style='text-align: justify; font-size:9.5px;'>
            <u>1. PRIMERA (MONTO DE EMPEÑO):</u> El deudor confiesa tener recibido de parte del acreedor, la cantidad de: C$
            {{valoracion_empeño_cordobas}}, ({{valoracion_empeño_cordobas_label}} ) equivalente a moneda de los Estados Unidos
            de América: $
            {{valoracion_empeño_dolares}}, ( {{valoracion_empeño_dolares_label}}), Según el valor de
            la compra del dólar a la fecha de hoy de: {{taza_cambio}} C$
        </p>
        <p style='text-align: justify; font-size:9.5px;'>
            <u>2. SEGUNDA (DESCRIPCION DE LOS BIENES EMPEÑADOS):</u> En garantía del pago a la cantidad debida, el deudor
            constituye a favor del acreedor prenda (s) comercial (es) sobre el/los siguiente (s) bien (es):
        </p>

        <div style='font-size: 10px;;'>
            {{tabla_articulos}}
        </div>

        <p style='text-align: left; font-weight:bold;margin-top:10px;font-size:10px;'>Observaciones:</p>

        <p style='font-size:10px;'>{{observaciones}}</p>

        <p style='text-align: justify; font-size:9.5px;'> <u>3. TERCERA (RESPONSABILIDAD LIMITADA DEL ACREEDOR):</u> El
            acreedor no se responsabiliza por deterioros de los bienes empeñados por consecuencias de terremotos,
            inundaciones, incendios, derrumbes, erupciones, y cualquier otro hecho social, natural o delictivo que atente
            contra la integridad física y funcional
            de los bienes durante el tiempo de almacenamiento en las instalaciones del acreedor. Al momento de empeñar los
            bienes estos serán inspeccionados física y funcionalmente por el personal de atención a clientes, pero al momento
            de cancelación y entrega de los bienes, estos no serán probados funcionalmente,
            lo único que se verificará al deudor es su estructura física y los accesorios indicados en la descripción y
            observaciones plasmados en la cláusula dos de este contrato.
        </p>
        <p style='text-align: justify; font-size:9.5px;'>
            <u>4. CUARTA (PLAZO Y FORMA DE PAGO):</u> El deudor decide en cuantas cuotas mensuales cancela su empeño, siendo
            el plazo máximo de 3 meses para artículos electrónicos, 6 meses
            para artículos no electrónicos y 12 meses para automotores; los pagos se realizarán en cuotas fijas MENSUALES de
            C$ {{cuotafija}}, ( {{cuotafija_label}}), según el cambio del córdoba a dólar a la fecha de hoy de: C$
            {{taza_cambio}}
            que serán modificables al tipo de cambio del dólar, en la fecha que el cliente haga efectivo su pago. Los pagos se
            realizarán en córdobas o el equivalente a $ {{cuotafija_dolares}} , ({{cuotafija_dolares_label}}) Estadounidenses,
            Según tasa de cambio del Banco Central de Nicaragua, iniciando la primera cuota mensual el día y la última cuota
            mensual el día El deudor acepta realizar sus pagos mensuales en las oficinas del acreedor,
            los pagos serán todos en cuotas fijas mensuales a como se muestra en la tabla de amortización de deuda por
            garantía prendaria indicada al final de este contrato. En ningún momento el deudor podrá cancelar el
            monto total de su empeño, sin antes haber pagado mora (en caso de incurrir, hasta un máximo de 20 días en mora),
            interés neto corriente, más los demás cargos a pagar en relación con lo pactado mensuales.
            En caso que sea imposible para el deudor cumplir con su abono pactado, este podrá pagar al acreedor de forma
            mensual, la mora, el interés neto corriente y demás cargos a pagar en relación con lo pactado.
            El deudor no debe presentarse a cancelar hasta la última fecha de pago que se muestra en la tabla de amortización
            al final de este contrato sin antes haber realizado los pagos respetivos mensuales de todas las fechas anteriores
            que se muestran en esta misma tabla;
            porque de no realizar pagos mensuales e incurrir en 21 días mora su artículo estará en liquidación.
        </p>
        <p style='text-align: justify; font-size:9.5px;'>
            <u>5. QUINTA (INTERES CORRIENTE Y DEMÁS CARGOS MENSUALES A PAGAR EN RELACION CON LO PACTADO):</u> El monto de
            empeño devengará una tasa de interés corriente inicial del {{interes_inicial_label}} por ciento
            ({{interes_inicial}}%) sobre saldo, la cual será
            verificable mensualmente de acuerdo con la tasa promedio ponderada que emita el Banco Central de Nicaragua. Los
            demás cargos que pagar en relación con lo pactado bajo lo cual EMPRE S. A estipula lo siguiente:
            {{interes_gastos_administrativos_label}} por ciento
            ({{interes_gastos_administrativos}}%)
            de Gastos administrativos, {{interes_gastos_legales_label}} por ciento ({{interes_gastos_legales}}%) de gastos
            legales, {{interes_comisiones_label}} por ciento ({{interes_comisiones}}%) de Comisiones,
            {{interes_mantenimiento_valor_label}} por
            ciento ({{interes_mantenimiento_valor}}%) de mantenimiento al valor de la prenda,
            {{interes_demas_cargos_label}} porciento ({{interes_demas_cargos}}%) de Gestiones crediticias; Todos estos
            demás cargos son aplicados sobre el monto restante.
        </p>
        <p style='text-align: justify; font-size:9.5px;'>
            <u>6. SEXTA ( MORA):</u> El deudor podrá realizar el pago de su cuota anticipada a su fecha de pago, con el fin de
            evitarse mora; En caso que el Deudor no pague en la fecha de cada cuota mensual,
            automáticamente quedará constituido en mora y por el sólo hecho de incumplimiento, y desde esa fecha hasta el pago
            efectivo de su cuota, reconocerá al acreedor un factor mora de aplicado a la cuota fija,
            equivalente a {{mora}}%, por cada día transcurrido en mora hasta el pago efectivo de su cuota.
        </p>
        <p style='text-align: justify; font-size:9.5px;'> <u> 7. SEPTIMA (PÉRDIDA DE LA(S) GARANTIA(S)):</u> El deudor debe
            realizar sus pagos mensuales, pero si llegase a 21 días en mora el deudor pierde total derecho sobre la (s)
            garantía (s) descrita(s) bajo el común acuerdo de este contrato, para lo cual el ACREEDOR tendrá el total derecho
            de poner a la venta la(s) garantía(s), no obstante el mismo
            deudor podrá recuperar sus bienes mediante la compra de los mismos a través de una factura de compra al contado o
            de sistema de apartado, siempre y cuando el/los bien(es) aún esté (n) en el inventario de venta del ACREEDOR.
        </p>
        <p style='text-align: justify; font-size:9.5px;'>
            8. OCTAVA (PAGO ANTICIPADO): En caso que el deudor realice cancelación anticipada, las partes acuerdan que el
            Deudor reconocerá y pagará únicamente el interés neto más demás cargos en relación con lo pactado devengados al
            día de la cancelación anticipada.
            En caso de abonos anticipados, estos se aplicarán al principal del monto de empeño, con lo que no variará el plan
            de pagos del monto en relación a la periodicidad y fechas de las cuotas, sino en la proporción del monto de empeño
            e intereses de cada cuota, además,
            en dependencia del monto del (los) pago (s) anticipado (s) es posible que se reduzca el plazo total del empeño. Si
            el deudor cancela su contrato antes de los primeros treinta días después de haber firmado este contrato, deberá
            pagar el Interés neto corriente y todo lo demás cargos a pagar en relación con lo pactado correspondiente a un
            mes,
            al cancelar después del primer mes, pagará únicamente los recargos sobre los días transcurridos hasta la fecha de
            su cancelación.
        </p>
        <p style='text-align: justify; font-size:9.5px;'>
            <u>9. DECIMA (REEMPEÑO):</u> Una vez cancelado el contrato, los bienes podrán ser empeñados nuevamente después de
            24 horas, aplica para artículos electrónicos o que se demuestre que el tiempo puede impactar en su rendimiento y
            funcionamiento.
            En caso que el/los bien (es) haya(n) sido empeñado en un menor plazo del permitido (3meses), se podrá re empeñar
            inmediatamente sin necesidad de sacarse del almacenamiento para validación funcional, el nuevo plazo en el
            contrato de re empeño quedara definido Por la diferencia del plazo máximo permitido y el plazo del contrato
            anterior.
        </p>
        <p style='text-align: justify; font-size:9.5px;'>
            <u>10. DECIMA PRIMERA (DERECHOS DEL DEUDOR):</u> El Deudor tiene los siguientes derechos de conformidad con la
            Norma sobre la transparencia de las operaciones: A. A ser informados de forma clara, completa,
            oportuna y adecuada de los servicios del acreedor y adicionalmente de recibir información fiscal básica: B.
            Recibir información previa antes de la suscripción del contrato: El acreedor le pondrá a disposición el contrato,
            para que este tenga en su poder una copia del mismo. C. Información durante la vigencia de la obligación: A que de
            previo a la firma del contrato, tiene el derecho de solicitar aclaraciones sobre el contrato y cada una de sus
            cláusulas.
            D. Atención de El acreedor por medio de sus funcionarios u oficina de atención al público: El Deudor tiene el
            derecho de ser atendido oportuna y diligentemente con un trato adecuado por parte del acreedor y que se respete su
            privacidad siempre y cuando cumpla con las obligaciones aquí contraídas.
            A que se le respondan sus reclamos, quejas y consultas, en los horarios de oficina (Lunes a viernes de 8:00 am -
            4:30 Pm y Sábados de 8:30 am - 11:00 Am). E .la información es brindada únicamente al deudor.
        </p>
        <p style='text-align: justify; font-size:9.5px;'>
            <u>11. DECIMA SEGUNDA (OBLIGACIONES DEL DEUDOR):</u> El Deudor se obliga expresamente a lo siguiente: A. Debe leer
            de previo el contrato y solicitar aclaraciones al acreedor. B. A suministrar al acreedor toda la información que
            éste le solicite sobre la garantía descrita en este contrato.
            C. A entregar la copia del contrato al momento de la cancelación del mismo, en caso de pérdida debe de pagar la
            cantidad de $ 1.00 (Un dólar) o su equivalente en córdobas por pérdida de documento.
            D. En caso de que el/los bien (es) no pueda (n) ser retirados por el DEUDOR, este podrá enviar a un tercero quién
            deberá presentar: su cédula original más cedula original del DEUDOR y el contrato privado, de faltar uno de estos
            tres documentos NO se entregarán el/los bien (es) empeñados a terceras personas.
            E. El deudor se obliga a pagar la cantidad de $ 1.00 (Un dólar) o su equivalente en córdobas por reestructuración
            de este contrato.
        </p>
        <p style='text-align: justify; font-size:9.5px;'>
            12. DECIMA TERCERA (REGIMEN LEGAL): El presente contrato, y todos los derechos o actos que se deriven o sean
            consecuencia del mismo, quedan sometidos a la Ley 842, ley 176, ley 146, Código Civil, Código de Comercio y demás
            leyes de la República de Nicaragua.
        </p>
        <p style='text-align: justify; font-size:9.5px;'>
            <u>13. DECIMA CUARTA (ACEPACCIÓN):</u> Los comparecientes declaran expresamente que aceptan el presente contrato
            con los términos relacionados, Y leído el presente contrato por las partes lo encontramos conforme, aprobamos,
            ratificamos y firmamos, en la ciudad de San Marcos a los {{dias}} dias del mes {{mes}} del año {{anio}}.
        </p><br></br>
        <style>
            td {
                border: 1px black solid;
                padding: 5px;
                width: 7.14% !important;
            }

            td.col2 {
                width: 14.28% !important;
            }

            td.col6 {
                width: 42.85% !important;
            }

            td.val {
                text-align: right;
            }
        </style>
        <table style='width: 100%;font-size:9px !important; border-collapse: collapse;'>
            <thead>
                <tr>
                    <td colspan='2' class='col2'><span lang='ES-NI'>CAPITAL PRESTADO C$</span></td>
                    <td colspan='2' class='col2'> <span lang='ES-NI'>C$ {{valoracion_empeño_cordobas}}</span></td>
                    <td colspan='6' class='col6' rowspan='2'>
                    <span lang='ES-NI'>TABLA DE AMORTIZACION DE DEUDA POR GARANTIA PRENDARIA</span>
                    </td>
                    <td colspan='2' class='col2'><span lang='ES-NI'>CUOTA C$</span></td>
                    <td colspan='2' class='col2'> <span lang='ES-NI'>C$ {{cuotafija}}</span></td>
                </tr>
                <tr>
                    <td colspan='2' class='col2'> CAPITAL PRESTADO $</td>
                    <td colspan='2' class='col2'> $ {{valoracion_empeño_dolares}}</td>
                    <td colspan='2' class='col2'><span lang='ES-NI'>CUOTA FIJA<br>$</br></span> </td>
                    <td colspan='2' class='col2'>$ {{cuotafija_dolares}}</td>
                </tr>
                <tr>
                    <td colspan='2' class='col2'>
                    <span lang='ES-NI'>PLAZO PARA CANCELAR: {{plazo}} mes(es)</span>
                    </td>
                    <td colspan='2' class='col2'>
                    <p style='margin-bottom:0cm;text-align:center;line-height:normal'>
                        <span lang='ES-NI'>INTERÉS NETO CORRIENTE(a): 1%</span>
                    </p>
                    </td>
                    <td colspan='2' class='col2'>
                    <span lang='ES-NI'>Demás cargos a
                        pagar en relación con lo pactado (b)</span>
                    </td>
                    <td colspan='2' class='col2'>
                    <span lang='ES-NI'>Interés Neto
                        corriente más demás cargos a
                        pagar en relación con lo pactado</span>
                    </td>
                    <td colspan='2' class='col2'>
                    <span lang='ES-NI'>ABONO AL
                        CAPITAL</span>
                    </td>
                    <td colspan='2' class='col2'>
                    <span lang='ES-NI'>TOTAL A
                        PAGAR</span>
                    </td>
                    <td colspan='2' class='col2'>
                    <span lang='ES-NI'>MONTO
                        RESTANTE</span>
                    </td>
                </tr>
                <tr>
                    <td colspan='2' class='col2'><span lang='ES-NI'>FECHAS DE PAGO</span></td>
                    <td><span lang='ES-NI'>C$</span></td>
                    <td><span lang='ES-NI'>$</span></td>
                    <td><span lang='ES-NI'>C$</span></td>
                    <td><span lang='ES-NI'>$</span></td>
                    <td><span lang='ES-NI'>C$</span></td>
                    <td><span lang='ES-NI'>$</span></td>
                    <td><span lang='ES-NI'>C$</span></td>
                    <td><span lang='ES-NI'>$</span></td>
                    <td><span lang='ES-NI'>C$</span></td>
                    <td><span lang='ES-NI'>$</span></td>
                    <td><span lang='ES-NI'>C$</span></td>
                    <td><span lang='ES-NI'>$</span></td>
                </tr>
            </thead>
            {{tbody_amortizacion}}

        </table>

        <p style='text-align:left; font-size:10px; margin-top:50px; padding-bottom:0px; margin-bottom:0px;'>
            Deudor: {{primer_nombre}} {{segundo_nombre}} {{primer_apellido}} {{segundo_apellidio}}
        </p>
        <p style='text-align:left; font-size:10px; margin-top:0px; padding-bottom:0px; margin-bottom:0px;'>Cédula:
            {{identificacion}}
        </p>
        <p style='text-align:left; font-size:10px; margin-top:0px; padding-bottom:0px; margin-bottom:0px;'>Cel:{{telefono}}
        </p>

        </body>

        </html>

    ";

}