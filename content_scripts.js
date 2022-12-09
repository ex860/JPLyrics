const MODE = {
  ALL: 'all',
  KANJI: 'kanji',
  KANA: 'kana',
};

const NODE_NAME = {
  BR: 'BR',
  SPAN: 'SPAN',
  RUBY: 'RUBY',
  TEXT: '#text',
}

function copyTextarea(lyrics) {
  const timestamp = new Date().getTime();
  const textarea = document.createElement('textarea');
  textarea.className = `JPLyrics-${timestamp}`;
  textarea.style.opacity = 0;
  textarea.textContent = lyrics;
  document.body.appendChild(textarea);
  document.querySelector(`textarea.JPLyrics-${timestamp}`).select();
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

  if (url.match(/https?:\/\/www.jpmarumaru.com\/tw\/JPSongPlay-\d+\.html/)) {
    const mainTitleText = document.querySelector('.main-title')?.textContent;
    if (typeof mainTitleText === 'string') {
      ([song, singer] = mainTitleText.split(' - '));
    }
    switch (mode) {
      case MODE.ALL: 
      case MODE.KANJI:
        document.querySelectorAll('#LyricsList > ul > li > span.LyricsYomi').forEach(span => {
          const { childNodes } = span || {};
          if (childNodes?.length) {
            childNodes.forEach(node => {
              switch(node.nodeName) {
                case NODE_NAME.RUBY:
                  const [rb, rt] = node.children || [];
                  const rbText = rb.textContent;
                  const rtText = rt.textContent;
                  if (mode === MODE.ALL) {
                    lyrics += `<ruby>${rbText}<rt>${rtText}</rt></ruby>`;
                  } else {
                    lyrics += rbText;
                  }
                  break;
                case NODE_NAME.TEXT:
                  const { textContent } = node || {};
                  if (typeof textContent === 'string' && textContent.replace(/\s/g, '')) {
                    lyrics += textContent;
                  }
                  break;
              }
            })
          }
          lyrics += span.textContent + '\n\n';
        });
        break;
      case MODE.KANA:
        document.querySelectorAll('#LyricsList > ul > li > span.LyricsYomiKana').forEach(span => {
          lyrics += span.textContent + '\n\n';
        });
        break;
    }
  } else if (url.match(/https?:\/\/utaten.com\/lyric\/.*\//)) {
    const songNameText = document.querySelector('.newLyricTitle__main')?.childNodes?.[0]?.textContent;
    if (typeof songNameText === 'string') {
      song = songNameText.replace(/\s/g, '');
    }
    const singerText = document.querySelector('.newLyricWork__name a')?.textContent;
    if (typeof singerText === 'string') {
      singer = singerText.replace(/\s/g, '');
    }
    const { childNodes } = document.querySelector('.medium div.hiragana') || {};
    if (childNodes?.length) {
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
