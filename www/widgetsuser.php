<?php

header('Content-Type: text/html; charset=UTF-8');

require_once 'php/functions/generic.php';
$db = open_db_session();
if(!isset($_SESSION['user'])){
	exit;
}


insert_nocache_headers();

?>
<!doctype html>
<html>
<head>
	<title>Widgets used by the user</title>
	<style>
		form {
			display: inline;
		}
	</style>
</head>
<body>

Add and remove widgets for the user.<br/>

In use:<br/>
<?php
$widgets_usuario = $db->get_widgets_user();

foreach($widgets_usuario as &$widget){
	echo $widget['name'].' (<form method="POST" action="ipa.php">
			<input type="hidden" name="switch" value="1">
			<input type="hidden" name="action" value="1">
			<input type="hidden" name="widgetID" value="'.$widget['ID'].'">
			<input type="hidden" name="token" value="'.hash_ipa($_SESSION['user']['RND'], $widget['ID'], PASSWORD_TOKEN_IPA).'">
			<input type="hidden" name="goback" value="1">
			<input type="submit" value="Remove">
		</form>)
		<form method="GET" action="widgetsuserversion.php">
			<input type="hidden" name="widgetID" value="'.$widget['ID'].'">
			<input type="submit" value="Select a version">
		</form>';
	if($widget['autoupdate'] === '0'){
		echo '<form method="POST" action="ipa.php">
			<input type="hidden" name="switch" value="1">
			<input type="hidden" name="action" value="4">
			<input type="hidden" name="widgetID" value="'.$widget['ID'].'">
			<input type="hidden" name="token" value="'.hash_ipa($_SESSION['user']['RND'], $widget['ID'], PASSWORD_TOKEN_IPA).'">
			<input type="hidden" name="goback" value="1">
			<input type="submit" value="Use always the latest public version (If there is not a public version, use the last private version)">
		</form> (using the version ' . $widget['version'] . ')';
	}
	else{
		echo '(using the latest version)';
	}
	
	
	echo '<br/>';
}
?>

<br/><br/>
Available widgets:<br/>
<?php
$widgets_disponibles = $db->get_availabe_widgets_user();

if($widgets_disponibles){
	foreach($widgets_disponibles as &$widget){
		$widget_en_uso = false;
		foreach($widgets_usuario as &$widget_uso){
			if($widget['ID'] === $widget_uso['ID']){
				$widget_en_uso = true;
				break;
			}
		}
		if($widget_en_uso){
			echo $widget['name'].' (in use).<br/>';
		}
		else{
			echo $widget['name'].' (<form method="POST" action="ipa.php">
					<input type="hidden" name="switch" value="1">
					<input type="hidden" name="action" value="2">
					<input type="hidden" name="widgetID" value="'.$widget['ID'].'">
					<input type="hidden" name="token" value="'.hash_ipa($_SESSION['user']['RND'], $widget['ID'], PASSWORD_TOKEN_IPA).'">
					<input type="hidden" name="goback" value="1">
					<input type="submit" value="Use">
				</form>)<br/>';
		}
	}
}
?>

</body>
</html>