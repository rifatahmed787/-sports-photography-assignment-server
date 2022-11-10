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
    const reviewCollection = client
      .db("sportsPhotgraphy")
      .collection("reviews");

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
      const services = await (await cursor.toArray()).reverse();
      res.send(services);
    });

    //get by services id
    app.get("/service/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    //add service post method
    app.post("/services", async (req, res) => {
      const add = req.body;
      const result = await serviceCollection.insertOne(add);
      res.send(result);
    });

    //my review api
    app.get("/reviews", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    app.get("/review/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const review = await reviewCollection.findOne(query);
      res.send(review);
    });

    //review post data
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    //update api
    // app.patch("/reviews/:id", async (req, res) => {
    //   const id = req.params.id;
    //   const status = req.body.status;
    //   const query = { _id: ObjectId(id) };

    //   const updateDoc = {
    //     $set: {
    //       status: status,
    //     },
    //   };

    //   const result = await reviewCollection.updateOne(query, updateDoc);
    //   res.send(result);
    // });

    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.error(err));

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
