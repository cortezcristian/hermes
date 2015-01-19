// Office Test Cases
// -----------------------------

// Modules Dependencies:
//  - Assert (http://nodejs.org/api/assert.html)
var assert = require('assert');

// Require basic config files and DB connection
require('../../../utils/dbconnect');

// Global Variables for the test case
var Office, office;

// Unit Tests
describe('Model Test Office', function(){
    before(function(){
        // Before all tests
        Office = require("../../../models/office.js");
    });

    describe('Office', function(){
        // It show create a new document in the database
        it('add a office', function(done){
            office = new Office({ name: 'office'+Math.floor((Math.random() * 10) + 1)});
            office.save(done);
        });

    });
});
