const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bfv30pl.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const Collection = client.db("Ema-Jhon-Shop-").collection("product-Info");
    const product = { name: "shoes" };
    const result = await Collection.insertOne(product);
    app.get("/products", async (req, res) => {
      const currentPage = parseInt(req.query.currentPage);
      const size = parseInt(req.query.size);
      // console.log(currentPage, size);
      const query = {};
      const findProduct = Collection.find(query);
      const products = await findProduct.skip(currentPage*size).limit(size).toArray();
      const count = await Collection.countDocuments();
      res.send({ count, products });
    });
    app.post('/productsById',async(req,res)=>{
      const ids = req.body
      console.log(ids)
      const objectId = ids.map(id => new ObjectId(id))
      const query ={_id : {$in: objectId}}
      const findProducts = Collection.find(query)
      const result = await findProducts.toArray()
      res.send(result)
    })
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is created");
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("api is running"));
