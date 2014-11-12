var express = require('express');
var router = express.Router();
var GitHubApi = require("github");

var github = new GitHubApi({
  version: "3.0.0"
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Devpack' });
});

router.get('/helloworld', function(req, res) {
  res.render('helloworld', { title: 'Hello, World!' });
});

router.get('/userlist', function(req, res) {
  var db = req.db;
  var collection = db.get('usercollection');
  collection.find({}, {}, function(e, docs) {
    res.render('userlist', {
      'userlist': docs
    })
  });
});

router.get('/newuser', function(req, res) {
  res.render('newuser', {
    title: 'Add New User'
  })
});

router.post('/adduser', function(req, res) {
  var db = req.db;

  var userName = req.body.username;
  var userEmail = req.body.useremail;

  var collection = db.get('usercollection');

  collection.insert({
    'username': userName,
    'email': userEmail
  }, function(err, doc) {
    if (err) {
      res.send('There was a problem adding the information to the databse')
    } else {
      res.location('userlist');
      res.redirect('userlist');
    }
  })
});

router.post('/search', function(req, res) {
  var query = req.body.query;

  github.search.repos({
    q: query
  }, function(_err, _res) {
    var result = {
      total_count: 0,
      items: []
    };
    _res && _res.items.forEach(function(item) {
      result.items.push({
        name: item.name,
        archive_url: item.html_url + '/archive/master.zip',
        avatar_url: item.owner.avatar_url,
        watchers: item.watchers
      });
    });
    result.total_count = res.total_count;
    console.log(_res && _res.items)
    res.send(result);
  });
});

module.exports = router;
