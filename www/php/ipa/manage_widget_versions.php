<?php

if(!isset($_POST['widgetID']) || !isset($_POST['accion']) || !isset($_POST['token'])){
	exit;
}

session_start();
if(!isset($_SESSION['user'])){
	exit;
}


require_once __DIR__.'/../config.php';
require_once __DIR__.'/../functions/generic.php';
require_once __DIR__.'/../class/DB.php';

$db = new DB();


// Esta api debe de llamarse solo por mi, no debe de funcionar llamándose desde algo que no sea la configuración de la web.
// Para controlar que no se haga nada raro se enviará un token y se bloqueará por referer.
// EL referer debe de ser la página de la que se puede configurar el valor en cuestión (Manejar mediante un array)
// El token se genera mediante un md5 de la variable que se va a cambiar, una contraseña y una variable que parta de la id del usuario (rnd).

/*
Acciones:
1 => marcar la versión como default
2 => Hacer versión pública oculta
3 => Hacer versión pública visible
4 => Publicar versión
5 => ocultar todas las versiones
*/

// Por continuar. Comprobar referer y de coincidir, recoger datos, comprobar hash y de coincidir de nuevo, cambiar datos.
// hash_ipa($_SESSION['user']['RND'], $widgetID, PASSWORD_TOKEN_IPA);

// Comprobar referer

$posibles_referers = array(
	'widgetedit.php',
	'widgetlist.php'
);

foreach($posibles_referers as $referer_temp){
	foreach(array('http', 'https') as $protocolo){
		if(strpos($_SERVER['HTTP_REFERER'], $protocolo.'://'.WEB_PATH.$referer_temp) === 0){
			// Referer válido
			
			// Comprobar id
			if(isset($_POST['widgetID']) && isInteger($_POST['widgetID']) && $_POST['widgetID'] >= 0){
				// Comprobar token
				if($_POST['token'] === hash_ipa($_SESSION['user']['RND'], $_POST['widgetID'], PASSWORD_TOKEN_IPA)){
					if($_POST['accion'] === '5'){
						$db->hide_all_widget_versions($_POST['widgetID']);
					}
					else if(isset($_POST['widgetVersion']) && isInteger($_POST['widgetVersion']) && $_POST['widgetVersion'] >= 0){
						switch($_POST['accion']){
							case '1':
								$db->set_widget_default_version($_POST['widgetID'], $_POST['widgetVersion']);
							break;
							case '2':
								$db->set_widget_version_visibility($_POST['widgetID'], $_POST['widgetVersion'], false);
							break;
							case '3':
								$db->set_widget_version_visibility($_POST['widgetID'], $_POST['widgetVersion'], true);
							break;
							case '4':
								// If the version as a file called "main.js" it can be made public
								if($db->can_publicate_widget_version_check($_POST['widgetID'], $_POST['widgetVersion'])){
									$db->publicate_widget_version($_POST['widgetID'], $_POST['widgetVersion']);
								}
							break;
							case '6':
								if(isset($_POST['comment'])){
									$db->set_widget_comment($_POST['widgetID'], $_POST['widgetVersion'], $_POST['comment']);
								}
							break;
						}
					}
				}
			}
			break 2;
		}
	}
}