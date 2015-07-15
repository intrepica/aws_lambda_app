Aws Lambda App
====================

About
--------------
Wraps aws_lambda_handler providing an error handler.

Example
--------------

```js

  'use strict';

  require('dotenv').load();

  var lambdaHandler = require('aws_lambda_handler');

  exports.handler = lambdaHandler(function(message, callback) {

    // Triggers airbrake.
    callback(new Error('Boom!'));
  });

```
