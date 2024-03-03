const PatternUtil = {
  // Method to check if a password has a length greater than 8 characters
  checkPasswordLength: (password) => {
    return password.length > 8;
  },

  // Method to check if the email has a valid pattern
  checkEmailPattern: (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  },

  // Method to check if a name consists of only alphabets
  checkAlphabeticName: (name) => {
    const alphabeticPattern = /^[a-zA-Z]+$/;
    return alphabeticPattern.test(name);
  },

  filterParametersFromObject: (object, params) => {
    const objectWithoutParams = Object.fromEntries(
      Object.entries(object).filter(([key]) => !params.includes(key))
    );
    return objectWithoutParams;
  },
};

export default PatternUtil;
