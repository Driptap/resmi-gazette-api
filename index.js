import fs from 'fs';
import express from 'express';
import request from 'request';
import cheerio from 'cheerio';

import moment from 'moment';

import { ERRORS } from './constants';
import scrape from './scraper';

const app = express();

let store = {};

const paginate = (req, store) => {
  let message = '';
  let storeKeys = Object.keys(store);
  let storeLength = storeKeys.length;
  let pages = storeLength / 10;

  /** Replaces 0 with 1 */
  let page = parseInt(req.query.page) ? req.query.page : 1;
  if (page > pages)
    throw new Error(ERRORS['PAGE_DOESNT_EXIST']);

  return {
    message,
    page,
    pages,
    data: storeKeys.slice(page*10-10, page*10).reduce((col, key) => ({
      ...col, [key]: store[key],
    }), {}),
  };
};

app.get('/api/v1/archive', (req, res) => {
  res.setHeader('Content-type', 'application/json');
  try {
    res.send(JSON.stringify(paginate(req, store)))
  } catch (err) {
    switch (err) {

    case ERRORS['PAGE_DOESNT_EXIST']:
      res.status(404).send(JSON.stringify(paginate(req, store)));
      break;

    default:
      res.status(500).send(JSON.stringify(paginate(req, store)));
      break;
    }
    pass;
  }
});

app.listen('8080');

/** Scrapes last twenty days */
const addToStore = (obj, store) => ({
  ...store,
  ...obj,
});

// [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
[3].forEach(day =>
  scrape(moment(Date.now()).subtract(day, 'days'))
    .then(day => store = addToStore(day, store))
)



