var assert = require('chai').assert;
var checkBalance = require('../lib/checkBalance.js');
var mySQL = require('../lib/mySQLWrapper.js');

var valueDelta = 0.00000001; //acceptable error for numerical quantities (accurate to 1 satoshi)
var testUID = 1000;

describe('test check balance functions',function(){

  //setup - add rows to mysql DB for borrower and some loans on Coinfloor and btcchina

  it('test getAccountPresentValue()',function(){

    var XBTBalance = 0.05;
    var GBPBalance = 10;
    var XBTAskPrice = 240.0;
    var expected = 0.091666667;

    var actual = checkBalance.getAccountPresentValue(XBTBalance, GBPBalance, XBTAskPrice);

    assert.closeTo(actual, expected, valueDelta, 'account present value calculated is not equal to expected');
  });

  it('test getMinimumPresentValue()',function(){

    var loanBalance = 2.1;
    var maintenanceReq = 0.2;
    var expected = 2.52;

    var actual = checkBalance.getMinimumPresentValue(loanBalance, maintenanceReq);

    assert.closeTo(actual, expected, valueDelta, 'minimum present value calculated is not equal to expected');
  });

  it('test getMaintenanceReq()',function(){
    var expected = 0.2;

    var actual = checkBalance.getMaintenanceReq(testUID);

    assert.closeTo(actual, expected, valueDelta, 'minimum present value calculated is not equal to expected');
  });

  it('test getOutstandingLoanBalance()',function(){
    var expected = 2.1;

    var actual = checkBalance.getOutstandingLoanBalance(testUID, "coinfloor");

    assert.closeTo(actual, expected, valueDelta, 'minimum present value calculated is not equal to expected');
  });

  it('test isAboveMaintenanceValue(): expected true',function(){
    var XBTBalance = 1;
    var GBPBalance = 500;
    var XBTAskPrice = 240.0;

    var actual = checkBalance.isAboveMaintenanceValue(XBTBalance, GBPBalance, XBTAskPrice, testUID, "coinfloor");

    assert.isTrue(actual, 'present value is above maintenance value');
  });

  it('test isAboveMaintenanceValue(): expected false',function(){
    var XBTBalance = 0.05;
    var GBPBalance = 10;
    var XBTAskPrice = 240.0;

    var actual = checkBalance.isAboveMaintenanceValue(XBTBalance, GBPBalance, XBTAskPrice, testUID, "coinfloor");

    assert.isFalse(actual, 'present value is no above maintenance value');
  });

  //teardown - delete mysql rows created in setup

});
