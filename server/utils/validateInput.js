var validator = require('validator');

const validateInput = (fields) => {
  const errors = [];

 
  Object.keys(fields).forEach(field => {
    const value = fields[field];

    if (!value) {
      errors.push({ message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`, field, type: 'validation' });
    } else {
    
      if (field === 'email' && !validator.isEmail(value)) {
        errors.push({ message: 'Invalid email format', field, type: 'validation' });
      }
      if (field === 'password' && value.length < 6) {
        errors.push({ message: 'Password must be at least 6 characters long', field, type: 'validation' });
      }
    }
  });

  return errors;
};

module.exports = { validateInput };
