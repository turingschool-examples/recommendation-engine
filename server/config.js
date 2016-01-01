'use strict';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

module.exports = app => {
  app.use(express.static(path.join(__dirname, 'static')));
  app.use(bodyParser.urlencoded({ extended: true }));

  app.set('view engine', 'jade');
  app.set('views', path.join(__dirname, '/views'));

  app.set('port', process.env.PORT || 3000);

  app.locals.title = 'Ice Cream Engine';

  return app;
};
