const mongoose = require('mongoose');

const connectToDb = async ()=>{
    try {
        const conn = await mongoose.connect("mongodb://localhost:27017/vote-app", {
            useNewUrlParser: true,
            useUnifiedTopology: true 
        });
        console.log(`Connected to mongodb at: ${conn.connection.host}`)
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectToDb;