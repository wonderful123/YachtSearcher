'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'frontend',
    environment,
    rootURL: '/YachtSearcher/frontend/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  const GOOGLE_MAPS_API_KEY = "AIzaSyDFYf3cOeFMH_31m9t2Imm8-VdaEAti7uA";

  ENV['ember-google-maps'] = {
    key: GOOGLE_MAPS_API_KEY, // Using .env files in this example
    language: 'en',
    region: 'GB',
    protocol: 'https',
    version: '3.35',
    libraries: ['geometry', 'places'], // Optional libraries
    // client: undefined,
    // channel: undefined,
    // baseUrl: '//maps.googleapis.com/maps/api/js'
  };


  if (environment === 'development') {
    ENV['ember-simple-leaflet-maps'] = {
      apiKey: 'pk.eyJ1Ijoid29uZGVyMzIxIiwiYSI6ImNrMDV2ZWpmZjJ4djQzYmtpZXRsZDh4NnEifQ.EfODAyKAtLZS1eKwsQVeqA',
    }

    ENV['image_server'] = "http://108.161.143.35/YachtSearcher/scraper/data/images/"
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
