const mongoose = require('mongoose');
require('dotenv').config();

module.exports = {
    init: () => {
        const dbOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: false,
            poolSize: 5,
            connectTimeoutMS: 10000,
            family: 4
        };

        mongoose.connect(`mongodb+srv://annieleonhart:${process.env.PASS}@annie.s5ayp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, dbOptions)
        mongoose.set('useFindAndModify', false);
        mongoose.Promise = global.Promise;

        mongoose.connection.on('connected', () => {
            console.log('Database connected.');
        })

        mongoose.connection.on('disconnected', () => {
            console.log('Database disconnected.');
        })

        mongoose.connection.on('err', (err) => {
            console.log('Error connecting to database: ' + err);
        })
    }
}