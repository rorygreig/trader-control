var assert = require('chai').assert;
var async = require('async');
var TraderUtils = require('../lib/traderDBUtils.js');
var testUtils = require('./testUtils.js');
var mySQLWrapper = require('../lib/mySQLWrapper.js');

var testCoinfloorID = 1000;
var testCoinfloorPassword = "password";
var testCoinfloorAPIKey = "apikey162";
var testUserID;
var mySQLConnection = new mySQLWrapper('localhost', 'root', 'root', 'bitcoinloanstest');

describe('test create trader', function(){
  var testUserID;
  before(function(done){
    TraderUtils.createTraderInDB("test_user", testCoinfloorID, testCoinfloorPassword, testCoinfloorAPIKey, mySQLConnection, function(result){
      testUserID = result;
      TraderUtils.deleteTraderFromDB(result, mySQLConnection, function(){});
      done();
    });
  });

  it('should return an id',function(){
    assert.isNumber(testUserID, "is an id number");
    assert.operator(testUserID, '>', 0, 'non-zero id');
  });

});

describe('test get coinfloor credentials', function(){
  var testUserID;
  var res;

  before(function(done){
    TraderUtils.createTraderInDB("test_user", testCoinfloorID, testCoinfloorPassword, testCoinfloorAPIKey, mySQLConnection, function(result){
      testUserID = result;
      TraderUtils.getCoinfloorCredentials(testUserID, mySQLConnection, function(result){
        res = result;
        TraderUtils.deleteTraderFromDB(testUserID, mySQLConnection, function(){});
        done();
      });
    });
  });

  it('should return an object',function(){
    assert.isObject(res, "get credentials returned object");
  });

  it('should have the required properties', function(){
    assert.property(res, "coinfloorID", "has property coinfloorID");
    assert.property(res, "coinfloorPassword", "has property coinfloorPassword");
    assert.property(res, "coinfloorAPIKey", "has property coinfloorAPIKey");
  });

  it('properties should equal expected values', function(){
    assert.equal(res.coinfloorID, testCoinfloorID, "coinfloorID correct");
    assert.equal(res.coinfloorPassword, testCoinfloorPassword, "coinfloor password correct");
    assert.equal(res.coinfloorAPIKey, testCoinfloorAPIKey, "coinfloorAPIKey correct");
  });

});

describe('test get maintenance margin', function(){
  var testUserID;

  before(function(done){
    TraderUtils.createTraderInDB("test_user", testCoinfloorID, testCoinfloorPassword, testCoinfloorAPIKey, mySQLConnection, function(result){
      testUserID = result;
      done();
    });
  });

  describe('test default maintenance margin', function(){
    var expected = 0.2;
    var actual;
    before(function(done){
      TraderUtils.getMaintenanceReq(testUserID, mySQLConnection, function(result){
        actual = result;
        TraderUtils.deleteTraderFromDB(testUserID, mySQLConnection, function(){});
        done();
      });
    });

    it('check default maintenance margin', function(){
      assert.equal(actual, expected, "maintenance margin correct");
    });

  });

});

describe('test set maintenance margin', function(){
  var testUserID;
  var expected = 0.3;

  before(function(done){
    TraderUtils.createTraderInDB("test_user", testCoinfloorID, testCoinfloorPassword, testCoinfloorAPIKey, mySQLConnection, function(result){
        testUserID = result;
        TraderUtils.setMaintenanceReq(testUserID, expected, mySQLConnection, function(result){
        done();
      });
    });
  });

  describe('test default maintenance margin', function(){
    var actual;
    before(function(done){
      TraderUtils.getMaintenanceReq(testUserID, mySQLConnection, function(result){
        actual = result;
        var user = testUserID;
        TraderUtils.deleteTraderFromDB(user, mySQLConnection, function(){});
        done();
      });
    });

    it('check default maintenance margin', function(){
      assert.equal(actual, expected, "maintenance margin correct");
    });

  });

});

describe('test get all loans for user', function(){
  var testUserID;

  before(function(done){
    TraderUtils.createTraderInDB("test_user", testCoinfloorID, testCoinfloorPassword, testCoinfloorAPIKey, mySQLConnection, function(result){
        testUserID = result;
        testUtils.createTestLoans(testUserID, mySQLConnection, done);
    });
  });

  describe('test get all loans', function(){
    var actual;
    before(function(done){
      TraderUtils.getAllLoans(testUserID, function(result){
        actual = result;
        testUtils.clearTraderFromDB(testUserID, mySQLConnection, done);
      });
    });

    it('check result is an array', function(){
      assert.isArray(actual, "result is an array");
      assert.lengthOf(actual, 3, "array is expected length");
    });

  });

});

describe('test get all loans for an exchange for user', function(){
  var testUserID;

  before(function(done){
    TraderUtils.createTraderInDB("test_user", testCoinfloorID, testCoinfloorPassword, testCoinfloorAPIKey, mySQLConnection, function(result){
        testUserID = result;
        testUtils.createTestLoans(testUserID, mySQLConnection, done);
    });
  });

  describe('test get all loans for exchange', function(){
    var actual;
    before(function(done){
      TraderUtils.getLoansForExchange(testUserID, "coinfloor", mySQLConnection, function(result){
        actual = result;
        testUtils.clearTraderFromDB(testUserID, mySQLConnection, done);
      });
    });

    it('check result is an array', function(){
      assert.isArray(actual, "result is an array");
      assert.lengthOf(actual, 2, "array is expected length");
    });

  });

});

describe('test get total value of all loans', function(){
  var testUserID;

  before(function(done){
    TraderUtils.createTraderInDB("test_user", testCoinfloorID, testCoinfloorPassword, testCoinfloorAPIKey, mySQLConnection, function(result){
        testUserID = result;
        testUtils.createTestLoans(testUserID, mySQLConnection, done);
    });
  });

  describe('test total value of loans for exchange', function(){
    var actual;
    var expected = 0.33;
    before(function(done){
      TraderUtils.getTotalValueOfLoansForExchange(testUserID, "coinfloor", mySQLConnection, function(result){
        actual = result;
        testUtils.clearTraderFromDB(testUserID, mySQLConnection, done);
      });
    });

    it('check result is an array', function(){
      assert.equal(actual, expected, "total result is same as expected value");
    });

  });

});
