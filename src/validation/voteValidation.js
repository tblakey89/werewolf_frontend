const checkErrors = (name, value) => {
  if (value) {
    return false;
  } else {
    return 'You must vote for a player.';
  }
};

const VoteValidation = { checkErrors };
export default VoteValidation;
