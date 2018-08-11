const checkErrors = (name) => {
  switch (name) {
    case 'username':
      return usernameValidation;
    case 'email':
      return emailValidation;
    case 'password':
      return passwordValidation;
    default:
      return () => {return false};
  }
};

const checkUpdateErrors = (name) => {
  switch (name) {
    case 'password':
      return passwordUpdateValidation;
    default:
      return () => {return false};
  }
};

const usernameValidation = (username) => {
  if (username) {
    if (username.length < 4) return "Username too short. Minimum 4 characters.";
    if (username.length > 50) return "Username too long. Maximum 50 characters";
    return false;
  } else {
    return "Username is required."
  }
};

const emailValidation = (email) => {
  const regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email) {
    if (!email.match(regexp)) return "Email needs to be in a valid format.";
    return false;
  } else {
    return "Email is required."
  }
}

const passwordValidation = (password) => {
  if (password) {
    if (password.length < 8) return "Password too short. Minimum 8 characters.";
    if (password.length > 100) return "Password too long. Maximum 100 characters";
    return false;
  } else {
    return "Password is required."
  }
}

const passwordUpdateValidation = (password) => {
  if (password) {
    if (password.length < 8) return "Password too short. Minimum 8 characters.";
    if (password.length > 100) return "Password too long. Maximum 100 characters";
    return false;
  }
}

const UserValidation = { checkErrors, checkUpdateErrors };
export default UserValidation;
