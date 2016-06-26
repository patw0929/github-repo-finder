var _ = require('lodash');
var promise = require('bluebird');
var github = require('octonode');
var fs      = require('fs');

// Load config defaults from JSON file.
// Environment variables override defaults.
function loadConfig() {
  var config = JSON.parse(fs.readFileSync(__dirname+ '/config.json', 'utf-8'));
  for (var i in config) {
    config[i] = process.env[i.toUpperCase()] || config[i];
  }
  console.log('Configuration');
  console.log(config);
  return config;
}

var config = loadConfig();

var options = {
  // Initialization Options
  promiseLib: promise
};

var pgp = require('pg-promise')(options);
var connectionString = config.pgsql_url; //'postgres://localhost:5432/github_repo_finder';
var db = pgp(connectionString);

function getGitHubUser(token) {
  var client = github.client(token);

  client.get('/user', {}, function (err, status, body, headers) {
    return body.login;
  });
}

function searchRepos(req, res, next) {
  var q = req.query.q;
  var page = req.query.page;
  var token = req.headers.authorization.replace('token ', '');

  var client = github.client(token);
  var ghsearch = client.search();

  ghsearch.repos({
    q: q,
    page: page
  }, function (err, data, headers) {
    if (!err) {
      var links = headers.link;
      var items = data.items;
      appendTags(items).then(function (response) {
        var parsedItems = items.map(function (item) {
          return Object.assign({}, item, {
            tags: _.find(response, function (o) {
              return o.repo === item.full_name;
            }).tags
          });
        });


        res.writeHead(200, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        });
        res.end(JSON.stringify({
          items: parsedItems,
          pages: links
        }));
      });
    } else {
      return next(err);
    }
  });
}

function appendTags(items) {
  return promise.all(items.map(function (item) {
    return retrieveTags(item.full_name);
  }));
}

function retrieveTags(repoFullName) {
  return db.any(`SELECT tag, COUNT(tag) AS vote
    FROM tags WHERE repo = $1 AND isPublic = true
    GROUP BY tag ORDER BY vote DESC LIMIT 3`,
    repoFullName)
    .then(function (data) {
      return {
        repo: repoFullName,
        tags: data
      };
    })
    .catch(function (err) {
      console.log(err);
    });
}

function getTagsByRepo(req, res, next) {
  var owner = req.params.owner;
  var repo = req.params.repo;

  db.any(`SELECT MAX(id) AS id, tag, COUNT(tag) AS vote
    FROM tags WHERE repo = $1 AND isPublic = true
    GROUP BY tag ORDER BY vote DESC LIMIT 10`,
    owner + '/' + repo)
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getTagsByUser(req, res, next) {
  var token;
  try {
    token = req.body.headers.authorization.replace('token ', '');
  } catch (err) {
    return next('no token');
  }

  var owner = req.params.owner;
  var repo = req.params.repo;
  var username = getGitHubUser(token);

  db.any(`SELECT tag
    FROM tags WHERE repo = $1 AND username = $2
    ORDER BY created_at DESC LIMIT 20`,
    [owner + '/' + repo, username])
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: data
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

function createTag(req, res, next) {
  var token;
  try {
    token = req.body.headers.authorization.replace('token ', '');
  } catch (err) {
    return next('no token');
  }

  var username = getGitHubUser(token);
  req.body.data.isPublic = req.body.data.isPublic ? true : false;
  db.none('insert into tags(username, repo, tag, isPublic)' +
      'values($1, $2, $3, $4)',
    [username, req.body.data.repo, req.body.data.tag, req.body.data.isPublic])
    .then(function () {
      res.status(200)
        .json({
          status: 'success',
          message: 'Inserted'
        });
    })
    .catch(function (err) {
      return next(err);
    });
}

module.exports = {
  searchRepos: searchRepos,
  getTagsByRepo: getTagsByRepo,
  getTagsByUser: getTagsByUser,
  createTag: createTag,
};
