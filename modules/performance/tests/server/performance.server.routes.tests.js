'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Performance = mongoose.model('Performance'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  performance;

/**
 * Performance routes tests
 */
describe('Performance CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new performance
    user.save(function () {
      performance = {
        title: 'Performance Title',
        content: 'Performance Content'
      };

      done();
    });
  });

  it('should be able to save an performance if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new performance
        agent.post('/api/performances')
          .send(performance)
          .expect(200)
          .end(function (performanceSaveErr, performanceSaveRes) {
            // Handle performance save error
            if (performanceSaveErr) {
              return done(performanceSaveErr);
            }

            // Get a list of performances
            agent.get('/api/performances')
              .end(function (performancesGetErr, performancesGetRes) {
                // Handle performance save error
                if (performancesGetErr) {
                  return done(performancesGetErr);
                }

                // Get performances list
                var performances = performancesGetRes.body;

                // Set assertions
                (performances[0].user._id).should.equal(userId);
                (performances[0].title).should.match('Performance Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an performance if not logged in', function (done) {
    agent.post('/api/performances')
      .send(performance)
      .expect(403)
      .end(function (performanceSaveErr, performanceSaveRes) {
        // Call the assertion callback
        done(performanceSaveErr);
      });
  });

  it('should not be able to save an performance if no title is provided', function (done) {
    // Invalidate title field
    performance.title = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new performance
        agent.post('/api/performances')
          .send(performance)
          .expect(400)
          .end(function (performanceSaveErr, performanceSaveRes) {
            // Set message assertion
            (performanceSaveRes.body.message).should.match('Title cannot be blank');

            // Handle performance save error
            done(performanceSaveErr);
          });
      });
  });

  it('should be able to update an performance if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new performance
        agent.post('/api/performances')
          .send(performance)
          .expect(200)
          .end(function (performanceSaveErr, performanceSaveRes) {
            // Handle performance save error
            if (performanceSaveErr) {
              return done(performanceSaveErr);
            }

            // Update performance title
            performance.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing performance
            agent.put('/api/performances/' + performanceSaveRes.body._id)
              .send(performance)
              .expect(200)
              .end(function (performanceUpdateErr, performanceUpdateRes) {
                // Handle performance update error
                if (performanceUpdateErr) {
                  return done(performanceUpdateErr);
                }

                // Set assertions
                (performanceUpdateRes.body._id).should.equal(performanceSaveRes.body._id);
                (performanceUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of performances if not signed in', function (done) {
    // Create new performance model instance
    var performanceObj = new Performance(performance);

    // Save the performance
    performanceObj.save(function () {
      // Request performances
      request(app).get('/api/performances')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single performance if not signed in', function (done) {
    // Create new performance model instance
    var performanceObj = new Performance(performance);

    // Save the performance
    performanceObj.save(function () {
      request(app).get('/api/performances/' + performanceObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', performance.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single performance with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/performances/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Performance is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single performance which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent performance
    request(app).get('/api/performances/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No performance with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an performance if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new performance
        agent.post('/api/performances')
          .send(performance)
          .expect(200)
          .end(function (performanceSaveErr, performanceSaveRes) {
            // Handle performance save error
            if (performanceSaveErr) {
              return done(performanceSaveErr);
            }

            // Delete an existing performance
            agent.delete('/api/performances/' + performanceSaveRes.body._id)
              .send(performance)
              .expect(200)
              .end(function (performanceDeleteErr, performanceDeleteRes) {
                // Handle performance error error
                if (performanceDeleteErr) {
                  return done(performanceDeleteErr);
                }

                // Set assertions
                (performanceDeleteRes.body._id).should.equal(performanceSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an performance if not signed in', function (done) {
    // Set performance user
    performance.user = user;

    // Create new performance model instance
    var performanceObj = new Performance(performance);

    // Save the performance
    performanceObj.save(function () {
      // Try deleting performance
      request(app).delete('/api/performances/' + performanceObj._id)
        .expect(403)
        .end(function (performanceDeleteErr, performanceDeleteRes) {
          // Set message assertion
          (performanceDeleteRes.body.message).should.match('User is not authorized');

          // Handle performance error error
          done(performanceDeleteErr);
        });

    });
  });

  it('should be able to get a single performance that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new performance
          agent.post('/api/performances')
            .send(performance)
            .expect(200)
            .end(function (performanceSaveErr, performanceSaveRes) {
              // Handle performance save error
              if (performanceSaveErr) {
                return done(performanceSaveErr);
              }

              // Set assertions on new performance
              (performanceSaveRes.body.title).should.equal(performance.title);
              should.exist(performanceSaveRes.body.user);
              should.equal(performanceSaveRes.body.user._id, orphanId);

              // force the performance to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the performance
                    agent.get('/api/performances/' + performanceSaveRes.body._id)
                      .expect(200)
                      .end(function (performanceInfoErr, performanceInfoRes) {
                        // Handle performance error
                        if (performanceInfoErr) {
                          return done(performanceInfoErr);
                        }

                        // Set assertions
                        (performanceInfoRes.body._id).should.equal(performanceSaveRes.body._id);
                        (performanceInfoRes.body.title).should.equal(performance.title);
                        should.equal(performanceInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single performance if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new performance model instance
    performance.user = user;
    var performanceObj = new Performance(performance);

    // Save the performance
    performanceObj.save(function () {
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = user.id;

          // Save a new performance
          agent.post('/api/performances')
            .send(performance)
            .expect(200)
            .end(function (performanceSaveErr, performanceSaveRes) {
              // Handle performance save error
              if (performanceSaveErr) {
                return done(performanceSaveErr);
              }

              // Get the performance
              agent.get('/api/performances/' + performanceSaveRes.body._id)
                .expect(200)
                .end(function (performanceInfoErr, performanceInfoRes) {
                  // Handle performance error
                  if (performanceInfoErr) {
                    return done(performanceInfoErr);
                  }

                  // Set assertions
                  (performanceInfoRes.body._id).should.equal(performanceSaveRes.body._id);
                  (performanceInfoRes.body.title).should.equal(performance.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (performanceInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single performance if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new performance model instance
    var performanceObj = new Performance(performance);

    // Save the performance
    performanceObj.save(function () {
      request(app).get('/api/performances/' + performanceObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', performance.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single performance, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create temporary user creds
    var _creds = {
      username: 'temp',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create temporary user
    var _user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'temp@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _user.save(function (err, _user) {
      // Handle save error
      if (err) {
        return done(err);
      }

      // Sign in with the user that will create the Performance
      agent.post('/api/auth/signin')
        .send(credentials)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var userId = user._id;

          // Save a new performance
          agent.post('/api/performances')
            .send(performance)
            .expect(200)
            .end(function (performanceSaveErr, performanceSaveRes) {
              // Handle performance save error
              if (performanceSaveErr) {
                return done(performanceSaveErr);
              }

              // Set assertions on new performance
              (performanceSaveRes.body.title).should.equal(performance.title);
              should.exist(performanceSaveRes.body.user);
              should.equal(performanceSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the performance
                  agent.get('/api/performances/' + performanceSaveRes.body._id)
                    .expect(200)
                    .end(function (performanceInfoErr, performanceInfoRes) {
                      // Handle performance error
                      if (performanceInfoErr) {
                        return done(performanceInfoErr);
                      }

                      // Set assertions
                      (performanceInfoRes.body._id).should.equal(performanceSaveRes.body._id);
                      (performanceInfoRes.body.title).should.equal(performance.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (performanceInfoRes.body.isCurrentUserOwner).should.equal(false);

                      // Call the assertion callback
                      done();
                    });
                });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Performance.remove().exec(done);
    });
  });
});
