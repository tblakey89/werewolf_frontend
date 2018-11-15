const join = (socket, gameId, newMessageCallback) => {
  let channel = socket.channel(`game:${gameId}`, {})
  channel.join()
    .receive("ok", resp => { console.log("Joined successfully", resp) })
    .receive("error", resp => { console.log("Unable to join", resp) });

  channel.on("new_message", newMessageCallback);

  return channel;
};

const gameChannel = { join };
export default gameChannel;
