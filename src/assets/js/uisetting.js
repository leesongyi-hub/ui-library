//메인 컬럼 hide
function mainColHide(mainId) {
    $('#'+mainId).addClass('hiddenCol setHide').hide();
}

//메인 컬럼 show
function mainColShow(mainId, mainColWidth, index, uiColLength) {
    $('#'+mainId).show().removeClass('hiddenCol setHide flex1').css('width',mainColWidth+'%');
}

//메인 컬럼 resizable on/off
function mainColType(colType){
    if(colType == 'fixed') {
        $('.content-col').removeClass('resize-wrap');
    }else{
        $('.content-col').addClass('resize-wrap');
    };
};


//화면설정 창 닫기 - 메인 적용
function uiSettingClose(){
    var index= -1;
    var colType = $('input:radio[name=uiColSet]:checked').val()

    $('.ui-preview-col').each(function(e){
        var mainId = $(this).attr('id').replace("ui-", "main-");
        var uiValues = $('#ui-rate-range').slider('values');
        var uiColLength = uiValues.length;

        if($(this).hasClass('hiddenCol')){
            mainColHide(mainId)
        }else{
            index = index+1

            // 각 컬럼 width값 변환
            if(index == 0){ // 첫번째값
                var mainColWidth = uiValues[index];
                $('#'+mainId).addClass('last-no-dragbar');

            }else if(index > 0 && index <  uiColLength){ // 중간들값
                var mainColWidth = uiValues[index] - uiValues[index-1];
                $('#'+mainId).removeClass('last-no-dragbar');

            }else if(index == uiColLength){ //마지막값
                var mainColWidth = 100 - uiValues[index-1];
                $('#'+mainId).addClass('last-no-dragbar');
                $('#'+mainId).siblings('div').removeClass('last-no-dragbar');
            };

            mainColShow(mainId, mainColWidth, index, uiColLength)
        };

    });

    
    mainColType(colType)   //메인 컬럼 resizable on/off
    mainCont()             //메인 콘탠츠 on/off
    textSize()             //글자크기 설정
    themeSet()
};



//메인 컬럼내 컨텐츠 on/off
function mainCont(){

    $('.cont-wrap').prependTo('.blank-hide').removeClass('cont-upper cont-lower only-one full half closed');   

    $('.ui-preview-col:not(.hiddenCol)').each(function(){
        var thisLength = $(this).find(".compo-checkbox[type=radio]:not([value='noselect']):checked").length;

        $(this).find(".compo-checkbox[type=radio]:not([value='noselect']):checked").each(function(i){
            var mainCol = $(this).closest('.ui-preview-col').attr('id').replace("ui-", "main-");
            var mainComp = 'main-' + $(this).val();


            if($('#' + mainComp).find('.type-chatarea').length > 0){    //채팅창일경우 full
                var classAdd = 'full';
            }else{
                var classAdd = 'half';
            }

                
            if(thisLength == 1) {   //단독 컴포넌트일 경우
                $('#' + mainComp).appendTo('#' + mainCol + '> .content-col-div').addClass('only-one');

            }else if(thisLength != 1 && i == 0) {  //상단 컴포넌트일 경우
                $('#' + mainComp).appendTo('#' + mainCol + '> .content-col-div').addClass('cont-upper '+ classAdd);

            }else if(thisLength != 1 && i != 0) {  //하단 컴포넌트일 경우
                $('#' + mainComp).appendTo('#' + mainCol + '> .content-col-div').addClass('cont-lower '+ classAdd).find('.expand-btn-area > .btn-down').attr('disabled',false);

                if(classAdd == 'full'){ //채팅창일경우
                    $('#' + mainComp).siblings('.cont-wrap').removeClass('half').addClass('closed');
                    $('#' + mainComp).find('.expand-btn-area > .btn-up').attr('disabled',true);
                }else if(classAdd == 'half' && $('#' + mainComp).siblings('.cont-wrap').find('.type-chatarea').length == 1){    //상단이 채팅창일 경우
                    $('#' + mainComp).removeClass('half').addClass('closed');
                    $('#' + mainComp).find('.expand-btn-area > .btn-down').attr('disabled',true);
                }
            };

            var tabCol = $('#' + mainComp+':not(.closed)').find('.cont-tit .nav-link');
            tabCol.eq(0).click();

        });
    


    });

};


//글자크기 설정
function textSize(){
    var textSizeVal = $('input:radio[name=uiFontSize]:checked').val()
    $('#wrapper').removeClass('font-basic font-large font-verylarge').addClass(textSizeVal);
};

//테마 설정
function themeSet(){
    var themeVal = "theme-" + $('input:radio[name=uiTheme]:checked').val()
    $('#wrapper').removeClass('theme-grayblue theme-brown theme-green theme-purple theme-gray').addClass(themeVal);
};


$(function() {


//화면설정 모달 오픈

 $('#uisetting').on('shown.bs.modal', function() {

    var colWrapWidth = $('.content-col').outerWidth();
    var mainCol = $('.content-col-area:not(.setHide)');
    var mainColLength = mainCol.length - 1;
    var mainColArr = [];

    $('.content-col').find('.content-col-area.hiddenCol:not(.setHide)').removeClass('hiddenCol').show();
    $('.content-col').find('.content-col-area.flex1.last-no-dragbar').removeClass('flex1 last-no-dragbar');

    $('.content-col-area:not(.setHide)').each(function(index){
        if(index == 0){
            var colWidth = $(this).outerWidth() / colWrapWidth * 100;
            mainColArr.push(colWidth);

        }else if(index > 0 && index <  mainColLength){
            var colWidth = ($(this).prev().outerWidth() + $(this).outerWidth()) / colWrapWidth * 100;
            mainColArr.push(colWidth);
        };

    });

    var mainValue = mainColArr;    //메인화면 컬럼(핸들러) 값(%)
    var mainColLength = $('.content-col').find('.content-col-area').length - 1; //메인화면 컬럼 갯수-1
    setColType($('input:radio[name=uiColSet]:checked').val(), mainColLength, mainValue); 
});


// 자율조정/비율고정 라디오 선택
$('input:radio[name=uiColSet]').click(function(){
    colType()
    rulerVal(colTypeVal)
    var colShowIndex = $('.ui-preview').find('.ui-preview-col:not(.hiddenCol)').length - 1;     
    setColType(colTypeVal, colShowIndex,'', $('#ui-rate-range').slider('values'));
});

function setColType(colTypeVal, colShowIndex, mainValue, prevValues) {
    rulerVal(colTypeVal)

    if(colTypeVal == "free"){
        slideStep = 0.1;
    }else if(colTypeVal == "fixed"){
        slideStep = 100 / 12;
    };

    widget_slider(colShowIndex, mainValue, slideStep, prevValues, colTypeVal);  
}

function colType(){
    colTypeVal = $('input:radio[name=uiColSet]:checked').val();
}

function rulerVal(colTypeVal){
    $('.slide-ruler').attr('data-value',colTypeVal);
}


function widget_slider(columns, mainValue, slideStep, prevValues, colTypeVal) {

    if(mainValue){    //메인화면에서 넘어온 값
        slider_values = mainValue;

    }else if(prevValues){   //라디오 변경
        slider_values = prevValues;
        if (columns == '0') {slider_disabled = true}
    
    }else{//기본 셋팅값
        if (columns == '0') {slider_values = [100]; slider_disabled = true}
        if (columns == '1') {slider_values = [50];}
        if (columns == '2') {slider_values = [33.3, 66.6];}
    };

    if (undefined !== jQuery('#ui-rate-range').slider('instance') ) {
        jQuery('#ui-rate-range').slider('destroy');

        setPreviewWidth(slider_values, colTypeVal);

        if(columns == "0"){ // 기본비율 버튼 비활성/활성
            $('.btn-col-reset').attr('disabled', true)
        }else(
            $('.btn-col-reset').attr('disabled', false)
        );
    };

    var setSlider = function (values, slider_disabled) {

        $('#ui-rate-range').slider({
            disabled: slider_disabled,
            //range: true,
            min: 0,
            max: 100,
            step:slideStep,
            values:values,
            slide: function(event, ui) {
                var minWidth = 24.999;  //최소폭(%)
                if( ui.values[ui.handleIndex] < minWidth || 
                    ui.values[ui.handleIndex] > 100 - minWidth || 
                    ui.values[ui.handleIndex] > ui.values[ui.handleIndex + 1] - minWidth ||
                    ui.values[ui.handleIndex] < ui.values[ui.handleIndex - 1] + minWidth
                    )
                return false;

                setPreviewWidth(ui.values, colTypeVal);
                
            }
        });

    };

    var val = slider_values;
    var slider_disabled;
    setSlider(val, slider_disabled);
    setPreviewWidth($('#ui-rate-range').slider('values'), colTypeVal);

};


//폭 조정 값 출력
function setPreviewWidth(uiValues, colTypeVal){

    //alert(uiValues +' / '+ colTypeVal)

    var rateLength = uiValues.length;

    $('.ui-rate-preview').find("*[data-name='rate-preview']:not(.hiddenCol)").each(function(index){
        if(index == 0){ // 첫번째값
            var ratePreviewWidth = uiValues[index];
        }else if(index > 0 && index <  rateLength){ // 중간들값
            var ratePreviewWidth = uiValues[index] - uiValues[index-1];
        }else if(index == rateLength){ //마지막값
            var ratePreviewWidth = 100 - uiValues[index-1];
        };


        if(colTypeVal == "free"){
            var rateWidthPrint = parseFloat(ratePreviewWidth).toFixed(1) +' %';
            $(this).text(rateWidthPrint).css('width',ratePreviewWidth+'%');

        }else if(colTypeVal == "fixed"){
            var rateWidthPrint = parseFloat(ratePreviewWidth / (100 / 12)).toFixed(0);
            $(this).text(rateWidthPrint).css('width',ratePreviewWidth+'%');
        
        };
    });
};


// 기본비율 버튼 클릭
$('.btn-col-reset').on('click', function(){
    colType();
    widget_slider($('#ui-rate-range').slider('values').length,"", slideStep,"", colTypeVal);
});


// 컴포넌트 셀렉트 ///////////////////////////////////////////////////////////////////////////////////////////

//컴포넌트 초기셋팅
compoCheckDisabled('initialize')

//컴포넌트 셀렉트 클킥
$('.custom-compo-select > .select-compo').on('click', function(){
    if($(this).is('.active')){
        componentListHide($(this))
    }else{
        componentListShow($(this))
    };
});

//컴포넌트 셀렉트 열기
function componentListShow($this){
    $('.select-compo').removeClass('active')
    $('.compo-select-wrap').hide();

    $this.addClass('active');
    $this.next('.compo-select-wrap').show();
}

//컴포넌트 셀렉트 닫기
function componentListHide($compoSelect){
    $compoSelect.removeClass('active');
    $compoSelect.next('.compo-select-wrap').hide();
};

//컴포넌트 선택
$('.compoLabel > input').on('click',function(){
    
    var $compoSelect = $(this).closest('.custom-compo-select').find('.select-compo');
    var $totalChecked = $('.ui-preview').find('.checked:not(.noselect)').length;

    if($(this).closest('li').is('.checked:not(.noselect)') || $(this).closest('li').is('.disabled')){
        return false;
    }else{

        if($(this).closest('li').is('.noselect') && $totalChecked == 1){
            alert('최소 한개의 서비스는 선택하셔야 합니다.')
            componentListHide($compoSelect);
            return false;
        };
        
        var $prevVal = $(this).closest('.ui-preview-back').attr('data-prev');

        if($(this).closest('.selectall2_wrap').length == "0"){

            $(this).closest('li').addClass('checked').siblings().removeClass('checked')
            $(this).closest('li').siblings('.selectall2_wrap').find('input[type=checkbox]').prop('checked', false); //2뎁스체크 풀기

            var $compoText = $(this).closest('label').text();
            var $thisVal = $(this).val();

            componentListHide($compoSelect)
        }else{
            var $thisVal = $(this).closest('.selectall2_wrap').children('label').children('input.compo-checkbox').val();
            $(this).closest('.selectall2_wrap').addClass('checked').siblings().removeClass('checked')
            $(this).closest('.selectall2_wrap').children('label').children('input.compo-checkbox').prop('checked', true);

            if($(this).is('.depth2')){  //2뎁스일경우 최소 1개 선택
                var depth2Length = $(this).closest('ul').find('input[type=checkbox]:checked').length;

                if(depth2Length == 0){
                    alert('최소 한개의 하위 서비스를 선택하셔야 합니다.')
                    $(this).prop('checked',true)
                }
            }

            var $compoText = $(this).closest('.selectall2_wrap').children('label').text();
        }

        if($prevVal != $thisVal) {
            $(this).closest('.ui-preview-back').attr('data-prev', $thisVal);
            $compoSelect.text($compoText)
            compoCheckDisabled($prevVal)    
        };
    };

    checkCompSlider();

});


//컴포넌트 선택에 따른 slider 수정
function checkCompSlider(mainValue){

    var prevShowIndex = $('.ui-preview').find('.ui-preview-col:not(.hiddenCol)').length - 1;

    $('.ui-preview-col').each(function(index){
        var enabledCol = $(this).find('.ui-preview-cont-in.disabled').length;

        if(enabledCol == 2) {
            $(this).addClass('hiddenCol');
            $('.ui-rate-preview > div').eq(index).addClass('hiddenCol');
        }else{
            $(this).removeClass('hiddenCol');
            $('.ui-rate-preview > div').eq(index).removeClass('hiddenCol');
        };
    });

    var colShowIndex = $('.ui-preview').find('.ui-preview-col:not(.hiddenCol)').length - 1;

    if(prevShowIndex != colShowIndex){
        colType();
        widget_slider(colShowIndex, '', slideStep, '', colTypeVal);     
    }
};


// 체크박스 disabled 처리
function compoCheckDisabled($prevVal){

    $('.ui-preview').find('.custom-compo-select').each(function(){

        if($prevVal == 'initialize'){   //초기설정
            $initializeChecked = $(this).find('input:not(.depth2):checked');
            $initializeText = $initializeChecked.first().closest('label').text();

            $initializeChecked.closest('li').addClass('checked');
            $(this).closest('.ui-preview-back').attr('data-prev', $initializeChecked.val());
            $(this).find('.select-compo').text($initializeText)

        }
                        
        $(this).find('.compo-select-wrap > ul > li').each(function(){

            if($(this).is('.checked')){
                var $checkedVal = $(this).find('input.compo-checkbox').val();
                var $notThisComp = $('.ui-preview').find('.custom-compo-select').not($(this).closest('.custom-compo-select'));

                if($(this).is(':not(.noselect)')){
                    $notThisComp.find('input.compo-checkbox[value='+$checkedVal+']').prop('disabled',true).closest('li').addClass('disabled');
                    $(this).closest('.ui-preview-cont-in').removeClass('disabled');
                }else if($(this).is('.noselect') || $(this).closest('input.compo-checkbox').is('.depth2')){
                    $(this).closest('.ui-preview-cont-in').addClass('disabled');
                };

                $notThisComp.find('input.compo-checkbox[value='+$prevVal+']').prop('disabled',false).closest('li').removeClass('disabled');

                if($(this).closest('.selectall2_wrap').length > 0){
                    $notThisComp.find('input.compo-checkbox[value='+$checkedVal+']').closest('.selectall2_wrap').find('input.compo-checkbox').prop('disabled',true).closest('li').addClass('disabled');
                }else if($(this).closest('.custom-compo-select').find('input.compo-checkbox[value='+$prevVal+']').closest('.selectall2_wrap').length > 0){
                    $notThisComp.find('input.compo-checkbox[value='+$prevVal+']').closest('.selectall2_wrap').find('input.compo-checkbox').prop('disabled',false).closest('li').removeClass('disabled');
                };
            }
        });
    })
};

//배경 클릭시 컴포넌트 셀렉트 닫기
$("html").click(function(e) {   
    if($(e.target).closest(".custom-compo-select").length){
        return;
    }else{
        $('.custom-compo-select > .select-compo').removeClass('active');
        $('.custom-compo-select > .compo-select-wrap').hide();
    };
});  

// drag & drop //////////////////////////////////////////////////////////////////////
var droppableParent;

$('.ui-preview .ui-preview-cont-in').draggable({
    cancel: '.custom-compo-select',
    revert: 'invalid',
    revertDuration: 200,
    start: function() {
        droppableParent = $(this).parent();
    }
});

$('.ui-preview .ui-preview-back').droppable({
    hoverClass: 'drop-hover',
    drop: function(event, ui) {
        var draggable = $(ui.draggable[0]),
            draggableOffset = draggable.offset(),
            container = $(event.target),
            containerOffset = container.offset();

        setTimeout(function() {
            var thisCompoVal = draggable.find('.custom-compo-select').find('.compo-checkbox:not(.depth2):checked').val();
            container.attr('data-prev',thisCompoVal);
            
            var targetCompoVal = droppableParent.find('.custom-compo-select').find('.compo-checkbox:not(.depth2):checked').val();
            droppableParent.attr('data-prev',targetCompoVal)

            checkCompSlider();  //슬라이더 변경
        }, 500);

        $('.ui-preview-cont-in', event.target).appendTo(droppableParent).css({
            opacity: 0
        }).animate({
            opacity: 1
        }, 200);

        draggable.appendTo(container).css({
            left: draggableOffset.left - containerOffset.left,
            top: draggableOffset.top - containerOffset.top
        }).animate({
            left: 0,
            top: 0
        }, 200);
    }
});
});
