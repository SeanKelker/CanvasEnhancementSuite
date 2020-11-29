const { MongoClient } = require("mongodb");
require('dotenv').config();

const bodyParser = require("body-parser");
var express = require('express');
var app = express();

const uri = process.env.URI;
const client = new MongoClient(uri);

app.use(bodyParser.json());

app.get('/courses:user', function(req, res){
    try {
        await client.connect();
        const database = client.db(process.env.DB_NAME);
        const collection = database.collection(process.env.COLLECTION_NAME);
        // Query for a movie that has the title 'Back to the Future'
        const query = { user: req.params.user };
        const student = await collection.findOne(query);
        console.log(student);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
});

app.post('/items/add:user', function(req, res) {
    console.log(req.body);
});

app.delete('/items/delete:id', function(req, res) {

})

app.listen(3000, () => {
    console.log('Listening at http://localhost:3000');
});