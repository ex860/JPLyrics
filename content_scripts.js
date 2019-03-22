const MODE = {
    ALL: 'all',
    KANJI: 'kanji',
    KANA: 'kana',
};

function copyTextarea (lyrics) {
    let textarea = `<textarea class="JPLyrics">${lyrics}</textarea>`;
    $(textarea).insertAfter($('body'));
    $('textarea.JPLyrics').select();
    document.execCommand('copy');
    $('body').next('textarea.JPLyrics').remove();
}

function lyricsGetter (message) {
    const url = document.URL;
    const mode = message.mode;
    let lyrics = '';
    let sentence = '';
    let singer = '';
    let song = '';
    let title = '';
    // marumaru
    if (url.match(/http[s]?:\/\/www.jpmarumaru.com\/tw\/JPSongPlay-\d+\.html/)) {
        // console.log('current URL =', url);
        song = $('h2.main-title')[0].innerText.split(' - ')[0];
        singer = $('h2.main-title')[0].innerText.split(' - ')[1];
        $.each(
            $('#LyricsList > ul > li > span.LyricsYomi'), 
            function (k, v) { 
                switch (mode) {
                    case MODE.ALL:   // 包含振り仮名 (html)
                        $(v).find('rb').contents().unwrap();
                        break;
                    case MODE.KANJI: // 移除振り仮名 (plain text)
                        $(v).find('rt').remove();
                        $(v).find('rb').unwrap();
                        $(v).find('rb').contents().unwrap();
                        break;
                    case MODE.KANA:  // 全假名 (plain text)
                        $(v).find('rb').remove();
                        $(v).find('rt').unwrap();
                        $(v).find('rt').contents().unwrap();
                        break;
                }
                lyrics += $(v).html() + '\n';
            }
        );
    } else if (url.match(/http[s]?:\/\/utaten.com\/lyric\/.*\/.*\//)) {
        // console.log('current URL =', url);
        song = $('h1')[0].innerText.split(/[「」]/)[1];
        singer = $('a.boxArea_artists_move_top')[0].innerText.trim();
        $.each(
            $.parseHTML($('.medium').html()), 
            function (k, v) {
                if ($(v).context.outerHTML !== "<br>") {
                    if ($(v).html()) {
                        switch (mode) {
                            case MODE.ALL:   // 包含振り仮名 (html)
                                $(v).find('span.rt').contents().unwrap().wrap("<rt></rt>");
                                $(v).find('span.rb').contents().unwrap().next('rt').addBack().wrapAll("<ruby></ruby>");
                                break;
                            case MODE.KANJI: // 移除振り仮名 (plain text)
                                $(v).find('span.rt').contents().unwrap().remove();
                                $(v).find('span.rb').contents().unwrap();
                                break;
                            case MODE.KANA:  // 全假名 (plain text)
                                $(v).find('span.rt').contents().unwrap();
                                $(v).find('span.rb').contents().unwrap().remove();
                                break;
                        }
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
            }
        );
    }
    title = `${song} - ${singer}`;
    switch (mode) {
        case MODE.ALL:
            lyrics = `# ${title}\n\n<font size=${message.fontSize}>${lyrics}</font>`;
            break;
        case MODE.KANA:
        case MODE.KANJI:
            lyrics = `${title}\n\n${lyrics}`;
            break;
    }
    copyTextarea(lyrics);
}
chrome.runtime.onMessage.addListener(lyricsGetter);