import { domain } from './domain'
import Api from './api';

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

const Invitation = { update };
export default Invitation;
