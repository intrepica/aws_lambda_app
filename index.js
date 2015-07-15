'use strict';

var lambdaHandler = require('aws_lambda_handler');
var errorHandler = require('./error_handler');

module.exports = function(handler) {
	return lambdaHandler(handler, errorHandler);
};