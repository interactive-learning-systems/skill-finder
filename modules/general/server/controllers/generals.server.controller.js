'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  General = mongoose.model('General'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an general
 */
exports.create = function (req, res) {
  var general = new General(req.body);
  general.user = req.user;

  general.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(general);
    }
  });
};

/**
 * Show the current general
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var general = req.general ? req.general.toJSON() : {};

  // Add a custom field to the General, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the General model.
  general.isCurrentUserOwner = !!(req.user && general.user && general.user._id.toString() === req.user._id.toString());

  res.json(general);
};

/**
 * Update an general
 */
exports.update = function (req, res) {
  var general = req.general;

  general.title = req.body.title;
  general.content = req.body.content;

  general.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(general);
    }
  });
};

/**
 * Delete an general
 */
exports.delete = function (req, res) {
  var general = req.general;

  general.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(general);
    }
  });
};

/**
 * List of Generals
 */
exports.list = function (req, res) {
  General.find().sort('-created').populate('user', 'displayName').exec(function (err, generals) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(generals);
    }
  });
};

/**
 * General middleware
 */
exports.generalByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'General is invalid'
    });
  }

  General.findById(id).populate('user', 'displayName').exec(function (err, general) {
    if (err) {
      return next(err);
    } else if (!general) {
      return res.status(404).send({
        message: 'No general with that identifier has been found'
      });
    }
    req.general = general;
    next();
  });
};
