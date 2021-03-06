var _ = require('lodash');
var promise = require('bluebird');
var github = require('octonode');
var fs      = require('fs');
var pagination = require('pagination');

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

function getGitHubUser(token, callback) {
  var client = github.client(token);
  var ghme = client.me();

  ghme.info(function (err, data, headers) {
    var username = data.login || null;
    if (!username) {
      throw new Error('No username!');
    }

    if (typeof callback === 'function') {
      callback(username);
    }
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

function searchReposByTag(req, res, next) {
  var tag = req.params.tag;
  var page = parseInt(req.params.page, 10) || 1;
  var perPage = 10;

  db.one("SELECT COUNT(*) FROM tags WHERE tag = $1", tag)
    .then(function (amount) {
      var totalResult = +amount.count || 0;
      if (totalResult > 0) {
        var paginator = new pagination.SearchPaginator({
          prelink:'/',
          current: page,
          rowsPerPage: perPage,
          totalResult: totalResult
        });
        var pageData = paginator.getPaginationData();

        db.func(`fn_getreposbytag`, [tag, perPage, page])
          .then(function (data) {
            res.status(200)
              .json({
                status: 'success',
                data: data,
                pageData: {
                  previous: pageData.previous,
                  next: pageData.next,
                  first: pageData.first,
                  last: pageData.last,
                },
              });
          })
          .catch(function (err) {
            return next(err);
          });
      } else {
        return next('No data');
      }
    })
    .catch(function (err) {
      return next(err);
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

function retrieveRandomTags(req, res, next) {
  db.any(`SELECT tag FROM tags
    WHERE isPublic = true GROUP BY tag ORDER BY random() LIMIT 10;`
  ).then(function (data) {
    var result = _.map(data, 'tag');
    res.status(200)
      .json({
        status: 'success',
        data: result
      });
  })
  .catch(function (err) {
    return next(err);
  });
}

function getTagsByRepo(req, res, next) {
  var owner = req.params.owner;
  var repo = req.params.repo;

  var token;
  try {
    token = req.headers.authorization.replace('token ', '');
  } catch (err) {
    return next('no token');
  }

  getGitHubUser(token, function (username) {
    db.task(function (t) {
      return t.batch([
        t.any(`SELECT MAX(id) AS id, tag, COUNT(tag) AS vote
          FROM tags WHERE repo = $1 AND isPublic = true
          GROUP BY tag ORDER BY vote DESC LIMIT 10`,
          owner + '/' + repo),
        t.any(`SELECT id, tag
          FROM tags WHERE repo = $1 AND username = $2
          ORDER BY created_at DESC`,
          [owner + '/' + repo, username])
      ]);
    })
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          data: {
            public: data[0],
            private: data[1]
          }
        });
    })
    .catch(function (err) {
      return next(err);
    });
  });
}

function getTagsByUser(req, res, next) {
  var token;
  try {
    token = req.headers.authorization.replace('token ', '');
  } catch (err) {
    return next('no token');
  }

  var owner = req.params.owner;
  var repo = req.params.repo;
  getGitHubUser(token, function (username) {
    db.any(`SELECT tag
      FROM tags WHERE repo = $1 AND username = $2
      ORDER BY created_at DESC`,
      [owner + '/' + repo, username])
      .then(function (data) {
        var tags = _.map(data, 'tag');
        res.status(200)
          .json({
            status: 'success',
            data: tags
          });
      })
      .catch(function (err) {
        return next(err);
      });
  });
}

function createTag(req, res, next) {
  var token;
  try {
    token = req.body.headers.authorization.replace('token ', '');
  } catch (err) {
    return next('no token');
  }

  req.body.data.isPublic = req.body.data.isPublic ? true : false;

  getGitHubUser(token, function (username) {
    db.one('SELECT COUNT(*) FROM tags WHERE username = $1 AND tag = $2',
      [username, req.body.data.tag])
      .then(function (data) {
        if (+data.count === 0) {
          db.none('INSERT INTO tags (username, repo, tag, isPublic)' +
              'VALUES($1, $2, $3, $4)',
            [username, req.body.data.repo, req.body.data.tag, req.body.data.isPublic])
            .then(function () {
              res.status(200)
                .json({
                  status: 'success'
                });
            })
            .catch(function (err) {
              return next(err);
            });
        } else {
          res.status(409)
            .json({
              status: 'failed',
              message: 'duplicated tag by you'
            });
        }
      })
      .catch(function (err) {
        return next(err);
      });
  });
}

function removeTag(req, res, next) {
  var token;
  try {
    token = req.headers.authorization.replace('token ', '');
  } catch (err) {
    return next('no token');
  }

  getGitHubUser(token, function (username) {
    db.one('SELECT COUNT(*) FROM tags WHERE username = $1 AND id = $2',
      [username, req.params.id])
      .then(function (data) {
        if (+data.count === 1) {
          db.result('DELETE FROM tags WHERE username = $1 AND id = $2',
            [username, req.params.id])
            .then(function (result) {
              if (result.rowCount) {
                res.status(200)
                  .json({
                    status: 'success'
                  });
              } else {
                res.status(404)
                  .json({
                    status: 'failed',
                    message: 'delete failed'
                  });
              }
            })
            .catch(function (err) {
              return next(err);
            });
        } else {
          res.status(404)
            .json({
              status: 'failed',
              message: 'no this data'
            });
        }
      })
      .catch(function (err) {
        return next(err);
      });
  });
}

module.exports = {
  retrieveRandomTags: retrieveRandomTags,
  searchRepos: searchRepos,
  searchReposByTag: searchReposByTag,
  getTagsByRepo: getTagsByRepo,
  getTagsByUser: getTagsByUser,
  removeTag: removeTag,
  createTag: createTag,
};
