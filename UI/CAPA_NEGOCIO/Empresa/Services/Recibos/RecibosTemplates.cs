namespace CAPA_NEGOCIO.Services;
public class RecibosTemplates
{

	public static string recibo = @"
		<!DOCTYPE html>
		<html>
		<head>
			<title>Recibo</title>
			<style>
				body{
					font-size: 10px;            
					width: 298.5px;             
				}
				.w-100{
					width: 100%;
				}
				.w-50{
					display: flex;
					justify-content: space-between;
				}
				.w-50 p {
					width: 48%; 
					box-sizing: border-box; 
				}        
				.text-center,.content-center{
					text-align: center;
				}
				.f-10{
					font-size: 10px;
				}
				p{
					margin-bottom: 0px; 
					margin-top: 5px;   
				}
				.img-container{
					display: flex;
					justify-content: center;
					margin-bottom: 20px; 
				}
			</style>
		</head>
		<body>
			<img class='img-container' style='margin:auto' src='{{logo}}' width='100'>
            <br/>
			<p class='text-center'>EMPEÑOS Y PRESTAMOS SOCIEDAD ANONIMA.</p>
			<div class='content-center f-10'>
				<p>RUC J0310000300895</p>
				<p>ASFC 06/0003/10/2020/1</p>
				<p>San Marcos-8257-2062 (Tigo)-5719-9497 (Claro)-2535-3613(Linea Fija)</p>
			</div>
			<p class='content-center'>RECIBO OFICIAL DE CAJA</p>

			<div class='w-50'  style='margin-top: 30px;'>
				<p class='w-50'><strong>Recibo Num:</strong> {{recibo_num}}</p>
			
				<p class='w-50'><strong>Cambio de C$ A $:</strong> {{cambio}}</p>
			</div>

			<p class='w-100'><strong>Fecha:</strong> {{fecha}}</p>
			<p><strong>Sucursal:</strong> {{sucursal}}</p>
			<p><strong>Cajero:</strong> {{cajero}}</p>

			<p style='margin-top: 20px;'><strong>Generales del Contrato</strong></p>
			<p><strong>Cliente:</strong> {{cliente}}</p>

			<div class='w-50' >
				<p class='w-50'><strong>Clasificacion:</strong> {{clasificacion}}</p>    
				<p class='w-50'><strong>Categoria:</strong> {{categoria}}</p>
			</div>

			<div class='w-50 ' >
				<p class='w-50 '><strong>Cuotas Pactadas:</strong> {{cuotas}}</p>    
				<p class='w-50 '><strong>Cuotas Pendientes:</strong> {{cuotas_pendientes}}</p>
			</div>

			<div class='w-50 ' >
				<p class='w-50 '><strong>Saldo Anterior:</strong> C$ {{saldo_anterior}}</p>    
				<p class='w-50 '><strong>Saldo Actual:</strong> $ {{saldo_actual}}</p>
			</div>


			<div>
				<p style='margin-top: 20px;'><strong>Detalles de su Pago</strong></p>
			</div>

			<div class='w-50 ' >
				<p class='w-50 '><strong>Total Pagado:</strong>C$ {{total_pagado}}</p>    
				<p class='w-50 '><strong>Total Pagado:</strong>$ {{total_pagado_dolares}}</p>
			</div>
			
			<div class='w-50 ' >
				<p class='w-50 '><strong>Reestructuracion:</strong> C$ {{reestructuracion}}</p>    
				<p class='w-50 '><strong>Reestructuracion:</strong> $ {{reestructuracion_dolares}}</p>
			</div>

			<div class='w-50 ' >
				<p class='w-50 '><strong>Perdida Doc.:</strong> C$ {{perdida_doc}}</p>
				<p class='w-50 '><strong>Perdida Doc.:</strong> $ {{perdida_doc_dolares}}</p>
			</div>

			<div class='w-50 ' >
				<p class='w-50 '><strong>Mora:</strong> C$ {{mora}}</p>
				<p class='w-50 '><strong>Mora:</strong> $ {{mora_dolares}}</p>
			</div>

			<div class='w-50 ' >
				<p class='w-50 '><strong>IDCP:</strong> C$ {{idcp}}</p>
				<p class='w-50 '><strong>IDCP:</strong> $ {{idcp_dolares}}</p>
			</div>

			<div class='w-50 ' >
				<p class='w-50 '><strong>Abono a Capital:</strong> C$ {{abono_capital}}</p>
				<p class='w-50 '><strong>Abono a Capital:</strong> $ {{abono_capital_dolares}}</p>
			</div>
			
			<div class='w-50 ' >
				<p class='w-50 '><strong>Saldo Actual:</strong> C$ {{saldo_actual_cordobas}}</p>
				<p class='w-50 '><strong>Saldo Actual:</strong> $ {{saldo_actual_dolares}}</p>
			</div>        
			
			<br><br>
			<p><strong>Próximo Pago:</strong>  {{proximo_pago}}</p>


			<p class='text-center' style='margin-top: 50px;'>Recibí Conforme</p>
			<br><br>
			<P class='text-center'>HAGA SUS PAGOS PUNTUALES Y EVITESE ACCIONES ADMINISTRATIVAS Y PERJUDICABLES</P>
		</body>
		</html>

	";

}