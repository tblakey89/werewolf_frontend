const checkErrors = (name) => {
  switch (name) {
    case 'name':
      return nameValidation;
    case 'user_ids':
      return userIdsValidation;
    default:
      return () => {return false};
  }
};

const nameValidation = (name) => {
  if (name) {
    if (name.length < 4) return "Name too short. Minimum 4 characters.";
    if (name.length > 50) return "Name too long. Maximum 50 characters";
    return false;
  } else {
    return "Name is required."
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

const GameValidation = { checkErrors };
export default GameValidation;
