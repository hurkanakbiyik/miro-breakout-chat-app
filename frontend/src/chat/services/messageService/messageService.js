import RequestService from '../requestService';

const BASE = 'messages';

function fetch(params) {
  return RequestService.fetch(BASE, {qs : params});
}
export default {
  fetch,
};
