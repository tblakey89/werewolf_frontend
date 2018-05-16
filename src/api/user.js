import { domain } from './domain'

function create(userAttrs, successCallback, errorCallback) {
  const url = domain + '/api/users';
  const request =  {
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({user: userAttrs})
  };
  return fetchPromise(url, request, successCallback, errorCallback);
}

function forgotPassword(userAttrs, successCallback, errorCallback) {
  const url = domain + '/api/forgotten_password';
  const request = {
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({forgotten: userAttrs})
  };
  return fetchPromise(url, request, successCallback, errorCallback);
}

function newPassword(token, password, successCallback, errorCallback) {
  const url = domain + '/api/forgotten_password/' + token;
  const request = {
    method: 'put',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({password: {password: password}})
  };
  return fetchPromise(url, request, successCallback, errorCallback);
}

function fetchPromise(url, request, successCallback, errorCallback) {
  return fetch(url, request)
    .then(checkStatus)
    .then(parseJson)
    .then(successCallback)
    .catch((error) => { errorHandler(error, errorCallback) });
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.statusText;
    error.response = response;
    console.log(error);
    throw error;
  }
}

function parseJson(response) {
  return response.json();
}

function errorHandler(error, errorCallback) {
  if (error.response && error.response.status >= 500) {
    errorCallback(error);
  } else {
    parseJson(error.response).then(errorCallback);
  }
}

const User = { create, forgotPassword, newPassword };
export default User;
