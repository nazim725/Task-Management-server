const express = require('express')
const app = express();
const port = process.env.PORT || 5000
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId

const cors = require('cors')
require('dotenv').config();

// middleWare
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9s2cu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log("connected database")
        const database = client.db("Task-Manager");
        const taskCollection = database.collection("tasks");

        // save task to database
        app.post('/tasks', async (req, res) => {
            const task = req.body;
            console.log(req.body)
            const result = await taskCollection.insertOne(task)
            res.json(result)

        });

        // get all tasks
        app.get('/tasks', async (req, res) => {
            const cursor = taskCollection.find({});
            const task = await cursor.toArray();
            res.send(task);
        });

        app.put('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            console.log('updating', id)
            const updatedStatus = req.body;
            // console.log(updatedStatus)
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = { $set: { status: updatedStatus.status } };
            const result = await taskCollection.updateOne(filter, updateDoc, options)
            res.json(result)


        });

       



    }
    finally {
        // await client.close(()
    }

}
run().catch(console.dir)



app.get('/', (req, res) => {
    res.json('Task Manager Server')
})

app.listen(port, () => {
    console.log(`Listening Task Manager at :${port}`)
})