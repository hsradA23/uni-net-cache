const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "";
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
