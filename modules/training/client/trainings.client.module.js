(function (app) {
  'use strict';

  app.registerModule('trainings', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('trainings.services');
  app.registerModule('trainings.routes', ['ui.router', 'core.routes', 'trainings.services']);
}(ApplicationConfiguration));
