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
        const subTaskCollection = database.collection("subTasks");

        // save task to database
        app.post('/tasks', async (req, res) => {
            const task = req.body;
            console.log(req.body)
            const result = await taskCollection.insertOne(task)
            res.json(result)

        });
        // save task to database
        app.post('/subTasks', async (req, res) => {
            const task = req.body;
            console.log(req.body)
            const result = await subTaskCollection.insertOne(task)
            res.json(result)

        });

        // get all tasks
        app.get('/subTasks', async (req, res) => {
            const cursor = subTaskCollection.find({});
            const task = await cursor.toArray();
            res.send(task);
        });

        app.put('/subTasks/:id', async (req, res) => {
            const id = req.params.id;
            console.log('updating', id)
            const updatedStatus = req.body;
            // console.log(updatedStatus)
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = { $set: { status: updatedStatus.status } };
            const result = await subTaskCollection.updateOne(filter, updateDoc, options)
            res.json(result)


        });

        // get a single data from services database
        app.get('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const task = await taskCollection.findOne(query);
            res.json(task);
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