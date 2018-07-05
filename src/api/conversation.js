import { domain } from './domain'
import Api from './api';

const create = (conversationAttrs, successCallback, errorCallback) => {
  const url = `${domain}/api/conversations`;
  const request =  {
    method: 'post',
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer: ${localStorage.getItem('jwt')}`
    },
    body: JSON.stringify({conversation: conversationAttrs})
  };
  return Api.fetchPromise(url, request, successCallback, errorCallback);
};

const show = (id, successCallback, errorCallback) => {
  const url = `${domain}/api/conversations/${id}`;
  const request =  {
    method: 'get',
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer: ${localStorage.getItem('jwt')}`
    }
  };
  return Api.fetchPromise(url, request, successCallback, errorCallback);
};

const Conversation = { create, show };
export default Conversation;
