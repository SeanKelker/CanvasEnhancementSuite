const { MongoClient } = require("mongodb");
require('dotenv').config();

const bodyParser = require("body-parser");
var express = require('express');
var app = express();

const username = "zakgraber";
const password = "thYIMXWbomUy8y7G";
const dbname = "canvasDocs";

// const uri = process.env.URI;
//const uri = "mongodb+srv://" + username + ":" + password + "@canvasenhancementsuite.amiv0.mongodb.net/" + dbname + "?retryWrites=true&w=majority";
//const client = new MongoClient(uri, { useNewUrlParser: true });
// const client = new MongoClient(uri, { useNewUrlParser: true });

const {Connection} = require('./mongo.js');

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "*")
    next();
});

app.get('/courses', async function(req, res){
    let userName = req.query.name;
    let userId = req.query.id;
    try {

        const database = Connection.db.db(process.env.DB_NAME);
        const collection = database.collection(process.env.COLLECTION_NAME);
        const query = { user_name: userName, user_id: userId };
        const student = await collection.findOne(query);
        console.log(student);
        if (student) {
            res.json(student.courses);
        } else {
            res.json({});
        }
    } catch(err) {
        console.log(err);
        res.json({});
    }
});

app.post('/items/add', async function(req, res) {
    console.log(req.body);
    let userName = req.query.name;
    let userId = req.query.id;
    try {
        const database = Connection.db.db(process.env.DB_NAME);
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
                        res.json({success: false})
                    } else {
                        res.json({success: true})
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
                        res.json({success: false})
                    } else {
                        res.json({success: true})
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
            }, function(err, result){
                if (err) {
                    console.log(err);
                    res.json({success: false})
                } else {
                    res.json({success: true})
                }
            });
        }
    } catch (err) {
        console.log(err);
    }
});

app.delete('/items/delete', async function(req, res) {
    let userName = req.query.name;
    let userId = req.query.id;
    console.log(req.body);
    try {
        const database = Connection.db.db(process.env.DB_NAME);
        const collection = database.collection(process.env.COLLECTION_NAME);
        // Query for a movie that has the title 'Back to the Future'
        const query = { user_name: userName, user_id: userId };
        const student = await collection.findOne(query);
        //console.log(student);
        if (student) {
            console.log(student)
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
                        res.json({success: false})
                    } else {
                        res.json({success: true})
                    }
                });
            }
        } else {
            console.log('Student does not exist and cannot delete item');
        }
    } catch(err) {
        console.log(err);
    }
});

app.listen(3000, () => {
    console.log('Listening at http://localhost:3000');
    Connection.connectToMongo();
});

