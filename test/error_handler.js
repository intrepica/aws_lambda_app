'use strict';

var sinon = require('sinon');
var proxyquire = require('proxyquire').noPreserveCache();

var mock = sinon.mock;
var stub = sinon.stub;

describe('error_handler', function(){
  var airbrake, airbrakeClient, error;

  beforeEach(function() {        
    process.env.AIRBRAKE_KEY = 'airbrake_key';
    process.env.FUNCTION_NAME = 'func';

    airbrake = {
      createClient: function() {}      
    };
    airbrakeClient = {
      handleExceptions: function() {},
      notify: function() {}
    };  

    airbrake.createClient = stub();
    airbrake.createClient.returns(airbrakeClient);

    error = new Error('Boom!');          
  });

  function requireHandler(){
    var requireStubs = {
      airbrake:airbrake
    };

    return proxyquire('../error_handler', requireStubs);
  }  

  describe('setup', function() {  
    it('instantiates the airbrake client', function() {
      airbrake.createClient = mock();
      airbrake.createClient.once().withArgs('airbrake_key').returns(airbrakeClient);
      requireHandler();
      airbrake.createClient.verify();
    });

    it('calls handleExceptions the airbrake client', function() {
      airbrakeClient.handleExceptions = mock();
      airbrakeClient.handleExceptions.once();
      requireHandler();
      airbrakeClient.handleExceptions.verify();
    });    
  });

  describe('when called', function() {
    beforeEach(function() {
      airbrakeClient.notify = stub();
      airbrakeClient.notify.yields();
    });

    it('calls airbrake notify with the error', function(done) {
      airbrakeClient.notify = mock();
      airbrakeClient.notify.once().withArgs(error).yields();
      var errorHandler = requireHandler(airbrake);
      errorHandler(error, function() {
        airbrakeClient.notify.verify();
        done();
      });      
    }); 
  });

});
