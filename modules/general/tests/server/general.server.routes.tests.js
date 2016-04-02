'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  General = mongoose.model('General'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  general;

/**
 * General routes tests
 */
describe('General CRUD tests', function () {

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

    // Save a user to the test db and create new general
    user.save(function () {
      general = {
        title: 'General Title',
        content: 'General Content'
      };

      done();
    });
  });

  it('should be able to save an general if logged in', function (done) {
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

        // Save a new general
        agent.post('/api/generals')
          .send(general)
          .expect(200)
          .end(function (generalSaveErr, generalSaveRes) {
            // Handle general save error
            if (generalSaveErr) {
              return done(generalSaveErr);
            }

            // Get a list of generals
            agent.get('/api/generals')
              .end(function (generalsGetErr, generalsGetRes) {
                // Handle general save error
                if (generalsGetErr) {
                  return done(generalsGetErr);
                }

                // Get generals list
                var generals = generalsGetRes.body;

                // Set assertions
                (generals[0].user._id).should.equal(userId);
                (generals[0].title).should.match('General Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an general if not logged in', function (done) {
    agent.post('/api/generals')
      .send(general)
      .expect(403)
      .end(function (generalSaveErr, generalSaveRes) {
        // Call the assertion callback
        done(generalSaveErr);
      });
  });

  it('should not be able to save an general if no title is provided', function (done) {
    // Invalidate title field
    general.title = '';

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

        // Save a new general
        agent.post('/api/generals')
          .send(general)
          .expect(400)
          .end(function (generalSaveErr, generalSaveRes) {
            // Set message assertion
            (generalSaveRes.body.message).should.match('Title cannot be blank');

            // Handle general save error
            done(generalSaveErr);
          });
      });
  });

  it('should be able to update an general if signed in', function (done) {
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

        // Save a new general
        agent.post('/api/generals')
          .send(general)
          .expect(200)
          .end(function (generalSaveErr, generalSaveRes) {
            // Handle general save error
            if (generalSaveErr) {
              return done(generalSaveErr);
            }

            // Update general title
            general.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing general
            agent.put('/api/generals/' + generalSaveRes.body._id)
              .send(general)
              .expect(200)
              .end(function (generalUpdateErr, generalUpdateRes) {
                // Handle general update error
                if (generalUpdateErr) {
                  return done(generalUpdateErr);
                }

                // Set assertions
                (generalUpdateRes.body._id).should.equal(generalSaveRes.body._id);
                (generalUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of generals if not signed in', function (done) {
    // Create new general model instance
    var generalObj = new General(general);

    // Save the general
    generalObj.save(function () {
      // Request generals
      request(app).get('/api/generals')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single general if not signed in', function (done) {
    // Create new general model instance
    var generalObj = new General(general);

    // Save the general
    generalObj.save(function () {
      request(app).get('/api/generals/' + generalObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', general.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single general with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/generals/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'General is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single general which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent general
    request(app).get('/api/generals/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No general with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an general if signed in', function (done) {
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

        // Save a new general
        agent.post('/api/generals')
          .send(general)
          .expect(200)
          .end(function (generalSaveErr, generalSaveRes) {
            // Handle general save error
            if (generalSaveErr) {
              return done(generalSaveErr);
            }

            // Delete an existing general
            agent.delete('/api/generals/' + generalSaveRes.body._id)
              .send(general)
              .expect(200)
              .end(function (generalDeleteErr, generalDeleteRes) {
                // Handle general error error
                if (generalDeleteErr) {
                  return done(generalDeleteErr);
                }

                // Set assertions
                (generalDeleteRes.body._id).should.equal(generalSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an general if not signed in', function (done) {
    // Set general user
    general.user = user;

    // Create new general model instance
    var generalObj = new General(general);

    // Save the general
    generalObj.save(function () {
      // Try deleting general
      request(app).delete('/api/generals/' + generalObj._id)
        .expect(403)
        .end(function (generalDeleteErr, generalDeleteRes) {
          // Set message assertion
          (generalDeleteRes.body.message).should.match('User is not authorized');

          // Handle general error error
          done(generalDeleteErr);
        });

    });
  });

  it('should be able to get a single general that has an orphaned user reference', function (done) {
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

          // Save a new general
          agent.post('/api/generals')
            .send(general)
            .expect(200)
            .end(function (generalSaveErr, generalSaveRes) {
              // Handle general save error
              if (generalSaveErr) {
                return done(generalSaveErr);
              }

              // Set assertions on new general
              (generalSaveRes.body.title).should.equal(general.title);
              should.exist(generalSaveRes.body.user);
              should.equal(generalSaveRes.body.user._id, orphanId);

              // force the general to have an orphaned user reference
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

                    // Get the general
                    agent.get('/api/generals/' + generalSaveRes.body._id)
                      .expect(200)
                      .end(function (generalInfoErr, generalInfoRes) {
                        // Handle general error
                        if (generalInfoErr) {
                          return done(generalInfoErr);
                        }

                        // Set assertions
                        (generalInfoRes.body._id).should.equal(generalSaveRes.body._id);
                        (generalInfoRes.body.title).should.equal(general.title);
                        should.equal(generalInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single general if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new general model instance
    general.user = user;
    var generalObj = new General(general);

    // Save the general
    generalObj.save(function () {
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

          // Save a new general
          agent.post('/api/generals')
            .send(general)
            .expect(200)
            .end(function (generalSaveErr, generalSaveRes) {
              // Handle general save error
              if (generalSaveErr) {
                return done(generalSaveErr);
              }

              // Get the general
              agent.get('/api/generals/' + generalSaveRes.body._id)
                .expect(200)
                .end(function (generalInfoErr, generalInfoRes) {
                  // Handle general error
                  if (generalInfoErr) {
                    return done(generalInfoErr);
                  }

                  // Set assertions
                  (generalInfoRes.body._id).should.equal(generalSaveRes.body._id);
                  (generalInfoRes.body.title).should.equal(general.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (generalInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single general if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new general model instance
    var generalObj = new General(general);

    // Save the general
    generalObj.save(function () {
      request(app).get('/api/generals/' + generalObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', general.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single general, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
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

      // Sign in with the user that will create the General
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

          // Save a new general
          agent.post('/api/generals')
            .send(general)
            .expect(200)
            .end(function (generalSaveErr, generalSaveRes) {
              // Handle general save error
              if (generalSaveErr) {
                return done(generalSaveErr);
              }

              // Set assertions on new general
              (generalSaveRes.body.title).should.equal(general.title);
              should.exist(generalSaveRes.body.user);
              should.equal(generalSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the general
                  agent.get('/api/generals/' + generalSaveRes.body._id)
                    .expect(200)
                    .end(function (generalInfoErr, generalInfoRes) {
                      // Handle general error
                      if (generalInfoErr) {
                        return done(generalInfoErr);
                      }

                      // Set assertions
                      (generalInfoRes.body._id).should.equal(generalSaveRes.body._id);
                      (generalInfoRes.body.title).should.equal(general.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (generalInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      General.remove().exec(done);
    });
  });
});
