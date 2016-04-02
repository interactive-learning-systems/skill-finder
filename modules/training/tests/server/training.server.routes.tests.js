'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Training = mongoose.model('Training'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  training;

/**
 * Training routes tests
 */
describe('Training CRUD tests', function () {

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

    // Save a user to the test db and create new training
    user.save(function () {
      training = {
        title: 'Training Title',
        content: 'Training Content'
      };

      done();
    });
  });

  it('should be able to save an training if logged in', function (done) {
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

        // Save a new training
        agent.post('/api/trainings')
          .send(training)
          .expect(200)
          .end(function (trainingSaveErr, trainingSaveRes) {
            // Handle training save error
            if (trainingSaveErr) {
              return done(trainingSaveErr);
            }

            // Get a list of trainings
            agent.get('/api/trainings')
              .end(function (trainingsGetErr, trainingsGetRes) {
                // Handle training save error
                if (trainingsGetErr) {
                  return done(trainingsGetErr);
                }

                // Get trainings list
                var trainings = trainingsGetRes.body;

                // Set assertions
                (trainings[0].user._id).should.equal(userId);
                (trainings[0].title).should.match('Training Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an training if not logged in', function (done) {
    agent.post('/api/trainings')
      .send(training)
      .expect(403)
      .end(function (trainingSaveErr, trainingSaveRes) {
        // Call the assertion callback
        done(trainingSaveErr);
      });
  });

  it('should not be able to save an training if no title is provided', function (done) {
    // Invalidate title field
    training.title = '';

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

        // Save a new training
        agent.post('/api/trainings')
          .send(training)
          .expect(400)
          .end(function (trainingSaveErr, trainingSaveRes) {
            // Set message assertion
            (trainingSaveRes.body.message).should.match('Title cannot be blank');

            // Handle training save error
            done(trainingSaveErr);
          });
      });
  });

  it('should be able to update an training if signed in', function (done) {
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

        // Save a new training
        agent.post('/api/trainings')
          .send(training)
          .expect(200)
          .end(function (trainingSaveErr, trainingSaveRes) {
            // Handle training save error
            if (trainingSaveErr) {
              return done(trainingSaveErr);
            }

            // Update training title
            training.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing training
            agent.put('/api/trainings/' + trainingSaveRes.body._id)
              .send(training)
              .expect(200)
              .end(function (trainingUpdateErr, trainingUpdateRes) {
                // Handle training update error
                if (trainingUpdateErr) {
                  return done(trainingUpdateErr);
                }

                // Set assertions
                (trainingUpdateRes.body._id).should.equal(trainingSaveRes.body._id);
                (trainingUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of trainings if not signed in', function (done) {
    // Create new training model instance
    var trainingObj = new Training(training);

    // Save the training
    trainingObj.save(function () {
      // Request trainings
      request(app).get('/api/trainings')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single training if not signed in', function (done) {
    // Create new training model instance
    var trainingObj = new Training(training);

    // Save the training
    trainingObj.save(function () {
      request(app).get('/api/trainings/' + trainingObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', training.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single training with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/trainings/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Training is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single training which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent training
    request(app).get('/api/trainings/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No training with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an training if signed in', function (done) {
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

        // Save a new training
        agent.post('/api/trainings')
          .send(training)
          .expect(200)
          .end(function (trainingSaveErr, trainingSaveRes) {
            // Handle training save error
            if (trainingSaveErr) {
              return done(trainingSaveErr);
            }

            // Delete an existing training
            agent.delete('/api/trainings/' + trainingSaveRes.body._id)
              .send(training)
              .expect(200)
              .end(function (trainingDeleteErr, trainingDeleteRes) {
                // Handle training error error
                if (trainingDeleteErr) {
                  return done(trainingDeleteErr);
                }

                // Set assertions
                (trainingDeleteRes.body._id).should.equal(trainingSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an training if not signed in', function (done) {
    // Set training user
    training.user = user;

    // Create new training model instance
    var trainingObj = new Training(training);

    // Save the training
    trainingObj.save(function () {
      // Try deleting training
      request(app).delete('/api/trainings/' + trainingObj._id)
        .expect(403)
        .end(function (trainingDeleteErr, trainingDeleteRes) {
          // Set message assertion
          (trainingDeleteRes.body.message).should.match('User is not authorized');

          // Handle training error error
          done(trainingDeleteErr);
        });

    });
  });

  it('should be able to get a single training that has an orphaned user reference', function (done) {
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

          // Save a new training
          agent.post('/api/trainings')
            .send(training)
            .expect(200)
            .end(function (trainingSaveErr, trainingSaveRes) {
              // Handle training save error
              if (trainingSaveErr) {
                return done(trainingSaveErr);
              }

              // Set assertions on new training
              (trainingSaveRes.body.title).should.equal(training.title);
              should.exist(trainingSaveRes.body.user);
              should.equal(trainingSaveRes.body.user._id, orphanId);

              // force the training to have an orphaned user reference
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

                    // Get the training
                    agent.get('/api/trainings/' + trainingSaveRes.body._id)
                      .expect(200)
                      .end(function (trainingInfoErr, trainingInfoRes) {
                        // Handle training error
                        if (trainingInfoErr) {
                          return done(trainingInfoErr);
                        }

                        // Set assertions
                        (trainingInfoRes.body._id).should.equal(trainingSaveRes.body._id);
                        (trainingInfoRes.body.title).should.equal(training.title);
                        should.equal(trainingInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single training if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new training model instance
    training.user = user;
    var trainingObj = new Training(training);

    // Save the training
    trainingObj.save(function () {
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

          // Save a new training
          agent.post('/api/trainings')
            .send(training)
            .expect(200)
            .end(function (trainingSaveErr, trainingSaveRes) {
              // Handle training save error
              if (trainingSaveErr) {
                return done(trainingSaveErr);
              }

              // Get the training
              agent.get('/api/trainings/' + trainingSaveRes.body._id)
                .expect(200)
                .end(function (trainingInfoErr, trainingInfoRes) {
                  // Handle training error
                  if (trainingInfoErr) {
                    return done(trainingInfoErr);
                  }

                  // Set assertions
                  (trainingInfoRes.body._id).should.equal(trainingSaveRes.body._id);
                  (trainingInfoRes.body.title).should.equal(training.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (trainingInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single training if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new training model instance
    var trainingObj = new Training(training);

    // Save the training
    trainingObj.save(function () {
      request(app).get('/api/trainings/' + trainingObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', training.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single training, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
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

      // Sign in with the user that will create the Training
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

          // Save a new training
          agent.post('/api/trainings')
            .send(training)
            .expect(200)
            .end(function (trainingSaveErr, trainingSaveRes) {
              // Handle training save error
              if (trainingSaveErr) {
                return done(trainingSaveErr);
              }

              // Set assertions on new training
              (trainingSaveRes.body.title).should.equal(training.title);
              should.exist(trainingSaveRes.body.user);
              should.equal(trainingSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the training
                  agent.get('/api/trainings/' + trainingSaveRes.body._id)
                    .expect(200)
                    .end(function (trainingInfoErr, trainingInfoRes) {
                      // Handle training error
                      if (trainingInfoErr) {
                        return done(trainingInfoErr);
                      }

                      // Set assertions
                      (trainingInfoRes.body._id).should.equal(trainingSaveRes.body._id);
                      (trainingInfoRes.body.title).should.equal(training.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (trainingInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Training.remove().exec(done);
    });
  });
});
