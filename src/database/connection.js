/*
Database Connection Code Artifact
Written by Mandeep Sran on July 13th 2020
Approved by Joseph Power on July 13th 2020. 

Mongoose is the node.js module for MongoDB. Chalk is used for styling I/O for testing and implementation purposes only.
We use two functions in this artifact, connect and disconecct. 
    -Connect reads the database URI from environment variables ("process.env"), and establishes a secure connection from the server to the database.
    -Disconnect closes the connection to the database

I/O - Will output success in terminal if a successful connection is made, else "Unable to connect" error message. 
Errors in this module will be due to the database URI not being correct, no error handling can be done to fix this. The application will have to be redeployed with the correct settings. 

This module accesses environment variables and the MongoDB Database. 
*/
const mongoose = require('mongoose');
const chalk = require('chalk');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(process.env.DB_URI, (err) => {
    if (err) {
        console.log(
            `${chalk.redBright(
                'Unable to connect, please check connection url.'
            )} ${err}`
        );
    } else {
        console.log(chalk.green('✓ Connected to database.'));
    }
});

const disconnect = () => {
    return mongoose.connection.close();
};

module.exports = { disconnect };
