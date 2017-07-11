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

	$('.section-plans__btn').hover(
		function(){
			$(this).parent('.section-plans__item').children('.section-plans__name').addClass('section-plans__name-hover');
		},
		function(){
			$(this).parent('.section-plans__item').children('.section-plans__name').removeClass('section-plans__name-hover');
		});


	$(window).scroll(function(){
		var menu = $('.header'),
		menuScrollClass = 'h-scroll',
		headerHeight = menu.outerHeight();

		menu.css('top','-' + headerHeight + 'px');
		if ($(this).scrollTop() > headerHeight) {
			menu.addClass(menuScrollClass).css('top', '0');
			$('body').css('margin-top', headerHeight + 'px');
		} else {
			menu.removeClass(menuScrollClass).css('top','-' + headerHeight + 'px');
			$('body').css('margin-top', '0');
		};
	});



	$(".nav__ul").on("click","a", function (event) {
		event.preventDefault();
		var id  = $(this).attr('href'),
		headerHeight = $('.header').outerHeight();


		if ($(id).length){
			var anchor = $(id).offset().top - headerHeight;
  			$('body, html').animate({scrollTop: anchor}, 600);
		// $('.nav__ul').removeClass('mobile-menu_active');

		} else { alert('Такой секции нет на странице!'); }


	});

});