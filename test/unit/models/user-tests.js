// User Test Cases
// -----------------------------

// Modules Dependencies:
//  - Assert (http://nodejs.org/api/assert.html)
var assert = require('assert');
var fixtures = require('mongoose-fixtures');
var async = require('async')

// Require basic config files and DB connection
require('../../../utils/dbconnect');

// Global Variables for the test case
var User, user, user1, user2, chatroom1, memorec1;

// Unit Tests
describe('Model Test User', function(){
    before(function(done){
        // Before all tests
        User = require("../../../models/user.js");

        async.series([function(callback){
                // Load fixtures
                fixtures.load('../../../fixtures/test/users.js', function(){
                    callback();
                });

            },function(callback){
                User.findOne({email:'user@user.com'}, function(err, usr){
                    user1 = usr;    
                    callback();
                });

            },function(callback){
                User.findOne({email:'demo@demo.com'}, function(err, usr){
                    user2 = usr;    
                    callback();
                });
            
            }],
        function(err, results){
            done();
        });

    });

    describe('User', function(){
        // It should create a new document in the database
        it('add a user', function(done){
            user = new User({ 
                name: 'user'+Math.floor((Math.random() * 10) + 1),
                password: '123456'
            });
            user.save(done);
        });
        // It should authenticate an user
        it('authenticate an user', function(done){
            assert.ok(user.authenticate('123456'), 'Password should match');
            assert.ok(!user.authenticate('incorrect'), 'Password should not match');
            done();
        });
        // It should open a new chatroom
        it('open a new private chat room', function(done){
            user.openPrivateChat('other-user-id-here', done);
        });
        // It should send a new message
        it('send a new private message', function(done){
            user1.sendPrivateChat(user2._id, "Hi there!", function(err, chatroom){
                //console.log("chatroom", chatroom)
                chatroom1 = chatroom;
                assert.ok(chatroom.history.length > 0, 'Chatroom history should exist');
                done(); 
            });
        });
        // TODO:
        // Cannot send messages to himself
        // User2 should exist

        // It should mark message as read
        it('mark message as read', function(done){
            user2.readChatMsg(chatroom1.history[0], function(err, chatrecord){
                assert.ok(chatrecord.readed_status, 'Chat Record should be readed');
                done(); 
            });
        });
        
        // It get chat history
        // TODO: check if user has access to that history
        it('get chat history', function(done){
            user2.getChatHistory(chatroom1._id, function(err, chatroom){
                assert.ok(chatroom.history[0].readed_status, 'First Chat Record should be marked as read');
                done(); 
            });
        });
        // Send Memo
        it('send memo', function(done){
            user1.sendMemo({ memobody: '<b>message</b>' , usersto: user2._id.toString() }, 
                function(err, mr){
                    memorec1 = mr;
                    done(err);
            });
        });
        // Get memos Inbox
        it('get memos inbox', function(done){
            user2.getMemosInbox(function(err, mrecords){
                assert.ok(mrecords.length > 0, 'It should have at least one memo inbox');
                done();
            });
        });
        // Get memos Outbox
        it('get memos outbox', function(done){
            user1.getMemosOutbox(function(err, mrecords){
                assert.ok(mrecords.length > 0, 'It should have at least one memo sent');
                done();
            });
        });
        // Get MemoRecord and mark it as read
        it('get MemoRecord and mark it as read', function(done){
            user2.getMemoRecordAndRead(memorec1._id, function(err, mrecord){
                assert.ok(mrecord.readed_status === true, 'It should mark the memo as read');
                done();
            });
        });


    });
});
