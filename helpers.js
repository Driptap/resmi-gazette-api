import moment from 'moment';
import request from 'request';
import { RESMI_ARCHIVE, RESMI_DATE_FORMAT } from './constants';

/** Constructs url date string compatible with RESMI_GAZETTE */
const constructDate = date => moment(date).format(RESMI_DATE_FORMAT)
export const constructDateUrl = date =>
  `${RESMI_ARCHIVE}${constructDate(date)}.htm`;

/** Request promise wrapper */
export const getPromise = url => new Promise((res, rej) =>
    request(url, (err, response, body) =>
      err
        ? rej(err)
        : res(response, body)
    )
  );

