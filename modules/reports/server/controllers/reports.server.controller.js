'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Reports = mongoose.model('Reports'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Create an reports
 */
exports.create = function (req, res) {
  var reports = new Reports(req.body);
  reports.user = req.user;

  reports.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(reports);
    }
  });
};

/**
 * Show the current reports
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var reports = req.reports ? req.reports.toJSON() : {};

  // Add a custom field to the Reports, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Reports model.
  reports.isCurrentUserOwner = !!(req.user && reports.user && reports.user._id.toString() === req.user._id.toString());

  res.json(reports);
};

/**
 * Update an reports
 */
exports.update = function (req, res) {
  var reports = req.reports;

  reports.title = req.body.title;
  reports.content = req.body.content;

  reports.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(reports);
    }
  });
};

/**
 * Delete an reports
 */
exports.delete = function (req, res) {
  var reports = req.reports;

  reports.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(reports);
    }
  });
};

/**
 * List of Reports
 */
exports.list = function (req, res) {
  Reports.find().sort('-created').populate('user', 'displayName').exec(function (err, reports) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(reports);
    }
  });
};

/**
 * Reports middleware
 */
exports.reportsByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Reports is invalid'
    });
  }

  Reports.findById(id).populate('user', 'displayName').exec(function (err, reports) {
    if (err) {
      return next(err);
    } else if (!reports) {
      return res.status(404).send({
        message: 'No reports with that identifier has been found'
      });
    }
    req.reports = reports;
    next();
  });
};
