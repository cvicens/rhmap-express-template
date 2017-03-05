'use strict';

var express = require('express')
  , mbaasApi = require('fh-mbaas-api')
  , mbaasExpress = mbaasApi.mbaasExpress()
  , app = module.exports = express()
  , counters = require('./lib/middleware/request-counter')
  , log = require('fh-bunyan').getLogger(__filename);

log.info('starting application');

// Note: the order which we add middleware to Express here is important!
app.use('/sys', mbaasExpress.sys([]));
app.use('/mbaas', mbaasExpress.mbaas);

// Note: important that this is added just before your own Routes
app.use(mbaasExpress.fhmiddleware());

// Add our request counting middleware before all other routes
app.use(counters.middleware);

// Bind our routes
log.info('binding routes');
require('./lib/routes/users')(app);
require('./lib/routes/hello')(app);
require('./lib/routes/error-example')(app);

// Expose our counters
app.use('/stats', counters.router);

// Dummy data
require('./lib/dummy/users')();

// Important that this is last!
app.use(mbaasExpress.errorHandler());

var port = process.env.FH_PORT || process.env.VCAP_APP_PORT || 8101;

app.listen(port, function() {
  log.info('app started on port: %s', port);
});
