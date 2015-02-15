/**
* Startup tasks
```
 _                                   
| |__   ___ _ __ _ __ ___   ___  ___ 
| '_ \ / _ \ '__| '_ ` _ \ / _ \/ __|
| | | |  __/ |  | | | | | |  __/\__ \
|_| |_|\___|_|  |_| |_| |_|\___||___/
                                     
```
*
*/

var async = require("async"),
  User  = require('../models/user.js'),
  Sector  = require('../models/sector.js'),
  Office  = require('../models/office.js'),
  dbConex = module.parent.exports.dbConex;


/**
*
## Clean Collections
*/
var clearCollections = function ( cb ) {
    var clearToCollections = "users,sectors,offices"; 

    async.map(clearToCollections.split(","), function(op, callback){
        console.log("removing...", op);
        if(dbConex.connection.collections[op]){
            dbConex.connection.collections[op].drop( function(err) {
                console.log("removed...", op, err);
                callback(err, op);
            });
        } else {
            callback(new Error('Unknown collection'), op);
        }
    }, function(err, res){
        console.log(">>>", err, res);    
        cb(null, 'Collections Cleared')
    });
};

var loadSectors = function(cb) {
    var sectors = [ 
        { name: 'Sistemas' } 
        , { name: 'Proyectos' } 
        ];

    async.mapSeries(sectors, function(op, callback){
        var u1 = new Sector(op);
        u1.save(function(err, doc){
            console.log("Sector added...", doc.name, err);
            callback(err, op);
        });
    }, function(err, res){
        //console.log(">>>", err, res);    
        cb(null, 'Sectors Loaded')
    });
        
};

var loadOffices = function(cb) {
    var offices = [ 
        { name: 'Rosario' } 
        , { name: 'Lima' } 
        ];

    async.mapSeries(offices, function(op, callback){
        var o1 = new Office(op);
        o1.save(function(err, doc){
            console.log("Office added...", doc.name, err);
            callback(err, op);
        });
    }, function(err, res){
        //console.log(">>>", err, res);    
        cb(null, 'Offices Loaded')
    });
        
};


var loadUsers = function(cb) {
    var users = [ 
        { sector: 'Proyectos', office: 'Rosario', obj: { email: "user@user.com", name: "User Demo", password: "123456", avatar: '/photos/user.png' }} 
        , { sector: 'Proyectos', office: 'Lima', obj: { email: "demo@demo.com", name: "Demo Demo", password: "123456", avatar: '/photos/demo.png' }} 
        , { sector: 'Proyectos', office: 'Lima', obj: { email: "demo1@demo.com", name: "Demo Demo", password: "123456", avatar: '/photos/demo.png' }} 
        , { sector: 'Proyectos', office: 'Rosario', obj: { email: "demo2@demo.com", name: "Demo Demo", password: "123456", avatar: '/photos/demo.png' }}
        , { sector: 'Proyectos', office: 'Rosario', obj: { email: "demo3@demo.com", name: "Demo Demo", password: "123456", avatar: '/photos/demo.png' }} 
        , { sector: 'Proyectos', office: 'Rosario', obj: { email: "demo4@demo.com", name: "Demo Demo", password: "123456", avatar: '/photos/demo.png' }} 
        , { sector: 'Proyectos', office: 'Rosario', obj: { email: "demo5@demo.com", name: "Demo Demo", password: "123456", avatar: '/photos/demo.png' }} 
        , { sector: 'Proyectos', office: 'Rosario', obj: { email: "demo6@demo.com", name: "Demo Demo", password: "123456", avatar: '/photos/demo.png' }} 
        , { sector: 'Sistemas', office: 'Rosario', obj: { email: "demo7@demo.com", name: "Demo Demo", password: "123456", avatar: '/photos/demo.png' }} 
        , { sector: 'Sistemas', office: 'Rosario', obj: { email: "cortez.cristian@gmail.com", name: "Cristian Cortéz", password: "12345678", avatar: '/photos/crisboot.png' }} 
        ];

    async.mapSeries(users, function(op, callback){
        Office.findOne({name: op.office}, function(err, of){
            Sector.findOne({name: op.sector}, function(err, se){
                op.obj.idOffice = of._id;
                op.obj.idSector = se._id;

                var u1 = new User(op.obj);
                u1.save(function(err, doc){
                    console.log("User added...", doc.name, err);
                    callback(err, op);
                });
            });
        });
    }, function(err, res){
        //console.log(">>>", err, res);    
        cb(null, 'Users Loaded')
    });
        
};

// Run tasks
async.series([
    clearCollections, 
    loadSectors, 
    loadOffices,
    loadUsers], function(err, res){
    console.log("Finished Tasks >>>", res, "Observations: ", err || "None");    
});
