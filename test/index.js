'use strict';

var expect = require('expect.js');
var sinon = require('sinon');
var proxyquire = require('proxyquire').noPreserveCache();

var mock = sinon.mock;
var stub = sinon.stub;

describe('aws_lambda_app', function(){
  var snsEvent, event;

  beforeEach(function() {        
    process.env.AIRBRAKE_KEY = 'airbrake';
    process.env.FUNCTION_NAME = 'func';
    event = {
      my_custom_event: {
        test:true
      }
    };
    snsEvent = {
      'Records':[
        {
          'EventSource': 'aws:sns',
          'Sns':{
            'Message': JSON.stringify(event)
          }
        }     
      ]
    };    
  });

  function requireHandler(errorHandler){
    var requireStubs = {};    

    if (errorHandler) {
      requireStubs['./error_handler'] = errorHandler;
    }

    return proxyquire('../', requireStubs); 
  }

  function context(callback) {
    return {
      done:function(err, data) {
        callback(err, data);
      }
    };    
  }

  describe('when things are rosy', function() {
    it('calls the handler with parsed Sns message and a node callback', function(done) {
      var handler = mock();
      handler.withArgs(event).yields(null);
      var lambdaApp = requireHandler();
      var wrappedHandler = lambdaApp(handler);
      wrappedHandler(snsEvent, context(function() {
        handler.verify();
        done();
      }));
    });

    describe('when the event doesnt contain Records', function() {
      describe('when handler invokes callback with a result', function() {
        it('calls context.succeed with the result', function(done) {
          var result = {
            data: {
              name: 'test'
            }
          };
          var handler = stub();
          handler.yields(null, result);
          var lambdaApp = requireHandler();
          var wrappedHandler = lambdaApp(handler);
          wrappedHandler(event, context(function(err, data) {
            expect(data).to.eql(result);
            done();
          }));
        });
      });
    });
  });

  describe('when callback errs', function() {
    var handler, wrappedHandler, lambdaApp, error;

    beforeEach(function() {
      error = new Error('Boom!');
      handler = stub();
      handler.yields(error);       
    });

    it('calls the context.fail callback', function(done) {      
      lambdaApp = requireHandler();
      wrappedHandler = lambdaApp(handler);      
      wrappedHandler(snsEvent, context(function(err) {
        expect(err).to.eql(error);
        done();
      }));
    }); 

    it('calls error handler', function(done) {      
      var errorHandler = mock();
      errorHandler.once().withArgs(error).yields();
      lambdaApp = requireHandler(errorHandler);
      wrappedHandler = lambdaApp(handler);
      wrappedHandler(snsEvent, context(function() {
        errorHandler.verify();
        done();
      }));      
    });     
  });

});
