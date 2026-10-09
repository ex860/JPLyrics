const LYRIC_URLS = ['https://utaten.com/lyric/*'];
const COPY_MODES = {
  all: '漢字有讀音 (HTML)',
  kanji: '漢字無讀音 (純文字)',
  kana: '全假名 (純文字)',
};
chrome.runtime.onInstalled.addListener(details => {
  showWelcomeOnce(details).catch(error => console.warn('無法開啟使用說明', error));
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({ id: 'copy-lyrics', title: '複製歌詞', contexts: ['all'], documentUrlPatterns: LYRIC_URLS });
    for (const [mode, title] of Object.entries(COPY_MODES)) {
      chrome.contextMenus.create({ id: mode, parentId: 'copy-lyrics', title, contexts: ['all'], documentUrlPatterns: LYRIC_URLS });
    }
  });
});
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!Object.hasOwn(COPY_MODES, info.menuItemId) || tab?.id == null) return;
  chrome.tabs.sendMessage(tab.id, { type: 'copy-lyrics', mode: info.menuItemId }, { frameId: 0 }, () => {
    if (chrome.runtime.lastError) console.warn('無法複製歌詞，請重新整理歌詞頁後再試。', chrome.runtime.lastError.message);
  });
});

// Keep this key stable across releases: the guide explains the context-menu migration.
async function showWelcomeOnce(details) {
  if (!['install', 'update'].includes(details.reason)) return;
  const { contextMenuGuideShown } = await chrome.storage.local.get('contextMenuGuideShown');
  if (contextMenuGuideShown) return;
  await chrome.tabs.create({ url: chrome.runtime.getURL('welcome.html'), active: true });
  await chrome.storage.local.set({ contextMenuGuideShown: true });
}
