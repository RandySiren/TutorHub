/**
 * Application start point, all code will be documented with explanation of what it does.
 */

/* List module dependencies */
const express = require('express');
const dotenv = require('dotenv');
const chalk = require('chalk');
const errorHandler = require('errorhandler');

/* Configure dotenv path to load environment variables for API keys and passwords */
dotenv.config({ path: '.env' });

/* Create Express server */
const app = express();

/* Setup port or rely on default */
app.set('port', process.env.PORT || 8080);

/* Homepage GET route */
app.get('/', (req, res) => {
	res.send('Serve pages');
});

/* Setup error handler */
if (process.env.NODE_ENV === 'development') {
	// only use in development
	app.use(errorHandler());
} else {
	app.use((err, req, res, next) => {
		console.error(err);
		res.status(500).send('Server Error');
	});
}
/* Start Express server */
app.listen(app.get('port'), () => {
	console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
	console.log('Press CTRL-C to stop.\n');
});

module.exports = app;
