import { Socket } from 'phoenix';

const socketConnect = () => {
  let socket = new Socket("ws://localhost:4000/socket", {
    params: {
      token: localStorage.getItem('jwt')
    }
  });
  socket.connect();
  return socket;
};

export default socketConnect;
