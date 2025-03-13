document.getElementById('saveSettings').addEventListener('click', () => {
  const folderName = document.getElementById('folderName').value || 'Kemono DL Folder';
  const groupByArtist = document.getElementById('groupByArtist').checked;
  const oneClickDownload = document.getElementById('oneClickDownload').checked;

  chrome.storage.local.set({ folderName, groupByArtist, oneClickDownload }, () => {
    console.log('Settings saved:', { folderName, groupByArtist, oneClickDownload });
    const saveMessage = document.getElementById('saveMessage');
    saveMessage.style.display = 'block';
    setTimeout(() => {
      saveMessage.style.display = 'none';
    }, 2000); // 2秒後にメッセージを非表示にする
  });
});

chrome.storage.local.get(['folderName', 'groupByArtist', 'oneClickDownload'], (result) => {
  console.log('Loaded settings:', result);
  if (result.folderName) {
    document.getElementById('folderName').value = result.folderName;
  }
  if (result.groupByArtist) {
    document.getElementById('groupByArtist').checked = result.groupByArtist;
  }
  if (result.oneClickDownload) {
    document.getElementById('oneClickDownload').checked = result.oneClickDownload;
  }
});