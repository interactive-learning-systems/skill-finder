'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Hire = mongoose.model('Hire'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an hire
 */
exports.create = function (req, res) {
  var hire = new Hire(req.body);
  hire.user = req.user;

  hire.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(hire);
    }
  });
};

/**
 * Show the current hire
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var hire = req.hire ? req.hire.toJSON() : {};

  // Add a custom field to the Hire, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Hire model.
  hire.isCurrentUserOwner = !!(req.user && hire.user && hire.user._id.toString() === req.user._id.toString());

  res.json(hire);
};

/**
 * Update an hire
 */
exports.update = function (req, res) {
  var hire = req.hire;

  hire.title = req.body.title;
  hire.content = req.body.content;

  hire.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(hire);
    }
  });
};

/**
 * Delete an hire
 */
exports.delete = function (req, res) {
  var hire = req.hire;

  hire.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(hire);
    }
  });
};

/**
 * List of Hires
 */
exports.list = function (req, res) {
  Hire.find().sort('-created').populate('user', 'displayName').exec(function (err, hires) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(hires);
    }
  });
};

/**
 * Hire middleware
 */
exports.hireByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Hire is invalid'
    });
  }

  Hire.findById(id).populate('user', 'displayName').exec(function (err, hire) {
    if (err) {
      return next(err);
    } else if (!hire) {
      return res.status(404).send({
        message: 'No hire with that identifier has been found'
      });
    }
    req.hire = hire;
    next();
  });
};
