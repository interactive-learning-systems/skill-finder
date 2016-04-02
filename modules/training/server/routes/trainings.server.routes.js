'use strict';

/**
 * Module dependencies
 */
var trainingsPolicy = require('../policies/trainings.server.policy'),
  trainings = require('../controllers/trainings.server.controller');

module.exports = function (app) {
  // Trainings collection routes
  app.route('/api/trainings').all(trainingsPolicy.isAllowed)
    .get(trainings.list)
    .post(trainings.create);

  // Single training routes
  app.route('/api/trainings/:trainingId').all(trainingsPolicy.isAllowed)
    .get(trainings.read)
    .put(trainings.update)
    .delete(trainings.delete);

  // Finish by binding the training middleware
  app.param('trainingId', trainings.trainingByID);
};
