var srv;

const getServerIP = () => {
  fetch('https://getpantry.cloud/apiv1/pantry/f61ba144-6247-4450-aeda-08136042b06d/basket/newBasket1', {mode:"no-cors",headers: {
    'Content-Type': 'application/json'
    }}).then(r => r.json())
        .then(j => srv = j["ip"])
        .catch(err => console.log(err))
}

setInterval(() => {
  fetch('http://'+srv+':3000/testapi').then(r=>r.text()).then(t => {
    if(t === 'OK'){
      console.log('Server Connected at: ' + srv)
    }
    else{
      getServerIP();
    }
  })
  .catch(e => {
    getServerIP();    
  })
}, 10000)

chrome.downloads.onCreated.addListener(function(downloadItem) {
  if(downloadItem.url.startsWith("http://"+srv)){
    console.log("Local file, doing nothing.")
    return;
  }
  
  fetch("http://"+srv+":3000/files/"+encodeURIComponent(downloadItem.url))
  .then((response) => response.text())
  .then((text) => {

    if(text !== 'NO_FILE'){
      console.log("Redirecting to:", text);
      chrome.downloads.download({
        url: text,
        saveAs: false
        
      });
      chrome.downloads.cancel(downloadItem.id);
    }
  })
  .catch(err => console.log(err));
});
