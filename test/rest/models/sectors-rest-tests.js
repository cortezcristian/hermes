// Sectors REST API
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
var Sector, sector, agent, sectorId, d;
d = 'http://'+config.app.domain+":"+config.app.port;

// Unit Tests
describe('REST API Sector '+d+"/api/v1/sectors", function(){
    before(function(done){
        // Before all tests
        Sector = require("../../../models/sector.js");
        // It show create a new document in the database
        sector = new Sector({ name: 'sector'+Math.floor((Math.random() * 10) + 1)});
        sector.save(function(err, doc){
            sectorId = doc._id;    
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

    describe('Sectors REST', function(){
        it('GET /api/v1/sectors', function(done){
            agent
              .get(d+'/api/v1/sectors')
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(res.body.length>0);
                  done();
              });
        });
        it('GET /api/v1/sectors/count', function(done){
            agent
              .get(d+'/api/v1/sectors/count')
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(res.body.count > 0);
                  done();
              });
        });
        it('POST /api/v1/sectors', function(done){
            agent
              .post(d+'/api/v1/sectors')
              .send({ name: 'Test Creation Sector' })
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(res.body.name === 'Test Creation Sector');
                  done();
              });
        });
        it('PUT /api/v1/sectors/:sectorId', function(done){
            agent
              .put(d+'/api/v1/sectors/'+sectorId)
              .send({ name: 'Test Change Sector' })
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(res.body.name === 'Test Change Sector');
                  done();
              });
        });
        it('DELETE /api/v1/sectors/:sectorId', function(done){
            agent
              .del(d+'/api/v1/sectors/'+sectorId)
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(JSON.stringify(res.body) === '{}');
                  done();
              });
        });
        it('DELETE /api/v1/sectors', function(done){
            agent
              .del(d+'/api/v1/sectors/')
              .end(function(res) {
                  assert.ok(res.ok);
                  assert.ok(JSON.stringify(res.body) === '{}');
                  done();
              });
        });

    });
});
