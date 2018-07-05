const join = (socket, conversationId, newMessageCallback) => {
  let channel = socket.channel(`conversation:${conversationId}`, {})
  channel.join()
    .receive("ok", resp => { console.log("Joined successfully", resp) })
    .receive("error", resp => { console.log("Unable to join", resp) });

  channel.on("new_message", newMessageCallback);

  return channel;
};

const conversationChannel = { join };
export default conversationChannel;
