const express = require('express');
require('dotenv').config()// process.env.PORT ||
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json(), cookieParser());


const uri = `mongodb+srv://${process.env.User_Name}:${process.env.User_Password}@cluster0.82zxr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const logger = (req, res, next) => {
  next();
}

const verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    console.log(" No token in cookies");
    return res.status(401).send({ message: 'Unauthorized Access' });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log(" JWT Verify Failed:", err.message);
      return res.status(403).send({ message: 'Forbidden' });
    }
    console.log(" Token verified. User:", decoded);
    req.user = decoded;
    next();
  });
}



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

    //Collections of order
    const OrdersCollection = client.db("OrdersDB").collection("OrdersItems");





    //   all think you can enter

    //all data fetch
    app.get("/users", logger, async (req, res) => {
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


    // JWT section
    app.post('/jwt', (req, res) => {
      const user = req.body;
      // console.log(ACCESS_TOKEN_SECRET);
      console.log(user);
      console.log("This is TOken :",process.env.ACCESS_TOKEN_SECRET);
      console.log("This is user :",user);
      
      const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
      res.cookie('token', token, {
        httpOnly: true,
        secure: false, // Set to true if using HTTPS
        sameSite: 'lax' // 'none' + secure: true যদি cross-origin হয়
      }).send({ success: true })
    })

    //Upload section
    


    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const user = req.body;
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          image: user.image,
          name: user.name,
          taste: user.taste, // cookstyle, taste এগুলো আলাদা ফিল্ড, তাই যোগ করেছি
          cookstyle: user.cookstyle,
          ingredient: user.ingredient,
          description: user.description,
          price: user.price,
          rating: user.rating,
          quantity: user.quantity
        }
      }
      const result = await FoodsCollection.updateOne(filter, updateDoc, options);
      res.send(result)
    })



    // This is delete section
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const result = await FoodsCollection.deleteOne(filter)
      res.send(result)
    })


    // app.patch("/users/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const updatedData = req.body;

    //   const result = await FoodsCollection.updateOne(
    //     { _id: new ObjectId(id) },
    //     { $set: updatedData }
    //   );

    //   res.send(result);
    // });

    app.patch("/users/:id", async (req, res) => {
      const id = req.params.id;
      const { purchaseQuantity } = req.body;

      const filter = { _id: new ObjectId(id) }; 1
      const food = await FoodsCollection.findOne(filter);

      const currentQuantity = parseInt(food.quantity);
      const currentCount = parseInt(food.purchaseCount || 0);

      const updateDoc = {
        $set: {
          quantity: currentQuantity - purchaseQuantity,
          purchaseCount: currentCount + purchaseQuantity,
        }
      };

      const result = await FoodsCollection.updateOne(filter, updateDoc);
      res.send(result);
    });



    app.get("/orders", verifyToken, async (req, res) => {
      const email = req.query.email;
      console.log("hi");
      const query = { buyerEmail: email }
      if (req.user.email !== req.query.email) {
        return res.status(403).send({ message: 'forbidden access' })
      }
      const findAllData = OrdersCollection.find(query)
      const result = await findAllData.toArray()
      res.send(result)
    })

    app.get("/orders/:id", async (req, res) => {
      const id = req.params.id
      const findData = await OrdersCollection.findOne({ _id: new ObjectId(id) })
      res.send(findData)
    })

    app.post('/logout', (req, res) => {
      res.clearCookie('token', {
        httpOnly: true,
        secure: false, // Set to true if using HTTPS
      }).send({ success: true })
    })

    app.post("/orders", async (req, res) => {
      const user = req.body;
      const result = await OrdersCollection.insertOne(user)
      res.send(result)
    })


    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const result = await OrdersCollection.deleteOne(filter)
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