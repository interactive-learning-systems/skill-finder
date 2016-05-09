'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Interview = mongoose.model('Interview'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an Interview
 */
exports.create = function (req, res) {
  console.log("CREATE INTERVIEW");
  var interview = new Interview(req.body);
  interview.user = req.user;
  // TMW - I'm not sure why but an empty question is created by the Mongoose constructor.  Let's remove that...
  // TMW - Unless questions are passed in:()
  // interview.questions = [];

  interview.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(interview);
    }
  });
};

/**
 * Show the current interviewQuestion
 */
exports.read = function (req, res) {
  console.log("READ");
  // convert mongoose document to JSON
  var interview = req.interview ? req.interview.toJSON() : {};

  // Add a custom field to the Interview, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Interview model.
  interview.isCurrentUserOwner = !!(req.user && interview.user && interview.user._id.toString() === req.user._id.toString());

  res.json(interview);
};

exports.update = function (req, res) {
  console.log("UPDATE");
  var i = req.body;
  console.log(JSON.stringify(i));

  Interview.findByIdAndUpdate(i._id, { $set: i }, { new: true }, function (err, interview) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(interview);
    }
  });
};

/**
 * Delete an interviewQuestion
 */
exports.delete = function (req, res) {
  console.log("DELETE");
  var interview = req.interview;

  interview.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(interview);
    }
  });
};

/**
 * List of Interviews
 */
exports.list = function (req, res) {
  console.log("LIST");
  Interview.find().sort('-created').populate('user', 'displayName').exec(function (err, interview) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(interview);
    }
  });
};

/**
 * Interview middleware
 */
exports.interviewByID = function (req, res, next, id) {
  console.log("interviewByID");

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Interview is invalid'
    });
  }

  Interview.findById(id).populate('user', 'displayName').exec(function (err, interview) {
    if (err) {
      return next(err);
    } else if (!interview) {
      return res.status(404).send({
        message: 'No interview with that identifier has been found'
      });
    }
    req.interview = interview;
    next();
  });
};
