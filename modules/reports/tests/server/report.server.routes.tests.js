'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Reports = mongoose.model('Reports'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  reports;

/**
 * Reports routes tests
 */
describe('Reports CRUD tests', function () {

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

    // Save a user to the test db and create new reports
    user.save(function () {
      reports = {
        title: 'Reports Title',
        content: 'Reports Content'
      };

      done();
    });
  });

  it('should be able to save an reports if logged in', function (done) {
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

        // Save a new reports
        agent.post('/api/reports')
          .send(reports)
          .expect(200)
          .end(function (reportsSaveErr, reportsSaveRes) {
            // Handle reports save error
            if (reportsSaveErr) {
              return done(reportsSaveErr);
            }

            // Get a list of reports
            agent.get('/api/reports')
              .end(function (reportsGetErr, reportsGetRes) {
                // Handle reports save error
                if (reportsGetErr) {
                  return done(reportsGetErr);
                }

                // Get reports list
                var reports = reportsGetRes.body;

                // Set assertions
                (reports[0].user._id).should.equal(userId);
                (reports[0].title).should.match('Reports Title');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an reports if not logged in', function (done) {
    agent.post('/api/reports')
      .send(reports)
      .expect(403)
      .end(function (reportsSaveErr, reportsSaveRes) {
        // Call the assertion callback
        done(reportsSaveErr);
      });
  });

  it('should not be able to save an reports if no title is provided', function (done) {
    // Invalidate title field
    reports.title = '';

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

        // Save a new reports
        agent.post('/api/reports')
          .send(reports)
          .expect(400)
          .end(function (reportsSaveErr, reportsSaveRes) {
            // Set message assertion
            (reportsSaveRes.body.message).should.match('Title cannot be blank');

            // Handle reports save error
            done(reportsSaveErr);
          });
      });
  });

  it('should be able to update an reports if signed in', function (done) {
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

        // Save a new reports
        agent.post('/api/reports')
          .send(reports)
          .expect(200)
          .end(function (reportsSaveErr, reportsSaveRes) {
            // Handle reports save error
            if (reportsSaveErr) {
              return done(reportsSaveErr);
            }

            // Update reports title
            reports.title = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing reports
            agent.put('/api/reports/' + reportsSaveRes.body._id)
              .send(reports)
              .expect(200)
              .end(function (reportsUpdateErr, reportsUpdateRes) {
                // Handle reports update error
                if (reportsUpdateErr) {
                  return done(reportsUpdateErr);
                }

                // Set assertions
                (reportsUpdateRes.body._id).should.equal(reportsSaveRes.body._id);
                (reportsUpdateRes.body.title).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of reports if not signed in', function (done) {
    // Create new reports model instance
    var reportsObj = new Reports(reports);

    // Save the reports
    reportsObj.save(function () {
      // Request reports
      request(app).get('/api/reports')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single reports if not signed in', function (done) {
    // Create new reports model instance
    var reportsObj = new Reports(reports);

    // Save the reports
    reportsObj.save(function () {
      request(app).get('/api/reports/' + reportsObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', reports.title);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single reports with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/reports/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Reports is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single reports which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent reports
    request(app).get('/api/reports/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No reports with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an reports if signed in', function (done) {
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

        // Save a new reports
        agent.post('/api/reports')
          .send(reports)
          .expect(200)
          .end(function (reportsSaveErr, reportsSaveRes) {
            // Handle reports save error
            if (reportsSaveErr) {
              return done(reportsSaveErr);
            }

            // Delete an existing reports
            agent.delete('/api/reports/' + reportsSaveRes.body._id)
              .send(reports)
              .expect(200)
              .end(function (reportsDeleteErr, reportsDeleteRes) {
                // Handle reports error error
                if (reportsDeleteErr) {
                  return done(reportsDeleteErr);
                }

                // Set assertions
                (reportsDeleteRes.body._id).should.equal(reportsSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an reports if not signed in', function (done) {
    // Set reports user
    reports.user = user;

    // Create new reports model instance
    var reportsObj = new Reports(reports);

    // Save the reports
    reportsObj.save(function () {
      // Try deleting reports
      request(app).delete('/api/reports/' + reportsObj._id)
        .expect(403)
        .end(function (reportsDeleteErr, reportsDeleteRes) {
          // Set message assertion
          (reportsDeleteRes.body.message).should.match('User is not authorized');

          // Handle reports error error
          done(reportsDeleteErr);
        });

    });
  });

  it('should be able to get a single reports that has an orphaned user reference', function (done) {
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

          // Save a new reports
          agent.post('/api/reports')
            .send(reports)
            .expect(200)
            .end(function (reportsSaveErr, reportsSaveRes) {
              // Handle reports save error
              if (reportsSaveErr) {
                return done(reportsSaveErr);
              }

              // Set assertions on new reports
              (reportsSaveRes.body.title).should.equal(reports.title);
              should.exist(reportsSaveRes.body.user);
              should.equal(reportsSaveRes.body.user._id, orphanId);

              // force the reports to have an orphaned user reference
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

                    // Get the reports
                    agent.get('/api/reports/' + reportsSaveRes.body._id)
                      .expect(200)
                      .end(function (reportsInfoErr, reportsInfoRes) {
                        // Handle reports error
                        if (reportsInfoErr) {
                          return done(reportsInfoErr);
                        }

                        // Set assertions
                        (reportsInfoRes.body._id).should.equal(reportsSaveRes.body._id);
                        (reportsInfoRes.body.title).should.equal(reports.title);
                        should.equal(reportsInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  it('should be able to get a single reports if signed in and verify the custom "isCurrentUserOwner" field is set to "true"', function (done) {
    // Create new reports model instance
    reports.user = user;
    var reportsObj = new Reports(reports);

    // Save the reports
    reportsObj.save(function () {
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

          // Save a new reports
          agent.post('/api/reports')
            .send(reports)
            .expect(200)
            .end(function (reportsSaveErr, reportsSaveRes) {
              // Handle reports save error
              if (reportsSaveErr) {
                return done(reportsSaveErr);
              }

              // Get the reports
              agent.get('/api/reports/' + reportsSaveRes.body._id)
                .expect(200)
                .end(function (reportsInfoErr, reportsInfoRes) {
                  // Handle reports error
                  if (reportsInfoErr) {
                    return done(reportsInfoErr);
                  }

                  // Set assertions
                  (reportsInfoRes.body._id).should.equal(reportsSaveRes.body._id);
                  (reportsInfoRes.body.title).should.equal(reports.title);

                  // Assert that the "isCurrentUserOwner" field is set to true since the current User created it
                  (reportsInfoRes.body.isCurrentUserOwner).should.equal(true);

                  // Call the assertion callback
                  done();
                });
            });
        });
    });
  });

  it('should be able to get a single reports if not signed in and verify the custom "isCurrentUserOwner" field is set to "false"', function (done) {
    // Create new reports model instance
    var reportsObj = new Reports(reports);

    // Save the reports
    reportsObj.save(function () {
      request(app).get('/api/reports/' + reportsObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('title', reports.title);
          // Assert the custom field "isCurrentUserOwner" is set to false for the un-authenticated User
          res.body.should.be.instanceof(Object).and.have.property('isCurrentUserOwner', false);
          // Call the assertion callback
          done();
        });
    });
  });

  it('should be able to get single reports, that a different user created, if logged in & verify the "isCurrentUserOwner" field is set to "false"', function (done) {
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

      // Sign in with the user that will create the Reports
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

          // Save a new reports
          agent.post('/api/reports')
            .send(reports)
            .expect(200)
            .end(function (reportsSaveErr, reportsSaveRes) {
              // Handle reports save error
              if (reportsSaveErr) {
                return done(reportsSaveErr);
              }

              // Set assertions on new reports
              (reportsSaveRes.body.title).should.equal(reports.title);
              should.exist(reportsSaveRes.body.user);
              should.equal(reportsSaveRes.body.user._id, userId);

              // now signin with the temporary user
              agent.post('/api/auth/signin')
                .send(_creds)
                .expect(200)
                .end(function (err, res) {
                  // Handle signin error
                  if (err) {
                    return done(err);
                  }

                  // Get the reports
                  agent.get('/api/reports/' + reportsSaveRes.body._id)
                    .expect(200)
                    .end(function (reportsInfoErr, reportsInfoRes) {
                      // Handle reports error
                      if (reportsInfoErr) {
                        return done(reportsInfoErr);
                      }

                      // Set assertions
                      (reportsInfoRes.body._id).should.equal(reportsSaveRes.body._id);
                      (reportsInfoRes.body.title).should.equal(reports.title);
                      // Assert that the custom field "isCurrentUserOwner" is set to false since the current User didn't create it
                      (reportsInfoRes.body.isCurrentUserOwner).should.equal(false);

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
      Reports.remove().exec(done);
    });
  });
});
