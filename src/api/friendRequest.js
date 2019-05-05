import { domain } from './domain'
import Api from './api';

const create = (user_id, successCallback, errorCallback) => {
  const url = `${domain}/api/friends`;
  const request =  {
    method: 'post',
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer: ${localStorage.getItem('jwt')}`
    },
    body: JSON.stringify({user_id: user_id})
  };
  return Api.fetchPromise(url, request, successCallback, errorCallback);
};

const update = (id, newState, successCallback, errorCallback) => {
  const url = `${domain}/api/friends/${id}`;
  const request =  {
    method: 'put',
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer: ${localStorage.getItem('jwt')}`
    },
    body: JSON.stringify({friend: {state: newState}})
  };
  return Api.fetchPromise(url, request, successCallback, errorCallback);
};

const FriendRequest = { create, update };
export default FriendRequest;
