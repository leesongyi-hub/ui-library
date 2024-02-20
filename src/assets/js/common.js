
	$(function(){

	  //스크롤에 따른 navi 활성화	
		$('a[href^="#n_info"]').addClass('on');

		//smoothscroll
		$('.lnb-sub-item a').on('click', function (e) {
			e.preventDefault();
			$(document).off("scroll");
			var athis = this;
			var target = this.hash,
			$target = $(target);

			$('.lnb-sub-item').removeClass('on');
			$(this).parents('.lnb-sub-item').addClass('on');

			$('html, body').stop().animate({
				'scrollTop': $target.offset().top
			}, 400, 'swing', function () {
				window.location.hash = target;
			});

			setTimeout(function(){
				scrollContent();
			}, 400);

		});

		scrollContent();

    function scrollContent(){
			$(document).scroll(function(event){
        var scrollPos = $(document).scrollTop();
        if (scrollPos === 0){
          $('a[href^="#n_info"]').addClass('on');
          return;
        };
        $('.lnb-body a').each(function () {
          var currLink = $(this);
          var refElement = $(currLink.attr("href"));
          if (refElement.position().top <= scrollPos && refElement.position().top + refElement.height() > scrollPos) {
            $('.lnb-sub-item').removeClass("on");
            currLink.parents('.lnb-sub-item').addClass("on");
          } else {
            currLink.removeClass("on");
          }
        });
      })
    }

    $('.lnb-sub-item a').on('click', function (e) {
			e.preventDefault();
      $('.guide-section').css('display','none');
      var test = $('.lnb-sub-item.on a').attr("href");
      $(test).css('display', 'block');
    });

  });
