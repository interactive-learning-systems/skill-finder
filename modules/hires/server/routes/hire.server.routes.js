'use strict';

/**
* Module dependencies
*/
var hiresPolicy = require('../policies/hires.server.policy'),
  interviews = require('../controllers/interview.server.controller'),
  question = require('../controllers/question.server.controller');

module.exports = function (app) {
  app.route('/api/hires/interview').all(hiresPolicy.isAllowed)
  .get(interviews.list)
  .post(interviews.create);

  app.route('/api/hires/interview/:interviewId').all(hiresPolicy.isAllowed)
  .get(interviews.read)
  .put(interviews.update)
  .delete(interviews.delete);

  app.param('interview', interviews.interviewByID);

  app.route('/api/hires/question').all(hiresPolicy.isAllowed)
  .get(question.list)
  .post(question.create);

  app.route('/api/hires/question/:questionId').all(hiresPolicy.isAllowed)
  .get(question.read)
  .put(question.update)
  .delete(question.delete);

  app.param('question', question.questionByID);


};
