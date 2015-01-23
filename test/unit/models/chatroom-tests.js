// ChatRoom Test Cases
// -----------------------------

// Modules Dependencies:
//  - Assert (http://nodejs.org/api/assert.html)
var assert = require('assert');

// Require basic config files and DB connection
require('../../../utils/dbconnect');

// Global Variables for the test case
var ChatRoom, chatroom;

// Unit Tests
describe('Model Test ChatRoom', function(){
    before(function(){
        // Before all tests
        ChatRoom = require("../../../models/chatroom.js");
    });

    describe('ChatRoom', function(){
        // It show create a new document in the database
        it('add a chatroom', function(done){
            chatroom = new ChatRoom({ name: 'chatroom'+Math.floor((Math.random() * 10) + 1)});
            chatroom.save(done);
        });

    });
});
