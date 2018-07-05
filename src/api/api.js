const fetchPromise = (url, request, successCallback, errorCallback) => {
  return fetch(url, request)
    .then(checkStatus)
    .then(parseJson)
    .then(successCallback)
    .catch((error) => { errorHandler(error, errorCallback) });
};

const fetchPromiseAndLogin = (url, request, successCallback, errorCallback) => {
  return fetch(url, request)
    .then(checkStatus)
    .then(parseJson)
    .then(setToken)
    .then(successCallback)
    .catch((error) => { errorHandler(error, errorCallback) });
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.statusText;
    error.response = response;
    console.log(error);
    throw error;
  }
};

const parseJson = (response) => {
  return response.json();
};

const setToken = (response) => {
  localStorage.setItem('jwt', response.token);
  return response;
};

const errorHandler = (error, errorCallback) => {
  debugger;
  if (error.response && error.response.status >= 500) {
    errorCallback(error);
  } else {
    parseJson(error.response).then(errorCallback);
  }
};

const Api = { fetchPromise, fetchPromiseAndLogin };
export default Api;
