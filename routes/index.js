var express = require('express');
var router = express.Router();
var GitHubApi = require('github');
var cdnjs = require('cdnjs');
var Q = require('q');

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

router.get('/devpack', function(req, res) {
  res.render('devpack', { title: 'Devpack' });
});

router.get('/projects', function(req, res) {
  res.render('projects', { title: 'Devpack' });
});

router.get('/archive', function(req, res) {
  res.render('archive', { title: 'Devpack' });
});

router.get('/about', function(req, res) {
  res.render('about', { title: 'Devpack' });
});

router.get('/search', searchCtrl);

function searchCtrl(req, res, next) {
  console.log('search...')
  var query = req.query.query || req.body.query;

  var end = {
    cdnjs: false,
    github: false
  }

  var result = {
    total_count: 0,
    items: []
  };

  cdnjs.search(query, function (err, packages) {
    packages && packages.forEach(function(_package) {
      result.items.push({
        name: _package.name,
        archive_url: _package.url,
        avatar_url: '',
        watchers: '',
        type: 'cdnjs'
      })
    });
    end.cdnjs = true;
    if (end.github) {
      res.send(result);
    }
  });

  github.search.repos({
    q: query
  }, function(_err, _res) {
    _res && _res.items.forEach(function(item) {
      result.items.push({
        name: item.name,
        archive_url: item.html_url + '/archive/master.zip',
        avatar_url: item.owner.avatar_url,
        watchers: item.watchers,
        type: 'github'
      });
    });
    result.total_count = res.total_count;
    end.github = true;
    if (end.cdnjs) {
      res.send(result);
    }
  });
}

module.exports = router;
