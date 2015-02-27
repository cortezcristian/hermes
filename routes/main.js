// # Site Routes 
// --------------------------------------
// contains all the routes of the site including pages, and rest api services.
//
// 1. Public Routes
// 2. Admin Routes
//
// requires
// * app
// * config
var app = module.parent.exports.app,
  config = module.parent.exports.config,
  anyandgo = module.parent.exports.anyandgo,
  async = require("async"),
  mail = module.parent.exports.mail,
  Recaptcha = require('recaptcha').Recaptcha,
  // ## Models
  /* models:start */
  // Admins        = require('../models/admins.js'),
  Sample  = require('../models/sample.js'),
  Admins  = require('../models/admins.js'),
  User  = require('../models/user.js'),
  ChatRecord  = require('../models/chatrecord.js'),
  Memo  = require('../models/memo.js'),
  MemoRecord  = require('../models/memorecord.js'),
  Sector  = require('../models/sector.js'),
  Office  = require('../models/office.js'),
  ChatRoom  = require('../models/chatroom.js'),
  /* models:end */
  // ### Authorizers
  // Mantain certains part from the application secure
  // preventing not authenticated actors access to private parts 
  // according to their roles
  /* authorizers:start */
  adminAuth = require('../auth/admin-auth.js'),
  userAuth = require('../auth/user-auth.js'),
  /* authorizers:end */
  /* forms:start */
  adminLoginForm = require('../forms/admin-login.js'),
  /* forms:end */
  restify = require('express-restify-mongoose'),
  mongooseForms = require('mongoose-forms'),
  Handlebars = require('handlebars'),
  shell = require('shelljs');
  // mongooseforms bind
  mongooseForms.bindHelpers(Handlebars, '../../../utils/formstemplates');

  /* models:registration:start */
  anyandgo.models['sample']  = Sample;
  anyandgo.models['user']  = User;
  anyandgo.models['chatrecord']  = ChatRecord;
  anyandgo.models['memo']  = Memo;
  anyandgo.models['memorecord']  = MemoRecord;
  anyandgo.models['sector']  = Sector;
  anyandgo.models['office']  = Office;
  anyandgo.models['chatroom']  = ChatRoom;
  /* models:registration:end */








// ## 1. Public Routes
// --------------------------------------

// ### Home Page
app.get('/', function (req, res) {
    res.render('index', { title: 'Hermes', section: 'Home' });
});

/* page:public:start */
  
// ### Contact Page
app.get('/contact', function (req, res) {
    var recaptcha = "";
    if(config.captcha && config.captcha.enabled ){
        var rc = new Recaptcha(config.captcha.publickey, config.captcha.privatekey);
        recaptcha = rc.toHTML();
    }
    res.render('contact', { title: 'Contact', section: 'Contact', recaptcha_form: recaptcha});
});

// ### Contact Page
app.post('/contact', function (req, res, next) {
        if ( config.mail && config.mail.enabled ) {
            // Mail is enabled
            next();
        } else {
            // Mail is not enabled, you shall not pass
            res.end('Hermes: Mail is not enabled, please contact the site administrator.');
        }
     }, function (req, res, next) {
        if ( config.captcha && config.captcha.enabled ) {
            var data = {
                remoteip:  req.connection.remoteAddress,
                challenge: req.body.recaptcha_challenge_field,
                response:  req.body.recaptcha_response_field
            };
            var recaptcha = new Recaptcha(config.captcha.publickey, config.captcha.privatekey, data);
            recaptcha.verify(function(success, error_code) {
                if ( success ) {
                    // success call to next
                    next();
                } else {
                    // extra error trigger
                    req.flash("error", { param:"recaptcha", msg: "the captcha was incorrect, please try again"});
                    next();
                }
            });
        } else {
            // no captcha
            next();
        }
    }, function (req, res) {

    var msg = "Message: "+req.body.message;

    req.checkBody('name', 'is required').notEmpty();
    req.checkBody('email', 'is required').notEmpty();
    req.checkBody('email', 'is not a valid email address').isEmail();
    req.checkBody('message', 'is required').notEmpty();

    var errors = req.validationErrors();

    var extra = req.flash("error");
    // console.log("--->", extra, extra.length);
    // console.log("E--->", errors);
    if (extra.length > 0 ) {
        errors = (errors !== null) ? errors : [];
        errors.push(extra[0]);
    }

    if ( errors ) {
        req.flash("error", errors);
        req.flash("form", req.body);
        res.redirect('/contact');
    } else {
        mail.sendFromTemplate('./mailstemplates/contact.hbs', {
            name: req.body.name,
            message: req.body.message,
            email: req.body.email
        }, {
            from: config.mail.auth.user, 
            to: config.mail.contact,
            subject: 'Hermes',
            text: msg+' Sent from anyandgo'
        }, function(error, response){
           if ( error ) {
                console.log(error);
                req.flash("error", "There was a problem your message couldn't be sent. Please try again later");
                res.redirect('/contact');
           } else {
                console.log("Message sent: ", response);
                req.flash("success", { msg: "Contacto recibido"});
                res.redirect('/contact');
           }
        });
    }
});

// ### Admin Page
app.get('/admin', function (req, res) {
    var form = mongooseForms.Bridge(new Admins(), new adminLoginForm()).getForm();
    var formHTML = Handlebars.helpers.renderForm(form);
    res.render('admin', { title: 'Admin', section: 'Admin', form: formHTML });
});

// ### Panel Page
app.get('/panel', 
    userAuth.autorizer,
    function (req, res) {
    User.find({}, function(err, users){
    res.render('panel', { title: 'Panel', section: 'Panel', users: users });
    });
});

/* page:public:end */

// ### Services
// Mainly for users

// #### Chat Services

app.post('/services/send/private/chat/', 
    userAuth.autorizer,
    function (req, res) {
    // Should receive
    // req.body.userto
    // req.body.msg
    req.user.sendPrivateChat(req.body.userto, req.body.msg, function(err, chatroom){
        res.json(chatroom);
    });
});

app.get('/services/read/private/chat/:msgid', 
    userAuth.autorizer,
    function (req, res) {
    // Should receive
    // req.params.msgid
    req.user.markAsRead(req.params.msgid, function(err, chatrecord){
        res.json(chatrecord);
    });
});

app.post('/services/read/multiple/private/chat', 
    userAuth.autorizer,
    function (req, res) {
    // Should receive
    // req.body.msgs
    // multiple msg ids separated by commas in a CSV way: msgid1,msgid2,msgid3
    req.user.readMultipleChatMsg(req.body.msgs, function(err, results){
        res.json(req.body);
    });
});

app.get('/services/ask/private/chat/:iduserto/history/:period', 
    userAuth.autorizer,
    function (req, res) {
    // Should receive
    // req.params.iduserto
    // req.params.period
    // it can be a hash of the msgid
    // it can be all, year, month, week, day
    req.user.getPrivateChatHistory(req.params.iduserto, 'day', function(err, chatroom){
        
        if(chatroom.history.length > 0) {
            async.mapSeries(chatroom.history, function(record, cb){
                //mark as read if the user is the receiver
                /**
                record >> { created: Thu Feb 19 2015 12:33:07 GMT-0300 (ART),
                  idFrom: 54e60157ea61499512966da3,
                  idTo: 54e60157ea61499512966da3,
                  chatroomTo: 54e60173ea61499512966dae,
                  message: 'sss',
                  _id: 54e60233ea61499512966db0,
                  __v: 0,
                  readed_status: false }

                **/
                
                if (record.idTo.toString() === req.user.id && !record.readed_status) {
                    //console.log("record >> NO LEIDOOOOOO");
                    // Mark them as read when user request them
                    record.readed_status = true;
                    record.save(function(err, rec){
                        cb();
                    });
                } else {
                    cb();
                }
                
            }, function(){
                res.json(chatroom);
            });
        } else {
            // lenght is zero, let it pass
            res.json(chatroom);
        }
    });
});

// TODO;
/**
app.get('/services/ask/private/chatroom/:roomid/history/:period', 
    userAuth.autorizer,
    function (req, res) {
    // Should receive
    // req.params.roomid
    // req.params.period
    // it can be a hash of the msgid
    // it can be all, year, month, week, day
    res.json(req.params);
});
*/

app.get('/services/ask/private/chat/:userid/updates/:msgid', 
    userAuth.autorizer,
    function (req, res) {
    // Should receive
    // req.params.userid
    // req.params.msgid
    // it can be a hash of the msgid
    // from where we start the search to bring only the new ones
    req.user.updatePrivateChatHistory(req.params.userid, req.params.msgid, function(err, chatroom){
        //res.json(chatroom);
        if(chatroom.history.length > 0) {
            async.mapSeries(chatroom.history, function(record, cb){
                //mark as read if the user is the receiver
                
                if (record.idTo.toString() === req.user.id && !record.readed_status) {
                    //console.log("record >> NO LEIDOOOOOO");
                    // Mark them as read when user request them
                    record.readed_status = true;
                    record.save(function(err, rec){
                        cb();
                    });
                } else {
                    cb();
                }
                
            }, function(){
                res.json(chatroom);
            });
        } else {
            // lenght is zero, let it pass
            res.json(chatroom);
        }
    });
});

// TODO;
app.get('/services/ask/private/chatroom/:roomid/updates/:msgid', 
    userAuth.autorizer,
    function (req, res) {
    // Should receive
    // req.params.roomid
    // req.params.msgid
    // it can be a hash of the msgid
    // from where we start the search to bring only the new ones
    res.json(req.params);
});

// ##### Get All Notifications
app.get('/services/unread/notifiactions/:type', 
    userAuth.autorizer,
    function (req, res) {
    // Should receive
    // gives a resume of all notifications

    var result = {
        chats: [],
        memos: []
    };

    if(req.params.type === 'all'){
        ChatRecord.aggregate([ { $match: {idTo: req.user._id, readed_status: false} }, 
            { $group: { _id: '$idFrom', count : { $sum : 1 } } } ])
            .exec(function(err, cr){
                //console.log(err, cr);
                if(cr){
                    User.populate(cr, {path: '_id'}, function(err, list){
                        result.chats = list;    
                        res.json(result);
                    });
                }else{
                    res.json(result);
                }
            });
        /*
        ChatRecord.find({idTo: req.user._id, readed_status: false})
            .populate('idFrom')
            .exec(function(err, cr){
                result.chats = cr;    
                res.json(result);
            });
        */
    } else {
        res.json(result);
    }
});

// TODO;
app.get('/services/count/unread/private/chat/:usrid', 
    userAuth.autorizer,
    function (req, res) {
    // Should receive
    // req.params.usrid
    // counts pending to read chats for a particular user
    res.json(req.params);
});

// TODO;
app.get('/services/count/all/unread/private/chat', 
    userAuth.autorizer,
    function (req, res) {
    // Should receive
    // counts all pending to read chats for current user
    res.json(req.params);
});

app.get('/services/open/private/chat/:usrto', 
    userAuth.autorizer,
    function (req, res) {
    // Should receive
    // req.params.usrto
    // should bring last 48hs of a private chat
    // if the chat doesn't exist it should create it 
    //console.log(req.user, typeof req.user.openPrivateChat);
    req.user.openPrivateChat(req.params.usrto, function(err, croom){
        res.json(croom);
    });
});

// #### Get Personal Information

app.get('/services/ask/user/info/:iduser', 
    userAuth.autorizer,
    function (req, res) {
    // Should receive
    // req.params.msgid
    var iduser = (req.params.iduser === 'me') ? req.user._id : req.params.iduser;
    User.findOne({ _id: iduser})
        .select("-password")
        .exec( function(err, user){
        res.json(user);
    });
});

// #### Search Personal

app.get('/services/search/people/:keyword/office/:office/sector/:sector', 
    userAuth.autorizer,
    function (req, res) {
    // Should receive
    // req.body.keyword
    // req.body.office
    // req.body.sector
    // Returns data of matched personal
    var query = User.find().or([{ email : new RegExp('.*'+req.params.keyword+'.*','i') }, { name : new RegExp('.*'+req.params.keyword+'.*','i') }]);

    if(req.params.office !== 'all'){
        query.where('idOffice').equals(req.params.office);    
    }

    if(req.params.sector !== 'all'){
        query.where('idSector').equals(req.params.sector);    
    }

    query.select('-password')
        .exec(function(err, users){
        res.json(users);
    });
});

// #### Search Personal From New Memo

app.get('/services/search/people/tags', 
    userAuth.autorizer,
    function (req, res) {
    // Should receive
    // req.query.keyword
    // req.query.office
    // req.query.sector
        
    // Returns data of matched personal
    var query = User.find().or([{ email : new RegExp('.*'+req.query.keyword+'.*','i') }, { name : new RegExp('.*'+req.query.keyword+'.*','i') }]);

    /*
    if(req.query.office !== 'all'){
        query.where('idOffice').equals(req.query.office);    
    }

    if(req.query.sector !== 'all'){
        query.where('idSector').equals(req.query.sector);    
    }*/

    query.select('-password')
        .exec(function(err, users){
        res.json(users);
    });
});

// #### Offices

app.get('/services/offices/:hash', 
    userAuth.autorizer,
    function (req, res) {
    // Should receive
    //req.params.hash
    if(req.params.hash === 'all'){
        Office.find({ }, function(err, offices){
            res.json(offices);
        });
    } else {
        // Returns data of matched office
        Office.findOne({ _id : req.params.hash }, function(err, offices){
            res.json(offices);
        });
        
    }
});

// #### Sectors

app.get('/services/sectors/:hash', 
    userAuth.autorizer,
    function (req, res) {
    // Should receive
    //req.params.hash
    if(req.params.hash === 'all'){
        Sector.find({ }, function(err, sectors){
            res.json(sectors);
        });
    } else {
        // Returns data of matched sector
        Sector.findOne({ _id : req.params.hash }, function(err, sectors){
            res.json(sectors);
        });
        
    }
});

// #### Profile search

app.get('/services/profile/:hash', 
    userAuth.autorizer,
    function (req, res) {
    // Should receive
    //req.params.hash
    User.findOne({ _id : req.params.hash })
        .select('-password')
        .populate('idSector idOffice')
        .exec( function(err, user){
        res.json(user);
    });
});


// #### Memo

app.get('/services/read/memo/:memoid', 
    userAuth.autorizer,
    function (req, res) {
    // Should receive
    // req.params.memoid
    // Mark memo as read
    res.json(req.params);
});


app.get('/services/get/memo/:memoid', 
    userAuth.autorizer,
    function (req, res) {
    // Should receive
    // req.params.memoid
    // Gets a particular memo
    req.user.getMemoRecordAndRead(req.params.memoid, function(err, mrecord){
        res.json(mrecord);
    });
});

app.get('/services/get/memos/inbox', 
    userAuth.autorizer,
    function (req, res) {
    // Should receive
    // req.params.memoid
    // Gets the list of all memos received
    req.user.getMemosInbox(function(err, mrecords){
        //console.log(err, mrecords);
        res.json(mrecords);
    });
});

app.get('/services/get/memos/outbox', 
    userAuth.autorizer,
    function (req, res) {
    // Should receive
    // req.params.memoid
    // Gets the list of all memos sent
    res.json(req.params);
});

app.get('/services/count/unread/memos', 
    userAuth.autorizer,
    function (req, res) {
    // Should receive
    // counts all pending to read memos for current user
    res.json(req.params);
});


app.post('/services/send/memo', 
    userAuth.autorizer,
    function (req, res) {
    // Should receive
    // req.body.memobody
    // req.body.usersto
    // Creates a new mememo
    // specify the usersto by giving us
    // their ids separated by commas in a CSV way: usrid1,usrid2,usrid3
    req.user.sendMemo(req.body, function(err, mr1){
        res.json(mr1);
    });
});

// #### Session

// TODO: set last activity can be an interceptor for services
// TODO: resolve how to disconnect inactive people

// ##### Get Open Tabs

app.get('/services/open/tabs', 
    userAuth.autorizer,
    function (req, res) {
    // Should receive
    // req.body.chatroomname
    // Saves minimized window UI
    // everytime you open a chatroom UI
    User.findOne({ _id: req.user._id })
        .populate('open_chats', '-password')
        .exec(function(err, user){
        res.json(user.open_chats);
    });
});


// ##### Save Open Tab

app.post('/services/save/chat/tab', 
    userAuth.autorizer,
    function (req, res) {
    // Should receive
    // req.body.userto
    // Saves minimized window UI
    // everytime you open a chatroom UI
    req.user.saveChatTab(req.body.userto, function(err, user){
        res.json({status: 'ok'});
    });
});

// ##### Remove Open Tab

app.post('/services/remove/chat/tab', 
    userAuth.autorizer,
    function (req, res) {
    // Should receive
    // req.body.userto
    // Removes minimized window UI
    // everytime you close a chatroom UI
    req.user.removeChatTab(req.body.userto, function(err, user){
        res.json({status: 'ok', tabid: req.body.userto });
    });
});

app.get('/services/count/unread/memos', 
    userAuth.autorizer,
    function (req, res) {
    // Returns the list of chatrooms open in the last session
    res.json(req.params);
});



// ## 2. Admin Routes
// --------------------------------------
// ### Login
app.get('/admin', function (req, res) {
    res.render('admin-index', { title: 'Hermes', section: 'Admin Login' });
});

// ### Panel
app.get('/admin/config', function (req, res) {
    res.render('admin-config', { title: 'Hermes', section: 'Admin Panel' });
});

// ### Panel
app.get('/admin/panel', 
    /* route:autorizers:start*/
    adminAuth.autorizer,
    /* route:autorizers:end */
    function (req, res) {
    res.render('admin-panel', { title: 'Hermes', section: 'Admin Panel' });
});

// ## 3. Public Rest
// --------------------------------------
// https://github.com/florianholzapfel/express-restify-mongoose

// CORS Interceptors
if (config.cors && config.cors === "enabled") {
  app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  app.options('/api/v1/*', function(req, res){
    res.end();
  });
}

/* rest:public:start */

// GET /api/v1/samples
restify.serve(app, Sample, {
  lowercase: true,
  lean: false,
  prereq: adminAuth.rest.prereq,
  contextFilter: function(model, req, cb) {
    console.log("context filter");
    cb(model);
  },
  postProcess: function(req, res){
    console.log("post process");
  }
});

// GET /api/v1/users
restify.serve(app, User, {
  lowercase: true,
  lean: false,
  prereq: function(req) {
    console.log("pre req");
    return true;
  },
  contextFilter: function(model, req, cb) {
    console.log("context filter");
    cb(model);
  },
  postProcess: function(req, res){
    console.log("post process");
  }
});

// GET /api/v1/chatrecords
restify.serve(app, ChatRecord, {
  lowercase: true,
  lean: false,
  prereq: function(req) {
    console.log("pre req");
    return true;
  },
  contextFilter: function(model, req, cb) {
    console.log("context filter");
    cb(model);
  },
  postProcess: function(req, res){
    console.log("post process");
  }
});

// GET /api/v1/memos
restify.serve(app, Memo, {
  lowercase: true,
  lean: false,
  prereq: function(req) {
    console.log("pre req");
    return true;
  },
  contextFilter: function(model, req, cb) {
    console.log("context filter");
    cb(model);
  },
  postProcess: function(req, res){
    console.log("post process");
  }
});

// GET /api/v1/memorecords
restify.serve(app, MemoRecord, {
  lowercase: true,
  lean: false,
  prereq: function(req) {
    console.log("pre req");
    return true;
  },
  contextFilter: function(model, req, cb) {
    console.log("context filter");
    cb(model);
  },
  postProcess: function(req, res){
    console.log("post process");
  }
});

// GET /api/v1/sectors
restify.serve(app, Sector, {
  lowercase: true,
  lean: false,
  prereq: function(req) {
    console.log("pre req");
    return true;
  },
  contextFilter: function(model, req, cb) {
    console.log("context filter");
    cb(model);
  },
  postProcess: function(req, res){
    console.log("post process");
  }
});

// GET /api/v1/offices
restify.serve(app, Office, {
  lowercase: true,
  lean: false,
  prereq: function(req) {
    console.log("pre req");
    return true;
  },
  contextFilter: function(model, req, cb) {
    console.log("context filter");
    cb(model);
  },
  postProcess: function(req, res){
    console.log("post process");
  }
});

// GET /api/v1/chatrooms
restify.serve(app, ChatRoom, {
  lowercase: true,
  lean: false,
  prereq: function(req) {
    console.log("pre req");
    return true;
  },
  contextFilter: function(model, req, cb) {
    console.log("context filter");
    cb(model);
  },
  postProcess: function(req, res){
    console.log("post process");
  }
});
/* rest:public:end */









// ## 4. Crud Forms
// --------------------------------------
// https://github.com/oJshua/mongoose-forms
app.get('/forms/:modelname/create', function (req, res) {
    //mongooseForms.bindHelpers(Handlebars, 'bootstrap');
    var SampleForm = mongooseForms.Form(anyandgo.models[req.params.modelname]);
    /*
    SampleForm = SampleForm.eachField(function(field, name){
        console.log(">>", field, name);    
        if(name == "__v"){
           field.mapped = false;    
           console.log("->", field);
        }
        field.buttons = [{ sample: "lala"}];
    });
    */
    //delete SampleForm.options.fields["__v"];
    //SampleForm.options.maps["__v"] = false;
    console.log("----->>>", SampleForm);

    var ngBridge = function(model, form) {

      var bridge = {
        setModel: function(_model) {
          model = _model;
        },
        setForm: function(_form) {
          form = _form;
        },
        getForm: function() {
          
          form.eachMappedField(function(field, path) {
            field.value = model[path]; 
            field.ngmodel = req.params.modelname; 
            field.formname = "myForm"; 
            // Override type with ngoform setting
            if ( field.type.options.ngoform ) {
                field.type.instance = field.type.options.ngoform.control;
            }

          });

          delete form.options.fields["__v"];
          delete form.options.fields["created"];
          //form.options.fields["name"].template = 'Lala';
          form.options.fields["name"].buttons = [{type: 'submit'}];
          console.log(form.options.fields["name"]);
          return form;
        },
        getModel: function() {
          
          form.eachMappedField(function(field, path) {      
            model[path] = field.value;
          });

          return model;
        }
      };

      return bridge;
    };

    var form = ngBridge(new anyandgo.models[req.params.modelname](), SampleForm).getForm();
    //var form = mongooseForms.Bridge(new Sample(), SampleForm).getForm();
    var formHTMl = Handlebars.helpers.renderForm(form);
    
    console.log(formHTMl);
    res.render('forms', { title: 'Hermes', section: 'Form', form: formHTMl, mname: req.params.modelname });
});

app.get('/forms/sample/edit', function (req, res) {
    mongooseForms.bindHelpers(Handlebars, 'bootstrap');
    var SampleForm = mongooseForms.Form(Sample);
    Sample.findOne({}, function(err, doc){
        var form = mongooseForms.Bridge(doc, SampleForm).getForm();
        var formHTMl = Handlebars.helpers.renderForm(form);
    
        console.log(formHTMl);
        res.render('forms', { title: 'Hermes', section: 'Form', form: formHTMl });
    });
});

// ## 5. Super Admin Tasks
// --------------------------------------
/*
app.get('/tasks/test', function (req, res) {
    shell.exec('./node_modules/mocha/bin/mocha --reporter doc', function(code, output) {
        console.log('Exit code:', code);
        console.log('Program output:', output);
        res.end(output);
    });
});
// TODO: prevent auto-reboot when running with grunt, securitize mname parameter
app.get('/tasks/create/model/:mname', function (req, res) {
    shell.exec('grunt create:model:'+req.params.mname, function(code, output) {
        console.log('Exit code:', code);
        console.log('Program output:', output);
        res.end(output);
    });
});
*/

