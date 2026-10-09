# JPLyrics

在 UtaTen 歌詞頁按右鍵，選擇「複製歌詞」即可複製日文歌詞。

- 漢字有讀音 (HTML)：使用 Ruby 標籤，字體大小固定為 5。
- 漢字無讀音 (純文字)。
- 全假名 (純文字)。

支援網站：[UtaTen](https://utaten.com/)，網址必須以 `https://utaten.com/lyric/` 開頭。其他網址不會顯示此右鍵選單。

## 使用方式

1. 開啟 UtaTen 歌詞頁，等待歌詞載入。
2. 在頁面按右鍵，選擇「複製歌詞」，再選擇需要的模式。
3. 出現「歌詞已複製！」後，即可貼到需要的地方。

## 本機安裝／更新

在 Chrome 的 `chrome://extensions` 開啟開發人員模式，使用「載入未封裝項目」選取此專案目錄。更新程式後按擴充功能的重新載入按鈕，再重新整理已開啟的歌詞頁。

Chrome Extension：[日文歌詞下載](https://chrome.google.com/webstore/detail/pmdlhfbdfflgchidenaommfoadiedlmo)

## 新版首次使用提示

首次安裝或首次升級到右鍵選單版本時，會自動開啟使用說明分頁，介紹新的複製入口。提示顯示狀態只記錄在本機；後續更新或重新啟動不會重複開啟。移除後重新安裝會再次顯示。
