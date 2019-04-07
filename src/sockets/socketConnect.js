import { Socket } from 'phoenix';

const socketConnect = () => {
  let socket = new Socket(process.env.REACT_APP_SOCKET_ADDRESS, {
    params: {
      token: localStorage.getItem('jwt')
    }
  });
  socket.connect();
  return socket;
};

export default socketConnect;
