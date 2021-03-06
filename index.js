const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json())
app.use(cors())
const jwtVerify = async (req, res, next) => {
    const authHeaders = req.headers.authorization
    if (!authHeaders) {
        return res.status(401).send({ message: 'unauthorized access' })
    }
    const token = authHeaders.split(' ')[1]
    jwt.verify(token, process.env.TOKEN_SECRATE, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'forbidden access' })
        }
        req.decoded = decoded
        next()
    })
}
const run = async () => {

    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bhhzy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        await client.connect()
        const phoneCollection = client.db("inventory").collection("phone");

        console.log('database connect')

        app.get('/products', async (req, res) => {
            const cursor = phoneCollection.find()
            const result = await cursor.toArray()
            res.send({ result });
        })
        app.get('/myitems',jwtVerify, async (req, res) => {
            const email =req.decoded.email;
            console.log(email)
            const cursor = phoneCollection.find({email})
            const result = await cursor.toArray()
            res.send({ result });
        })
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const result = await phoneCollection.findOne({ _id: ObjectId(id) })
            res.send({ result });
        })
        app.post('/products', async (req, res) => {
            const { name, about, image, price, quantity, email, supplier } = req.body;

            const result = await phoneCollection.insertOne({ name, about, image, price, quantity, email, supplier })
            res.send({ result });
        })
        app.post('/login', async (req, res) => {
            const {  email } = req.body;
            const token = jwt.sign({ email },  process.env.TOKEN_SECRATE,{
                expiresIn:'1d'
            });
            res.send({token});
        })
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const result = await phoneCollection.deleteOne({ _id: ObjectId(id) })
            res.send({ result });
        })
        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const quantity = req.body.quantity;
            const result = await phoneCollection.updateOne({ _id: ObjectId(id) }, { $set: { quantity } }, { upsert: true })
            res.send({ result });
        })
    }
    finally {

    }


}

run().catch(console.log)

app.get('/', (req, res) => {
    res.send('Server is online...')
})

app.listen(port, () => {
    console.log('Listening to port', port)
})