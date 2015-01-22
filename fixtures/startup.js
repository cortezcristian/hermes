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
  dbConex = module.parent.exports.dbConex;


/**
*
## Clean Collections
*/
var clearCollections = function ( cb ) {
    var clearToCollections = "users,admins"; 

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

var loadUsers = function(cb) {
    var users = [ 
        { email: "user@user.com", password: "123456", avatar: '/photos/user.png' } 
        , { email: "demo@demo.com", password: "123456", avatar: '/photos/demo.png' } 
        , { email: "cortez.cristian@gmail.com", password: "12345678", avatar: '/photos/crisboot.png' } 
        ];

    async.mapSeries(users, function(op, callback){
        var u1 = new User(op);
        u1.save(function(err, doc){
            console.log("User added...", doc.name, err);
            callback(err, op);
        });
    }, function(err, res){
        //console.log(">>>", err, res);    
        cb(null, 'Users Loaded')
    });
        
};

// Run tasks
async.series([
    clearCollections, 
    loadUsers], function(err, res){
    console.log("Finished Tasks >>>", res, "Observations: ", err || "None");    
});
