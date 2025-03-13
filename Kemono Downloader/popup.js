document.getElementById('settingsButton').addEventListener('click', () => {
  const settingsDiv = document.getElementById('settings');
  settingsDiv.style.display = settingsDiv.style.display === 'block' ? 'none' : 'block';
});

document.getElementById('saveSettings').addEventListener('click', () => {
  const folderName = document.getElementById('folderName').value || 'Kemono DL Folder';
  const groupByArtist = document.getElementById('groupByArtist').checked;
  const oneClickDownload = document.getElementById('oneClickDownload').checked;

  chrome.storage.local.set({ folderName, groupByArtist, oneClickDownload }, () => {
    console.log('Settings saved:', { folderName, groupByArtist, oneClickDownload });
    document.getElementById('saveMessage').style.display = 'block';
    setTimeout(() => {
      document.getElementById('saveMessage').style.display = 'none';
    }, 2000);

    if (oneClickDownload) {
      window.close();
    }
  });
});

chrome.storage.local.get(['folderName', 'groupByArtist', 'oneClickDownload'], (result) => {
  if (result.folderName) document.getElementById('folderName').value = result.folderName;
  if (result.groupByArtist) document.getElementById('groupByArtist').checked = result.groupByArtist;
  if (result.oneClickDownload) document.getElementById('oneClickDownload').checked = result.oneClickDownload;
});

// ダウンロードボタン押下時に `background.js` に通知して `startDownload()` を実行
document.getElementById('downloadButton').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'manualDownload' });
});
