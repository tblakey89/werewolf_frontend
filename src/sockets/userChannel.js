const join = (socket, userId, newConversationCallback) => {
  let channel = socket.channel(`user:${userId}`, {})
  channel.join()
    .receive("ok", resp => { console.log("Joined successfully", resp) })
    .receive("error", resp => { console.log("Unable to join", resp) });

  channel.on("new_conversation", newConversationCallback);

  return channel;
};

const userChannel = { join };
export default userChannel;
