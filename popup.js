var getSelectedTab = (tab) => {
    var tabId = tab.id;
    var sendMessage = (messageObj) => chrome.tabs.sendMessage(tabId, messageObj);
    document.getElementById('all').addEventListener('click', () => sendMessage({ mode: 'all' }));
    document.getElementById('kanji').addEventListener('click', () => sendMessage({ mode: 'kanji' }));
    document.getElementById('kana').addEventListener('click', () => sendMessage({ mode: 'kana' }));
}
chrome.tabs.getSelected(null, getSelectedTab);