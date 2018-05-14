import { domain } from './domain'

function create(userAttrs, successCallback, errorCallback) {
  const url = domain + '/api/users';
  return fetch(url, {
    method: 'post',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({user: userAttrs})
  }).then(checkStatus)
    .then(parseJson)
    .then(successCallback)
    .catch((error) => {
      if (error.response.status >= 500) {
        errorCallback(error);
      } else {
        parseJson(error.response).then(errorCallback);
      }
    });
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

const User = { create };
export default User;
