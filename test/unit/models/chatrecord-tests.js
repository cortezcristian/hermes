// ChatRecord Test Cases
// -----------------------------

// Modules Dependencies:
//  - Assert (http://nodejs.org/api/assert.html)
var assert = require('assert');

// Require basic config files and DB connection
require('../../../utils/dbconnect');

// Global Variables for the test case
var ChatRecord, chatrecord;

// Unit Tests
describe('Model Test ChatRecord', function(){
    before(function(){
        // Before all tests
        ChatRecord = require("../../../models/chatrecord.js");
    });

    describe('ChatRecord', function(){
        // It show create a new document in the database
        it('add a chatrecord', function(done){
            chatrecord = new ChatRecord({ name: 'chatrecord'+Math.floor((Math.random() * 10) + 1)});
            chatrecord.save(done);
        });

    });
});
