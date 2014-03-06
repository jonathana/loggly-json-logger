/**
 * Configurable loggly logger strictly for JSON and with a fixed concept
 * of environments
 *
 * @license MIT
 */
'use strict';

var loggly = require('loggly');

function EnvironmentLogger(options) {
  var baseLogger = loggly.createClient(options);
  var baseLogFunction = baseLogger.log;
  baseLogger.log = function environmentLog(msg, tags, callback) {
    var tagsWithEnvironment = [process.env.NODE_ENV || 'dev'];
    if (Array.isArray(tags)) {
      tagsWithEnvironment.push.apply(tagsWithEnvironment, tags);
    }
    else if (typeof tags !== 'function') {
      tagsWithEnvironment.push(tags);
    }
    baseLogFunction.call(baseLogger, msg, tagsWithEnvironment, callback);
  };
  return baseLogger;
}

var logger;

function defaultLogger() {
  if (!logger) { throw new Error("Singleton logger not instantiated yet.  Use createLogger(conf)"); }
  return logger;
}

function createLogger(token, subdomain){
  return new EnvironmentLogger({token: token, subdomain: subdomain});
}

function initLogger(token, subdomain) {
  if (!token && !subdomain) { return defaultLogger(); }
  if (logger) { throw new Error("Logger already instantiated"); }
  logger = createLogger(token, subdomain);
  return logger;
}

initLogger.createLogger = createLogger;

module.exports = initLogger;
