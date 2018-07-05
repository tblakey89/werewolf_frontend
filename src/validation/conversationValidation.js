const checkErrors = (name) => {
  switch (name) {
    case 'user_ids':
      return userIdsValidation;
    default:
      return () => {return false};
  }
};

const userIdsValidation = (userIds) => {
  if (userIds) {
    if (userIds.length === 0) return "Users must be selected for the conversation.";
    return false;
  } else {
    return "Users must be selected for the conversation."
  }
};

const ConversationValidation = { checkErrors };
export default ConversationValidation;
