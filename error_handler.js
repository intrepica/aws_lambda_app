var env = process.env;

if (!env.AIRBRAKE_KEY) {
	throw new Error('AIRBRAKE_KEY is not defined');
}

if (!env.FUNCTION_NAME) {
	throw new Error('FUNCTION_NAME is not defined');
}

var airbrake = require('airbrake');
var errorHandler = airbrake.createClient(process.env.AIRBRAKE_KEY);

errorHandler.host = process.env.FUNCTION_NAME;
errorHandler.handleExceptions();

module.exports = function(err, callback) {
	return errorHandler.notify(err, function() {
		callback(err);
	});
};