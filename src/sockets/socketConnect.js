import { Socket } from 'phoenix';

const socketConnect = () => {
  let socket = new Socket("ws://www.wolfchat.app/socket", {
    params: {
      token: localStorage.getItem('jwt')
    }
  });
  socket.connect();
  return socket;
};

export default socketConnect;
