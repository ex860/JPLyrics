$(function () {
    lyricsGetter(document.URL);
});

function lyricsGetter(url) {
    // marumaru
    if (url.match(/http[s]?:\/\/www.jpmarumaru.com\/tw\/JPSongPlay-\d+\.html/)) {
        // console.log('current URL =', url);
        const mode = 'all';
        
        switch (mode) {
            case 'all':
                // 包含振り仮名 (html)
                var lyrics = '';
                $.each(
                    $('#LyricsList > ul > li > span.LyricsYomi'), 
                    function (k, v) { 
                        $(v).find('rb').contents().unwrap();
                        lyrics += $(v).html() + '\n';
                    }
                );
                console.log(lyrics);
                // lyrics.select();
                // document.execCommand("copy");
                // alert("Copied the text");
                break;
            case 'kanji':
                // 移除振り仮名 (plain text)
                var lyrics = '';
                $.each(
                    $('#LyricsList > ul > li > span.LyricsYomi'), 
                    function (k, v) { 
                        $(v).find('rt').remove();
                        $(v).find('rb').unwrap();
                        $(v).find('rb').contents().unwrap();
                        lyrics += $(v).html() + '\n';
                    }
                );
                console.log(lyrics);
                break;
            case 'kana':
                // 全假名 (plain text)
                var lyrics = '';
                $.each(
                    $('#LyricsList > ul > li > span.LyricsYomi'), 
                    function (k, v) { 
                        $(v).find('rb').remove();
                        $(v).find('rt').unwrap();
                        $(v).find('rt').contents().unwrap();
                        lyrics += $(v).html() + '\n';
                    }
                );
                console.log(lyrics);
                break;
        }
    } else if (url.match(/http[s]?:\/\/utaten.com\/lyric\/.*\/.*\//)) {
        // console.log('current URL =', url);
        const mode = 'all';
        
        switch (mode) {
            case 'all':
                // 包含振り仮名 (html)
                var lyrics = '';
                var sentence = '';
                $.each($.parseHTML($('.medium').html()), function (k, v) {
                    if ($(v).context.outerHTML !== "<br>") {
                        if ($(v).html()) {
                            $(v).find('span.rt').contents().unwrap().wrap("<rt></rt>");
                            $(v).find('span.rb').contents().unwrap().next('rt').addBack().wrapAll("<ruby></ruby>");
                            sentence += $(v).html();
                        } else {
                            var text = $(v).text();
                            sentence += text.trim();
                            if (text.length > 1 && text[text.length-1] === ' ' && text[text.length-2] !== ' ') {
                                sentence += ' ';
                            }
                        }
                    } else {
                        lyrics += sentence + '\n';
                        sentence = '';
                    }
                })
                console.log(lyrics);
                break;
            case 'kanji':
                // 移除振り仮名 (plain text)
                var lyrics = '';
                var sentence = '';
                $.each($.parseHTML($('.medium').html()), function (k, v) {
                    if ($(v).context.outerHTML !== "<br>") {
                        if ($(v).html()) {
                            $(v).find('span.rt').contents().unwrap().remove();
                            $(v).find('span.rb').contents().unwrap();
                            sentence += $(v).html();
                        } else {
                            var text = $(v).text();
                            sentence += text.trim();
                            if (text.length > 1 && text[text.length-1] === ' ' && text[text.length-2] !== ' ') {
                                sentence += ' ';
                            }
                        }
                    } else {
                        lyrics += sentence + '\n';
                        sentence = '';
                    }
                })
                console.log(lyrics);
                break;
            case 'kana':
                // 全假名 (plain text) 
                var lyrics = '';
                var sentence = '';
                $.each($.parseHTML($('.medium').html()), function (k, v) {
                    if ($(v).context.outerHTML !== "<br>") {
                        if ($(v).html()) {
                            $(v).find('span.rt').contents().unwrap();
                            $(v).find('span.rb').contents().unwrap().remove();
                            sentence += $(v).html();
                        } else {
                            var text = $(v).text();
                            sentence += text.trim();
                            if (text.length > 1 && text[text.length-1] === ' ' && text[text.length-2] !== ' ') {
                                sentence += ' ';
                            }
                        }
                    } else {
                        lyrics += sentence + '\n';
                        sentence = '';
                    }
                })
                console.log(lyrics);
                break;
        }
    }
}