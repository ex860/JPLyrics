const MODE = { ALL: 'all', KANJI: 'kanji', KANA: 'kana' };
function escapeHtml(text) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function copyTextarea(lyrics) {
  const textarea = document.createElement('textarea');
  const previousFocus = document.activeElement;
  textarea.style.cssText = 'position:fixed;left:-9999px;top:0;';
  textarea.value = lyrics;
  document.body.appendChild(textarea);
  try {
    textarea.select();
    if (!document.execCommand('copy')) throw new Error('剪貼簿寫入失敗');
  } finally {
    textarea.remove();
    previousFocus?.focus();
  }
}
function lyricsGetter(message) {
  if (message?.type !== 'copy-lyrics' || !Object.values(MODE).includes(message.mode)) return;
  if (!document.URL.startsWith('https://utaten.com/lyric/')) return;
  const container = document.querySelector('.medium div.hiragana');
  if (!container?.textContent.trim()) {
    alert('找不到歌詞，請等待頁面載入完成後再試。');
    return;
  }
  const mode = message.mode;
  const song = document.querySelector('.newLyricTitle__main')?.childNodes[0]?.textContent?.trim() || '';
  const singer = document.querySelector('.newLyricWork__name a')?.textContent?.trim() || '';
  const title = [song, singer].filter(Boolean).join(' - ');
  const formatText = text => mode === MODE.ALL ? escapeHtml(text) : text;
  let lyrics = '';
  container.childNodes.forEach(node => {
    if (node.nodeName === 'SPAN') {
      const [rb, rt] = node.children;
      if (!rb || !rt) {
        lyrics += formatText(node.textContent);
        return;
      }
      if (mode === MODE.ALL) {
        lyrics += `<ruby>${escapeHtml(rb.textContent)}<rt>${escapeHtml(rt.textContent)}</rt></ruby>`;
      } else {
        lyrics += mode === MODE.KANJI ? rb.textContent : rt.textContent;
      }
    } else if (node.nodeName === '#text' && node.textContent.replace(/\s/g, '')) {
      lyrics += formatText(node.textContent);
    } else if (node.nodeName === 'BR') {
      lyrics += '\n';
    }
  });
  if (!lyrics.trim()) {
    alert('找不到可複製的歌詞。');
    return;
  }
  lyrics = mode === MODE.ALL ? `# ${escapeHtml(title)}\n\n<font size=5>${lyrics}</font>` : `${title}\n\n${lyrics}`;
  try {
    copyTextarea(lyrics);
    alert('歌詞已複製！');
  } catch (error) {
    console.warn('複製歌詞失敗', error);
    alert('複製失敗，請重新整理頁面後再試。');
  }
}
chrome.runtime.onMessage.addListener(lyricsGetter);
