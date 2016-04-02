'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Performance = mongoose.model('Performance'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an performance
 */
exports.create = function (req, res) {
  var performance = new Performance(req.body);
  performance.user = req.user;

  performance.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(performance);
    }
  });
};

/**
 * Show the current performance
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var performance = req.performance ? req.performance.toJSON() : {};

  // Add a custom field to the Performance, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Performance model.
  performance.isCurrentUserOwner = !!(req.user && performance.user && performance.user._id.toString() === req.user._id.toString());

  res.json(performance);
};

/**
 * Update an performance
 */
exports.update = function (req, res) {
  var performance = req.performance;

  performance.title = req.body.title;
  performance.content = req.body.content;

  performance.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(performance);
    }
  });
};

/**
 * Delete an performance
 */
exports.delete = function (req, res) {
  var performance = req.performance;

  performance.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(performance);
    }
  });
};

/**
 * List of Performances
 */
exports.list = function (req, res) {
  Performance.find().sort('-created').populate('user', 'displayName').exec(function (err, performances) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(performances);
    }
  });
};

/**
 * Performance middleware
 */
exports.performanceByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Performance is invalid'
    });
  }

  Performance.findById(id).populate('user', 'displayName').exec(function (err, performance) {
    if (err) {
      return next(err);
    } else if (!performance) {
      return res.status(404).send({
        message: 'No performance with that identifier has been found'
      });
    }
    req.performance = performance;
    next();
  });
};
