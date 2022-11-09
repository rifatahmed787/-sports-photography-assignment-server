const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Assignment four server");
});

//middleWare
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bathfkv.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollection = client
      .db("sportsPhotgraphy")
      .collection("services");

    //get limit sevices
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.limit(3).toArray();
      res.send(services);
    });

    //get all the services
    app.get("/service", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    //get by services id
    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    app.post("/services", async (req, res) => {
      const add = req.body;
      const result = await serviceCollection.insertOne(add);
      res.send(result);
    });

    //order api
    // app.get("/orders", verifyJWT, async (req, res) => {
    //   const decoded = req.decoded;
    //   console.log("inside order api", decoded);
    //   if (decoded.email !== req.query.email) {
    //     res.status(403).send({ message: "unauthorized access" });
    //   }
    //   let query = {};
    //   if (req.query.email) {
    //     query = {
    //       email: req.query.email,
    //     };
    //   }
    //   const cursor = orderCollection.find(query);
    //   const orders = await cursor.toArray();
    //   res.send(orders);
    // });

    // app.post("/orders", verifyJWT, async (req, res) => {
    //   const order = req.body;
    //   const result = await orderCollection.insertOne(order);
    //   res.send(result);
    // });

    // app.patch("/orders/:id", verifyJWT, async (req, res) => {
    //   const id = req.params.id;
    //   const status = req.body.status;
    //   const query = { _id: ObjectId(id) };

    //   const updateDoc = {
    //     $set: {
    //       status: status,
    //     },
    //   };

    //   const result = await orderCollection.updateOne(query, updateDoc);
    //   res.send(result);
    // });

    // app.delete("/orders/:id", verifyJWT, async (req, res) => {
    //   const id = req.params.id;
    //   const query = { _id: ObjectId(id) };
    //   const result = await orderCollection.deleteOne(query);
    //   res.send(result);
    // });
  } finally {
  }
}
run().catch((err) => console.error(err));

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
