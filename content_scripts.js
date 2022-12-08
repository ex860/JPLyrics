const MODE = {
  ALL: 'all',
  KANJI: 'kanji',
  KANA: 'kana',
};

const NODE_NAME = {
  BR: 'BR',
  SPAN: 'SPAN',
  TEXT: '#text',
}

function copyTextarea(lyrics) {
  const textarea = `<textarea class="JPLyrics">${lyrics}</textarea>`;
  $(textarea).insertAfter($('body'));
  $('textarea.JPLyrics').select();
  document.execCommand('copy');
  alert('Content is copied!');
}

function lyricsGetter(message) {
  const url = document.URL;
  const mode = message.mode;
  let lyrics = '';
  let singer = '';
  let song = '';
  let title = '';
  // marumaru
  if (url.match(/http[s]?:\/\/www.jpmarumaru.com\/tw\/JPSongPlay-\d+\.html/)) {
    // console.log('current URL =', url);
    song = $('h2.main-title')[0].innerText.split(' - ')[0];
    singer = $('h2.main-title')[0].innerText.split(' - ')[1];
    $.each($('#LyricsList > ul > li > span.LyricsYomi'), function (k, v) {
      switch (mode) {
        case MODE.ALL: // 包含振り仮名 (html)
          $(v).find('rb').contents().unwrap();
          break;
        case MODE.KANJI: // 移除振り仮名 (plain text)
          $(v).find('rt').remove();
          $(v).find('rb').unwrap();
          $(v).find('rb').contents().unwrap();
          break;
        case MODE.KANA: // 全假名 (plain text)
          $(v).find('rb').remove();
          $(v).find('rt').unwrap();
          $(v).find('rt').contents().unwrap();
          break;
      }
      lyrics += $(v).html() + '\n';
    });
  } else if (url.match(/http[s]?:\/\/utaten.com\/lyric\/.*\//)) {
    const songNameText = document.querySelector('.newLyricTitle__main')?.childNodes?.[0]?.textContent;
    if (typeof songNameText === 'string') {
      song = songNameText.replace(/\s/g, '');
    }
    const singerText = document.querySelector('.newLyricWork__name a')?.textContent;
    if (typeof singerText === 'string') {
      singer = singerText.replace(/\s/g, '');
    }
    const { childNodes } = document.querySelector('.medium div.hiragana') || {};
    if (childNodes.length) {
      childNodes.forEach(node => {
        if (node.nodeName === NODE_NAME.SPAN) {
          const [rb, rt] = node.children || [];
          const rbText = rb.textContent;
          const rtText = rt.textContent;
          switch (mode) {
            case MODE.ALL:
              lyrics += `<ruby>${rbText}<rt>${rtText}</rt></ruby>`
              break;
            case MODE.KANJI:
              lyrics += rbText;
              break;
            case MODE.KANA:
              lyrics += rtText;
              break;
          }
        } else if (node.nodeName === NODE_NAME.TEXT) {
          const { textContent } = node || {};
          if (typeof textContent === 'string' && textContent.replace(/\s/g, '')) {
            lyrics += textContent;
          }
        } else if (node.nodeName === NODE_NAME.BR) {
          lyrics += '\n';
        }  
      })
    }
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
