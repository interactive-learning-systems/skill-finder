(function (app) {
  'use strict';

  app.registerModule('hires', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('hires.services');
  app.registerModule('hires.routes', ['ui.router', 'core.routes', 'hires.services']);
}(ApplicationConfiguration));
