'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  HireInterviewQuestion = mongoose.model('HireInterviewQuestion'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an HireInterviewQuestion
 */
exports.create = function (req, res) {
  var hireInterviewQuestion = new HireInterviewQuestion(req.body);
  hireInterviewQuestion.user = req.user;

  HireInterviewQuestion.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(hireInterviewQuestion);
    }
  });
};

/**
 * Show the current hireInterviewQuestion
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var hireInterviewQuestion = req.hireInterviewQuestion ? req.hireInterviewQuestion.toJSON() : {};

  // Add a custom field to the HireInterviewQuestion, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the HireInterviewQuestion model.
  hireInterviewQuestion.isCurrentUserOwner = !!(req.user && hireInterviewQuestion.user && hireInterviewQuestion.user._id.toString() === req.user._id.toString());

  res.json(hireInterviewQuestion);
};

/**
 * Update an hireInterviewQuestion
 */
exports.update = function (req, res) {
  var hireInterviewQuestion = req.hireInterviewQuestion;

  hireInterviewQuestion.question = req.body.title;
  hireInterviewQuestion.content = req.body.content;

  hireInterviewQuestion.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(hireInterviewQuestion);
    }
  });
};

/**
 * Delete an hireInterviewQuestion
 */
exports.delete = function (req, res) {
  var hireInterviewQuestion = req.hireInterviewQuestion;

  hireInterviewQuestion.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(hireInterviewQuestion);
    }
  });
};

/**
 * List of HireInterviewQuestions
 */
exports.list = function (req, res) {
  HireInterviewQuestion.find().sort('-created').populate('user', 'displayName').exec(function (err, hireInterviewQuestions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(hireInterviewQuestions);
    }
  });
};

/**
 * HireInterviewQuestion middleware
 */
exports.hireByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'HireInterviewQuestion is invalid'
    });
  }

  HireInterviewQuestion.findById(id).populate('user', 'displayName').exec(function (err, hireInterviewQuestion) {
    if (err) {
      return next(err);
    } else if (!hireInterviewQuestion) {
      return res.status(404).send({
        message: 'No hireInterviewQuestion with that identifier has been found'
      });
    }
    req.hireInterviewQuestion = hireInterviewQuestion;
    next();
  });
};
