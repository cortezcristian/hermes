// Memos REST API
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
var Memo, memo, agent, memoId, d;
d = 'http://'+config.app.domain+":"+config.app.port;

// Unit Tests
describe('REST API Memo '+d+"/api/v1/memos", function(){
    before(function(done){
        // Before all tests
        Memo = require("../../../models/memo.js");
        // It show create a new document in the database
        memo = new Memo({ name: 'memo'+Math.floor((Math.random() * 10) + 1)});
        memo.save(function(err, doc){
            memoId = doc._id;    
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

    describe('Memos REST', function(){
        it('GET /api/v1/memos', function(done){
            agent
              .get(d+'/api/v1/memos')
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(res.body.length>0);
                  done();
              });
        });
        it('GET /api/v1/memos/count', function(done){
            agent
              .get(d+'/api/v1/memos/count')
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(res.body.count > 0);
                  done();
              });
        });
        it('POST /api/v1/memos', function(done){
            agent
              .post(d+'/api/v1/memos')
              .send({ name: 'Test Creation Memo' })
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(res.body.name === 'Test Creation Memo');
                  done();
              });
        });
        it('PUT /api/v1/memos/:memoId', function(done){
            agent
              .put(d+'/api/v1/memos/'+memoId)
              .send({ name: 'Test Change Memo' })
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(res.body.name === 'Test Change Memo');
                  done();
              });
        });
        it('DELETE /api/v1/memos/:memoId', function(done){
            agent
              .del(d+'/api/v1/memos/'+memoId)
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(JSON.stringify(res.body) === '{}');
                  done();
              });
        });
        it('DELETE /api/v1/memos', function(done){
            agent
              .del(d+'/api/v1/memos/')
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(JSON.stringify(res.body) === '{}');
                  done();
              });
        });

    });
});
