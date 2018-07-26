module.exports = {
  // define app mode
  MODE_SINGLE: 'single',
  MODE_MULTIPLE: 'multiple',

  // ready timeout, 120s
  READY_TIMEOUT: 120000,

  // default request method
  DEFAULT_METHODS: ['GET'],

  // forbidden assign config properties
  FORBIDDEN_ASSIGN_PROPERTIES: [
    'routes',
    'middleware',
    'bootstraps',
    'readyTimeout',
    'logger',
    'plugin',
    'schedule',
    'swagger',
    'siteFile',
    'static',
    'bodyParser',
    'notFound',
    'error',
    'output'
  ],

  OUTPUT_JSON_FIELDS: {
    code: 'code',
    data: 'data',
    msg: 'msg',
    details: 'details'
  }
}
