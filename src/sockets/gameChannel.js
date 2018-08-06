const join = (socket, gameId, updateGameCallback) => {
  let channel = socket.channel(`game:${gameId}`, {})
  channel.join()
    .receive("ok", resp => { console.log("Joined successfully", resp) })
    .receive("error", resp => { console.log("Unable to join", resp) });

  channel.on("game_update", updateGameCallback);

  return channel;
};

const gameChannel = { join };
export default gameChannel;
