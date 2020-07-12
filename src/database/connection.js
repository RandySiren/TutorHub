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
