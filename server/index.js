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

        //Student document exists
        if (student) {
            //Check if course has been tracked already
            let cond = (course) => course.course_id === req.body.courseId;
            let index = student.courses.findIndex(cond);
            if (index === -1) {
                //Add the course with the tracked assignment
                let course = {
                    course_name: req.body.courseName,
                    course_id: req.body.courseId,
                    assignments: [],
                    announcements: [],
                    pages: []
                }
    
                course[req.body.type].push({
                    name: req.body.itemName,
                    link: req.body.itemLink
                });

                let set = {
                    courses: course
                };

                collection.updateOne({
                    user_name: userName,
                    user_id: userId
                }, {
                    $push: set
                }, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                });
            } else {
                //push the item onto the existing assignment type
                let set = {};
                set['courses.' + index + '.' + req.body.type] = {name: req.body.itemName, link: req.body.itemLink};

                collection.updateOne({
                    user_name: userName,
                    user_id: userId
                }, {
                    $push: set
                }, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        } else {
            //create the course the tracked item will go into
            let course = {
                course_name: req.body.courseName,
                course_id: req.body.courseId,
                assignments: [],
                announcements: [],
                pages: []
            }

            course[req.body.type].push({
                name: req.body.itemName,
                link: req.body.itemLink
            });

            //Create a student document
            collection.insertOne({
                user_name: userName,
                user_id: userId,
                courses: [course]
            })
        }
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
});

app.delete('/items/delete', async function(req, res) {
    let userName = req.query.name;
    let userId = req.query.id;
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
            let cond = (course) => course.course_id === req.body.courseId;
            let index = student.courses.findIndex(cond);
            if (index === -1) {
                console.log('Course to delete from does not exist');
            } else {
                let pull = {};
                //Remove from item category by assignment name, since links may change
                pull['courses.' + index + '.' + req.body.type] = {
                    name: req.body.itemName
                };

                collection.updateOne({
                    user_name: userName,
                    user_id: userId
                }, {
                    $pull: pull
                }, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        } else {
            console.log('Student does not exist and cannot delete item');
        }
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
});

app.listen(3000, () => {
    console.log('Listening at http://localhost:3000');
});