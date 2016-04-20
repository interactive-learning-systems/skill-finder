'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Hires Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/hires/interview',
      permissions: '*'
    }, {
      resources: '/api/hires/interview/:interviewId',
      permissions: '*'
    }, {
      resources: '/api/hires/question',
      permissions: '*'
    }, {
      resources: '/api/hires/question/:questionId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/hires/interview',
      permissions: ['get', 'post']
    }, {
      resources: '/api/hires/interview/:interviewId',
      permissions: ['get']
    }, {
      resources: '/api/hires/question',
      permissions: '*'
    }, {
      resources: '/api/hires/question/:questionId',
      permissions: '*'
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/hires/interview',
      permissions: ['get']
    }, {
      resources: '/api/hires/interview/:interviewId',
      permissions: ['get']
    }, {
      resources: '/api/hires/question',
      permissions: '*'
    }, {
      resources: '/api/hires/question/:questionId',
      permissions: '*'
    }]
  }]);
};

/**
 * Check If Hires Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  return next();
};
/*
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an hire is being processed and the current user created it then allow any manipulation
  if (req.interview && req.user && req.interview.user && req.interview.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
*/
