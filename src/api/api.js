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

const Api = { fetchPromise };
export default Api;
