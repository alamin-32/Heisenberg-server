const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();
const app = express();


app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fv9gj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productsCollection = client.db('assignment-11').collection('products');

        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productsCollection.find(query);
            const product = await cursor.toArray();
            res.send(product);
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const product = await productsCollection.findOne(query)
            res.send(product);
        })


        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const quantity = req.body;
            console.log(quantity);
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    quantity: quantity.quantity
                }
            }
            const result = await productsCollection.updateOne(filter, updatedDoc, options)
            res.send(result)
        })




        app.post('/products', async (req, res) => {
            const newProducts = req.body;
            const result = await productsCollection.insertOne(newProducts);
            res.send(result);
        })

        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query)
            res.send(result)
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running my assignment-11 server')
})

app.listen(port, () => {
    console.log('Listening to port', port)
})