'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Hire = mongoose.model('Hire'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  hire;

/**
 * Hire routes tests
 */
describe('Hire CRUD tests', function () {

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

    // Save a user to the test db and create new hire
    user.save(function () {
      hire = {
        title: 'Hire Title',
        content: 'Hire Content'
      };

      done();
    });
  });

  it('should be able to save an hire if logged in', function (done) {
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

        // Save a new hire
        agent.post('/api/hires')
          .send(hire)
          .expect(200)
          .end(function (hireSaveErr, hireSaveRes) {
            // Handle hire save error
            if (hireSaveErr) {
              return done(hireSaveErr);
            }

            // Get a list of hires
            agent.get('/api/hires')
              .end(function (hiresGetErr, hiresGetRes) {
                // Handle hire save error
                if (hiresGetErr) {
                  return done(hiresGetErr);
                }

                // Get hires list
                var hires = hiresGetRes.body;

                // Set assertions
                (hires[0].user._id).should.equal(userId);
                (hires[0].title).should.match('Hire Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an hire if not logged in', function (done) {
    agent.post('/api/hires')
      .send(hire)
      .expect(403)
      .end(function (hireSaveErr, hireSaveRes) {
        // Call the assertion callback
        done(hireSaveErr);
      });
  });

  it('should not be able to save an hire if no title is provided', function (done) {
    // Invalidate title field
    hire.title = '';

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

        // Save a new hire
        agent.post('/api/hires')
          .send(hire)
          .expect(400)
          .end(function (hireSaveErr, hireSaveRes) {
            // Set message assertion
            (hireSaveRes.body.message).should.match('Title cannot be blank');

            // Handle hire save error
            done(hireSaveErr);
          });
      });
  });

  it('should be able to update an hire if signed in', function (done) {
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

        // Save a new hire
        agent.post('/api/hires')
          .send(hire)
          .expect(200)
          .end(function (hireSaveErr, hireSaveRes) {
            // Handle hire save error
            if (hireSaveErr) {
              return done(hireSaveErr);
            }

            // Update hire title
            hire.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing hire
            agent.put('/api/hires/' + hireSaveRes.body._id)
              .send(hire)
              .expect(200)
              .end(function (hireUpdateErr, hireUpdateRes) {
                // Handle hire update error
                if (hireUpdateErr) {
                  return done(hireUpdateErr);
                }

                // Set assertions
                (hireUpdateRes.body._id).should.equal(hireSaveRes.body._id);
                (hireUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of hires if not signed in', function (done) {
    // Create new hire model instance
    var hireObj = new Hire(hire);

    // Save the hire
    hireObj.save(function () {
      // Request hires
      request(app).get('/api/hires')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single hire if not signed in', function (done) {
    // Create new hire model instance
    var hireObj = new Hire(hire);

    // Save the hire
    hireObj.save(function () {
      request(app).get('/api/hires/' + hireObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', hire.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single hire with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/hires/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Hire is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single hire which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent hire
    request(app).get('/api/hires/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No hire with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an hire if signed in', function (done) {
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

        // Save a new hire
        agent.post('/api/hires')
          .send(hire)
          .expect(200)
          .end(function (hireSaveErr, hireSaveRes) {
            // Handle hire save error
            if (hireSaveErr) {
              return done(hireSaveErr);
            }

            // Delete an existing hire
            agent.delete('/api/hires/' + hireSaveRes.body._id)
              .send(hire)
              .expect(200)
              .end(function (hireDeleteErr, hireDeleteRes) {
                // Handle hire error error
                if (hireDeleteErr) {
                  return done(hireDeleteErr);
                }

                // Set assertions
                (hireDeleteRes.body._id).should.equal(hireSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an hire if not signed in', function (done) {
    // Set hire user
    hire.user = user;

    // Create new hire model instance
    var hireObj = new Hire(hire);

    // Save the hire
    hireObj.save(function () {
      // Try deleting hire
      request(app).delete('/api/hires/' + hireObj._id)
        .expect(403)
        .end(function (hireDeleteErr, hireDeleteRes) {
          // Set message assertion
          (hireDeleteRes.body.message).should.match('User is not authorized');

          // Handle hire error error
          done(hireDeleteErr);
        });

    });
  });

  it('should be able to get a single hire that has an orphaned user reference', function (done) {
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

          // Save a new hire
          agent.post('/api/hires')
            .send(hire)
            .expect(200)
            .end(function (hireSaveErr, hireSaveRes) {
              // Handle hire save error
              if (hireSaveErr) {
                return done(hireSaveErr);
              }

              // Set assertions on new hire
              (hireSaveRes.body.title).should.equal(hire.title);
              should.exist(hireSaveRes.body.user);
              should.equal(hireSaveRes.body.user._id, orphanId);

              // force the hire to have an orphaned user reference
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

                    // Get the hire
                    agent.get('/api/hires/' + hireSaveRes.body._id)
                      .expect(200)
                      .end(function (hireInfoErr, hireInfoRes) {
                        // Handle hire error
                        if (hireInfoErr) {
                          return done(hireInfoErr);
                        }

                        // Set assertions
                        (hireInfoRes.body._id).should.equal(hireSaveRes.body._id);
                        (hireInfoRes.body.title).should.equal(hire.title);
                        should.equal(hireInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single hire if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new hire model instance
    hire.user = user;
    var hireObj = new Hire(hire);

    // Save the hire
    hireObj.save(function () {
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

          // Save a new hire
          agent.post('/api/hires')
            .send(hire)
            .expect(200)
            .end(function (hireSaveErr, hireSaveRes) {
              // Handle hire save error
              if (hireSaveErr) {
                return done(hireSaveErr);
              }

              // Get the hire
              agent.get('/api/hires/' + hireSaveRes.body._id)
                .expect(200)
                .end(function (hireInfoErr, hireInfoRes) {
                  // Handle hire error
                  if (hireInfoErr) {
                    return done(hireInfoErr);
                  }

                  // Set assertions
                  (hireInfoRes.body._id).should.equal(hireSaveRes.body._id);
                  (hireInfoRes.body.title).should.equal(hire.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (hireInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single hire if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new hire model instance
    var hireObj = new Hire(hire);

    // Save the hire
    hireObj.save(function () {
      request(app).get('/api/hires/' + hireObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', hire.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single hire, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
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

      // Sign in with the user that will create the Hire
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

          // Save a new hire
          agent.post('/api/hires')
            .send(hire)
            .expect(200)
            .end(function (hireSaveErr, hireSaveRes) {
              // Handle hire save error
              if (hireSaveErr) {
                return done(hireSaveErr);
              }

              // Set assertions on new hire
              (hireSaveRes.body.title).should.equal(hire.title);
              should.exist(hireSaveRes.body.user);
              should.equal(hireSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the hire
                  agent.get('/api/hires/' + hireSaveRes.body._id)
                    .expect(200)
                    .end(function (hireInfoErr, hireInfoRes) {
                      // Handle hire error
                      if (hireInfoErr) {
                        return done(hireInfoErr);
                      }

                      // Set assertions
                      (hireInfoRes.body._id).should.equal(hireSaveRes.body._id);
                      (hireInfoRes.body.title).should.equal(hire.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (hireInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Hire.remove().exec(done);
    });
  });
});
