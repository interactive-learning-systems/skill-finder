'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Question = mongoose.model('Question'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an Question
 */
exports.create = function (req, res) {
  console.log("CREATE QUESTION TEMPLATE ");
  var question = new Question(req.body);
  question.user = req.user;

  question.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(question);
    }
  });
};

/**
 * Show the current questionQuestion
 */
exports.read = function (req, res) {
  console.log("READ");
  // convert mongoose document to JSON
  var question = req.question ? req.question.toJSON() : {};

  // Add a custom field to the Question, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Question model.
  question.isCurrentUserOwner = !!(req.user && question.user && question.user._id.toString() === req.user._id.toString());

  res.json(question);
};

exports.update = function (req, res) {
  console.log("UPDATE");
  var i = req.body;

  Question.findByIdAndUpdate(i._id, { $set: i }, { new: true }, function (err, question) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(question);
    }
  });
};

/**
 * Delete an questionQuestion
 */
exports.delete = function (req, res) {
  console.log("DELETE");
  var question = req.question;

  question.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(question);
    }
  });
};

/**
 * List of Questions
 */
exports.list = function (req, res) {
  console.log("LIST");
  Question.find().sort('-created').populate('user', 'displayName').exec(function (err, question) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(question);
    }
  });
};

/**
 * Question middleware
 */
exports.questionByID = function (req, res, next, id) {
  console.log("questionByID");

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Question is invalid'
    });
  }

  Question.findById(id).populate('user', 'displayName').exec(function (err, question) {
    if (err) {
      return next(err);
    } else if (!question) {
      return res.status(404).send({
        message: 'No question with that identifier has been found'
      });
    }
    req.question = question;
    next();
  });
};
