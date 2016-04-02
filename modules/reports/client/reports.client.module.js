(function (app) {
  'use strict';

  app.registerModule('reports', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('reports.services');
  app.registerModule('reports.routes', ['ui.router', 'core.routes', 'reports.services']);
}(ApplicationConfiguration));
