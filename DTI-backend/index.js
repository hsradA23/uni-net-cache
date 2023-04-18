// Requiring express package for routing
const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser')
const { exec } = require("child_process");

//--------------------------------------------------------------------------------
// Getting current IP from pantry
var srv;

const getServerIP = () => {
  fetch('https://getpantry.cloud/apiv1/pantry/f61ba144-6247-4450-aeda-08136042b06d/basket/newBasket1', {mode:"no-cors",headers: {
    'Content-Type': 'application/json'
    }}).then(r => r.json())
        .then(j => srv = j["ip"])
        .catch(err => console.log(err))
};

setInterval(() => {
  fetch('http://'+srv+':3000/testapi').then(r=>r.text()).then(t => {
    if(t === 'OK'){
      //console.log('Server Connected at: ' + srv)
    }
    else{
      //exec('python3 updateIP.py', () => {});
      getServerIP();
    }
  })
  .catch(e => {
    getServerIP();    
  })
}, 20000);

getServerIP();

// --------------------------------------------------------------------------------
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://CodingBabas3:WeG0nnaRoc27h1s@internetcache.qeoizsj.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

client.connect(err => {
  if (err) {
    console.error(err);
  } else {
    console.log("DataBase Connected");
    const collection = client.db("CacheTable").collection("DownloadLinks");
    client.close();
  }
});


// Function to update the frequency of a link in the LinkFrequency collection
async function updateLinkFrequency(query) {
  try {
    await client.connect();
    const collection = client.db("CacheTable").collection("LinkFrequency");

    // Find and update the frequency of the link or insert a new entry if it doesn't exist
    const result = await collection.findOneAndUpdate(
      { internetLink: query },
      { $inc: { frequency: 1 } },
      { upsert: true, returnOriginal: false }
    );

    // If the frequency is greater than or equal to 10 (Arbitrary, can be changed), add an entry to the DownloadLinks collection
    if (result.value.frequency == 10) {
      const downloadLinksCollection = client.db("CacheTable").collection("DownloadLinks");
      await downloadLinksCollection.insertOne({
        internetLink: query,
        localLink: "localFile"
      });
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

// Find local link for the internert link query within DownloadLinks. If none exist, returns "NO_FILE"
async function findLocalLink(query) {
  try {
    await updateLinkFrequency(query);
    await client.connect();
    const collection = client.db("CacheTable").collection("DownloadLinks");
    const result = await collection.findOne({ internetLink: query });
    if (result) {
      return result.localLink;
    } else {
      return "NO_FILE";
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}
// ----------------------------------------------------------------------------------


const localFilesMap = {
  "https://ftp.jaist.ac.jp/pub/eclipse/oomph/epp/2023-03/R/eclipse-inst-jre-win64.exe":'code-1.75.1-1675893486.el7.x86_64.rpm',
  'https://repo.extreme-ix.org/ubuntu-releases/22.04.2/ubuntu-22.04.2-desktop-amd64.iso':'Fedora-KDE-Live-x86_64-37-1.7.iso',
}


// Creating app
const app = express();
app.use(cors())
app.use('/downloads', express.static('/home/adarsh/Downloads'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// The folder path for the files
const folderPath = '/home/adarsh/Downloads/';

app.get('/files/:link', (req, res) => {
	console.log('Request for: ' + req.params.link)
  //findLocalLink().then(f => console.log('local file: ' + f))
  if(localFilesMap[req.params.link]){
    console.log('Local file: ' + localFilesMap[req.params.link])
	  res.send( 'http://'+srv+':3000/downloads/'+localFilesMap[req.params.link]);
  }
  else{
    res.send('NO_FILE');
  }

	//findLocalLink('testInternetLink').then( r => console.log(r))
	//res.send( 'http://'+srv+':3000/downloads/'+'code-1.75.1-1675893486.el7.x86_64.rpm');
})

app.get('/testapi', (req, res) => {
	res.send( 'OK');
})

// Creating server at port 3000
app.listen(3000,function(req,res){
	console.log('Server started to listen at 3000');
})

