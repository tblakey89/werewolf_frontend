function checkErrors(name, value) {
  if (value) {
    return false;
  } else {
    return name + ' is required.';
  }
}

const SessionValidation = { checkErrors };
export default SessionValidation;
