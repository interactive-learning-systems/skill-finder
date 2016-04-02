'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Compensation = mongoose.model('Compensation'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an compensation
 */
exports.create = function (req, res) {
  var compensation = new Compensation(req.body);
  compensation.user = req.user;

  compensation.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(compensation);
    }
  });
};

/**
 * Show the current compensation
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var compensation = req.compensation ? req.compensation.toJSON() : {};

  // Add a custom field to the Compensation, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Compensation model.
  compensation.isCurrentUserOwner = !!(req.user && compensation.user && compensation.user._id.toString() === req.user._id.toString());

  res.json(compensation);
};

/**
 * Update an compensation
 */
exports.update = function (req, res) {
  var compensation = req.compensation;

  compensation.title = req.body.title;
  compensation.content = req.body.content;

  compensation.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(compensation);
    }
  });
};

/**
 * Delete an compensation
 */
exports.delete = function (req, res) {
  var compensation = req.compensation;

  compensation.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(compensation);
    }
  });
};

/**
 * List of Compensations
 */
exports.list = function (req, res) {
  Compensation.find().sort('-created').populate('user', 'displayName').exec(function (err, compensations) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(compensations);
    }
  });
};

/**
 * Compensation middleware
 */
exports.compensationByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Compensation is invalid'
    });
  }

  Compensation.findById(id).populate('user', 'displayName').exec(function (err, compensation) {
    if (err) {
      return next(err);
    } else if (!compensation) {
      return res.status(404).send({
        message: 'No compensation with that identifier has been found'
      });
    }
    req.compensation = compensation;
    next();
  });
};
