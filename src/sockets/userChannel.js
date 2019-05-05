const join = (socket, userId, newConversationCallback, newGameCallback, updateGameCallback, updateGameStateCallback, updateUserCallback, leaveGameCallback, newFriendRequestCallback, friendRequestUpdatedCallback) => {
  let channel = socket.channel(`user:${userId}`, {})
  channel.join()
    .receive("ok", resp => { console.log("Joined successfully", resp) })
    .receive("error", resp => { console.log("Unable to join", resp) });

  channel.on("new_conversation", newConversationCallback);
  channel.on("new_game", newGameCallback);
  channel.on("game_update", updateGameCallback);
  channel.on("game_state_update", updateGameStateCallback);
  channel.on("new_avatar", updateUserCallback);
  channel.on("invitation_rejected", leaveGameCallback);
  channel.on("new_friend_request", newFriendRequestCallback);
  channel.on("friend_request_updated", friendRequestUpdatedCallback);

  return channel;
};

const userChannel = { join };
export default userChannel;
