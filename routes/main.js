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
    res.render('panel', { title: 'Panel', section: 'Panel' });
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
    res.json(req.body);
});

app.get('/services/read/private/chat/:msgid', 
    userAuth.autorizer,
    function (req, res) {
    // Should receive
    // req.params.msgid
    res.json(req.params);
});

app.post('/services/read/multiple/private/chat', 
    userAuth.autorizer,
    function (req, res) {
    // Should receive
    // req.body.msgs
    // multiple msg ids separated by commas in a CSV way: msgid1,msgid2,msgid3
    res.json(req.body);
});

app.get('/services/ask/private/chat/history/:period', 
    userAuth.autorizer,
    function (req, res) {
    // Should receive
    // req.params.period
    // it can be a hash of the msgid
    // it can be all, year, month, week, day
    res.json(req.params);
});

app.get('/services/ask/private/chat/updates/:msgid', 
    userAuth.autorizer,
    function (req, res) {
    // Should receive
    // req.params.msgid
    // it can be a hash of the msgid
    // from where we start the search to bring only the new ones
    res.json(req.params);
});

app.get('/services/count/unread/private/chat/:usrid', 
    userAuth.autorizer,
    function (req, res) {
    // Should receive
    // req.params.usrid
    // counts pending to read chats for a particular user
    res.json(req.params);
});

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
    console.log(req.user, typeof req.user.openPrivateChat);
    req.user.openPrivateChat(req.params.usrto, function(err, croom){
        res.json(croom);
    });
});

// #### Search Personal

app.post('/services/search/people', 
    userAuth.autorizer,
    function (req, res) {
    // Should receive
    // req.body.keyword
    // req.body.office
    // req.body.sector
    // Returns data of matched personal
    res.json(req.body);
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
    res.json(req.params);
});

app.get('/services/get/memos/inbox', 
    userAuth.autorizer,
    function (req, res) {
    // Should receive
    // req.params.memoid
    // Gets the list of all memos received
    res.json(req.params);
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
    res.json(req.body);
});

// #### Session

// TODO: set last activity can be an interceptor for services
// TODO: resolve how to disconnect inactive people

app.post('/services/save/chat/window', 
    userAuth.autorizer,
    function (req, res) {
    // Should receive
    // req.body.chatroomname
    // Saves minimized window UI
    // everytime you open a chatroom UI
    res.json(req.body);
});

app.post('/services/remove/chat/window', 
    userAuth.autorizer,
    function (req, res) {
    // Should receive
    // req.body.chatroomname
    // Removes minimized window UI
    // everytime you close a chatroom UI
    res.json(req.body);
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

