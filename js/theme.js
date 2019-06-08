(function ($) {
	'use strict';

	var nav_offset_top = $('header').height() + 50;
	/*-------------------------------------------------------------------------------
	  Navbar
	-------------------------------------------------------------------------------*/

	//* Navbar Fixed
	function navbarFixed() {
		if ($('.header_area').length) {
			$(window).scroll(function () {
				var scroll = $(window).scrollTop();
				if (scroll >= nav_offset_top) {
					$('.header_area').addClass('navbar_fixed');
				} else {
					$('.header_area').removeClass('navbar_fixed');
				}
			});
		}
	}
	navbarFixed();

	// $('select').niceSelect();
	/* ---------------------------------------------
            Isotope js Starts
         --------------------------------------------- */
	$(window).on('load', function () {
		$('.portfolio-filter ul li').on('click', function () {
			$('.portfolio-filter ul li').removeClass('active');
			$(this).addClass('active');

			var data = $(this).attr('data-filter');
			$workGrid.isotope({
				filter: data
			});
		});

		if (document.getElementById('portfolio')) {
			var $workGrid = $('.portfolio-grid').isotope({
				itemSelector: '.all',
				percentPosition: true,
				masonry: {
					columnWidth: '.grid-sizer'
				}
			});
		}
	});

	/*----------------------------------------------------*/
	/* Start Magnific Pop Up
	/*----------------------------------------------------*/
	if ($('.img-gal').length > 0) {
		$('.img-gal').magnificPopup({
			type: 'image',

			callbacks: {
				elementParse: function(item){
					item.src = item.el.attr('src');
				}
			}
		});
	}
	/*----------------------------------------------------*/
	/*  End  Magnific Pop Up
	/*----------------------------------------------------*/

	/*----------------------------------------------------*/
    /* counter js
    /*----------------------------------------------------*/
    // if(document.getElementById("features_counter")){
    //     $('.counter').counterUp({
    //         delay: 10,
    //         time: 1000
    //     });
    // }

	/*----------------------------------------------------*/
	/*  Testimonials Slider
    /*----------------------------------------------------*/
	if ($('.testimonial-slider').length) {
		$('.testimonial-slider').owlCarousel({
			loop: true,
			margin: 30,
			nav: true,
			items: 1,
			autoplay: true,
			smartSpeed: 2500,
			dots: true,
			navText : ["<i class='fa fa-chevron-left'></i>","<i class='fa fa-chevron-right'></i>"]
		});
	}

	/*-------------------------------------------------------------------------------
    Brand Slider
	-------------------------------------------------------------------------------*/
	$(".brand-carousel").owlCarousel({
		items: 1,
		autoplay: false,
		loop: true,
		nav: true,
		margin: 30,
		dots: false,
		responsive: {
			0: {
				items: 1,
			},
			420: {
				items: 1,
			},
			480: {
				items: 3,
			},
			768: {
				items: 3,
			},
			992: {
				items: 5,
			}
		}
	});




})(jQuery);
