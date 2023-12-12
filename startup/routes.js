const express = require('express');
require('express-async-errors');
const cors = require('cors');
const item = require('../routes/item.route.js');
const error = require('../middlewares/error');

module.exports = (app) => {
  app.use(express.json());
  app.use(cors({ origin: true }));
  app.use('/item-service', item);
  app.use(error);
};
