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

  // Method to filter values pairs from an object
  filterParametersFromObject: (object, params) => {
    const objectWithoutParams = Object.fromEntries(
      Object.entries(object).filter(([key]) => !params.includes(key))
    );
    return objectWithoutParams;
  },

  // Method to generate a random string
  // Must be used with a DB check to ensure uniqueness
  generateUniqueId(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  },
};

export default PatternUtil;
