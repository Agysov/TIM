$(document).ready(function(){

	$('.section-banner__slider').slick({
		dots: false,
		responsive: [{
			breakpoint: 769,
			settings: {
				arrows: false,
				dots:true
			}
		}]
	});

	/////////

	/*$('.header').removeClass('h-scroll');
	$(window).scroll(function(){
		if ($(this).scrollTop() > 100) {
			$('.header').addClass('h-scroll').fadeIn('fast');
			$('.wrapper').css('margin-top', '100px');
		} else {
			$('.header').removeClass('h-scroll').fadeIn('fast');
			$('.wrapper').css('margin-top', '0');
		};
	});*/

	////////

});