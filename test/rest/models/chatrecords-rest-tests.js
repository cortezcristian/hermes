// ChatRecords REST API
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
var ChatRecord, chatrecord, agent, chatrecordId, d;
d = 'http://'+config.app.domain+":"+config.app.port;

// Unit Tests
describe('REST API ChatRecord '+d+"/api/v1/chatrecords", function(){
    before(function(done){
        // Before all tests
        ChatRecord = require("../../../models/chatrecord.js");
        // It show create a new document in the database
        chatrecord = new ChatRecord({ name: 'chatrecord'+Math.floor((Math.random() * 10) + 1)});
        chatrecord.save(function(err, doc){
            chatrecordId = doc._id;    
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

    describe('ChatRecords REST', function(){
        it('GET /api/v1/chatrecords', function(done){
            agent
              .get(d+'/api/v1/chatrecords')
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(res.body.length>0);
                  done();
              });
        });
        it('GET /api/v1/chatrecords/count', function(done){
            agent
              .get(d+'/api/v1/chatrecords/count')
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(res.body.count > 0);
                  done();
              });
        });
        it('POST /api/v1/chatrecords', function(done){
            agent
              .post(d+'/api/v1/chatrecords')
              .send({ name: 'Test Creation ChatRecord' })
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(res.body.name === 'Test Creation ChatRecord');
                  done();
              });
        });
        it('PUT /api/v1/chatrecords/:chatrecordId', function(done){
            agent
              .put(d+'/api/v1/chatrecords/'+chatrecordId)
              .send({ name: 'Test Change ChatRecord' })
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(res.body.name === 'Test Change ChatRecord');
                  done();
              });
        });
        it('DELETE /api/v1/chatrecords/:chatrecordId', function(done){
            agent
              .del(d+'/api/v1/chatrecords/'+chatrecordId)
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(JSON.stringify(res.body) === '{}');
                  done();
              });
        });
        it('DELETE /api/v1/chatrecords', function(done){
            agent
              .del(d+'/api/v1/chatrecords/')
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(JSON.stringify(res.body) === '{}');
                  done();
              });
        });

    });
});
