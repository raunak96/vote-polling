const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
    os:{
        type: String,
        required: true
    },
    points:{
        type: Number,
        required: true
    }
});

const Vote = mongoose.model('vote',VoteSchema);

module.exports = Vote;