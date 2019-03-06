import { domain } from './domain'
import Api from './api';

const create = (userAttrs, successCallback, errorCallback) => {
  const url = `${domain}/api/users`;
  const request =  {
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({user: userAttrs})
  };
  return Api.fetchPromise(url, request, successCallback, errorCallback);
};

const index = (successCallback, errorCallback) => {
  const url = `${domain}/api/users`;
  const request =  {
    method: 'get',
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer: ${localStorage.getItem('jwt')}`
    }
  };
  return Api.fetchPromise(url, request, successCallback, errorCallback);
};

const update = (id, userAttrs, successCallback, errorCallback) => {
  const url = `${domain}/api/users/${id}`;
  const request =  {
    method: 'put',
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer: ${localStorage.getItem('jwt')}`
    },
    body: JSON.stringify({user: userAttrs})
  };
  return Api.fetchPromise(url, request, successCallback, errorCallback);
};

const me = (successCallback, errorCallback) => {
  const url = `${domain}/api/me`;
  const request =  {
    method: 'get',
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer: ${localStorage.getItem('jwt')}`
    }
  };
  return Api.fetchPromise(url, request, successCallback, errorCallback);
};

const forgotPassword = (userAttrs, successCallback, errorCallback) => {
  const url = `${domain}/api/forgotten_password`;
  const request = {
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({forgotten: userAttrs})
  };
  return Api.fetchPromise(url, request, successCallback, errorCallback);
};

const newPassword = (token, password, successCallback, errorCallback) => {
  const url = `${domain}/api/forgotten_password/${token}`;
  const request = {
    method: 'put',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({password: {password: password}})
  };
  return Api.fetchPromise(url, request, successCallback, errorCallback);
};

const avatar = (id, file, successCallback, errorCallback) => {
  const url = `${domain}/api/users/${id}/avatar`;
  const formData = new FormData();
  formData.append('user[avatar]', file);
  const request =  {
    method: 'put',
    headers: {
      'Authorization': `Bearer: ${localStorage.getItem('jwt')}`
    },
    body: formData,
  };
  return Api.fetchPromise(url, request, successCallback, errorCallback);
};

const User = { create, index, update, me, forgotPassword, newPassword, avatar };
export default User;
