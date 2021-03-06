<?php

require_once __DIR__.'/php/defaults.php';

require_once __DIR__.'/php/functions/generic.php';
$db = open_db_session();
if(!G::$SESSION->exists()){
	exit;
}

insert_nocache_headers();

if(!isset($_GET['widgetID']) || !isInteger($_GET['widgetID']) || $_GET['widgetID'] < 0){
	exit;
}
$widgetID = &$_GET['widgetID'];


$widget = $db->get_widget_by_ID($widgetID);
$versiones = $db->get_all_widget_versions($widgetID);

?>
<!doctype html>
<html>
<head>
	<title>Edit widget</title>
	<!--<link rel="stylesheet" href="css/reset.min.css"/>-->
	<style>
		form {
			display: inline;
		}
	</style>
</head>
<body>

Edit the widget <b><?php echo $widget['name'];?></b> managing its versiones<br/>
You can't delete or modify public versions but it can be hidden. Anyone with the widget will continue having it but it will no be disponible for new users.<br/>

¿Posibilidad de renombrar?<br/><br/>


<form method="POST" action="ipa.php">
	<input type="hidden" name="switch" value="3">
	<input type="hidden" name="action" value="1">
	<input type="hidden" name="widgetID" value="<?php echo $widgetID?>">
	<input type="hidden" name="token" value="<?php echo hash_ipa(G::$SESSION->get_user_random(), $widgetID, PASSWORD_TOKEN_IPA)?>">
	<input type="hidden" name="goback" value="1">
	<input type="submit" value="Create new version">
</form><br/>
<?php

if(count($versiones) > 0){
	foreach($versiones as $version){
		echo '['.$version['version'].']',$version['public']?($version['visible']?'+ ':'- '):' ';
		
		?>
		<form method="POST" action="ipa.php">
			<input type="hidden" name="switch" value="5">
			<input type="hidden" name="action" value="6">
			<input type="hidden" name="widgetID" value="<?php echo $widgetID?>">
			<input type="hidden" name="widgetVersion" value="<?php echo $version['version']?>">
			<input type="hidden" name="token" value="<?php echo hash_ipa(G::$SESSION->get_user_random(), $widgetID, PASSWORD_TOKEN_IPA)?>">
			<input type="text" name="comment" value="<?php echo $version['comment']?>">
			<input type="submit" value="Comment" maxlength="<?php echo WIDGET_VERSION_COMMENT_MAX_LENGTH?>">
			<input type="hidden" name="goback" value="1">
		</form>
		<?php
		if($version['public'] === '1'){
			if($widget['published'] !== $version['version']){
			?>
			<form method="POST" action="ipa.php">
				<input type="hidden" name="switch" value="5">
				<input type="hidden" name="action" value="1">
				<input type="hidden" name="widgetID" value="<?php echo $widgetID?>">
				<input type="hidden" name="widgetVersion" value="<?php echo $version['version']?>">
				<input type="hidden" name="token" value="<?php echo hash_ipa(G::$SESSION->get_user_random(), $widgetID, PASSWORD_TOKEN_IPA)?>">
				<input type="hidden" name="goback" value="1">
				<input type="submit" value="As default version">
			</form>
			<?php } ?>
			<form method="POST" action="ipa.php">
				<input type="hidden" name="switch" value="5">
				<input type="hidden" name="action" value="<?php echo $version['visible']?2:3?>">
				<input type="hidden" name="widgetID" value="<?php echo $widgetID?>">
				<input type="hidden" name="widgetVersion" value="<?php echo $version['version']?>">
				<input type="hidden" name="token" value="<?php echo hash_ipa(G::$SESSION->get_user_random(), $widgetID, PASSWORD_TOKEN_IPA)?>">
				<input type="hidden" name="goback" value="1">
				<input type="submit" value="<?php echo $version['visible']?'Hide from the public':'Show to the public'?>">
			</form>
			<?php
		}
		else{
			?>
			<form method="GET" action="widgeteditversion.php">
				<input type="hidden" name="widgetID" value="<?php echo $widgetID?>">
				<input type="hidden" name="widgetVersion" value="<?php echo $version['version']?>">
				<input type="submit" value="Edit">
			</form>
			<form method="POST" action="ipa.php">
				<input type="hidden" name="switch" value="3">
				<input type="hidden" name="action" value="2">
				<input type="hidden" name="widgetID" value="<?php echo $widgetID?>">
				<input type="hidden" name="widgetVersion" value="<?php echo $version['version']?>">
				<input type="hidden" name="token" value="<?php echo hash_ipa(G::$SESSION->get_user_random(), $widgetID, PASSWORD_TOKEN_IPA)?>">
				<input type="hidden" name="goback" value="1">
				<input type="submit" value="Delete">
			</form>
			<form method="POST" action="ipa.php">
				<input type="hidden" name="switch" value="5">
				<input type="hidden" name="action" value="4">
				<input type="hidden" name="widgetID" value="<?php echo $widgetID?>">
				<input type="hidden" name="widgetVersion" value="<?php echo $version['version']?>">
				<input type="hidden" name="token" value="<?php echo hash_ipa(G::$SESSION->get_user_random(), $widgetID, PASSWORD_TOKEN_IPA)?>">
				<input type="hidden" name="goback" value="1">
				<input type="submit" value="Publicate">
			</form>
			<?php
		}
		
		if($widget['published'] === $version['version']){
			echo 'Default version';
		}
		
		echo '<br/>';
	}
}
else{
	echo 'This widget hasn\'t versions.';
}

?>

</body>
</html>