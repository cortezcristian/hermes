// Sector Test Cases
// -----------------------------

// Modules Dependencies:
//  - Assert (http://nodejs.org/api/assert.html)
var assert = require('assert');

// Require basic config files and DB connection
require('../../../utils/dbconnect');

// Global Variables for the test case
var Sector, sector;

// Unit Tests
describe('Model Test Sector', function(){
    before(function(){
        // Before all tests
        Sector = require("../../../models/sector.js");
    });

    describe('Sector', function(){
        // It show create a new document in the database
        it('add a sector', function(done){
            sector = new Sector({ name: 'sector'+Math.floor((Math.random() * 10) + 1)});
            sector.save(done);
        });

    });
});
