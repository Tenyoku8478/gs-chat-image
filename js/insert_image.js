function init() {
    if($('.inputStage').length > 0) {
        var image_button = $('<div></div>').addClass('insertImageButton');
        $('.inputStage').css('position', 'relative').append(image_button);
        image_button.click(function() {
            var url = prompt('請輸入圖片網址', '');
            if(url) {
                var textarea = $('.inputStage textarea');
                var content = textarea.val();
                if(content != '') content += ' ';
                textarea.val(content+'{{['+url+']}}');
                textarea.focus();
            }
        });
        transfer();
    }
    else {
        setTimeout(init, 1000);
    }
}

function transfer() {
    $('.msg').each(function(index) {
        var $this = $(this);
        var cont = $this.html();
        var begin = cont.indexOf('{{[');
        var end = cont.indexOf(']}}');
        if(begin!=-1 && end!=-1) {
            while(begin!=-1 && end!=-1) {
                end += 3;
                var url = cont.substring(begin+3, end-3);
                url = $(url).attr('href');
                cont = cont.substring(0, begin)+'<img src="'+url+'"></img>'+cont.substring(end, cont.length);
                begin = cont.indexOf('{{[');
                end = cont.indexOf(']}}');
            }
            $this.html(cont);
        }
    });
    setTimeout(transfer, 1000);
}
init();
