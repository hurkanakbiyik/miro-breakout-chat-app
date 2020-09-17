import axios from 'axios';
import { CHAT_API } from '../../../config';

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function parseJSON(response) {
  return response.data;
}

function getQueryString(params) {
  if (!params) { return ''; }
  const esc = encodeURIComponent;
  return `?${Object.keys(params)
    .filter(param => params[param] !== null && params[param] !== undefined)
    .map(param => `${esc(param)}=${esc(params[param])}`).join('&')}`;
}

function fetch(url, options = {}, token = '') {
  const newOptions = options;
  newOptions.headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  };
  const requestURL = `${CHAT_API}/${url}${getQueryString(options.qs)}`;
  return axios.get(requestURL, newOptions)
    .then(checkStatus)
    .then(parseJSON)
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.error(requestURL, e);
      return null;
    });
}

export default { fetch };
