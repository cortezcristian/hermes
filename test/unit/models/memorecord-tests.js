// MemoRecord Test Cases
// -----------------------------

// Modules Dependencies:
//  - Assert (http://nodejs.org/api/assert.html)
var assert = require('assert');

// Require basic config files and DB connection
require('../../../utils/dbconnect');

// Global Variables for the test case
var MemoRecord, memorecord;

// Unit Tests
describe('Model Test MemoRecord', function(){
    before(function(){
        // Before all tests
        MemoRecord = require("../../../models/memorecord.js");
    });

    describe('MemoRecord', function(){
        // It show create a new document in the database
        it('add a memorecord', function(done){
            memorecord = new MemoRecord({ name: 'memorecord'+Math.floor((Math.random() * 10) + 1)});
            memorecord.save(done);
        });

    });
});
