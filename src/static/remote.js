$(function() {
    $("#play").click(function() {
	$.ajax({
	    url: "/play"
	}).done(function() {
	    console.log( "play!" );
	});
    });
});