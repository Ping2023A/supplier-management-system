const { MongoClient } = require("mongodb");

const uri = "mongodb://smsAdmin:pingping@ac-hgseil6-shard-00-00.kvnuple.mongodb.net:27017,ac-hgseil6-shard-00-01.kvnuple.mongodb.net:27017,ac-hgseil6-shard-00-02.kvnuple.mongodb.net:27017/supplierDB?ssl=true&replicaSet=atlas-1ludj9-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

async function run() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("✅ Connected to MongoDB!");
    await client.close();
  } catch (err) {
    console.error("❌ Connection failed:", err);
  }
}

run();
