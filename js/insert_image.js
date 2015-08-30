
function init() {
    if($('.inputStage').length > 0) {
        $.get(
            url = chrome.extension.getURL('html/modal.html'),
            success = function(data, state, jqXHR) {
                var modal = $(data)
                $('body').append(modal); //z-index of modal is 1050

                var image_button = $('<div></div>').addClass('insertImageButton');
                $('.inputStage').css('position', 'relative').append(image_button);

                function insertImage(url) {
                    modal.modal('hide');
                    var textarea = $('.inputStage textarea');
                    var content = textarea.val();
                    if(content != '') content += ' ';
                    textarea.val(content+'{{['+url+']}}');
                    textarea.focus();
                    chrome.storage.local.get('recentlyUsedImages', function(imageArray) {
                        imageArray = imageArray.recentlyUsedImages;
                        if(!imageArray) {
                            imageArray = new Array();
                        }
                        var index = imageArray.indexOf(url);
                        if(index != -1) {
                            imageArray.splice(index, 1);
                        }
                        if(imageArray.length >= 20) {
                            imageArray.pop();
                        }
                        imageArray.unshift(url);
                        chrome.storage.local.set({'recentlyUsedImages': imageArray});
                    });
                };

                image_button.click(function() {
                    modal.modal('show');
                    chrome.storage.local.get('recentlyUsedImages', function(imageArray) {
                        imageArray = imageArray.recentlyUsedImages;
                        if(imageArray) {
                            var images = $('#recentlyUsedImages');
                            images.html('');
                            for(var i=0; i<imageArray.length; i=i+1) {
                                images.append('<img src="'+imageArray[i]+'" />');
                            }
                            images.find('img').click(function() {
                                insertImage($(this).attr('src'));
                            });
                        }
                    });
                });

                modal.find('#insertUrl').keypress(function(event) {
                    var $this = $(this);
                    if(event.which == 13) {
                        if($this.val()) {
                            var url = $this.val();
                            $this.val('');
                            insertImage(url);
                        }
                    }
                });

                transfer();
        });
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
