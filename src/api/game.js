import { domain } from './domain'
import Api from './api';

const create = (gameAttrs, successCallback, errorCallback) => {
  const url = `${domain}/api/games`;
  const request =  {
    method: 'post',
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer: ${localStorage.getItem('jwt')}`
    },
    body: JSON.stringify({game: gameAttrs})
  };
  return Api.fetchPromise(url, request, successCallback, errorCallback);
};

const Game = { create };
export default Game;
