var MongoClient = require('mongodb').MongoClient;

var assert = require('assert');

class Connection {
    static async connectToMongo() {
        if (this.db) return this.db;
        this.db = new MongoClient('mongodb+srv://zakgraber:thYIMXWbomUy8y7G@canvasenhancementsuite.amiv0.mongodb.net/canvasDocs?retryWrites=true&w=majority'
        , this.options);
        await this.db.connect();
        console.log('Database Connected');
        return (this.db);
    }
}

Connection.db = null
Connection.options = {
    poolSize: 10,
    useUnifiedTopology: true
}
module.exports = {
    Connection
}