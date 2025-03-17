const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()// process.env.PORT ||
const port =process.env.PORT || 5000;
 
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());




const uri = "mongodb+srv://server_site_restaurant:8et1PrDHkwRPD9wm@cluster0.82zxr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

      
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");


    //Collections of data files name
    const FoodsCollection = client.db("FoodsItemsDB").collection("FoodsItems");


    //   all think you can enter

    //all data fetch
    app.get("/users", async (req, res) => {
      const findAllData = FoodsCollection.find()
      const result = await findAllData.toArray()
      res.send(result)
    })

    //Is specific data page
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id
      const findData = await FoodsCollection.findOne({ _id: new ObjectId(id) })
      res.send(findData)
    })

    //Upload section
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await FoodsCollection.insertOne(user)
      res.send(result)
    })


  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('khayakhaya mota how')
})

app.listen(port, () => {
    console.log(`Job is waiting at: ${port}`)
})