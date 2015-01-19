// Offices REST API
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
var Office, office, agent, officeId, d;
d = 'http://'+config.app.domain+":"+config.app.port;

// Unit Tests
describe('REST API Office '+d+"/api/v1/offices", function(){
    before(function(done){
        // Before all tests
        Office = require("../../../models/office.js");
        // It show create a new document in the database
        office = new Office({ name: 'office'+Math.floor((Math.random() * 10) + 1)});
        office.save(function(err, doc){
            officeId = doc._id;    
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

    describe('Offices REST', function(){
        it('GET /api/v1/offices', function(done){
            agent
              .get(d+'/api/v1/offices')
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(res.body.length>0);
                  done();
              });
        });
        it('GET /api/v1/offices/count', function(done){
            agent
              .get(d+'/api/v1/offices/count')
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(res.body.count > 0);
                  done();
              });
        });
        it('POST /api/v1/offices', function(done){
            agent
              .post(d+'/api/v1/offices')
              .send({ name: 'Test Creation Office' })
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(res.body.name === 'Test Creation Office');
                  done();
              });
        });
        it('PUT /api/v1/offices/:officeId', function(done){
            agent
              .put(d+'/api/v1/offices/'+officeId)
              .send({ name: 'Test Change Office' })
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(res.body.name === 'Test Change Office');
                  done();
              });
        });
        it('DELETE /api/v1/offices/:officeId', function(done){
            agent
              .del(d+'/api/v1/offices/'+officeId)
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(JSON.stringify(res.body) === '{}');
                  done();
              });
        });
        it('DELETE /api/v1/offices', function(done){
            agent
              .del(d+'/api/v1/offices/')
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(JSON.stringify(res.body) === '{}');
                  done();
              });
        });

    });
});
