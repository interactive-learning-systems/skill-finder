'use strict';

/**
 * Module dependencies
 */
var performancesPolicy = require('../policies/performances.server.policy'),
  performances = require('../controllers/performances.server.controller');

module.exports = function (app) {
  // Performances collection routes
  app.route('/api/performances').all(performancesPolicy.isAllowed)
    .get(performances.list)
    .post(performances.create);

  // Single performance routes
  app.route('/api/performances/:performanceId').all(performancesPolicy.isAllowed)
    .get(performances.read)
    .put(performances.update)
    .delete(performances.delete);

  // Finish by binding the performance middleware
  app.param('performanceId', performances.performanceByID);
};
