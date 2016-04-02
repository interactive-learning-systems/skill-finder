'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Compensation = mongoose.model('Compensation'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  compensation;

/**
 * Compensation routes tests
 */
describe('Compensation CRUD tests', function () {

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

    // Save a user to the test db and create new compensation
    user.save(function () {
      compensation = {
        title: 'Compensation Title',
        content: 'Compensation Content'
      };

      done();
    });
  });

  it('should be able to save an compensation if logged in', function (done) {
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

        // Save a new compensation
        agent.post('/api/compensations')
          .send(compensation)
          .expect(200)
          .end(function (compensationSaveErr, compensationSaveRes) {
            // Handle compensation save error
            if (compensationSaveErr) {
              return done(compensationSaveErr);
            }

            // Get a list of compensations
            agent.get('/api/compensations')
              .end(function (compensationsGetErr, compensationsGetRes) {
                // Handle compensation save error
                if (compensationsGetErr) {
                  return done(compensationsGetErr);
                }

                // Get compensations list
                var compensations = compensationsGetRes.body;

                // Set assertions
                (compensations[0].user._id).should.equal(userId);
                (compensations[0].title).should.match('Compensation Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an compensation if not logged in', function (done) {
    agent.post('/api/compensations')
      .send(compensation)
      .expect(403)
      .end(function (compensationSaveErr, compensationSaveRes) {
        // Call the assertion callback
        done(compensationSaveErr);
      });
  });

  it('should not be able to save an compensation if no title is provided', function (done) {
    // Invalidate title field
    compensation.title = '';

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

        // Save a new compensation
        agent.post('/api/compensations')
          .send(compensation)
          .expect(400)
          .end(function (compensationSaveErr, compensationSaveRes) {
            // Set message assertion
            (compensationSaveRes.body.message).should.match('Title cannot be blank');

            // Handle compensation save error
            done(compensationSaveErr);
          });
      });
  });

  it('should be able to update an compensation if signed in', function (done) {
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

        // Save a new compensation
        agent.post('/api/compensations')
          .send(compensation)
          .expect(200)
          .end(function (compensationSaveErr, compensationSaveRes) {
            // Handle compensation save error
            if (compensationSaveErr) {
              return done(compensationSaveErr);
            }

            // Update compensation title
            compensation.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing compensation
            agent.put('/api/compensations/' + compensationSaveRes.body._id)
              .send(compensation)
              .expect(200)
              .end(function (compensationUpdateErr, compensationUpdateRes) {
                // Handle compensation update error
                if (compensationUpdateErr) {
                  return done(compensationUpdateErr);
                }

                // Set assertions
                (compensationUpdateRes.body._id).should.equal(compensationSaveRes.body._id);
                (compensationUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of compensations if not signed in', function (done) {
    // Create new compensation model instance
    var compensationObj = new Compensation(compensation);

    // Save the compensation
    compensationObj.save(function () {
      // Request compensations
      request(app).get('/api/compensations')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single compensation if not signed in', function (done) {
    // Create new compensation model instance
    var compensationObj = new Compensation(compensation);

    // Save the compensation
    compensationObj.save(function () {
      request(app).get('/api/compensations/' + compensationObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', compensation.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single compensation with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/compensations/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Compensation is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single compensation which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent compensation
    request(app).get('/api/compensations/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No compensation with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an compensation if signed in', function (done) {
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

        // Save a new compensation
        agent.post('/api/compensations')
          .send(compensation)
          .expect(200)
          .end(function (compensationSaveErr, compensationSaveRes) {
            // Handle compensation save error
            if (compensationSaveErr) {
              return done(compensationSaveErr);
            }

            // Delete an existing compensation
            agent.delete('/api/compensations/' + compensationSaveRes.body._id)
              .send(compensation)
              .expect(200)
              .end(function (compensationDeleteErr, compensationDeleteRes) {
                // Handle compensation error error
                if (compensationDeleteErr) {
                  return done(compensationDeleteErr);
                }

                // Set assertions
                (compensationDeleteRes.body._id).should.equal(compensationSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an compensation if not signed in', function (done) {
    // Set compensation user
    compensation.user = user;

    // Create new compensation model instance
    var compensationObj = new Compensation(compensation);

    // Save the compensation
    compensationObj.save(function () {
      // Try deleting compensation
      request(app).delete('/api/compensations/' + compensationObj._id)
        .expect(403)
        .end(function (compensationDeleteErr, compensationDeleteRes) {
          // Set message assertion
          (compensationDeleteRes.body.message).should.match('User is not authorized');

          // Handle compensation error error
          done(compensationDeleteErr);
        });

    });
  });

  it('should be able to get a single compensation that has an orphaned user reference', function (done) {
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

          // Save a new compensation
          agent.post('/api/compensations')
            .send(compensation)
            .expect(200)
            .end(function (compensationSaveErr, compensationSaveRes) {
              // Handle compensation save error
              if (compensationSaveErr) {
                return done(compensationSaveErr);
              }

              // Set assertions on new compensation
              (compensationSaveRes.body.title).should.equal(compensation.title);
              should.exist(compensationSaveRes.body.user);
              should.equal(compensationSaveRes.body.user._id, orphanId);

              // force the compensation to have an orphaned user reference
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

                    // Get the compensation
                    agent.get('/api/compensations/' + compensationSaveRes.body._id)
                      .expect(200)
                      .end(function (compensationInfoErr, compensationInfoRes) {
                        // Handle compensation error
                        if (compensationInfoErr) {
                          return done(compensationInfoErr);
                        }

                        // Set assertions
                        (compensationInfoRes.body._id).should.equal(compensationSaveRes.body._id);
                        (compensationInfoRes.body.title).should.equal(compensation.title);
                        should.equal(compensationInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single compensation if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new compensation model instance
    compensation.user = user;
    var compensationObj = new Compensation(compensation);

    // Save the compensation
    compensationObj.save(function () {
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

          // Save a new compensation
          agent.post('/api/compensations')
            .send(compensation)
            .expect(200)
            .end(function (compensationSaveErr, compensationSaveRes) {
              // Handle compensation save error
              if (compensationSaveErr) {
                return done(compensationSaveErr);
              }

              // Get the compensation
              agent.get('/api/compensations/' + compensationSaveRes.body._id)
                .expect(200)
                .end(function (compensationInfoErr, compensationInfoRes) {
                  // Handle compensation error
                  if (compensationInfoErr) {
                    return done(compensationInfoErr);
                  }

                  // Set assertions
                  (compensationInfoRes.body._id).should.equal(compensationSaveRes.body._id);
                  (compensationInfoRes.body.title).should.equal(compensation.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (compensationInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single compensation if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new compensation model instance
    var compensationObj = new Compensation(compensation);

    // Save the compensation
    compensationObj.save(function () {
      request(app).get('/api/compensations/' + compensationObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', compensation.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single compensation, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
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

      // Sign in with the user that will create the Compensation
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

          // Save a new compensation
          agent.post('/api/compensations')
            .send(compensation)
            .expect(200)
            .end(function (compensationSaveErr, compensationSaveRes) {
              // Handle compensation save error
              if (compensationSaveErr) {
                return done(compensationSaveErr);
              }

              // Set assertions on new compensation
              (compensationSaveRes.body.title).should.equal(compensation.title);
              should.exist(compensationSaveRes.body.user);
              should.equal(compensationSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the compensation
                  agent.get('/api/compensations/' + compensationSaveRes.body._id)
                    .expect(200)
                    .end(function (compensationInfoErr, compensationInfoRes) {
                      // Handle compensation error
                      if (compensationInfoErr) {
                        return done(compensationInfoErr);
                      }

                      // Set assertions
                      (compensationInfoRes.body._id).should.equal(compensationSaveRes.body._id);
                      (compensationInfoRes.body.title).should.equal(compensation.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (compensationInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Compensation.remove().exec(done);
    });
  });
});
