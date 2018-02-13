{
	String.prototype.transformaCaracteresEspeciales = function() {
		return unescape(
			escape(this).
			replace(/%0A/g, '<br/>').
			replace(/%3C/g, '&lt;').
			replace(/%3E/g, '&gt;')
		);
	}
	$(document).ready(function() {
		let $contenidos = $('#contenidos');
		let $estados = $('#estados');
		let $cabeceras = $('#cabeceras');
		let $codigo = $('#codigo');
		let estadosPosibles = ['No inicializado', 'Cargando', 'Cargado', 'Interactivo', 'Completado'];
		let tiempoInicial;
		let milisegundos;
		let tiempoFinal
		let mensaje="";
		let $recurso = $(document.forms[0].elements[0]);
		$recurso.val(location.href);
		/*BOTON PARA MOSTRAR*/
		$(document.forms[0].elements[1]).on('click',function(){
			$urlAconsultar=$recurso.val();
			$contenidos.html('');
			$estados.html('');
			tiempoInicial = new Date();
			/*PETICION AJAX*/
			let $xhr=$.ajax({
				url:$urlAconsultar,
				/*ANTES*/
				beforeSend:function(xhr){
					$(document).on('onreadystatechange',readyStateChanged(xhr));
				},
				/*COMPLETO*/
				complete: function(xhr){
					$contenidos.on('onreadystatechange',readyStateChanged(xhr));
					if(xhr.readyState == 4){
						if(xhr.status == 200) {
							$contenidos.html(xhr.responseText.transformaCaracteresEspeciales());
							$cabeceras.html(xhr.getAllResponseHeaders().transformaCaracteresEspeciales());
							$codigo.html(xhr.status + " = " + xhr.statusText);
						};
					}
				},
				
			});
			/*CARGANDO*/
			$(document).on('onreadystatechange',readyStateChanged($xhr));

		});

		let readyStateChanged = function(xhr){
			tiempoFinal = new Date();
			milisegundos = tiempoFinal - tiempoInicial;
			$estados.html($estados.html()+" "+milisegundos + " ms " + estadosPosibles[xhr.readyState] + "<br/>");
		}
	});
}