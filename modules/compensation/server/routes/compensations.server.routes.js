'use strict';

/**
 * Module dependencies
 */
var compensationsPolicy = require('../policies/compensations.server.policy'),
  compensations = require('../controllers/compensations.server.controller');

module.exports = function (app) {
  // Compensations collection routes
  app.route('/api/compensations').all(compensationsPolicy.isAllowed)
    .get(compensations.list)
    .post(compensations.create);

  // Single compensation routes
  app.route('/api/compensations/:compensationId').all(compensationsPolicy.isAllowed)
    .get(compensations.read)
    .put(compensations.update)
    .delete(compensations.delete);

  // Finish by binding the compensation middleware
  app.param('compensationId', compensations.compensationByID);
};
