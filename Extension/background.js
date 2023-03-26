chrome.downloads.onCreated.addListener(function(downloadItem) {


  if(downloadItem.url.startsWith("http://localhost")){
    console.log("Local file, doing nothing.")
    return;
  }
  
  fetch("http://localhost:3000/files/"+encodeURIComponent(downloadItem.url))
  .then((response) => response.text())
  .then((text) => {
    console.log("Redirecting to:", text);

    chrome.downloads.download({
      url: text,
    });

  })
  .catch(err => console.log(err));
  chrome.downloads.cancel(downloadItem.id);
});
