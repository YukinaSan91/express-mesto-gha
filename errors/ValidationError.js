const { VALIDATION_ERROR } = require('../utils/constants');

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = VALIDATION_ERROR;
  }
}

module.exports = ValidationError;
