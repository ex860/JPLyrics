const getSelectedTab = tabs => {
    const addClickEventListenerToSelector = (selector, message) => {
        document.getElementById(selector).addEventListener('click', () => {
            chrome.tabs.sendMessage(tabs[0].id, message)
        });
    };
    addClickEventListenerToSelector('all', { mode: 'all', fontSize: document.getElementById('font_size').value });
    addClickEventListenerToSelector('kanji', { mode: 'kanji' });
    addClickEventListenerToSelector('kana', { mode: 'kana' });
}
chrome.tabs.query({ active: true, currentWindow: true }, getSelectedTab);