const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://vidya7395:s1NyyjwHPzPQ5VbN@namastenode.efdaa.mongodb.net/");

}



module.exports = {connectDB};