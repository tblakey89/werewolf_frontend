import { domain } from './domain'
import Api from './api';

const create = (sessionAttrs, successCallback, errorCallback) => {
  const url = `${domain}/api/sessions`;
  const request =  {
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({session: sessionAttrs})
  };
  return Api.fetchPromiseAndLogin(url, request, successCallback, errorCallback);
}

const Session = { create };
export default Session;
