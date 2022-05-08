const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require ('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json())
app.use(cors())

const run = async () => {

    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bhhzy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
    
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
        await client.connect()
        const phoneCollection = client.db("inventory").collection("phone");

        console.log('database connect')

 app.get('/products',async(req,res)=>{
    const cursor= phoneCollection.find()
    const result =await cursor.toArray()
    res.send ({result});
 })
 app.post('/products',async(req,res)=>{
     const {name,about,image,price,quantity,email,supplier}=req.body;
     
    const result=await phoneCollection.insertOne({name,about,image,price,quantity,email,supplier})
    res.send ({result});
 })



    }
    finally {

    }


}

run().catch(console.log)

app.get('/', (req, res) => {
    res.send('I can code node  wow!')
})

app.listen(port, () => {
    console.log('Listening to port', port)
})