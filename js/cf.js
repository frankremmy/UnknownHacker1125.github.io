$(function() {
 	$('#coin').on('click', function(){
 		$('#coin p').empty();
 		$('#coin').addClass('animation');
		setTimeout(function(){
			$('#coin').removeClass('animation');
			//$('#coin').html('heads');
			var randomNum = Math.random();
			if (randomNum > 0.5) {
				$('#coin p').html('<img src="static/CTIcon.png">');
			} else {
				$('#coin p').html('<img src="static/TIcon.png">');
			}
		}, 5000);
	});
});
$('#coin p').html('');

