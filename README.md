#Aws Lambda App

Wraps aws_lambda_handler providing an airbrake error handler.

[![Build Status](https://semaphoreci.com/api/v1/projects/553c8550-5a94-4e3b-8bb4-49df3678bd36/483484/badge.svg)](https://semaphoreci.com/lp/aws_lambda_app)

Requires the following ENV variables.

```bash
AIRBRAKE_KEY - api key
FUNCTION_NAME - name of lambda handler to tag the error object with
```

#Example

```js

  'use strict';

  require('dotenv').load();

  var lambdaHandler = require('aws_lambda_handler');

  exports.handler = lambdaHandler(function(message, callback) {

    // Triggers airbrake.
    callback(new Error('Boom!'));
  });

```
