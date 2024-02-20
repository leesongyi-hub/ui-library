
//퍼블리싱본에만 필요한 코드
function includeHTML(){
	let z, elmnt, file, xhttp;

	z = document.getElementsByTagName("*");
	
	for (let i = 0; i < z.length; i++) {
		elmnt = z[i];
		file = elmnt.getAttribute("data-include");
		
		if (file) {
			xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4) {
					if (this.status == 200) {elmnt.innerHTML = this.responseText;}
					if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
					/* Remove the attribute, and call this function once more: */
					elmnt.removeAttribute("data-include");
					includeHTML();
				}//if
			}//onreadystatechange

			xhttp.open("GET", file, true);
			xhttp.send();
			return;
		}//if - file
	}//for
}//includeHTML

/* ✨ 실행 */
window.addEventListener('DOMContentLoaded', function() {
	includeHTML();
});

  var UI = {
    VueTreeSelect: {
      init: function(){  
        if( $('.custom-multi-select').length ){
          Vue.component('treeselect', VueTreeselect.Treeselect)
          $('.custom-multi-select').each(function(index, custom_multi_select) {
              new Vue({
                el: custom_multi_select,
                data: {
                    value: null,
                    // limitText:  function limitTextDefault(count) {return "총 ".concat(count, "개 선택")},
                    // limitText: count => `총 ${count} 개 선택`,
                    valueConsistsOf: 'LEAF_PRIORITY',
                    options:[
                      {
                      id: 'court1',
                      label: '홍길동(L235671 서울 상담 1센터)'
                      },
                      {
                      id: 'court2',
                      label: '홍길순(L235671 경남 상담 2센터)'
                      },
                      {
                      id: 'court3',
                      label: '홍송동(L235671 경북 상담 3센터)'
                      },
                      {
                      id: 'court4',
                      label: '홍길복(L235671 광명 상담 4센터)'
                      },
                      {
                      id: 'court5',
                      label: '홍길복(L235671 광주 상담 4센터)'
                      },
                      {
                      id: 'court6',
                      label: '박상민(L235671 경기도 상담 4센터)'
                      },
                    ]
                  }
              });
          });
        }
      }
    },
    bsMultiModal: {
      init: function(){       
        $(document).on('show.bs.modal', '.modal', function() {
          const zIndex = 1040 + 10 * $('.modal:visible').length;
          $(this).css('z-index', zIndex);
          setTimeout(function() { $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack')});
        });
      }
    },
    bsTooltip: {
      init: function(){
        $("[data-toggle=tooltip]").tooltip({
          trigger: 'hover',
          template: '<div class="tooltip tooltip_label" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
        });
      }
    },
    bsDropDown: {
      init: function(){
        $('.dropdown-toggle').dropdown();
      }
    },
    themeChange: {
      init: function(){
        function setTheme(themeName) {
          var root = document.documentElement;
        
          // 선택된 테마에 대한 데이터 속성 설정
          root.setAttribute('data-theme', themeName);
        }
        
        // 라디오 버튼에 대한 이벤트 처리
        var themeRadios = document.querySelectorAll('input[name="theme"]');
        if (themeRadios.length > 0) {
          var radiosArray = Array.prototype.slice.call(themeRadios);
          radiosArray.forEach(function(radio) {
            radio.addEventListener('change', function() {
              if (this.checked) {
                var selectedTheme = this.value;
                setTheme(selectedTheme);
              }
            });
          });
        }
      }
    },
    expendedNavi: {
      init: function(){

        $('.navi > li').has('.sub-menu').children('a').append('<span class="material-icons-round col-lightgray sm ico-arr">keyboard_arrow_down</span>');

        $('.navi .navi-item > a').click(function() {
          
          var $this = $(this);
          var $subWrap = $this.next('.sub-menu');
          
          if ($subWrap.length) {
            if ($this.hasClass('open')) {
              $this.removeClass('open');
              $subWrap.slideUp('fast');
            } else {
              $('.navi a.open').removeClass('open');
              $('.sub-menu').slideUp('fast');
              $this.addClass('open');
              $subWrap.slideDown('fast');
            }
          } else {
            $('.navi a').removeClass('on');
            $this.addClass('on');
            if ($this.closest('.sub-menu').length) {
            }
          }
          $('.navi .on-view').removeClass('on-view');
          $('.navi').find('a.on').parents('.sub-menu').prev('a').addClass('on-view');
          if ($this.hasClass('on') && $this.parent('li').parent('ul').hasClass('navi')) {
            $this.addClass('on-view');
          }
        });
        
        // 메뉴 접기/펼치기
        $('.lnbToggle-btn').click(function() {
          
          var $wrapper = $('#wrap');
          
          if ($wrapper.hasClass('off')) {
            
            //닫혔을때
            $('.navi .navi-item a').next('.sub-menu').css('height', '100%');
            $('.navi .navi-item a.open').next('.sub-menu').css('visibility', 'visible');
            $wrapper.removeClass('off');
            $('.navi').find('a.on').parents('.sub-menu').show().prev('a').addClass('open on-view');
            $('.navi > li > a.on-view:not(.open)').addClass('on');
            
            
          } else {
            $wrapper.addClass('off');
            $('.navi .navi-item a.open').next('.sub-menu').hide();
            $('.sub-menu').css('display', '');
            $('.navi').find('.ico-arr').removeClass('rotate-90deg');
          }
          return false;
        });

        // 네비 마우스 리브 이벤트
        $('.left-panel').mouseleave(function() {
          if ($('#wrap').hasClass('off')) {
            $('.navi .navi-item a.open').next('.sub-menu').css('height', '0');
            $('.navi .navi-item a.open').next('.sub-menu').css('visibility', 'hidden');
            $('.navi .navi-item a.open').next('.sub-menu').css('display', 'none');
          }
        });

        $('.left-panel').mouseover(function() {
          if ($('#wrap').hasClass('off')) {
            $('.navi .navi-item a.open').next('.sub-menu').css('height', 'auto');
            $('.navi .navi-item a.open').next('.sub-menu').css('display', 'block');
            $('.navi .navi-item a.open').next('.sub-menu').css('visibility', 'visible');
          }
        });
      }
    },
    myManu: {
      init: function(){
        var dropdownVisible = false;
        
        
        $('.my-btn').on('click', function(){
          //false
          if (!dropdownVisible) {
            $('.my-dropdown .sub-menu').hide();
            $('.my-dropdown .my-info').show();
            $('.my-dropdown .my-list').show();
            $('.my-dropdown').show();
            dropdownVisible = true;

          } else {  
            //true
            $('.my-dropdown').hide();
            dropdownVisible = false;
          }
        });
    
        $('.theme-btn').on('click', function(){
          $('.my-dropdown .sub-menu').fadeIn();
          $('.my-dropdown .my-info').hide();
          $('.my-dropdown .my-list').hide();
        });
    
        $('.back-btn').on('click', function(){
          $('.my-dropdown .sub-menu').hide();
          $('.my-dropdown .my-info').fadeIn();
          $('.my-dropdown .my-list').fadeIn();
        });    
        
        // 사이드바 외부를 클릭하면 사이드바 닫힘
        var target = $(".my-dropdown, .my-btn");

        $(document).mouseup(function (e){
          if(target.has(e.target).length === 0) {
            $(".my-dropdown").hide();
            dropdownVisible = false;
          }
        });
        
      }
    },
    searchSelect: {
      init: function(){
        $('.searchSelect').each(function () {
          var wrapper = $(this);
          var select = wrapper.find('.select');
          var options = wrapper.find('.options');
          var input = wrapper.find('.filter');
          var countries = ["솔루션", "솔루션2팀", "솔루션3팀", "솔루션3팀솔루션3팀솔루션3팀솔루션3팀솔루션3팀솔루션3팀솔루션3팀솔루션3팀솔루션3팀솔루션3팀"];
          
          select.on('click', function () {
            wrapper.toggleClass('active');
          });
          
          input.on('input', function () {
            var arr = [];
            var searchWord = input.val().toLowerCase();
          
            if (searchWord.length > 0) {
              arr = countries.filter(function (data) {
                return data.toLowerCase().indexOf(searchWord) !== -1;
              }).map(function (data) {
                return '<li>' + data + '</li>';
              }).join("");
              options.html(arr ? arr : '<p class="nodata">조회된 내역이 없습니다.</p>');
            } else {
              options.html("");
              addLi();
            }
          });
          
          addLi();
          
          options.on('click', 'li', function() {
            changeClickedName($(this));
          });
        
          function addLi() {
            options.html("");
            countries.forEach(function (country) {
              var li = '<li>' + country + '</li>';
              options.append(li);
            });
          }
          
          function changeClickedName(clickedLi) {
            input.val("");
            addLi();
            wrapper.removeClass('active');
            wrapper.find('.selected-option').text(clickedLi.text());
          }
        });
      }
    },
  };
  
  $(function () {
    UI.VueTreeSelect.init();
    UI.bsMultiModal.init();
    UI.bsTooltip.init();
    UI.bsDropDown.init();
    UI.themeChange.init();
    UI.expendedNavi.init();
    UI.myManu.init();
    UI.searchSelect.init();
  });  
  
  