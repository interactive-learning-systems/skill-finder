'use strict';

/**
 * Module dependencies
 */
var hiresPolicy = require('../policies/hires.server.policy'),
  hires = require('../controllers/hires.server.controller');

module.exports = function (app) {
  // Hires collection routes
  app.route('/api/hires').all(hiresPolicy.isAllowed)
    .get(hires.list)
    .post(hires.create);

  // Single hire routes
  app.route('/api/hires/:hireId').all(hiresPolicy.isAllowed)
    .get(hires.read)
    .put(hires.update)
    .delete(hires.delete);

  // Finish by binding the hire middleware
  app.param('hireId', hires.hireByID);
};
