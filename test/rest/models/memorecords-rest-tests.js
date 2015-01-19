// MemoRecords REST API
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
var MemoRecord, memorecord, agent, memorecordId, d;
d = 'http://'+config.app.domain+":"+config.app.port;

// Unit Tests
describe('REST API MemoRecord '+d+"/api/v1/memorecords", function(){
    before(function(done){
        // Before all tests
        MemoRecord = require("../../../models/memorecord.js");
        // It show create a new document in the database
        memorecord = new MemoRecord({ name: 'memorecord'+Math.floor((Math.random() * 10) + 1)});
        memorecord.save(function(err, doc){
            memorecordId = doc._id;    
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

    describe('MemoRecords REST', function(){
        it('GET /api/v1/memorecords', function(done){
            agent
              .get(d+'/api/v1/memorecords')
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(res.body.length>0);
                  done();
              });
        });
        it('GET /api/v1/memorecords/count', function(done){
            agent
              .get(d+'/api/v1/memorecords/count')
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(res.body.count > 0);
                  done();
              });
        });
        it('POST /api/v1/memorecords', function(done){
            agent
              .post(d+'/api/v1/memorecords')
              .send({ name: 'Test Creation MemoRecord' })
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(res.body.name === 'Test Creation MemoRecord');
                  done();
              });
        });
        it('PUT /api/v1/memorecords/:memorecordId', function(done){
            agent
              .put(d+'/api/v1/memorecords/'+memorecordId)
              .send({ name: 'Test Change MemoRecord' })
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(res.body.name === 'Test Change MemoRecord');
                  done();
              });
        });
        it('DELETE /api/v1/memorecords/:memorecordId', function(done){
            agent
              .del(d+'/api/v1/memorecords/'+memorecordId)
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(JSON.stringify(res.body) === '{}');
                  done();
              });
        });
        it('DELETE /api/v1/memorecords', function(done){
            agent
              .del(d+'/api/v1/memorecords/')
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(JSON.stringify(res.body) === '{}');
                  done();
              });
        });

    });
});
