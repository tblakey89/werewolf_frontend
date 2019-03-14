import { domain } from './domain'
import Api from './api';

const show = (id, successCallback, errorCallback) => {
  const url = `${domain}/api/invitations/${id}`;
  const request =  {
    method: 'get',
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer: ${localStorage.getItem('jwt')}`
    }
  };
  return Api.fetchPromise(url, request, successCallback, errorCallback);
};

const create = (token, successCallback, errorCallback) => {
  const url = `${domain}/api/invitations`;
  const request =  {
    method: 'post',
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer: ${localStorage.getItem('jwt')}`
    },
    body: JSON.stringify({token: token})
  };
  return Api.fetchPromise(url, request, successCallback, errorCallback);
};

const update = (id, newState, successCallback, errorCallback) => {
  const url = `${domain}/api/invitations/${id}`;
  const request =  {
    method: 'put',
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer: ${localStorage.getItem('jwt')}`
    },
    body: JSON.stringify({users_game: {state: newState}})
  };
  return Api.fetchPromise(url, request, successCallback, errorCallback);
};

const Invitation = { show, create, update };
export default Invitation;
