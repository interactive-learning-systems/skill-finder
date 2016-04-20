(function (app) {
  'use strict';

  app.registerModule('generals', ['core']);// The core module is required for special route handling; see /core/client/config/core.client.routes
  app.registerModule('generals.services');
  app.registerModule('generals.routes', ['ui.router', 'ui.bootstrap', 'core.routes', 'generals.services']);
}(ApplicationConfiguration));
