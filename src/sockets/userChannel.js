const join = (socket, userId, newConversationCallback, newGameCallback) => {
  let channel = socket.channel(`user:${userId}`, {})
  channel.join()
    .receive("ok", resp => { console.log("Joined successfully", resp) })
    .receive("error", resp => { console.log("Unable to join", resp) });

  channel.on("new_conversation", newConversationCallback);
  channel.on("new_game", newGameCallback);

  return channel;
};

const userChannel = { join };
export default userChannel;
