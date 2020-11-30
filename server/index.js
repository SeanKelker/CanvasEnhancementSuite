const { MongoClient } = require("mongodb");
require('dotenv').config();

const bodyParser = require("body-parser");
var express = require('express');
var app = express();

const uri = process.env.URI;
const client = new MongoClient(uri);

app.use(bodyParser.json());

app.get('/courses', async function(req, res){
    let userName = req.query.name;
    let userId = req.query.id;
    try {
        await client.connect();
        const database = client.db(process.env.DB_NAME);
        const collection = database.collection(process.env.COLLECTION_NAME);
        const query = { user_name: userName, user_id: userId };
        const student = await collection.findOne(query);
        console.log(student);
        if (student) {
            res.json(student.courses);
        } else {
            res.json({});
        }
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
});

app.post('/items/add', async function(req, res) {
    console.log(req.body);
    let userName = req.query.name;
    let userId = req.query.id;
    try {
        await client.connect();
        const database = client.db(process.env.DB_NAME);
        const collection = database.collection(process.env.COLLECTION_NAME);
        const query = { user_name: userName, user_id: userId };
        const student = await collection.findOne(query);
        console.log(student);
        if (student) {
            //Add item into tracked important items
        } else {
            //Create a student document
        }
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
});

app.delete('/items/delete', async function(req, res) {
    console.log(req.body);
    try {
        await client.connect();
        const database = client.db(process.env.DB_NAME);
        const collection = database.collection(process.env.COLLECTION_NAME);
        // Query for a movie that has the title 'Back to the Future'
        const query = { user: req.params.user };
        const student = await collection.findOne(query);
        console.log(student);
        if (student) {
            //If the item is currently tracked delete it, if not then leave it
        } else {
            //Create a student document
        }
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
});

app.listen(3000, () => {
    console.log('Listening at http://localhost:3000');
});