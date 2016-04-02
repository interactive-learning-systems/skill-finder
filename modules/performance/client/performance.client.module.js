(function (app) {
  'use strict';

  app.registerModule('performances', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('performances.services');
  app.registerModule('performances.routes', ['ui.router', 'core.routes', 'performances.services']);
}(ApplicationConfiguration));
