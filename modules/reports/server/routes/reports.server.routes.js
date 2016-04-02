'use strict';

/**
 * Module dependencies
 */
var reportsPolicy = require('../policies/reports.server.policy'),
  reports = require('../controllers/reports.server.controller');

module.exports = function (app) {
  // Reports collection routes
  app.route('/api/reports').all(reportsPolicy.isAllowed)
    .get(reports.list)
    .post(reports.create);

  // Single reports routes
  app.route('/api/reports/:reportsId').all(reportsPolicy.isAllowed)
    .get(reports.read)
    .put(reports.update)
    .delete(reports.delete);

  // Finish by binding the reports middleware
  app.param('reportsId', reports.reportsByID);
};
