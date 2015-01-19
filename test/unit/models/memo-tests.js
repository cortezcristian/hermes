// Memo Test Cases
// -----------------------------

// Modules Dependencies:
//  - Assert (http://nodejs.org/api/assert.html)
var assert = require('assert');

// Require basic config files and DB connection
require('../../../utils/dbconnect');

// Global Variables for the test case
var Memo, memo;

// Unit Tests
describe('Model Test Memo', function(){
    before(function(){
        // Before all tests
        Memo = require("../../../models/memo.js");
    });

    describe('Memo', function(){
        // It show create a new document in the database
        it('add a memo', function(done){
            memo = new Memo({ name: 'memo'+Math.floor((Math.random() * 10) + 1)});
            memo.save(done);
        });

    });
});
