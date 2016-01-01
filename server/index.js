'use strict';

const express = require('express');
const PouchDB = require('pouchdb');
const _ = require('lodash');

const app = require('./config')(express());

const database = new PouchDB('https://turingschool.cloudant.com/flavors');
const flavors = require('../data/ice-cream-flavors');

app.get('/', (request, response) => {
  response.render('index', {
    flavors: _.shuffle(flavors)
  });
});

app.get('/ratings', (request, response) => {
  database.allDocs({
    include_docs : true
  }).then(function (results) {
    response.send(results.rows.map(row => _.pick(row.doc, ['_id', 'flavorRatings'])));
  }).catch(function (error) {
    response.status(error.status).send(error);
  });
});

app.post('/ratings', (request, response) => {
  database
    .put({
      _id: request.body.username,
      flavorRatings: request.body.flavorRatings
    })
    .then(doc => response.send(doc))
    .catch(error => {
      if (error.status == 409) {
        return response.status(409).send('Shit. It looks like you already voted.');
      }
      response.status(error.status).send(error);
    });
});

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`);
  });
}

module.exports = app;
