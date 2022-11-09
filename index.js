const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express()
const port = process.env.PORT || 5000;

//middle ware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.6ertblk.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('photoMagic').collection('services');
        const reviewCollection = client.db('photoMagic').collection('reviews');

        //get all services data from database
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const cursor2 = serviceCollection.find(query).limit(3);
            const limitServices = await cursor2.toArray();
            const services = await cursor.toArray();
            res.send({ limitServices, services })
        });

        //get particuller service data from database using id
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        //post reviews using client data (api)
        app.post('/reviews', async (req, res) => {
            const reviews = req.body;
            const result = await reviewCollection.insertOne(reviews);
            res.send(result)
        });

        //get reviews data from database
        app.get('/reviews', async (req, res) => {
            let query = {}; 
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews)
        });

    }
    finally {

    }
}
run().catch(err => console.error(err))


app.get('/', (req, res) => {
    res.send('photo magic running in server display side')
})

app.listen(port, () => {
    console.log(`photo magic server running on : ${port}`);
})