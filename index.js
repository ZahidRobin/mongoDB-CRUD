const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const uri = "mongodb+srv://zahidrobin:robin@123@cluster0.uc5p6.mongodb.net/organicDB?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true,  useUnifiedTopology: true });


const app = express();
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());

client.connect(err => {
  const collection = client.db("organicDB").collection("products");
  app.post('/addProduct', (req, res) => {
      const product = req.body; 
      collection.insertOne(product)
      .then(result => {
        // console.log("One Product Added");
        res.redirect('/')
      })
  })

  app.get('/products', (req, res) => {
      collection.find({})
      .toArray( (err, documents) => {
          res.send(documents)
      })
  })

  app.delete('/delete/:id', (req, res) => {
    collection.deleteOne({_id: ObjectId(req.params.id)})
    .then((result) => {
      res.send(result.deletedCount > 0);
    })
  })

  app.get('/singleProduct/:id', (req, res) => {
    collection.find({_id: ObjectId(req.params.id)})
    .toArray((err, documents) => {
      res.send(documents[0])
    })
  })

  app.patch('/update/:id', (req, res) => {
    collection.updateOne({_id: ObjectId(req.params.id)},
      {
        $set: {price: req.body.price, quantity: req.body.quantity}
      })
      .then(result => {
        res.send(result.modifiedCount > 0)
      })
  })
});

app.get('/', (req, res) =>{
    res.sendFile(__dirname + "/index.html")
})
app.listen(3000)