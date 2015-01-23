// ChatRooms REST API
// -----------------------------

// Modules Dependencies:
//  - Assert (http://nodejs.org/api/assert.html)
//  - SuperAgent (http://visionmedia.github.io/superagent/)
var assert = require('assert'),
    config = require('../../../config'),
    superagent = require('superagent');

// Require basic config files and DB connection
require('../../../utils/dbconnect');

// Global Variables for the test case
var ChatRoom, chatroom, agent, chatroomId, d;
d = 'http://'+config.app.domain+":"+config.app.port;

// Unit Tests
describe('REST API ChatRoom '+d+"/api/v1/chatrooms", function(){
    before(function(done){
        // Before all tests
        ChatRoom = require("../../../models/chatroom.js");
        // It show create a new document in the database
        chatroom = new ChatRoom({ name: 'chatroom'+Math.floor((Math.random() * 10) + 1)});
        chatroom.save(function(err, doc){
            chatroomId = doc._id;    
        });
        // Get domain
        d = config.app.domain+":"+config.app.port;
        // Start agent
        agent = superagent.agent();
        // Login if necesary
        agent
          .post(d+'/admin')
          .send({ email: "admin@anyandgo.com", password: "123456" })
          .end(function(res) {
              assert.ok(res.ok);
              done();
          });
    });

    describe('ChatRooms REST', function(){
        it('GET /api/v1/chatrooms', function(done){
            agent
              .get(d+'/api/v1/chatrooms')
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(res.body.length>0);
                  done();
              });
        });
        it('GET /api/v1/chatrooms/count', function(done){
            agent
              .get(d+'/api/v1/chatrooms/count')
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(res.body.count > 0);
                  done();
              });
        });
        it('POST /api/v1/chatrooms', function(done){
            agent
              .post(d+'/api/v1/chatrooms')
              .send({ name: 'Test Creation ChatRoom' })
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(res.body.name === 'Test Creation ChatRoom');
                  done();
              });
        });
        it('PUT /api/v1/chatrooms/:chatroomId', function(done){
            agent
              .put(d+'/api/v1/chatrooms/'+chatroomId)
              .send({ name: 'Test Change ChatRoom' })
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(res.body.name === 'Test Change ChatRoom');
                  done();
              });
        });
        it('DELETE /api/v1/chatrooms/:chatroomId', function(done){
            agent
              .del(d+'/api/v1/chatrooms/'+chatroomId)
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(JSON.stringify(res.body) === '{}');
                  done();
              });
        });
        it('DELETE /api/v1/chatrooms', function(done){
            agent
              .del(d+'/api/v1/chatrooms/')
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(JSON.stringify(res.body) === '{}');
                  done();
              });
        });

    });
});
