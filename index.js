const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB credentials and connection string
const uri = "mongodb+srv://readers-paradise:ddWjFCdV0rhm5ULw@cluster0.avtmd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with MongoClientOptions
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server
    await client.connect();

    const database = client.db("userDB");
    const userCollection = database.collection("user");

    app.get('/users', async(req, res) =>{
      const cursor = userCollection.find()
      const result = await cursor.toArray();
      res.send(result);
    })
    // POST route to add users
    app.post('/users', async (req, res) => {
      try {
        const user = req.body;
        console.log('New user:', user);

        const result = await userCollection.insertOne(user);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Failed to add user" });
      }
    });

    // Confirm MongoDB connection
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
}

// Call `run` to set up MongoDB
run().catch(console.dir);

// Base route
app.get('/', (req, res) => {
  res.send('SIMPLE CRUD IS RUNNING');
});

// Start the server
app.listen(port, () => {
  console.log(`SIMPLE CRUD IS RUNNING on port: ${port}`);
});
