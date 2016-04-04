(function (app) {
  'use strict';

  app.registerModule('compensations', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('compensations.services');
  app.registerModule('compensations.routes', ['ui.router', 'core.routes', 'compensations.services']);
}(ApplicationConfiguration));
