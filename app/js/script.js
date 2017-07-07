$(document).ready(function(){

	$('.section-banner__slider').slick({
		dots: false,
		responsive: [{
			breakpoint: 481,
			settings: {
				arrows: false,
				dots:true
			}
		}]
	});

});