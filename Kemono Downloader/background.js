chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received in background:', message);
  if (message.action === 'download') {
    const url = message.url;
    const downloadFolder = message.downloadFolder;
    const filename = url.split('/').pop().split('?')[0]; // クエリパラメータを削除

    chrome.downloads.download({
      url: url,
      filename: `${downloadFolder}/${filename}`, // フルパスを指定
      saveAs: false, // ダイアログを表示しない
      conflictAction: 'uniquify'
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error('Download failed:', chrome.runtime.lastError.message);
      } else {
        console.log('Download started with ID:', downloadId);
      }
    });
  } else if (message.action === 'manualDownload') {
    // ポップアップからのダウンロード指示を受け取る
    console.log('Manual download triggered');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) return;
      const activeTab = tabs[0].id;
      chrome.scripting.executeScript({
        target: { tabId: activeTab },
        function: startDownload
      });
    });
  }
});

// 1クリックダウンロードが有効かどうかをチェックし、ポップアップを制御
chrome.storage.local.get(['oneClickDownload'], (result) => {
  chrome.action.setPopup({ popup: result.oneClickDownload ? '' : 'popup.html' });
});

// 設定が変更されたときにポップアップを更新
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.oneClickDownload) {
    chrome.action.setPopup({ popup: changes.oneClickDownload.newValue ? '' : 'popup.html' });
  }
});

// アイコンをクリックしたときの処理
chrome.action.onClicked.addListener((tab) => {
  chrome.storage.local.get(['oneClickDownload'], (result) => {
    if (result.oneClickDownload) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: startDownload
      });
    }
  });
});

// startDownload 関数
function startDownload() {
  const links = document.querySelectorAll('a.fileThumb.image-link');
  chrome.storage.local.get(['folderName', 'groupByArtist'], ({ folderName, groupByArtist }) => {
    const baseFolder = folderName || 'Kemono DL Folder';
    let artistFolder = '';
    let postFolder = '';

    if (groupByArtist) {
      const artistElement = document.querySelector("#main > section > header > div.post__user > div:nth-child(3) > a");
      const postElement = document.querySelector("#main > section > header > div.post__info > h1 > span:nth-child(1)");
      if (artistElement && postElement) {
        artistFolder = artistElement.textContent.trim();
        postFolder = postElement.textContent.trim();
      }
    }

    const fullPath = [baseFolder, artistFolder, postFolder].filter(Boolean).join('/');
    console.log('Download settings:', { folderName, groupByArtist });
    console.log('Full path:', fullPath);

    links.forEach(link => {
      chrome.runtime.sendMessage({ action: 'download', url: link.href, downloadFolder: fullPath });
    });
  });
}
